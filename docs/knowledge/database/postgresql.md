# PostgreSQL 指南

PostgreSQL（通常简称为Postgres）是一个功能强大的开源对象关系数据库系统，拥有超过30年的积极开发历史，以其可靠性、特性稳健性和性能著称。本指南将介绍PostgreSQL的核心概念和使用方法。

## PostgreSQL 简介

PostgreSQL 是一个高级的企业级关系型数据库管理系统，它：

- 完全遵循 ACID 原则（原子性、一致性、隔离性和持久性）
- 支持先进的数据类型和高级索引方法
- 提供强大的SQL支持，包括子查询、窗口函数和公共表表达式
- 支持存储过程和触发器
- 具有良好的可扩展性和丰富的扩展生态系统

## 安装与配置

### 在不同操作系统上安装

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**CentOS/RHEL**:
```bash
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (使用Homebrew)**:
```bash
brew install postgresql
brew services start postgresql
```

**Windows**:
从官方网站下载安装程序: https://www.postgresql.org/download/windows/

### 基本配置

PostgreSQL 的主要配置文件:

- **postgresql.conf**: 主要配置参数
- **pg_hba.conf**: 客户端认证配置
- **pg_ident.conf**: 用户名映射

基本配置示例 (postgresql.conf):
```
# 内存设置
shared_buffers = 256MB          # 建议为系统内存的1/4
work_mem = 16MB                 # 单个操作的内存限制
maintenance_work_mem = 64MB     # 维护操作的内存

# 连接设置
max_connections = 100           # 最大连接数

# WAL 设置
wal_level = replica             # 对于复制或恢复需要

# 查询规划
random_page_cost = 1.1          # 对SSD优化的设置
```

## 基本操作

### 连接到数据库

```bash
# 本地连接
psql -U username -d database_name

# 远程连接
psql -h hostname -U username -d database_name -p 5432
```

### 数据库管理

```sql
-- 创建数据库
CREATE DATABASE mydatabase;

-- 列出所有数据库
\l

-- 切换到指定数据库
\c mydatabase

-- 删除数据库
DROP DATABASE mydatabase;
```

### 用户管理

```sql
-- 创建用户
CREATE USER myuser WITH PASSWORD 'mypassword';

-- 创建角色
CREATE ROLE myrole WITH LOGIN PASSWORD 'mypassword';

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;

-- 撤销权限
REVOKE ALL PRIVILEGES ON DATABASE mydatabase FROM myuser;

-- 列出所有用户
\du
```

## 数据类型

PostgreSQL 支持丰富的数据类型：

### 基本数据类型

```sql
-- 数值类型
smallint           -- 2字节整数
integer            -- 4字节整数
bigint             -- 8字节整数
decimal(p, s)      -- 精确十进制数
numeric(p, s)      -- 精确十进制数
real               -- 单精度浮点数
double precision   -- 双精度浮点数

-- 字符类型
char(n)            -- 固定长度字符串
varchar(n)         -- 可变长度字符串
text               -- 无限长度文本

-- 日期/时间类型
date               -- 日期
time               -- 时间
timestamp          -- 日期和时间
interval           -- 时间间隔

-- 布尔类型
boolean            -- true/false

-- 二进制数据
bytea              -- 二进制数据
```

### 特殊数据类型

PostgreSQL 支持许多其他数据库不常见的数据类型：

```sql
-- 几何类型
point              -- 平面上的点
line               -- 无限直线
lseg               -- 线段
box                -- 矩形
path               -- 路径
polygon            -- 多边形
circle             -- 圆

-- 网络地址类型
inet               -- IPv4/IPv6地址
cidr               -- IPv4/IPv6网络
macaddr            -- MAC地址

-- JSON类型
json               -- JSON数据
jsonb              -- 二进制JSON数据（更高效）

-- 数组
integer[]          -- 整数数组
text[]             -- 文本数组
```

示例：
```sql
-- 创建一个包含多种数据类型的表
CREATE TABLE product_catalog (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_available BOOLEAN DEFAULT TRUE,
    tags TEXT[],
    location POINT,
    properties JSONB
);

