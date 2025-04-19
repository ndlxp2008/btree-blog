# Python 基础语法

Python是一种简洁、易读、通用的高级编程语言，以其清晰的语法和强大的生态系统而闻名。本文将介绍Python的基础语法和核心概念。

## Python简介

Python由Guido van Rossum于1989年创建，设计理念是代码可读性和简洁性。Python有以下特点：

- **易于学习**：简洁明了的语法，适合初学者
- **可读性强**：代码结构清晰，使用缩进表示代码块
- **跨平台**：支持Windows、macOS、Linux等多种操作系统
- **解释型语言**：代码无需编译，直接由解释器执行
- **多范式支持**：支持面向对象、命令式和函数式编程
- **丰富的标准库**：内置大量实用模块，无需额外安装
- **广泛的第三方库生态**：NumPy、Pandas、Django、Flask等

## 环境搭建

### 安装Python

从[Python官网](https://www.python.org/downloads/)下载并安装最新版Python。

**Windows安装**：
- 下载安装包并运行
- 勾选"Add Python to PATH"
- 点击"Install Now"

**macOS安装**：
- 使用Homebrew：`brew install python`
- 或下载安装包安装

**Linux安装**：
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# CentOS/RHEL
sudo yum install python3 python3-pip
```

### 包管理工具pip

pip是Python的包管理工具，用于安装和管理第三方库：

```bash
# 安装包
pip install package_name

# 安装特定版本
pip install package_name==1.0.0

# 升级包
pip install --upgrade package_name

# 卸载包
pip uninstall package_name

# 列出已安装的包
pip list
```

### 虚拟环境

虚拟环境用于创建独立的Python环境，避免不同项目间的依赖冲突：

```bash
# 使用venv创建虚拟环境
python -m venv myenv

# 激活虚拟环境
# Windows
myenv\Scripts\activate
# macOS/Linux
source myenv/bin/activate

# 退出虚拟环境
deactivate
```

## 基本数据类型

Python有多种内置数据类型：

### 数值类型

```python
# 整数 (int)
x = 10
big_num = 10000000000  # Python支持任意大小的整数

# 浮点数 (float)
y = 3.14
scientific = 2.5e-3  # 科学计数法表示的0.0025

# 复数 (complex)
z = 1 + 2j
```

### 字符串 (str)

Python中的字符串是不可变序列：

```python
# 字符串创建
single_quotes = 'Hello'
double_quotes = "World"
triple_quotes = '''多行
字符串'''

# 字符串操作
s = "Hello, World!"
print(len(s))              # 输出: 13 (字符串长度)
print(s[0])                # 输出: H (索引访问)
print(s[7:12])             # 输出: World (切片)
print(s.upper())           # 输出: HELLO, WORLD! (转大写)
print(s.replace("H", "J")) # 输出: Jello, World! (替换)
print("Hello" in s)        # 输出: True (成员检测)

# 字符串格式化
name = "Alice"
age = 25
# f-string (Python 3.6+)
print(f"{name} is {age} years old")
# format方法
print("{} is {} years old".format(name, age))
# %操作符
print("%s is %d years old" % (name, age))
```

### 布尔值 (bool)

```python
x = True
y = False

# 布尔运算
print(x and y)  # 输出: False (逻辑与)
print(x or y)   # 输出: True (逻辑或)
print(not x)    # 输出: False (逻辑非)
```

### 空值 (None)

```python
x = None
print(x is None)  # 输出: True
```

## 容器类型

### 列表 (list)

列表是可变的有序序列：

```python
# 创建列表
fruits = ["apple", "banana", "cherry"]
mixed = [1, "hello", 3.14, True]

# 访问元素
print(fruits[0])    # 输出: apple
print(fruits[-1])   # 输出: cherry (负索引表示从末尾开始)

# 切片
print(fruits[1:3])  # 输出: ['banana', 'cherry']

# 修改列表
fruits.append("orange")        # 添加元素
fruits.insert(1, "blueberry")  # 在指定位置插入元素
fruits.remove("banana")        # 删除指定元素
popped = fruits.pop()          # 移除并返回最后一个元素
fruits[0] = "pear"             # 替换元素

# 列表操作
print(len(fruits))             # 列表长度
print("apple" in fruits)       # 成员检测
combined = fruits + ["grape"]  # 列表连接
repeated = ["a"] * 3           # 列表重复

# 列表推导式
squares = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]
```

### 元组 (tuple)

元组是不可变的有序序列：

```python
# 创建元组
coordinates = (10, 20)
singleton = (1,)  # 单元素元组需要逗号

