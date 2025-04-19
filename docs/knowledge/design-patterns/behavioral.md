# 行为型设计模式

行为型设计模式专注于对象之间的通信，它们如何交互以及如何分配职责。这类模式关注算法和对象间的职责分配，旨在增强系统灵活性和扩展性。

## 策略模式 (Strategy Pattern)

### 意图
定义一系列算法，将每个算法封装起来，并使它们可以互换。策略模式让算法可以独立于使用它的客户而变化。

### 应用场景
- 需要使用不同的算法变体，并希望能在运行时切换算法
- 有许多相似的类，只在行为上有所不同
- 需要隐藏复杂算法的实现细节
- 一个类定义了多种行为，且这些行为以多个条件语句的形式出现

### 结构
- **上下文 (Context)**: 维护一个对策略对象的引用，可调用策略对象定义的算法
- **策略接口 (Strategy)**: 定义所有支持的算法的公共接口
- **具体策略 (ConcreteStrategy)**: 实现策略接口的具体算法

### 示例代码

```java
// 策略接口
interface PaymentStrategy {
    void pay(int amount);
}

// 具体策略A
class CreditCardPayment implements PaymentStrategy {
    private String name;
    private String cardNumber;
    private String cvv;
    private String dateOfExpiry;

    public CreditCardPayment(String name, String cardNumber, String cvv, String dateOfExpiry) {
        this.name = name;
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.dateOfExpiry = dateOfExpiry;
    }

    @Override
    public void pay(int amount) {
        System.out.println(amount + " paid with credit card");
    }
}

// 具体策略B
class PayPalPayment implements PaymentStrategy {
    private String emailId;
    private String password;

    public PayPalPayment(String emailId, String password) {
        this.emailId = emailId;
        this.password = password;
    }

    @Override
    public void pay(int amount) {
        System.out.println(amount + " paid using PayPal");
    }
}

// 上下文类
class ShoppingCart {
    private PaymentStrategy paymentStrategy;

    public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    public void checkout(int amount) {
        paymentStrategy.pay(amount);
    }
}

// 客户端代码
class Client {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();

        // 信用卡支付
        cart.setPaymentStrategy(new CreditCardPayment("John Doe", "1234567890123456", "123", "12/24"));
        cart.checkout(100);

        // PayPal支付
        cart.setPaymentStrategy(new PayPalPayment("john@example.com", "password"));
        cart.checkout(200);
    }
}
```

### 优缺点
**优点**：
- 定义了一系列可重用的算法和行为
- 消除了条件语句
- 实现了算法的自由切换
- 避免使用继承（通过组合实现行为变化）

**缺点**：
- 客户必须了解不同的策略
- 增加了对象的数量
- 策略和上下文之间的通信开销

## 观察者模式 (Observer Pattern)

### 意图
定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知并自动更新。

### 应用场景
- 当一个对象的改变需要同时改变其他对象，且不知道有多少对象需要改变
- 当一个抽象模型有两个方面，其中一个依赖于另一个
- 当对一个对象的改变需要通知其他对象，而又不知道这些对象是谁

### 结构
- **主题 (Subject)**: 提供注册和移除观察者的接口
- **具体主题 (ConcreteSubject)**: 实现主题接口，维护观察者列表
- **观察者 (Observer)**: 定义更新接口，使主题发生改变时得到通知
- **具体观察者 (ConcreteObserver)**: 实现观察者更新接口，以便在状态变化时做出响应

### 示例代码

