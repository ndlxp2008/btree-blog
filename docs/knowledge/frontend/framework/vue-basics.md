# Vue 基础知识

Vue.js 是一个用于构建用户界面的渐进式JavaScript框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。本文档介绍Vue的基本概念和使用方法。

## 目录

- [Vue 简介](#vue-简介)
- [安装与配置](#安装与配置)
- [Vue 实例](#vue-实例)
- [模板语法](#模板语法)
- [计算属性与侦听器](#计算属性与侦听器)
- [Class与Style绑定](#class与style绑定)
- [条件渲染](#条件渲染)
- [列表渲染](#列表渲染)
- [事件处理](#事件处理)
- [表单输入绑定](#表单输入绑定)
- [组件基础](#组件基础)
- [组件通信](#组件通信)
- [生命周期](#生命周期)
- [进阶话题](#进阶话题)

## Vue 简介

### 什么是Vue？

Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，易于上手，并且与其它库或已有项目整合。

### Vue的特点

- **渐进式框架**：可以逐步集成Vue的功能，从核心功能到全家桶
- **响应式数据绑定**：数据与DOM保持同步
- **组件化开发**：可复用、可组合、可扩展
- **虚拟DOM**：提高性能和渲染效率
- **生态系统完整**：包括路由、状态管理、构建工具等

### 与其他框架的比较

- **Vue vs React**：Vue 提供更多内置功能，学习曲线更平缓；React 更灵活，但需要更多第三方库支持
- **Vue vs Angular**：Vue 更轻量，更易于集成；Angular 是完整框架，更适合大型应用

## 安装与配置

### 直接引入

最简单的方式是直接在HTML中通过CDN引入Vue：

```html
<!-- 开发环境版本，包含有帮助的命令行警告 -->
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

<!-- 生产环境版本，优化了尺寸和速度 -->
<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
```

### 使用npm安装

对于大型应用，推荐使用npm安装Vue：

```bash
npm install vue
```

### 使用Vue CLI

Vue CLI是官方提供的项目脚手架工具：

```bash
npm install -g @vue/cli
vue create my-project
```

## Vue 实例

### 创建Vue实例

每个Vue应用都是通过`Vue`函数创建一个新的Vue实例开始的：

```javascript
const vm = new Vue({
  // 选项
})
```

### 数据与方法

当一个Vue实例被创建时，它将`data`对象中的所有属性加入到Vue的**响应式系统**中：

```javascript
const vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  methods: {
    reverseMessage: function() {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```

### Vue实例生命周期

Vue实例从创建到销毁的过程中会经历一系列的事件，称为生命周期钩子：

```javascript
new Vue({
  data: {
    message: 'Hello'
  },
  created: function() {
    // `this` 指向vm实例
    console.log('message is: ' + this.message)
  }
})
```

## 模板语法

Vue.js使用基于HTML的模板语法，允许开发者声明式地将DOM绑定到Vue实例的数据。

### 插值

最基本的数据绑定形式是文本插值，使用"Mustache"语法（双大括号）：

```html
<span>Message: {{ message }}</span>
```

### 指令

指令是带有`v-`前缀的特殊属性，它们对应的值是JavaScript表达式：

```html
<p v-if="seen">现在你看到我了</p>
```

常用指令：
- `v-bind`：动态绑定属性
- `v-on`：绑定事件监听器
- `v-if`/`v-else`/`v-else-if`：条件渲染
- `v-for`：列表渲染
- `v-model`：表单输入绑定

### 缩写

Vue为最常用的两个指令提供了特殊的缩写：

- `v-bind:href` 可以缩写为 `:href`
- `v-on:click` 可以缩写为 `@click`

## 计算属性与侦听器

### 计算属性

对于复杂逻辑，应该使用计算属性而不是在模板中使用表达式：

```javascript
var vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function() {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})
```

### 侦听器

Vue提供了一种更通用的方式来观察和响应Vue实例上的数据变动：侦听器。

```javascript
var vm = new Vue({
  el: '#app',
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // 当question变化时，这个函数就会运行
    question: function(newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  }
})
```

## Class与Style绑定

### 绑定HTML Class

可以通过对象语法动态切换class：

```html
<div v-bind:class="{ active: isActive }"></div>
```

也可以使用数组语法：

```html
<div v-bind:class="[activeClass, errorClass]"></div>
```

### 绑定内联样式

对象语法：

```html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

数组语法：

```html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

## 条件渲染

### v-if

`v-if`指令用于条件性地渲染一块内容：

```html
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

### v-show

另一个用于根据条件展示元素的选项是 `v-show` 指令：

```html
<h1 v-show="ok">Hello!</h1>
```

`v-if` 和 `v-show` 的区别：
- `v-if` 是"真正"的条件渲染，它会确保在切换过程中，事件监听器和子组件适当地被销毁和重建
- `v-show` 只是简单地切换元素的CSS属性 `display`

## 列表渲染

### v-for

我们可以用 `v-for` 指令基于一个数组来渲染一个列表：

```html
<ul id="example-1">
  <li v-for="item in items" :key="item.id">
    {{ item.message }}
  </li>
</ul>
```

```javascript
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { id: 1, message: 'Foo' },
      { id: 2, message: 'Bar' }
    ]
  }
})
```

### 数组更新检测

Vue能够检测到以下数组变动方法：
- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

但Vue不能检测到以下变动：
- 利用索引直接设置一个项：`vm.items[index] = newValue`
- 修改数组的长度：`vm.items.length = newLength`

## 事件处理

### 监听事件

可以用 `v-on` 指令监听DOM事件，并在触发时运行一些JavaScript代码：

```html
<div id="example-1">
  <button v-on:click="counter += 1">Add 1</button>
  <p>The button above has been clicked {{ counter }} times.</p>
</div>
```

### 事件修饰符

Vue为 `v-on` 提供了事件修饰符，如：
- `.stop`：阻止事件继续传播
- `.prevent`：阻止默认事件
- `.capture`：使用事件捕获模式
- `.self`：只当事件是从元素本身触发时才触发处理函数
- `.once`：事件只触发一次

```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>
```

## 表单输入绑定

### 基础用法

你可以用 `v-model` 指令在表单控件元素上创建双向数据绑定：

```html
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```

### 表单控件类型

`v-model` 支持各种表单控件：
- 文本框
- 多行文本
- 复选框
- 单选按钮
- 选择框

### 修饰符

`v-model` 有三个修饰符：
- `.lazy`：在"change"事件之后而不是"input"事件之后更新
- `.number`：自动将用户的输入值转为数值类型
- `.trim`：自动过滤用户输入的首尾空白字符

## 组件基础

### 基本示例

这里有一个Vue组件的示例：

```javascript
// 定义一个名为 button-counter 的新组件
Vue.component('button-counter', {
  data: function() {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```

### 组件复用

组件是可复用的Vue实例，所以它们可以接收与new Vue相同的选项，例如data、computed、watch、methods 以及生命周期钩子等。但组件的data必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝。

### 通过Prop向子组件传递数据

Prop是你可以在组件上注册的一些自定义attribute。当一个值传递给一个prop attribute时，它就变成了那个组件实例的一个属性。

```javascript
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
```

```html
<blog-post title="My journey with Vue"></blog-post>
```

## 组件通信

### 父子组件通信

父组件通过props向下传递数据给子组件，子组件通过事件向上传递数据给父组件：

```javascript
// 子组件
Vue.component('child', {
  props: ['message'],
  template: `<div>
    <p>{{ message }}</p>
    <button @click="$emit('update', 'New message')">Update</button>
  </div>`
})

// 父组件
new Vue({
  el: '#app',
  data: {
    parentMsg: 'Message from parent'
  },
  methods: {
    updateMessage(newMessage) {
      this.parentMsg = newMessage
    }
  },
  template: `<div>
    <child :message="parentMsg" @update="updateMessage"></child>
  </div>`
})
```

### 非父子组件通信

对于非父子组件间的通信，可以使用一个空的Vue实例作为中央事件总线：

```javascript
const eventBus = new Vue()

// 组件A
eventBus.$emit('update', { data: 'Some data' })

// 组件B
eventBus.$on('update', data => {
  console.log(data)
})
```

## 生命周期

Vue实例有一个完整的生命周期，从创建、挂载、更新到销毁，各个阶段都有对应的生命周期钩子：

- `beforeCreate`：实例初始化之后，数据观测和事件配置之前
- `created`：实例创建完成，数据观测、属性和方法的运算完成
- `beforeMount`：挂载开始之前被调用
- `mounted`：实例被挂载到DOM后调用
- `beforeUpdate`：数据更新时调用，发生在虚拟DOM重新渲染之前
- `updated`：数据更改导致的虚拟DOM重新渲染后调用
- `beforeDestroy`：实例销毁之前调用
- `destroyed`：实例销毁后调用

## 进阶话题

### Vue Router

Vue Router是Vue.js官方的路由管理器，它与Vue.js深度集成，让构建单页面应用变得易如反掌。

### Vuex

Vuex是一个专为Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

### Vue CLI

Vue CLI是一个基于webpack的项目脚手架，提供了零配置原型开发，也可以通过插件系统进行深度定制。

### Vue 3.0新特性

Vue 3.0带来了许多重大变化和改进：
- Composition API：一种全新的逻辑复用和代码组织方式
- 更好的TypeScript支持
- 虚拟DOM重写，性能显著提升
- Fragment、Teleport、Suspense等新组件

## 总结

Vue.js以其简单易学、灵活强大的特性，成为前端开发中非常受欢迎的框架。它可以被逐步集成到你的项目中，不强制要求一开始就采用完整的Vue生态系统。通过本文档的学习，你应该已经掌握了Vue的基础知识，可以开始构建自己的Vue应用了。

要深入学习Vue，建议查阅[Vue官方文档](https://cn.vuejs.org/)，并通过实际项目实践来巩固所学知识。