# 访问元素
print(coordinates[0])  # 输出: 10

# 元组解包
x, y = coordinates
print(x, y)  # 输出: 10 20

# 元组不能修改
# coordinates[0] = 15  # 这会引发TypeError
```

### 字典 (dict)

字典存储键值对：

```python
# 创建字典
person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}

# 访问值
print(person["name"])  # 输出: Alice
print(person.get("age"))  # 输出: 25
print(person.get("country", "Unknown"))  # 指定默认值

# 修改字典
person["email"] = "alice@example.com"  # 添加新键值对
person["age"] = 26  # 修改现有值
del person["city"]  # 删除键值对
popped = person.pop("email")  # 移除并返回值

# 字典操作
print(len(person))  # 字典长度
print("name" in person)  # 键检测
print(list(person.keys()))  # 获取所有键
print(list(person.values()))  # 获取所有值
print(list(person.items()))  # 获取所有键值对

# 字典推导式
squares = {x: x**2 for x in range(5)}
```

### 集合 (set)

集合是无序、唯一元素的集合：

```python
# 创建集合
fruits = {"apple", "banana", "cherry"}
numbers = set([1, 2, 3, 2])  # 从列表创建

# 集合操作
fruits.add("orange")  # 添加元素
fruits.remove("banana")  # 删除元素
fruits.discard("grape")  # 删除元素，但不会引发错误
popped = fruits.pop()  # 移除并返回任意元素

# 集合运算
a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)  # 输出: {1, 2, 3, 4, 5} (并集)
print(a & b)  # 输出: {3} (交集)
print(a - b)  # 输出: {1, 2} (差集)
print(a ^ b)  # 输出: {1, 2, 4, 5} (对称差)

# 集合推导式
squares = {x**2 for x in range(5)}
```

## 控制流

### 条件语句

```python
# if语句
x = 10
if x > 0:
    print("Positive")
elif x < 0:
    print("Negative")
else:
    print("Zero")

# 条件表达式 (三元运算符)
status = "Adult" if age >= 18 else "Minor"
```

### 循环

```python
# for循环
for i in range(5):
    print(i)  # 输出 0, 1, 2, 3, 4

fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# 使用enumerate获取索引和值
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# 使用zip遍历多个列表
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]
for name, age in zip(names, ages):
    print(f"{name} is {age} years old")

# while循环
count = 0
while count < 5:
    print(count)
    count += 1

# 循环控制
for i in range(10):
    if i == 3:
        continue  # 跳过此次循环
    if i == 8:
        break  # 退出循环
    print(i)
```

## 函数

### 定义和调用函数

```python
# 基本函数
def greet(name):
    """返回问候语（文档字符串）"""
    return f"Hello, {name}!"

message = greet("Alice")
print(message)  # 输出: Hello, Alice!

# 带默认参数的函数
def greet_with_title(name, title="Mr./Ms."):
    return f"Hello, {title} {name}!"

print(greet_with_title("Smith"))  # 输出: Hello, Mr./Ms. Smith!
print(greet_with_title("Johnson", "Dr."))  # 输出: Hello, Dr. Johnson!

# 关键字参数
def describe_person(name, age, city):
    return f"{name}, {age} years old, lives in {city}"

print(describe_person(age=30, city="New York", name="Alice"))

# 可变参数
def sum_numbers(*args):
    return sum(args)

print(sum_numbers(1, 2, 3, 4))  # 输出: 10

