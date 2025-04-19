# MongoDB 入门到精通

MongoDB 是一个基于分布式文件存储的开源文档数据库，设计用于现代应用程序开发和云时代。它属于 NoSQL 数据库的一种，以灵活的文档模型、强大的查询能力和易于扩展的特性而著称。

## MongoDB 基础概念

### 文档模型

MongoDB 中的基本数据单元是文档(Document)，它是由字段和值对组成的数据结构，类似于 JSON 对象：

```javascript
{
   _id: ObjectId("5f8d3b7e9d3b3e001b5e8e1d"),
   name: "John Doe",
   age: 30,
   email: "john@example.com",
   address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345"
   },
   tags: ["developer", "mongodb", "javascript"],
   active: true,
   created_at: ISODate("2023-01-15T08:00:00Z")
}
```

特点：
- 字段可以包含其他文档、数组和数组文档
- 无需提前定义结构（无模式）
- 动态模式，同一集合中的文档可以有不同的字段
- 支持各种数据类型：字符串、数字、布尔值、日期、ObjectID、二进制数据等

### 数据组织

MongoDB 以下列方式组织数据：

- **数据库(Database)**: 包含集合，类似于关系型数据库中的数据库
- **集合(Collection)**: 文档的分组，类似于关系型数据库中的表
- **文档(Document)**: 数据记录，类似于关系型数据库中的行

一个 MongoDB 服务器可以管理多个数据库，每个数据库包含多个集合，每个集合包含多个文档。

### 主要特性

- **灵活的数据模型**: 允许存储复杂的层次关系
- **强大的查询语言**: 支持丰富的查询操作
- **高可用性**: 通过副本集提供自动故障转移
- **水平可扩展性**: 通过分片扩展数据容量
- **聚合框架**: 用于数据转换和处理
- **文本搜索**: 集成的全文搜索功能
- **地理空间索引**: 支持地理位置查询
- **索引支持**: 多种索引类型优化查询性能

## 安装与配置

### 安装 MongoDB

#### 在 Linux (Ubuntu) 上安装

```bash
# 导入公钥
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# 添加 MongoDB 源
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 更新包数据库
sudo apt-get update

# 安装 MongoDB
sudo apt-get install -y mongodb-org

# 启动 MongoDB
sudo systemctl start mongod

# 设置开机启动
sudo systemctl enable mongod
```

#### 在 macOS 上安装 (使用 Homebrew)

```bash
# 安装 MongoDB
brew tap mongodb/brew
brew install mongodb-community

# 启动 MongoDB
brew services start mongodb-community
```

#### 在 Windows 上安装

1. 下载 MongoDB 安装程序: https://www.mongodb.com/try/download/community
2. 运行安装程序并按照向导操作
3. 选择"作为服务运行 MongoDB"
4. 完成安装后，MongoDB 服务应该自动启动

### 基本配置

MongoDB 的主要配置文件是 mongod.conf。以下是一些常见配置选项：

```yaml
# 存储配置
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

# 网络配置
net:
  port: 27017
  bindIp: 127.0.0.1

# 安全配置
security:
  authorization: enabled

# 复制集配置
replication:
  replSetName: "rs0"

# 日志配置
systemLog:
  destination: file
  path: "/var/log/mongodb/mongod.log"
  logAppend: true
```

## MongoDB Shell (mongosh)

MongoDB Shell 是用于与 MongoDB 交互的命令行工具。

### 连接到 MongoDB

```bash
# 连接到本地 MongoDB 服务器
mongosh

# 连接到特定数据库
mongosh mydatabase

# 连接到远程服务器
mongosh "mongodb://username:password@hostname:port/database"

# 使用 URI 连接，包含认证和其他选项
mongosh "mongodb://username:password@hostname:port/database?authSource=admin&replicaSet=rs0"
```

### 基本操作

```javascript
// 显示数据库列表
show dbs

// 切换/创建数据库
use mydatabase

// 显示当前数据库中的集合
show collections

// 创建集合
db.createCollection("users")

// 删除集合
db.users.drop()

// 删除当前数据库
db.dropDatabase()

// 显示帮助信息
help
```

## CRUD 操作

### 创建操作 (Create)

```javascript
// 插入单个文档
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  created_at: new Date()
})

// 插入多个文档
db.users.insertMany([
  {
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25,
    created_at: new Date()
  },
  {
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 35,
    created_at: new Date()
  }
])

// 插入单个文档（旧语法）
db.users.insert({
  name: "Alex Brown",
  email: "alex@example.com",
  age: 28
})
```

### 读取操作 (Read)

