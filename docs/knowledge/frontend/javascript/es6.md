# ES6 (ECMAScript 2015) 特性

## 简介

ES6，全称 ECMAScript 2015，是 JavaScript 语言的重要版本更新，引入了许多新特性和语法改进，使 JavaScript 编程更加强大和灵活。

## 主要特性

### let 和 const

`let` 和 `const` 提供了块级作用域的变量声明方式，克服了 `var` 的一些缺点。

```javascript
// let 声明的变量可以修改
let count = 1;
count = 2;

// const 声明的变量不可重新赋值
const PI = 3.14159;
// PI = 3; // 错误：常量不能重新赋值

// 块级作用域示例
{
  let blockScoped = 'only available in this block';
  var notBlockScoped = 'available outside too';
}
console.log(notBlockScoped); // 正常工作
// console.log(blockScoped); // ReferenceError
```

### 箭头函数

提供了更简洁的函数声明语法，并且不绑定自己的 `this`。

```javascript
// 传统函数
function add(a, b) {
  return a + b;
}

// 箭头函数
const addArrow = (a, b) => a + b;

// this 绑定示例
function Person() {
  this.age = 0;

  // 箭头函数不会创建自己的this
  setInterval(() => {
    this.age++; // 正确引用Person实例的this
  }, 1000);
}
```

### 模板字符串

允许嵌入表达式的字符串字面量，支持多行字符串。

```javascript
const name = 'World';
const greeting = `Hello ${name}!`;

// 多行字符串
const multiLine = `这是第一行
这是第二行
这是第三行`;
```

### 解构赋值

允许从数组或对象中提取值，赋给不同的变量。

```javascript
// 数组解构
const [a, b] = [1, 2];

// 对象解构
const person = { name: 'John', age: 30 };
const { name, age } = person;

// 函数参数解构
function printCoordinates({ x, y }) {
  console.log(`x: ${x}, y: ${y}`);
}
printCoordinates({ x: 10, y: 20 });
```

### 展开/剩余运算符

使用 `...` 语法展开数组或对象，或收集多个元素。

```javascript
// 展开运算符 (Spread)
const array1 = [1, 2, 3];
const array2 = [...array1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// 剩余参数 (Rest)
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
```

### 类语法

引入了更接近传统面向对象编程的类语法。

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    return `Hello, my name is ${this.name}`;
  }

  // 静态方法
  static create(name) {
    return new Person(name);
  }
}

// 继承
class Employee extends Person {
  constructor(name, position) {
    super(name); // 调用父类构造函数
    this.position = position;
  }

  getRole() {
    return this.position;
  }
}
```

### 模块系统

标准化的模块导入导出语法。

```javascript
// 导出 (math.js)
export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;

export default class Calculator {
  // 类实现
}

// 导入 (app.js)
import Calculator, { add, PI } from './math.js';
```

### Promise

用于处理异步操作的对象。

```javascript
function fetchData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Symbol 类型

创建唯一标识符的新原始数据类型。

```javascript
const id = Symbol('id');
const user = {
  name: 'John',
  [id]: 12345
};

// Symbol 作为属性名不会在常规迭代中出现
console.log(Object.keys(user)); // ['name']
```

### Map 和 Set 集合

新的数据结构，用于存储唯一值和键值对映射。

```javascript
// Set - 存储唯一值
const uniqueNumbers = new Set([1, 2, 3, 3, 4, 4]);
console.log([...uniqueNumbers]); // [1, 2, 3, 4]

// Map - 键值对集合
const userRoles = new Map();
userRoles.set('John', 'admin');
userRoles.set('Jane', 'editor');
```

## 兼容性与使用

现代浏览器都支持大多数 ES6 特性，对于需要支持旧浏览器的应用，可以使用 Babel 等转译工具将 ES6 代码转换为 ES5。

```bash
# 使用 Babel 安装示例
npm install @babel/core @babel/cli @babel/preset-env --save-dev
```

## 总结

ES6 为 JavaScript 带来了许多重要的语言改进，使代码更加简洁、可读且强大。熟练掌握这些特性有助于提高开发效率并编写更现代化的 JavaScript 代码。