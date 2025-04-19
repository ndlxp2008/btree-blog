# Java 基础语法

Java是一种广泛使用的面向对象编程语言，以其"一次编写，到处运行"（Write Once, Run Anywhere）的特性而闻名。本文将介绍Java的基础语法和核心概念。

## Java 程序结构

一个基本的Java程序结构如下：

```java
// 声明类
public class HelloWorld {
    // main方法 - 程序执行的入口
    public static void main(String[] args) {
        // 打印输出到控制台
        System.out.println("Hello, World!");
    }
}
```

## 基本语法规则

- Java 是**大小写敏感**的语言
- 类名首字母应该大写，遵循驼峰命名法（如`HelloWorld`）
- 方法名应该以小写字母开头，遵循驼峰命名法（如`calculateTotal`）
- 源文件名必须与公共类名相同，扩展名为`.java`
- 程序执行从`main`方法开始

## 数据类型

Java有两大类数据类型：

### 基本数据类型（8种）

| 数据类型 | 大小 | 默认值 | 范围 | 示例 |
|---------|------|--------|------|------|
| byte | 8位 | 0 | -128 到 127 | `byte b = 100;` |
| short | 16位 | 0 | -32,768 到 32,767 | `short s = 1000;` |
| int | 32位 | 0 | -2^31 到 2^31-1 | `int i = 10000;` |
| long | 64位 | 0L | -2^63 到 2^63-1 | `long l = 100000L;` |
| float | 32位 | 0.0f | IEEE 754 | `float f = 3.14f;` |
| double | 64位 | 0.0d | IEEE 754 | `double d = 3.14159;` |
| boolean | 1位 | false | true 或 false | `boolean flag = true;` |
| char | 16位 | '\u0000' | '\u0000' 到 '\uffff' | `char c = 'A';` |

### 引用数据类型

- **类**（Class）
- **接口**（Interface）
- **数组**（Array）

```java
// 类实例
String str = "Hello Java";

// 数组
int[] numbers = {1, 2, 3, 4, 5};

// 接口实现
List<String> list = new ArrayList<>();
```

## 变量

Java中的变量分为三种类型：

### 局部变量

```java
public void method() {
    // 局部变量 - 方法内部定义
    int count = 0;
    // 使用前必须初始化
    System.out.println(count);
}
```

### 实例变量（非静态字段）

```java
public class Person {
    // 实例变量 - 类内部但方法外部定义，每个对象有自己的副本
    String name;
    int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

### 类变量（静态字段）

```java
public class Constants {
    // 类变量 - 使用static关键字，所有对象共享同一个副本
    static final double PI = 3.14159;
    static int counter = 0;

    public void increment() {
        counter++; // 增加共享计数器
    }
}
```

## 修饰符

Java中的访问修饰符控制着类、变量、方法和构造方法的访问级别：

| 修饰符 | 当前类 | 同一包内 | 子类 | 其他包 |
|-------|-------|---------|------|-------|
| private | Y | N | N | N |
| default | Y | Y | N | N |
| protected | Y | Y | Y | N |
| public | Y | Y | Y | Y |

其他修饰符：

- **static**: 用于创建类方法和类变量
- **final**: 用于防止继承、方法重写或变量修改
- **abstract**: 用于创建抽象类和方法
- **synchronized**: 用于线程同步
- **volatile**: 用于指示变量可能被多个线程同时访问

## 运算符

Java支持多种运算符：

```java
// 算术运算符
int a = 10, b = 5;
int sum = a + b;      // 15
int diff = a - b;     // 5
int product = a * b;  // 50
int quotient = a / b; // 2
int remainder = a % b; // 0

// 关系运算符
boolean isEqual = (a == b);    // false
boolean notEqual = (a != b);   // true
boolean greater = (a > b);     // true
boolean less = (a < b);        // false

// 逻辑运算符
boolean andResult = (a > 0 && b > 0);  // true
boolean orResult = (a > 0 || b < 0);   // true
boolean notResult = !(a == b);        // true

