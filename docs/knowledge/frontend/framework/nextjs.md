# Next.js

Next.js 是一个用于构建 Web 应用程序的 React 框架，它提供了一系列的工具和功能，简化了现代 Web 应用的开发过程。Next.js 通过提供服务器端渲染 (SSR)、静态站点生成 (SSG)、API 路由等功能，帮助开发者构建高性能、可伸缩的应用。

## 核心特性

### 1. 多种渲染模式

Next.js 支持多种渲染策略，可以根据页面需求灵活选择：

#### 服务器端渲染 (SSR)

每次请求时在服务器上渲染页面：

```jsx
// pages/ssr-page.js
export default function Page({ data }) {
  return <div>Hello {data.name}</div>
}

export async function getServerSideProps() {
  // 获取外部数据
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()

  // 作为 props 传递给页面
  return { props: { data } }
}
```

#### 静态站点生成 (SSG)

在构建时预渲染页面：

```jsx
// pages/ssg-page.js
export default function Page({ data }) {
  return <div>Hello {data.name}</div>
}

export async function getStaticProps() {
  // 获取外部数据
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()

  return {
    props: { data },
    // 增量静态再生成 - 每 10 秒重新生成页面
    revalidate: 10, // 秒
  }
}
```

#### 客户端渲染 (CSR)

完全在浏览器中渲染页面：

```jsx
// pages/csr-page.js
import { useEffect, useState } from 'react'

export default function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/data')
      const result = await res.json()
      setData(result)
    }
    fetchData()
  }, [])

  if (!data) return <div>Loading...</div>
  return <div>Hello {data.name}</div>
}
```

#### 混合渲染

Next.js 允许在同一应用中混合使用不同的渲染策略，以优化用户体验和性能。

### 2. 文件系统路由

Next.js 使用基于文件系统的路由，简化了路由配置：

```
pages/
├── index.js           # 对应路由 /
├── about.js           # 对应路由 /about
├── blog/
│   ├── index.js       # 对应路由 /blog
│   └── [slug].js      # 对应路由 /blog/:slug
└── api/
    └── hello.js       # 对应 API 路由 /api/hello
```

#### 动态路由

通过文件名中的方括号定义动态路由参数：

```jsx
// pages/posts/[id].js
import { useRouter } from 'next/router'

export default function Post() {
  const router = useRouter()
  const { id } = router.query

  return <div>Post ID: {id}</div>
}
```

#### 捕获所有路由

使用 `[...param]` 可以捕获所有后续路径段：

```jsx
// pages/docs/[...slug].js
import { useRouter } from 'next/router'

export default function Docs() {
  const router = useRouter()
  const { slug } = router.query
  // slug 是一个数组，例如 /docs/a/b/c 会得到 ['a', 'b', 'c']

  return <div>Slug: {slug?.join('/')}</div>
}
```

### 3. 内置 CSS 支持

Next.js 提供了多种 CSS 解决方案：

#### 全局 CSS

```jsx
// pages/_app.js
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

#### CSS 模块

```jsx
// Button.module.css
.button {
  padding: 20px;
  background-color: blue;
  color: white;
}

// components/Button.js
import styles from './Button.module.css'

export default function Button() {
  return <button className={styles.button}>Click me</button>
}
```

#### Styled JSX

```jsx
export default function Button() {
  return (
    <>
      <button>Click me</button>
      <style jsx>{`
        button {
          padding: 20px;
          background-color: blue;
          color: white;
        }
      `}</style>
    </>
  )
}
```

#### Tailwind CSS

Next.js 可以轻松集成 Tailwind CSS：

```jsx
// 安装后在 components/Button.js
export default function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
      Click me
    </button>
  )
}
```

### 4. 图像优化

Next.js 提供了内置的图像组件，自动优化图像：

```jsx
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <Image
        src="/profile.jpg"
        alt="Profile picture"
        width={500}
        height={300}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
      />
    </div>
  )
}
```

`next/image` 组件提供：
- 自动调整图像大小
- 懒加载
- WebP/AVIF 格式转换（当浏览器支持时）
- 避免布局偏移
- 响应式支持

### 5. API 路由

Next.js 允许创建 API 端点，实现后端功能：

```jsx
// pages/api/users.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    // 处理 GET 请求
    res.status(200).json({ users: ['John', 'Jane'] })
  } else if (req.method === 'POST') {
    // 处理 POST 请求
    const { name } = req.body
    res.status(201).json({ message: `User ${name} created` })
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
```

#### 动态 API 路由

```jsx
// pages/api/users/[id].js
export default function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    // 获取用户信息
    res.status(200).json({ id, name: `User ${id}` })
  } else if (req.method === 'DELETE') {
    // 删除用户
    res.status(200).json({ message: `User ${id} deleted` })
  } else {
    res.setHeader('Allow', ['GET', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
```

### 6. 国际化支持

Next.js 提供内置的国际化 (i18n) 支持：

```jsx
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en',
      },
      {
        domain: 'example.fr',
        defaultLocale: 'fr',
      },
    ],
  },
}
```

使用国际化路由：

```jsx
// pages/blog/[slug].js
export default function Blog({ slug }) {
  return <h1>Blog Post: {slug}</h1>
}

