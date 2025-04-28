# MySQL 存储引擎源码分析

## 1. MySQL 存储引擎架构概述

MySQL采用了插件式的存储引擎架构，将查询处理和数据存储分离，使得用户可以根据不同的应用场景选择合适的存储引擎。本文将深入剖析MySQL存储引擎的核心实现，特别是InnoDB存储引擎。

## 2. MySQL 存储引擎框架

MySQL 的存储引擎架构主要由以下几部分组成：

- **连接层**：处理客户端连接请求
- **服务层**：处理SQL解析、查询优化和执行
- **引擎层**：负责数据的存储和提取
- **存储层**：将数据存储到文件系统或裸设备上

存储引擎是MySQL中负责数据存储和检索的部分，它们实现了一系列接口来与服务层交互。

## 3. 存储引擎接口实现

MySQL中的存储引擎需要实现`handlerton`接口，这是一个包含了各种函数指针的结构体：

```c
struct handlerton {
  uint slot;                     // 存储引擎标识符
  uint savepoint_offset;         // 保存点偏移量
  uint *savepoint_offset_ptr;    // 保存点偏移量指针
  plugin_ref plugin;             // 插件引用
  const char *name;              // 存储引擎名称
  const char *data_file_ext;     // 数据文件扩展名
  const char *state_data_file_ext; // 状态数据文件扩展名
  
  // 各种操作函数指针
  int (*close_connection)(handlerton *hton, THD *thd);
  int (*savepoint_set)(handlerton *hton, THD *thd, void *sv);
  int (*savepoint_rollback)(handlerton *hton, THD *thd, void *sv);
  int (*savepoint_release)(handlerton *hton, THD *thd, void *sv);
  int (*commit)(handlerton *hton, THD *thd, bool all);
  int (*rollback)(handlerton *hton, THD *thd, bool all);
  int (*prepare)(handlerton *hton, THD *thd, bool all);
  
  // 创建表、打开表等函数
  int (*create)(handlerton *hton, TABLE_SHARE *table, MEM_ROOT *mem_root);
  int (*create_handler)(handlerton *hton, TABLE_SHARE *table, MEM_ROOT *mem_root);
  int (*drop_database)(handlerton *hton, char* path);
  int (*panic)(handlerton *hton, enum ha_panic_function flag);
  
  // 其他功能函数
  // ...
};
```

存储引擎初始化和注册过程：

```c
// 注册存储引擎
int ha_initialize_handlerton(st_plugin_int *plugin)
{
  handlerton *hton = (handlerton *)plugin->data;
  DBUG_ENTER("ha_initialize_handlerton");
  
  // 初始化hton结构体
  hton->slot = -1;
  hton->savepoint_offset = 0;
  hton->db_type = DB_TYPE_UNKNOWN;
  hton->state = SHOW_OPTION_YES;
  hton->partition_flags = 0;
  
  /* 
   * 设置默认函数和标志
   */
  
  plugin_ref plugin_ref = plugin_int_to_ref(plugin);
  hton->plugin = plugin_ref;
  
  // 分配槽位
  if (hton_is_engine(hton)) {
    hton->slot = total_ha++;
    hton_list[hton->slot] = hton;
    if (handlerton_max_slot < hton->slot)
      handlerton_max_slot = hton->slot;
  }
  
  DBUG_RETURN(0);
}
```

## 4. InnoDB 存储引擎架构

InnoDB 是 MySQL 的默认存储引擎，它支持事务、行锁和外键约束。InnoDB 的整体架构如下：

