# SQL 基础语法

SQL（Structured Query Language）是用于管理关系型数据库的标准语言。本文介绍SQL的基础语法和常用操作。

## 数据定义语言 (DDL)

### 创建数据库

```sql
CREATE DATABASE database_name;

-- 示例
CREATE DATABASE bookstore;
```

### 创建表

```sql
CREATE TABLE table_name (
    column1 datatype constraints,
    column2 datatype constraints,
    ...
);

-- 示例
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(50) NOT NULL,
    publication_year INT,
    price DECIMAL(10, 2),
    in_stock BOOLEAN DEFAULT true
);
```

### 修改表

```sql
-- 添加列
ALTER TABLE table_name
ADD column_name datatype constraints;

-- 示例
ALTER TABLE books
ADD category VARCHAR(50);

-- 修改列
ALTER TABLE table_name
MODIFY COLUMN column_name new_datatype new_constraints;

-- 示例
ALTER TABLE books
MODIFY COLUMN title VARCHAR(200) NOT NULL;

-- 删除列
ALTER TABLE table_name
DROP COLUMN column_name;

-- 示例
ALTER TABLE books
DROP COLUMN in_stock;
```

### 删除表和数据库

```sql
-- 删除表
DROP TABLE table_name;

-- 示例
DROP TABLE books;

-- 删除数据库
DROP DATABASE database_name;

-- 示例
DROP DATABASE bookstore;
```

## 数据操作语言 (DML)

### 插入数据

```sql
-- 完整语法
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);

-- 示例
INSERT INTO books (title, author, publication_year, price)
VALUES ('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 12.99);

-- 插入多行
INSERT INTO books (title, author, publication_year, price)
VALUES
    ('To Kill a Mockingbird', 'Harper Lee', 1960, 14.99),
    ('1984', 'George Orwell', 1949, 11.99);
```

### 更新数据

```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;

-- 示例
UPDATE books
SET price = 13.99, in_stock = false
WHERE id = 1;
```

### 删除数据

```sql
DELETE FROM table_name
WHERE condition;

-- 示例
DELETE FROM books
WHERE publication_year < 1950;

-- 删除所有数据
DELETE FROM books;
-- 或者
TRUNCATE TABLE books;
```

## 数据查询语言 (DQL)

### 基本查询

```sql
SELECT column1, column2, ...
FROM table_name;

-- 选择所有列
SELECT * FROM books;

-- 选择特定列
SELECT title, author, price FROM books;
```

### 条件查询 (WHERE)

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;

-- 示例
SELECT * FROM books
WHERE price < 15.00;

-- 多条件（AND, OR, NOT）
SELECT * FROM books
WHERE price < 15.00 AND publication_year > 1950;

SELECT * FROM books
WHERE author = 'George Orwell' OR author = 'Harper Lee';

SELECT * FROM books
WHERE NOT in_stock = false;
```

### 排序 (ORDER BY)

```sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC], ...;

-- 示例
SELECT * FROM books
ORDER BY publication_year ASC;

SELECT * FROM books
ORDER BY price DESC, title ASC;
```

### 限制结果 (LIMIT)

```sql
SELECT column1, column2, ...
FROM table_name
LIMIT number;

-- 示例
SELECT * FROM books
LIMIT 5;

-- 带偏移的限制（分页）
SELECT * FROM books
LIMIT 5 OFFSET 10; -- 返回第11-15条记录
```

### 分组 (GROUP BY)

```sql
SELECT column1, aggregate_function(column2)
FROM table_name
GROUP BY column1;

-- 示例
SELECT author, COUNT(*) as book_count
FROM books
GROUP BY author;

SELECT publication_year, AVG(price) as avg_price
FROM books
GROUP BY publication_year;
```

### 过滤分组 (HAVING)

```sql
SELECT column1, aggregate_function(column2)
FROM table_name
GROUP BY column1
HAVING condition;

-- 示例
SELECT author, COUNT(*) as book_count
FROM books
GROUP BY author
HAVING COUNT(*) > 1;
```

## 连接查询

### 内连接 (INNER JOIN)

```sql
SELECT a.column1, b.column2, ...
FROM table1 a
INNER JOIN table2 b ON a.common_field = b.common_field;

