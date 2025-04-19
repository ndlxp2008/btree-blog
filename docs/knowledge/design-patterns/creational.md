# 创建型设计模式

创建型设计模式关注对象的创建机制，试图将对象的创建与使用分离。这类模式通过隐藏对象创建的具体逻辑，使系统更加灵活，创建对象的过程和对象的具体类型解耦。

## 单例模式 (Singleton)

### 意图

确保一个类只有一个实例，并提供一个全局访问点。

### 应用场景

- 需要严格控制全局资源（如配置管理器、线程池、缓存、日志对象）
- 需要协调系统中的行为时
- 需要实例化一个开销大的对象时

### 结构

```
+----------------+
| Singleton      |
+----------------+
| -instance      |
+----------------+
| +getInstance() |
+----------------+
```

### 实现方式

#### 懒汉式（非线程安全）

```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

#### 饿汉式（线程安全）

```java
public class Singleton {
    private static final Singleton instance = new Singleton();

    private Singleton() {}

    public static Singleton getInstance() {
        return instance;
    }
}
```

#### 双重检查锁（DCL，线程安全）

```java
public class Singleton {
    private static volatile Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

#### 静态内部类（线程安全）

```java
public class Singleton {
    private Singleton() {}

    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

#### 枚举方式（线程安全）

```java
public enum Singleton {
    INSTANCE;

    public void doSomething() {
        // 业务方法
    }
}
```

### 优缺点

**优点**：
- 提供对唯一实例的受控访问
- 可以严格控制客户怎样以及何时访问它
- 节约系统资源，避免对象频繁创建与销毁

**缺点**：
- 对OOP原则有一定违背，特别是单一职责原则
- 多线程环境下的实现需要特殊处理
- 单例类的测试可能比较困难

## 工厂方法模式 (Factory Method)

### 意图

定义一个创建对象的接口，让子类决定实例化哪个类。工厂方法使一个类的实例化延迟到其子类。

### 应用场景

- 当一个类不知道它所必须创建的对象的类时
- 当一个类希望由其子类来指定它所创建的对象时
- 当创建对象的过程需要复用时

### 结构

```
+-------------+       +-------------+
| Creator     |<------|ConcreteCreator |
+-------------+       +-------------+
| +factoryMethod() |  | +factoryMethod() |
| +anOperation()   |  +-------------+
+-------------+            |
      ^                    |
      |                    v
+-------------+       +-------------+
| Product     |<------|ConcreteProduct |
+-------------+       +-------------+
```

### 实现示例

```java
// 产品接口
interface Product {
    void operation();
}

// 具体产品A
class ConcreteProductA implements Product {
    @Override
    public void operation() {
        System.out.println("ConcreteProductA operation");
    }
}

// 具体产品B
class ConcreteProductB implements Product {
    @Override
    public void operation() {
        System.out.println("ConcreteProductB operation");
    }
}

// 创建者抽象类
abstract class Creator {
    // 工厂方法
    public abstract Product factoryMethod();

