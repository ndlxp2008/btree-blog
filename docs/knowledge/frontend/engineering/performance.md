# 前端性能优化

前端性能优化是提升用户体验、增加页面转化率的关键因素。本文档详细介绍前端性能优化的指标、分析方法、优化策略以及最佳实践。

## 1. 性能指标与测量

### 1.1 关键性能指标

- **FCP (First Contentful Paint)**: 首次内容绘制，标记浏览器渲染来自 DOM 第一位内容的时间点
- **LCP (Largest Contentful Paint)**: 最大内容绘制，测量视口中最大的内容元素何时完成渲染
- **FID (First Input Delay)**: 首次输入延迟，从用户首次交互到浏览器响应的时间
- **CLS (Cumulative Layout Shift)**: 累积布局偏移，测量视觉稳定性，即元素在页面加载过程中移动的程度
- **TTI (Time to Interactive)**: 可交互时间，页面完全可交互所需的时间
- **TBT (Total Blocking Time)**: 总阻塞时间，FCP 与 TTI 之间阻塞主线程的总时间

### 1.2 测量工具

#### 1.2.1 实验室工具

- **Lighthouse**: Chrome 开发者工具内置，可测量性能、可访问性、SEO 等
- **WebPageTest**: 强大的网页性能测试工具，支持多地区、多设备测试
- **Chrome DevTools**: Performance 和 Network 面板提供详细的性能分析
- **PageSpeed Insights**: 结合实验室数据和真实用户监测(RUM)数据

#### 1.2.2 现场监测工具

- **Web Vitals**: Google 提供的轻量级库，用于测量核心 Web 指标
- **New Relic**: 全栈性能监控工具
- **Datadog**: 全面的监控与分析平台
- **Sentry**: 实时错误跟踪与性能监控

### 1.3 性能预算

设定性能预算是确保网站保持高性能的有效策略：

```javascript
// 在webpack中设置性能预算
module.exports = {
  performance: {
    maxAssetSize: 100000, // 单个资源大小限制（字节）
    maxEntrypointSize: 250000, // 入口点大小限制（字节）
    hints: 'warning' // 超出限制时显示警告
  }
};
```

## 2. 资源优化

### 2.1 减少资源大小

#### 2.1.1 代码压缩与最小化

```javascript
// webpack配置
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 移除console
            drop_debugger: true // 移除debugger
          }
        }
      }),
      new CssMinimizerPlugin() // CSS压缩
    ]
  }
};
```

#### 2.1.2 Tree Shaking

```javascript
// package.json
{
  "sideEffects": false // 标记无副作用的包
}

// webpack配置
module.exports = {
  mode: 'production', // 生产模式自动启用Tree Shaking
  optimization: {
    usedExports: true // 标记未使用的导出
  }
};
```

#### 2.1.3 代码分割

```javascript
// webpack配置
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

### 2.2 图像优化

#### 2.2.1 使用适当的图像格式

- **JPEG**: 适用于照片和渐变图像
- **PNG**: 适用于需要透明度的图像
- **WebP**: 比JPEG和PNG更高效的格式，提供更好的压缩和质量
- **AVIF**: 新一代图像格式，比WebP更好的压缩效率
- **SVG**: 适用于图标和简单图形

#### 2.2.2 响应式图像

```html
<picture>
  <source media="(max-width: 600px)" srcset="small.jpg">
  <source media="(max-width: 1200px)" srcset="medium.jpg">
  <img src="large.jpg" alt="描述">
</picture>
```

```html
<img
  src="image.jpg"
  srcset="image-320w.jpg 320w, image-480w.jpg 480w, image-800w.jpg 800w"
  sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px"
  alt="描述"
>
```

#### 2.2.3 图像压缩

- **imagemin**: 图像压缩工具库
- **TinyPNG/TinyJPG**: 高效的有损压缩服务
- **WebP转换**: 使用`cwebp`工具转换图像为WebP格式

```javascript
// 使用webpack插件压缩图像
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  plugins: [
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['mozjpeg', { quality: 80 }],
            ['pngquant', { quality: [0.6, 0.8] }],
            ['svgo', { plugins: [{ removeViewBox: false }] }]
          ]
        }
      }
    })
  ]
};
```

### 2.3 字体优化

#### 2.3.1 使用系统字体

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}
```

