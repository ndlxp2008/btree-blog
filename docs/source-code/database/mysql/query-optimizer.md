# MySQL 查询优化器源码分析

## 1. MySQL 查询优化器概述

MySQL 查询优化器是 MySQL 数据库系统中的核心组件，负责为 SQL 查询生成最优执行计划。它分析 SQL 语句，评估不同的执行策略，并选择成本最低的执行计划。

### 1.1 优化器在 MySQL 架构中的位置

MySQL 的查询处理流程大致如下：

1. **解析器（Parser）**：将 SQL 文本解析成语法树
2. **预处理器（Preprocessor）**：检查表和字段是否存在，解析视图等
3. **优化器（Optimizer）**：生成执行计划
4. **执行引擎（Execution Engine）**：执行查询计划
5. **存储引擎（Storage Engine）**：负责数据的存储和读取

优化器位于解析器和执行引擎之间，是查询处理的核心环节。

### 1.2 优化器的主要职责

1. **转换查询**：将查询重写为等价但更高效的形式
2. **选择索引**：决定使用哪些索引来访问表
3. **确定连接顺序**：决定多表连接的顺序
4. **选择连接算法**：选择嵌套循环、哈希连接等算法
5. **优化子查询**：将子查询转换为更高效的形式
6. **生成执行计划**：创建最终的查询执行计划

## 2. 优化器核心数据结构

### 2.1 Query_block

`Query_block` 是表示单个 SELECT 查询块的数据结构，对应 SQL 中的一个 SELECT 语句。

```cpp
class Query_block {
public:
  // SELECT 子句中的项目列表
  List<Item> item_list;
  
  // FROM 子句中的表
  List<TABLE_LIST> table_list;
  
  // WHERE 子句
  Item *where_cond;
  
  // GROUP BY 子句
  ORDER *group_list;
  
  // HAVING 子句
  Item *having_cond;
  
  // ORDER BY 子句
  ORDER *order_list;
  
  // LIMIT 子句
  Item *select_limit;
  Item *offset_limit;
  
  // ...其他成员...
};
```

### 2.2 JOIN

`JOIN` 结构表示连接操作，包含连接的表和连接条件。

```cpp
class JOIN {
public:
  // 查询块
  Query_block *select_lex;
  
  // 连接的表
  TABLE_LIST *tables;
  
  // 连接条件
  List<Item> conds;
  
  // 连接顺序
  table_map table_dependencies;
  
  // 连接方法
  enum_join_type join_type;
  
  // 成本估算
  double best_read;
  
  // ...其他成员...
};
```

### 2.3 Item

`Item` 是表示表达式的基类，包括列引用、常量、函数调用等。

```cpp
class Item {
public:
  // 表达式类型
  enum Type {
    FIELD_ITEM,
    FUNC_ITEM,
    SUM_FUNC_ITEM,
    STRING_ITEM,
    INT_ITEM,
    REAL_ITEM,
    NULL_ITEM,
    // ...其他类型...
  };
  
  // 获取表达式类型
  virtual Type type() const = 0;
  
  // 计算表达式的值
  virtual bool val_bool() = 0;
  virtual longlong val_int() = 0;
  virtual double val_real() = 0;
  virtual String *val_str(String *str) = 0;
  
  // ...其他方法...
};
```

### 2.4 TABLE_LIST

`TABLE_LIST` 表示查询中引用的表或视图。

```cpp
class TABLE_LIST {
public:
  // 表名
  char *table_name;
  char *db;
  
  // 表对象
  TABLE *table;
  
  // 连接类型
  enum_join_type join_type;
  
  // 连接条件
  Item *join_cond;
  
  // 表别名
  char *alias;
  
  // ...其他成员...
};
```

### 2.5 Access_path

`Access_path` 表示访问表的方法，如全表扫描、索引扫描等。

```cpp
class Access_path {
public:
  // 访问类型
  enum Type {
    TABLE_SCAN,
    INDEX_SCAN,
    REF,
    REF_OR_NULL,
    EQ_REF,
    CONST,
    RANGE,
    // ...其他类型...
  };
  
  // 访问类型
  Type type;
  
  // 表
  TABLE *table;
  
  // 索引
  uint index;
  
  // 成本估算
  double read_cost;
  double rows;
  
  // ...其他成员...
};
```

## 3. 查询优化的核心流程

### 3.1 解析与预处理

SQL 查询首先被解析器解析成语法树，然后由预处理器进行语义分析。

