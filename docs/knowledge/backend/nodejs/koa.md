# Koa 框架

## 什么是 Koa

Koa 是一个由 Express 团队设计和开发的新一代 Node.js Web 框架。与 Express 相比，Koa 采用了更现代化的设计理念，利用 ES2017 的 async/await 特性，有效解决了 Express 中回调嵌套问题，提供了一个更优雅、更简洁的 API，让 Web 应用开发更加愉快。

## Koa 的特点

- **轻量级**：核心代码非常精简，仅提供基础功能
- **中间件架构**：采用洋葱模型的中间件系统
- **异步控制流**：原生支持 async/await，告别回调地狱
- **错误处理**：集中式的错误处理机制
- **无内置中间件**：所有功能通过外部中间件引入，高度可定制
- **请求和响应对象增强**：提供更多便捷方法

## 安装与基本使用

### 安装 Koa

```bash
# 创建项目目录
mkdir koa-app
cd koa-app

# 初始化项目
npm init -y

# 安装 Koa
npm install koa
```

### 创建基本应用

```javascript
const Koa = require('koa');
const app = new Koa();
const port = 3000;

// 响应中间件
app.use(async ctx => {
  ctx.body = 'Hello World';
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
```

## 中间件系统

### 洋葱模型

Koa 的中间件遵循洋葱模型，请求从外到内依次经过中间件，响应则从内到外经过中间件：

```
         入口
          ↓
   +-------------+
   |    中间件1   |
   |  +---------+  |
   |  | 中间件2 |  |
   |  | +-----+ |  |
   |  | |中间件3| |  |
   |  | +-----+ |  |
   |  +---------+  |
   +-------------+
          ↑
         出口
```

### 中间件示例

