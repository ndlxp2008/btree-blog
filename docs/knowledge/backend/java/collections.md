# Java集合框架

## 概述
Java集合框架提供了一组用于存储和操作对象组的接口和类，它们构成了Java编程中数据结构的基础。Java集合框架位于`java.util`包中，主要分为Collection和Map两大类。

## 集合框架层次结构

### Collection接口
Collection是集合层次结构的根接口，定义了所有集合都具有的基本操作。

```java
public interface Collection<E> extends Iterable<E> {
    boolean add(E e);
    boolean remove(Object o);
    boolean contains(Object o);
    int size();
    boolean isEmpty();
    Iterator<E> iterator();
    // 其他方法...
}
```

#### List接口
有序集合，允许重复元素，可通过索引访问元素。

主要实现类：
- **ArrayList**: 基于动态数组实现，随机访问高效，插入删除较慢。
- **LinkedList**: 基于双向链表实现，插入删除高效，随机访问较慢，还实现了Queue接口。
- **Vector**: 与ArrayList类似，但是线程安全的（已被淘汰）。

```java
List<String> arrayList = new ArrayList<>();
arrayList.add("Java");
arrayList.add("Python");
arrayList.add(1, "Go"); // 在索引1处插入元素

List<String> linkedList = new LinkedList<>();
linkedList.add("First");
linkedList.addFirst("Start"); // LinkedList特有方法
linkedList.addLast("End");    // LinkedList特有方法
```

#### Set接口
不允许重复元素的集合。

主要实现类：
- **HashSet**: 基于HashMap实现，无序，性能最好。
- **LinkedHashSet**: 基于LinkedHashMap实现，维护插入顺序。
- **TreeSet**: 基于TreeMap实现，元素按自然顺序或指定比较器排序。

```java
Set<Integer> hashSet = new HashSet<>();
hashSet.add(10);
hashSet.add(20);
hashSet.add(10); // 重复元素，会被忽略

Set<String> treeSet = new TreeSet<>();
treeSet.add("B");
treeSet.add("A");
treeSet.add("C");
// 迭代时将按字母顺序输出: A, B, C
```

#### Queue接口
队列通常以FIFO(先进先出)方式排列元素。

主要实现类：
- **LinkedList**: 也实现了Queue接口。
- **PriorityQueue**: 基于优先级堆的优先队列。
- **ArrayDeque**: 基于数组的双端队列，既可以当队列使用，也可以当栈使用。

```java
Queue<String> queue = new LinkedList<>();
queue.offer("First");   // 添加元素
queue.offer("Second");
String head = queue.peek(); // 查看队首元素但不移除
String removed = queue.poll(); // 移除并返回队首元素
```

### Map接口
存储键值对映射的对象，键不允许重复。

主要实现类：
- **HashMap**: 基于哈希表实现，无序，性能最好。
- **LinkedHashMap**: 维护插入顺序或访问顺序。
- **TreeMap**: 基于红黑树实现，按键的自然顺序或指定比较器排序。
- **Hashtable**: 与HashMap类似，但线程安全（已被淘汰）。

```java
Map<String, Integer> hashMap = new HashMap<>();
hashMap.put("One", 1);
hashMap.put("Two", 2);
int value = hashMap.get("One"); // 获取键"One"对应的值

// 遍历Map
for (Map.Entry<String, Integer> entry : hashMap.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

## Collections工具类
`Collections`类提供了一系列静态方法，用于操作集合。

```java
List<String> list = new ArrayList<>();
list.add("B");
list.add("A");
list.add("C");

Collections.sort(list); // 排序
Collections.reverse(list); // 反转
Collections.shuffle(list); // 随机排序
List<String> syncList = Collections.synchronizedList(list); // 获取线程安全的列表
```

## 集合框架的常见操作

### 迭代
```java
List<String> list = Arrays.asList("Java", "Python", "Go");

// 使用迭代器
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    String element = iterator.next();
    System.out.println(element);
}

// 使用增强for循环
for (String element : list) {
    System.out.println(element);
}

// Java 8 Stream API
list.stream().forEach(System.out::println);
```

### 转换
```java
// 数组转List
String[] array = {"Java", "Python", "Go"};
List<String> list = Arrays.asList(array);
List<String> arrayList = new ArrayList<>(Arrays.asList(array));

// List转数组
String[] backToArray = list.toArray(new String[0]);
```

## 选择合适的集合
- 需要快速随机访问元素：**ArrayList**
- 经常在集合中间插入/删除元素：**LinkedList**
- 不允许重复且不关心顺序：**HashSet**
- 不允许重复且需要保持插入顺序：**LinkedHashSet**
- 不允许重复且需要排序：**TreeSet**
- 需要键值对且不关心顺序：**HashMap**
- 需要键值对且需要保持插入顺序：**LinkedHashMap**
- 需要键值对且需要按键排序：**TreeMap**
- 需要先进先出队列：**LinkedList** 或 **ArrayDeque**
- 需要优先级队列：**PriorityQueue**

## 性能考虑
- **时间复杂度**：了解不同集合类操作的时间复杂度对于选择合适的集合类至关重要。
- **空间复杂度**：集合的实现方式会影响其内存使用效率。
- **线程安全**：标准集合类通常不是线程安全的。需要线程安全的操作时，可以使用`Collections.synchronizedXXX()`方法获取同步版本，或使用`java.util.concurrent`包中的并发集合。

## 并发集合
Java提供了多种线程安全的集合实现，位于`java.util.concurrent`包中：

- **ConcurrentHashMap**: 线程安全的HashMap，比Hashtable性能更好。
- **CopyOnWriteArrayList**: 线程安全的List，适用于读多写少的场景。
- **CopyOnWriteArraySet**: 基于CopyOnWriteArrayList实现的线程安全Set。
- **ConcurrentLinkedQueue**: 线程安全的无界队列。
- **BlockingQueue**接口的实现类：如ArrayBlockingQueue、LinkedBlockingQueue等，提供阻塞操作。

```java
Map<String, Integer> concurrentMap = new ConcurrentHashMap<>();
concurrentMap.put("key", 1);
concurrentMap.putIfAbsent("key", 2); // 只有当key不存在时，才放入值

BlockingQueue<Task> taskQueue = new LinkedBlockingQueue<>(100);
// 生产者线程
taskQueue.put(new Task()); // 如果队列满，会阻塞
// 消费者线程
Task task = taskQueue.take(); // 如果队列空，会阻塞
```

## 总结
Java集合框架为数据存储和操作提供了丰富的API，选择合适的集合类型对于应用程序的性能至关重要。了解每种集合类型的特点、优缺点及适用场景，可以帮助开发者做出更明智的选择。