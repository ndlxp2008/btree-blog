# JavaScript 对象与原型

## 对象基础

对象是JavaScript中最基本的数据结构，由键值对组成的无序集合。对象可以存储各种数据类型，包括原始值、其他对象和函数。

### 创建对象的方式

1. **对象字面量**

```javascript
const person = {
  name: 'John',
  age: 30,
  greet: function() {
    console.log(`Hello, my name is ${this.name}`);
  }
};
```

2. **构造函数**

```javascript
const person = new Object();
person.name = 'John';
person.age = 30;
person.greet = function() {
  console.log(`Hello, my name is ${this.name}`);
};
```

3. **Object.create()**

```javascript
const personProto = {
  greet: function() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

const person = Object.create(personProto);
person.name = 'John';
person.age = 30;
```

### 属性访问与操作

```javascript
// 点号表示法
person.name = 'John';
console.log(person.age);

// 方括号表示法(适用于动态属性名或包含特殊字符的属性)
person['full-name'] = 'John Doe';
const prop = 'age';
console.log(person[prop]);

// 检查属性是否存在
console.log('name' in person); // true
console.log(person.hasOwnProperty('name')); // true

// 删除属性
delete person.age;
```

### 对象方法

```javascript
// 获取所有键
Object.keys(person); // ['name', 'age', 'greet']

// 获取所有值
Object.values(person); // ['John', 30, ƒ]

// 获取所有键值对
Object.entries(person); // [['name', 'John'], ['age', 30], ['greet', ƒ]]

// 合并对象
const details = { address: 'New York', occupation: 'Developer' };
const fullProfile = Object.assign({}, person, details);
// ES6展开运算符
const fullProfileSpread = { ...person, ...details };
```

## 原型与继承

JavaScript使用原型链实现继承，这是其最强大的特性之一。

### 原型链基础

每个JavaScript对象都有一个内部链接指向另一个对象，称为其原型。当试图访问一个对象的属性时，如果该对象本身没有这个属性，JavaScript会尝试在其原型上查找，然后是原型的原型，依此类推，直到找到匹配的属性或到达原型链的末尾（null）。

```javascript
// 对象的原型
Object.getPrototypeOf(person); // 返回person的原型对象
```

### 构造函数与原型

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 在原型上添加方法，所有实例共享
Person.prototype.greet = function() {
  console.log(`Hello, my name is ${this.name}`);
};

// 创建实例
const john = new Person('John', 30);
const jane = new Person('Jane', 25);

john.greet(); // "Hello, my name is John"
jane.greet(); // "Hello, my name is Jane"
```

### 原型链继承

```javascript
// 父构造函数
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  console.log(`Hello, my name is ${this.name}`);
};

// 子构造函数
function Employee(name, position) {
  Person.call(this, name); // 调用父构造函数
  this.position = position;
}

// 设置原型链以实现继承
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

// 添加子类特定方法
Employee.prototype.introduce = function() {
  console.log(`I am ${this.name}, the ${this.position}`);
};

const employee = new Employee('John', 'Developer');
employee.greet(); // "Hello, my name is John"
employee.introduce(); // "I am John, the Developer"
```

### ES6 类语法

ES6引入了类语法，这是对原型继承的语法糖，使代码更易读和维护。

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

class Employee extends Person {
  constructor(name, age, position) {
    super(name, age); // 调用父类构造函数
    this.position = position;
  }

  introduce() {
    console.log(`I am ${this.name}, the ${this.position}`);
  }

  // 覆盖父类方法
  greet() {
    super.greet(); // 调用父类方法
    console.log(`I work as a ${this.position}`);
  }
}

const employee = new Employee('John', 30, 'Developer');
employee.greet();
// "Hello, my name is John"
// "I work as a Developer"
```

## 对象高级特性

### 属性描述符

JavaScript允许精细控制对象属性的行为。

```javascript
const person = {};

// 定义带有描述符的属性
Object.defineProperty(person, 'name', {
  value: 'John',
  writable: true,     // 是否可修改
  enumerable: true,   // 是否可枚举(出现在for...in循环中)
  configurable: true  // 是否可删除或修改描述符
});

// 定义多个属性
Object.defineProperties(person, {
  age: {
    value: 30,
    writable: true,
    enumerable: true,
    configurable: true
  },
  ssn: {
    value: '123-45-6789',
    writable: false,   // 只读
    enumerable: false, // 不可枚举
    configurable: false // 不可配置
  }
});

// 获取属性描述符
Object.getOwnPropertyDescriptor(person, 'name');
```

