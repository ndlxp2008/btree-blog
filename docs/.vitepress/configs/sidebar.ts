import type { DefaultTheme } from 'vitepress'

import { setSidebar } from '../tool/gen_sidebar'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/knowledge/': [
    {
      text: '前端开发',
      collapsed: false,
      items: [
        {
          text: 'JavaScript 基础',
          collapsed: true,
          items: [
            { text: 'JavaScript 类型与变量', link: '/knowledge/frontend/javascript/types' },
            { text: 'JavaScript 函数与作用域', link: '/knowledge/frontend/javascript/functions' },
            { text: 'JavaScript 原型与继承', link: '/knowledge/frontend/javascript/prototype' },
            { text: 'JavaScript 异步编程', link: '/knowledge/frontend/javascript/async' },
            { text: 'ES6+ 新特性', link: '/knowledge/frontend/javascript/es6' },
            { text: 'JavaScript 对象与原型', link: '/knowledge/frontend/javascript/objects' },
          ]
        },
        {
          text: '前端框架',
          collapsed: true,
          items: [
            { text: 'React 核心概念', link: '/knowledge/frontend/framework/react-core' },
            { text: 'Vue 基础知识', link: '/knowledge/frontend/framework/vue-basics' },
            { text: 'Angular 入门指南', link: '/knowledge/frontend/framework/angular-guide' },
          ]
        },
        {
          text: '前端工程化',
          collapsed: true,
          items: [
            { text: 'Webpack 配置与优化', link: '/knowledge/frontend/engineering/webpack' },
            { text: 'Vite 使用指南', link: '/knowledge/frontend/engineering/vite' },
            { text: '前端性能优化策略', link: '/knowledge/frontend/engineering/performance' },
            { text: '前端测试方法', link: '/knowledge/frontend/engineering/testing' },
          ]
        }
      ]
    },
    {
      text: '后端开发',
      collapsed: false,
      items: [
        {
          text: 'Java 开发',
          collapsed: true,
          items: [
            { text: 'Java 基础语法', link: '/knowledge/backend/java/basics' },
            { text: 'Java 面向对象', link: '/knowledge/backend/java/oop' },
            { text: 'Java 集合框架', link: '/knowledge/backend/java/collections' },
            { text: 'Java 多线程与并发', link: '/knowledge/backend/java/concurrency' },
            { text: 'Spring 框架入门', link: '/knowledge/backend/java/spring' },
            { text: 'SpringBoot 实战', link: '/knowledge/backend/java/springboot' },
          ]
        },
        {
          text: 'Node.js 开发',
          collapsed: true,
          items: [
            { text: 'Node.js 基础', link: '/knowledge/backend/nodejs/basics' },
            { text: 'Express 框架', link: '/knowledge/backend/nodejs/express' },
            { text: 'Koa 框架', link: '/knowledge/backend/nodejs/koa' },
            { text: 'Node.js 性能调优', link: '/knowledge/backend/nodejs/performance' },
          ]
        },
        {
          text: 'Python 开发',
          collapsed: true,
          items: [
            { text: 'Python 基础语法', link: '/knowledge/backend/python/basics' },
            { text: 'Python Web 开发', link: '/knowledge/backend/python/web' },
            { text: 'Flask 框架', link: '/knowledge/backend/python/flask' },
          ]
        }
      ]
    },
    {
      text: '数据库',
      collapsed: false,
      items: [
        {
          text: '关系型数据库',
          collapsed: true,
          items: [
            { text: 'SQL 基础语法', link: '/knowledge/database/sql-basics' },
            { text: 'MySQL 深入学习', link: '/knowledge/database/mysql' },
            { text: 'PostgreSQL 指南', link: '/knowledge/database/postgresql' },
          ]
        },
        {
          text: 'NoSQL 数据库',
          collapsed: true,
          items: [
            { text: 'MongoDB 入门到精通', link: '/knowledge/database/mongodb' },
            { text: 'Redis 核心概念', link: '/knowledge/database/redis' },
            { text: 'ElasticSearch 应用', link: '/knowledge/database/elasticsearch' },
          ]
        }
      ]
    },
    {
      text: '系统架构',
      collapsed: false,
      items: [
        {
          text: '微服务',
          collapsed: true,
          items: [
            { text: '微服务架构设计', link: '/knowledge/architecture/microservice-design' },
            { text: '服务注册与发现', link: '/knowledge/architecture/service-discovery' },
            { text: 'API 网关', link: '/knowledge/architecture/api-gateway' },
            { text: '服务间通信', link: '/knowledge/architecture/service-communication' },
          ]
        },
        {
          text: '容器与云原生',
          collapsed: true,
          items: [
            // { text: 'Docker 基础', link: '/knowledge/architecture/docker' },
            { text: 'Kubernetes 入门', link: '/knowledge/architecture/kubernetes' },
            { text: 'CI/CD 流水线', link: '/knowledge/architecture/cicd' },
          ]
        }
      ]
    },
    {
      text: '计算机网络',
      collapsed: false,
      items: [
        { text: 'HTTP/HTTPS 协议', link: '/knowledge/network/http' },
        { text: 'TCP/IP 协议族', link: '/knowledge/network/tcpip' },
        { text: 'RESTful API 设计', link: '/knowledge/network/restful' },
        { text: 'WebSocket 通信', link: '/knowledge/network/websocket' },
        { text: '网络安全基础', link: '/knowledge/network/security' },
      ]
    },
    {
      text: '算法与数据结构',
      collapsed: false,
      items: [
        { text: '常见数据结构', link: '/knowledge/algorithm/data-structures' },
        { text: '排序算法', link: '/knowledge/algorithm/sorting' },
        { text: '查找算法', link: '/knowledge/algorithm/searching' },
        { text: '动态规划', link: '/knowledge/algorithm/dynamic-programming' },
        { text: '算法复杂度分析', link: '/knowledge/algorithm/complexity' },
      ]
    },
    {
      text: '设计模式',
      collapsed: false,
      items: [
        { text: '创建型模式', link: '/knowledge/design-patterns/creational' },
        { text: '结构型模式', link: '/knowledge/design-patterns/structural' },
        { text: '行为型模式', link: '/knowledge/design-patterns/behavioral' },
        { text: '设计原则', link: '/knowledge/design-patterns/principles' },
      ]
    },
    {
      text: '开发工具',
      collapsed: false,
      items: [
        { text: '版本控制系统', link: '/knowledge/tools/version-control' },
        { text: 'VS Code 高效使用', link: '/knowledge/tools/vscode' },
        { text: 'IntelliJ IDEA 技巧', link: '/knowledge/tools/intellij' },
        { text: '命令行工具', link: '/knowledge/tools/command-line' },
      ]
    }
  ]
}

export default sidebar
