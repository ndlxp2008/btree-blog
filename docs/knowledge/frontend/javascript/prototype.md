# JavaScript 原型与继承

JavaScript 是一种基于原型的语言，不同于传统的基于类的语言（如 Java 或 C++）。本文档详细介绍 JavaScript 的原型机制、继承模式以及相关最佳实践。

## 1. 原型基础

### 1.1 什么是原型

在 JavaScript 中，每个对象都有一个内部链接指向另一个对象，称为该对象的原型（prototype）。原型对象也有自己的原型，形成一个链条，直到达到一个原型为 `null` 的对象。这个链条被称为"原型链"。

### 1.2 `__proto__` 与 `prototype` 属性

- **`__proto__`**：每个对象都有的内部属性，指向该对象的原型
- **`prototype`**：函数对象特有的属性，指向创建出的实例对象的原型

```javascript
function Person(name) {
  this.name = name;
}

const alice = new Person('Alice');

// 原型关系
console.log(alice.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true
```

> 注意：`__proto__` 实际上是一个非标准属性，现代 JavaScript 提供了 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()` 方法来操作原型。

### 1.3 原型链查找机制

当访问一个对象的属性时，JavaScript 引擎会：

1. 先在对象自身查找该属性
2. 如果找不到，则在对象的原型上查找
3. 如果还找不到，则在原型的原型上查找
4. 以此类推，直到找到该属性或到达原型链的末端（`null`）

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  return `Hello, I'm ${this.name}`;
};

const alice = new Person('Alice');

console.log(alice.sayHello()); // "Hello, I'm Alice"
console.log(alice.toString()); // 从 Object.prototype 继承的方法
```

## 2. 原型的使用

### 2.1 原型属性和方法共享

原型最常见的用途是在实例间共享方法：

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 在原型上定义方法，所有实例共享
Person.prototype.sayHello = function() {
  return `Hello, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
  return this.age;
};

const alice = new Person('Alice', 25);
const bob = new Person('Bob', 30);

console.log(alice.sayHello()); // "Hello, I'm Alice"
console.log(bob.sayHello());   // "Hello, I'm Bob"
```

### 2.2 原型的动态性

原型对象的修改会立即反映到所有引用该原型的对象上：

```javascript
function Person(name) {
  this.name = name;
}

const alice = new Person('Alice');

// 在创建实例后修改原型
Person.prototype.sayHello = function() {
  return `Hello, I'm ${this.name}`;
};

console.log(alice.sayHello()); // "Hello, I'm Alice"
```

### 2.3 实例属性遮蔽原型属性

如果实例和原型有同名属性，实例属性会"遮蔽"原型属性：

```javascript
function Person() {}

Person.prototype.name = 'Default';

const alice = new Person();
alice.name = 'Alice';

console.log(alice.name); // "Alice"（实例属性）

const bob = new Person();
console.log(bob.name);   // "Default"（原型属性）
```

## 3. 创建对象的模式

### 3.1 构造函数模式

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.sayHello = function() {
    return `Hello, I'm ${this.name}`;
  };
}

const alice = new Person('Alice', 25);
```

**优点**：简单直观，可以接受参数
**缺点**：每个实例都会创建方法的副本，占用内存

### 3.2 原型模式

```javascript
function Person() {}

Person.prototype.name = 'Default';
Person.prototype.age = 0;
Person.prototype.sayHello = function() {
  return `Hello, I'm ${this.name}`;
};

const alice = new Person();
alice.name = 'Alice';
alice.age = 25;
```

**优点**：方法共享，节省内存
**缺点**：所有实例默认共享相同的属性值，原型属性修改会影响所有实例

### 3.3 构造函数与原型组合模式

结合前两种模式的优点：

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function() {
  return `Hello, I'm ${this.name}`;
};

