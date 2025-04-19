# Redis 核心概念

Redis（Remote Dictionary Server）是一个开源的、基于内存的数据结构存储系统，可用作数据库、缓存和消息中间件。本文介绍Redis的核心概念和使用方法。

## Redis 简介

Redis 的主要特点包括：

- **内存存储**：所有数据都保存在内存中，实现超高速读写
- **多种数据结构**：支持字符串、哈希、列表、集合、有序集合等
- **持久化**：支持数据的持久化存储
- **高可用性**：通过主从复制和哨兵模式保证服务可用性
- **原子操作**：所有操作都是原子性的，支持事务
- **支持发布/订阅**：内置发布/订阅功能
- **Lua脚本**：支持Lua脚本执行复杂操作

## 安装与配置

### 安装 Redis

#### 在 Linux (Ubuntu) 上安装

```bash
sudo apt update
sudo apt install redis-server

# 启动 Redis 服务
sudo systemctl start redis-server

# 设置开机启动
sudo systemctl enable redis-server
```

#### 在 macOS 上安装 (使用 Homebrew)

```bash
brew install redis

# 启动 Redis 服务
brew services start redis
```

#### 在 Windows 上安装

Windows 不是 Redis 的官方支持平台，但有以下选择：

1. 使用 WSL (Windows Subsystem for Linux)
2. 使用非官方的 Windows 版本：https://github.com/tporadowski/redis/releases
3. 使用 Docker 容器运行 Redis

#### 使用 Docker 安装

```bash
# 拉取 Redis 镜像
docker pull redis

# 运行 Redis 容器
docker run --name my-redis -d -p 6379:6379 redis
```

### 基本配置

Redis 的主要配置文件是 redis.conf。以下是一些重要的配置选项：

```
# 绑定地址
bind 127.0.0.1

# 端口
port 6379

# 密码保护
requirepass yourpassword

# 最大内存使用
maxmemory 2gb

# 内存策略（当达到最大内存时）
maxmemory-policy allkeys-lru

# 持久化配置
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec

# 数据库数量
databases 16

# 连接数限制
maxclients 10000
```

## 数据类型与命令

Redis 支持多种数据类型，每种类型都有专门的命令集。

### 连接 Redis

使用 Redis 命令行客户端 (redis-cli) 连接到 Redis 服务器：

```bash
# 连接本地 Redis
redis-cli

# 连接远程 Redis
redis-cli -h hostname -p port -a password
```

### 字符串 (String)

字符串是 Redis 最基本的数据类型，可以存储文本或二进制数据。

```bash
# 设置字符串值
SET key value
SET user:1:name "John Doe"

# 获取字符串值
GET key
GET user:1:name

# 设置带过期时间的值（秒）
SETEX key seconds value
SETEX session:token 3600 "abc123"

# 设置带过期时间的值（毫秒）
PSETEX key milliseconds value

# 同时设置多个键值
MSET key1 value1 key2 value2
MSET user:1:name "John" user:1:email "john@example.com"

# 同时获取多个值
MGET key1 key2
MGET user:1:name user:1:email

# 递增数值
INCR counter
INCRBY counter increment
INCRBYFLOAT counter increment

# 递减数值
DECR counter
DECRBY counter decrement

# 追加到字符串
APPEND key value

# 获取子字符串
GETRANGE key start end

# 设置子字符串
SETRANGE key offset value

# 获取值长度
STRLEN key
```

### 哈希 (Hash)

哈希是字段值对的集合，适合表示对象。

```bash
# 设置哈希字段
HSET key field value
HSET user:1 name "John" age 30 city "New York"

# 获取哈希字段
HGET key field
HGET user:1 name

# 获取所有字段和值
HGETALL key
HGETALL user:1

# 检查字段是否存在
HEXISTS key field
HEXISTS user:1 email

# 获取所有字段名
HKEYS key
HKEYS user:1

# 获取所有字段值
HVALS key
HVALS user:1

# 增加数字字段值
HINCRBY key field increment
HINCRBY user:1 visits 1

# 增加浮点数字段值
HINCRBYFLOAT key field increment
HINCRBYFLOAT user:1 score 0.5

# 删除字段
HDEL key field [field ...]
HDEL user:1 temp_field

# 获取字段数量
HLEN key
HLEN user:1
```

### 列表 (List)

列表是字符串的有序集合，支持从两端添加和移除元素。