```cpp
// sql/sql_parse.cc
int mysql_parse(THD *thd, Parser_state *parser_state) {
  // 解析 SQL 语句
  if (parse_sql(thd, parser_state, NULL))
    return 1;
  
  // 预处理
  if (thd->lex->unit->prepare(thd, 0, 0, 0))
    return 1;
  
  // 优化和执行
  // ...
}
```

### 3.2 查询重写

优化器首先对查询进行重写，将其转换为等价但更高效的形式。

```cpp
// sql/sql_optimizer.cc
bool Query_block::prepare(THD *thd) {
  // 视图处理
  if (merge_derived_tables(thd))
    return true;
  
  // 子查询处理
  if (pull_out_semijoin_tables(thd))
    return true;
  
  // 谓词下推
  if (push_conditions_to_derived_tables(thd))
    return true;
  
  // ...其他重写操作...
  
  return false;
}
```

常见的查询重写技术包括：

1. **常量传播**：用常量值替换表达式
2. **谓词下推**：将过滤条件下推到数据源
3. **子查询转连接**：将子查询转换为连接
4. **视图合并**：将视图定义合并到查询中
5. **外连接消除**：将外连接转换为内连接

### 3.3 统计信息收集

优化器依赖统计信息来估计查询的成本。MySQL 收集的统计信息包括：

1. **表统计信息**：表的行数、数据大小等
2. **索引统计信息**：索引的基数、选择性等
3. **列统计信息**：列的值分布、直方图等

```cpp
// sql/opt_range.cc
bool get_key_scans_params(THD *thd, TABLE *table, KEY *key,
                          key_map *needed_reg) {
  // 获取索引统计信息
  table->key_info[key_nr].rec_per_key[i] = rec_per_key;
  
  // ...其他统计信息...
}
```

### 3.4 访问路径选择

优化器为每个表选择最佳的访问方法，如全表扫描、索引扫描、范围扫描等。

```cpp
// sql/opt_range.cc
bool SQL_SELECT::test_quick_select(THD *thd, key_map keys_to_use,
                                  table_map prev_tables,
                                  ha_rows limit,
                                  bool force_quick_range,
                                  ORDER *order) {
  // 评估不同的访问方法
  if ((error = sel_arg_tree->check_range(param)))
    return error;
  
  // 选择最佳访问方法
  if (thd->lex->sql_command != SQLCOM_SELECT)
    param->needed_reg = &needed_reg;
  
  // ...其他代码...
}
```

常见的访问路径包括：

1. **全表扫描（TABLE_SCAN）**：扫描表的所有行
2. **索引扫描（INDEX_SCAN）**：扫描索引的所有条目
3. **索引查找（REF）**：使用索引查找特定值
4. **范围扫描（RANGE）**：扫描索引的一个范围
5. **常量查找（CONST）**：通过主键或唯一索引查找单行

### 3.5 连接顺序优化

对于多表连接，优化器需要确定最佳的连接顺序。

```cpp
// sql/sql_optimizer.cc
bool Optimize_table_order::choose_table_order() {
  // 使用贪心算法或动态规划算法选择连接顺序
  if (thd->optimizer_switch_flag(OPTIMIZER_SWITCH_EXHAUSTIVE_SEARCH))
    return find_best_by_exhaustive_search();
  else
    return find_best_by_greedy_search();
}
```

MySQL 使用两种算法来确定连接顺序：

1. **贪心算法**：每次选择成本最低的表进行连接
2. **穷举搜索**：尝试所有可能的连接顺序（仅适用于表数量较少的情况）

### 3.6 连接算法选择

MySQL 支持多种连接算法，优化器会根据数据特性选择最合适的算法。

```cpp
// sql/sql_executor.cc
int join_init_read_record(JOIN_TAB *tab) {
  // 选择连接算法
  switch (tab->type) {
    case JT_ALL:
      // 全表扫描
      if (init_read_record(&tab->read_record, tab->table, ...))
        return 1;
      break;
    case JT_INDEX_SCAN:
      // 索引扫描
      if (init_read_record_idx(&tab->read_record, tab->table, ...))
        return 1;
      break;
    // ...其他连接类型...
  }
  
  return 0;
}
```

主要的连接算法包括：

1. **嵌套循环连接（Nested Loop Join）**：对外表的每一行，扫描内表
2. **哈希连接（Hash Join）**：基于哈希表的连接（MySQL 8.0.18+ 支持）
3. **排序合并连接（Sort Merge Join）**：基于排序的连接

### 3.7 成本估算

优化器使用成本模型来估计查询执行的成本，包括 I/O 成本和 CPU 成本。

```cpp
// sql/opt_costmodel.cc
double Cost_model_server::row_evaluate_cost(double rows) const {
  return rows * m_row_evaluate_cost;
}

double Cost_model_server::key_compare_cost(double rows) const {
  return rows * m_key_compare_cost;
}

// ...其他成本函数...
```

