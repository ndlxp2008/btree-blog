# Vite 前端构建工具

Vite（法语中"快速"的意思）是一个现代化的前端构建工具，由尤雨溪（Vue.js 的创建者）开发，旨在提供更快速的开发体验。本文档详细介绍 Vite 的核心概念、配置方法、优化技巧以及最佳实践。

## 1. Vite 基础概念

### 1.1 什么是 Vite

Vite 是一个基于 ESM（ES Modules）的前端构建工具，它利用浏览器原生的 ES 模块功能提供极快的开发服务器启动和即时热模块替换（HMR）。Vite 由两部分组成：

1. **开发服务器**：利用原生 ES 模块提供丰富的内建功能，如极快的热模块替换（HMR）
2. **构建命令**：使用 Rollup 打包代码，预配置输出高度优化的静态资源用于生产环境

### 1.2 核心优势

- **极速的服务器启动**：不需要提前打包，按需编译
- **闪电般的热更新**：基于 ESM 的 HMR，只需精确更新变化的模块
- **丰富的功能**：内置对 TypeScript、JSX、CSS 等的支持
- **优化的构建**：使用 Rollup 进行生产构建，支持多页面应用和库模式
- **通用的插件接口**：兼容 Rollup 插件，易于扩展

### 1.3 安装和创建项目

使用 npm 初始化 Vite 项目：

```bash
# 使用 npm
npm create vite@latest my-vite-app -- --template vue

# 使用 yarn
yarn create vite my-vite-app --template vue

# 使用 pnpm
pnpm create vite my-vite-app -- --template vue
```

支持的模板包括：vanilla、vue、react、preact、lit、svelte 等。

## 2. Vite 配置

### 2.1 基本配置结构