```javascript
// 查询所有文档
db.users.find()

// 带格式化输出
db.users.find().pretty()

// 查询特定条件
db.users.find({ age: 30 })

// 使用比较操作符
db.users.find({ age: { $gt: 25 } }) // 大于25岁

// 使用AND条件
db.users.find({
  age: { $gt: 25 },
  email: /example.com$/
})

// 使用OR条件
db.users.find({
  $or: [
    { age: { $lt: 25 } },
    { age: { $gt: 35 } }
  ]
})

// 查询嵌套字段
db.users.find({ "address.city": "Anytown" })

// 查询数组包含
db.users.find({ tags: "mongodb" })

// 只返回特定字段
db.users.find({ age: { $gt: 25 } }, { name: 1, email: 1, _id: 0 })

// 限制结果数量
db.users.find().limit(5)

// 跳过结果（用于分页）
db.users.find().skip(10).limit(5)

// 排序结果
db.users.find().sort({ age: 1 }) // 1表示升序，-1表示降序

// 计数
db.users.countDocuments({ age: { $gt: 25 } })

// 查询一个文档
db.users.findOne({ email: "john@example.com" })
```

### 更新操作 (Update)

```javascript
// 更新单个文档
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { age: 31, updated_at: new Date() } }
)

// 更新多个文档
db.users.updateMany(
  { age: { $lt: 30 } },
  { $set: { status: "young" } }
)

// 替换整个文档
db.users.replaceOne(
  { email: "john@example.com" },
  {
    name: "John Doe",
    email: "john@example.com",
    age: 32,
    address: {
      city: "New City",
      state: "NY"
    },
    updated_at: new Date()
  }
)

// 使用更新操作符
db.users.updateOne(
  { email: "john@example.com" },
  {
    $inc: { age: 1 },            // 增加字段值
    $push: { tags: "nodejs" },   // 添加到数组
    $currentDate: { lastModified: true } // 设置为当前日期
  }
)

// 更新不存在则插入（upsert）
db.users.updateOne(
  { email: "newuser@example.com" },
  { $set: { name: "New User", age: 40 } },
  { upsert: true }
)
```

### 删除操作 (Delete)

```javascript
// 删除单个文档
db.users.deleteOne({ email: "john@example.com" })

// 删除多个文档
db.users.deleteMany({ age: { $lt: 25 } })

// 删除集合中所有文档
db.users.deleteMany({})
```

## 高级查询

### 查询操作符

```javascript
// 比较操作符
$eq  - 等于
$ne  - 不等于
$gt  - 大于
$gte - 大于等于
$lt  - 小于
$lte - 小于等于
$in  - 在指定数组内
$nin - 不在指定数组内

// 示例
db.products.find({ price: { $gte: 100, $lte: 200 } })
db.products.find({ category: { $in: ["electronics", "computers"] } })

// 逻辑操作符
$and - 所有条件都满足
$or  - 至少一个条件满足
$not - 条件不满足
$nor - 所有条件都不满足

// 示例
db.products.find({
  $and: [
    { price: { $gte: 100 } },
    { category: "electronics" },
    { stock: { $gt: 0 } }
  ]
})

// 元素操作符
$exists - 字段存在
$type   - 字段类型匹配

// 示例
db.users.find({ phone: { $exists: true } })
db.users.find({ age: { $type: "number" } })

// 评估操作符
$regex - 正则表达式匹配
$expr  - 允许聚合表达式
$mod   - 取模运算

// 示例
db.users.find({ name: { $regex: /^J/, $options: "i" } })
db.sales.find({ $expr: { $gt: ["$actual", "$target"] } })

// 数组操作符
$all    - 数组包含所有指定元素
$elemMatch - 数组元素满足所有指定条件
$size   - 数组大小

// 示例
db.products.find({ tags: { $all: ["laptop", "gaming"] } })
db.students.find({
  scores: { $elemMatch: { subject: "math", score: { $gt: 80 } } }
})
db.products.find({ colors: { $size: 3 } })
```

## 聚合框架

MongoDB的聚合框架提供了强大的数据处理功能，类似于SQL中的GROUP BY操作，但功能更加丰富。

### 聚合管道

聚合管道由多个阶段组成，每个阶段对数据进行不同的操作。

```javascript
db.collection.aggregate([
  { $stage1: { <stage1 options> } },
  { $stage2: { <stage2 options> } },
  ...
])
```

### 常用聚合阶段