成本估算考虑的因素包括：

1. **I/O 成本**：读取数据页的成本
2. **CPU 成本**：处理行的成本
3. **内存使用**：排序、哈希表等操作的内存使用
4. **并行度**：并行执行的可能性

### 3.8 执行计划生成

最后，优化器生成最终的执行计划，包括访问方法、连接顺序、连接算法等。

```cpp
// sql/sql_optimizer.cc
bool JOIN::optimize() {
  // 选择连接顺序
  if (choose_table_order())
    return true;
  
  // 生成执行计划
  if (make_join_plan())
    return true;
  
  // 创建临时表（如果需要）
  if (make_tmp_tables_info())
    return true;
  
  // ...其他优化步骤...
  
  return false;
}
```

## 4. 关键优化技术分析

### 4.1 索引选择

MySQL 优化器使用索引统计信息来选择最佳索引。

```cpp
// sql/opt_range.cc
bool test_quick_select(THD *thd, key_map keys_to_use,
                      table_map prev_tables,
                      ha_rows limit,
                      bool force_quick_range,
                      ORDER *order) {
  // 评估每个可用索引
  for (uint idx = 0; idx < table->s->keys; idx++) {
    if (!(keys_to_use.is_set(idx)))
      continue;
    
    // 计算使用此索引的成本
    double index_read_cost = table->file->index_scan_cost(idx, 1, rows);
    
    // 选择成本最低的索引
    if (index_read_cost < best_read_cost) {
      best_read_cost = index_read_cost;
      best_key = idx;
    }
  }
  
  // ...其他代码...
}
```

索引选择考虑的因素包括：

1. **索引选择性**：索引区分不同值的能力
2. **查询条件**：WHERE 子句中的条件
3. **排序要求**：ORDER BY 子句
4. **覆盖索引**：索引是否包含所有需要的列

### 4.2 连接优化

MySQL 优化器使用多种技术来优化连接操作。

```cpp
// sql/sql_optimizer.cc
bool make_join_statistics(THD *thd, List<TABLE_LIST> *tables,
                         List<Item> *conds,
                         key_map *keys_to_use) {
  // 预估每个表的行数
  if (estimate_rowcount())
    return true;
  
  // 选择连接顺序
  if (choose_table_order())
    return true;
  
  // 选择连接算法
  if (optimize_inner_joins(thd))
    return true;
  
  // ...其他优化步骤...
  
  return false;
}
```

连接优化技术包括：

1. **连接顺序优化**：选择最佳的表连接顺序
2. **连接条件优化**：利用索引加速连接
3. **半连接优化**：优化 IN 子查询
4. **外连接消除**：将外连接转换为内连接

### 4.3 子查询优化

MySQL 优化器使用多种技术来优化子查询。

```cpp
// sql/item_subselect.cc
bool Item_subselect::fix_fields(THD *thd, Item **ref) {
  // 尝试将子查询转换为半连接
  if (thd->lex->sql_command == SQLCOM_SELECT &&
      optimizer_flag(thd, OPTIMIZER_SWITCH_SEMIJOIN))
    lex->set_semijoin_enabled();
  
  // ...其他优化步骤...
  
  return false;
}
```

子查询优化技术包括：

1. **子查询展开**：将子查询转换为连接
2. **子查询物化**：将子查询结果存储在临时表中
3. **半连接转换**：将 IN 子查询转换为半连接
4. **子查询去关联**：消除子查询与外部查询的依赖

### 4.4 排序优化

MySQL 优化器使用多种技术来优化排序操作。

```cpp
// sql/sql_optimizer.cc
bool JOIN::optimize_ordering() {
  // 尝试使用索引进行排序
  if (test_if_skip_sort_order())
    return false;
  
  // 创建排序对象
  if (!(sortorder = make_sortorder(order, &sortlength)))
    return true;
  
  // ...其他优化步骤...
  
  return false;
}
```

排序优化技术包括：

1. **索引排序**：使用索引避免显式排序
2. **排序字段最小化**：只排序必要的字段
3. **排序合并**：合并多个排序操作
4. **松散索引扫描**：对于 GROUP BY 操作的特殊优化

### 4.5 LIMIT 优化

MySQL 优化器对带有 LIMIT 子句的查询进行特殊优化。

```cpp
// sql/sql_select.cc
bool Query_result_union::send_data(THD *thd, List<Item> &items) {
  // 检查是否达到 LIMIT
  if (limit_rows && row_count >= limit_rows) {
    // 提前终止查询
    thd->killed = THD::KILL_QUERY;
    return false;
  }
  
  // ...其他代码...
  
  row_count++;
  return false;
}
```

