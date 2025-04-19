# RESTful API 设计

## 什么是REST

REST（Representational State Transfer，表现层状态转移）是一种软件架构风格，由Roy Fielding在2000年的博士论文中提出。它是一组设计原则和约束条件，用于构建能够充分利用Web基础架构的分布式系统。RESTful API是基于REST原则设计的应用程序编程接口。

### REST 架构约束

REST架构基于以下六个主要约束：

1. **客户端-服务器架构**：关注点分离，使客户端和服务器能独立发展
2. **无状态**：服务器不保存客户端状态，每个请求必须包含所有所需信息
3. **可缓存**：响应明确表示是否可缓存，以提高性能
4. **统一接口**：资源识别、表现层、自描述消息、超媒体作为应用状态引擎(HATEOAS)
5. **分层系统**：组件只能看到与其交互的相邻层
6. **按需代码（可选）**：客户端可以下载并执行服务器提供的代码

## REST 设计原则

### 1. 资源为核心

REST以资源为中心，资源是任何可命名的实体，如用户、文章或产品。

**设计指南**：
- 使用名词表示资源（如`/users`而非`/getUsers`）
- 使用复数形式表示集合（`/products`而非`/product`）
- 使用具体名称而非抽象概念（`/tickets`而非`/management`）

### 2. HTTP方法的正确使用

利用HTTP方法表示对资源的操作。

| HTTP方法 | 用途 | 特性 |
|---------|------|------|
| GET | 读取资源 | 安全、幂等、可缓存 |
| POST | 创建资源 | 非幂等 |
| PUT | 全量更新资源 | 幂等 |
| PATCH | 部分更新资源 | 可能非幂等 |
| DELETE | 删除资源 | 幂等 |
| HEAD | 获取资源元数据 | 安全、幂等、可缓存 |
| OPTIONS | 获取支持的方法 | 安全、幂等 |

**注意**：
- 安全方法不应修改资源
- 幂等方法多次调用效果与一次调用相同
- 缓存机制适用于GET和HEAD响应

### 3. 合理的URI设计

URI（统一资源标识符）应清晰、一致且具有可预测性。

**最佳实践**：
- 使用小写字母
- 使用连字符（`-`）而非下划线（`_`）
- 避免文件扩展名（`.json`, `.xml`）
- 保持简短但清晰
- 使用嵌套表示关系: `/departments/1/employees`
- 结尾斜杠可选，但应保持一致性

**示例**：
```
# 良好的URI设计
/users
/users/123
/users/123/orders
/products?category=electronics

# 不良的URI设计
/GetUsers
/user_current
/products.json
/api/v1/modify-user
```

### 4. 状态码的正确使用

HTTP状态码应正确反映请求处理的结果。

**常用状态码**：

| 状态码 | 说明 | 使用场景 |
|-------|------|----------|
| 200 OK | 请求成功 | GET请求成功、PUT/PATCH更新成功 |
| 201 Created | 资源创建成功 | POST请求后创建资源成功 |
| 204 No Content | 无返回内容 | DELETE请求成功 |
| 400 Bad Request | 客户端请求错误 | 请求参数验证失败 |
| 401 Unauthorized | 未认证 | 缺少认证信息 |
| 403 Forbidden | 权限不足 | 已认证但权限不足 |
| 404 Not Found | 资源不存在 | 请求不存在的资源 |
| 405 Method Not Allowed | 方法不允许 | 资源不支持该HTTP方法 |
| 409 Conflict | 资源冲突 | 并发更新冲突 |
| 422 Unprocessable Entity | 请求格式正确但语义错误 | 创建资源时验证失败 |
| 429 Too Many Requests | 请求过多 | 超过速率限制 |
| 500 Internal Server Error | 服务器错误 | 服务器内部异常 |
| 503 Service Unavailable | 服务不可用 | 服务暂时过载或维护 |

**设计提示**：
- 使用适当的状态码表达结果
- 避免只使用200返回错误信息
- 提供详细的错误描述

### 5. 资源表示与内容协商

API应支持多种资源表示形式，并通过内容协商机制选择合适的表示。

**内容协商**：
- 使用`Accept`头指定客户端期望的媒体类型
- 使用`Content-Type`头指定响应媒体类型

**常用媒体类型**：
- `application/json`
- `application/xml`
- `application/hal+json`
- `application/vnd.api+json` (JSON:API)

**示例**：
```http
# 请求
GET /users/123 HTTP/1.1
Accept: application/json

# 响应
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 6. 超媒体（HATEOAS）

HATEOAS（Hypermedia as the Engine of Application State）是REST的一个核心约束，让API能够通过超链接提供导航功能。

**实现方式**：
- 在响应中包含相关链接
- 使用标准化的链接格式（如HAL、JSON:API）

**JSON示例** (HAL格式):
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "_links": {
    "self": { "href": "/users/123" },
    "orders": { "href": "/users/123/orders" },
    "edit": { "href": "/users/123", "method": "PUT" },
    "delete": { "href": "/users/123", "method": "DELETE" }
  }
}
```

### 7. 版本控制

