# JavaScript 函数与作用域

JavaScript中的函数是一等公民，它们可以像其他任何数据类型一样被传递和使用。本文档介绍JavaScript函数的基本概念、声明方式、作用域规则以及闭包等高级特性。

## 1. 函数基础

### 1.1 函数声明

在JavaScript中，有多种方式可以定义函数：

#### 函数声明

```javascript
function sayHello(name) {
  return `Hello, ${name}!`;
}
```

函数声明会被提升(hoisted)，这意味着你可以在声明前调用函数。

#### 函数表达式

```javascript
const sayHello = function(name) {
  return `Hello, ${name}!`;
};
```

函数表达式不会被提升，必须在定义后才能调用。

#### 箭头函数 (ES6)

```javascript
const sayHello = (name) => {
  return `Hello, ${name}!`;
};

// 如果只有一个表达式，可以简写为
const sayHello = name => `Hello, ${name}!`;
```

箭头函数有更简洁的语法，并且不绑定自己的`this`值。

### 1.2 函数参数

#### 默认参数 (ES6)

```javascript
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

greet(); // "Hello, Guest!"
greet("John"); // "Hello, John!"
```

#### 剩余参数 (ES6)

```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3, 4); // 10
```

#### 参数解构 (ES6)

```javascript
function displayPerson({name, age, job = "Unknown"}) {
  console.log(`${name} is ${age} years old and works as ${job}`);
}

displayPerson({name: "Alice", age: 30, job: "Developer"});
// "Alice is 30 years old and works as Developer"
```

### 1.3 立即调用函数表达式 (IIFE)

立即调用函数表达式是在定义后立即执行的函数。

```javascript
(function() {
  console.log("This function runs immediately!");
})();

// 带参数的IIFE
(function(message) {
  console.log(message);
})("Hello, IIFE!");
```

IIFE通常用于创建私有作用域，避免变量污染全局命名空间。

## 2. 作用域

作用域决定了变量和函数的可访问性。JavaScript中有几种不同类型的作用域：

### 2.1 全局作用域

在任何函数外部声明的变量属于全局作用域，可以在代码的任何地方访问。

```javascript
var globalVar = "I am global";

function test() {
  console.log(globalVar); // 可以访问全局变量
}
```

### 2.2 函数作用域

在函数内部声明的变量只能在该函数内部访问。

```javascript
function test() {
  var localVar = "I am local";
  console.log(localVar); // 可以访问
}

test();
// console.log(localVar); // 错误：localVar is not defined
```

### 2.3 块级作用域 (ES6)

使用`let`和`const`声明的变量具有块级作用域，只能在声明它们的块内部访问。

```javascript
if (true) {
  let blockVar = "I am block-scoped";
  const anotherBlockVar = "I am also block-scoped";
  console.log(blockVar); // 可以访问
}

// console.log(blockVar); // 错误：blockVar is not defined
```

### 2.4 词法作用域

JavaScript使用词法作用域(也称为静态作用域)，这意味着函数的作用域在函数定义时确定，而不是在函数调用时确定。

```javascript
const x = 10;

function outer() {
  const x = 20;

  function inner() {
    // inner函数可以访问自己的作用域、outer函数的作用域和全局作用域
    console.log(x); // 20，而不是10
  }

  inner();
}

outer();
```

## 3. 闭包

闭包是指函数能够记住并访问其词法作用域，即使当该函数在其作用域外执行时也是如此。

### 3.1 闭包的基本概念

```javascript
function createCounter() {
  let count = 0;

  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

在这个例子中，返回的函数形成了一个闭包，它"记住"了`count`变量，即使`createCounter`函数已经执行完毕。

### 3.2 闭包的实际应用

#### 数据封装

```javascript
function createPerson(name) {
  // 私有变量
  let age = 0;

  return {
    getName: function() {
      return name;
    },
    getAge: function() {
      return age;
    },
    setAge: function(newAge) {
      if (newAge > 0) {
        age = newAge;
      }
    }
  };
}

const person = createPerson("John");
console.log(person.getName()); // "John"
person.setAge(30);
console.log(person.getAge()); // 30
```

#### 函数柯里化

```javascript
function multiply(a) {
  return function(b) {
    return a * b;
  };
}

const double = multiply(2);
console.log(double(5)); // 10
```

#### 事件处理和回调

```javascript
function setupButton(buttonId, message) {
  document.getElementById(buttonId).addEventListener('click', function() {
    alert(message); // 闭包记住了message变量
  });
}