#### 2.3.2 字体子集化

```css
/* 仅加载拉丁文字符集 */
@font-face {
  font-family: 'Noto Sans';
  src: url('NotoSans-Regular-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC;
  font-display: swap;
}
```

#### 2.3.3 使用font-display

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  font-display: swap; /* 先显示系统字体，字体加载后再替换 */
}
```

## 3. 网络优化

### 3.1 HTTP缓存策略

```
# Apache配置
<IfModule mod_expires.c>
  ExpiresActive On

  # 图像缓存1年
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"

  # CSS和JavaScript缓存1个月
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"

  # HTML文档缓存1天
  ExpiresByType text/html "access plus 1 day"
</IfModule>
```

```
# Nginx配置
location ~* \.(jpg|jpeg|png|gif|ico)$ {
  expires 1y;
  add_header Cache-Control "public";
}

location ~* \.(css|js)$ {
  expires 1M;
  add_header Cache-Control "public";
}
```

### 3.2 资源预加载

```html
<!-- 预连接到关键第三方域名 -->
<link rel="preconnect" href="https://cdn.example.com">

<!-- 预加载关键资源 -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero-image.webp" as="image">

<!-- 预获取可能需要的资源 -->
<link rel="prefetch" href="next-page.js">

<!-- DNS预解析 -->
<link rel="dns-prefetch" href="https://api.example.com">
```

### 3.3 压缩传输

```
# Nginx Gzip配置
gzip on;
gzip_comp_level 5;
gzip_min_length 256;
gzip_proxied any;
gzip_vary on;
gzip_types
  application/javascript
  application/json
  application/ld+json
  application/manifest+json
  application/xml
  font/opentype
  image/svg+xml
  text/css
  text/plain;