```bash
# 从列表左端添加元素
LPUSH key value [value ...]
LPUSH notifications "New message" "System update"

# 从列表右端添加元素
RPUSH key value [value ...]
RPUSH queue "task1" "task2" "task3"

# 获取列表片段
LRANGE key start stop
LRANGE queue 0 -1  # 获取所有元素

# 修剪列表
LTRIM key start stop
LTRIM recent_items 0 9  # 只保留前10个元素

# 获取列表长度
LLEN key
LLEN queue

# 从左端弹出元素
LPOP key
LPOP queue

# 从右端弹出元素
RPOP key
RPOP queue

# 根据索引获取元素
LINDEX key index
LINDEX queue 0

# 在指定位置插入元素
LINSERT key BEFORE|AFTER pivot value
LINSERT queue BEFORE "task2" "urgent_task"

# 设置指定位置的元素值
LSET key index value
LSET queue 1 "modified_task"

# 删除指定的元素
LREM key count value
LREM queue 0 "completed_task"

# 阻塞式弹出（当列表为空时等待）
BLPOP key [key ...] timeout
BRPOP key [key ...] timeout
```

### 集合 (Set)

集合是唯一字符串的无序集合。

```bash
# 添加元素到集合
SADD key member [member ...]
SADD tags "redis" "database" "nosql"

# 获取集合所有成员
SMEMBERS key
SMEMBERS tags

# 判断元素是否在集合中
SISMEMBER key member
SISMEMBER tags "redis"

# 获取集合大小
SCARD key
SCARD tags

# 移除集合元素
SREM key member [member ...]
SREM tags "temporary"

# 随机获取元素
SRANDMEMBER key [count]
SRANDMEMBER tags 2

# 随机弹出元素
SPOP key [count]
SPOP tags

# 集合操作
SUNION key [key ...]       # 并集
SUNIONSTORE dest key [key ...]
SINTER key [key ...]       # 交集
SINTERSTORE dest key [key ...]
SDIFF key [key ...]        # 差集
SDIFFSTORE dest key [key ...]

# 将元素从一个集合移动到另一个
SMOVE source destination member
SMOVE inactive_users active_users "user123"
```

### 有序集合 (Sorted Set)

有序集合是带有分数的字符串集合，元素按分数排序。

```bash
# 添加元素到有序集合
ZADD key score member [score member ...]
ZADD leaderboard 100 "player1" 85 "player2" 95 "player3"

# 获取分数
ZSCORE key member
ZSCORE leaderboard "player1"

# 获取排名（从小到大）
ZRANK key member
ZRANK leaderboard "player3"

# 获取排名（从大到小）
ZREVRANK key member
ZREVRANK leaderboard "player3"

# 增加分数
ZINCRBY key increment member
ZINCRBY leaderboard 10 "player2"

# 按索引范围获取元素
ZRANGE key start stop [WITHSCORES]
ZRANGE leaderboard 0 2 WITHSCORES

# 按分数范围获取元素
ZRANGEBYSCORE key min max [WITHSCORES]
ZRANGEBYSCORE leaderboard 90 100 WITHSCORES

# 按排名范围移除元素
ZREMRANGEBYRANK key start stop
ZREMRANGEBYRANK leaderboard 10 -1  # 移除排名10以后的所有元素

# 按分数范围移除元素
ZREMRANGEBYSCORE key min max
ZREMRANGEBYSCORE leaderboard 0 50  # 移除分数50以下的元素

# 获取有序集合大小
ZCARD key
ZCARD leaderboard

# 获取指定分数范围的元素数量
ZCOUNT key min max
ZCOUNT leaderboard 90 100

# 有序集合操作
ZUNIONSTORE dest numkeys key [key ...] [WEIGHTS weight] [AGGREGATE SUM|MIN|MAX]
ZINTERSTORE dest numkeys key [key ...] [WEIGHTS weight] [AGGREGATE SUM|MIN|MAX]
```

### HyperLogLog

用于基数统计，占用极少内存完成近似计数。

```bash
# 添加元素
PFADD key element [element ...]
PFADD visitors "user1" "user2" "user3"

# 获取基数估计
PFCOUNT key [key ...]
PFCOUNT visitors

# 合并多个HyperLogLog
PFMERGE destkey sourcekey [sourcekey ...]
PFMERGE total_visitors day1_visitors day2_visitors
```

