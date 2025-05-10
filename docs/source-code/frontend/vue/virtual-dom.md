# Vue 虚拟DOM实现源码分析

## 虚拟DOM概述

虚拟DOM（Virtual DOM）是Vue框架中的核心技术之一，它是一种用JavaScript对象描述真实DOM的轻量级抽象。Vue通过虚拟DOM实现了高效的DOM更新策略，大大提升了应用性能。

## 核心数据结构

在Vue中，虚拟DOM节点通常被称为VNode（Virtual Node），其基本结构如下：

```js
// VNode的基本结构
const vnode = {
  type: 'div',           // 标签类型或组件
  props: {               // 属性、事件等
    id: 'app',
    onClick: () => {}
  },
  children: [            // 子节点
    { type: 'span', props: null, children: 'Hello World' }
  ]
}
```

## Vue 3中的虚拟DOM实现

### 1. 创建VNode

在Vue 3中，创建VNode的核心函数是`h`（hyperscript）函数：

```js
// h函数的简化实现
function h(type, props, children) {
  return {
    __v_isVNode: true,
    type,
    props,
    key: props && props.key,
    children,
    shapeFlag: getShapeFlag(type, children),
    el: null  // 对应的真实DOM元素，初始为null
  }
}

// 确定VNode的类型标志
function getShapeFlag(type, children) {
  let shapeFlag = 0
  
  // 根据type确定是元素还是组件
  if (typeof type === 'string') {
    shapeFlag |= ShapeFlags.ELEMENT
  } else if (isObject(type)) {
    shapeFlag |= ShapeFlags.COMPONENT
  }
  
  // 根据children确定子节点类型
  if (isArray(children)) {
    shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  } else if (isString(children) || isNumber(children)) {
    shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }
  
  return shapeFlag
}
```

### 2. 渲染VNode到真实DOM

Vue 3使用`render`函数将虚拟DOM渲染到真实DOM中：

```js
// 渲染函数简化实现
function render(vnode, container) {
  // 如果vnode为null，表示卸载操作
  if (vnode === null) {
    if (container._vnode) {
      unmount(container._vnode)
    }
  } else {
    // 更新或挂载操作
    patch(container._vnode || null, vnode, container)
  }
  
  // 保存当前vnode用于下次比较
  container._vnode = vnode
}

// patch函数处理不同类型节点的更新
function patch(n1, n2, container, anchor) {
  // n1是旧节点，n2是新节点
  if (n1 === n2) return
  
  // 如果节点类型不同，直接卸载旧节点
  if (n1 && n1.type !== n2.type) {
    unmount(n1)
    n1 = null
  }
  
  const { type, shapeFlag } = n2
  
  // 根据节点类型分发到不同的处理函数
  if (typeof type === 'string') {
    // 处理普通HTML元素
    processElement(n1, n2, container, anchor)
  } else if (isObject(type)) {
    // 处理组件
    processComponent(n1, n2, container, anchor)
  } else if (typeof type === 'symbol' && type === Fragment) {
    // 处理Fragment
    processFragment(n1, n2, container, anchor)
  } else if (type === Text) {
    // 处理文本节点
    processText(n1, n2, container, anchor)
  }
}
```

### 3. Diff算法实现

最核心的部分是处理元素更新时的Diff算法，这是虚拟DOM性能优化的关键：

```js
// 处理元素更新的核心函数
function patchElement(n1, n2, container) {
  // 复用DOM元素
  const el = (n2.el = n1.el)
  
  // 更新属性
  const oldProps = n1.props || {}
  const newProps = n2.props || {}
  patchProps(el, oldProps, newProps)
  
  // 更新子节点
  patchChildren(n1, n2, el)
}

// 更新子节点的函数
function patchChildren(n1, n2, container) {
  const c1 = n1.children
  const c2 = n2.children
  const prevShapeFlag = n1.shapeFlag
  const shapeFlag = n2.shapeFlag
  
  // 新子节点是文本
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // 旧子节点是数组，需要先移除
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      unmountChildren(c1)
    }
    // 设置新文本
    if (c1 !== c2) {
      container.textContent = c2
    }
  } 
  // 新子节点是数组
  else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 旧子节点也是数组，需要Diff
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 核心Diff算法
      patchKeyedChildren(c1, c2, container)
    } 
    // 旧子节点是文本，清空后挂载新子节点
    else {
      container.textContent = ''
      mountChildren(c2, container)
    }
  } 
  // 新子节点为空
  else {
    // 旧子节点是数组，卸载
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      unmountChildren(c1)
    } 
    // 旧子节点是文本，清空
    else if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      container.textContent = ''
    }
  }
}
```

### 4. 快速Diff算法

Vue 3采用了一种改进的Diff算法，提高了对比效率：

