# 结构型设计模式

结构型设计模式关注类和对象的组合，通过组合接口和定义组合对象获得新功能的方式。这类模式着重于如何组合类和对象以形成更大的结构，同时保持这些结构的灵活性和高效性。

## 适配器模式 (Adapter Pattern)

### 意图
将一个类的接口转换成客户端期望的另一个接口，使得原本不兼容的类可以一起工作。

### 应用场景
- 需要使用现有的类，但其接口与需求不匹配时
- 需要创建一个可重用的类，该类可以与不相关或不可预见的类协作
- 需要使用多个现有子类，但为每个子类单独进行子类化来适配接口不现实时

### 结构
![适配器模式结构](https://example.com/adapter-pattern.png)

- **目标接口 (Target)**: 客户端所期望的接口
- **适配器 (Adapter)**: 实现目标接口并包含对被适配者的引用
- **被适配者 (Adaptee)**: 需要被适配的类或接口

### 实现示例

```java
// 目标接口
interface MediaPlayer {
    void play(String audioType, String fileName);
}

// 被适配者接口
interface AdvancedMediaPlayer {
    void playVlc(String fileName);
    void playMp4(String fileName);
}

// 具体被适配者
class VlcPlayer implements AdvancedMediaPlayer {
    @Override
    public void playVlc(String fileName) {
        System.out.println("Playing vlc file: " + fileName);
    }

    @Override
    public void playMp4(String fileName) {
        // 什么都不做
    }
}

class Mp4Player implements AdvancedMediaPlayer {
    @Override
    public void playVlc(String fileName) {
        // 什么都不做
    }

    @Override
    public void playMp4(String fileName) {
        System.out.println("Playing mp4 file: " + fileName);
    }
}

// 适配器
class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedMusicPlayer;

    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMusicPlayer = new VlcPlayer();
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedMusicPlayer = new Mp4Player();
        }
    }

    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMusicPlayer.playVlc(fileName);
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedMusicPlayer.playMp4(fileName);
        }
    }
}

// 客户端
class AudioPlayer implements MediaPlayer {
    private MediaAdapter mediaAdapter;

    @Override
    public void play(String audioType, String fileName) {
        // 内置支持播放mp3格式
        if (audioType.equalsIgnoreCase("mp3")) {
            System.out.println("Playing mp3 file: " + fileName);
        }
        // 通过适配器支持播放其他格式
        else if (audioType.equalsIgnoreCase("vlc") || audioType.equalsIgnoreCase("mp4")) {
            mediaAdapter = new MediaAdapter(audioType);
            mediaAdapter.play(audioType, fileName);
        } else {
            System.out.println("Invalid media type: " + audioType);
        }
    }
}
```

### 优缺点
**优点**：
- 将目标类和被适配者类解耦
- 增加了类的透明性和复用性
- 灵活性和扩展性都很好

**缺点**：
- 过多使用适配器会使系统变得凌乱，不易整体把握
- 增加了系统的复杂性

## 桥接模式 (Bridge Pattern)

### 意图
将抽象部分与实现部分分离，使它们都可以独立地变化。

### 应用场景
- 希望避免抽象与实现的永久绑定
- 抽象和实现都应该通过子类进行扩展
- 需要在运行时切换不同的实现

### 结构
- **抽象部分 (Abstraction)**: 定义抽象接口并维护对实现的引用
- **实现部分 (Implementor)**: 定义实现类的接口
- **精确抽象 (RefinedAbstraction)**: 扩展抽象部分的接口
- **具体实现 (ConcreteImplementor)**: 实现接口并定义具体实现

### 实现示例

```java
// 实现部分的接口
interface DrawAPI {
    void drawCircle(int radius, int x, int y);
}

// 具体实现A
class RedCircle implements DrawAPI {
    @Override
    public void drawCircle(int radius, int x, int y) {
        System.out.println("Drawing Circle[ color: red, radius: " + radius + ", x: " + x + ", y: " + y + "]");
    }
}

// 具体实现B
class GreenCircle implements DrawAPI {
    @Override
    public void drawCircle(int radius, int x, int y) {
        System.out.println("Drawing Circle[ color: green, radius: " + radius + ", x: " + x + ", y: " + y + "]");
    }
}

// 抽象部分
abstract class Shape {
    protected DrawAPI drawAPI;

    protected Shape(DrawAPI drawAPI) {
        this.drawAPI = drawAPI;
    }

    public abstract void draw();
}

// 精确抽象
class Circle extends Shape {
    private int x, y, radius;

    public Circle(int x, int y, int radius, DrawAPI drawAPI) {
        super(drawAPI);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    @Override
    public void draw() {
        drawAPI.drawCircle(radius, x, y);
    }
}
```

### 优缺点
**优点**：
- 分离抽象接口及其实现部分
- 提高系统的可扩展性
- 实现细节对客户透明

**缺点**：
- 增加了系统的理解与设计难度
- 需要正确识别系统中两个独立变化的维度

## 组合模式 (Composite Pattern)

### 意图
将对象组合成树形结构以表示"部分-整体"的层次结构，使用户对单个对象和组合对象的使用具有一致性。

### 应用场景
- 表示对象的部分-整体层次结构
- 希望用户忽略组合对象与单个对象的不同，用户统一地使用组合结构中的所有对象

### 结构
- **组件 (Component)**: 为组合中的对象声明接口
- **叶子 (Leaf)**: 表示组合中的叶子节点，没有子节点
- **组合 (Composite)**: 有子部件的组件对象，存储子部件并实现与子部件相关的操作

### 实现示例

```java
// 组件
abstract class Employee {
    protected String name;
    protected String dept;
    protected int salary;

    public Employee(String name, String dept, int salary) {
        this.name = name;
        this.dept = dept;
        this.salary = salary;
    }

    public abstract void add(Employee e);
    public abstract void remove(Employee e);
    public abstract void getSubordinates();

    public String toString() {
        return ("Employee: [ Name: " + name + ", dept: " + dept + ", salary: " + salary + " ]");
    }
}

// 叶子
class Developer extends Employee {
    public Developer(String name, String dept, int salary) {
        super(name, dept, salary);
    }

    @Override
    public void add(Employee e) {
        // 叶子节点不能添加子节点
        System.out.println("Cannot add to a Developer");
    }

    @Override
    public void remove(Employee e) {
        // 叶子节点不能删除子节点
        System.out.println("Cannot remove from a Developer");
    }

    @Override
    public void getSubordinates() {
        // 叶子节点没有子节点
        System.out.println("No subordinates");
    }
}

// 组合
class Manager extends Employee {
    private List<Employee> subordinates = new ArrayList<>();

    public Manager(String name, String dept, int salary) {
        super(name, dept, salary);
    }

    @Override
    public void add(Employee e) {
        subordinates.add(e);
    }

    @Override
    public void remove(Employee e) {
        subordinates.remove(e);
    }

    @Override
    public void getSubordinates() {
        System.out.println(subordinates);
    }
}
```

### 优缺点
**优点**：
- 定义了包含基本对象和组合对象的类层次结构
- 简化客户端代码，客户端可以统一处理单个对象和组合对象
- 容易增加新类型的组件

**缺点**：
- 在特定情况下，很难限制组件的类型

## 装饰器模式 (Decorator Pattern)

### 意图
动态地给一个对象添加一些额外的职责，就增加功能来说，装饰器模式比生成子类更为灵活。

### 应用场景
- 需要在不影响其他对象的情况下，以动态、透明的方式给单个对象添加职责
- 当不能采用继承的方式对系统进行扩充或者采用继承不利于系统扩展和维护时

### 结构
- **组件 (Component)**: 定义可以动态添加职责的对象的接口
- **具体组件 (ConcreteComponent)**: 定义一个要被装饰的对象
- **装饰器 (Decorator)**: 维持一个指向组件对象的引用，并定义一个与组件接口一致的接口
- **具体装饰器 (ConcreteDecorator)**: 向组件添加职责

### 实现示例

```java
// 组件接口
interface Coffee {
    String getDescription();
    double getCost();
}

// 具体组件
class SimpleCoffee implements Coffee {
    @Override
    public String getDescription() {
        return "Simple coffee";
    }

    @Override
    public double getCost() {
        return 1.0;
    }
}

// 装饰器抽象类
abstract class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;

    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }

    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription();
    }

    @Override
    public double getCost() {
        return decoratedCoffee.getCost();
    }
}

// 具体装饰器A
class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }

    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", milk";
    }

    @Override
    public double getCost() {
        return decoratedCoffee.getCost() + 0.5;
    }
}

// 具体装饰器B
class WhipDecorator extends CoffeeDecorator {
    public WhipDecorator(Coffee coffee) {
        super(coffee);
    }

    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", whip";
    }

    @Override
    public double getCost() {
        return decoratedCoffee.getCost() + 0.7;
    }
}

// 客户端
public class DecoratorDemo {
    public static void main(String[] args) {
        // 普通咖啡
        Coffee coffee = new SimpleCoffee();
        System.out.println(coffee.getDescription() + ": $" + coffee.getCost());

        // 加牛奶的咖啡
        Coffee milkCoffee = new MilkDecorator(new SimpleCoffee());
        System.out.println(milkCoffee.getDescription() + ": $" + milkCoffee.getCost());

        // 加奶油和牛奶的咖啡
        Coffee whipMilkCoffee = new WhipDecorator(new MilkDecorator(new SimpleCoffee()));
        System.out.println(whipMilkCoffee.getDescription() + ": $" + whipMilkCoffee.getCost());
    }
}
```

### 优缺点
**优点**：
- 比继承更灵活
- 允许动态添加责任
- 避免了在层次结构高层的类有太多的特性
- 可以通过组合不同的装饰器创建多种行为

**缺点**：
- 会产生很多小对象
- 装饰器模式比直接继承复杂

## 外观模式 (Facade Pattern)

### 意图
为子系统中的一组接口提供一个一致的界面，使得子系统更加容易使用。

### 应用场景
- 为复杂的子系统提供一个简单的接口
- 需要将系统分层，可以使用外观模式定义子系统中每层的入口点

### 结构
- **外观 (Facade)**: 知道哪些子系统负责处理请求，将客户的请求代理给适当的子系统对象
- **子系统 (Subsystem)**: 实现子系统功能，处理外观对象指派的任务

### 实现示例

```java
// 子系统1
class DVDPlayer {
    public void on() {
        System.out.println("DVD Player is on");
    }

    public void off() {
        System.out.println("DVD Player is off");
    }

    public void play(String movie) {
        System.out.println("Playing " + movie);
    }
}

// 子系统2
class Amplifier {
    public void on() {
        System.out.println("Amplifier is on");
    }

    public void off() {
        System.out.println("Amplifier is off");
    }

    public void setVolume(int level) {
        System.out.println("Setting volume to " + level);
    }
}

// 子系统3
class Projector {
    public void on() {
        System.out.println("Projector is on");
    }

    public void off() {
        System.out.println("Projector is off");
    }

    public void wideScreenMode() {
        System.out.println("Projector in widescreen mode");
    }
}

// 外观
class HomeTheaterFacade {
    private DVDPlayer dvd;
    private Amplifier amp;
    private Projector projector;

    public HomeTheaterFacade(DVDPlayer dvd, Amplifier amp, Projector projector) {
        this.dvd = dvd;
        this.amp = amp;
        this.projector = projector;
    }

    // 简化的接口 - 看电影
    public void watchMovie(String movie) {
        System.out.println("Get ready to watch a movie...");
        projector.on();
        projector.wideScreenMode();
        amp.on();
        amp.setVolume(5);
        dvd.on();
        dvd.play(movie);
    }

    // 简化的接口 - 结束观影
    public void endMovie() {
        System.out.println("Shutting down movie theater...");
        dvd.off();
        amp.off();
        projector.off();
    }
}
```

### 优缺点
**优点**：
- 对客户屏蔽子系统组件，减少客户处理的对象数目
- 实现子系统与客户之间的松耦合
- 提供一个简单的接口

**缺点**：
- 不符合开闭原则，如果要改变子系统的行为需要修改外观类
- 不能很好地限制客户使用子系统，如果对访问子系统有严格的控制要求则不适合

## 享元模式 (Flyweight Pattern)

### 意图
运用共享技术有效地支持大量细粒度的对象。

### 应用场景
- 系统中有大量相似对象，造成内存开销大
- 对象的大部分状态可以外部化，可以将这些外部状态传入对象中

### 结构
- **享元接口 (Flyweight)**: 描述共享接口
- **具体享元 (ConcreteFlyweight)**: 具体享元实现
- **享元工厂 (FlyweightFactory)**: 创建并管理享元对象

### 实现示例

```java
// 享元接口
interface Shape {
    void draw();
}

// 具体享元
class Circle implements Shape {
    private String color;
    private int x;
    private int y;
    private int radius;

    public Circle(String color) {
        this.color = color;
    }

    public void setX(int x) {
        this.x = x;
    }

    public void setY(int y) {
        this.y = y;
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    @Override
    public void draw() {
        System.out.println("Circle: Draw() [Color: " + color + ", x: " + x + ", y: " + y + ", radius: " + radius + "]");
    }
}

// 享元工厂
class ShapeFactory {
    private static final HashMap<String, Shape> circleMap = new HashMap<>();

    public static Shape getCircle(String color) {
        Circle circle = (Circle)circleMap.get(color);

        if (circle == null) {
            circle = new Circle(color);
            circleMap.put(color, circle);
            System.out.println("Creating circle of color: " + color);
        }
        return circle;
    }
}
```

### 优缺点
**优点**：
- 大大减少对象的创建，降低系统的内存，使效率提高
- 外部状态相对独立，不影响内部状态

**缺点**：
- 提高了系统的复杂度
- 需要区分内部状态和外部状态，使程序的逻辑复杂化

## 代理模式 (Proxy Pattern)

### 意图
为其他对象提供一种代理以控制对这个对象的访问。

### 应用场景
- 远程代理：为远程对象提供代表
- 虚拟代理：根据需要创建开销很大的对象
- 保护代理：控制对原始对象的访问，用于对象应该有不同访问权限的时候
- 智能引用：在访问对象时执行一些附加操作

### 结构
- **抽象主题 (Subject)**: 定义RealSubject和Proxy的共用接口
- **真实主题 (RealSubject)**: 定义Proxy所代表的实际对象
- **代理 (Proxy)**: 保存一个引用使得代理可以访问实体，并提供一个与Subject接口相同的接口

### 实现示例

```java
// 抽象主题
interface Image {
    void display();
}

// 真实主题
class RealImage implements Image {
    private String fileName;

    public RealImage(String fileName) {
        this.fileName = fileName;
        loadFromDisk(fileName);
    }

    private void loadFromDisk(String fileName) {
        System.out.println("Loading " + fileName);
    }

    @Override
    public void display() {
        System.out.println("Displaying " + fileName);
    }
}

// 代理
class ProxyImage implements Image {
    private RealImage realImage;
    private String fileName;

    public ProxyImage(String fileName) {
        this.fileName = fileName;
    }

    @Override
    public void display() {
        if (realImage == null) {
            realImage = new RealImage(fileName);
        }
        realImage.display();
    }
}

// 客户端
public class ProxyDemo {
    public static void main(String[] args) {
        Image image = new ProxyImage("test_10mb.jpg");

        // 图像将从磁盘加载
        image.display();
        System.out.println("");

        // 图像不需要从磁盘加载
        image.display();
    }
}
```

### 优缺点
**优点**：
- 代理模式能将客户端与目标对象分离
- 一定程度上降低了系统的耦合度
- 可以起到保护目标对象的作用
- 可以增强目标对象的功能

**缺点**：
- 会造成系统设计中类的数量增加
- 在客户端和目标对象之间增加了一个代理对象，会造成请求处理速度变慢

## 总结

结构型设计模式主要关注如何组合类和对象以形成更大的结构。这些模式有助于确保系统在需要变化时，结构的改变对其他部分的影响最小。选择适当的结构型模式可以使系统更加灵活、可复用，同时降低系统各部分之间的耦合度。

在实际应用中，结构型设计模式往往相互配合使用：
- 适配器可以与桥接模式结合，使系统在兼容旧接口的同时，将抽象与实现分离
- 组合模式常与装饰器模式一起使用，使单个对象和组合对象的处理保持一致性的同时，动态地为对象添加功能
- 外观模式可以与代理模式结合，既提供简化的接口，又能控制对子系统的访问

通过合理应用这些模式，可以创建出更加灵活、可维护且高效的软件系统。