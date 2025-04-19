# Express 框架

## 什么是 Express

Express 是一个基于 Node.js 平台的极简、灵活的 Web 应用框架，提供了一系列强大的特性帮助你创建各种 Web 应用和 API。作为 Node.js 最流行的框架之一，Express 提供了简洁的接口来构建 Web 应用程序，包括路由、中间件、模板引擎等功能。

## Express 特点

- **极简**：核心功能简单，不过度捆绑
- **高性能**：专注于高性能 Web 应用
- **扩展性**：通过中间件机制提供强大的扩展能力
- **路由系统**：灵活且功能丰富的 HTTP 路由
- **中间件**：强大的中间件生态系统
- **模板引擎**：支持多种模板引擎
- **REST API**：轻松构建 RESTful API

## 安装与设置

### 安装 Express

```bash
# 安装 Express
npm install express

# 安装常用中间件
npm install body-parser cors morgan
```

### 基本应用结构

一个典型的 Express 应用目录结构：

```
project/
├── node_modules/
├── public/            # 静态资源
│   ├── css/
│   ├── js/
│   └── images/
├── routes/            # 路由处理
│   ├── index.js
│   └── users.js
├── views/             # 视图模板
│   ├── index.ejs
│   └── partials/
├── app.js             # 应用入口
├── package.json
└── package-lock.json
```

### 创建基本应用

一个简单的 Express 应用：

```javascript
const express = require('express');
const app = express();
const port = 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 启动服务器
app.listen(port, () => {
  console.log(`应用正在监听 http://localhost:${port}`);
});
```

## 路由系统

Express 路由定义了应用程序如何响应客户端对特定端点的请求。

### 基本路由

```javascript
// 基本 GET 路由
app.get('/', (req, res) => {
  res.send('首页');
});

// POST 路由
app.post('/users', (req, res) => {
  // 创建用户
  res.json({ message: '用户已创建' });
});

// 带参数的路由
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`用户ID: ${userId}`);
});
```

### 路由模块化

在大型应用中，通常把路由分离到独立的文件：

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('获取所有用户');
});

router.get('/:id', (req, res) => {
  res.send(`获取用户ID: ${req.params.id}`);
});

module.exports = router;

// app.js
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
```

### 路由处理链

多个回调函数可以处理一个路由：

```javascript
// 验证中间件
function validateUser(req, res, next) {
  // 校验逻辑
  if (validUser) {
    next(); // 通过验证，继续下一个处理函数
  } else {
    res.status(401).send('未授权');
  }
}

// 使用路由处理链
app.get('/profile', validateUser, (req, res) => {
  res.send('用户资料');
});
```

## 中间件

中间件函数可以访问请求对象、响应对象和应用程序的请求-响应周期中的下一个函数。

### 应用级中间件

```javascript
// 不带挂载路径的中间件
app.use((req, res, next) => {
  console.log('请求时间:', Date.now());
  next();
});

// 带挂载路径的中间件
app.use('/users', (req, res, next) => {
  console.log('处理 /users 路径的请求');
  next();
});
```

### 路由级中间件

```javascript
// 路由中间件
router.use((req, res, next) => {
  console.log('用户路由中间件');
  next();
});
```

### 错误处理中间件

必须提供四个参数：

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器错误!');
});
```

### 常用内置中间件

```javascript
// 解析 JSON 请求体
app.use(express.json());

// 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true }));

// 提供静态文件
app.use(express.static('public'));
```

### 第三方中间件

```javascript
const morgan = require('morgan');
const cors = require('cors');

// 日志中间件
app.use(morgan('dev'));

// 跨域资源共享
app.use(cors());
```

## 请求和响应对象

Express 扩展了 Node.js 的 HTTP 请求和响应对象。

### 请求对象 (req)

```javascript
app.get('/example', (req, res) => {
  // 路由参数
  console.log(req.params);
  
  // 查询字符串参数
  console.log(req.query);
  
  // 请求体（需要 body-parser 或 express.json() 中间件）
  console.log(req.body);
  
  // HTTP 头
  console.log(req.headers);
  
  // 客户端 IP
  console.log(req.ip);
  
  // 请求路径
  console.log(req.path);
  
  // 请求方法
  console.log(req.method);
});
```

### 响应对象 (res)

```javascript
app.get('/response-example', (req, res) => {
  // 发送文本响应
  res.send('文本响应');
  
  // 发送 JSON 响应
  res.json({ name: '张三', age: 30 });
  
  // 发送状态码
  res.status(404).send('未找到');
  
  // 设置头信息
  res.set('Content-Type', 'text/html');
  
  // 重定向
  res.redirect('/new-page');
  
  // 渲染模板
  res.render('index', { title: '首页' });
  
  // 发送文件
  res.sendFile('/path/to/file.pdf');
  
  // 结束响应
  res.end();
});
```

## 模板引擎

Express 可以与多种模板引擎集成，如 EJS、Pug、Handlebars。

### 设置 EJS 模板引擎

```javascript
// 安装 EJS
// npm install ejs

// 配置模板引擎
app.set('view engine', 'ejs');
app.set('views', './views');

