---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
layoutClass: 'm-home-layout'

hero:
  name: 'BTREE'
  tagline: 长风破浪会有时，直挂云帆济沧海。
  image:
    src: /logo.png
    alt: BTREE's blog
  actions:
    - text: 主页
      link: https://juejin.cn/user/2005936359093832
    - text: 掘金
      link: https://juejin.cn/user/2005936359093832
      theme: alt
    - text: 工具导航
      link: /nav/
      theme: alt
    - text: GitHub
      link: /test
      theme: alt
features:
  - icon: 🏗️
    title: 全站知识点
    details: 系统整理前后端开发必备知识体系<small></small><br />涵盖前端、后端、数据库、网络等核心知识点
    link: /knowledge/knowledge-nav
    linkText: 常用知识
  - icon: 🔍
    title: 源码阅读
    details: 深入剖析主流框架和库的实现原理<br />学习优秀代码的设计思想和最佳实践
    link: https://notes.fe-mm.com/analysis/utils/only-allow
    linkText: 源码阅读
  - icon: 🤖
    title: 嵌入式世界
    details: 探索嵌入式开发板和电调控制系统<br />从入门到精通STM32、Arduino、电机驱动与PID调参
    link: /embedded/
    linkText: 嵌入式专区
  - icon: ⚙️
    title: 工欲善其事，必先利其器
    details: 精选开发必备工具和实用技巧<br />提升开发效率，让工作事半功倍
    link: https://notes.fe-mm.com/efficiency/online-tools
    linkText: 工具配置专区
---

<style>
.m-home-layout .image-src:hover {
  transform: translate(-50%, -50%) rotate(666turn);
  transition: transform 59s 1s cubic-bezier(0.3, 0, 0.8, 1);
  filter: blur(5px); /* Adjust the blur radius as needed */
  background-color: rgba(255, 255, 255, 0.5); /* Optional: Add a semi-transparent background */
  backdrop-filter: blur(5px); /* Optional: Add a blur effect to the background */
}
.image-src {
  border-radius: 50%;
}

.m-home-layout .details small {
  opacity: 0.8;
}

.m-home-layout .bottom-small {
  display: block;
  margin-top: 2em;
  text-align: right;
}
</style>