Vite 配置文件 `vite.config.js`：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 共享选项
  plugins: [vue()],

  // 开发特有配置
  server: {
    port: 3000,
    open: true,
  },

  // 构建特有配置
  build: {
    outDir: 'dist',
    minify: 'esbuild',
  }
})
```

### 2.2 开发服务器配置

```javascript
export default defineConfig({
  server: {
    host: '0.0.0.0',     // 监听所有地址，包括局域网和公网
    port: 3000,          // 端口号
    open: true,          // 自动打开浏览器
    https: false,        // 是否启用 HTTPS
    cors: true,          // 允许跨域
    strictPort: false,   // 端口被占用时，是否终止程序
    hmr: {
      overlay: false,    // 关闭热更新错误蒙层
    },
    proxy: {             // 配置代理
      '/api': {
        target: 'http://example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 2.3 构建配置

```javascript
export default defineConfig({
  build: {
    outDir: 'dist',           // 输出目录
    assetsDir: 'assets',      // 静态资源目录
    assetsInlineLimit: 4096,  // 小于此阈值的导入或引用资源将作为 base64 编码内联
    cssCodeSplit: true,       // 启用 CSS 代码拆分
    target: 'modules',        // 设置最终构建的浏览器兼容目标
    minify: 'esbuild',        // 混淆器，可选值：'terser' | 'esbuild'
    sourcemap: false,         // 构建后是否生成 source map 文件
    rollupOptions: {          // 自定义底层的 Rollup 打包配置
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          // 将第三方库分块打包
        }
      }
    },
    terserOptions: {},        // 传递给 Terser 的更多选项
    brotliSize: false,        // 禁用 brotli 压缩大小报告
    chunkSizeWarningLimit: 500 // chunk 大小警告的限制（单位 kbs）
  }
})
```

### 2.4 依赖优化配置

```javascript
export default defineConfig({
  optimizeDeps: {
    entries: ['./src/main.js'],  // 指定入口点
    include: ['vue', 'vue-router'], // 强制预构建这些依赖
    exclude: ['@vite/client'],  // 排除一些不需要预构建的依赖
    esbuildOptions: {          // 传递给 esbuild 的选项
      plugins: []
    }
  }
})
```

### 2.5 解析配置

```javascript
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',           // 路径别名
      'components': '/src/components'
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'], // 导入时想要省略的扩展名列表
    dedupe: ['vue'],         // 强制 Vite 始终将列出的依赖项解析为同一副本
    conditions: ['import', 'module', 'browser', 'default'], // 解析程序条件
  }
})
```

## 3. Vite 插件系统

### 3.1 插件基础

Vite 插件扩展了 Rollup 的通用插件接口，带有一些 Vite 特有的配置选项。

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    myCustomPlugin()
  ]
})
```

### 3.2 常用官方插件

- **@vitejs/plugin-vue**: Vue 3 单文件组件支持
- **@vitejs/plugin-vue-jsx**: Vue 3 JSX 支持
- **@vitejs/plugin-react**: React 和 JSX 支持
- **@vitejs/plugin-legacy**: 为旧浏览器提供兼容性支持

### 3.3 自定义插件示例

```javascript
// myPlugin.js
export default function myPlugin() {
  const virtualFileId = '@my-virtual-file'

  return {
    name: 'my-plugin', // 必须的，会显示在警告和错误中

    // Vite 独有钩子
    config(config, { command }) {
      // 修改 Vite 配置
      return {
        // 返回部分配置以合并
      }
    },

    configResolved(resolvedConfig) {
      // 存储最终解析的配置
    },

    configureServer(server) {
      // 配置开发服务器
      server.middlewares.use((req, res, next) => {
        // 自定义处理
        next()
      })
    },

    // 通用钩子
    resolveId(id) {
      if (id === virtualFileId) {
        return virtualFileId
      }
    },

    load(id) {
      if (id === virtualFileId) {
        return `export const msg = "from virtual file"`
      }
    },

    transform(code, id) {
      // 转换特定文件
      if (id.endsWith('.vue')) {
        return {
          code: transformedCode,
          map: null // 提供 source map 如果可用
        }
      }
    }
  }
}
```

## 4. Vite 与框架集成

### 4.1 Vue 集成

Vite 为 Vue 提供第一优先级支持：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    open: '/index.html'
  },
  optimizeDeps: {
    include: ['vue']
  }
})
```

### 4.2 React 集成

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: '/index.html'
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
```

### 4.3 Angular 集成

Vite 可以通过 @analogjs/platform 与 Angular 进行集成：

```javascript
import { defineConfig } from 'vite'
import analog from '@analogjs/platform'

export default defineConfig({
  plugins: [analog()],
  optimizeDeps: {
    include: ['@angular/core']
  }
})
```

### 4.4 Svelte 集成

```javascript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    include: ['svelte']
  }
})
```

## 5. 环境变量和模式

### 5.1 环境变量

Vite 使用 dotenv 从环境目录中的下列文件加载额外的环境变量：

```
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```

加载的环境变量会通过 `import.meta.env` 暴露给客户端源码：

```javascript
console.log(import.meta.env.VITE_APP_TITLE)
console.log(import.meta.env.MODE)
console.log(import.meta.env.DEV)    // 是否是开发模式
console.log(import.meta.env.PROD)   // 是否是生产模式
console.log(import.meta.env.SSR)    // 是否是服务器端渲染
```

只有以 `VITE_` 为前缀的变量才会暴露给客户端源码。

### 5.2 不同的模式

Vite 默认支持三种模式：

- **development**: 开发模式（默认），用于 `vite` 命令
- **production**: 生产模式，用于 `vite build` 命令
- **test**: 测试模式，用于 `vitest` 命令

可以通过传递 `--mode` 选项来覆盖命令使用的默认模式：

```bash
vite build --mode staging
```

## 6. 静态资源处理

### 6.1 导入资源

Vite 通过特殊的 URL 支持静态资源导入：

```javascript
// 导入静态资源
import imgUrl from './img.png'
document.getElementById('hero').src = imgUrl

// 通过相对路径引用静态资源
document.getElementById('hero').src = '/img.png'

// 导入原始内容
import data from './data.json?raw'

// 导入 URL
import workletUrl from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletUrl)
```

### 6.2 Public 目录

放置在 `public` 目录下的资源将会原样复制到目标目录的根目录下，且不会经过 Vite 处理。

```
project-root/
  public/
    favicon.ico
    robots.txt
  index.html
  src/
    // ...
```

这些文件可以通过根路径访问：

```html
<link rel="icon" href="/favicon.ico" />
```

## 7. CSS 预处理和 PostCSS

### 7.1 CSS 预处理器支持

Vite 提供了对各种 CSS 预处理器的内置支持：

```javascript
// .scss, .sass
npm add -D sass

// .less
npm add -D less

