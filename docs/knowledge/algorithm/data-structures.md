# 常见数据结构

数据结构是计算机科学中组织和存储数据的特定方式，以便能够高效地访问和修改数据。本文档介绍常见的数据结构及其特点、应用场景和基本操作。

## 目录
- [数组 (Array)](#数组-array)
- [链表 (Linked List)](#链表-linked-list)
- [栈 (Stack)](#栈-stack)
- [队列 (Queue)](#队列-queue)
- [哈希表 (Hash Table)](#哈希表-hash-table)
- [树 (Tree)](#树-tree)
- [堆 (Heap)](#堆-heap)
- [图 (Graph)](#图-graph)
- [高级数据结构](#高级数据结构)
- [数据结构的选择](#数据结构的选择)

## 数组 (Array)

### 特点
- 固定大小的连续内存空间，存储相同类型的元素
- 通过索引直接访问元素
- 插入和删除操作需要移动元素

### 时间复杂度
- 访问: O(1)
- 搜索: O(n) - 线性搜索；O(log n) - 二分搜索（排序数组）
- 插入/删除: O(n) - 最坏情况（头部插入/删除）

### 应用场景
- 需要快速随机访问元素
- 数据量固定或变化不大
- 内存连续性要求高的场景

### 代码示例 (Java)
```java
// 创建并初始化数组
int[] numbers = new int[5];
numbers[0] = 10;
numbers[1] = 20;

// 数组迭代
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

// 使用增强for循环
for (int num : numbers) {
    System.out.println(num);
}
```

## 链表 (Linked List)

### 特点
- 由节点组成，每个节点包含数据和指向下一个节点的引用
- 不要求连续内存空间
- 插入和删除操作无需移动元素，只需调整节点引用

### 类型
- 单向链表：每个节点只有指向下一个节点的引用
- 双向链表：每个节点有指向前后节点的引用
- 循环链表：最后一个节点指向第一个节点

### 时间复杂度
- 访问: O(n)
- 搜索: O(n)
- 插入/删除: O(1) - 已知位置；O(n) - 需要先查找位置

### 应用场景
- 频繁插入、删除操作
- 动态调整大小的数据集合
- 实现栈、队列等其他数据结构

### 代码示例 (Java)
```java
class Node {
    int data;
    Node next;

    public Node(int data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    Node head;

    // 在链表头部添加节点
    public void insertAtHead(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }

    // 遍历链表
    public void display() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
}
```

## 栈 (Stack)

### 特点
- 后进先出 (LIFO - Last In, First Out) 原则
- 只允许在一端（栈顶）进行操作
- 主要操作：push（入栈）和pop（出栈）

### 时间复杂度
- 访问栈顶元素: O(1)
- 插入(push): O(1)
- 删除(pop): O(1)

### 应用场景
- 函数调用管理（调用栈）
- 表达式求值和语法解析
- 撤销操作
- 深度优先搜索算法
- 括号匹配问题

### 代码示例 (Java)
```java
// 使用Java内置栈
import java.util.Stack;

public class StackExample {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();

        // 入栈
        stack.push(10);
        stack.push(20);
        stack.push(30);

        // 查看栈顶元素但不移除
        System.out.println("栈顶元素: " + stack.peek());

        // 出栈
        System.out.println("出栈: " + stack.pop());

        // 检查栈是否为空
        System.out.println("栈是否为空: " + stack.isEmpty());
    }
}
```

## 队列 (Queue)

### 特点
- 先进先出 (FIFO - First In, First Out) 原则
- 在一端（队尾）插入，在另一端（队首）删除
- 主要操作：enqueue（入队）和dequeue（出队）

### 时间复杂度
- 访问队首元素: O(1)
- 插入(enqueue): O(1)
- 删除(dequeue): O(1)

### 应用场景
- 任务调度
- 消息队列
- 缓冲区管理
- 广度优先搜索算法
- 打印任务管理

### 代码示例 (Java)
```java
// 使用Java内置队列
import java.util.LinkedList;
import java.util.Queue;

public class QueueExample {
    public static void main(String[] args) {
        Queue<Integer> queue = new LinkedList<>();

        // 入队
        queue.offer(10);
        queue.offer(20);
        queue.offer(30);

        // 查看队首元素但不移除
        System.out.println("队首元素: " + queue.peek());

        // 出队
        System.out.println("出队: " + queue.poll());

        // 检查队列是否为空
        System.out.println("队列是否为空: " + queue.isEmpty());
    }
}
```

## 哈希表 (Hash Table)

### 特点
- 基于键值对(key-value)的数据结构
- 使用哈希函数将键映射到数组索引
- 处理冲突的常见方法：链地址法、开放地址法

### 时间复杂度
- 查找: O(1) - 平均情况；O(n) - 最坏情况
- 插入: O(1) - 平均情况；O(n) - 最坏情况
- 删除: O(1) - 平均情况；O(n) - 最坏情况

### 应用场景
- 实现关联数组或字典
- 数据库索引
- 缓存实现
- 去重操作

### 代码示例 (Java)
```java
// 使用Java内置HashMap
import java.util.HashMap;
import java.util.Map;

public class HashMapExample {
    public static void main(String[] args) {
        Map<String, Integer> hashMap = new HashMap<>();

        // 插入键值对
        hashMap.put("Apple", 10);
        hashMap.put("Banana", 20);
        hashMap.put("Orange", 30);

        // 获取值
        System.out.println("Apple的价格: " + hashMap.get("Apple"));

        // 检查键是否存在
        System.out.println("是否包含Mango: " + hashMap.containsKey("Mango"));

        // 遍历HashMap
        for (Map.Entry<String, Integer> entry : hashMap.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
```

## 树 (Tree)

### 特点
- 层次化数据结构
- 每个节点可以有零个或多个子节点
- 没有环路

### 主要类型

#### 二叉树 (Binary Tree)
- 每个节点最多有两个子节点（左子节点和右子节点）

#### 二叉搜索树 (Binary Search Tree)
- 左子树上所有节点的值都小于根节点的值
- 右子树上所有节点的值都大于根节点的值
- 左右子树也是二叉搜索树

#### 平衡二叉树 (Balanced Binary Tree)
- 左右子树高度差不超过1
- 常见实现：AVL树、红黑树

#### B树和B+树
- 适用于磁盘存储和数据库系统的多路搜索树

### 时间复杂度 (二叉搜索树)
- 搜索: O(log n) - 平均情况；O(n) - 最坏情况
- 插入: O(log n) - 平均情况；O(n) - 最坏情况
- 删除: O(log n) - 平均情况；O(n) - 最坏情况

### 应用场景
- 层次化数据表示（文件系统、组织结构）
- 搜索和排序
- 路由算法
- 决策树
- 数据库索引

### 代码示例 (Java)
```java
class TreeNode {
    int data;
    TreeNode left;
    TreeNode right;

    public TreeNode(int data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    TreeNode root;

    // 插入节点
    public void insert(int data) {
        root = insertRecursive(root, data);
    }

    private TreeNode insertRecursive(TreeNode root, int data) {
        if (root == null) {
            return new TreeNode(data);
        }

        if (data < root.data) {
            root.left = insertRecursive(root.left, data);
        } else if (data > root.data) {
            root.right = insertRecursive(root.right, data);
        }

        return root;
    }

    // 中序遍历
    public void inOrderTraversal(TreeNode node) {
        if (node != null) {
            inOrderTraversal(node.left);
            System.out.print(node.data + " ");
            inOrderTraversal(node.right);
        }
    }

    // 搜索节点
    public boolean search(int data) {
        return searchRecursive(root, data);
    }

    private boolean searchRecursive(TreeNode root, int data) {
        if (root == null) {
            return false;
        }

        if (root.data == data) {
            return true;
        }

        return data < root.data
            ? searchRecursive(root.left, data)
            : searchRecursive(root.right, data);
    }
}
```

## 堆 (Heap)

### 特点
- 特殊的完全二叉树
- 两种主要类型：最大堆（父节点值大于等于子节点值）和最小堆（父节点值小于等于子节点值）
- 通常用数组实现

### 时间复杂度
- 查找最大/最小元素: O(1)
- 插入: O(log n)
- 删除最大/最小元素: O(log n)
- 构建堆: O(n)

### 应用场景
- 优先队列
- 堆排序
- 图算法（如Dijkstra算法）
- 中位数和百分位数计算
- 系统内存管理

### 代码示例 (Java)
```java
// 使用Java内置PriorityQueue实现最小堆
import java.util.PriorityQueue;

public class MinHeapExample {
    public static void main(String[] args) {
        // 创建最小堆
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        // 插入元素
        minHeap.add(5);
        minHeap.add(2);
        minHeap.add(8);
        minHeap.add(1);

        // 查看堆顶元素（最小值）但不移除
        System.out.println("堆顶元素: " + minHeap.peek());

        // 移除并返回堆顶元素
        System.out.println("移除堆顶: " + minHeap.poll());

        // 新的堆顶元素
        System.out.println("新堆顶: " + minHeap.peek());
    }
}
```

## 图 (Graph)

### 特点
- 由顶点（节点）和边组成
- 边可以有方向（有向图）或无方向（无向图）
- 边可以有权重（加权图）或无权重

### 表示方法
- 邻接矩阵：二维数组表示顶点间的连接关系
- 邻接表：每个顶点维护一个列表，存储与其相邻的顶点

### 基本算法
- 深度优先搜索 (DFS)：利用栈进行遍历
- 广度优先搜索 (BFS)：利用队列进行遍历
- 最短路径算法：Dijkstra算法、Bellman-Ford算法
- 最小生成树：Prim算法、Kruskal算法
- 拓扑排序：处理有向无环图 (DAG)

### 应用场景
- 社交网络
- 路由和导航
- 网络流量分析
- 依赖关系的表示
- 游戏开发中的地图表示

### 代码示例 (Java)
```java
import java.util.*;

// 使用邻接表表示的图
class Graph {
    private int V; // 顶点数
    private LinkedList<Integer>[] adjacencyList; // 邻接表

    @SuppressWarnings("unchecked")
    public Graph(int v) {
        V = v;
        adjacencyList = new LinkedList[v];
        for (int i = 0; i < v; i++) {
            adjacencyList[i] = new LinkedList<>();
        }
    }

    // 添加边
    public void addEdge(int src, int dest) {
        adjacencyList[src].add(dest);
    }

    // 广度优先搜索
    public void BFS(int startVertex) {
        boolean[] visited = new boolean[V];
        LinkedList<Integer> queue = new LinkedList<>();

        visited[startVertex] = true;
        queue.add(startVertex);

        while (!queue.isEmpty()) {
            startVertex = queue.poll();
            System.out.print(startVertex + " ");

            for (Integer neighbor : adjacencyList[startVertex]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.add(neighbor);
                }
            }
        }
    }

    // 深度优先搜索
    public void DFS(int startVertex) {
        boolean[] visited = new boolean[V];
        DFSUtil(startVertex, visited);
    }

    private void DFSUtil(int vertex, boolean[] visited) {
        visited[vertex] = true;
        System.out.print(vertex + " ");

        for (Integer neighbor : adjacencyList[vertex]) {
            if (!visited[neighbor]) {
                DFSUtil(neighbor, visited);
            }
        }
    }
}
```

## 字典树 (Trie)

### 特点
- 用于存储字符串的树形数据结构
- 每个节点表示一个字符
- 从根到某一节点的路径表示一个字符串
- 同一节点的所有子节点代表不同的字符

### 时间复杂度
- 查找: O(m) - m是字符串长度
- 插入: O(m) - m是字符串长度
- 删除: O(m) - m是字符串长度

### 应用场景
- 自动补全和拼写检查
- 字典和词汇表实现
- IP路由表查找
- 前缀匹配
- 文本压缩

### 代码示例 (Java)
```java
class TrieNode {
    TrieNode[] children;
    boolean isEndOfWord;

    public TrieNode() {
        children = new TrieNode[26]; // 假设只包含小写字母
        isEndOfWord = false;
    }
}

class Trie {
    private TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    // 插入单词
    public void insert(String word) {
        TrieNode current = root;

        for (int i = 0; i < word.length(); i++) {
            int index = word.charAt(i) - 'a';
            if (current.children[index] == null) {
                current.children[index] = new TrieNode();
            }
            current = current.children[index];
        }

        current.isEndOfWord = true;
    }

    // 搜索单词
    public boolean search(String word) {
        TrieNode node = searchPrefix(word);
        return node != null && node.isEndOfWord;
    }

    // 搜索前缀
    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != null;
    }

    private TrieNode searchPrefix(String word) {
        TrieNode current = root;

        for (int i = 0; i < word.length(); i++) {
            int index = word.charAt(i) - 'a';
            if (current.children[index] == null) {
                return null;
            }
            current = current.children[index];
        }

        return current;
    }
}
```

## 高级数据结构

### Trie (前缀树)

Trie是一种树形数据结构，用于高效存储和检索字符串数据集中的键。

**特点**：
- 用于字符串查找，特别是前缀匹配
- 每个节点包含多个子节点（通常为26个字母）
- 字符串的每个字符对应树中的一个层级

**应用场景**：
- 自动完成/推荐
- 拼写检查
- IP路由（最长前缀匹配）
- 字符串搜索

### 并查集 (Union-Find)

并查集是一种树形数据结构，用于处理元素分组和查询元素所属组的问题。

**特点**：
- 支持"合并"和"查找"操作
- 使用路径压缩和按秩合并优化
- 近乎常数时间的操作复杂度

**应用场景**：
- 检测图中的环
- 最小生成树算法
- 网络连接问题
- 图像处理的连通区域分析

### 线段树 (Segment Tree)

线段树是一种用于处理区间查询和更新操作的树形数据结构。

**特点**：
- 每个节点代表一个区间
- 支持区间查询和更新
- 需要O(n)空间和O(log n)查询/更新时间

**应用场景**：
- 区间最小/最大值查询
- 区间求和
- 区间更新
- 计算几何中的问题

### 树状数组 (Binary Indexed Tree/Fenwick Tree)

树状数组是一种支持高效更新和前缀和查询的数据结构。

**特点**：
- 比线段树更节省空间
- 实现简单
- 基于二进制索引的巧妙设计

**应用场景**：
- 高效计算前缀和
- 区间查询和单点更新
- 计数排序
- 逆序对计数

## 数据结构的选择

选择合适的数据结构对算法效率至关重要，以下是选择数据结构的一些考虑因素：

### 根据操作类型选择

- **需要随机访问**：数组
- **频繁插入/删除**：链表
- **LIFO操作**：栈
- **FIFO操作**：队列
- **基于键的快速查找**：哈希表
- **有序数据操作**：二叉搜索树、AVL树、红黑树
- **区间查询**：线段树、树状数组
- **动态连通性**：并查集

### 根据数据特性选择

- **固定大小的数据**：数组
- **动态大小的数据**：动态数组、链表
- **键值对数据**：哈希表、字典
- **有层次关系的数据**：树
- **网络结构数据**：图
- **需要保持顺序**：链表、有序数组
- **字符串数据**：Trie、后缀树/数组

### 效率与复杂性平衡

- **时间效率**：选择操作复杂度低的数据结构
- **空间效率**：考虑内存使用和数据规模
- **实现复杂性**：简单的数据结构更易于维护
- **扩展性**：考虑未来可能的需求变化

选择数据结构时，应该根据具体问题的要求、数据规模和操作特性进行综合考虑，有时候可能需要组合多种数据结构来达到最优效果。