# Node.js 性能调优

## 性能调优基础

Node.js 凭借其非阻塞 I/O 和事件驱动架构，天生具有处理高并发场景的能力。但是，开发高性能的 Node.js 应用仍然需要深入了解其运行机制和性能调优技巧。本文将介绍 Node.js 性能调优的关键概念和实用策略。

## Node.js 架构理解

### 单线程与事件循环

Node.js 基于 V8 引擎构建，采用单线程事件循环模型：

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

虽然 JavaScript 执行是单线程的，但 Node.js 的 I/O 操作（如文件读写、网络请求）是在线程池中异步执行的，这使得应用可以处理大量并发请求而不会阻塞。

### libuv 与线程池

Node.js 通过 libuv 库实现跨平台的异步 I/O：

- 默认线程池大小为 4，可通过 `UV_THREADPOOL_SIZE` 环境变量调整
- CPU 密集型任务会占用线程池资源，影响异步 I/O 操作的处理能力

## 常见性能瓶颈与解决方案

### 1. CPU 密集型操作

单线程执行 CPU 密集型任务会阻塞事件循环，降低并发处理能力。

**解决方案：**

#### 使用 Worker Threads

```javascript
// main.js
const { Worker } = require('worker_threads');

function runFactorial(number) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./factorial-worker.js', {
      workerData: { number }
    });
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

// 使用 worker 执行 CPU 密集型任务
app.get('/factorial/:number', async (req, res) => {
  try {
    const result = await runFactorial(parseInt(req.params.number));
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

```javascript
// factorial-worker.js
const { parentPort, workerData } = require('worker_threads');

function calculateFactorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

const result = calculateFactorial(workerData.number);
parentPort.postMessage(result);
```

#### 使用 child_process

对于独立任务，可以使用子进程：

```javascript
const { exec } = require('child_process');

app.get('/heavy-task', (req, res) => {
  exec('node heavy-task.js', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.send(stdout);
  });
});
```

### 2. 内存泄漏

Node.js 应用中的内存泄漏会导致性能下降和应用崩溃。

**检测工具：**

1. **Node.js 内置工具**

```javascript
const memoryUsage = process.memoryUsage();
console.log(memoryUsage);
// 输出:
// {
//   rss: 30556160,       // 常驻集大小
//   heapTotal: 6651904,  // V8 申请的总内存
//   heapUsed: 4327288,   // V8 使用的内存
//   external: 1084597    // C++ 对象绑定的内存
// }
```

2. **使用 heapdump 生成内存快照**

```bash
npm install heapdump
```

```javascript
const heapdump = require('heapdump');

// 生成内存快照
process.on('SIGUSR2', () => {
  heapdump.writeSnapshot(`./heapdump-${Date.now()}.heapsnapshot`);
});

// 定时生成内存快照
setInterval(() => {
  heapdump.writeSnapshot(`./heapdump-${Date.now()}.heapsnapshot`);
}, 60000);
```

3. **使用 Chrome DevTools 分析内存**

对于 Node.js 应用，可以使用 `--inspect` 标志启动，然后在 Chrome 中打开 `chrome://inspect` 进行内存分析。

**常见内存泄漏原因和解决方案：**

1. **闭包引用**

```javascript
// 内存泄漏示例
function createLeakExample() {
  const largeData = new Array(1000000).fill('*');
  return () => {
    return largeData[0]; // 整个 largeData 数组被引用
  };
}

// 改进版本
function createOptimizedExample() {
  const largeData = new Array(1000000).fill('*');
  const firstItem = largeData[0]; // 仅保留需要的数据
  return () => {
    return firstItem;
  };
}
```

2. **事件监听器**

```javascript
// 内存泄漏
function addHandlers() {
  const element = document.getElementById('button');
  element.addEventListener('click', onClick);
  // 忘记移除监听器
}

// 正确移除监听器
function cleanup() {
  const element = document.getElementById('button');
  element.removeEventListener('click', onClick);
}
```