// .styl, .stylus
npm add -D stylus
```

导入预处理器文件时无需安装特定的 Vite 插件：

```javascript
// 会自动应用预处理器
import './style.scss'
```

### 7.2 CSS Modules

任何以 `.module.css` 结尾的 CSS 文件都被认为是一个 CSS modules 文件：

```css
/* example.module.css */
.red {
  color: red;
}
```

```javascript
import styles from './example.module.css'
document.getElementById('app').className = styles.red
```

也可以自定义 CSS Modules 行为：

```javascript
export default defineConfig({
  css: {
    modules: {
      scopeBehaviour: 'local',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  }
})
```

### 7.3 PostCSS 配置

如果项目包含有效的 PostCSS 配置，它将自动应用于所有导入的 CSS：

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-nested': {},
  }
}
```

也可以通过 Vite 配置指定：

```javascript
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        postcssNested()
      ]
    }
  }
})
```

## 8. Vite 性能优化

### 8.1 开发服务器性能

- **依赖预构建**: 自动将 CommonJS 和 UMD 依赖转换为 ESM
- **按需编译**: 只有浏览器请求的模块会被编译，提高开发服务器启动速度
- **热模块替换**: 模块级别的 HMR，只更新变化的模块

### 8.2 构建优化

```javascript
export default defineConfig({
  build: {
    // 多页面应用模式
    rollupOptions: {
      input: {
        main: 'index.html',
        nested: 'nested/index.html'
      }
    },

    // 库模式
    lib: {
      entry: 'src/index.js',
      name: 'MyLib',
      fileName: (format) => `my-lib.${format}.js`
    },

    // 分割代码
    cssCodeSplit: true,

    // 压缩优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },

    // 浏览器兼容性
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari13'],

    // 预加载指令
    modulePreload: {
      polyfill: true
    }
  }
})
```

### 8.3 生产部署

- **使用预压缩**: 使用 `vite-plugin-compression` 预先压缩资源
- **启用缓存控制**: 通过输出文件名的内容哈希启用持久性缓存
- **使用 CDN**: 将构建后的资源放置在 CDN 上提高加载速度

```javascript
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    compression({
      threshold: 10240, // 大于 10kb 的文件进行压缩
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // 启用持久性缓存
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      }
    }
  },
  // 如果你的资源将部署在 CDN 上
  base: 'https://cdn.example.com/assets/'
})
```

## 9. 测试集成

### 9.1 Vitest 集成

Vitest 是与 Vite 原生集成的单元测试框架：

```bash
npm install -D vitest
```

```javascript
// vite.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
    },
  }
})
```

```javascript
// test/sum.test.js
import { describe, it, expect } from 'vitest'
import { sum } from '../src/math'

describe('sum function', () => {
  it('adds two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
```

### 9.2 与其他测试框架集成

- **Jest**: 使用 `vite-jest` 适配器
- **Cypress**: 可直接与 Vite 的开发服务器集成

## 10. Vite 与其他构建工具对比

### 10.1 Vite vs Webpack

| 特性 | Vite | Webpack |
|------|------|---------|
| 开发服务器启动 | 极快（不需要初始化打包） | 较慢（需要打包） |
| 热模块替换 | 快速、精确 | 相对较慢，整块刷新 |
| 配置复杂度 | 简单 | 复杂 |
| 生态系统 | 新但快速成长 | 成熟、庞大 |
| 生产构建工具 | Rollup | 自身 |
| 代码拆分 | 支持 | 支持，更灵活 |
| 静态资源处理 | 内置支持 | 需要各种 loader |

### 10.2 Vite vs Snowpack

| 特性 | Vite | Snowpack |
|------|------|----------|
| 底层构建工具 | Rollup | ESbuild |
| 插件生态 | 兼容 Rollup | 专有 |
| HMR 实现 | 原生 ESM | 原生 ESM |
| 社区支持度 | 活跃，持续发展 | 较少活跃 |
| 框架支持 | 多框架 | 多框架 |

### 10.3 Vite vs Esbuild

| 特性 | Vite | Esbuild |
|------|------|---------|
| 用途 | 完整的构建系统 | 主要是打包工具 |
| 速度 | 使用 Esbuild 预构建，开发极快 | 非常快，专注于编译速度 |
| 插件扩展性 | 丰富 | 有限 |
| HMR | 支持 | 不直接支持 |
| 生产就绪 | 成熟 | 尚在发展中 |

## 11. 实战案例

### 11.1 Vite + Vue 3 + TypeScript 项目配置

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          vendor: ['axios', 'lodash-es']
        }
      }
    }
  }
})
```

### 11.2 Vite + React + Tailwind CSS 项目配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
```

## 12. 总结

Vite 作为一个创新的前端构建工具，通过利用浏览器原生 ES 模块功能和现代打包工具，为开发人员提供了更高效、更快速的开发体验。它的即时服务器启动和快速热模块替换显著提高了开发效率，同时结合 Rollup 的生产构建能力，确保了优化的生产部署。

随着 Web 技术的发展和浏览器对 ES 模块的原生支持越来越好，Vite 这类基于 ESM 的构建工具将成为前端工程化的重要发展方向，为前端开发带来更多可能性。

无论是新项目还是现有项目迁移，Vite 都值得考虑作为首选的前端构建工具，特别是对于重视开发体验和构建性能的团队。