```js
function patchKeyedChildren(c1, c2, container) {
  let i = 0
  const l2 = c2.length
  let e1 = c1.length - 1  // 旧子节点尾部索引
  let e2 = l2 - 1         // 新子节点尾部索引
  
  // 1. 从头部开始比较
  while (i <= e1 && i <= e2) {
    const n1 = c1[i]
    const n2 = c2[i]
    if (isSameVNodeType(n1, n2)) {
      // 递归patch
      patch(n1, n2, container)
    } else {
      break
    }
    i++
  }
  
  // 2. 从尾部开始比较
  while (i <= e1 && i <= e2) {
    const n1 = c1[e1]
    const n2 = c2[e2]
    if (isSameVNodeType(n1, n2)) {
      patch(n1, n2, container)
    } else {
      break
    }
    e1--
    e2--
  }
  
  // 3. 处理新增和删除的节点
  if (i > e1) {
    // 说明有新节点需要挂载
    if (i <= e2) {
      const nextPos = e2 + 1
      const anchor = nextPos < l2 ? c2[nextPos].el : null
      while (i <= e2) {
        patch(null, c2[i], container, anchor)
        i++
      }
    }
  } else if (i > e2) {
    // 说明有旧节点需要卸载
    while (i <= e1) {
      unmount(c1[i])
      i++
    }
  } else {
    // 4. 处理中间部分乱序的节点
    const s1 = i  // 旧子节点起始索引
    const s2 = i  // 新子节点起始索引
    
    // 4.1 创建新节点的key到索引的映射
    const keyToNewIndexMap = new Map()
    for (let i = s2; i <= e2; i++) {
      const nextChild = c2[i]
      if (nextChild.key != null) {
        keyToNewIndexMap.set(nextChild.key, i)
      }
    }
    
    // 4.2 循环遍历旧节点，尝试patch或删除
    let j
    let patched = 0
    const toBePatched = e2 - s2 + 1
    let moved = false
    let maxNewIndexSoFar = 0
    
    // 初始化source数组，存储新节点在旧节点中的位置索引
    const newIndexToOldIndexMap = new Array(toBePatched)
    for (let i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
    
    for (let i = s1; i <= e1; i++) {
      const prevChild = c1[i]
      
      if (patched >= toBePatched) {
        // 如果已经处理的节点数量超过需要处理的，说明剩下的是需要被删除的
        unmount(prevChild)
        continue
      }
      
      // 查找当前旧节点在新子节点数组中的位置
      let newIndex
      if (prevChild.key != null) {
        newIndex = keyToNewIndexMap.get(prevChild.key)
      } else {
        // 如果没有key，遍历查找相同类型的节点
        for (j = s2; j <= e2; j++) {
          if (newIndexToOldIndexMap[j - s2] === 0 &&
              isSameVNodeType(prevChild, c2[j])) {
            newIndex = j
            break
          }
        }
      }
      
      // 如果找不到对应的新节点，则删除
      if (newIndex === undefined) {
        unmount(prevChild)
      } else {
        // 记录新节点在旧节点中的位置
        newIndexToOldIndexMap[newIndex - s2] = i + 1
        
        // 判断节点是否移动
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex
        } else {
          moved = true
        }
        
        // 递归处理子节点
        patch(prevChild, c2[newIndex], container)
        patched++
      }
    }
    
    // 4.3 移动和挂载节点
    if (moved) {
      // 计算最长递增子序列
      const seq = getSequence(newIndexToOldIndexMap)
      
      j = seq.length - 1
      for (let i = toBePatched - 1; i >= 0; i--) {
        const newIndex = i + s2
        const nextChild = c2[newIndex]
        const anchor = newIndex + 1 < l2 ? c2[newIndex + 1].el : null
        
        // 新节点，需要挂载
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor)
        } 
        // 移动节点
        else if (moved) {
          if (j < 0 || i !== seq[j]) {
            move(nextChild, container, anchor)
          } else {
            j--
          }
        }
      }
    }
  }
}
```

## 虚拟DOM的优势

1. **提高性能**：最小化DOM操作，减少浏览器重排重绘。
2. **跨平台能力**：通过替换渲染器，可以支持不同的平台（如原生移动、桌面等）。
3. **易于测试**：可以在非浏览器环境中运行测试。
4. **声明式编程**：使开发者专注于描述UI状态而非DOM操作过程。

## Vue 2与Vue 3虚拟DOM的区别

### Vue 2中的虚拟DOM

```js
// Vue 2的VNode结构
{
  tag: 'div',
  data: {
    attrs: { id: 'app' },
    on: { click: handler }
  },
  children: [/* 子节点 */]
}
```

### Vue 3的改进

1. **更扁平的数据结构**：将props直接放在VNode的顶层。
2. **新增了Fragment和Teleport等特殊节点**。
3. **静态提升**：静态节点只需创建一次，大幅提升性能。
4. **基于PatchFlag的动态节点追踪**：精确跟踪动态节点。
5. **基于类型的节点提示**：通过shapeFlag快速判断节点类型。

## 总结

Vue的虚拟DOM实现是一个精妙的工程，通过高效的Diff算法和节点复用策略，在保持框架易用性的同时提供了出色的性能。Vue 3在此基础上进行了多项优化，使得虚拟DOM的性能得到进一步提升。

理解虚拟DOM的工作原理，对深入掌握Vue框架以及现代前端开发至关重要。