### Getter与Setter

```javascript
const person = {
  firstName: 'John',
  lastName: 'Doe',

  // Getter
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  // Setter
  set fullName(name) {
    const parts = name.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  }
};

console.log(person.fullName); // "John Doe"
person.fullName = 'Jane Smith';
console.log(person.firstName); // "Jane"
console.log(person.lastName); // "Smith"
```

### 对象的不变性

JavaScript提供多种方法控制对象的可变性。

```javascript
const person = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York'
  }
};

// 防止添加新属性，但现有属性可修改
Object.preventExtensions(person);
person.email = 'john@example.com'; // 在严格模式下抛出错误
console.log(Object.isExtensible(person)); // false

// 密封：防止添加或删除属性，但可以修改现有属性
const sealedPerson = Object.seal(person);
delete person.age; // 在严格模式下抛出错误
person.name = 'Jane'; // 可以修改
console.log(Object.isSealed(person)); // true

// 冻结：最严格的不变性级别，不能添加、删除或修改属性
const frozenPerson = Object.freeze(person);
person.name = 'Jane'; // 在严格模式下抛出错误
console.log(Object.isFrozen(person)); // true

// 注意：冻结是浅层的，嵌套对象需要单独冻结
person.address.city = 'Boston'; // 仍然可以修改嵌套对象
```

## 实用模式与最佳实践

### 工厂模式

```javascript
function createPerson(name, age) {
  return {
    name,
    age,
    greet() {
      console.log(`Hello, my name is ${this.name}`);
    }
  };
}

const john = createPerson('John', 30);
const jane = createPerson('Jane', 25);
```

### 构造函数模式

```javascript
function Person(name, age) {
  if (!(this instanceof Person)) {
    return new Person(name, age); // 防止忘记使用new
  }

  this.name = name;
  this.age = age;

  // 每个实例都有自己的方法副本
  this.greet = function() {
    console.log(`Hello, my name is ${this.name}`);
  };
}

const john = new Person('John', 30);
```

### 原型模式

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 共享方法，节省内存
Person.prototype.greet = function() {
  console.log(`Hello, my name is ${this.name}`);
};
Person.prototype.celebrateBirthday = function() {
  this.age++;
  console.log(`Happy birthday! Now I'm ${this.age} years old.`);
};

const john = new Person('John', 30);
```

### 混合模式（构造函数+原型）

```javascript
function Person(name, age) {
  // 实例特定属性
  this.name = name;
  this.age = age;
  this.friends = []; // 每个实例有自己的数组
}

// 共享方法
Person.prototype.greet = function() {
  console.log(`Hello, my name is ${this.name}`);
};
Person.prototype.addFriend = function(name) {
  this.friends.push(name);
};

const john = new Person('John', 30);
```

### 模块模式（封装）

```javascript
const personModule = (function() {
  // 私有变量
  let privateData = {};
  let privateCounter = 0;

  // 私有方法
  function validateName(name) {
    return typeof name === 'string' && name.length > 0;
  }

  // 公开API
  return {
    addPerson: function(name, age) {
      if (validateName(name)) {
        const id = `person${privateCounter++}`;
        privateData[id] = { name, age };
        return id;
      }
      return null;
    },
    getPerson: function(id) {
      return { ...privateData[id] }; // 返回副本避免外部修改
    },
    removePerson: function(id) {
      if (privateData[id]) {
        delete privateData[id];
        return true;
      }
      return false;
    }
  };
})();

const johnId = personModule.addPerson('John', 30);
console.log(personModule.getPerson(johnId)); // { name: 'John', age: 30 }
personModule.removePerson(johnId);
```

## 常见问题及解决方案

### `this`关键字绑定问题

```javascript
const person = {
  name: 'John',
  greet: function() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

// 直接调用方法
person.greet(); // "Hello, my name is John"

// 将方法赋值给变量（丢失原始上下文）
const greetFunc = person.greet;
greetFunc(); // "Hello, my name is undefined"

// 解决方案1：使用bind
const boundGreet = person.greet.bind(person);
boundGreet(); // "Hello, my name is John"

// 解决方案2：使用箭头函数
person.delayedGreet = function() {
  setTimeout(() => {
    // 箭头函数保留外部this
    console.log(`Hello, my name is ${this.name}`);
  }, 1000);
};
person.delayedGreet(); // 1秒后: "Hello, my name is John"
```

### 深拷贝与浅拷贝

```javascript
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA'
  },
  hobbies: ['reading', 'sports']
};