### 地理空间 (Geo)

存储地理位置信息，支持地理空间查询。

```bash
# 添加地理位置
GEOADD key longitude latitude member [longitude latitude member ...]
GEOADD locations 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"

# 获取地理位置
GEOPOS key member [member ...]
GEOPOS locations "Palermo" "Catania"

# 计算距离
GEODIST key member1 member2 [unit]
GEODIST locations "Palermo" "Catania" km

# 获取指定范围内的位置
GEORADIUS key longitude latitude radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count]
GEORADIUS locations 15 37 100 km WITHDIST

# 获取指定成员周围的位置
GEORADIUSBYMEMBER key member radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count]
GEORADIUSBYMEMBER locations "Palermo" 100 km
```

## Redis 高级特性

### 事务

Redis 事务允许在单个步骤中执行一组命令。

```bash
# 开始事务
MULTI

# 命令入队
SET account:1:balance 500
DECRBY account:1:balance 100
INCRBY account:2:balance 100

# 执行事务
EXEC

# 取消事务
DISCARD
```

注意：Redis 事务不支持回滚操作。如果命令在执行前发生错误（如语法错误），整个事务会被拒绝；但如果命令在执行中发生错误，其他命令仍会执行。

### 发布/订阅

Redis 内置了发布/订阅系统，用于消息通信。

```bash
# 订阅频道
SUBSCRIBE channel [channel ...]
SUBSCRIBE news

# 订阅模式（支持通配符）
PSUBSCRIBE pattern [pattern ...]
PSUBSCRIBE news.*

# 发布消息
PUBLISH channel message
PUBLISH news "Breaking news: Redis 7.0 released!"

# 退订频道
UNSUBSCRIBE [channel [channel ...]]

# 退订模式
PUNSUBSCRIBE [pattern [pattern ...]]

# 查看活跃频道
PUBSUB CHANNELS [pattern]

# 查看给定频道的订阅者数量
PUBSUB NUMSUB [channel ...]
```

### 管道 (Pipelining)

管道允许客户端一次性发送多个命令，减少网络往返延迟。

```bash
# 在 redis-cli 中使用管道
$ redis-cli
> SET key1 value1
> SET key2 value2
> GET key1
> GET key2
```

在编程语言中，管道实现取决于特定的 Redis 客户端库。

### Lua 脚本

Redis 支持服务器端 Lua 脚本执行，提供原子性、性能和功能扩展。

```bash
# 执行Lua脚本
EVAL script numkeys key [key ...] arg [arg ...]

# 示例：原子计数器递增
EVAL "return redis.call('INCR', KEYS[1])" 1 mycounter

# 加载脚本到缓存并返回SHA1校验和
SCRIPT LOAD script

# 使用校验和执行已加载的脚本
EVALSHA sha1 numkeys key [key ...] arg [arg ...]

# 清除脚本缓存
SCRIPT FLUSH

# 判断脚本是否已加载
SCRIPT EXISTS sha1 [sha1 ...]

# 终止正在运行的脚本
SCRIPT KILL
```

示例：原子递增并返回判断结果

```lua
EVAL "
  local current = redis.call('INCR', KEYS[1])
  if current > tonumber(ARGV[1]) then
    return {current, 'exceeded'}
  else
    return {current, 'ok'}
  end
" 1 rate_limit:user123 5
```

## 持久化

Redis 提供两种持久化方案，可以单独使用或结合使用。

### RDB (Redis Database)

RDB 以快照形式保存数据集。

```
# redis.conf 配置
save 900 1     # 900秒内至少1个键变化时保存
save 300 10    # 300秒内至少10个键变化时保存
save 60 10000  # 60秒内至少10000个键变化时保存

# 相关命令
SAVE      # 同步保存RDB文件（会阻塞服务器）
BGSAVE    # 后台异步保存RDB文件
```

优势：
- 生成紧凑的单一文件，适合备份和恢复
- 灾难恢复性能好（比AOF快）
- 最大化Redis性能（子进程处理保存）

劣势：
- 不适合对数据安全性要求高的场景（可能丢失最近的数据）
- 保存大数据集时会导致短暂服务中断

### AOF (Append Only File)

AOF 记录所有修改数据库的命令。

```
# redis.conf 配置
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec    # 选项：always（最安全）, everysec（折衷）, no（最快）
```

