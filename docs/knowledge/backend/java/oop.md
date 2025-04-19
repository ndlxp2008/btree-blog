# Java 面向对象编程

Java是一种完全面向对象的编程语言，面向对象编程(OOP)是Java的核心设计哲学。本文介绍Java面向对象编程的基本概念和实现方式。

## 面向对象编程核心概念

面向对象编程基于以下四个核心概念：

1. **封装**：隐藏对象内部实现，只暴露必要的接口
2. **继承**：允许子类继承父类的特性，实现代码重用
3. **多态**：允许一个接口被多个不同类实现，表现出不同行为
4. **抽象**：抽象出共性，忽略不必要的细节

## 类与对象

类是Java面向对象编程的基础，它定义了一组属性和方法，描述了对象的特性和行为。

### 类的定义

```java
public class Person {
    // 属性（成员变量）
    private String name;
    private int age;

    // 构造方法
    public Person() {
        // 默认构造函数
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 方法
    public void introduce() {
        System.out.println("Hello, my name is " + name + ", I am " + age + " years old.");
    }

    // getter和setter方法
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age > 0) {
            this.age = age;
        }
    }
}
```

### 对象的创建和使用

```java
public class Main {
    public static void main(String[] args) {
        // 创建对象
        Person person1 = new Person();
        person1.setName("Alice");
        person1.setAge(25);

        Person person2 = new Person("Bob", 30);

        // 调用方法
        person1.introduce(); // 输出: Hello, my name is Alice, I am 25 years old.
        person2.introduce(); // 输出: Hello, my name is Bob, I am 30 years old.
    }
}
```

## 封装

封装是将数据和操作数据的方法绑定在一起，隐藏对象的属性和实现细节，只对外提供公共访问方法。

### 封装的实现

1. 将属性声明为私有的（private）
2. 提供公共的getter和setter方法来访问和修改属性
3. 在setter方法中可以添加数据验证逻辑

```java
public class BankAccount {
    private String accountNumber;
    private double balance;

    // 仅提供getter，账号不可修改
    public String getAccountNumber() {
        return accountNumber;
    }

    public double getBalance() {
        return balance;
    }

    // 存款方法
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited: " + amount);
        } else {
            System.out.println("Invalid deposit amount");
        }
    }

    // 取款方法
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrawn: " + amount);
        } else {
            System.out.println("Invalid withdrawal amount or insufficient balance");
        }
    }
}
```

## 继承

继承允许创建一个类（子类）继承另一个类（父类）的特性和行为，实现代码重用和建立类之间的层次关系。

### 继承的实现

```java
// 父类
public class Animal {
    protected String name;
    protected int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void eat() {
        System.out.println(name + " is eating");
    }

    public void sleep() {
        System.out.println(name + " is sleeping");
    }
}

// 子类
public class Dog extends Animal {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age); // 调用父类构造函数
        this.breed = breed;
    }

    // 新方法
    public void bark() {
        System.out.println(name + " is barking");
    }

    // 重写父类方法
    @Override
    public void eat() {
        System.out.println(name + " the " + breed + " is eating dog food");
    }
}
```

### 方法重写（Override）与方法重载（Overload）

- **方法重写**：子类提供了与父类方法相同签名的方法，用于改变父类方法的行为
- **方法重载**：同一个类中定义多个同名但参数列表不同的方法

```java
public class Calculator {
    // 方法重载示例
    public int add(int a, int b) {
        return a + b;
    }

    public double add(double a, double b) {
        return a + b;
    }

    public int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

## 多态

多态允许使用父类引用指向子类对象，根据引用对象的实际类型，在运行时调用相应的方法。

### 多态的实现

```java
public class AnimalTest {
    public static void main(String[] args) {
        // 父类引用指向子类对象
        Animal animal1 = new Dog("Max", 3, "Golden Retriever");
        Animal animal2 = new Cat("Lucy", 2);

        // 运行时多态
        animal1.eat(); // 调用Dog类的eat方法
        animal2.eat(); // 调用Cat类的eat方法

        // 通过方法参数实现多态
        feedAnimal(animal1);
        feedAnimal(animal2);
    }

    public static void feedAnimal(Animal animal) {
        System.out.println("Feeding the animal:");
        animal.eat();
    }
}

class Cat extends Animal {
    public Cat(String name, int age) {
        super(name, age);
    }