```javascript
// $match: 过滤文档
db.sales.aggregate([
  { $match: { date: { $gte: new Date("2023-01-01"), $lt: new Date("2023-02-01") } } }
])

// $group: 分组操作
db.sales.aggregate([
  { $match: { date: { $gte: new Date("2023-01-01"), $lt: new Date("2024-01-01") } } },
  { $group: {
      _id: { $month: "$date" },
      total: { $sum: "$amount" },
      count: { $sum: 1 },
      avg: { $avg: "$amount" },
      min: { $min: "$amount" },
      max: { $max: "$amount" }
    }
  },
  { $sort: { _id: 1 } }
])

// $project: 投影（选择、重命名、计算字段）
db.users.aggregate([
  { $project: {
      _id: 0,
      name: 1,
      email: 1,
      age: 1,
      ageGroup: {
        $switch: {
          branches: [
            { case: { $lt: ["$age", 18] }, then: "under 18" },
            { case: { $lt: ["$age", 30] }, then: "18-29" },
            { case: { $lt: ["$age", 50] }, then: "30-49" }
          ],
          default: "50+"
        }
      }
    }
  }
])

// $unwind: 展开数组
db.products.aggregate([
  { $unwind: "$tags" },
  { $group: {
      _id: "$tags",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
])

// $lookup: 连接操作（类似SQL的JOIN）
db.orders.aggregate([
  { $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  { $project: {
      _id: 1,
      order_date: 1,
      amount: 1,
      "user.name": 1,
      "user.email": 1
    }
  }
])

// $sort: 排序
db.products.aggregate([
  { $match: { category: "electronics" } },
  { $sort: { price: -1 } }
])

// $limit 和 $skip: 分页
db.products.aggregate([
  { $match: { category: "electronics" } },
  { $sort: { price: -1 } },
  { $skip: 10 },
  { $limit: 5 }
])

// $facet: 多管道操作
db.products.aggregate([
  { $match: { category: "electronics" } },
  { $facet: {
      "priceStats": [
        { $group: {
            _id: null,
            avg: { $avg: "$price" },
            min: { $min: "$price" },
            max: { $max: "$price" }
          }
        }
      ],
      "topProducts": [
        { $sort: { rating: -1 } },
        { $limit: 5 },
        { $project: { name: 1, price: 1, rating: 1 } }
      ],
      "countByBrand": [
        { $group: {
            _id: "$brand",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]
    }
  }
])
```

### 聚合表达式操作符

```javascript
// 算术操作符
$add, $subtract, $multiply, $divide, $mod

// 字符串操作符
$concat, $toLower, $toUpper, $substr, $strLenCP

// 日期操作符
$year, $month, $dayOfMonth, $hour, $minute, $second

// 条件操作符
$cond, $ifNull, $switch

// 示例
db.sales.aggregate([
  { $project: {
      sale_date: 1,
      amount: 1,
      tax: { $multiply: ["$amount", 0.1] },
      total: { $multiply: ["$amount", 1.1] },
      month: { $month: "$sale_date" },
      year: { $year: "$sale_date" },
      status: {
        $cond: {
          if: { $gte: ["$amount", 1000] },
          then: "large",
          else: "small"
        }
      }
    }
  }
])
```

## 索引

索引可以提高查询性能，支持高效的数据检索。

### 索引类型

```javascript
// 单字段索引
db.users.createIndex({ email: 1 })  // 1表示升序，-1表示降序

// 复合索引
db.products.createIndex({ category: 1, price: -1 })

// 多键索引（适用于数组字段）
db.products.createIndex({ tags: 1 })

// 哈希索引
db.users.createIndex({ username: "hashed" })

// 地理空间索引
db.places.createIndex({ location: "2dsphere" })
db.legacy_coordinates.createIndex({ coords: "2d" })

// 文本索引
db.articles.createIndex({ title: "text", content: "text" })

// 通配符索引（MongoDB 4.2+）
db.products.createIndex({ "specs.$**": 1 })
```

### 索引属性和选项

```javascript
// 唯一索引
db.users.createIndex({ email: 1 }, { unique: true })

// 稀疏索引（只为包含索引字段的文档创建索引）
db.users.createIndex({ phone: 1 }, { sparse: true })

// TTL索引（自动删除过期文档）
db.sessions.createIndex({ lastAccess: 1 }, { expireAfterSeconds: 3600 })

// 部分索引（只为符合过滤条件的文档创建索引）
db.products.createIndex(
  { price: 1 },
  { partialFilterExpression: { price: { $gt: 100 } } }
)

// 后台创建索引
db.large_collection.createIndex({ field: 1 }, { background: true })
```

### 索引管理

```javascript
// 列出集合上的所有索引
db.users.getIndexes()

// 删除特定索引
db.users.dropIndex("email_1")

// 删除所有索引（保留_id索引）
db.users.dropIndexes()

// 隐藏/显示索引（不删除索引但停止使用）
db.users.hideIndex("email_1")
db.users.unhideIndex("email_1")
```

### 索引使用分析

```javascript
// 执行计划分析
db.users.find({ age: { $gt: 30 } }).explain()

// 详细的执行计划
db.users.find({ age: { $gt: 30 } }).explain("executionStats")

// 索引使用情况
db.stats()
db.collection.stats()
```

## 数据建模

### 文档建模策略

