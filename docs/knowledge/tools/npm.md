# NPM 包管理器

NPM (Node Package Manager) 是 Node.js 的默认包管理器，是世界上最大的软件注册表之一。本文档介绍 NPM 的基本概念、常用命令以及最佳实践，帮助开发者高效地管理项目依赖和发布自己的包。

## 1. NPM 简介

### 1.1 什么是 NPM

NPM 是 Node.js 生态系统中的包管理工具，用于安装、共享和管理 JavaScript 代码包。它由以下三个主要部分组成：

- **网站**：用于搜索包、设置配置文件和管理访问权限
- **命令行工具 (CLI)**：通过终端运行的工具，是开发者与 NPM 交互的主要方式
- **注册表**：一个巨大的公共数据库，包含 JavaScript 软件和相关元数据

### 1.2 NPM 的重要性

- **依赖管理**：简化依赖安装和版本控制
- **代码重用**：避免重复编写已存在的功能
- **版本控制**：管理不同版本的依赖
- **构建工具**：通过脚本命令简化开发流程
- **社区参与**：便于分享和消费开源代码

### 1.3 NPM 与 Yarn、pnpm 的比较

**Yarn**:
- 并行安装，速度更快
- 自动生成详细的锁文件，确保安装一致性
- 更全面的错误报告
- 原生离线支持

**pnpm**:
- 磁盘空间利用率更高（通过硬链接共享依赖）
- 创建非扁平的 node_modules 结构
- 安装速度快，通常比 npm 和 yarn 都快
- 严格的依赖管理，防止访问未声明的依赖

## 2. 安装与配置

### 2.1 安装 Node.js 和 NPM

