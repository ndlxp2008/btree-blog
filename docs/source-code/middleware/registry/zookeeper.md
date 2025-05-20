# Zookeeper 源码分析

## 1. 引言

Apache ZooKeeper 是一个为分布式应用程序提供高性能协调服务的开源项目。它提供了一系列简单的原语，分布式应用程序可以基于这些原语构建更高级别的服务，如同步、配置维护、组和命名。ZooKeeper 的设计目标是易于编程、高性能和高可靠性。其源码主要使用 Java 编写。

---

## 2. 核心架构

ZooKeeper 集群通常由一组服务器（称为 Ensemble）组成，其中一台是 Leader，其余是 Follower（或 Observer）。
- **Leader**: 处理所有写请求（事务请求），并将状态变更广播给 Follower/Observer。负责协调事务的顺序。
- **Follower**: 接收并处理客户端的读请求。接收 Leader 的状态变更提议（Proposal），参与投票，并将写请求转发给 Leader。
- **Observer (可选)**: 类似于 Follower，处理读请求，接收状态变更，但不参与 Leader 选举和事务提交的投票。用于扩展读性能而不影响写性能。
- **Client**: 连接到 ZooKeeper 服务器，发送读写请求，维护会话。

**数据一致性**: ZooKeeper 使用 ZAB (ZooKeeper Atomic Broadcast) 协议保证副本之间的数据一致性。

---

## 3. 数据模型 (ZNode)

ZooKeeper 提供了一个类似于文件系统的树形命名空间。树中的每个节点称为 **ZNode**。
- **路径**: ZNode 通过唯一的路径标识，如 `/app/config`。
- **数据**: 每个 ZNode 可以存储少量数据（通常不超过 1MB）。
- **版本号**: 每个 ZNode 维护三个版本号：
    - `version`: 节点数据的版本号。
    - `cversion`: 子节点的版本号。
    - `aversion`: 节点 ACL 的版本号。
    每次数据或 ACL 变更时，相应版本号递增。这用于实现乐观锁。
- **节点类型**:
    - **持久节点 (Persistent)**: 默认类型，节点创建后一直存在，除非显式删除。
    - **临时节点 (Ephemeral)**: 节点的生命周期与创建它的客户端会话绑定。会话结束或超时，节点自动删除。不能有子节点。
    - **顺序节点 (Sequential)**: 创建时，ZooKeeper 会在节点路径后附加一个单调递增的序号。例如 `/lock/node-0000000001`。
    - **持久顺序节点 / 临时顺序节点**: 上述类型的组合。
- **Watcher**: 客户端可以对 ZNode 设置 Watcher。当 ZNode 发生特定变化（数据改变、子节点改变、节点删除）时，客户端会收到一次性的通知。

---

## 4. 会话 (Session)

- 客户端连接到 ZooKeeper 服务器时会建立一个会话。
- 每个会话有一个唯一的 Session ID。
- 会话有超时时间 (`sessionTimeout`)。客户端需要定期向服务器发送心跳（ping 请求）来维持会话。
- 如果服务器在超时时间内未收到客户端心跳，则认为会话过期，与该会话关联的临时节点将被删除。
- 会话可以在集群中的不同服务器之间迁移。

---

## 5. ZAB 协议 (ZooKeeper Atomic Broadcast)

ZAB 是 ZooKeeper 保证数据一致性的核心。它包含两个主要阶段：
- **Leader 选举 (Leader Election)**: 当集群启动或 Leader 宕机时，进入选举阶段，选出新的 Leader。常用算法是 FastLeaderElection (基于 Paxos 的变种)。
    - 服务器互相发送投票（包含自己的 `zxid` 和 `myid`）。
    - 选择具有最大 `zxid` (事务 ID) 的服务器作为 Leader。如果 `zxid` 相同，则选择 `myid` (服务器 ID) 最大的。
    - 获得超过半数服务器支持的服务器成为 Leader。