```java
import java.util.ArrayList;
import java.util.List;

// 观察者接口
interface Observer {
    void update(String message);
}

// 主题接口
interface Subject {
    void register(Observer observer);
    void unregister(Observer observer);
    void notifyObservers();
    void setMessage(String message);
}

// 具体主题
class MessagePublisher implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String message;

    @Override
    public void register(Observer observer) {
        if (!observers.contains(observer)) {
            observers.add(observer);
        }
    }

    @Override
    public void unregister(Observer observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(message);
        }
    }

    @Override
    public void setMessage(String message) {
        this.message = message;
        notifyObservers();
    }
}

// 具体观察者A
class MessageSubscriberA implements Observer {
    @Override
    public void update(String message) {
        System.out.println("MessageSubscriberA: " + message);
    }
}

// 具体观察者B
class MessageSubscriberB implements Observer {
    @Override
    public void update(String message) {
        System.out.println("MessageSubscriberB: " + message);
    }
}

// 客户端代码
class ObserverPatternDemo {
    public static void main(String[] args) {
        MessagePublisher publisher = new MessagePublisher();

        MessageSubscriberA subscriberA = new MessageSubscriberA();
        MessageSubscriberB subscriberB = new MessageSubscriberB();

        publisher.register(subscriberA);
        publisher.register(subscriberB);

        publisher.setMessage("Hello World!");  // 所有订阅者都会收到消息

        publisher.unregister(subscriberA);

        publisher.setMessage("Hello Again!");  // 只有B会收到
    }
}
```

### 优缺点
**优点**：
- 实现了对象间的松耦合
- 支持广播通信
- 符合开闭原则

**缺点**：
- 可能引起性能问题
- 可能导致循环依赖
- 实现观察者模式需要考虑线程安全

## 命令模式 (Command Pattern)

### 意图
将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化；对请求排队或记录请求日志，以及支持可撤销的操作。

### 应用场景
- 需要将请求发送者和接收者解耦
- 需要将请求参数化
- 需要支持撤销和重做操作
- 需要将一组操作组合在一起，例如事务

### 结构
- **命令 (Command)**: 声明执行操作的接口
- **具体命令 (ConcreteCommand)**: 实现执行操作的接口，调用接收者的相关操作
- **调用者 (Invoker)**: 要求命令执行请求
- **接收者 (Receiver)**: 知道如何实施与执行一个请求相关的操作
- **客户端 (Client)**: 创建具体命令对象并设定接收者

### 示例代码

```java
// 接收者
class Light {
    public void turnOn() {
        System.out.println("Light is on");
    }

    public void turnOff() {
        System.out.println("Light is off");
    }
}

// 命令接口
interface Command {
    void execute();
    void undo();
}

// 具体命令A
class LightOnCommand implements Command {
    private Light light;

    public LightOnCommand(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.turnOn();
    }

    @Override
    public void undo() {
        light.turnOff();
    }
}

// 具体命令B
class LightOffCommand implements Command {
    private Light light;

    public LightOffCommand(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.turnOff();
    }

    @Override
    public void undo() {
        light.turnOn();
    }
}

// 调用者
class RemoteControl {
    private Command command;
    private Command lastCommand;

    public void setCommand(Command command) {
        this.command = command;
    }

    public void pressButton() {
        command.execute();
        lastCommand = command;
    }

    public void pressUndoButton() {
        if (lastCommand != null) {
            lastCommand.undo();
        }
    }
}

// 客户端代码
class Client {
    public static void main(String[] args) {
        // 创建接收者
        Light light = new Light();

        // 创建具体命令，并设置接收者
        Command lightOn = new LightOnCommand(light);
        Command lightOff = new LightOffCommand(light);

        // 创建调用者
        RemoteControl remote = new RemoteControl();

        // 执行命令
        remote.setCommand(lightOn);
        remote.pressButton();  // 打开灯

        remote.setCommand(lightOff);
        remote.pressButton();  // 关闭灯

        // 撤销操作
        remote.pressUndoButton();  // 重新打开灯
    }
}
```

### 优缺点
**优点**：
- 降低系统的耦合度
- 容易扩展新命令
- 支持撤销和重做操作
- 支持复合命令

**缺点**：
- 可能导致系统中有过多的具体命令类
- 增加系统的复杂性

## 迭代器模式 (Iterator Pattern)