NPM 随 Node.js 一起安装。从 [Node.js 官网](https://nodejs.org/) 下载并安装 Node.js，即可同时获得 NPM。

**验证安装**:
```bash
node --version
npm --version
```

### 2.2 更新 NPM

```bash
# Windows
npm install -g npm@latest

# macOS/Linux (可能需要 sudo)
sudo npm install -g npm@latest
```

### 2.3 NPM 配置

**查看配置**:
```bash
npm config list
```

**设置配置**:
```bash
npm config set key value
```

**常用配置选项**:
```bash
# 设置默认作者信息
npm config set init-author-name "Your Name"
npm config set init-author-email "your.email@example.com"

# 设置默认仓库
npm config set registry https://registry.npmjs.org/

# 设置镜像（中国用户常用）
npm config set registry https://registry.npmmirror.com/
```

**使用 .npmrc 文件**:

在项目或用户主目录创建 `.npmrc` 文件可以配置 NPM 选项:
```
registry=https://registry.npmjs.org/
save-exact=true
```

## 3. 基本概念

### 3.1 package.json 文件

`package.json` 是项目的配置文件，包含项目的元数据和依赖信息。

**创建 package.json**:
```bash
npm init          # 交互式创建
npm init -y       # 使用默认值快速创建
```

**package.json 主要字段**:
```json
{
  "name": "project-name",        // 包名
  "version": "1.0.0",            // 版本号
  "description": "",             // 项目描述
  "main": "index.js",            // 主入口文件
  "scripts": {                   // 脚本命令
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],                // 关键词
  "author": "",                  // 作者信息
  "license": "ISC",              // 许可证
  "dependencies": {},            // 生产依赖
  "devDependencies": {}          // 开发依赖
}
```

### 3.2 语义化版本控制

NPM 使用语义化版本控制（SemVer）:

- **主版本号 (Major)**：不兼容的 API 更改
- **次版本号 (Minor)**：向后兼容的功能添加
- **补丁版本号 (Patch)**：向后兼容的错误修复

**版本范围表示**:
- `5.0.0`: 精确版本
- `^5.0.0`: 兼容补丁和小更新 (5.x.x)
- `~5.0.0`: 兼容补丁更新 (5.0.x)
- `>=5.0.0`: 大于等于指定版本
- `5.0.0 - 5.1.0`: 版本范围
- `latest`: 最新版本

### 3.3 依赖类型

- **dependencies**: 生产环境需要的依赖
- **devDependencies**: 仅开发和测试需要的依赖
- **peerDependencies**: 宿主项目中需要存在的依赖
- **optionalDependencies**: 可选依赖，安装失败不会导致安装过程失败
- **bundledDependencies**: 打包时需要包含的依赖

### 3.4 package-lock.json

`package-lock.json` 是 NPM 5+ 引入的锁文件，用于锁定依赖结构和版本，确保不同环境下有一致的依赖树。它包含:

- 依赖的确切版本
- 依赖的依赖树
- 每个包的完整性哈希值

## 4. NPM 命令详解

### 4.1 安装依赖

**安装项目依赖**:
```bash
npm install                 # 安装 package.json 中所有依赖
npm i                       # 简写形式
```

**安装特定包**:
```bash
npm install package-name    # 安装最新版本并添加到 dependencies
npm i package-name          # 简写形式

npm install package-name@1.0.0  # 安装特定版本
npm install package-name@latest  # 安装最新版本
```

**安装开发依赖**:
```bash
npm install --save-dev package-name
npm i -D package-name
```

**全局安装**:
```bash
npm install -g package-name
```

**安装选项**:
```bash
npm install --production      # 仅安装 dependencies
npm install --no-save         # 安装但不更新 package.json
npm install --force           # 强制重新下载所有包
npm install --legacy-peer-deps  # 使用旧版本处理 peerDependencies
```

### 4.2 卸载依赖

```bash
npm uninstall package-name           # 从项目和 package.json 中移除
npm uninstall -g package-name        # 卸载全局包
npm uninstall --save-dev package-name  # 从 devDependencies 中移除
```

### 4.3 更新依赖

```bash
npm update                  # 更新所有依赖
npm update package-name     # 更新特定依赖
npm update -g               # 更新全局包

npm outdated               # 检查过时的依赖
```

### 4.4 查看信息

```bash
npm list                   # 查看本地安装的包
npm list --depth=0         # 仅查看顶层依赖
npm list -g --depth=0      # 查看全局安装的顶层包

npm view package-name      # 查看包的详细信息
npm view package-name versions  # 查看包的所有可用版本
```

### 4.5 运行脚本

在 package.json 的 scripts 字段定义脚本:
```json
"scripts": {
  "start": "node server.js",
  "test": "jest",
  "build": "webpack"
}
```

运行脚本:
```bash
npm run start       # 运行 start 脚本
npm start           # 内置脚本可以省略 run
npm run test
npm test            # 内置脚本简写
npm run build
```

### 4.6 发布包

```bash
npm login           # 登录 NPM 账号
npm publish         # 发布当前目录下的包
npm publish --access public  # 发布公共包（对于用户作用域包）
```

### 4.7 NPM 缓存管理

```bash
npm cache verify     # 验证缓存
npm cache clean --force  # 清除缓存
```

## 5. 项目最佳实践

### 5.1 依赖管理策略

**锁定版本**:
```bash
npm config set save-exact true  # 锁定精确版本而非范围
```

**使用 package-lock.json**:
- 应该将此文件提交到版本控制
- 确保团队成员使用完全相同的依赖版本

**定期更新依赖**:
```bash
npm outdated  # 查看过时的依赖
npm update    # 更新依赖
```

**安全审计**:
```bash
npm audit              # 审计依赖中的安全问题
npm audit fix          # 自动修复问题
npm audit fix --force  # 强制升级有重大更改的包以修复漏洞
```

### 5.2 高效的脚本配置

**链式命令**:
```json
"scripts": {
  "clean": "rimraf dist",
  "build": "npm run clean && webpack"
}
```

**生命周期钩子**:
```json
"scripts": {
  "prebuild": "npm run clean",
  "build": "webpack",
  "postbuild": "echo Build completed!"
}
```

**并行运行任务**:
```json
"scripts": {
  "lint": "eslint src",
  "test": "jest",
  "validate": "npm-run-all --parallel lint test"
}
```

### 5.3 私有包和组织

**创建作用域包**:
```json
{
  "name": "@organization/package-name",
  "version": "1.0.0"
}
```

**发布到组织**:
```bash
npm publish --access public  # 公开包
npm publish                  # 私有包（需要付费计划）
```

**使用私有注册表**:
```bash
npm config set @organization:registry https://registry.organization.com/
```

### 5.4 Monorepo 管理

对于包含多个相关包的仓库，可以使用：

- **Lerna**: 用于管理和发布多包仓库
- **npm workspaces**: NPM 7+ 内置的工作区功能

**配置 workspaces**:
```json
{
  "name": "root",
  "private": true,
  "workspaces": ["packages/*"]
}
```

**使用 workspaces**:
```bash
npm install                     # 安装所有工作区依赖
npm run test --workspace=package-name  # 在特定工作区运行命令
npm run test --workspaces       # 在所有工作区运行命令
```

## 6. 常见问题与解决方案

### 6.1 权限问题

**Windows**:
- 以管理员身份运行命令提示符

**macOS/Linux**:
```bash
# 避免使用 sudo
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
```

在 ~/.profile、~/.bash_profile 或 ~/.zshrc 中添加:
```
export PATH=~/.npm-global/bin:$PATH
```

### 6.2 依赖冲突

**识别冲突**:
```bash
npm ls package-name  # 查看某个包的依赖树
```

**强制使用特定版本**:
```json
"dependencies": {
  "package-name": "1.0.0"
},
"resolutions": {
  "sub-dependency": "2.0.0"
}
```

**使用 npm-force-resolutions 包**:
```bash
npm install --save-dev npm-force-resolutions
```

在 package.json 中添加:
```json
"scripts": {
  "preinstall": "npx npm-force-resolutions"
},
"resolutions": {
  "sub-dependency": "2.0.0"
}
```

### 6.3 安装失败问题

**常见解决方案**:
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 并重新安装
rm -rf node_modules
npm install

# 使用遗留的对等依赖解析
npm install --legacy-peer-deps

# 放宽安全策略
npm install --force
```

### 6.4 网络问题

**使用镜像**:
```bash
# 临时使用镜像
npm install --registry=https://registry.npmmirror.com/

# 永久设置镜像
npm config set registry https://registry.npmmirror.com/
```

**代理设置**:
```bash
npm config set proxy http://username:password@host:port
npm config set https-proxy http://username:password@host:port
```

## 7. 高级功能

### 7.1 NPX

NPX 是 NPM 5.2+ 附带的一个工具，用于执行包，特别适合一次性命令：

```bash
# 无需全局安装即可运行包
npx create-react-app my-app

# 指定特定版本
npx -p @angular/cli@10 ng new my-app

# 运行 GitHub 仓库代码
npx github:user/repo

# 使用不同 Node.js 版本运行
npx -n --node-arg=--version node
```

### 7.2 NPM CI

`npm ci` 是为 CI/CD 环境设计的安装命令：

```bash
npm ci  # 严格按照 package-lock.json 安装
```

特点:
- 必须已存在 package-lock.json
- 总是删除现有的 node_modules
- 不写入 package.json 或 package-lock.json
- 安装失败时整个过程失败（不是部分安装）
- 比 npm install 速度更快

### 7.3 自定义 NPM 初始化模板

创建 `.npm-init.js` 文件在用户主目录:

```javascript
module.exports = {
  name: prompt('package name', process.cwd().split('/').pop()),
  version: prompt('version', '0.1.0'),
  description: prompt('description', ''),
  main: prompt('entry point', 'index.js'),
  repository: prompt('repository url', ''),
  keywords: prompt('keywords', '').split(/\s+/),
  author: prompt('author', 'Your Name <your.email@example.com>'),
  license: prompt('license', 'MIT')
}
```

### 7.4 NPM hook 脚本

NPM 脚本可以有生命周期钩子:

- `pre<script>`: 在特定脚本之前运行
- `post<script>`: 在特定脚本之后运行

```json
"scripts": {
  "preinstall": "echo 安装前准备...",
  "install": "echo 安装中...",
  "postinstall": "echo 安装完成！",

  "prebuild": "echo 构建前准备...",
  "build": "webpack",
  "postbuild": "echo 构建完成！"
}
```

## 8. NPM 生态系统

### 8.1 常用工具包

开发工具:
- **Webpack**: 模块打包器
- **Babel**: JavaScript 编译器
- **ESLint**: 代码检查工具
- **Prettier**: 代码格式化工具
- **Jest**: JavaScript 测试框架

实用工具:
- **Lodash/Underscore**: 实用函数库
- **Axios**: HTTP 客户端
- **Moment.js/date-fns**: 日期处理
- **uuid**: 生成 UUID

CLI 工具:
- **commander**: 命令行界面构建工具
- **inquirer**: 交互式命令行用户界面
- **chalk**: 终端字符串样式

框架:
- **React**: 用户界面库
- **Vue**: 渐进式 JavaScript 框架
- **Angular**: 应用设计框架和开发平台
- **Express**: Web 应用框架
- **NestJS**: Node.js 服务器端应用框架

### 8.2 NPM 替代品

- **Yarn**: Facebook 开发的包管理器，注重安全性和一致性
- **pnpm**: 高效的磁盘空间利用和严格的依赖管理
- **Bun**: 全新的 JavaScript 运行时和包管理器，注重速度
- **Deno**: 安全的 JavaScript/TypeScript 运行时，内置依赖管理

### 8.3 Node.js 版本管理

与 NPM 协同使用的 Node.js 版本管理工具:

- **nvm (Node Version Manager)**: Unix 系统管理多个 Node.js 版本
- **nvm-windows**: Windows 系统的 Node.js 版本管理器
- **n**: 简单的 Node.js 版本管理器
- **Volta**: 不同项目中自动切换 Node.js 版本的工具

## 总结

NPM 是 Node.js 生态系统的核心组件，为 JavaScript 开发者提供了强大的包管理功能。通过本文档介绍的基本概念、常用命令和最佳实践，开发者可以更高效地管理项目依赖、发布自己的包，并利用 NPM 生态系统中丰富的工具和库加速开发过程。随着项目复杂度的增加，合理使用 NPM 的高级功能和最佳实践变得尤为重要，它们可以帮助开发者解决常见问题，提高开发效率，并确保项目的稳定性和可维护性。