    // 使用产品的方法
    public void anOperation() {
        Product product = factoryMethod();
        product.operation();
    }
}

// 具体创建者A
class ConcreteCreatorA extends Creator {
    @Override
    public Product factoryMethod() {
        return new ConcreteProductA();
    }
}

// 具体创建者B
class ConcreteCreatorB extends Creator {
    @Override
    public Product factoryMethod() {
        return new ConcreteProductB();
    }
}

// 客户端代码
public class Client {
    public static void main(String[] args) {
        Creator creator = new ConcreteCreatorA();
        creator.anOperation();  // 输出: ConcreteProductA operation

        creator = new ConcreteCreatorB();
        creator.anOperation();  // 输出: ConcreteProductB operation
    }
}
```

### 优缺点

**优点**：
- 避免创建者和具体产品之间的紧密耦合
- 符合单一职责原则，实现了创建和使用的分离
- 符合开闭原则，可以引入新的产品类型而无需修改现有代码

**缺点**：
- 可能导致类的数量增加，每一个产品都需要一个创建者子类
- 客户端需要知道如何选择合适的创建者类

## 抽象工厂模式 (Abstract Factory)

### 意图

提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。

### 应用场景

- 一个系统要独立于它的产品的创建、组合和表示
- 一个系统要由多个产品系列中的一个来配置
- 当你需要强调一系列相关的产品对象的设计以便进行联合使用时

### 结构

```
+----------------+       +----------------+
| AbstractFactory |<------|ConcreteFactory1 |
+----------------+       +----------------+
| +createProductA() |    | +createProductA() |
| +createProductB() |    | +createProductB() |
+----------------+       +----------------+
        ^                        |
        |                        |
        |                        v
+----------------+       +----------------+
| ConcreteFactory2 |      | ProductA1     |
+----------------+       +----------------+
| +createProductA() |
| +createProductB() |    +----------------+
+----------------+       | ProductB1     |
        |                +----------------+
        |
        v                +----------------+
+----------------+       | ProductA2     |
| AbstractProductA |<-----|+----------------+
+----------------+
                         +----------------+
+----------------+       | ProductB2     |
| AbstractProductB |<-----|+----------------+
+----------------+
```

### 实现示例

```java
// 抽象产品A
interface AbstractProductA {
    void operationA();
}

// 抽象产品B
interface AbstractProductB {
    void operationB();
}

// 具体产品A1
class ConcreteProductA1 implements AbstractProductA {
    @Override
    public void operationA() {
        System.out.println("ConcreteProductA1 operationA");
    }
}

// 具体产品A2
class ConcreteProductA2 implements AbstractProductA {
    @Override
    public void operationA() {
        System.out.println("ConcreteProductA2 operationA");
    }
}

// 具体产品B1
class ConcreteProductB1 implements AbstractProductB {
    @Override
    public void operationB() {
        System.out.println("ConcreteProductB1 operationB");
    }
}

// 具体产品B2
class ConcreteProductB2 implements AbstractProductB {
    @Override
    public void operationB() {
        System.out.println("ConcreteProductB2 operationB");
    }
}

// 抽象工厂
interface AbstractFactory {
    AbstractProductA createProductA();
    AbstractProductB createProductB();
}

// 具体工厂1：创建产品族1
class ConcreteFactory1 implements AbstractFactory {
    @Override
    public AbstractProductA createProductA() {
        return new ConcreteProductA1();
    }

    @Override
    public AbstractProductB createProductB() {
        return new ConcreteProductB1();
    }
}

// 具体工厂2：创建产品族2
class ConcreteFactory2 implements AbstractFactory {
    @Override
    public AbstractProductA createProductA() {
        return new ConcreteProductA2();
    }

    @Override
    public AbstractProductB createProductB() {
        return new ConcreteProductB2();
    }
}

// 客户端代码
public class Client {
    public static void main(String[] args) {
        // 使用第一个工厂
        AbstractFactory factory1 = new ConcreteFactory1();
        AbstractProductA productA1 = factory1.createProductA();
        AbstractProductB productB1 = factory1.createProductB();
        productA1.operationA();  // 输出: ConcreteProductA1 operationA
        productB1.operationB();  // 输出: ConcreteProductB1 operationB

        // 使用第二个工厂
        AbstractFactory factory2 = new ConcreteFactory2();
        AbstractProductA productA2 = factory2.createProductA();
        AbstractProductB productB2 = factory2.createProductB();
        productA2.operationA();  // 输出: ConcreteProductA2 operationA
        productB2.operationB();  // 输出: ConcreteProductB2 operationB
    }
}
```

### 优缺点

**优点**：
- 分离了具体的类，客户端与特定实现解耦
- 易于交换产品系列，只需切换具体工厂
- 保证了产品之间的一致性，同一工厂创建的产品必然相互兼容

**缺点**：
- 难以支持新种类的产品，需要修改抽象工厂和所有具体工厂
- 系统会变得更加复杂，引入了多个新的接口和类

## 建造者模式 (Builder)

### 意图

将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

### 应用场景

- 当创建复杂对象的算法应该独立于该对象的组成部分以及它们的装配方式时
- 当构造过程必须允许被构造的对象有不同的表示时
- 当需要构建的对象具有复杂的内部结构，且必须一步步完成创建时

### 结构

```
+------------+        +--------------+
| Director   |------->| Builder      |
+------------+        +--------------+
| +construct() |      | +buildPartA() |
+------------+        | +buildPartB() |
                      | +getResult()  |
                      +--------------+
                            ^
                            |
                  +-----------------+
                  | ConcreteBuilder |
                  +-----------------+
                  | +buildPartA()   |
                  | +buildPartB()   |
                  | +getResult()    |
                  +-----------------+
                            |
                            v
                      +------------+
                      | Product    |
                      +------------+
```

### 实现示例

```java
// 产品类
class Product {
    private String partA;
    private String partB;
    private String partC;