# 可变关键字参数
def person_info(name, **kwargs):
    info = f"Name: {name}"
    for key, value in kwargs.items():
        info += f", {key}: {value}"
    return info

print(person_info("Alice", age=30, job="Engineer", city="Boston"))
```

### Lambda函数

```python
# Lambda函数是匿名函数
square = lambda x: x**2
print(square(5))  # 输出: 25

# 常用于高阶函数
numbers = [1, 4, 2, 7, 5, 3]
sorted_numbers = sorted(numbers, key=lambda x: x)
print(sorted_numbers)  # 输出: [1, 2, 3, 4, 5, 7]
```

## 模块和包

### 导入模块

```python
# 导入整个模块
import math
print(math.sqrt(16))  # 输出: 4.0

# 导入特定函数
from random import randint
print(randint(1, 10))  # 输出随机整数

# 导入并重命名
import datetime as dt
now = dt.datetime.now()

# 导入所有内容（不推荐）
# from math import *
```

### 创建模块

```python
# mymodule.py
def greeting(name):
    return f"Hello, {name}!"

PI = 3.14159

# 在另一个文件中使用
# import mymodule
# print(mymodule.greeting("Alice"))
# print(mymodule.PI)
```

### 包

包是包含多个模块的目录，必须包含`__init__.py`文件：

```
mypackage/
    __init__.py
    module1.py
    module2.py
    subpackage/
        __init__.py
        module3.py
```

导入包中的模块：

```python
# 导入包中的模块
from mypackage import module1
from mypackage.subpackage import module3
```

## 文件操作

### 读取文件

```python
# 基本读取
with open("file.txt", "r") as file:
    content = file.read()
    print(content)

# 逐行读取
with open("file.txt", "r") as file:
    for line in file:
        print(line.strip())

# 读取所有行到列表
with open("file.txt", "r") as file:
    lines = file.readlines()
```

### 写入文件

```python
# 写入文件（覆盖现有内容）
with open("output.txt", "w") as file:
    file.write("Hello, World!\n")
    file.write("Another line.\n")

# 追加到文件
with open("output.txt", "a") as file:
    file.write("Appended line.\n")
```

### 处理CSV文件

```python
import csv

# 读取CSV
with open("data.csv", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# 写入CSV
with open("output.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Name", "Age", "City"])
    writer.writerow(["Alice", 30, "New York"])
    writer.writerow(["Bob", 25, "Boston"])
```

### 处理JSON文件

```python
import json

# 读取JSON
with open("data.json", "r") as file:
    data = json.load(file)
    print(data)

# 写入JSON
data = {
    "name": "Alice",
    "age": 30,
    "city": "New York",
    "languages": ["Python", "JavaScript", "Go"]
}
with open("output.json", "w") as file:
    json.dump(data, file, indent=4)
```

## 异常处理

### 基本异常处理

```python
try:
    x = int(input("Enter a number: "))
    result = 10 / x
    print(f"Result: {result}")
except ValueError:
    print("That's not a valid number.")
except ZeroDivisionError:
    print("Cannot divide by zero.")
except Exception as e:
    print(f"An error occurred: {e}")
else:
    print("No exceptions were raised.")
finally:
    print("This code always executes.")
```

### 自定义异常

```python
class CustomError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

try:
    raise CustomError("This is a custom error")
except CustomError as e:
    print(f"Caught custom error: {e}")
```

## 面向对象编程

### 类和对象

```python
class Person:
    """人类的表示（类文档字符串）"""
    
    # 类变量
    species = "Homo sapiens"
    
    # 初始化方法
    def __init__(self, name, age):
        # 实例变量
        self.name = name
        self.age = age
        self._email = None  # 约定的私有属性
    
    # 实例方法
    def greet(self):
        return f"Hello, my name is {self.name}"
    
    def have_birthday(self):
        self.age += 1
    
    # 属性装饰器
    @property
    def email(self):
        return self._email
    
    @email.setter
    def email(self, value):
        if "@" in value:
            self._email = value
        else:
            raise ValueError("Invalid email address")
    
    # 类方法
    @classmethod
    def from_birth_year(cls, name, birth_year):
        from datetime import date
        age = date.today().year - birth_year
        return cls(name, age)
    
    # 静态方法
    @staticmethod
    def is_adult(age):
        return age >= 18

