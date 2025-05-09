# Vue 响应式系统源码分析

## 响应式系统概述

Vue 的响应式系统是其最核心的特性之一，它使得我们可以通过简单的模板语法就能将数据绑定到DOM中，并在数据变化时自动更新视图。本文将深入分析Vue的响应式系统实现原理。

## 核心源码结构

在Vue 3中，响应式系统被抽离为独立的`@vue/reactivity`包，核心API包括：

- `reactive`: 创建响应式对象
- `ref`: 创建响应式基本类型值
- `computed`: 创建计算属性
- `effect`: 副作用函数，是响应式系统的核心

## 响应式原理解析

### 1. Proxy基础

Vue 3使用ES6的Proxy对象重写了响应式系统，替代了Vue 2中基于Object.defineProperty的实现：

```js
// Vue 3中创建响应式对象的核心实现
function reactive(target) {
  // 创建一个代理对象
  return new Proxy(target, {
    // 获取属性时触发
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      // 依赖收集：记录谁在使用这个属性
      track(target, key)
      return res
    },
    // 设置属性时触发
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      // 只有当值真正变化时才触发更新
      if (hasChanged(value, oldValue)) {
        // 触发更新：通知所有依赖这个属性的地方进行更新
        trigger(target, key)
      }
      return result
    }
  })
}
```

### 2. 依赖收集与触发

响应式系统的核心是"依赖收集"和"派发更新"：

```js
// 当前正在执行的effect
let activeEffect = null
// 存储依赖关系的WeakMap
const targetMap = new WeakMap()

// 依赖收集
function track(target, key) {
  if (!activeEffect) return
  
  // 获取当前对象的依赖Map
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  
  // 获取当前属性的依赖Set
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  
  // 将当前activeEffect添加到依赖集合中
  dep.add(activeEffect)
}

// 触发更新
function trigger(target, key) {
  // 获取对象的依赖Map
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  
  // 获取属性的依赖Set
  const dep = depsMap.get(key)
  if (dep) {
    // 执行所有依赖函数
    dep.forEach(effect => effect())
  }
}
```

### 3. effect实现

```js
function effect(fn) {
  // 创建effect函数
  const effectFn = () => {
    try {
      activeEffect = effectFn
      // 执行原始函数，会触发getter，从而收集依赖
      return fn()
    } finally {
      activeEffect = null
    }
  }
  
  // 立即执行一次
  effectFn()
  
  return effectFn
}
```

## ref的实现原理

对于基础类型值，Vue提供了`ref`API：

```js
function ref(value) {
  // 创建包装对象
  const refObject = {
    get value() {
      // 依赖收集
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      if (hasChanged(newValue, value)) {
        value = newValue
        // 触发更新
        trigger(refObject, 'value')
      }
    }
  }
  
  return refObject
}
```

## computed的实现原理

计算属性是预设了getter的特殊effect：

```js
function computed(getter) {
  // 缓存值
  let value
  // 脏标记，表示是否需要重新计算
  let dirty = true
  
  // 创建effect
  const runner = effect(getter, {
    lazy: true,
    // 当依赖变化时，不立即执行计算，而是将dirty设为true
    scheduler: () => {
      if (!dirty) {
        dirty = true
        // 通知计算属性的订阅者更新
        trigger(computedRef, 'value')
      }
    }
  })
  
  const computedRef = {
    get value() {
      // 如果脏了就重新计算
      if (dirty) {
        value = runner()
        dirty = false
      }
      // 收集对计算属性结果的依赖
      track(computedRef, 'value')
      return value
    }
  }
  
  return computedRef
}
```

## 总结

Vue的响应式系统通过精心设计的依赖追踪机制，实现了数据变更到视图更新的自动化。理解这一机制对深入掌握Vue框架至关重要。

主要流程:
1. 通过Proxy/Object.defineProperty劫持数据的访问和修改
2. 组件渲染时，触发数据getter收集依赖
3. 数据变更时，触发setter通知所有依赖执行更新

Vue 3相比Vue 2的响应式系统优势:
- 通过Proxy可以监听对象的新增属性和删除属性
- 可以监听数组索引和length的变化
- 内存占用更少，性能更强
- 支持更多的响应式数据类型和集合类型