![InnoDB Architecture](https://dev.mysql.com/doc/refman/8.0/en/images/innodb-architecture.png)

InnoDB 主要由以下几个组件组成：

- **内存池**：包括缓冲池(Buffer Pool)、变更缓冲区(Change Buffer)、自适应哈希索引(Adaptive Hash Index)等
- **线程**：包括IO线程、清理线程、主线程等
- **文件**：包括数据文件、日志文件等

## 5. InnoDB 内存结构源码解析

### 5.1 Buffer Pool

Buffer Pool是InnoDB最重要的内存结构，用于缓存数据页和索引页。InnoDB启动时会为Buffer Pool分配一大块连续内存：

```c
// 初始化缓冲池
void buf_pool_init(ulint total_size, ulint n_instances)
{
  ulint i;
  
  // 确保总大小合理
  ut_ad(n_instances > 0);
  ut_ad(n_instances <= MAX_BUFFER_POOLS);
  ut_ad(n_instances == srv_buf_pool_instances);
  
  // 设置缓冲池实例数量
  buf_pool_ptr = (buf_pool_t*) ut_zalloc_nokey(n_instances * sizeof *buf_pool_ptr);
  buf_pool_instances = n_instances;
  
  // 计算每个实例的大小
  ulint size = total_size / n_instances;
  
  // 初始化每个缓冲池实例
  for (i = 0; i < n_instances; i++) {
    buf_pool_t *buf_pool = &buf_pool_ptr[i];
    buf_pool_init_instance(buf_pool, size, i);
  }
}
```

Buffer Pool 内部使用块列表管理：

```c
// 缓冲池块结构
struct buf_block_t {
  buf_page_t page;            // 页面基本信息
  byte *frame;                // 指向实际数据的指针
  BPageLock lock;             // 页面锁
  unsigned int unzip_LRU_old_position_low:1; // LRU位置标志
  unsigned int in_unzip_LRU_list:1;  // 是否在unzip LRU链表中
  unsigned int in_withdraw_list:1;    // 是否在撤回列表中
  
  /* Hash索引相关字段 */
  hash_node_t hash;          // 哈希节点
  
  /* 空闲链表相关字段 */
  UT_LIST_NODE_T(buf_block_t) free;  // 空闲链表节点
};
```

### 5.2 Change Buffer

Change Buffer用于缓存对二级索引的操作，减少随机IO：

```c
// 初始化Change Buffer
UNIV_INTERN
ibool
ibuf_init_at_db_start(void)
{
  /* 获取Change Buffer信息页 */
  mtr_t  mtr;
  mtr_start(&mtr);
  
  ibuf = ibuf_t(IB_IBUF_SPACE_ID);
  
  // 获取Change Buffer根页
  buf_block_t*  block = buf_page_get(
    page_id_t(IB_IBUF_SPACE_ID, FSP_IBUF_HEADER_PAGE_NO),
    UNIV_PAGE_SIZE, RW_X_LATCH, &mtr);
  
  page_t*  root = buf_block_get_frame(block);
  
  /* 初始化Change Buffer */
  
  mtr_commit(&mtr);
  return(TRUE);
}
```

## 6. InnoDB 物理存储结构

### 6.1 表空间文件

InnoDB有两种表空间文件：系统表空间和独立表空间。每个表空间由段、区、页组成：

```
表空间(Tablespace) -> 段(Segment) -> 区(Extent) -> 页(Page) -> 行(Row)
```

页是InnoDB存储的基本单位，默认大小为16KB。页的结构如下：

```c
// 页面结构
struct page_t {
  byte FIL_PAGE_SPACE_OR_CHKSUM[4];    // 校验和或空间ID
  byte FIL_PAGE_OFFSET[4];             // 页号
  byte FIL_PAGE_PREV[4];               // 前一页的页号
  byte FIL_PAGE_NEXT[4];               // 后一页的页号
  byte FIL_PAGE_LSN[8];                // 日志序列号
  byte FIL_PAGE_TYPE[2];               // 页面类型
  byte FIL_PAGE_FILE_FLUSH_LSN[8];     // 仅系统表空间的第一个页使用
  byte FIL_PAGE_ARCH_LOG_NO_OR_SPACE_ID[4]; // 归档日志编号或表空间ID
  // ... 页面内容 ...
};
```

### 6.2 索引结构

InnoDB使用B+树作为索引结构。每个表至少有一个聚簇索引和若干二级索引。

索引页的格式:

```c
// 索引页结构
struct page_directory_t {
  page_header_t page_header;          // 页头
  infimum_supremum_t infimum_supremum; // 最小值和最大值记录
  user_records_t user_records;         // 用户记录
  free_space_t free_space;             // 空闲空间
  page_directory_t page_directory;     // 页目录
  fil_trailer_t fil_trailer;           // 页尾
};
```

B+树索引的创建过程：

```c
// 创建索引B+树
dict_index_t*
dict_create_index_tree_in_mem(
  const dict_index_t*  index)  // 索引信息
{
  mtr_t  mtr;
  ulint  page_no;
  dict_index_t* index_copy = dict_index_copy(index);
  
  // 开始事务
  mtr_start(&mtr);
  
  // 创建根页
  page_no = btr_create(
    index_copy->type, index_copy->space, index_copy->id, index_copy, &mtr);
  
  // 设置根页号
  index_copy->page = page_no;
  
  // 提交事务
  mtr_commit(&mtr);
  
  return(index_copy);
}
```

## 7. InnoDB 事务实现

InnoDB通过MVCC(多版本并发控制)和锁机制实现事务：

### 7.1 事务控制块

每个事务都由一个事务控制块表示：

```c
// 事务结构
struct trx_t {
  ulint      id;                   // 事务ID
  trx_state_t state;               // 事务状态
  bool      is_registered;         // 是否已注册
  ulint     start_time;            // 开始时间
  
  trx_id_t  read_view_heap;        // 读视图堆
  read_view_t*  read_view;         // MVCC读视图
  
  lock_list_t  lock_list;          // 持有的锁列表
  
  // 撤销日志相关字段
  trx_undo_t*  insert_undo;        // 插入操作撤销日志
  trx_undo_t*  update_undo;        // 更新操作撤销日志
  
  // 其他字段
  bool      dict_operation;        // 是否执行数据字典操作
  bool      ddl_operation;         // 是否执行DDL操作
  bool      internal;              // 是否是内部事务
  // ...
};
```

### 7.2 MVCC 实现

InnoDB通过读视图(Read View)实现MVCC：

```c
// 读视图结构
struct read_view_t {
  trx_id_t low_limit_id;    // 不能访问的最小事务ID
  trx_id_t up_limit_id;     // 可以访问的最大事务ID
  ulint n_trx_ids;          // 活跃事务ID的数量
  trx_id_t* trx_ids;        // 活跃事务ID数组
  trx_id_t creator_trx_id;  // 创建读视图的事务ID
};

// 创建读视图
read_view_t*
read_view_create(
  trx_id_t      creator_trx_id,    // 创建者事务ID
  mem_heap_t*   heap)              // 内存堆
{
  read_view_t*  view;
  
  // 分配内存
  view = (read_view_t*) mem_heap_alloc(heap, sizeof(read_view_t));
  
  // 设置创建者事务ID
  view->creator_trx_id = creator_trx_id;
  
  // 获取当前活跃的事务
  view->n_trx_ids = trx_sys->mvcc.size();
  
  if (view->n_trx_ids > 0) {
    // 复制活跃事务ID
    view->trx_ids = (trx_id_t*) mem_heap_alloc(
      heap, view->n_trx_ids * sizeof(trx_id_t));
    
    memcpy(view->trx_ids, trx_sys->mvcc.begin(), 
           view->n_trx_ids * sizeof(trx_id_t));
  } else {
    view->trx_ids = NULL;
  }
  
  // 设置上下限ID
  view->up_limit_id = trx_sys->max_trx_id;
  view->low_limit_id = view->up_limit_id;
  
  return(view);
}
```

### 7.3 锁机制

InnoDB实现了多粒度锁定，包括表锁、行锁和意向锁：

```c
// 锁结构
struct lock_t {
  trx_t*      trx;          // 持有锁的事务
  ib_uint64_t id;           // 锁ID
  lock_mode   mode;         // 锁模式 (LOCK_S, LOCK_X 等)
  lock_type   type;         // 锁类型 (LOCK_TABLE, LOCK_REC)
  
  union {
    lock_table_t  tab;      // 表锁信息
    lock_rec_t    rec;      // 行锁信息
  };
  
  hash_node_t  hash;        // 哈希链表节点
  
  // 队列节点
  UT_LIST_NODE_T(lock_t) trx_locks;  // 事务持有的锁链表
};

// 请求行锁
UNIV_INTERN
ulint
lock_rec_lock(
  bool            inherit,      // 是否继承
  ulint           mode,         // 锁模式
  const buf_block_t* block,     // 包含记录的块
  ulint           heap_no,      // 记录堆号
  dict_index_t*   index,        // 索引
  trx_t*          trx)          // 事务
{
  // ... 锁请求实现 ...
  
  // 创建锁对象
  lock_t* lock = lock_create();
  
  // 设置锁属性
  lock->trx = trx;
  lock->mode = mode;
  lock->type = LOCK_REC;
  lock->rec.block = block;
  lock->rec.heap_no = heap_no;
  
  // 请求锁
  ulint err = lock_rec_enqueue_waiting(mode, block, heap_no, index, trx);
  
  return err;
}
```

## 8. InnoDB 日志系统

### 8.1 重做日志(Redo Log)

重做日志用于实现持久性和恢复。InnoDB将所有修改操作记录到重做日志文件中：

```c
// 写重做日志
UNIV_INTERN
void
log_write_redo(
  byte*    ptr,                 // 日志内容指针
  ulint    len,                 // 日志长度
  lsn_t*   start_lsn,           // 开始LSN
  lsn_t*   end_lsn)             // 结束LSN
{
  // 获取日志系统互斥锁
  mutex_enter(&(log_sys->mutex));
  
  // 分配日志空间
  log_reserve_buf(log_sys, len);
  
  // 复制日志内容
  memcpy(log_sys->buf + log_sys->buf_free, ptr, len);
  
  // 更新LSN
  *start_lsn = log_sys->lsn;
  log_sys->lsn += len;
  *end_lsn = log_sys->lsn;
  
  // 更新缓冲区空闲位置
  log_sys->buf_free += len;
  
  // 如果缓冲区超过一半，触发日志写入
  if (log_sys->buf_free > log_sys->buf_size / 2) {
    log_write_up_to(*end_lsn, LOG_WAIT_ONE_GROUP);
  }
  
  // 释放互斥锁
  mutex_exit(&(log_sys->mutex));
}
```

### 8.2 撤销日志(Undo Log)

撤销日志用于实现事务的原子性和隔离性：

```c
// 写撤销日志
UNIV_INTERN
trx_undo_rec_t*
trx_undo_report_row_operation(
  ulint       flags,            // 操作标志
  ulint       op_type,          // 操作类型
  trx_t*      trx,              // 事务
  dict_table_t* table,          // 表
  const dtuple_t* rec,          // 记录
  const upd_t*   update,        // 更新向量
  ulint       cmpl_info,        // 完成信息
  rec_t*      rec_to_update,    // 要更新的记录
  roll_ptr_t* roll_ptr)         // 回滚指针
{
  trx_undo_t* undo = NULL;
  
  // 根据操作类型获取对应的撤销日志
  switch(op_type) {
    case TRX_UNDO_INSERT_OP:
      undo = trx->insert_undo;
      break;
    case TRX_UNDO_MODIFY_OP:
      undo = trx->update_undo;
      break;
  }
  
  // 如果没有对应的撤销日志，创建一个
  if (undo == NULL) {
    // 创建撤销日志...
  }
  
  // 写入撤销日志记录
  trx_undo_rec_t* undo_rec = trx_undo_page_report_modify(
    undo->hdr_page_no, undo, table, update, cmpl_info, rec_to_update, trx_id, roll_ptr);
  
  return undo_rec;
}
```

## 9. InnoDB 恢复机制

InnoDB通过崩溃恢复机制确保数据库的一致性：

```c
// 启动恢复处理
UNIV_INTERN
void
recv_recovery_from_checkpoint_start(
  lsn_t      checkpoint_lsn)    // 检查点LSN
{
  // 初始化恢复系统
  recv_sys_init();
  
  /* 读取并分析重做日志 */
  recv_group_scan_log_recs(
    checkpoint_lsn, UT_LIST_GET_FIRST(log_sys->log_groups)->archived_file_no);
  
  /* 应用重做日志记录 */
  recv_apply_hashed_log_recs(FALSE);
  
  /* 恢复完成 */
  recv_recovery_from_checkpoint_finish();
}
```

## 10. 核心算法实现

### 10.1 B+树操作

B+树是InnoDB的核心数据结构，用于实现索引：

```c
// 在B+树中查找记录
UNIV_INTERN
rec_t*
btr_search_leaf(
  dict_index_t*   index,        // 索引
  page_cur_t*     cursor,       // 游标
  const dtuple_t* tuple,        // 键值元组
  ulint           mode)         // 查找模式
{
  // 从根页开始
  buf_block_t* block = btr_root_block_get(index, RW_S_LATCH, &mtr);
  page_t* page = buf_block_get_frame(block);
  
  // 如果是叶子页，直接搜索
  if (page_is_leaf(page)) {
    return btr_search_page(block, index, tuple, mode, cursor, &mtr);
  }
  
  // 否则，遍历非叶子节点
  while (!page_is_leaf(page)) {
    // 在当前页中查找
    page_cur_search_with_match(page, tuple, PAGE_CUR_LE, &tmp_cursor);
    
    // 获取子页指针
    rec_t* node_ptr = page_cur_get_rec(&tmp_cursor);
    
    // 读取子页
    page_id_t child_page_id = btr_node_ptr_get_child_page_id(node_ptr);
    block = btr_block_get(child_page_id, index, &mtr);
    page = buf_block_get_frame(block);
  }
  
  // 在叶子页中查找
  return btr_search_page(block, index, tuple, mode, cursor, &mtr);
}
```

### 10.2 页分裂算法

当页满时，InnoDB通过页分裂算法维护B+树平衡：

```c
// 页分裂函数
UNIV_INTERN
rec_t*
btr_page_split_and_insert(
  btr_cur_t*    cursor,         // 游标
  const dtuple_t*  tuple,       // 待插入的元组
  ulint         n_ext,          // 外部记录数
  mtr_t*        mtr)            // Mini-Transaction
{
  // 获取当前页和索引信息
  buf_block_t*   block = btr_cur_get_block(cursor);
  page_t*       page = buf_block_get_frame(block);
  dict_index_t* index = btr_cur_get_index(cursor);
  
  // 创建新页
  buf_block_t*   new_block = btr_page_alloc(index, mtr);
  page_t*       new_page = buf_block_get_frame(new_block);
  
  // 初始化新页
  btr_page_create(new_block, index, mtr);
  
  // 计算分裂点
  rec_t* split_rec = btr_page_get_split_rec(cursor, tuple);
  
  // 将部分记录移动到新页
  btr_page_copy_rec_list_end(new_block, block, split_rec, index, mtr);
  
  // 更新页链接
  btr_page_set_next(page, new_block->page.id.page_no(), mtr);
  btr_page_set_prev(new_page, block->page.id.page_no(), mtr);
  
  /* 更新父节点，可能需要递归分裂 */
  
  // 插入记录
  if (tuple_belongs_to_old_page(tuple, split_rec)) {
    return btr_page_insert_rec(cursor, tuple, n_ext, mtr);
  } else {
    return btr_page_insert_rec_into_new_page(cursor, tuple, n_ext, new_block, mtr);
  }
}
```

## 11. 源码阅读技巧与心得

1. **理解整体架构**：先了解InnoDB的整体架构和各个组件的功能，再深入源码细节
2. **关注核心数据结构**：如B+树、页、事务等，这些是理解源码的基础
3. **跟踪关键流程**：如事务提交、查询执行、崩溃恢复等核心流程
4. **使用调试工具**：GDB等工具可以帮助理解代码执行流程
5. **结合文档**：MySQL官方文档和源码注释可以提供很多帮助

## 12. 总结

通过分析MySQL InnoDB存储引擎的源码，我们可以看到其精心设计的内存管理、B+树索引结构、MVCC和锁机制、日志系统等核心组件，这些设计保证了数据库的高性能、高可靠性和高并发性。

理解InnoDB的源码实现，不仅有助于优化MySQL数据库性能，解决实际问题，还能学习到许多优秀的系统设计思想和编程技巧，对提升自身的系统设计和编程能力很有帮助。