```javascript
const Koa = require('koa');
const app = new Koa();

// 记录请求处理时间的中间件
app.use(async (ctx, next) => {
  const start = Date.now();
  console.log(`请求开始: ${ctx.method} ${ctx.url}`);
  
  // 调用下一个中间件
  await next();
  
  // 计算并记录处理时间
  const ms = Date.now() - start;
  console.log(`请求结束: ${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 业务逻辑中间件
app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

### 异步中间件

Koa 原生支持异步中间件：

```javascript
const fs = require('fs').promises;

app.use(async (ctx, next) => {
  try {
    // 异步读取文件
    const data = await fs.readFile('config.json', 'utf8');
    ctx.state.config = JSON.parse(data);
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: '服务器错误' };
  }
});
```

## 上下文 (Context)

Koa 中的 ctx 对象是请求的上下文，整合了 Node.js 的 request 和 response 对象：

```javascript
app.use(async ctx => {
  // ctx.request 是 Koa 的 Request 对象
  console.log(ctx.request.query);
  
  // ctx.req 是 Node.js 原生的 request 对象
  console.log(ctx.req.headers);
  
  // ctx.response 是 Koa 的 Response 对象
  ctx.response.type = 'json';
  
  // ctx.res 是 Node.js 原生的 response 对象
  ctx.res.statusCode = 200;
  
  // 设置响应体
  ctx.body = { message: '成功' };
  
  // 获取请求相关属性
  console.log(ctx.method);  // 请求方法
  console.log(ctx.url);     // 请求URL
  console.log(ctx.path);    // 请求路径
  console.log(ctx.query);   // 查询参数
  console.log(ctx.headers); // 请求头
  
  // 设置响应相关属性
  ctx.status = 200;         // 状态码
  ctx.type = 'application/json'; // 内容类型
  ctx.set('Cache-Control', 'no-cache'); // 设置响应头
});
```

## 路由管理

### 使用 koa-router

```bash
npm install koa-router
```

```javascript
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// 基本路由
router.get('/', async (ctx) => {
  ctx.body = '首页';
});

router.get('/users', async (ctx) => {
  ctx.body = '用户列表';
});

router.post('/users', async (ctx) => {
  ctx.body = '创建用户';
});

// 带参数的路由
router.get('/users/:id', async (ctx) => {
  ctx.body = `获取用户 ID: ${ctx.params.id}`;
});

// 注册路由中间件
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
```

### 路由分组与嵌套

```javascript
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();

// 用户路由
const userRouter = new Router({ prefix: '/users' });
userRouter.get('/', async (ctx) => { ctx.body = '用户列表'; });
userRouter.get('/:id', async (ctx) => { ctx.body = `用户详情: ${ctx.params.id}`; });

// 文章路由
const postRouter = new Router({ prefix: '/posts' });
postRouter.get('/', async (ctx) => { ctx.body = '文章列表'; });
postRouter.get('/:id', async (ctx) => { ctx.body = `文章详情: ${ctx.params.id}`; });

// API 路由
const apiRouter = new Router({ prefix: '/api' });
apiRouter.use('/v1/users', userRouter.routes(), userRouter.allowedMethods());
apiRouter.use('/v1/posts', postRouter.routes(), postRouter.allowedMethods());

// 注册 API 路由
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.listen(3000);
```

## 常用中间件

### 请求体解析

使用 koa-bodyparser 解析请求体：

```bash
npm install koa-bodyparser
```

```javascript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// 使用 bodyParser 中间件
app.use(bodyParser());

router.post('/users', async (ctx) => {
  // 访问解析后的请求体
  const user = ctx.request.body;
  console.log(user);
  ctx.body = { message: '用户创建成功', user };
});

app.use(router.routes());
app.listen(3000);
```

### 静态文件服务

使用 koa-static 提供静态文件：

```bash
npm install koa-static
```

```javascript
const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');

const app = new Koa();

// 设置静态文件目录
app.use(serve(path.join(__dirname, 'public')));

app.listen(3000);
```

### 会话管理

使用 koa-session 管理会话：

```bash
npm install koa-session
```

```javascript
const Koa = require('koa');
const session = require('koa-session');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// 配置会话
app.keys = ['some secret key']; // 用于签名
const CONFIG = {
  key: 'koa.sess',
  maxAge: 86400000, // 有效期为1天
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};

app.use(session(CONFIG, app));

router.get('/view', async (ctx) => {
  // 获取会话数据
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = `页面访问次数: ${n}`;
});

app.use(router.routes());
app.listen(3000);
```

### CORS 支持

使用 @koa/cors 添加 CORS 支持：

```bash
npm install @koa/cors
```

```javascript
const Koa = require('koa');
const cors = require('@koa/cors');

const app = new Koa();

// 使用 CORS 中间件
app.use(cors({
  origin: 'http://example.com',
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

app.listen(3000);
```

## 错误处理

### 全局错误处理中间件

```javascript
const Koa = require('koa');
const app = new Koa();

// 全局错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // 记录错误
    console.error('服务器错误', err);
    
    // 设置响应状态
    ctx.status = err.status || 500;
    
    // 设置错误响应
    ctx.body = {
      success: false,
      message: err.message || '服务器内部错误'
    };
    
    // 触发应用级错误事件
    ctx.app.emit('error', err, ctx);
  }
});

// 错误处理事件
app.on('error', (err, ctx) => {
  // 这里可以添加额外的错误处理逻辑
  // 例如记录到日志文件或发送警报
  console.error('应用错误:', err);
});

// 业务逻辑中间件
app.use(async (ctx) => {
  // 模拟错误
  if (ctx.query.error) {
    throw new Error('测试错误');
  }
  ctx.body = '正常响应';
});

app.listen(3000);
```

### 自定义错误类

```javascript
class APIError extends Error {
  constructor(message, status = 400, code = 'BAD_REQUEST') {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 使用自定义错误
app.use(async (ctx) => {
  if (!ctx.query.id) {
    throw new APIError('缺少ID参数', 400, 'MISSING_PARAM');
  }
  ctx.body = { id: ctx.query.id };
});
```

## 文件上传

使用 koa-multer 处理文件上传：

```bash
npm install koa-multer
```

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const multer = require('koa-multer');
const path = require('path');

const app = new Koa();
const router = new Router();

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 单文件上传
router.post('/upload', upload.single('file'), async (ctx) => {
  ctx.body = {
    success: true,
    file: ctx.file
  };
});

// 多文件上传
router.post('/uploads', upload.array('files', 5), async (ctx) => {
  ctx.body = {
    success: true,
    files: ctx.files
  };
});

app.use(router.routes());
app.listen(3000);
```

## 视图渲染

使用 koa-views 和模板引擎：

```bash
npm install koa-views ejs
```

```javascript
const Koa = require('koa');
const views = require('koa-views');
const path = require('path');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// 设置模板引擎
app.use(views(path.join(__dirname, 'views'), {
  extension: 'ejs'
}));

router.get('/', async (ctx) => {
  await ctx.render('index', {
    title: 'Koa 应用',
    message: '欢迎使用 Koa!'
  });
});

app.use(router.routes());
app.listen(3000);
```

视图模板示例：

```html
<!-- views/index.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1><%= message %></h1>
  <p>当前时间: <%= new Date() %></p>
</body>
</html>
```

## 授权与认证

### JWT 认证

使用 jsonwebtoken 实现 JWT 认证：

```bash
npm install jsonwebtoken
```

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// JWT 密钥
const JWT_SECRET = 'your-secret-key';

// 认证中间件
async function authenticate(ctx, next) {
  try {
    const token = ctx.header.authorization?.split(' ')[1];
    if (!token) {
      ctx.status = 401;
      ctx.body = { error: '未提供认证令牌' };
      return;
    }
    
    // 验证 JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: '无效的认证令牌' };
  }
}

// 登录路由
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;
  
  // 这里应该有实际的用户验证逻辑
  if (username === 'admin' && password === 'password') {
    // 创建 JWT
    const token = jwt.sign(
      { id: 1, username: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    ctx.body = { token };
  } else {
    ctx.status = 401;
    ctx.body = { error: '用户名或密码错误' };
  }
});

// 受保护的路由
router.get('/profile', authenticate, async (ctx) => {
  ctx.body = {
    message: '受保护的数据',
    user: ctx.state.user
  };
});

app.use(router.routes());
app.listen(3000);
```

## 数据库集成

### MongoDB (Mongoose)

```bash
npm install mongoose
```

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// 连接到 MongoDB
mongoose.connect('mongodb://localhost:27017/koa-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 定义 Schema 和 Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number
});