// 位运算符
int bitwiseAnd = a & b;    // 0
int bitwiseOr = a | b;     // 15
int bitwiseXor = a ^ b;    // 15
int leftShift = a << 1;    // 20
int rightShift = a >> 1;   // 5

// 赋值运算符
int c = a;    // c = 10
c += b;       // c = 15
c -= b;       // c = 10
c *= b;       // c = 50
c /= b;       // c = 10
```

## 控制流语句

### 条件语句

```java
// if语句
int number = 10;
if (number > 0) {
    System.out.println("正数");
} else if (number < 0) {
    System.out.println("负数");
} else {
    System.out.println("零");
}

// switch语句
int day = 3;
switch (day) {
    case 1:
        System.out.println("星期一");
        break;
    case 2:
        System.out.println("星期二");
        break;
    case 3:
        System.out.println("星期三");
        break;
    // ...其他情况
    default:
        System.out.println("无效日期");
}
```

### 循环语句

```java
// for循环
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// while循环
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}

// do-while循环
i = 0;
do {
    System.out.println(i);
    i++;
} while (i < 5);

// for-each循环 (增强for循环)
int[] numbers = {1, 2, 3, 4, 5};
for (int num : numbers) {
    System.out.println(num);
}
```

### 分支控制

```java
// break语句 - 跳出循环
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break; // 当i=5时跳出循环
    }
    System.out.println(i);
}

// continue语句 - 跳过当前循环迭代
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue; // 跳过偶数
    }
    System.out.println(i); // 只打印奇数
}
```

## 方法

方法是执行特定任务的代码块：

```java
public class Calculator {
    // 带返回值的方法
    public int add(int a, int b) {
        return a + b;
    }

    // 无返回值的方法
    public void printSum(int a, int b) {
        System.out.println("Sum: " + (a + b));
    }

    // 静态方法
    public static int multiply(int a, int b) {
        return a * b;
    }

    // 可变参数方法
    public int sum(int... numbers) {
        int total = 0;
        for (int num : numbers) {
            total += num;
        }
        return total;
    }

    // 方法重载 - 同名但参数列表不同
    public double add(double a, double b) {
        return a + b;
    }
}
```

## 注释

Java支持三种类型的注释：

```java
// 单行注释

/*
 * 多行注释
 * 可以跨越多行
 */

/**
 * 文档注释
 * @author 作者名
 * @version 1.0
 * @since 2023-01-01
 */
public class DocumentedClass {
    /**
     * 计算两数之和
     * @param a 第一个加数
     * @param b 第二个加数
     * @return 两数之和
     */
    public int add(int a, int b) {
        return a + b;
    }
}
```

## 异常处理

Java使用try-catch-finally块处理异常：

```java
public void readFile(String filename) {
    FileReader reader = null;
    try {
        // 可能抛出异常的代码
        reader = new FileReader(filename);
        // 处理文件...
    } catch (FileNotFoundException e) {
        // 捕获特定异常
        System.err.println("文件未找到: " + e.getMessage());
    } catch (IOException e) {
        // 捕获其他IO异常
        System.err.println("IO错误: " + e.getMessage());
    } finally {
        // 无论是否发生异常都会执行
        try {
            if (reader != null) {
                reader.close();
            }
        } catch (IOException e) {
            System.err.println("关闭文件时出错");
        }
    }
}

// Java 7引入的try-with-resources语句
public void readFileWithResources(String filename) {
    try (FileReader reader = new FileReader(filename)) {
        // 处理文件...
    } catch (IOException e) {
        System.err.println("IO错误: " + e.getMessage());
    } // 自动关闭资源
}

// 抛出异常
public void checkAge(int age) throws IllegalArgumentException {
    if (age < 0) {
        throw new IllegalArgumentException("年龄不能为负数");
    }
}
```

## 总结

- Java是一种强类型、面向对象的编程语言
- 基本语法包括变量声明、数据类型、运算符和控制流语句
- 方法是组织代码的基本单位，支持重载和可变参数
- 异常处理使用try-catch-finally结构，帮助处理程序运行时的错误情况

这些基础知识是学习Java编程的重要起点，掌握这些概念将帮助你理解更高级的Java主题，如面向对象编程、集合框架和多线程编程。