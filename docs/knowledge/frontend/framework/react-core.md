# React 核心概念

React 是由 Facebook 开发的用于构建用户界面的 JavaScript 库。它通过组件化的方式使得开发者可以创建复杂而可维护的单页应用程序。本文将介绍 React 的核心概念和基础知识。

## JSX 语法

JSX 是 JavaScript 的语法扩展，允许你在 JavaScript 中编写类似 HTML 的代码：

```jsx
const element = <h1>Hello, world!</h1>;
```

JSX 的特点：

1. **混合使用 JavaScript 表达式**：在 JSX 中可以使用花括号 `{}` 包裹 JavaScript 表达式

```jsx
const name = 'John';
const element = <h1>Hello, {name}!</h1>;
```

2. **属性设置**：可以使用 HTML 类似的属性，但某些属性名称有所不同（如 `className` 而非 `class`）

```jsx
const element = <div className="container" tabIndex="0"></div>;
```

3. **子元素**：可以包含多个子元素

```jsx
const element = (
  <div>
    <h1>Title</h1>
    <p>Paragraph</p>
  </div>
);
```

4. **防止 XSS 攻击**：JSX 会自动转义大多数值，帮助防止 XSS 攻击

## 组件与 Props

组件是 React 的核心概念，它允许你将 UI 拆分为独立、可复用的部分。

### 函数组件

最简单的组件形式是函数组件：

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

### 类组件

也可以使用 ES6 类来定义组件：

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### 组件组合

组件可以组合使用：

```jsx
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
      <Welcome name="Charlie" />
    </div>
  );
}
```

### Props

Props（属性）是从父组件传递到子组件的数据：

- Props 是只读的
- 所有 React 组件都必须像纯函数一样保护它们的 props 不被更改

```jsx
// 在父组件中使用子组件并传递 props
function ParentComponent() {
  return <ChildComponent name="John" age={30} isActive={true} />;
}

// 子组件接收并使用 props
function ChildComponent(props) {
  return (
    <div>
      <p>Name: {props.name}</p>
      <p>Age: {props.age}</p>
      <p>Active: {props.isActive ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

## 状态管理

### State

State 是组件私有的数据，可以在组件的生命周期内变化：

```jsx
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

### 使用 State 的注意事项

1. **不要直接修改 State**

```jsx
// 错误
this.state.comment = 'Hello';

// 正确
this.setState({ comment: 'Hello' });
```

2. **State 的更新可能是异步的**

React 可能会将多个 `setState()` 调用合并为一个更新，以提高性能：

```jsx
// 错误，可能导致问题
this.setState({
  counter: this.state.counter + this.props.increment,
});

// 正确，使用函数形式确保访问最新状态
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

3. **State 更新会被合并**

当调用 `setState()` 时，React 会将提供的对象合并到当前 state 中：

```jsx
constructor(props) {
  super(props);
  this.state = {
    posts: [],
    comments: []
  };
}

// 只更新 comments，不影响 posts
this.setState({
  comments: ['New comment']
});
```

### 在函数组件中使用 State

使用 React Hooks 的 `useState` 钩子：

```jsx
import React, { useState } from 'react';