优势：
- 更好的持久性（最多丢失1秒的数据，使用everysec设置）
- 追加写入，即使文件被截断也可能只损失部分数据
- 内置AOF文件重写机制，避免文件过大

劣势：
- AOF文件通常比RDB文件大
- 某些情况下可能比RDB慢
- 极少情况下可能出现AOF重建数据问题

## 高可用性与扩展

### 主从复制

Redis 支持简单的主从复制配置。

```
# 在从服务器配置文件设置
replicaof 192.168.1.1 6379
masterauth "master_password"

# 或在运行时设置
REPLICAOF host port
REPLICAOF NO ONE    # 将从服务器提升为主服务器
```

### 哨兵模式 (Sentinel)

Redis Sentinel 提供高可用性解决方案，监控主从实例，自动故障转移。

```
# sentinel.conf 配置
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel auth-pass mymaster master_password
```

### 集群模式 (Cluster)

Redis Cluster 提供数据分片和高可用性解决方案。

```
# redis.conf 集群配置
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
```

## 安全性

### 认证与访问控制

```
# 设置密码
CONFIG SET requirepass "your_secure_password"

# 登录验证
AUTH your_secure_password

# 在配置文件中设置
requirepass your_secure_password
```

### 命令重命名与禁用

禁用或重命名危险命令：

```
# 在配置中禁用命令
rename-command FLUSHALL ""
rename-command FLUSHDB ""
rename-command CONFIG ""

# 重命名命令
rename-command CONFIG CONFIG_SECRET
```

## 常见使用场景

### 缓存

Redis 最常见的使用场景是作为数据缓存，减轻数据库负载。

```bash
# 设置带过期时间的缓存
SET user:profile:123 "{json data}" EX 3600

# 检查缓存是否存在
EXISTS user:profile:123

# 读取缓存
GET user:profile:123
```

### 会话存储

```bash
# 存储会话
HMSET session:abc123 user_id 1000 login_time "2023-01-15T10:00:00Z" data "{...}"
EXPIRE session:abc123 1800  # 30分钟过期

# 读取会话
HGETALL session:abc123

# 刷新过期时间
EXPIRE session:abc123 1800
```

### 排行榜

```bash
# 更新得分
ZADD leaderboard 1000 "user:1001"
ZINCRBY leaderboard 50 "user:1001"

# 获取前10名
ZREVRANGE leaderboard 0 9 WITHSCORES

# 获取用户排名
ZREVRANK leaderboard "user:1001"
```

### 限流器

```bash
# 简单计数器限流
INCR rate:ip:192.168.1.1:60
EXPIRE rate:ip:192.168.1.1:60 60  # 60秒后过期

# 滑动窗口限流
ZADD rate:user:123 timestamp1 requestId1
ZADD rate:user:123 timestamp2 requestId2
ZREMRANGEBYSCORE rate:user:123 0 current_timestamp-window_size
ZCARD rate:user:123  # 检查请求数是否超过限制
```

### 分布式锁

```bash
# 尝试获取锁
SET lock:resource_name unique_value NX PX 10000

# 释放锁（使用Lua脚本确保原子性）
EVAL "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end" 1 lock:resource_name unique_value
```

## 性能优化

### 内存优化

- 使用适当的数据结构（例如，HSET比多个单独的key更省内存）
- 启用Redis压缩 `set-max-intset-entries 512`
- 启用内存优化 `activedefrag yes`
- 设置适当的最大内存 `maxmemory 2GB`
- 选择合适的内存淘汰策略 `maxmemory-policy allkeys-lru`

### 连接优化

- 使用连接池
- 启用管道和批量操作减少网络往返
- 适当设置 `tcp-keepalive 300`

### 监控与基准测试

```bash
# 监控Redis状态
INFO

# 查看内存使用
INFO memory

# 查看客户端连接
INFO clients

# 监控命令执行
MONITOR

# 慢日志查询
SLOWLOG GET 10
```

## 总结

Redis 是一个强大而灵活的内存数据存储系统，适用于缓存、会话管理、实时分析、排行榜、消息队列等多种场景。了解其核心概念和数据类型，合理配置和优化，能够在系统架构中充分发挥Redis的优势。

随着深入学习，你可以进一步探索Redis的高级特性，如Redis模块扩展、Redis Streams、RedisJSON等功能，以适应更复杂的应用需求。