#### 1. 嵌入式文档

适合一对一和一对少量的关系。

```javascript
// 用户文档包含地址信息
{
  _id: ObjectId("..."),
  name: "John Smith",
  email: "john@example.com",
  addresses: [
    {
      type: "home",
      street: "123 Main St",
      city: "Anytown",
      state: "NY",
      zip: "10001"
    },
    {
      type: "work",
      street: "456 Market St",
      city: "Worktown",
      state: "CA",
      zip: "20001"
    }
  ]
}
```

优点：
- 一次查询获取所有相关数据
- 原子性更新
- 无需连接操作

缺点：
- 文档大小限制（16MB）
- 不适合频繁更新的嵌入文档
- 不适合大量子文档

#### 2. 引用式文档

适合一对多和多对多的关系。

```javascript
// 用户文档
{
  _id: ObjectId("user1"),
  name: "John Smith",
  email: "john@example.com"
}

// 订单文档
{
  _id: ObjectId("order1"),
  user_id: ObjectId("user1"),
  items: [
    { product_id: ObjectId("prod1"), quantity: 2, price: 19.99 },
    { product_id: ObjectId("prod2"), quantity: 1, price: 29.99 }
  ],
  total: 69.97,
  order_date: ISODate("2023-01-15")
}
```

优点：
- 避免数据重复
- 支持复杂关系
- 适合大量相关文档

缺点：
- 需要多次查询
- 非原子性操作
- 应用层需处理数据关联

### 常见模式

#### 子集模式

针对大文档，存储最常用的字段子集。

```javascript
// 完整产品文档
{
  _id: ObjectId("prod1"),
  name: "Smartphone X",
  price: 699,
  description: "High-end smartphone with...",
  specs: { /* 详细规格... */ },
  reviews: [ /* 用户评论... */ ],
  images: [ /* 多张图片URL... */ ]
}

// 产品列表子集
{
  _id: ObjectId("prod1"),
  name: "Smartphone X",
  price: 699,
  thumbnail: "url-to-thumbnail"
}
```

#### 计算模式

预先计算和存储常用的聚合结果。

```javascript
// 订单文档
{
  _id: ObjectId("order1"),
  user_id: ObjectId("user1"),
  items: [ /* 订单项... */ ],
  total: 69.97,
  status: "completed",
  created_at: ISODate("2023-01-15")
}

// 用户统计文档
{
  _id: ObjectId("user1"),
  name: "John Smith",
  order_stats: {
    count: 12,
    total_spent: 847.65,
    avg_order_value: 70.64,
    last_order_date: ISODate("2023-01-15")
  }
}
```

#### 桶模式

将时间序列数据分组到固定大小的文档中。

```javascript
// 每小时传感器读数桶
{
  _id: ObjectId("..."),
  sensor_id: "temp1",
  date: ISODate("2023-01-15T10:00:00Z"),
  measurements: [
    { time: ISODate("2023-01-15T10:01:30Z"), value: 22.5 },
    { time: ISODate("2023-01-15T10:02:30Z"), value: 22.6 },
    // ... 这个小时的更多读数
  ],
  stats: {
    min: 22.1,
    max: 23.4,
    avg: 22.7
  }
}
```

## 事务

MongoDB 4.0 引入了多文档事务支持，4.2 扩展到分片集群。

### 事务基础

```javascript
// 启动会话
const session = db.getMongo().startSession();

// 开始事务
session.startTransaction();

try {
  // 执行操作
  session.getDatabase("mydb").accounts.updateOne(
    { _id: "account1" },
    { $inc: { balance: -100 } }
  );

  session.getDatabase("mydb").accounts.updateOne(
    { _id: "account2" },
    { $inc: { balance: 100 } }
  );

  // 如果成功，提交事务
  session.commitTransaction();
} catch (error) {
  // 如果出错，中止事务
  session.abortTransaction();
  console.error("Transaction aborted:", error);
} finally {
  // 结束会话
  session.endSession();
}
```

### 事务注意事项

- 事务在分片集群中有一些限制
- 性能开销比单文档操作高
- 默认超时时间为60秒
- 事务中的操作限制为16MB
- 应仅在必要时使用

## 总结

MongoDB 作为一个灵活的文档数据库，适用于各种现代应用场景：

- 内容管理系统
- 移动应用后端
- 实时分析
- 物联网数据存储
- 社交媒体平台
- 目录和产品管理

通过掌握本文涵盖的概念和技术，你可以有效地使用MongoDB构建高性能、可扩展的应用程序。

随着经验的积累，你可以进一步探索MongoDB的高级功能：
- 分片集群部署
- 全文搜索优化
- 变更流 (Change Streams)
- 图表分析功能
- MongoDB Atlas (云服务)
- MongoDB Realm (移动端同步)