// 渲染模板
app.get('/', (req, res) => {
  res.render('index', { 
    title: '首页',
    message: '欢迎使用 Express!'
  });
});
```

### EJS 模板示例

```html
<!-- views/index.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1><%= message %></h1>
  <ul>
    <% users.forEach(function(user) { %>
      <li><%= user.name %></li>
    <% }); %>
  </ul>
</body>
</html>
```

## 错误处理

良好的错误处理是健壮应用的关键。

### 同步错误处理

```javascript
app.get('/sync-error', (req, res) => {
  try {
    // 可能抛出错误的代码
    const result = someDangerousOperation();
    res.send(result);
  } catch (err) {
    res.status(500).send('出错了: ' + err.message);
  }
});
```

### 异步错误处理

使用 `next()` 传递错误：

```javascript
app.get('/async-error', (req, res, next) => {
  fs.readFile('/not-exist', (err, data) => {
    if (err) {
      return next(err); // 传递错误到错误处理中间件
    }
    // 继续处理...
    res.send(data);
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器错误!');
});
```

### 使用 async/await 处理错误

```javascript
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});
```

## RESTful API 开发

Express 非常适合构建 RESTful API。

### 基本 CRUD 操作

```javascript
// 获取所有用户
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 获取单个用户
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: '未找到用户' });
  res.json(user);
});

// 创建用户
app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

// 更新用户
app.put('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id, 
    req.body,
    { new: true }
  );
  if (!user) return res.status(404).json({ message: '未找到用户' });
  res.json(user);
});

// 删除用户
app.delete('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: '未找到用户' });
  res.json({ message: '用户已删除' });
});
```

### API 版本控制

```javascript
// v1 API 路由
const v1Router = require('./routes/v1');
app.use('/api/v1', v1Router);

// v2 API 路由
const v2Router = require('./routes/v2');
app.use('/api/v2', v2Router);
```

## 安全最佳实践

保护 Express 应用免受常见安全威胁。

### 使用 Helmet 设置安全相关 HTTP 头

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 防止跨站脚本攻击 (XSS)

```javascript
// Content-Security-Policy 可以通过 helmet 设置
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"]
    }
  })
);
```

### 防止跨站请求伪造 (CSRF)

```javascript
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.get('/form', (req, res) => {
  // 在表单中包含 CSRF 令牌
  res.render('form', { csrfToken: req.csrfToken() });
});
```

### 限制请求速率

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 每个 IP 15 分钟内最多 100 次请求
  message: '请求过多，请稍后再试!'
});

// 应用到所有 API 请求
app.use('/api/', apiLimiter);
```

## 测试 Express 应用

使用常见测试框架测试 Express 应用。

### 使用 Mocha 和 Chai 进行单元测试

```javascript
// test/routes.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /', () => {
  it('应该返回首页', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('欢迎');
        done();
      });
  });
});
```

### 使用 Jest 进行测试

```javascript
// 安装 Jest 和 Supertest
// npm install --save-dev jest supertest

// __tests__/app.test.js
const request = require('supertest');
const app = require('../app');

describe('API 测试', () => {
  test('GET / 应该返回 200 状态码', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
  
  test('POST /api/users 应该创建新用户', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: '张三', email: 'zhang@example.com' });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('name', '张三');
  });
});
```

## 部署 Express 应用

### 生产环境最佳实践

```javascript
// 环境变量配置
const dotenv = require('dotenv');
dotenv.config();

// 生产环境设置
if (process.env.NODE_ENV === 'production') {
  // 禁用开发日志
  app.use(morgan('combined'));
  
  // 启用压缩
  const compression = require('compression');
  app.use(compression());
  
  // 设置适当的缓存头
  app.use(express.static('public', {
    maxAge: '1d'
  }));
}
```

### 使用 PM2 部署

PM2 是一个流行的 Node.js 生产环境进程管理器。

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start app.js --name "my-app"

# 查看应用状态
pm2 status

# 设置开机自启
pm2 startup

# 保存当前运行的应用列表
pm2 save
```

### PM2 配置文件

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "my-express-app",
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

// 使用配置文件启动
// pm2 start ecosystem.config.js --env production
```

## Express 生态系统

### 常用中间件

- **body-parser**: 解析请求体
- **morgan**: HTTP 请求日志
- **cors**: 跨域资源共享
- **helmet**: 设置安全相关的 HTTP 头
- **compression**: 压缩响应
- **passport**: 认证中间件
- **multer**: 文件上传处理

### 常用扩展库

- **express-session**: 会话管理
- **express-validator**: 请求数据验证
- **jsonwebtoken**: JWT 认证
- **mongoose**: MongoDB ODM
- **sequelize**: SQL 数据库 ORM
- **socket.io**: WebSocket 实时通信

## 相关资源

- [Express 官方文档](https://expressjs.com/)
- [Express 中文文档](https://www.expressjs.com.cn/)
- [Express 安全最佳实践](https://expressjs.com/en/advanced/best-practice-security.html)
- [Express GitHub 仓库](https://github.com/expressjs/express)
