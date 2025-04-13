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
    - text: 前端导航
      link: /nav/
      theme: alt
    - text: GitHub
      link: /test
      theme: alt
features:
  - icon: 📖
    title: 前端物语
    details: 整理前端常用知识点<small>（面试八股文）</small><br />如有异议按你的理解为主，不接受反驳
    link: https://notes.fe-mm.com/fe/javascript/types
    linkText: 前端常用知识
  - icon: 📘
    title: 源码阅读
    details: 了解各种库的实现原理<br />学习其中的小技巧和冷知识
    link: https://notes.fe-mm.com/analysis/utils/only-allow
    linkText: 源码阅读
  - icon: 💡
    title: Workflow
    details: 在工作中学到的一切<small>（常用库/工具/奇淫技巧等）</small><br />配合 CV 大法来更好的摸鱼
    link: https://notes.fe-mm.com/workflow/utils/library
    linkText: 常用工具库
  - icon: 🧰
    title: 提效工具
    details: 工欲善其事，必先利其器<br />记录开发和日常使用中所用到的软件、插件、扩展等
    link: https://notes.fe-mm.com/efficiency/online-tools
---

<style>
/*爱的魔力转圈圈*/
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