-- 插入数据
INSERT INTO product_catalog
    (name, description, price, tags, location, properties)
VALUES
    ('Laptop', 'High performance laptop', 999.99,
     ARRAY['electronics', 'computers'],
     POINT(10.5, 20.5),
     '{"brand": "XYZ", "cpu": "i7", "ram": 16, "ssd": true}'::JSONB);
```

## 高级SQL特性

### 窗口函数

窗口函数允许你对数据进行计算，同时保持行的粒度：

```sql
-- 按部门计算员工薪水的排名
SELECT
    employee_name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank
FROM employees;

-- 计算移动平均
SELECT
    date,
    sales,
    AVG(sales) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) as moving_avg
FROM daily_sales;
```

### 公共表表达式 (CTE)

CTE提供了一种编写辅助语句的方法，用于复杂查询：

```sql
-- 使用递归CTE查找组织结构
WITH RECURSIVE subordinates AS (
    -- 查询起点（John的所有直接下属）
    SELECT employee_id, manager_id, name, 1 as depth
    FROM employees
    WHERE name = 'John'

    UNION ALL

    -- 递归查询部分
    SELECT e.employee_id, e.manager_id, e.name, s.depth + 1
    FROM employees e
    JOIN subordinates s ON e.manager_id = s.employee_id
)
SELECT * FROM subordinates ORDER BY depth;
```

### JSON操作

PostgreSQL提供了强大的JSON处理功能：

```sql
-- 从JSON中提取数据
SELECT
    id,
    properties -> 'brand' as brand,
    properties ->> 'cpu' as cpu,  -- ->> 返回文本
    (properties ->> 'ram')::integer as ram_gb
FROM product_catalog;

-- 使用JSON条件过滤
SELECT * FROM product_catalog
WHERE properties @> '{"ssd": true}'::jsonb
AND (properties ->> 'ram')::integer >= 16;

-- 更新JSON字段
UPDATE product_catalog
SET properties = properties || '{"color": "silver"}'::jsonb
WHERE id = 1;
```

## 索引

PostgreSQL支持多种索引类型，每种类型适用于不同的查询模式：

### 常见索引类型

```sql
-- B-tree索引（默认，适合大多数场景）
CREATE INDEX idx_product_name ON product_catalog(name);

-- 多列索引
CREATE INDEX idx_product_dept_date ON orders(department, order_date);

-- 唯一索引
CREATE UNIQUE INDEX idx_unique_email ON users(email);

-- 表达式索引
CREATE INDEX idx_lower_email ON users(LOWER(email));

-- 部分索引
CREATE INDEX idx_active_products ON product_catalog(name)
WHERE is_available = TRUE;

-- GIN索引（适合数组和全文搜索）
CREATE INDEX idx_product_tags ON product_catalog USING GIN(tags);

-- 全文搜索索引
CREATE INDEX idx_product_description ON product_catalog
USING GIN(to_tsvector('english', description));
```

### 使用全文搜索

```sql
-- 基本全文搜索
SELECT name, description
FROM product_catalog
WHERE to_tsvector('english', description) @@ to_tsquery('english', 'high & performance');

-- 带排名的全文搜索
SELECT name, description,
       ts_rank(to_tsvector('english', description), to_tsquery('english', 'high & performance')) as rank
FROM product_catalog
WHERE to_tsvector('english', description) @@ to_tsquery('english', 'high & performance')
ORDER BY rank DESC;
```

## 事务管理

PostgreSQL提供了完整的事务支持，确保数据操作的可靠性：

```sql
-- 基本事务
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- 出错时回滚
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- 假设发生了某些错误...
ROLLBACK;  -- 撤销所有更改