    public void setPartA(String partA) {
        this.partA = partA;
    }

    public void setPartB(String partB) {
        this.partB = partB;
    }

    public void setPartC(String partC) {
        this.partC = partC;
    }

    @Override
    public String toString() {
        return "Product{" +
                "partA='" + partA + '\'' +
                ", partB='" + partB + '\'' +
                ", partC='" + partC + '\'' +
                '}';
    }
}

// 抽象建造者
interface Builder {
    void buildPartA();
    void buildPartB();
    void buildPartC();
    Product getResult();
}

// 具体建造者
class ConcreteBuilder implements Builder {
    private Product product = new Product();

    @Override
    public void buildPartA() {
        product.setPartA("Part A");
    }

    @Override
    public void buildPartB() {
        product.setPartB("Part B");
    }

    @Override
    public void buildPartC() {
        product.setPartC("Part C");
    }

    @Override
    public Product getResult() {
        return product;
    }
}

// 指导者
class Director {
    private Builder builder;

    public Director(Builder builder) {
        this.builder = builder;
    }

    public void construct() {
        builder.buildPartA();
        builder.buildPartB();
        builder.buildPartC();
    }
}

// 客户端代码
public class Client {
    public static void main(String[] args) {
        Builder builder = new ConcreteBuilder();
        Director director = new Director(builder);
        director.construct();
        Product product = builder.getResult();
        System.out.println(product);  // 输出: Product{partA='Part A', partB='Part B', partC='Part C'}
    }
}
```

### 流行的变体：链式调用的Builder

```java
// 使用链式调用的Builder模式
class Person {
    private final String name;
    private final int age;
    private final String address;
    private final String phone;

    private Person(Builder builder) {
        this.name = builder.name;
        this.age = builder.age;
        this.address = builder.address;
        this.phone = builder.phone;
    }

    public static class Builder {
        private final String name;
        private int age;
        private String address;
        private String phone;

        public Builder(String name) {
            this.name = name;
        }

        public Builder age(int age) {
            this.age = age;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public Person build() {
            return new Person(this);
        }
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}

// 客户端代码
public class Client {
    public static void main(String[] args) {
        Person person = new Person.Builder("John")
                .age(30)
                .address("123 Street")
                .phone("123-456-7890")
                .build();
        System.out.println(person);
        // 输出: Person{name='John', age=30, address='123 Street', phone='123-456-7890'}
    }
}
```

### 优缺点

**优点**：
- 允许改变一个产品的内部表示
- 将构造代码和表示代码分开
- 提供对构造过程的细粒度控制
- 可以更好地控制构建过程，产品的各个部分可以灵活被创建

**缺点**：
- 要为每一个不同的产品创建一个单独的构建器
- 代码量会增加，尤其是当产品只有很少的差异时

## 原型模式 (Prototype)

### 意图

使用原型实例指定创建对象的种类，通过复制这些原型创建新的对象。

### 应用场景

- 当要实例化的类是在运行时刻指定时
- 当一个类的实例只能有几个不同状态的组合中的一种时
- 当创建一个对象的过程很昂贵或复杂时

### 结构

```
+------------+      +-----------------+
| Prototype  |<-----|ConcretePrototype|
+------------+      +-----------------+
| +clone()   |      | +clone()        |
+------------+      +-----------------+
```

### 实现示例

```java
// 原型接口
interface Prototype extends Cloneable {
    Prototype clone();
}

// 具体原型
class ConcretePrototype implements Prototype {
    private String field;