    @Override
    public void eat() {
        System.out.println(name + " the cat is eating fish");
    }

    public void meow() {
        System.out.println(name + " is meowing");
    }
}
```

## 抽象类和接口

### 抽象类

抽象类是不能被实例化的类，用于定义子类的通用特性。抽象类可以包含抽象方法（没有实现的方法）和普通方法。

```java
// 抽象类
public abstract class Shape {
    // 抽象方法
    public abstract double calculateArea();

    // 普通方法
    public void display() {
        System.out.println("This is a shape");
    }
}

// 具体子类
public class Circle extends Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

public class Rectangle extends Shape {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public double calculateArea() {
        return width * height;
    }
}
```

### 接口

接口是一种完全抽象的类型，只包含抽象方法和常量。Java 8引入了默认方法和静态方法，允许接口包含方法的实现。

```java
// 接口定义
public interface Drawable {
    // 常量
    double PI = 3.14159;

    // 抽象方法
    void draw();

    // Java 8默认方法
    default void display() {
        System.out.println("Displaying object");
    }

    // Java 8静态方法
    static void info() {
        System.out.println("Drawable interface");
    }
}

// 实现接口
public class Circle implements Drawable {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public void draw() {
        System.out.println("Drawing circle with radius: " + radius);
    }
}
```

### 接口与抽象类的区别

1. 多重实现：类可以实现多个接口，但只能继承一个抽象类
2. 默认实现：抽象类可以为部分方法提供实现，接口在Java 8之前不能有方法实现
3. 访问修饰符：接口成员默认为public，抽象类成员可以有多种访问修饰符
4. 成员变量：接口只能有常量，抽象类可以有非静态、非常量成员变量

## 包和访问修饰符

### 包（Package）

包是组织类和接口的方式，提供了命名空间分离。

```java
// 声明包
package com.example.project;

// 导入其他包中的类
import java.util.ArrayList;
import java.util.List;

public class Example {
    // 类实现
}
```

### 访问修饰符

Java提供了四种访问修饰符，控制对类、属性和方法的访问：

| 修饰符 | 同一类中 | 同一包中 | 子类中 | 任何地方 |
|------|---------|---------|---------|---------|
| private | Yes | No | No | No |
| default (无修饰符) | Yes | Yes | No | No |
| protected | Yes | Yes | Yes | No |
| public | Yes | Yes | Yes | Yes |

## 内部类

内部类是定义在另一个类内部的类。Java支持四种内部类：

1. **成员内部类**：定义在类的成员位置，可以访问外部类的所有成员
2. **静态内部类**：使用static修饰的内部类，不依赖外部类实例
3. **局部内部类**：定义在方法或代码块内部
4. **匿名内部类**：没有名称的内部类，常用于接口和抽象类的实现

```java
public class OuterClass {
    private int data = 10;

    // 成员内部类
    public class InnerClass {
        public void print() {
            System.out.println("Data from outer class: " + data);
        }
    }

    // 静态内部类
    public static class StaticInnerClass {
        public void print() {
            System.out.println("Static inner class");
            // 不能直接访问外部类的非静态成员
        }
    }

    public void method() {
        // 局部内部类
        class LocalInnerClass {
            public void print() {
                System.out.println("Local inner class");
            }
        }

        LocalInnerClass lic = new LocalInnerClass();
        lic.print();

        // 匿名内部类
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("Anonymous inner class");
            }
        };
        runnable.run();
    }
}

// 使用内部类
public class Main {
    public static void main(String[] args) {
        OuterClass outer = new OuterClass();

        // 创建成员内部类实例
        OuterClass.InnerClass inner = outer.new InnerClass();
        inner.print();

        // 创建静态内部类实例
        OuterClass.StaticInnerClass staticInner = new OuterClass.StaticInnerClass();
        staticInner.print();

        // 调用包含局部内部类和匿名内部类的方法
        outer.method();
    }
}
```

## 总结

Java的面向对象编程是构建高质量、可维护和可扩展应用程序的基础。通过封装、继承、多态和抽象等概念，开发者可以设计出结构清晰、易于理解的代码。深入理解这些核心概念对于掌握Java语言至关重要。

面向对象编程不仅是一种编程方法，更是一种思维方式，帮助我们以更接近现实世界的方式来理解和解决问题。