setupButton('btn1', 'Hello, Button 1!');
setupButton('btn2', 'Hello, Button 2!');
```

## 4. `this` 关键字

`this`关键字在JavaScript中表示函数的执行上下文，其值取决于函数被调用的方式。

### 4.1 全局上下文

在全局上下文中，`this`指向全局对象（在浏览器中为`window`，在Node.js中为`global`）。

```javascript
console.log(this === window); // 在浏览器中为true
```

### 4.2 函数上下文

在普通函数调用中，`this`指向全局对象（非严格模式）或`undefined`（严格模式）。

```javascript
function checkThis() {
  console.log(this);
}

checkThis(); // window或global（非严格模式）
```

### 4.3 方法上下文

当函数作为对象的方法调用时，`this`指向该对象。

```javascript
const obj = {
  name: "Object",
  sayName: function() {
    console.log(this.name);
  }
};

obj.sayName(); // "Object"
```

### 4.4 构造函数上下文

当函数用作构造函数（使用`new`关键字）时，`this`指向新创建的实例。

```javascript
function Person(name) {
  this.name = name;
}

const john = new Person("John");
console.log(john.name); // "John"
```

### 4.5 显式绑定

使用`call`、`apply`或`bind`方法可以显式地设置函数调用时`this`的值。

```javascript
function greet() {
  console.log(`Hello, ${this.name}!`);
}

const person = { name: "Alice" };

// 使用call
greet.call(person); // "Hello, Alice!"

// 使用apply
greet.apply(person); // "Hello, Alice!"

// 使用bind创建新函数
const boundGreet = greet.bind(person);
boundGreet(); // "Hello, Alice!"
```

### 4.6 箭头函数中的`this`

箭头函数不绑定自己的`this`值，而是继承自外围作用域的`this`值。

```javascript
const obj = {
  name: "Object",
  // 传统函数
  regularFunction: function() {
    console.log(this.name); // "Object"

    // 内部普通函数
    function innerRegular() {
      console.log(this.name); // undefined（因为this指向全局对象）
    }

    // 内部箭头函数
    const innerArrow = () => {
      console.log(this.name); // "Object"（继承自regularFunction的this）
    }

    innerRegular();
    innerArrow();
  }
};

obj.regularFunction();
```

## 5. 函数高级特性

### 5.1 函数组合

函数组合是函数式编程的一个重要概念，它允许你将多个函数组合成一个函数。

```javascript
const compose = (f, g) => x => f(g(x));

const addOne = x => x + 1;
const double = x => x * 2;

const addOneThenDouble = compose(double, addOne);

console.log(addOneThenDouble(3)); // (3 + 1) * 2 = 8
```

### 5.2 高阶函数

高阶函数是接受一个或多个函数作为参数和/或返回一个函数的函数。

```javascript
// 接受函数作为参数
function doTwice(fn, value) {
  return fn(fn(value));
}

// 返回函数的函数
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
console.log(double(5)); // 10
console.log(doTwice(double, 3)); // double(double(3)) = double(6) = 12
```

### 5.3 递归

递归是一种函数调用自身的技术。

```javascript
function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 5 * 4 * 3 * 2 * 1 = 120
```

### 5.4 记忆化

记忆化是一种优化技术，它通过缓存函数调用的结果来避免重复计算。

```javascript
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

const memoizedFactorial = memoize(function(n) {
  if (n <= 1) return 1;
  return n * this(n - 1);
});

console.log(memoizedFactorial(5)); // 计算并缓存
console.log(memoizedFactorial(5)); // 从缓存返回
```

## 6. 最佳实践

### 6.1 函数设计原则

- **单一职责**: 每个函数应该只做一件事，并且做好
- **纯函数**: 尽可能使用纯函数（没有副作用，相同输入产生相同输出）
- **参数数量**: 限制参数数量，通常不超过3个
- **适当命名**: 使用描述性的函数名，通常使用动词开头
- **提前返回**: 对于条件逻辑，考虑提前返回以减少嵌套

### 6.2 避免常见陷阱

- **避免副作用**: 函数应该避免修改外部状态
- **避免全局变量**: 减少对全局变量的依赖
- **小心this绑定**: 注意函数中this的绑定，必要时使用bind或箭头函数
- **防止内存泄漏**: 注意闭包可能导致的内存泄漏问题

## 7. 总结

JavaScript函数是非常强大和灵活的，它们不仅仅是可重用代码的容器，还是构建复杂应用程序的基本构建块。理解函数声明、作用域、闭包和`this`关键字对于掌握JavaScript编程至关重要。

函数式编程技术如高阶函数、函数组合和记忆化可以帮助你编写更简洁、更可维护的代码。通过遵循最佳实践原则，你可以充分利用JavaScript函数的强大功能，同时避免常见的陷阱和反模式。