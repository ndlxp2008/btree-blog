# JavaScript 类型与变量

JavaScript 是一种弱类型的动态语言，理解其类型系统对于编写高质量的JavaScript代码至关重要。

## 基本数据类型

JavaScript中有七种基本数据类型：

1. **Number**：表示数字，包括整数和浮点数
2. **String**：表示文本数据
3. **Boolean**：表示逻辑值，`true`或`false`
4. **Undefined**：表示变量未赋值
5. **Null**：表示空值或不存在的对象
6. **Symbol**：ES6新增类型，表示唯一的标识符
7. **BigInt**：ES2020新增类型，表示任意精度的整数

### Number 类型

```javascript
// 整数
let intNum = 55;

// 浮点数
let floatNum = 55.5;

// 科学计数法
let exponentNum = 5.5e5; // 550000

// 特殊值
console.log(Number.MAX_VALUE); // 最大值
console.log(Number.MIN_VALUE); // 最小值
console.log(Number.NaN);       // 非数值
console.log(Number.POSITIVE_INFINITY); // 正无穷
console.log(Number.NEGATIVE_INFINITY); // 负无穷
```

### String 类型

```javascript
// 单引号
let singleQuote = 'Hello';

// 双引号
let doubleQuote = "World";

// 模板字符串（ES6）
let name = "JavaScript";
let template = `Hello, ${name}!`; // "Hello, JavaScript!"

// 字符串属性和方法
console.log(singleQuote.length); // 5
console.log(singleQuote.charAt(1)); // "e"
console.log(singleQuote.concat(" ", doubleQuote)); // "Hello World"
console.log(singleQuote.slice(1, 3)); // "el"
```

### Boolean 类型

```javascript
let isTrue = true;
let isFalse = false;

// 转换为布尔值
console.log(Boolean("")); // false
console.log(Boolean(0));  // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false

console.log(Boolean("Hello")); // true
console.log(Boolean(42));     // true
console.log(Boolean({}));     // true
console.log(Boolean([]));     // true
```

### Undefined 和 Null

```javascript
// undefined - 变量声明但未赋值
let undefinedVar;
console.log(undefinedVar); // undefined

// null - 空对象指针
let nullVar = null;
console.log(nullVar); // null

// 相等性比较
console.log(undefined == null);  // true
console.log(undefined === null); // false
```

### Symbol 类型

```javascript
// 创建唯一标识符
const sym1 = Symbol();
const sym2 = Symbol('description');

// Symbols 总是唯一的
console.log(Symbol('foo') === Symbol('foo')); // false

// 用作对象属性键
const obj = {};
obj[sym1] = 'Symbol value';
```

### BigInt 类型

```javascript
// 创建BigInt
const bigInt = 1234567890123456789012345678901234567890n;
const anotherBigInt = BigInt("9007199254740991");

// 操作
console.log(bigInt + 1n); // 1234567890123456789012345678901234567891n
```

## 引用数据类型

JavaScript中主要有三种引用类型：

1. **Object**：对象，JavaScript中所有非原始类型都是对象
2. **Array**：数组，有序列表
3. **Function**：函数，可执行代码块

### Object 类型

```javascript
// 对象字面量
const person = {
  name: "John",
  age: 30,
  sayHello: function() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

// 访问属性
console.log(person.name); // "John"
console.log(person["age"]); // 30

// 修改属性
person.age = 31;

// 添加属性
person.job = "Developer";

// 调用方法
person.sayHello(); // "Hello, my name is John"
```

### Array 类型

```javascript
// 数组字面量
const colors = ["red", "green", "blue"];

// 访问元素
console.log(colors[0]); // "red"

// 修改元素
colors[1] = "yellow";

// 数组长度
console.log(colors.length); // 3

// 数组方法
colors.push("purple"); // 添加到末尾
const firstColor = colors.shift(); // 移除首个元素并返回
const newArray = colors.map(color => color.toUpperCase()); // 映射为新数组
```

### Function 类型

```javascript
// 函数声明
function greet(name) {
  return `Hello, ${name}!`;
}

// 函数表达式
const sayGoodbye = function(name) {
  return `Goodbye, ${name}!`;
};

// 箭头函数 (ES6)
const multiply = (a, b) => a * b;

// 调用函数
console.log(greet("Alice")); // "Hello, Alice!"
console.log(multiply(5, 3)); // 15
```

## 变量声明

JavaScript 提供三种声明变量的方式：

### var

```javascript
// 函数作用域
var x = 10;

if (true) {
  var x = 20; // 同一个变量
}

console.log(x); // 20

// 变量提升
console.log(y); // undefined
var y = 30;
```

### let (ES6)

```javascript
// 块级作用域
let a = 10;

if (true) {
  let a = 20; // 不同的变量
}

console.log(a); // 10

// 暂时性死区
// console.log(b); // ReferenceError
let b = 30;
```

### const (ES6)

```javascript
// 常量，不能重新赋值
const PI = 3.14159;
// PI = 3; // TypeError

// 但对象和数组的内容可以修改
const user = { name: "John" };
user.name = "Jane"; // 允许

const numbers = [1, 2, 3];
numbers.push(4); // 允许
// numbers = []; // 不允许
```

## 类型转换

JavaScript 会在需要时自动进行类型转换，也可以手动转换。

### 隐式转换

```javascript
console.log("5" + 5); // "55" (字符串连接)
console.log("5" - 5); // 0 (数字减法)
console.log(5 + true); // 6 (true 转换为 1)
console.log(5 * "2"); // 10 (字符串转换为数字)
```

### 显式转换

```javascript
// 转换为数字
console.log(Number("42")); // 42
console.log(parseInt("42.5")); // 42
console.log(parseFloat("42.5")); // 42.5

// 转换为字符串
console.log(String(42)); // "42"
console.log((42).toString()); // "42"

// 转换为布尔值
console.log(Boolean(42)); // true
```

## 类型检查

```javascript
// typeof 操作符
console.log(typeof 42); // "number"
console.log(typeof "hello"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object" (这是JS的一个历史遗留bug)
console.log(typeof {}); // "object"
console.log(typeof []); // "object"
console.log(typeof function() {}); // "function"

// instanceof 操作符
console.log([] instanceof Array); // true
console.log(({}) instanceof Object); // true
```

## 总结

- JavaScript 有 7 种基本数据类型和 3 种主要的引用类型
- `var`、`let` 和 `const` 用于声明变量，具有不同的作用域规则
- 了解类型转换和类型检查对编写健壮的JavaScript代码非常重要