API版本控制是管理变更的重要策略，确保向后兼容性和平滑迁移。

**版本控制方法**：

1. **URI路径版本**：
   ```
   /api/v1/users
   /api/v2/users
   ```

2. **查询参数版本**：
   ```
   /api/users?version=1
   /api/users?version=2
   ```

3. **HTTP头版本**：
   ```
   Accept: application/vnd.company.v1+json
   Accept: application/vnd.company.v2+json
   ```

4. **内容协商版本**：
   ```
   Accept-Version: 1.0
   Accept-Version: 2.0
   ```

**最佳实践**：
- 始终使用版本控制，即使是第一个版本
- 尽量保持向后兼容性
- 在不兼容变更时提供合理的迁移期
- 明确记录每个版本的变更

## 安全与身份验证

RESTful API的安全性是设计中至关重要的一环。

### 常用认证方法

1. **基本认证 (Basic Authentication)**
   - 使用HTTP Authorization头部
   - 凭证以Base64编码传输
   - 应搭配HTTPS使用

   ```http
   Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
   ```

2. **API密钥认证**
   - 分配唯一密钥给客户端
   - 通过请求头或查询参数传递

   ```http
   X-API-Key: abcd1234
   ```

   ```
   /api/users?api_key=abcd1234
   ```

3. **OAuth 2.0**
   - 适用于第三方应用授权
   - 支持不同授权流程（授权码、密码、客户端凭证等）
   - 使用访问令牌认证请求

   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **JWT (JSON Web Token)**
   - 自包含令牌，携带用户信息和权限
   - 使用数字签名验证完整性
   - 无需服务器存储会话信息

   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 安全最佳实践

1. **始终使用HTTPS**：加密所有流量
2. **实施速率限制**：防止滥用和DoS攻击
3. **验证所有输入**：防止注入攻击
4. **实现适当的CORS策略**：控制跨域访问
5. **使用短期令牌**：减少泄露影响
6. **实施请求签名**：保证消息完整性

## 数据查询和过滤

### 分页

分页允许客户端分批次获取大量数据，减少响应大小和服务器负载。

**分页实现**：

1. **页码分页**：
   ```
   /api/users?page=2&per_page=10
   ```

2. **基于偏移量的分页**：
   ```
   /api/users?offset=20&limit=10
   ```

3. **基于游标的分页**：
   ```
   /api/users?after=user123&limit=10
   ```

**响应中的分页元数据**：
```json
{
  "data": [...],
  "pagination": {
    "total": 435,
    "per_page": 10,
    "current_page": 2,
    "last_page": 44,
    "next_url": "/api/users?page=3&per_page=10",
    "prev_url": "/api/users?page=1&per_page=10"
  }
}
```

### 过滤、排序和搜索

**过滤**：使用查询参数限制返回结果
```
/api/users?status=active
/api/users?created_at_gte=2022-01-01
```

**排序**：指定结果排序规则
```
/api/users?sort=name
/api/users?sort=-created_at,name
```
注：前缀`-`表示降序排序。

**搜索**：提供全文搜索功能
```
/api/users?q=john
```

**字段选择**：允许客户端指定返回字段
```
/api/users?fields=id,name,email
```

## 错误处理

统一的错误处理机制对API的可用性至关重要。

### 错误响应格式

错误响应应包含足够信息，帮助客户端理解和解决问题。

**示例错误响应**：
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      },
      {
        "field": "age",
        "message": "Must be a positive number"
      }
    ],
    "request_id": "a7c3eff0-8e5a-11ec-b909-0242ac120002"
  }
}
```

### 错误处理最佳实践

1. **使用合适的状态码**：选择最精确的HTTP状态码
2. **提供结构化错误信息**：包含错误代码、消息和详情
3. **附加唯一请求标识符**：便于跟踪和调试
4. **避免技术实现细节**：不暴露堆栈跟踪或敏感错误信息
5. **提供有用的错误信息**：明确指出错误原因和可能的解决方案
6. **使用一致的错误格式**：所有API错误格式保持一致

## 批量操作

有效处理批量操作可提高API的效率和可用性。

### 批量操作设计

**批量获取**：
```
GET /api/users?ids=1,2,3
```

**批量创建**：
```
POST /api/users/batch
Content-Type: application/json

{
  "users": [
    { "name": "John", "email": "john@example.com" },
    { "name": "Jane", "email": "jane@example.com" }
  ]
}
```

**批量更新**：
```
PUT /api/users/batch
Content-Type: application/json

{
  "users": [
    { "id": 1, "name": "John Updated" },
    { "id": 2, "name": "Jane Updated" }
  ]
}
```

**批量删除**：
```
DELETE /api/users?ids=1,2,3
```
或
```
DELETE /api/users/batch
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

### 部分成功处理

批量操作中可能出现部分成功的情况，应明确处理：

```json
{
  "results": [
    {
      "id": 1,
      "status": "success"
    },
    {
      "id": 2,
      "status": "error",
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid email format"
      }
    },
    {
      "id": 3,
      "status": "success"
    }
  ],
  "summary": {
    "total": 3,
    "success": 2,
    "error": 1
  }
}
```