3. **缓存没有上限**

```javascript
// 不受限的缓存，可能导致内存溢出
const cache = {};

// 使用 LRU 缓存替代
const LRU = require('lru-cache');
const cache = new LRU({
  max: 500,    // 最多存储500项
  maxAge: 1000 * 60 * 60 // 项目过期时间: 1小时
});
```

### 3. 异步操作管理

不当的异步操作会导致性能问题和内存泄漏。

**最佳实践：**

1. **避免嵌套回调（回调地狱）**

```javascript
// 回调地狱
fs.readFile('file1.txt', (err, data1) => {
  if (err) throw err;
  fs.readFile('file2.txt', (err, data2) => {
    if (err) throw err;
    fs.writeFile('output.txt', data1 + data2, (err) => {
      if (err) throw err;
      console.log('Done');
    });
  });
});

// 使用 async/await 提高可读性
async function processFiles() {
  try {
    const data1 = await fs.promises.readFile('file1.txt');
    const data2 = await fs.promises.readFile('file2.txt');
    await fs.promises.writeFile('output.txt', data1 + data2);
    console.log('Done');
  } catch (err) {
    console.error('Error:', err);
  }
}
```

2. **适当使用 Promise.all 并行执行任务**

```javascript
async function processFilesParallel() {
  try {
    // 并行读取文件
    const [data1, data2] = await Promise.all([
      fs.promises.readFile('file1.txt'),
      fs.promises.readFile('file2.txt')
    ]);
    await fs.promises.writeFile('output.txt', data1 + data2);
    console.log('Done');
  } catch (err) {
    console.error('Error:', err);
  }
}
```

3. **控制并发量**

使用库如 `p-limit` 控制并发任务数量：

```bash
npm install p-limit
```

```javascript
const pLimit = require('p-limit');

async function processUrls(urls) {
  const limit = pLimit(5); // 最多5个并发请求
  
  const promises = urls.map(url => {
    return limit(() => fetch(url));
  });
  
  const results = await Promise.all(promises);
  return results;
}
```

### 4. 数据库操作优化

数据库操作通常是性能瓶颈所在。

**优化策略：**

1. **使用连接池**

```javascript
// MongoDB 连接池配置
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // 连接池配置
  poolSize: 10, // 最大连接数
  serverSelectionTimeoutMS: 5000 // 服务器选择超时
});
```

```javascript
// MySQL 连接池配置
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'db'
});

// 使用连接池
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});
```

2. **批量操作**

```javascript
// 单条插入 - 低效
for (const item of items) {
  await Collection.insertOne(item);
}

// 批量插入 - 更高效
await Collection.insertMany(items);
```

3. **索引优化**

```javascript
// MongoDB 创建索引
db.users.createIndex({ email: 1 }, { unique: true });

// Mongoose 模型定义带索引
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  name: String,
  createdAt: { type: Date, index: true }
});
```

4. **查询优化**

```javascript
// 低效查询 - 返回不必要的字段
const users = await User.find({});

// 优化查询 - 只返回必要字段
const users = await User.find({}, 'name email');

// 使用解释计划分析查询
const explanation = await User.find({ age: { $gt: 20 } }).explain();
console.log(explanation);
```

## Node.js 应用程序监控

### 健康检查端点

```javascript
app.get('/health', (req, res) => {
  // 检查关键依赖的连接
  const dbStatus = checkDatabaseConnection();
  const redisStatus = checkRedisConnection();
  
  const status = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    memory: process.memoryUsage(),
    database: dbStatus,
    redis: redisStatus
  };
  
  res.json(status);
});
```

### 使用 APM 工具

1. **New Relic**

```bash
npm install newrelic
```

```javascript
// 在应用入口点首行引入
require('newrelic');
const express = require('express');
const app = express();
```

2. **Datadog**

```bash
npm install dd-trace
```