### 意图
提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示。

### 应用场景
- 需要访问一个聚合对象的内容，而无需暴露它的内部表示
- 需要为聚合对象提供多种遍历方式
- 需要为不同的聚合结构提供统一的遍历接口

### 结构
- **迭代器 (Iterator)**: 定义访问和遍历元素的接口
- **具体迭代器 (ConcreteIterator)**: 实现迭代器接口，跟踪遍历中的当前位置
- **聚合 (Aggregate)**: 定义创建迭代器对象的接口
- **具体聚合 (ConcreteAggregate)**: 实现创建具体迭代器的接口

### 示例代码

```java
import java.util.ArrayList;
import java.util.List;

// 迭代器接口
interface Iterator<T> {
    boolean hasNext();
    T next();
}

// 聚合接口
interface Container<T> {
    Iterator<T> getIterator();
}

// 具体聚合
class NameRepository implements Container<String> {
    private String[] names = {"Robert", "John", "Julie", "Lora"};

    @Override
    public Iterator<String> getIterator() {
        return new NameIterator();
    }

    // 具体迭代器
    private class NameIterator implements Iterator<String> {
        private int index;

        @Override
        public boolean hasNext() {
            return index < names.length;
        }

        @Override
        public String next() {
            if (this.hasNext()) {
                return names[index++];
            }
            return null;
        }
    }
}

// 客户端代码
class IteratorPatternDemo {
    public static void main(String[] args) {
        NameRepository namesRepository = new NameRepository();

        for (Iterator<String> iter = namesRepository.getIterator(); iter.hasNext();) {
            String name = iter.next();
            System.out.println("Name: " + name);
        }
    }
}
```

### 优缺点
**优点**：
- 支持以不同的方式遍历聚合对象
- 简化了聚合类
- 在同一个聚合上可以有多个遍历
- 迭代器模式将存储数据和遍历数据的职责分离

**缺点**：
- 对于简单的遍历，使用迭代器可能会过度设计
- 在一些高访问环境下，迭代器的使用可能会增加系统开销

## 模板方法模式 (Template Method Pattern)

### 意图
定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。模板方法使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。

### 应用场景
- 当多个算法有相同的结构，只是某些细节步骤有差异时
- 当需要控制子类扩展时
- 当需要一次性实现一个算法的不变部分，并将可变部分留给子类实现时

### 结构
- **抽象类 (AbstractClass)**: 定义抽象的原语操作（钩子操作），具体的子类需要实现它们
- **具体类 (ConcreteClass)**: 实现父类所定义的抽象方法

### 示例代码

```java
// 抽象类
abstract class Game {
    // 模板方法
    public final void play() {
        // 初始化游戏
        initialize();

        // 开始游戏
        startPlay();

        // 结束游戏
        endPlay();
    }

    // 抽象方法 - 由子类实现
    protected abstract void initialize();
    protected abstract void startPlay();
    protected abstract void endPlay();
}

// 具体类A
class Cricket extends Game {
    @Override
    protected void initialize() {
        System.out.println("Cricket Game Initialized! Start playing.");
    }

    @Override
    protected void startPlay() {
        System.out.println("Cricket Game Started. Enjoy the game!");
    }

    @Override
    protected void endPlay() {
        System.out.println("Cricket Game Finished!");
    }
}

// 具体类B
class Football extends Game {
    @Override
    protected void initialize() {
        System.out.println("Football Game Initialized! Start playing.");
    }

    @Override
    protected void startPlay() {
        System.out.println("Football Game Started. Enjoy the game!");
    }

    @Override
    protected void endPlay() {
        System.out.println("Football Game Finished!");
    }
}

// 客户端代码
class TemplatePatternDemo {
    public static void main(String[] args) {
        Game game = new Cricket();
        game.play();

        System.out.println();

        game = new Football();
        game.play();
    }
}
```