- **原子广播 (Atomic Broadcast)**: Leader 选举完成后，进入该阶段。
    - 所有写请求由 Leader 处理。
    - Leader 将写请求生成一个 Proposal (提案)，并赋予全局单调递增的事务 ID (`zxid`)。
    - Leader 将 Proposal 发送给所有 Follower。
    - Follower 接收到 Proposal 后，将其持久化（写入事务日志），并向 Leader 发送 ACK。
    - Leader 收到超过半数 Follower 的 ACK 后，向所有 Follower 发送 COMMIT 消息。
    - Follower 收到 COMMIT 后，将该事务应用到内存数据库。
    - Leader 将 COMMIT 应用到内存数据库，并向客户端发送响应。
    ZAB 协议保证了事务的全局有序性和最终一致性。

---

## 6. Watcher 机制实现

- 客户端在读操作（如 `getData`, `getChildren`, `exists`）时可以注册 Watcher。
- 服务器端的 `DataTree` (内存数据树) 维护了 ZNode 路径到 Watcher 列表的映射。
    - `DataTree.dataWatches`: 监控节点数据变化的 Watcher。
    - `DataTree.childWatches`: 监控子节点列表变化的 Watcher。
- 当发生写操作（创建/删除节点、更新数据）时，在应用事务到 `DataTree` 后，会触发相应的 Watcher。
- 触发过程 (`ZKDatabase.processTxn`) 会查找与变更路径相关的 Watcher 集合。
- 服务器将通知发送给对应的客户端连接 (`ServerCnxn`)。
- Watcher 是一次性的，触发后即失效，需要重新注册。

---

## 7. 源码结构与关键类

ZooKeeper 源码主要在 `zookeeper-server` 模块中：
- **`org.apache.zookeeper.server`**: 服务器端核心逻辑。
    - `ZooKeeperServer.java`: ZooKeeper 服务器主类，处理请求，管理会话和数据。
    - `ZKDatabase.java`: 内存数据库，包含 `DataTree` 和事务日志管理 (`FileTxnLog`)。
    - `DataTree.java`: 内存中的 ZNode 树结构及其操作。
    - `RequestProcessor.java` (接口): 定义了请求处理链的接口。ZooKeeper 使用责任链模式处理请求。
        - `PrepRequestProcessor`: 预处理请求，如权限检查、序列化。
        - `SyncRequestProcessor`: 将事务写入日志。
        - `FinalRequestProcessor`: 将变更应用到 `DataTree`，触发 Watcher。
        - (Leader 端还有 `ProposalRequestProcessor`, `CommitProcessor` 等用于 ZAB 协议)
    - `ServerCnxn.java` (及其子类如 `NIOServerCnxn`): 处理客户端连接和网络 IO。
    - `SessionTrackerImpl.java`: 会话管理器。
- **`org.apache.zookeeper.server.quorum`**: 集群模式相关代码。
    - `QuorumPeer.java`: 代表集群中的一个节点（Peer）。
    - `Leader.java`: Leader 角色的逻辑。
    - `Follower.java`: Follower 角色的逻辑。
    - `Observer.java`: Observer 角色的逻辑。
    - `LeaderElection.java` / `FastLeaderElection.java`: Leader 选举实现。
    - `QuorumPacket.java`: ZAB 协议中节点间通信的数据包。
- **`org.apache.zookeeper.server.persistence`**: 持久化相关。
    - `FileTxnLog.java`: 事务日志实现。
    - `FileSnap.java`: 快照（Snapshot）实现。ZooKeeper 定期将内存数据快照持久化，用于快速恢复和截断事务日志。
- **`org.apache.zookeeper.txn`**: 事务相关的类定义。
- **`org.apache.zookeeper`**: 客户端 API 和 Watcher 接口。

---

## 8. 总结

ZooKeeper 通过简洁的数据模型（ZNode）、可靠的会话机制、核心的 ZAB 协议以及高效的 Watcher 通知，为分布式系统提供了强大的协调能力。其源码设计采用了经典的 Reactor 网络模型、责任链请求处理模式，并通过 Leader-Follower 架构和 ZAB 协议保证了高可用和数据一致性。理解其源码有助于深入掌握分布式协调的原理和实践。