```javascript
// 在应用最开始初始化
const tracer = require('dd-trace').init();
const express = require('express');
const app = express();
```

3. **Prometheus + Grafana**

```bash
npm install prom-client
```

```javascript
const express = require('express');
const promClient = require('prom-client');
const app = express();

// 创建指标收集器
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// 创建自定义指标
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'HTTP request duration in ms',
  labelNames: ['route', 'method', 'status'],
  buckets: [1, 5, 15, 50, 100, 500]
});

// 添加中间件收集请求指标
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.path, req.method, res.statusCode)
      .observe(duration);
  });
  next();
});

// 公开指标端点
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});
```

## 服务器配置优化

### 1. 集群模式

使用 Node.js 的 `cluster` 模块可以创建多个工作进程共享同一个服务器端口：

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
    // 如果工作进程意外退出，可以重新启动它
    cluster.fork();
  });
} else {
  // 工作进程可以共享任何 TCP 连接
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World\n');
  }).listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```

### 2. PM2 进程管理

PM2 是 Node.js 应用的生产进程管理器：

```bash
# 安装 PM2
npm install -g pm2

# 以集群模式启动应用
pm2 start app.js -i max

# 查看进程状态
pm2 status

# 监控资源使用
pm2 monit
```

**PM2 配置文件 (ecosystem.config.js):**

```javascript
module.exports = {
  apps: [{
    name: "app",
    script: "./app.js",
    instances: "max",
    exec_mode: "cluster",
    watch: false,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    },
    node_args: "--max_old_space_size=2048", // 设置 Node.js 内存限制
    out_file: "./logs/pm2-out.log",
    error_file: "./logs/pm2-error.log",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm Z"
  }]
};
```

### 3. 负载均衡

使用 Nginx 作为反向代理和负载均衡器：

```nginx
# /etc/nginx/conf.d/app.conf
upstream node_app {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://node_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 代码优化技巧

### 1. 事件循环优化

避免阻塞事件循环的长时间运行任务：

```javascript
// 不好的写法 - 阻塞事件循环
function processLargeArray(array) {
  for (let i = 0; i < array.length; i++) {
    // 对每个元素进行耗时处理
    heavyComputation(array[i]);
  }
  return 'done';
}

// 更好的写法 - 将大任务分割为小块，使用 setImmediate 让事件循环呼吸
function processLargeArrayAsync(array, callback) {
  const chunkSize = 100;
  let index = 0;
  
  function processChunk() {
    const end = Math.min(index + chunkSize, array.length);
    
    for (let i = index; i < end; i++) {
      heavyComputation(array[i]);
    }
    
    index = end;
    
    if (index < array.length) {
      setImmediate(processChunk); // 让出事件循环
    } else {
      callback('done');
    }
  }
  
  processChunk();
}
```

### 2. 缓存策略

实现多级缓存减少计算和 I/O：

```javascript
const NodeCache = require('node-cache');
const memoryCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
const Redis = require('ioredis');
const redis = new Redis();

async function getUser(userId) {
  // 检查内存缓存
  const cachedUser = memoryCache.get(`user:${userId}`);
  if (cachedUser) {
    return cachedUser;
  }
  
  // 检查 Redis 缓存
  const redisUser = await redis.get(`user:${userId}`);
  if (redisUser) {
    const user = JSON.parse(redisUser);
    // 设置内存缓存
    memoryCache.set(`user:${userId}`, user);
    return user;
  }
  
  // 从数据库获取
  const user = await db.collection('users').findOne({ _id: userId });
  
  // 缓存结果
  if (user) {
    redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600); // 1小时过期
    memoryCache.set(`user:${userId}`, user);
  }
  
  return user;
}
```

### 3. Stream 处理大文件

使用 Stream 处理大文件，避免内存溢出：

```javascript
// 不好的写法 - 将整个文件加载到内存
app.get('/download', (req, res) => {
  fs.readFile('./large-file.csv', (err, data) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'text/csv');
    res.send(data);
  });
});

// 好的写法 - 使用流
app.get('/download', (req, res) => {
  const fileStream = fs.createReadStream('./large-file.csv');
  res.setHeader('Content-Type', 'text/csv');
  fileStream.pipe(res);
});
```

文件处理示例：

```javascript
// 使用流转换 CSV 到 JSON
const fs = require('fs');
const csv = require('csv-parser');
const { Transform } = require('stream');

// 创建转换流
const transformToJSON = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    // 对每行数据进行处理
    chunk.price = parseFloat(chunk.price);
    chunk.timestamp = new Date().toISOString();
    this.push(JSON.stringify(chunk) + '\n');
    callback();
  }
});

// 处理文件流
fs.createReadStream('input.csv')
  .pipe(csv())
  .pipe(transformToJSON)
  .pipe(fs.createWriteStream('output.json'));
```

### 4. 调整 V8 参数

根据应用需求调整 V8 引擎参数：

```bash
# 增加老生代内存大小 (单位为 MB)
node --max-old-space-size=4096 app.js

# 启用垃圾回收详细日志
node --trace-gc app.js

# 优化 CPU 使用率
node --optimize-for-size --max-old-space-size=2048 app.js
```

## 常用性能测试工具

### 1. 负载测试工具

#### Autocannon

```bash
npm install -g autocannon

# 运行负载测试
autocannon -c 100 -d 30 http://localhost:3000/api

# 结果包含延迟、吞吐量等指标
```

#### Apache Bench

```bash
# 发送 10000 个请求，并发 100
ab -n 10000 -c 100 http://localhost:3000/api
```

### 2. 性能分析工具

#### Clinic.js

一套完整的 Node.js 性能分析工具：

```bash
npm install -g clinic

# CPU 分析
clinic doctor -- node app.js

# 内存分析
clinic heap -- node app.js

# 事件循环延迟分析
clinic bubbleprof -- node app.js
```

#### Node.js 内置性能分析

```javascript
// 生成 CPU 分析文件
const { Session } = require('inspector');
const fs = require('fs');
const session = new Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // 运行代码
    doSomething();
    
    // 停止分析
    session.post('Profiler.stop', (err, { profile }) => {
      fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
    });
  });
});
```

## 性能优化最佳实践清单

1. **服务器配置**
   - 部署多个实例（使用 cluster 或 PM2）
   - 正确配置内存限制
   - 使用 CDN 分发静态资源
   - 启用 HTTP/2
   - 配置适当的负载均衡策略

2. **代码优化**
   - 避免同步操作阻塞事件循环
   - 使用缓存减少重复计算
   - 使用流处理大文件
   - 批量处理数据库操作
   - 正确处理异步操作
   - 使用 worker threads 处理 CPU 密集型任务

3. **内存管理**
   - 定期监控内存使用
   - 处理定时器和事件监听器泄漏
   - 谨慎使用全局变量和闭包
   - 实现 LRU 缓存而不是无限增长的缓存
   - 适当配置垃圾回收参数

4. **监控与日志**
   - 实现健康检查端点
   - 使用 APM 工具监控生产环境
   - 实施结构化日志记录
   - 设置关键指标告警
   - 监控 CPU、内存和事件循环延迟

5. **安全最佳实践**
   - 启用 HTTPS
   - 实施速率限制
   - 使用 helmet 设置安全头
   - 验证和清理所有用户输入
   - 定期更新依赖
   - 实施适当的授权和认证

## 相关资源

- [Node.js 官方文档](https://nodejs.org/en/docs/)
- [Node.js Performance Team](https://github.com/nodejs/performance)
- [libuv 文档](http://docs.libuv.org/)
- [V8 性能调优](https://v8.dev/blog)
- [Node.js Design Patterns](https://www.nodejsdesignpatterns.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
