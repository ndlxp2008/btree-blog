# Node.js 基础

## 什么是 Node.js

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，使开发者能够使用 JavaScript 来编写服务器端的应用程序。Node.js 采用事件驱动、非阻塞 I/O 模型，使其轻量且高效。

## Node.js 的特点

- **非阻塞 I/O**：Node.js 的一大特点是非阻塞 I/O 操作，提高了程序的性能和可伸缩性
- **事件驱动**：基于事件驱动架构，非常适合处理高并发请求
- **单线程**：采用单线程模型，但通过事件和回调支持并发
- **跨平台**：可在多种操作系统上运行
- **npm**：拥有世界上最大的开源库生态系统

## 安装 Node.js

### 下载安装

从 [Node.js 官网](https://nodejs.org/) 下载适合您操作系统的安装包，按照安装向导完成安装。

### 使用包管理器安装

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# CentOS/RHEL
sudo yum install nodejs npm

# macOS (使用 Homebrew)
brew install node
```

### 使用 NVM 安装（推荐）

NVM (Node Version Manager) 允许您管理多个 Node.js 版本：

```bash
# 安装 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# 安装最新版 Node.js
nvm install node

# 安装特定版本
nvm install 16.14.0
```

## Node.js 核心概念

### 模块系统

Node.js 使用 CommonJS 模块系统，允许代码的模块化组织：

```javascript
// 导出模块
const sum = (a, b) => a + b;
module.exports = sum;

// 或者导出多个项
module.exports = {
  sum,
  multiply: (a, b) => a * b
};

// 导入模块
const math = require('./math');
console.log(math.sum(2, 3)); // 输出: 5
```

### 事件循环

Node.js 的事件循环是其异步非阻塞 I/O 模型的核心：

```javascript
const fs = require('fs');

// 异步读取文件
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

console.log('开始读取文件');
```

### Buffer

处理二进制数据：

```javascript
// 创建 Buffer
const buf = Buffer.from('Hello, World!', 'utf8');
console.log(buf.toString()); // 输出: Hello, World!
```

### Stream

处理数据流：

```javascript
const fs = require('fs');
const readStream = fs.createReadStream('source.txt');
const writeStream = fs.createWriteStream('destination.txt');

// 管道连接
readStream.pipe(writeStream);
```

## 异步编程

### 回调函数

传统的异步处理方式：

```javascript
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('读取失败:', err);
    return;
  }
  console.log('文件内容:', data);
});
```

### Promise

现代化的异步处理方式：

```javascript
const fs = require('fs').promises;

fs.readFile('file.txt', 'utf8')
  .then(data => {
    console.log('文件内容:', data);
  })
  .catch(err => {
    console.error('读取失败:', err);
  });
```

### Async/Await

更优雅的异步处理方式：

```javascript
const fs = require('fs').promises;

async function readFileAsync() {
  try {
    const data = await fs.readFile('file.txt', 'utf8');
    console.log('文件内容:', data);
  } catch (err) {
    console.error('读取失败:', err);
  }
}

readFileAsync();
```

## 核心模块

Node.js 提供了许多内置模块，以下是常用的几个：

### HTTP 模块

创建 HTTP 服务器：

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000/');
});
```

### File System 模块

文件操作：

```javascript
const fs = require('fs');

// 同步读取
try {
  const data = fs.readFileSync('file.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}

// 异步写入
fs.writeFile('file.txt', '写入的内容', err => {
  if (err) throw err;
  console.log('文件已保存');
});
```

### Path 模块

路径处理：

```javascript
const path = require('path');

console.log(path.join(__dirname, 'subfolder', 'file.txt'));
console.log(path.resolve('folder', 'file.txt'));
console.log(path.extname('index.html')); // 输出: .html
```

### URL 模块

URL 处理：

```javascript
const url = require('url');
const myURL = new URL('https://example.com/path?query=string');

console.log(myURL.hostname); // 输出: example.com
console.log(myURL.searchParams.get('query')); // 输出: string
```

## 包管理

### NPM 基础

NPM (Node Package Manager) 是 Node.js 的包管理器：

```bash
# 初始化项目
npm init

# 安装包
npm install express

# 安装开发依赖
npm install --save-dev nodemon

# 全局安装
npm install -g pm2
```

### package.json

项目的配置文件：

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My Node.js application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.17.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.15",
    "jest": "^27.5.1"
  }
}
```

## 调试与测试

### 调试 Node.js 应用

```bash
# 使用 Node.js 内置调试器
node --inspect server.js

# 调试并在代码执行前暂停
node --inspect-brk server.js
```

### 单元测试

使用 Jest 进行测试：

```javascript
// sum.js
function sum(a, b) {
  return a + b;
}
module.exports = sum;

// sum.test.js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

## 最佳实践

- **错误处理**：始终处理错误和异常
- **环境变量**：使用 `.env` 文件和 `dotenv` 包管理配置
- **安全性**：防止常见安全漏洞如注入攻击和跨站脚本
- **结构化**：遵循模块化设计原则
- **异步代码**：优先使用 async/await 而非回调
- **日志**：使用适当的日志记录（如 winston）
- **监控**：在生产环境中监控应用性能和错误

## 相关资源

- [Node.js 官方文档](https://nodejs.org/docs/)
- [NPM 官方网站](https://www.npmjs.com/)
- [Node.js 最佳实践](https://github.com/goldbergyoni/nodebestpractices)