function Counter() {
  // 声明一个名为 "count" 的 state 变量，初始值为 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## 生命周期方法

React 组件有多个生命周期方法，允许你在特定时间执行代码：

### 挂载阶段

- **constructor()**：组件初始化
- **static getDerivedStateFromProps()**：在渲染前更新 state
- **render()**：渲染组件
- **componentDidMount()**：组件挂载后执行，适合设置网络请求、订阅等

### 更新阶段

- **static getDerivedStateFromProps()**：同挂载阶段
- **shouldComponentUpdate()**：根据返回值决定是否继续更新流程
- **render()**：重新渲染
- **getSnapshotBeforeUpdate()**：在 DOM 更新前获取信息
- **componentDidUpdate()**：组件更新后执行

### 卸载阶段

- **componentWillUnmount()**：组件卸载前执行，适合清理工作

### 错误处理

- **static getDerivedStateFromError()**：渲染备用 UI
- **componentDidCatch()**：记录错误信息

### 使用 Hooks 管理生命周期

在函数组件中，可以使用 `useEffect` 替代多个生命周期方法：

```jsx
import React, { useState, useEffect } from 'react';

function ExampleWithLifecycle() {
  const [count, setCount] = useState(0);

  // 类似于 componentDidMount 和 componentDidUpdate
  useEffect(() => {
    document.title = `You clicked ${count} times`;

    // 返回的函数类似于 componentWillUnmount
    return () => {
      document.title = 'React App';
    };
  }, [count]); // 仅在 count 改变时执行

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## 事件处理

React 事件遵循驼峰命名约定，并且使用 JSX 直接传递函数作为事件处理程序：

```jsx
function Button() {
  function handleClick(e) {
    e.preventDefault(); // 阻止默认行为
    console.log('Button was clicked');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

### 事件处理中的 `this` 绑定

在类组件中需要注意 `this` 的绑定：

```jsx
class Button extends React.Component {
  constructor(props) {
    super(props);
    // 绑定方法，确保 this 指向组件实例
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

替代方案包括：

1. **公共类字段语法**（Class Fields）

```jsx
class Button extends React.Component {
  // 使用箭头函数自动绑定 this
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

2. **在回调中使用箭头函数**

```jsx
class Button extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 注意：这种方式在每次渲染时都会创建新函数
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```

## 条件渲染

React 中可以使用多种方式实现条件渲染：

### 使用 if 语句

```jsx
function UserGreeting(props) {
  if (props.isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else {
    return <h1>Please sign up.</h1>;
  }
}
```

### 使用三元运算符

```jsx
function UserGreeting(props) {
  return (
    <h1>
      {props.isLoggedIn ? 'Welcome back!' : 'Please sign up.'}
    </h1>
  );
}
```

### 使用逻辑与运算符（&&）

```jsx
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}
```

### 阻止组件渲染

```jsx
function WarningBanner(props) {
  if (!props.warn) {
    return null; // 不渲染任何内容
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}
```

## 列表和 Keys

在 React 中渲染列表通常使用 `map()` 方法：

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}
```

### Keys 的作用

Keys 帮助 React 识别哪些项目已更改、添加或删除：

- Keys 应该是稳定、可预测且唯一的
- 通常使用数据中的 ID 作为 key
- 仅在万不得已时才使用索引作为 key

```jsx
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

## 表单处理

### 受控组件

在 HTML 中，表单元素如 `<input>`、`<textarea>` 和 `<select>` 通常维护自己的状态。在 React 中，可以通过将它们的状态存储在组件的 state 中使其成为"受控组件"：

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

### 处理多个输入

当有多个输入时，可以给每个元素添加 `name` 属性，并让处理函数根据 `event.target.name` 决定要做什么：

```jsx
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value // 使用 ES6 的计算属性名称
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

### 非受控组件

有时使用受控组件很麻烦，可以使用非受控组件，其中表单数据由 DOM 本身处理：

```jsx
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();
    alert(
      `Selected file - ${this.fileInput.current.files[0].name}`
    );
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <label>
          Upload file:
          <input type="file" ref={this.fileInput} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

## 状态提升

当多个组件需要共享状态时，可以将状态提升到它们最近的共同祖先：

```jsx
function TemperatureInput(props) {
  return (
    <fieldset>
      <legend>Enter temperature in {props.scale}:</legend>
      <input value={props.temperature}
             onChange={(e) => props.onTemperatureChange(e.target.value)} />
    </fieldset>
  );
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange.bind(this)} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange.bind(this)} />
      </div>
    );
  }
}
```

## 组合与继承

React 推荐使用组合而非继承来复用组件之间的代码：

### 包含关系

使用特殊的 `children` prop 将子元素传递给组件：

```jsx
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

### 特殊情况

有时需要在组件中有多个"洞"，可以使用自定义 props 而不是 `children`：

```jsx
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={<Contacts />}
      right={<Chat />}
    />
  );
}
```

## Context API

Context 提供了一种跨组件共享数据的方法，而不必显式地通过 props 传递：

```jsx
// 创建一个 Context
const ThemeContext = React.createContext('light');

// Provider 组件
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 中间组件不需要传递 theme
function Toolbar() {
  return <ThemedButton />;
}

// Consumer 组件
function ThemedButton() {
  return (
    <ThemeContext.Consumer>
      {theme => <Button theme={theme} />}
    </ThemeContext.Consumer>
  );
}
```

在函数组件中，也可以使用 `useContext` 钩子：

```jsx
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <Button theme={theme} />;
}
```

## Hooks

Hooks 是 React 16.8 引入的功能，允许在函数组件中使用状态和其他 React 特性：

### 基本 Hooks

#### useState

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

#### useEffect

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 类似于 componentDidMount 和 componentDidUpdate
  useEffect(() => {
    document.title = `You clicked ${count} times`;

    // 可选的清理函数（类似于 componentWillUnmount）
    return () => {
      document.title = 'React App';
    };
  }, [count]); // 仅在 count 更改时运行

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

#### useContext

```jsx
import React, { useContext } from 'react';

const ThemeContext = React.createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}
```

### 额外的 Hooks

- **useReducer**：管理复杂状态逻辑
- **useCallback**：返回记忆化的回调函数
- **useMemo**：返回记忆化的值
- **useRef**：创建可变的引用
- **useImperativeHandle**：自定义暴露给父组件的实例值
- **useLayoutEffect**：与 useEffect 类似，但会在所有 DOM 变更后同步触发
- **useDebugValue**：在开发工具中显示自定义 hook 标签

## React 性能优化

### React.memo

通过记忆组件渲染结果来避免不必要的渲染：

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  /* 仅在 props 更改时渲染 */
  return <div>{props.name}</div>;
});
```

### useMemo 和 useCallback

分别用于记忆计算值和回调函数：

```jsx
// 仅在依赖改变时重新计算
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// 仅在依赖改变时创建新回调
const memoizedCallback = useCallback(
  () => { doSomething(a, b); },
  [a, b]
);
```

### React.PureComponent

类组件版本的浅层比较优化：

```jsx
class MyComponent extends React.PureComponent {
  render() {
    return <div>{this.props.name}</div>;
  }
}
```

## 总结

React 的核心概念包括：

1. **JSX** - 将 HTML 与 JavaScript 结合的语法扩展
2. **组件与 Props** - 通过可复用组件构建 UI，并通过 props 传递数据
3. **State 和生命周期** - 管理组件内部数据和响应组件生命周期事件
4. **事件处理** - 响应用户交互
5. **条件渲染** - 根据应用状态渲染不同内容
6. **列表和 Keys** - 高效渲染列表项
7. **表单处理** - 管理用户输入
8. **状态提升** - 在组件层次结构中共享状态
9. **组合与继承** - 通过组合而非继承重用代码
10. **Context API** - 避免 props 深层传递
11. **Hooks** - 在函数组件中使用状态和其他 React 特性

掌握这些核心概念是成为高效 React 开发者的基础。