const alice = new Person('Alice', 25);
```

**优点**：实例属性在构造函数中定义，方法在原型上共享
**缺点**：构造函数和原型分离定义

### 3.4 动态原型模式

将原型方法的初始化封装在构造函数中：

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  // 动态添加原型方法
  if (typeof this.sayHello !== 'function') {
    Person.prototype.sayHello = function() {
      return `Hello, I'm ${this.name}`;
    };
  }
}

const alice = new Person('Alice', 25);
```

**优点**：封装性好，只在需要时初始化原型
**缺点**：稍显复杂

### 3.5 Object.create() 方法

ES5 引入的创建对象的方法：

```javascript
const personProto = {
  sayHello: function() {
    return `Hello, I'm ${this.name}`;
  }
};

const alice = Object.create(personProto);
alice.name = 'Alice';
alice.age = 25;
```

**优点**：直接指定原型，不需要构造函数
**缺点**：属性赋值分离

## 4. 继承模式

### 4.1 原型链继承

```javascript
function Animal(type) {
  this.type = type;
}

Animal.prototype.getType = function() {
  return this.type;
};

function Dog(name) {
  this.name = name;
}

// 设置 Dog 的原型为 Animal 的实例
Dog.prototype = new Animal('dog');
// 修复 constructor 属性
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} says: Woof!`;
};

const rex = new Dog('Rex');
console.log(rex.getType()); // "dog"
console.log(rex.bark());    // "Rex says: Woof!"
```

**优点**：简单，易于实现
**缺点**：原型包含引用值会在所有实例间共享，不能向父类构造函数传参

### 4.2 构造函数继承

```javascript
function Animal(type) {
  this.type = type;
  this.sleep = function() {
    return `${this.name} is sleeping`;
  };
}

function Dog(name, type) {
  // 调用父类构造函数
  Animal.call(this, type);
  this.name = name;
}

const rex = new Dog('Rex', 'dog');
console.log(rex.type);   // "dog"
console.log(rex.sleep()); // "Rex is sleeping"
```

**优点**：可以向父类构造函数传参，实例属性独立
**缺点**：方法在构造函数中定义，无法共享；无法继承原型方法

### 4.3 组合继承

结合原型链继承和构造函数继承：

```javascript
function Animal(type) {
  this.type = type;
  this.colors = ['black', 'white'];
}

Animal.prototype.getType = function() {
  return this.type;
};

function Dog(name, type) {
  // 继承属性
  Animal.call(this, type);
  this.name = name;
}

// 继承方法
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} says: Woof!`;
};

const rex = new Dog('Rex', 'dog');
rex.colors.push('brown');
console.log(rex.colors);    // ["black", "white", "brown"]

const max = new Dog('Max', 'dog');
console.log(max.colors);    // ["black", "white"]
```

**优点**：结合了前两种继承方式的优点
**缺点**：调用了两次父类构造函数

### 4.4 原型式继承

```javascript
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

// ES5 之后可以直接使用 Object.create()
const animal = {
  type: 'animal',
  colors: ['black', 'white'],
  getType: function() {
    return this.type;
  }
};

const dog = object(animal);
dog.name = 'Dog';
dog.bark = function() {
  return `${this.name} says: Woof!`;
};

console.log(dog.getType()); // "animal"
```

**优点**：不需要构造函数
**缺点**：引用类型属性共享问题

### 4.5 寄生式继承

```javascript
function createDog(original) {
  const clone = Object.create(original);
  clone.name = 'Dog';
  clone.bark = function() {
    return `${this.name} says: Woof!`;
  };
  return clone;
}

const animal = {
  type: 'animal',
  getType: function() {
    return this.type;
  }
};