## 性能优化

### 性能优化策略

1. **实施缓存**：
   - 使用Cache-Control和ETag头控制缓存
   - 对GET请求应用缓存策略
   ```http
   Cache-Control: max-age=3600
   ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   ```

2. **压缩响应**：
   - 启用gzip或brotli压缩
   - 减少网络传输数据量
   ```http
   Accept-Encoding: gzip, deflate
   Content-Encoding: gzip
   ```

3. **延迟加载与部分响应**：
   - 提供分页机制
   - 支持字段筛选
   ```
   /api/users?fields=id,name&page=1&per_page=10
   ```

4. **使用CDN**：
   - 将静态资源部署到CDN
   - 减少API服务器负载

5. **启用CORS预检缓存**：
   - 减少OPTIONS请求
   ```http
   Access-Control-Max-Age: 86400
   ```

## 文档化

良好的API文档是API可用性的关键因素。

### 文档组成部分

1. **概述**：API目的和使用场景
2. **认证**：认证方式和流程
3. **端点目录**：所有可用端点及其用途
4. **请求/响应格式**：支持的格式和示例
5. **错误处理**：错误代码和处理方式
6. **速率限制**：限制规则和超限处理
7. **示例代码**：各种语言的使用示例
8. **变更日志**：API版本和变更记录

### 文档工具

1. **OpenAPI/Swagger**：最流行的API文档规范
   ```yaml
   openapi: 3.0.0
   info:
     title: Sample API
     version: 1.0.0
   paths:
     /users:
       get:
         summary: 获取用户列表
         responses:
           '200':
             description: 成功获取用户列表
   ```

2. **API Blueprint**：简洁的API文档格式
3. **RAML**：RESTful API Modeling Language
4. **Postman**：API测试和文档一体化工具

### 自动生成文档

1. **代码注解**：从代码注释生成文档
2. **API网关**：通过API网关自动生成文档
3. **文档生成工具**：如Swagger UI, ReDoc, DapperDox等

## 案例分析与最佳实践

### 案例1：用户管理API

资源路径和HTTP方法：

| 操作 | HTTP方法 | 路径 | 说明 |
|-----|---------|-----|------|
| 获取用户列表 | GET | /users | 返回分页用户列表 |
| 创建用户 | POST | /users | 创建新用户 |
| 获取单个用户 | GET | /users/{id} | 获取特定用户 |
| 更新用户 | PUT | /users/{id} | 全量更新用户 |
| 部分更新 | PATCH | /users/{id} | 部分更新用户 |
| 删除用户 | DELETE | /users/{id} | 删除特定用户 |
| 获取用户订单 | GET | /users/{id}/orders | 获取用户的订单 |

请求与响应示例：

```http
# 获取用户
GET /api/users/123 HTTP/1.1
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2022-03-01T15:30:45Z",
  "_links": {
    "self": { "href": "/api/users/123" },
    "orders": { "href": "/api/users/123/orders" }
  }
}
```

```http
# 创建用户
POST /api/users HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123"
}

HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/124

{
  "id": 124,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "created_at": "2022-03-02T08:15:30Z",
  "_links": {
    "self": { "href": "/api/users/124" }
  }
}
```

### 常见设计错误与解决方案

1. **问题**：将动词用作资源名称

   **错误**：`/getUsers` 或 `/createUser`

   **解决方案**：使用名词表示资源，通过HTTP方法表达动作
   ```
   GET /users
   POST /users
   ```

2. **问题**：在URI中使用CRUD操作

   **错误**：`/users/1/delete` 或 `/updateUser/1`

   **解决方案**：使用合适的HTTP方法
   ```
   DELETE /users/1
   PUT /users/1
   ```

3. **问题**：不使用子资源表示关系

   **错误**：`/userOrders?user_id=1`

   **解决方案**：使用嵌套资源表示从属关系
   ```
   GET /users/1/orders
   ```

4. **问题**：以不同方式返回错误

   **错误**：不同端点使用不同错误格式和状态码

   **解决方案**：使用一致的错误格式和合适的状态码

5. **问题**：忽略幂等性

   **错误**：POST用于更新，重复PUT产生不同结果

   **解决方案**：正确使用HTTP方法，确保PUT和DELETE是幂等的

6. **问题**：使用HTTP方法覆盖

   **错误**：`POST /users/1?_method=DELETE`

   **解决方案**：直接使用正确的HTTP方法，如无法使用，考虑内容协商

## 结论

设计良好的RESTful API应当易于理解、使用和扩展。遵循REST架构约束和最佳实践，可以创建具有一致性、可预测性和可扩展性的API。关键点包括：

1. 以资源为中心设计API
2. 正确使用HTTP方法和状态码
3. 提供清晰一致的URI
4. 实施版本控制
5. 支持内容协商
6. 提供良好的错误处理
7. 实现安全认证
8. 优化性能和可伸缩性
9. 提供全面的文档

通过遵循这些原则，可以构建出满足现代应用需求，并能随业务发展而扩展的RESTful API。