-- 使用保存点
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT transaction_part1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- 如果只想回滚第二部分操作
ROLLBACK TO transaction_part1;
-- 然后继续其他操作...
COMMIT;
```

### 隔离级别

PostgreSQL支持所有标准SQL隔离级别：

```sql
-- 设置会话的隔离级别
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- 其他选项: REPEATABLE READ, SERIALIZABLE

-- 只读事务（性能优化）
BEGIN READ ONLY;
SELECT * FROM large_table;
COMMIT;
```

## 视图和物化视图

### 常规视图

视图是存储的查询，每次访问时都会执行：

```sql
-- 创建视图
CREATE VIEW active_products AS
SELECT * FROM product_catalog WHERE is_available = TRUE;

-- 使用视图
SELECT * FROM active_products WHERE price < 500;

-- 更新视图（如果基础表允许）
CREATE OR REPLACE VIEW active_products AS
SELECT id, name, price FROM product_catalog WHERE is_available = TRUE;
```

### 物化视图

物化视图存储查询结果，提高读取性能：

```sql
-- 创建物化视图
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT
    date_trunc('month', order_date) as month,
    department,
    SUM(amount) as total_sales
FROM orders
GROUP BY 1, 2;

-- 刷新物化视图
REFRESH MATERIALIZED VIEW monthly_sales;

-- 并发刷新（不阻塞读取）
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;
```

## 存储过程和函数

PostgreSQL允许用多种语言创建自定义函数：

```sql
-- 简单SQL函数
CREATE OR REPLACE FUNCTION get_product_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM product_catalog);
END;
$$ LANGUAGE plpgsql;

-- 带参数的函数
CREATE OR REPLACE FUNCTION get_products_by_price(min_price NUMERIC, max_price NUMERIC)
RETURNS SETOF product_catalog AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM product_catalog
    WHERE price BETWEEN min_price AND max_price;
END;
$$ LANGUAGE plpgsql;

-- 使用函数
SELECT get_product_count();
SELECT * FROM get_products_by_price(100, 500);
```

### 触发器

触发器在表发生指定事件时自动执行：

```sql
-- 创建触发器函数
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER set_last_modified
BEFORE UPDATE ON product_catalog
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
```

## 分区表

分区表将一个大表分割成多个物理部分，提高查询性能：

```sql
-- 创建分区表
CREATE TABLE measurements (
    city_id         int not null,
    logdate         date not null,
    temperature     int,
    humidity        int
) PARTITION BY RANGE (logdate);

-- 创建分区
CREATE TABLE measurements_y2022m01 PARTITION OF measurements
    FOR VALUES FROM ('2022-01-01') TO ('2022-02-01');

CREATE TABLE measurements_y2022m02 PARTITION OF measurements
    FOR VALUES FROM ('2022-02-01') TO ('2022-03-01');

-- 按多个键分区
CREATE TABLE sales (
    sale_date       date not null,
    region          text not null,
    amount          numeric,
    customer_id     integer
) PARTITION BY RANGE (sale_date, region);

-- 列表分区
CREATE TABLE sales_regions (
    region          text not null,
    product         text,
    amount          numeric
) PARTITION BY LIST (region);

CREATE TABLE sales_americas PARTITION OF sales_regions
    FOR VALUES IN ('North America', 'South America');

CREATE TABLE sales_europe PARTITION OF sales_regions
    FOR VALUES IN ('Europe');
```

## 数据导入导出

### 数据导入

```sql
-- 从CSV文件导入
COPY employees(id, name, department, salary)
FROM '/path/to/employees.csv'
DELIMITER ','
CSV HEADER;

-- 使用客户端程序导入
\copy employees(id, name, department, salary) FROM '/path/to/employees.csv' DELIMITER ',' CSV HEADER;
```

### 数据导出

```sql
-- 导出到CSV文件
COPY employees TO '/path/to/employees_export.csv' DELIMITER ',' CSV HEADER;

-- 使用客户端程序导出（无需服务器文件系统权限）
\copy (SELECT * FROM employees WHERE department = 'IT') TO '/path/to/it_employees.csv' DELIMITER ',' CSV HEADER;
```

## 备份与恢复

### 逻辑备份

```bash
# 备份整个数据库集群
pg_dumpall > full_backup.sql