const User = mongoose.model('User', userSchema);

// 路由
router.get('/users', async (ctx) => {
  try {
    const users = await User.find();
    ctx.body = users;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
});

router.post('/users', async (ctx) => {
  try {
    const user = new User(ctx.request.body);
    await user.save();
    ctx.status = 201;
    ctx.body = user;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: err.message };
  }
});

app.use(router.routes());
app.listen(3000);
```

### MySQL (Sequelize)

```bash
npm install sequelize mysql2
```

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// 连接到 MySQL
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// 定义模型
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
});

// 同步数据库
sequelize.sync();

// 路由
router.get('/products', async (ctx) => {
  try {
    const products = await Product.findAll();
    ctx.body = products;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
});

router.post('/products', async (ctx) => {
  try {
    const product = await Product.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = product;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: err.message };
  }
});

app.use(router.routes());
app.listen(3000);
```

## 测试 Koa 应用

### 使用 Jest 和 Supertest

```bash
npm install --save-dev jest supertest
```

```javascript
// app.js
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/', async (ctx) => {
  ctx.body = { message: '欢迎使用 Koa API' };
});

router.post('/echo', async (ctx) => {
  ctx.body = ctx.request.body;
});

app.use(router.routes());

module.exports = app; // 导出 app 实例用于测试

// 如果不是测试环境，启动服务器
if (process.env.NODE_ENV !== 'test') {
  app.listen(3000);
}
```

测试文件：

```javascript
// __tests__/app.test.js
const request = require('supertest');
const app = require('../app');

// 创建测试服务器
const server = app.listen();

afterAll(() => {
  server.close();
});

describe('API 测试', () => {
  test('GET / 返回欢迎消息', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('欢迎使用 Koa API');
  });
  
  test('POST /echo 返回请求体数据', async () => {
    const data = { name: '张三', age: 30 };
    const response = await request(server)
      .post('/echo')
      .send(data);
      
    expect(response.status).toBe(200);
    expect(response.body).toEqual(data);
  });
});
```

## 部署 Koa 应用

### 生产环境配置

```javascript
const Koa = require('koa');
const helmet = require('koa-helmet');
const compress = require('koa-compress');
const logger = require('koa-logger');

const app = new Koa();

// 环境变量
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// 生产环境安全设置
if (isProd) {
  // 安全头
  app.use(helmet());
  
  // 压缩
  app.use(compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
  }));
} else {
  // 开发环境日志
  app.use(logger());
}

// 错误处理
app.on('error', (err, ctx) => {
  console.error('服务器错误', err, ctx);
});

// 启动服务器
const server = app.listen(port, () => {
  console.log(`服务器运行在 ${isProd ? '生产' : '开发'} 模式下，端口: ${port}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM 信号接收，关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});
```

### 使用 PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 创建 ecosystem.config.js
pm2 ecosystem
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "koa-app",
    script: "./app.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
```

```bash
# 使用 PM2 启动应用
pm2 start ecosystem.config.js --env production

# 查看应用状态
pm2 status

# 监控应用
pm2 monit
```

## Koa vs Express

### 主要区别

1. **中间件架构**：
   - Koa 使用 async/await 和洋葱模型
   - Express 使用回调函数和线性模型

2. **错误处理**：
   - Koa 有集中式的错误处理
   - Express 需要在每个中间件处理错误或传递到统一错误处理器

3. **内置功能**：
   - Koa 是极简的，几乎没有内置功能
   - Express 包含路由和一些内置中间件

4. **API 设计**：
   - Koa 提供更清晰的上下文对象 (ctx)
   - Express 直接使用 req 和 res 对象

### 选择指南

- **选择 Koa**：
  - 喜欢现代 JavaScript 特性 (async/await)
  - 需要强大的错误处理
  - 喜欢极简和高度可定制
  - 新项目，没有历史包袱

- **选择 Express**：
  - 需要丰富的生态系统和大量的中间件
  - 简单快速地搭建 API
  - 更喜欢传统的回调风格
  - 需要与现有 Express 代码集成

## 相关资源

- [Koa 官方网站](https://koajs.com/)
- [Koa GitHub 仓库](https://github.com/koajs/koa)
- [Koa 示例集合](https://github.com/koajs/examples)
- [Awesome Koa](https://github.com/ellerbrock/awesome-koa)
- [Koa vs Express](https://github.com/koajs/koa/blob/master/docs/koa-vs-express.md)