// 浅拷贝
const shallowCopy1 = Object.assign({}, original);
const shallowCopy2 = { ...original };

// 深拷贝
const deepCopy1 = JSON.parse(JSON.stringify(original)); // 简单方法，但有局限性

// 更完整的深拷贝实现
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  // 处理Date
  if (obj instanceof Date) return new Date(obj);

  // 处理Array
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }

  // 处理Object
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }

  return clonedObj;
}

const deepCopy2 = deepClone(original);
```

## 性能考虑

### 原型链查找

原型链查找是有性能成本的。查找的属性越深，需要的时间越长。

```javascript
// 性能更好，直接在实例上找到属性
const person = { name: 'John' };
console.log(person.name);

// 性能较差，需要在原型链上查找
function Person() {}
Person.prototype.name = 'John';
const p = new Person();
console.log(p.name);
```

### 避免动态属性

频繁添加或删除对象属性会降低性能。

```javascript
// 更好的做法：一次性定义对象
const person = {
  name: 'John',
  age: 30
};

// 较差的做法：多次修改对象结构
const person2 = {};
person2.name = 'John';
// ... 一些代码
person2.age = 30;
```

## 现代JavaScript中的对象特性

### 对象解构

```javascript
const person = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA'
  }
};

// 基本解构
const { name, age } = person;
console.log(name, age); // "John" 30

// 重命名
const { name: fullName } = person;
console.log(fullName); // "John"

// 默认值
const { job = 'Developer' } = person;
console.log(job); // "Developer"

// 嵌套解构
const { address: { city } } = person;
console.log(city); // "New York"
```

### 对象方法简写

```javascript
// ES5
const person = {
  name: 'John',
  greet: function() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

// ES6+
const person6 = {
  name: 'John',
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
};
```

### 计算属性名

```javascript
const propName = 'age';
const person = {
  name: 'John',
  [propName]: 30, // 计算属性名
  [`user_${propName}`]: 30 // 可以包含表达式
};

console.log(person.age); // 30
console.log(person.user_age); // 30
```

### Object.fromEntries()

将键值对列表转换为对象。

```javascript
const entries = [
  ['name', 'John'],
  ['age', 30]
];

const person = Object.fromEntries(entries);
console.log(person); // { name: 'John', age: 30 }

// 实用示例：将URL参数转换为对象
const paramsString = 'name=John&age=30&occupation=developer';
const searchParams = new URLSearchParams(paramsString);
const paramsObject = Object.fromEntries(searchParams);
console.log(paramsObject); // { name: 'John', age: '30', occupation: 'developer' }
```

### 可选链操作符（?.）

```javascript
const user = {
  name: 'John',
  address: {
    city: 'New York'
  }
};

// 旧方法，容易出错
const city1 = user.address && user.address.city;

// 新方法，更安全简洁
const city2 = user.address?.city;
const zipCode = user.address?.zipCode; // undefined，不会报错

// 与方法调用结合
user.printAddress?.(); // 如果方法不存在，不会报错
```

### 空值合并操作符（??）

```javascript
const user = {
  name: 'John',
  age: 0
};

// 旧方法，会错误地覆盖0值
const age1 = user.age || 20; // 20，因为0被视为假值

// 新方法，只在值为null或undefined时使用默认值
const age2 = user.age ?? 20; // 0，保留原始值
```

## 结论

JavaScript的对象和原型系统是语言的核心部分，理解这些概念对于掌握JavaScript至关重要。从基本的对象创建与操作，到利用原型链实现继承，再到ES6引入的类语法糖，JavaScript提供了丰富而灵活的方式来组织和重用代码。

通过深入理解对象与原型，开发者可以更好地利用JavaScript的动态特性，编写出更高效、可维护的代码，同时避免常见的陷阱和性能问题。