const dog = createDog(animal);
console.log(dog.getType()); // "animal"
console.log(dog.bark());    // "Dog says: Woof!"
```

**优点**：对原型式继承的增强，添加自定义属性和方法
**缺点**：方法无法复用

### 4.6 寄生组合式继承

最理想的继承模式：

```javascript
function inheritPrototype(subType, superType) {
  const prototype = Object.create(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}

function Animal(type) {
  this.type = type;
  this.colors = ['black', 'white'];
}

Animal.prototype.getType = function() {
  return this.type;
};

function Dog(name, type) {
  Animal.call(this, type);
  this.name = name;
}

inheritPrototype(Dog, Animal);

Dog.prototype.bark = function() {
  return `${this.name} says: Woof!`;
};

const rex = new Dog('Rex', 'dog');
console.log(rex.getType()); // "dog"
console.log(rex.bark());    // "Rex says: Woof!"
```

**优点**：只调用一次父类构造函数，避免在原型上创建不必要的属性，原型链保持完整
**缺点**：实现较复杂

## 5. ES6 类与原型

ES6 引入的类（class）语法实际上是原型机制的语法糖：

```javascript
class Animal {
  constructor(type) {
    this.type = type;
    this.colors = ['black', 'white'];
  }

  getType() {
    return this.type;
  }
}

class Dog extends Animal {
  constructor(name, type) {
    super(type);
    this.name = name;
  }

  bark() {
    return `${this.name} says: Woof!`;
  }
}

const rex = new Dog('Rex', 'dog');
console.log(rex.getType()); // "dog"
console.log(rex.bark());    // "Rex says: Woof!"
```

ES6 类的特点：

1. 类声明不会提升
2. 类中的所有代码自动运行在严格模式下
3. 类方法不可枚举
4. 类方法没有 `prototype` 属性，不能用作构造函数
5. 必须使用 `new` 调用类构造函数
6. 类中不能修改类名

## 6. 实战应用与最佳实践

### 6.1 使用原型共享方法

```javascript
function Player(name, level) {
  this.name = name;
  this.level = level;
}

// 在原型上定义方法，所有实例共享
Player.prototype.getLevel = function() {
  return this.level;
};

Player.prototype.levelUp = function() {
  this.level++;
  return this.level;
};
```

### 6.2 避免扩展内置原型

除非绝对必要，否则不要修改内置对象的原型：

```javascript
// 不推荐
Array.prototype.first = function() {
  return this[0];
};

// 更好的做法：创建工具函数
function getFirstElement(array) {
  return array[0];
}
```

### 6.3 使用组合而非继承

在许多情况下，组合比继承更灵活：

```javascript
// 功能模块
const canEat = {
  eat: function(food) {
    return `Eating ${food}`;
  }
};

const canSleep = {
  sleep: function(hours) {
    return `Sleeping for ${hours} hours`;
  }
};

// 通过组合创建对象
function createAnimal(name) {
  return Object.assign({name}, canEat, canSleep);
}

const animal = createAnimal('Leo');
console.log(animal.eat('meat'));   // "Eating meat"
console.log(animal.sleep(8));      // "Sleeping for 8 hours"
```

### 6.4 原型污染防护

防止原型污染的技巧：

```javascript
// 创建没有原型的对象
const data = Object.create(null);

// 冻结Object原型
Object.freeze(Object.prototype);

// 验证用户输入，不直接使用用户输入的键
function safeSet(obj, key, value) {
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
    return;
  }
  obj[key] = value;
}
```

### 6.5 使用Symbol作为特殊属性键

使用Symbol作为属性键可以避免命名冲突：

```javascript
const privateMethod = Symbol('privateMethod');

class MyClass {
  constructor() {
    this.publicData = 'public';
  }

  [privateMethod]() {
    return 'This is private';
  }

  publicMethod() {
    return this[privateMethod]();
  }
}
```

## 7. 总结

JavaScript的原型继承机制是其最独特也是最强大的特性之一。理解原型链的工作原理和各种继承模式，对于编写高效、可维护的JavaScript代码至关重要。

虽然ES6引入了类语法，使面向对象编程更加直观，但它背后仍然是基于原型的机制。掌握原型知识不仅能够让你理解JavaScript的内部工作原理，还能够帮助你解决复杂的继承和对象创建问题。

在实际项目中，应根据具体需求选择合适的对象创建和继承模式，同时遵循最佳实践，以确保代码的健壮性和可维护性。