# 创建对象
person = Person("Alice", 30)
print(person.name)  # 输出: Alice
print(person.greet())  # 输出: Hello, my name is Alice
person.have_birthday()
print(person.age)  # 输出: 31

# 使用属性
person.email = "alice@example.com"
print(person.email)  # 输出: alice@example.com

# 使用类方法
person2 = Person.from_birth_year("Bob", 1990)
print(person2.age)  # 根据出生年份计算年龄

# 使用静态方法
print(Person.is_adult(20))  # 输出: True
```

### 继承和多态

```python
# 基类
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        raise NotImplementedError("Subclass must implement this method")

# 派生类
class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

# 使用多态
animals = [Dog("Rex"), Cat("Whiskers")]
for animal in animals:
    print(animal.speak())

# 检查类型
dog = Dog("Buddy")
print(isinstance(dog, Dog))    # 输出: True
print(isinstance(dog, Animal)) # 输出: True
print(issubclass(Dog, Animal)) # 输出: True
```

### 魔术方法

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    # 字符串表示
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"
    
    # 运算符重载
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)
    
    # 比较
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    
    # 可调用对象
    def __call__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

# 使用
v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1)          # 输出: Vector(1, 2)
print(v1 + v2)     # 输出: Vector(4, 6)
print(v1 == v2)    # 输出: False
v3 = v1(3)         # 相当于 v1.__call__(3)
print(v3)          # 输出: Vector(3, 6)
```

## Python标准库

Python标准库丰富而强大，以下是一些常用模块：

### 日期和时间 (datetime)

```python
from datetime import datetime, date, timedelta

# 当前日期和时间
now = datetime.now()
print(now)

# 创建日期
birthday = date(1990, 1, 1)
print(birthday)

# 日期算术
one_week = timedelta(days=7)
next_week = now + one_week
print(next_week)

# 格式化日期
print(now.strftime("%Y-%m-%d %H:%M:%S"))
```

### 数学运算 (math)

```python
import math

print(math.pi)        # π
print(math.sqrt(16))  # 平方根
print(math.sin(0))    # 三角函数
print(math.log(10))   # 自然对数
print(math.ceil(4.3)) # 向上取整
```

### 正则表达式 (re)

```python
import re

# 匹配
text = "The phone number is 123-456-7890."
match = re.search(r"\d{3}-\d{3}-\d{4}", text)
if match:
    print(match.group())  # 输出: 123-456-7890

# 替换
result = re.sub(r"\d{3}-\d{3}-\d{4}", "XXX-XXX-XXXX", text)
print(result)  # 输出: The phone number is XXX-XXX-XXXX.

# 查找所有
emails = "Contact us at support@example.com or admin@example.org"
matches = re.findall(r"[\w.+-]+@[\w-]+\.[\w.-]+", emails)
print(matches)  # 输出: ['support@example.com', 'admin@example.org']
```

### 随机数 (random)

```python
import random

print(random.random())          # 0.0到1.0之间的随机浮点数
print(random.randint(1, 10))    # 1到10之间的随机整数
print(random.choice([1, 2, 3])) # 从列表中随机选择

deck = list(range(52))
random.shuffle(deck)            # 随机打乱
print(deck)
```

### 系统和操作系统 (os, sys)

```python
import os
import sys

# 当前工作目录
print(os.getcwd())

# 修改目录
# os.chdir("/path/to/dir")

# 列出目录内容
print(os.listdir("."))

# 创建目录
# os.mkdir("new_directory")

# 路径操作
path = os.path.join("dir", "file.txt")
print(path)
print(os.path.exists(path))
print(os.path.basename(path))
print(os.path.dirname(path))

# 执行系统命令
# os.system("ls -la")

# 命令行参数
print(sys.argv)

# 退出程序
# sys.exit(0)

# 平台信息
print(sys.platform)
```

## 进阶主题