### 优缺点
**优点**：
- 封装不变部分，扩展可变部分
- 提取公共代码，便于维护
- 行为由父类控制，子类实现细节

**缺点**：
- 每个不同的实现都需要一个子类，可能导致类的数量增加
- 限制了复用的粒度，继承复用的粒度是比较粗的

## 责任链模式 (Chain of Responsibility Pattern)

### 意图
将请求的发送者和接收者解耦，使多个对象都有机会处理这个请求。将这些对象连成一条链，并沿着这条链传递请求，直到有一个对象处理它为止。

### 应用场景
- 有多个对象可以处理同一个请求，但具体由哪个对象处理该请求在运行时自动确定
- 想在不明确指定接收者的情况下，向多个对象中的一个提交一个请求
- 需要动态指定处理一个请求的对象集合

### 结构
- **处理者 (Handler)**: 定义一个处理请求的接口
- **具体处理者 (ConcreteHandler)**: 处理它所负责的请求，如果不能处理则将请求转发给继任者
- **客户端 (Client)**: 向链上的具体处理者对象提交请求

### 示例代码

```java
// 抽象处理者
abstract class Logger {
    public static int INFO = 1;
    public static int DEBUG = 2;
    public static int ERROR = 3;

    protected int level;
    protected Logger nextLogger;

    public void setNextLogger(Logger nextLogger) {
        this.nextLogger = nextLogger;
    }

    public void logMessage(int level, String message) {
        if (this.level <= level) {
            write(message);
        }
        if (nextLogger != null) {
            nextLogger.logMessage(level, message);
        }
    }

    protected abstract void write(String message);
}

// 具体处理者A
class ConsoleLogger extends Logger {
    public ConsoleLogger(int level) {
        this.level = level;
    }

    @Override
    protected void write(String message) {
        System.out.println("Standard Console::Logger: " + message);
    }
}

// 具体处理者B
class ErrorLogger extends Logger {
    public ErrorLogger(int level) {
        this.level = level;
    }

    @Override
    protected void write(String message) {
        System.out.println("Error Console::Logger: " + message);
    }
}

// 具体处理者C
class FileLogger extends Logger {
    public FileLogger(int level) {
        this.level = level;
    }

    @Override
    protected void write(String message) {
        System.out.println("File::Logger: " + message);
    }
}

// 客户端代码
class ChainPatternDemo {

    private static Logger getChainOfLoggers() {
        Logger errorLogger = new ErrorLogger(Logger.ERROR);
        Logger fileLogger = new FileLogger(Logger.DEBUG);
        Logger consoleLogger = new ConsoleLogger(Logger.INFO);

        errorLogger.setNextLogger(fileLogger);
        fileLogger.setNextLogger(consoleLogger);

        return errorLogger;
    }

    public static void main(String[] args) {
        Logger loggerChain = getChainOfLoggers();

        loggerChain.logMessage(Logger.INFO, "This is an information.");
        loggerChain.logMessage(Logger.DEBUG, "This is a debug level information.");
        loggerChain.logMessage(Logger.ERROR, "This is an error information.");
    }
}
```

### 优缺点
**优点**：
- 降低耦合度，发送者和接收者无须明确知道对方
- 可以动态地改变链内的处理者或调整处理者的次序
- 增加新的处理者非常方便

**缺点**：
- 不保证请求一定会被处理
- 可能造成循环引用
- 链条过长可能会影响性能

## 总结

行为型设计模式解决了对象间通信的问题，使系统更加灵活和可维护。这些模式专注于对象之间如何协作和分配职责，确保高内聚低耦合的系统设计。

在实际应用中，通常会根据具体需求组合使用多种设计模式：
- 策略模式和命令模式常结合使用，前者封装算法，后者封装请求
- 观察者模式和责任链模式都可以用于事件处理系统，但方式不同
- 迭代器模式常与组合模式一起使用，便于遍历复杂结构

选择合适的行为型模式取决于系统的具体需求、通信方式以及对象间的关系。