LIMIT 优化技术包括：

1. **提前终止**：达到 LIMIT 限制后停止处理
2. **优先级提升**：提高带有 LIMIT 的查询的优化优先级
3. **结合排序**：将 LIMIT 与 ORDER BY 结合优化

## 5. 优化器的限制与挑战

### 5.1 统计信息不准确

MySQL 的统计信息可能不准确，导致优化器做出次优决策。

```cpp
// sql/ha_innodb.cc
int ha_innobase::info(uint flag) {
  // 估计表的行数
  if (flag & HA_STATUS_VARIABLE) {
    stats.records = row_count_approximation();
  }
  
  // ...其他代码...
  
  return 0;
}
```

InnoDB 存储引擎使用采样来估计表的行数和索引基数，这可能导致估计不准确。

### 5.2 成本模型简化

MySQL 的成本模型相对简化，可能无法准确反映复杂查询的实际执行成本。

```cpp
// sql/opt_costmodel.cc
double Cost_model_table::page_read_cost(double pages) const {
  // 简化的 I/O 成本模型
  return pages * m_server_cost_model->io_block_read_cost();
}
```

成本模型的简化包括：

1. **忽略缓存效果**：没有考虑内存缓存的影响
2. **忽略并行执行**：没有考虑并行执行的可能性
3. **忽略数据倾斜**：假设数据均匀分布

### 5.3 查询重写局限性

MySQL 的查询重写功能相对有限，无法处理所有复杂的查询转换。

```cpp
// sql/item_subselect.cc
bool Item_in_subselect::transform_into_semijoin() {
  // 只有满足特定条件的子查询才能转换为半连接
  if (is_correlated || !optimizer_flag(thd, OPTIMIZER_SWITCH_SEMIJOIN))
    return false;
  
  // ...其他条件检查...
  
  return do_semijoin_conversion();
}
```

查询重写的局限性包括：

1. **复杂子查询**：无法优化所有类型的子查询
2. **视图限制**：某些视图无法合并
3. **外连接限制**：某些外连接无法优化

### 5.4 连接顺序搜索空间

对于多表连接，搜索最佳连接顺序的空间呈指数增长。

```cpp
// sql/sql_optimizer.cc
bool Optimize_table_order::find_best_by_exhaustive_search() {
  // 表数量限制
  if (join->tables > MAX_EXHAUSTIVE_TABLES)
    return false;
  
  // 穷举所有可能的连接顺序
  // ...
  
  return false;
}
```

MySQL 默认只对少量表（通常是 7 个或更少）使用穷举搜索，对于更多表使用贪心算法，这可能导致次优的连接顺序。

## 6. 优化器调优技术

### 6.1 优化器提示

MySQL 支持优化器提示，允许用户影响优化器的决策。

```sql
-- 强制使用特定索引
SELECT /*+ INDEX(t idx_a) */ * FROM t WHERE a > 10;

-- 指定连接顺序
SELECT /*+ JOIN_ORDER(t1, t2, t3) */ * FROM t1, t2, t3 WHERE ...;

-- 禁用特定优化
SELECT /*+ NO_ICP(t) */ * FROM t WHERE ...;
```

优化器提示的实现：

```cpp
// sql/opt_hints.cc
bool PT_hint_list::contextualize(Parse_context *pc) {
  // 解析优化器提示
  for (PT_hint *hint : hints) {
    if (hint->contextualize(pc))
      return true;
  }
  
  // 应用优化器提示
  if (pc->thd->lex->sql_command == SQLCOM_SELECT ||
      pc->thd->lex->sql_command == SQLCOM_UPDATE ||
      pc->thd->lex->sql_command == SQLCOM_DELETE)
    pc->select->set_optimizer_hints(this);
  
  return false;
}
```

### 6.2 优化器开关

MySQL 提供了优化器开关，允许启用或禁用特定的优化特性。

```sql
-- 设置优化器开关
SET optimizer_switch = 'index_merge=on,index_merge_union=on,index_merge_sort_union=on';
```

优化器开关的实现：

```cpp
// sql/sql_optimizer.cc
bool optimize_table_order(THD *thd, JOIN *join, List<Item> *where_cond) {
  // 检查优化器开关
  if (thd->optimizer_switch_flag(OPTIMIZER_SWITCH_EXHAUSTIVE_SEARCH))
    return find_best_by_exhaustive_search();
  else
    return find_best_by_greedy_search();
}
```

### 6.3 EXPLAIN 分析

EXPLAIN 命令可以显示查询的执行计划，帮助分析和优化查询。