### 迭代器和生成器

```python
# 迭代器
class Fibonacci:
    def __init__(self, n):
        self.n = n
        self.a, self.b = 0, 1
        self.count = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.count >= self.n:
            raise StopIteration
        result = self.a
        self.a, self.b = self.b, self.a + self.b
        self.count += 1
        return result

for num in Fibonacci(10):
    print(num)

# 生成器
def fibonacci_gen(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci_gen(10):
    print(num)

# 生成器表达式
squares = (x**2 for x in range(10))
for square in squares:
    print(square)
```

### 装饰器

```python
# 基本装饰器
def timing_decorator(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.6f} seconds")
        return result
    return wrapper

@timing_decorator
def slow_function():
    import time
    time.sleep(1)
    return "Done"

result = slow_function()  # 输出函数执行时间

# 带参数的装饰器
def repeat(n):
    def decorator(func):
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(n):
                results.append(func(*args, **kwargs))
            return results
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))  # 调用函数3次并返回结果列表
```

### 上下文管理器

```python
# 使用上下文管理器
with open("file.txt", "r") as file:
    content = file.read()
    # 文件会自动关闭

# 自定义上下文管理器
class MyContext:
    def __init__(self, name):
        self.name = name
    
    def __enter__(self):
        print(f"Entering {self.name}")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"Exiting {self.name}")
        if exc_type:
            print(f"An exception occurred: {exc_val}")
            return True  # 抑制异常

with MyContext("my_context") as ctx:
    print("Inside the context")
    # raise ValueError("Some error")  # 异常会被抑制
```

### 并发编程

```python
# 线程
import threading

def task(name):
    print(f"Task {name} started")
    import time
    time.sleep(1)
    print(f"Task {name} completed")

threads = []
for i in range(3):
    t = threading.Thread(target=task, args=(i,))
    t.start()
    threads.append(t)

for t in threads:
    t.join()

# 进程
from multiprocessing import Process

def process_task(name):
    print(f"Process {name} started")
    import time
    time.sleep(1)
    print(f"Process {name} completed")

if __name__ == "__main__":
    processes = []
    for i in range(3):
        p = Process(target=process_task, args=(i,))
        p.start()
        processes.append(p)

    for p in processes:
        p.join()

# 并发.futures
from concurrent.futures import ThreadPoolExecutor

def future_task(name):
    print(f"Future task {name} started")
    import time
    time.sleep(1)
    return f"Future task {name} result"

with ThreadPoolExecutor(max_workers=3) as executor:
    futures = {executor.submit(future_task, i): i for i in range(3)}
    for future in futures:
        result = future.result()
        print(result)
```

## Python 代码规范

### PEP 8 风格指南

Python 官方风格指南 PEP 8 定义了编写 Python 代码的约定：

- 使用 4 个空格缩进
- 行长度不超过 79 个字符
- 导入应分组并按顺序放置（标准库, 第三方库, 本地模块）
- 使用空行分隔函数和类
- 使用空格分隔操作符
- 命名约定：
  - 类名使用 CamelCase
  - 函数、变量和方法使用 snake_case
  - 常量使用 ALL_CAPS
  - 私有属性以下划线开头（_private_var）

### 编码技巧

- 优先使用列表推导和生成器表达式
- 使用 with 语句管理上下文（文件、锁等）
- 使用异常处理而不是大量检查
- 多使用 Python 内置函数和标准库
- 编写文档字符串描述函数和类
- 遵循"Python之禅"的原则（`import this`）

## 相关资源

- [Python 官方文档](https://docs.python.org/)
- [The Python Tutorial](https://docs.python.org/3/tutorial/)
- [Python 标准库](https://docs.python.org/3/library/)
- [PEP 8 -- 风格指南](https://www.python.org/dev/peps/pep-0008/)
- [Real Python](https://realpython.com/) - 优质的 Python 教程网站
- [PyPI](https://pypi.org/) - Python 包索引
- [Awesome Python](https://github.com/vinta/awesome-python) - 精选 Python 框架、库和软件的清单