export async function getStaticProps({ params, locale }) {
  return {
    props: {
      slug: params.slug,
      locale, // 'en', 'fr', 或 'de'
    },
  }
}

export async function getStaticPaths({ locales }) {
  const paths = []

  for (const locale of locales) {
    paths.push({
      params: { slug: 'my-post' },
      locale,
    })
  }

  return {
    paths,
    fallback: false,
  }
}
```

## 项目结构

典型的 Next.js 项目结构：

```
my-next-app/
├── .next/              # 构建输出（自动生成）
├── node_modules/       # 依赖（自动生成）
├── public/             # 静态资源
│   ├── favicon.ico
│   └── images/
├── pages/              # 页面路由
│   ├── _app.js         # 自定义应用组件
│   ├── _document.js    # 自定义文档
│   ├── index.js        # 首页
│   └── api/            # API 路由
├── components/         # 可重用组件
├── styles/             # CSS 样式
├── lib/                # 工具函数
├── next.config.js      # Next.js 配置
├── package.json        # 项目依赖
└── README.md           # 项目文档
```

## 高级特性

### 1. 中间件

中间件允许在请求完成之前运行代码：

```jsx
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // 检查身份验证
  if (pathname.startsWith('/dashboard')) {
    // 检查 cookie 或 JWT 令牌
    const token = request.cookies.get('token')

    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
}
```

### 2. Next.js 构建分析

使用内置的分析工具优化应用：

```bash
ANALYZE=true npm run build
```

### 3. Edge 运行时

在 Edge 运行时上执行代码，减少延迟：

```jsx
// pages/edge.js
export default function Page({ data }) {
  return <div>{data.message}</div>
}

export const getServerSideProps = async () => {
  return {
    props: {
      data: { message: 'Hello from the Edge!' },
    },
  }
}

export const config = {
  runtime: 'experimental-edge',
}
```

### 4. ISR (增量静态再生成)

静态页面的内容可以在后台重新生成：

```jsx
// pages/products/[id].js
export default function Product({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
    </div>
  )
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://api.example.com/products/${params.id}`)
  const product = await res.json()

  return {
    props: { product },
    revalidate: 60, // 60 秒后重新生成
  }
}

export async function getStaticPaths() {
  const res = await fetch('https://api.example.com/products/featured')
  const products = await res.json()

  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }))

  return {
    paths,
    fallback: 'blocking', // 对于未生成的路径，在首次访问时服务器端渲染
  }
}
```

### 5. 动态导入

优化首次加载性能，按需加载组件：

```jsx
import dynamic from 'next/dynamic'

// 动态导入组件
const DynamicComponent = dynamic(() => import('../components/heavy-component'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // 禁用服务器端渲染
})

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <DynamicComponent />
    </div>
  )
}
```

## 部署选项

### 1. Vercel (推荐)

由 Next.js 创建者开发的平台，提供最佳支持：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 2. 自托管

使用 Node.js 服务器：

```bash
# 构建应用
npm run build

# 启动服务器
npm start
```

### 3. 静态导出

将 Next.js 应用导出为静态 HTML：

```jsx
// next.config.js
module.exports = {
  output: 'export',
}
```

```bash
# 构建并导出
npm run build

# 静态文件将生成在 out/ 目录
```

## Next.js 13+ 的 App Router

Next.js 13 引入了新的 App Router，基于 React 服务器组件：

```
app/
├── layout.js          # 根布局
├── page.js            # 首页路由
├── about/
│   └── page.js        # /about 路由
└── blog/
    ├── page.js        # /blog 路由
    └── [slug]/
        └── page.js    # /blog/:slug 路由
```

### 服务器组件

App Router 默认使用 React 服务器组件：

```jsx
// app/page.js
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Home() {
  const data = await getData()

  return (
    <div>
      <h1>Welcome to Next.js 13</h1>
      <p>{data.message}</p>
    </div>
  )
}
```

### 布局和嵌套

创建共享布局：

```jsx
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>My Website</header>
        <main>{children}</main>
        <footer>© 2023</footer>
      </body>
    </html>
  )
}

// app/blog/layout.js
export default function BlogLayout({ children }) {
  return (
    <div>
      <nav>
        <a href="/blog/post-1">Post 1</a>
        <a href="/blog/post-2">Post 2</a>
      </nav>
      <div>{children}</div>
    </div>
  )
}
```

### 数据获取

```jsx
// app/users/page.js
async function getUsers() {
  // 默认缓存
  const res = await fetch('https://api.example.com/users')
  return res.json()
}

// 重新验证数据
async function getPostsRevalidated() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 10 } // 10 秒
  })
  return res.json()
}