```sql
-- 分析查询执行计划
EXPLAIN SELECT * FROM t1 JOIN t2 ON t1.id = t2.id WHERE t1.a > 10;
```

EXPLAIN 的实现：

```cpp
// sql/sql_explain.cc
bool explain_query(THD *thd, Query_block *query_block) {
  // 生成执行计划
  if (query_block->prepare(thd))
    return true;
  
  // 输出执行计划
  if (query_block->optimize(thd))
    return true;
  
  // 格式化执行计划
  if (explain_format(thd, query_block))
    return true;
  
  return false;
}
```

### 6.4 统计信息管理

MySQL 允许手动管理统计信息，以提高优化器决策的准确性。

```sql
-- 分析表，更新统计信息
ANALYZE TABLE t;

-- 设置持久化统计信息
ALTER TABLE t STATS_PERSISTENT=1;
```

统计信息管理的实现：

```cpp
// sql/sql_table.cc
bool mysql_analyze_table(THD *thd, TABLE_LIST *tables) {
  // 分析表，更新统计信息
  if (table->file->ha_analyze(thd, &key_info, &stats))
    return true;
  
  // 持久化统计信息
  if (table->s->stats_persistent)
    if (write_stats_to_dd(thd, table))
      return true;
  
  return false;
}
```

## 7. 源码阅读技巧与心得

### 7.1 关键源码文件

MySQL 优化器的核心源码主要位于以下文件：

1. **sql/sql_optimizer.cc**：优化器的主要实现
2. **sql/opt_range.cc**：范围优化和索引选择
3. **sql/opt_trace.cc**：优化器跟踪
4. **sql/sql_planner.cc**：查询计划生成
5. **sql/sql_select.cc**：SELECT 查询处理
6. **sql/item_subselect.cc**：子查询处理
7. **sql/opt_costmodel.cc**：成本模型

### 7.2 调试技巧

调试 MySQL 优化器的有效方法：

1. **使用 EXPLAIN**：查看查询的执行计划
2. **启用优化器跟踪**：获取详细的优化过程信息
   ```sql
   SET optimizer_trace = 'enabled=on';
   SELECT ...;
   SELECT * FROM information_schema.optimizer_trace;
   ```
3. **使用 GDB**：设置断点调试优化器代码
4. **查看错误日志**：检查优化器警告和错误

### 7.3 源码阅读路径

建议的 MySQL 优化器源码阅读路径：

1. 从 `mysql_parse()` 函数开始，了解查询处理的整体流程
2. 研究 `JOIN::optimize()` 函数，了解优化的主要步骤
3. 深入研究特定优化技术，如索引选择、连接优化等
4. 研究成本模型和统计信息收集机制
5. 研究特定查询类型的优化，如子查询、GROUP BY 等

### 7.4 设计模式应用

MySQL 优化器源码中应用了多种设计模式：

1. **策略模式**：不同的优化策略可以互换
2. **访问者模式**：处理查询树的不同节点
3. **工厂模式**：创建不同类型的执行计划
4. **组合模式**：表示查询树的层次结构
5. **观察者模式**：优化器跟踪和事件通知

## 8. 总结与展望

### 8.1 优化器的演进

MySQL 优化器经历了多次重大改进：

1. **MySQL 5.6**：子查询优化、索引条件下推
2. **MySQL 5.7**：成本模型改进、优化器跟踪
3. **MySQL 8.0**：直方图统计、降序索引、哈希连接

### 8.2 与其他数据库的比较

与其他数据库系统相比，MySQL 优化器的特点：

1. **PostgreSQL**：更复杂的统计模型，更强的查询重写能力
2. **Oracle**：更先进的成本模型，更多的优化技术
3. **SQL Server**：更好的内存管理，更先进的执行引擎
4. **MySQL**：简单高效，适合 OLTP 工作负载

### 8.3 未来发展方向

MySQL 优化器的可能发展方向：

1. **改进统计信息**：更准确的统计模型，更多的统计类型
2. **增强查询重写**：更强大的查询转换能力
3. **自适应优化**：根据运行时反馈调整执行计划
4. **机器学习优化**：使用机器学习模型预测查询性能
5. **分布式优化**：针对分布式环境的优化技术

## 9. 参考资料

1. MySQL 源码：https://github.com/mysql/mysql-server
2. MySQL 优化器文档：https://dev.mysql.com/doc/refman/8.0/en/optimizer.html
3. MySQL Internals Manual：https://dev.mysql.com/doc/internals/en/
4. 《高性能 MySQL》（第 4 版）
5. 《MySQL 技术内幕：InnoDB 存储引擎》（第 2 版）