# 备份单个数据库
pg_dump database_name > database_backup.sql

# 备份为自定义格式（支持并行恢复和按表恢复）
pg_dump -Fc database_name > database_backup.dump

# 恢复数据库
psql -f full_backup.sql postgres
psql -f database_backup.sql database_name

# 恢复自定义格式
pg_restore -d database_name database_backup.dump
```

### 点播恢复

PostgreSQL支持时间点恢复（PITR）：

1. 首先，配置连续存档（WAL归档）：
```
# 在postgresql.conf中
wal_level = replica
archive_mode = on
archive_command = 'cp %p /archive_path/%f'
```

2. 执行基础备份：
```bash
pg_basebackup -D backup_dir -Ft -z
```

3. 恢复到特定时间点：
```bash
# 在recovery.conf（PostgreSQL 12以前）或postgresql.conf（PostgreSQL 12及以后）中
restore_command = 'cp /archive_path/%f %p'
recovery_target_time = '2023-01-15 14:30:00'
```

## 性能监控与优化

### 查询分析

```sql
-- 启用查询统计
CREATE EXTENSION pg_stat_statements;

-- 分析查询执行计划
EXPLAIN SELECT * FROM product_catalog WHERE name LIKE 'Laptop%';

-- 带执行时间的分析
EXPLAIN ANALYZE SELECT * FROM product_catalog WHERE name LIKE 'Laptop%';

-- 显示缓冲区命中/未命中
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM product_catalog WHERE name LIKE 'Laptop%';
```

### 监控统计信息

```sql
-- 表统计
SELECT * FROM pg_stat_user_tables;

-- 索引使用情况
SELECT * FROM pg_stat_user_indexes;

-- 慢查询
SELECT * FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- 检查表膨胀
SELECT
  schemaname, relname,
  n_dead_tup, n_live_tup,
  round(n_dead_tup * 100.0 / nullif(n_live_tup + n_dead_tup, 0), 2) AS dead_percentage
FROM pg_stat_user_tables
ORDER BY dead_percentage DESC NULLS LAST;
```

### 常见优化操作

```sql
-- 清理表（回收空间）
VACUUM (VERBOSE, ANALYZE) table_name;

-- 重建索引
REINDEX TABLE table_name;

-- 完全重写表（更彻底但锁表时间更长）
VACUUM FULL table_name;

-- 优化表（分析统计信息）
ANALYZE table_name;
```

## 扩展系统

PostgreSQL 的一大优势是它的扩展性：

```sql
-- 查看可用扩展
SELECT * FROM pg_available_extensions;

-- 安装扩展
CREATE EXTENSION postgis;           -- 地理信息系统
CREATE EXTENSION pg_stat_statements; -- 查询统计
CREATE EXTENSION pg_trgm;           -- 文本相似度和索引
CREATE EXTENSION hstore;            -- 键值对存储
CREATE EXTENSION uuid-ossp;         -- UUID生成

-- 使用扩展
-- PostGIS示例
SELECT ST_Distance(
    ST_GeographyFromText('POINT(-118.4079 33.9434)'), -- Los Angeles
    ST_GeographyFromText('POINT(-122.4194 37.7749)')  -- San Francisco
);
```

## 总结

PostgreSQL 是一个功能丰富、标准兼容且高度可扩展的关系型数据库系统。它适合从简单的Web应用到复杂的企业数据仓库等各种应用场景。

随着你对 PostgreSQL 的深入使用，可以进一步探索其高级特性，如：

- 逻辑复制和发布/订阅
- 外部数据包装器 (FDW)
- 表继承和对象关系映射
- 自定义数据类型和操作符
- 并行查询处理
- 多版本并发控制 (MVCC) 的内部工作机制

PostgreSQL的社区非常活跃，官方文档也非常全面，这些都是深入学习的宝贵资源。