-- 示例
SELECT books.title, authors.name as author_name
FROM books
INNER JOIN authors ON books.author_id = authors.id;
```

### 左连接 (LEFT JOIN)

```sql
SELECT a.column1, b.column2, ...
FROM table1 a
LEFT JOIN table2 b ON a.common_field = b.common_field;

-- 示例
SELECT books.title, reviews.content
FROM books
LEFT JOIN reviews ON books.id = reviews.book_id;
```

### 右连接 (RIGHT JOIN)

```sql
SELECT a.column1, b.column2, ...
FROM table1 a
RIGHT JOIN table2 b ON a.common_field = b.common_field;

-- 示例
SELECT authors.name, books.title
FROM books
RIGHT JOIN authors ON books.author_id = authors.id;
```

### 全连接 (FULL JOIN)

```sql
SELECT a.column1, b.column2, ...
FROM table1 a
FULL JOIN table2 b ON a.common_field = b.common_field;

-- 示例
SELECT authors.name, books.title
FROM authors
FULL JOIN books ON authors.id = books.author_id;
```

## 子查询

```sql
SELECT column1, column2, ...
FROM table1
WHERE column1 IN (SELECT column1 FROM table2 WHERE condition);

-- 示例
SELECT * FROM books
WHERE author_id IN (SELECT id FROM authors WHERE nationality = 'American');

-- 子查询作为表
SELECT a.title, b.avg_price
FROM books a
JOIN (SELECT author_id, AVG(price) as avg_price FROM books GROUP BY author_id) b
ON a.author_id = b.author_id;
```

## 函数

### 聚合函数

```sql
-- COUNT: 计数
SELECT COUNT(*) FROM books;
SELECT COUNT(DISTINCT author) FROM books;

-- SUM: 求和
SELECT SUM(price) FROM books;

-- AVG: 平均值
SELECT AVG(price) FROM books;

-- MAX/MIN: 最大值/最小值
SELECT MAX(price), MIN(price) FROM books;
```

### 字符串函数

```sql
-- CONCAT: 连接字符串
SELECT CONCAT(title, ' by ', author) AS book_info FROM books;

-- UPPER/LOWER: 转换大小写
SELECT UPPER(title), LOWER(author) FROM books;

-- LENGTH: 字符串长度
SELECT title, LENGTH(title) AS title_length FROM books;

-- SUBSTRING: 提取子串
SELECT SUBSTRING(title, 1, 10) FROM books;
```

### 日期和时间函数

```sql
-- 获取当前日期/时间
SELECT CURRENT_DATE(), CURRENT_TIME(), NOW();

-- 日期提取
SELECT YEAR(publication_date), MONTH(publication_date), DAY(publication_date)
FROM books;

-- 日期计算
SELECT title, DATEDIFF(NOW(), publication_date) AS days_since_publication
FROM books;
```

## 事务控制语言 (TCL)

```sql
-- 开始事务
BEGIN TRANSACTION;
-- 或
START TRANSACTION;

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;

-- 设置保存点
SAVEPOINT savepoint_name;

-- 回滚到保存点
ROLLBACK TO savepoint_name;
```

## 视图

```sql
-- 创建视图
CREATE VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;

-- 示例
CREATE VIEW recent_books AS
SELECT * FROM books
WHERE publication_year > 2000;

-- 使用视图
SELECT * FROM recent_books;

-- 修改视图
ALTER VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;

-- 删除视图
DROP VIEW view_name;
```

## 索引

```sql
-- 创建索引
CREATE INDEX index_name
ON table_name (column1, column2, ...);

-- 示例
CREATE INDEX idx_author
ON books (author);

-- 创建唯一索引
CREATE UNIQUE INDEX idx_isbn
ON books (isbn);

-- 删除索引
DROP INDEX index_name ON table_name;
```

## 总结

SQL是一门强大的数据库查询语言，掌握这些基础语法能够帮助你有效地管理和操作关系型数据库。随着实践的深入，你可以进一步学习更高级的SQL技术，如存储过程、触发器、窗口函数等。

本指南涵盖了SQL的基础语法，适用于大多数关系型数据库，包括MySQL、PostgreSQL、SQL Server和Oracle。不同数据库可能在语法细节上有所差异，请参考特定数据库的官方文档以获取更准确的信息。