```

### 3.4 服务端推送与HTTP/2

```
# Nginx HTTP/2配置
server {
  listen 443 ssl http2;
  server_name example.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  # HTTP/2 服务端推送
  location / {
    http2_push /style.css;
    http2_push /script.js;
  }
}
```

## 4. 渲染性能优化

### 4.1 关键渲染路径优化

#### 4.1.1 CSS优先加载

```html
<!-- 内联关键CSS -->
<style>
  /* 关键渲染CSS */
  body { margin: 0; font-family: sans-serif; }
  header { background: #f0f0f0; height: 60px; }
</style>

<!-- 异步加载非关键CSS -->
<link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="non-critical.css"></noscript>
```

#### 4.1.2 JavaScript加载策略

```html
<!-- 现代浏览器中使用模块脚本 -->
<script type="module" src="app.js"></script>

<!-- 传统浏览器回退 -->
<script nomodule src="app-legacy.js"></script>

<!-- 异步加载非关键脚本 -->
<script src="non-critical.js" async></script>

<!-- 延迟加载脚本直到HTML解析完成 -->
<script src="deferred.js" defer></script>
```

### 4.2 优化首屏内容

#### 4.2.1 服务端渲染(SSR)

```javascript
// Express + React SSR 示例
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

app.get('/', (req, res) => {
  const html = renderToString(<App />);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR App</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="client.js"></script>
      </body>
    </html>
  `);
});
```

#### 4.2.2 静态站点生成(SSG)

```javascript
// Next.js SSG 示例
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();

  return {
    props: { data },
    revalidate: 60 // 增量静态再生成，每60秒更新
  };
}

export default function Page({ data }) {
  return <div>{data.map(item => <div key={item.id}>{item.title}</div>)}</div>;
}
```

### 4.3 减少重绘和回流

```javascript
// 不好的做法 - 多次DOM操作触发多次回流
const element = document.getElementById('box');
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '10px';

// 好的做法 - 批量更新减少回流
const element = document.getElementById('box');
element.classList.add('updated-box'); // CSS类包含所有样式变更

// 或者使用cssText
element.style.cssText = 'width: 100px; height: 100px; margin: 10px;';
```

## 5. JavaScript性能优化

### 5.1 代码优化

#### 5.1.1 避免内存泄漏

```javascript
// 闭包导致的内存泄漏
function createLeak() {
  const largeData = new Array(1000000).fill('x');

  return function() {
    // 不使用largeData但仍然保持引用
    console.log('Leaked function');
  };
}

// 正确做法
function createNoLeak() {
  // 使用后不再引用大数据
  const data = processData();
  return function() {
    return data.result;
  };
}
```

#### 5.1.2 优化循环

```javascript
const items = ['a', 'b', 'c', 'd', 'e'];

// 不佳实践 - 每次迭代获取长度
for (let i = 0; i < items.length; i++) {
  console.log(items[i]);
}

// 优化 - 缓存数组长度
for (let i = 0, len = items.length; i < len; i++) {
  console.log(items[i]);
}

// 更好的做法 - 使用现代迭代方法
items.forEach(item => console.log(item));
// 或
for (const item of items) {
  console.log(item);
}
```

#### 5.1.3 防抖和节流

```javascript
// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 使用防抖处理搜索输入
const debouncedSearch = debounce(searchAPI, 300);
searchInput.addEventListener('input', debouncedSearch);

// 节流函数
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用节流处理滚动事件
const throttledScroll = throttle(handleScroll, 100);
window.addEventListener('scroll', throttledScroll);
```

### 5.2 异步操作优化

#### 5.2.1 使用Web Workers

```javascript
// main.js
const worker = new Worker('worker.js');

worker.postMessage({data: largeArray});

worker.onmessage = function(e) {
  console.log('Result from worker:', e.data.result);
};

// worker.js
self.onmessage = function(e) {
  const result = processData(e.data.data);
  self.postMessage({result});
};

function processData(data) {
  // 复杂计算...
  return result;
}
```

#### 5.2.2 异步加载与延迟执行

```javascript
// 使用Intersection Observer延迟加载内容
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;
      // 加载内容或执行操作
      loadContent(element);
      observer.unobserve(element);
    }
  });
});

document.querySelectorAll('.lazy-load').forEach(el => observer.observe(el));
```

## 6. 框架特定优化

### 6.1 React优化

#### 6.1.1 组件优化

```jsx
// 使用React.memo避免不必要的重渲染
const MyComponent = React.memo(function MyComponent(props) {
  // 组件逻辑
  return <div>{props.name}</div>;
});

// 使用useMemo缓存计算结果
function ExpensiveComponent({ data }) {
  const processedData = React.useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  return <div>{processedData}</div>;
}

// 使用useCallback缓存函数引用
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = React.useCallback(() => {
    console.log('Button clicked');
  }, []); // 空依赖数组，函数引用永不变化

  return <Child onClick={handleClick} />;
}
```

#### 6.1.2 虚拟列表

```jsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      width={300}
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 6.2 Vue优化

#### 6.2.1 避免不必要的组件更新

```vue
<script>
export default {
  props: ['user'],
  computed: {
    // 使用计算属性缓存结果
    formattedUser() {
      return {
        name: this.user.name,
        email: this.user.email
      };
    }
  }
}
</script>
```

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello'
    };
  },
  methods: {
    // 使用箭头函数缓存方法引用
    handleClick: () => {
      console.log('Clicked');
    }
  }
}
</script>
```

#### 6.2.2 大型列表渲染

```vue
<template>
  <recycle-scroller
    class="scroller"
    :items="items"
    :item-size="32"
  >
    <template v-slot="{ item }">
      <div class="user-item">
        {{ item.name }}
      </div>
    </template>
  </recycle-scroller>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default {
  components: {
    RecycleScroller
  },
  data() {
    return {
      items: Array.from({ length: 10000 }).map((_, i) => ({
        id: i,
        name: `User ${i}`
      }))
    }
  }
}
</script>
```

## 7. 移动端优化

### 7.1 响应式设计

```css
/* 使用相对单位 */
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 媒体查询 */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .main-content {
    width: 100%;
  }
}

/* 使用视口单位 */
.hero {
  height: 80vh;
  padding: 5vw;
}
```

### 7.2 触摸优化

```css
/* 确保触摸目标足够大 */
button, .tap-target {
  min-width: 44px;
  min-height: 44px;
}

/* 禁用缩放和滚动反弹效果 */
html {
  touch-action: manipulation;
}
```

```javascript
// 优化点击事件，处理300ms延迟
// 使用FastClick库
import FastClick from 'fastclick';
FastClick.attach(document.body);

// 或使用触摸事件
element.addEventListener('touchstart', handleTap, { passive: true });
```

## 8. 监控与持续优化

### 8.1 设置性能监控

```javascript
// 使用Performance API记录指标
const performanceObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`[Performance] ${entry.name}: ${entry.startTime.toFixed(0)}ms`);
    // 发送到分析服务
    sendToAnalytics(entry);
  });
});

// 监听各种性能指标
performanceObserver.observe({ entryTypes: ['navigation', 'resource', 'paint', 'layout-shift'] });

// 自定义性能标记
performance.mark('app-initialized');
// 某些操作...
performance.mark('app-interactive');
performance.measure('app-startup', 'app-initialized', 'app-interactive');
```

### 8.2 用户体验指标

```javascript
// 监测FID (First Input Delay)
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log('FID:', delay);
    // 发送到分析服务
  }
}).observe({type: 'first-input', buffered: true});

// 监测LCP (Largest Contentful Paint)
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.startTime);
  // 发送到分析服务
}).observe({type: 'largest-contentful-paint', buffered: true});
```

## 9. 工具与最佳实践

### 9.1 性能检查清单

- [ ] 使用现代图像格式(WebP/AVIF)
- [ ] 实现适当的缓存策略
- [ ] 压缩所有文本资源(HTML/CSS/JS)
- [ ] 移除未使用的CSS/JS
- [ ] 优化关键渲染路径
- [ ] 延迟加载非关键资源
- [ ] 实现响应式设计
- [ ] 优化字体加载
- [ ] 使用HTTP/2或HTTP/3
- [ ] 设置性能预算与监控

### 9.2 自动化优化工具

- **Lighthouse CI**: 集成到CI/CD流程中的性能检测
- **Webpack Bundle Analyzer**: 分析打包结果，找出大型依赖
- **PurgeCSS**: 移除未使用的CSS
- **ESLint性能规则**: 检测可能的性能问题

```javascript
// webpack.config.js使用Bundle Analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false
    })
  ]
};
```

## 10. 未来趋势与新技术

### 10.1 Core Web Vitals与页面体验更新

Google已将Core Web Vitals(LCP、FID、CLS)作为搜索排名因素，重点关注用户体验指标。随着Web Vitals的更新，未来会有更多关键指标被引入。

### 10.2 HTTP/3与QUIC协议

HTTP/3基于QUIC协议，使用UDP而非TCP，提供更低的延迟和更好的连接迁移能力。

### 10.3 ESM优化

原生ES模块(ESM)逐渐成为标准，允许更细粒度的代码分割和更高效的加载。

```html
<!-- 直接在浏览器中使用ESM -->
<script type="module">
  import { feature } from './module.js';
  feature();
</script>
```

### 10.4 WebAssembly

WebAssembly(WASM)允许以接近原生的速度运行编译代码，适用于性能密集型应用。

```javascript
// 加载WebAssembly模块
const response = await fetch('module.wasm');
const bytes = await response.arrayBuffer();
const { instance } = await WebAssembly.instantiate(bytes);
const result = instance.exports.calculate(10);
```

## 11. 总结

前端性能优化是一个持续性工作，需要从多个层面综合考虑：资源优化、网络传输、渲染性能和代码执行。通过本文介绍的各种技术和最佳实践，可以显著提升网站性能，改善用户体验，提高业务转化率。

记住性能优化的核心原则：测量、优化、监控、迭代。不断收集数据，针对性优化，持续监控效果，然后根据结果进行迭代改进。