    public ConcretePrototype(String field) {
        this.field = field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getField() {
        return field;
    }

    @Override
    public Prototype clone() {
        try {
            return (Prototype) super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public String toString() {
        return "ConcretePrototype{" +
                "field='" + field + '\'' +
                '}';
    }
}

// 客户端代码
public class Client {
    public static void main(String[] args) {
        ConcretePrototype prototype = new ConcretePrototype("prototype");
        System.out.println("Original: " + prototype);

        ConcretePrototype clone = (ConcretePrototype) prototype.clone();
        System.out.println("Clone: " + clone);

        clone.setField("modified clone");
        System.out.println("Modified Clone: " + clone);
        System.out.println("Original after Clone Modification: " + prototype);

        // 输出:
        // Original: ConcretePrototype{field='prototype'}
        // Clone: ConcretePrototype{field='prototype'}
        // Modified Clone: ConcretePrototype{field='modified clone'}
        // Original after Clone Modification: ConcretePrototype{field='prototype'}
    }
}
```

### 深拷贝与浅拷贝

```java
// 深拷贝示例
class Address implements Cloneable {
    private String street;

    public Address(String street) {
        this.street = street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getStreet() {
        return street;
    }

    @Override
    protected Address clone() {
        try {
            return (Address) super.clone();
        } catch (CloneNotSupportedException e) {
            return new Address(this.street);
        }
    }

    @Override
    public String toString() {
        return "Address{" +
                "street='" + street + '\'' +
                '}';
    }
}

class Person implements Cloneable {
    private String name;
    private Address address;

    public Person(String name, Address address) {
        this.name = name;
        this.address = address;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Address getAddress() {
        return address;
    }

    // 浅拷贝
    public Person shallowClone() {
        try {
            return (Person) super.clone();
        } catch (CloneNotSupportedException e) {
            return new Person(this.name, this.address);
        }
    }

    // 深拷贝
    public Person deepClone() {
        try {
            Person clone = (Person) super.clone();
            clone.address = this.address.clone();
            return clone;
        } catch (CloneNotSupportedException e) {
            return new Person(this.name, new Address(this.address.getStreet()));
        }
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", address=" + address +
                '}';
    }
}

// 客户端代码
public class Client {
    public static void main(String[] args) {
        Address address = new Address("123 Street");
        Person original = new Person("John", address);

        System.out.println("Original: " + original);

        // 浅拷贝测试
        Person shallowCopy = original.shallowClone();
        shallowCopy.getAddress().setStreet("456 Avenue");

        System.out.println("After Shallow Copy Modification:");
        System.out.println("Original: " + original);
        System.out.println("Shallow Copy: " + shallowCopy);

        // 深拷贝测试
        address = new Address("789 Boulevard");
        original = new Person("Jane", address);
        Person deepCopy = original.deepClone();
        deepCopy.getAddress().setStreet("101 Road");

        System.out.println("\nAfter Deep Copy Modification:");
        System.out.println("Original: " + original);
        System.out.println("Deep Copy: " + deepCopy);

        // 输出:
        // Original: Person{name='John', address=Address{street='123 Street'}}
        // After Shallow Copy Modification:
        // Original: Person{name='John', address=Address{street='456 Avenue'}}
        // Shallow Copy: Person{name='John', address=Address{street='456 Avenue'}}
        //
        // After Deep Copy Modification:
        // Original: Person{name='Jane', address=Address{street='789 Boulevard'}}
        // Deep Copy: Person{name='Jane', address=Address{street='101 Road'}}
    }
}
```

### 优缺点

**优点**：
- 隐藏了创建对象的复杂性
- 允许动态增加或减少产品类
- 允许复制对象，而不是使用new操作符重新创建对象
- 可以在运行时配置具体的类
- 减少子类的构造

**缺点**：
- 每个原型子类都必须实现克隆方法
- 对于包含循环引用的复杂对象，克隆可能非常困难
- 深拷贝和浅拷贝可能会导致潜在问题

## 总结

创建型设计模式提供了不同的对象创建机制，使系统独立于对象的创建、组合和表示方式。这些模式有助于使系统松耦合、更具灵活性和可扩展性。

- **单例模式**：确保一个类只有一个实例，并提供全局访问点
- **工厂方法模式**：定义一个创建对象的接口，让子类决定实例化哪个类
- **抽象工厂模式**：提供一个创建一系列相关对象的接口，而无需指定它们的具体类
- **建造者模式**：将复杂对象的构建与其表示分离，使同样的构建过程可以创建不同的表示
- **原型模式**：通过复制现有的实例来创建新的实例，而不是创建新的实例

在选择合适的创建型模式时，需要考虑实际问题的特点、对灵活性和复杂性的需求，以及系统的扩展方向。