// 不缓存数据
async function getCommentsUncached() {
  const res = await fetch('https://api.example.com/comments', {
    cache: 'no-store'
  })
  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 路由处理程序

定义 API 端点：

```jsx
// app/api/route.js
export async function GET() {
  return new Response(JSON.stringify({ message: 'Hello World' }), {
    headers: { 'content-type': 'application/json' },
  })
}

export async function POST(request) {
  const body = await request.json()
  return new Response(JSON.stringify({ received: body }), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  })
}
```

### 客户端组件

当需要客户端交互时：

```jsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

### 加载状态

```jsx
// app/posts/loading.js
export default function Loading() {
  return <div>Loading posts...</div>
}

// app/posts/page.js
async function getPosts() {
  await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟加载
  return [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }]
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 错误处理

```jsx
// app/dashboard/error.js
'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

// app/dashboard/page.js
async function fetchDashboardData() {
  const res = await fetch('https://api.example.com/dashboard')
  if (!res.ok) throw new Error('Failed to fetch dashboard data')
  return res.json()
}

export default async function Dashboard() {
  const data = await fetchDashboardData()

  return (
    <div>
      <h1>Dashboard</h1>
      {/* 展示数据 */}
    </div>
  )
}
```

## 最佳实践

### 1. 优化性能

- 使用适当的渲染策略（SSG > ISR > SSR > CSR）
- 实现懒加载和代码分割
- 优化图像和字体
- 使用 Next.js 内置的性能分析工具

```jsx
// 优化第三方脚本
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://analytics.example.com/script.js"
        strategy="lazyOnload"
        onLoad={() => console.log('Script loaded')}
      />
    </>
  )
}
```

### 2. SEO 优化

使用 `next/head` 或布局中的 Metadata API：

```jsx
// Pages Router
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>My Page</title>
        <meta name="description" content="Description of my page" />
      </Head>
      {/* 页面内容 */}
    </>
  )
}

// App Router
export const metadata = {
  title: 'My Page',
  description: 'Description of my page',
  openGraph: {
    title: 'My Page',
    description: 'Description for sharing',
    images: [
      {
        url: 'https://example.com/og-image.jpg',
      },
    ],
  },
}

export default function Page() {
  return <>{/* 页面内容 */}</>
}
```

### 3. 安全性

- 实现适当的 CSP (内容安全策略)
- 使用 HTTPS
- 验证 API 路由中的输入
- 防止 XSS 攻击

```jsx
// 添加安全头
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

### 4. 环境变量

使用 `.env` 文件管理环境变量：

```
# .env.local
DATABASE_URL=mysql://user:password@localhost:3306/db
NEXT_PUBLIC_API_URL=https://api.example.com
```

```jsx
// 服务器端访问
console.log(process.env.DATABASE_URL)

// 客户端访问 (仅 NEXT_PUBLIC_ 前缀)
console.log(process.env.NEXT_PUBLIC_API_URL)
```

## 常见问题及解决方案

### 1. 混合渲染策略选择

| 渲染方式 | 适用场景 |
| --- | --- |
| SSG | 博客、营销页面、文档 |
| ISR | 产品详情、内容较少变化的页面 |
| SSR | 个性化内容、实时数据、SEO 重要的动态内容 |
| CSR | 仪表板、高度交互的页面 |

### 2. 数据获取策略

```jsx
// 客户端数据获取 (SWR)
import useSWR from 'swr'

const fetcher = url => fetch(url).then(res => res.json())

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading user</div>

  return <div>Hello {data.name}!</div>
}
```

### 3. 禁用 JavaScript

Next.js 应用在未启用 JavaScript 的浏览器中可以正常工作 (通过 SSR/SSG)，除非使用客户端组件。

### 4. 大型应用结构

```
app/
├── (auth)/              # 认证相关路由分组
│   ├── login/
│   └── register/
├── (dashboard)/         # 仪表板路由分组
│   ├── layout.js        # 仪表板共享布局
│   ├── page.js          # 仪表板首页
│   └── settings/
├── api/                 # API 路由
└── page.js              # 主页
```

## Next.js 生态系统

### 1. UI 组件库

- Chakra UI
- Material UI
- Tailwind CSS
- Mantine
- NextUI

### 2. 状态管理

- Redux + Next.js
- Zustand
- Jotai
- React Query

### 3. CMS 集成

- Next.js + Contentful
- Next.js + Sanity
- Next.js + Strapi
- Next.js + WordPress

### 4. 认证解决方案

- NextAuth.js
- Auth0
- Clerk
- Supabase Auth

### 5. 数据库集成

- Next.js + Prisma
- Next.js + MongoDB
- Next.js + Supabase
- Next.js + Firebase

## 总结

Next.js 是一个强大的 React 框架，提供了丰富的功能来构建现代 Web 应用：

1. **多种渲染策略**：静态站点生成、服务器端渲染、客户端渲染
2. **简化的路由系统**：基于文件系统的路由
3. **内置优化**：图像优化、自动代码分割、字体优化
4. **API 路由**：无需单独的后端服务
5. **新的 App Router**：基于 React 服务器组件，提供更好的性能

选择 Next.js 的核心优势包括：
- 开发体验良好
- 高性能
- SEO 友好
- 可扩展性强
- 社区活跃，资源丰富

对于大多数现代 React 应用程序，特别是需要 SEO、性能优化以及服务器端功能的项目，Next.js 是一个理想的选择。