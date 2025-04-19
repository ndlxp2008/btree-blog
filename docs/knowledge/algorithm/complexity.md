# 算法复杂度分析

算法复杂度分析是评估算法性能的重要方法，它帮助我们理解算法在面对不同规模输入时的性能表现。本文档介绍算法复杂度的基本概念、分析方法及其在实践中的应用。

## 1. 基本概念

### 1.1 什么是算法复杂度

算法复杂度是描述算法运行时间或空间需求与输入规模之间关系的度量。主要有两类复杂度：

- **时间复杂度**：评估算法执行所需的时间
- **空间复杂度**：评估算法执行所需的额外空间

### 1.2 渐进符号表示法

我们使用渐进符号表示法来描述算法复杂度，主要包括：

- **大O表示法 O()**：表示算法的上界（最坏情况）
- **大Ω表示法 Ω()**：表示算法的下界（最好情况）
- **大Θ表示法 Θ()**：表示算法的紧确界（平均情况）

实际分析中，我们通常关注大O表示法，因为它描述了算法在最坏情况下的性能。

### 1.3 常见的时间复杂度

按照从低到高的顺序：

| 复杂度 | 名称 | 示例算法 |
|-------|-----|---------|
| O(1) | 常数时间 | 数组索引访问、哈希表查找 |
| O(log n) | 对数时间 | 二分查找、平衡二叉树操作 |
| O(n) | 线性时间 | 线性搜索、遍历数组 |
| O(n log n) | 线性对数时间 | 归并排序、快速排序、堆排序 |
| O(n²) | 二次时间 | 冒泡排序、插入排序、简单嵌套循环 |
| O(n³) | 三次时间 | 某些矩阵操作、某些动态规划算法 |
| O(2ⁿ) | 指数时间 | 递归斐波那契、旅行商问题的朴素解法 |
| O(n!) | 阶乘时间 | 全排列、某些NP完全问题 |

### 1.4 复杂度增长的可视化比较

不同复杂度随输入规模增长的速率差异：

| 输入规模(n) | O(1) | O(log n) | O(n) | O(n log n) | O(n²) | O(2ⁿ) |
|------------|------|---------|------|------------|-------|-------|
| 10 | 1 | 3 | 10 | 30 | 100 | 1,024 |
| 100 | 1 | 7 | 100 | 700 | 10,000 | 1.27×10³⁰ |
| 1,000 | 1 | 10 | 1,000 | 10,000 | 1,000,000 | 10³⁰⁰ |

## 2. 时间复杂度分析

### 2.1 分析方法

分析算法时间复杂度的基本步骤：

1. **识别基本操作**：确定算法中的基本操作（如比较、赋值等）
2. **确定操作次数与输入规模的关系**：建立数学表达式
3. **化简表达式**：去除常数因子和低阶项
4. **确定渐进表示**：用大O表示法表示结果

### 2.2 分析技巧

#### 2.2.1 循环

- 单层循环：通常是O(n)
- 嵌套循环：外层循环次数×内层循环次数
  - 两层循环通常是O(n²)
  - 三层循环通常是O(n³)

```java
// O(n)
for (int i = 0; i < n; i++) {
    // 常数时间操作
}

// O(n²)
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        // 常数时间操作
    }
}
```

#### 2.2.2 递归

递归算法的时间复杂度通常可以用递推关系来表示。例如：

```java
// 二分查找: O(log n)
public int binarySearch(int[] arr, int target, int left, int right) {
    if (left > right) return -1;

    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;

    if (arr[mid] > target)
        return binarySearch(arr, target, left, mid - 1);
    else
        return binarySearch(arr, target, mid + 1, right);
}
```

递推关系：T(n) = T(n/2) + O(1)，解得T(n) = O(log n)

#### 2.2.3 主定理

对于形如T(n) = aT(n/b) + f(n)的递推关系，可以使用主定理求解：

- 若f(n) = O(n^c)且c < log_b(a)，则T(n) = O(n^(log_b(a)))
- 若f(n) = O(n^c)且c = log_b(a)，则T(n) = O(n^c * log n)
- 若f(n) = O(n^c)且c > log_b(a)，则T(n) = O(f(n))

### 2.3 常见算法的时间复杂度

#### 2.3.1 排序算法

| 算法 | 最好情况 | 平均情况 | 最坏情况 |
|------|---------|---------|---------|
| 冒泡排序 | O(n) | O(n²) | O(n²) |
| 选择排序 | O(n²) | O(n²) | O(n²) |
| 插入排序 | O(n) | O(n²) | O(n²) |
| 快速排序 | O(n log n) | O(n log n) | O(n²) |
| 归并排序 | O(n log n) | O(n log n) | O(n log n) |
| 堆排序 | O(n log n) | O(n log n) | O(n log n) |
| 计数排序 | O(n+k) | O(n+k) | O(n+k) |
| 基数排序 | O(d(n+k)) | O(d(n+k)) | O(d(n+k)) |

#### 2.3.2 查找算法

| 算法 | 最好情况 | 平均情况 | 最坏情况 |
|------|---------|---------|---------|
| 线性查找 | O(1) | O(n) | O(n) |
| 二分查找 | O(1) | O(log n) | O(log n) |
| 哈希表查找 | O(1) | O(1) | O(n) |
| 二叉搜索树查找 | O(1) | O(log n) | O(n) |
| 平衡树查找 | O(1) | O(log n) | O(log n) |

#### 2.3.3 图算法

| 算法 | 时间复杂度 |
|------|-----------|
| BFS（邻接表） | O(V+E) |
| BFS（邻接矩阵） | O(V²) |
| DFS（邻接表） | O(V+E) |
| DFS（邻接矩阵） | O(V²) |
| Dijkstra（二叉堆） | O((V+E)log V) |
| Bellman-Ford | O(VE) |
| Floyd-Warshall | O(V³) |
| Prim（二叉堆） | O(E log V) |
| Kruskal | O(E log V) |

## 3. 空间复杂度分析

### 3.1 分析方法

空间复杂度分析关注算法执行过程中所需的额外空间（不包括输入所占空间）：

1. **确定变量空间**：识别算法中使用的变量、数据结构及其大小
2. **确定递归栈空间**：如果有递归调用，需考虑递归栈深度
3. **确定与输入规模的关系**：建立数学表达式
4. **化简结果**：用大O表示法表示

### 3.2 常见的空间复杂度情况

#### 3.2.1 常数空间 O(1)

算法所需的额外空间不随输入规模增长：

```java
public int findMax(int[] arr) {
    int max = arr[0]; // 常数空间
    for (int i = 1; i < arr.length; i++) {
        max = Math.max(max, arr[i]);
    }
    return max;
}
```

#### 3.2.2 线性空间 O(n)

算法所需的额外空间与输入规模成正比：

```java
public int[] doubleValues(int[] arr) {
    int[] result = new int[arr.length]; // O(n)空间
    for (int i = 0; i < arr.length; i++) {
        result[i] = arr[i] * 2;
    }
    return result;
}
```

#### 3.2.3 递归算法的空间复杂度

递归算法需要考虑函数调用栈占用的空间：

```java
// 斐波那契数列递归实现：O(n)空间复杂度（递归深度）
public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}
```

### 3.3 时间与空间的权衡

在算法设计中，通常需要平衡时间和空间的使用：

1. **空间换时间**：使用额外空间来减少计算时间
   - 例：动态规划中的记忆化搜索，哈希表缓存结果

2. **时间换空间**：增加计算来减少空间占用
   - 例：重新计算中间结果而不是存储

## 4. 复杂度分析实例

### 4.1 示例1：两数之和问题

**问题**：给定一个整数数组和目标值，找出数组中两个数字之和等于目标值的索引。

**朴素解法**：双重循环

```java
// 时间复杂度: O(n²)
// 空间复杂度: O(1)
public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[]{i, j};
            }
        }
    }
    return new int[]{-1, -1};
}
```

**优化解法**：使用哈希表

```java
// 时间复杂度: O(n)
// 空间复杂度: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{-1, -1};
}
```

### 4.2 示例2：合并排序

**问题**：给定两个已排序的数组，将它们合并为一个排序数组。

```java
// 时间复杂度: O(n+m)
// 空间复杂度: O(n+m)
public int[] merge(int[] nums1, int[] nums2) {
    int n = nums1.length;
    int m = nums2.length;
    int[] result = new int[n + m];

    int i = 0, j = 0, k = 0;
    while (i < n && j < m) {
        if (nums1[i] <= nums2[j]) {
            result[k++] = nums1[i++];
        } else {
            result[k++] = nums2[j++];
        }
    }

    while (i < n) {
        result[k++] = nums1[i++];
    }

    while (j < m) {
        result[k++] = nums2[j++];
    }

    return result;
}
```

### 4.3 示例3：计算第n个斐波那契数

**递归解法**：

```java
// 时间复杂度: O(2^n)
// 空间复杂度: O(n)
public int fibRecursive(int n) {
    if (n <= 1) return n;
    return fibRecursive(n-1) + fibRecursive(n-2);
}
```

**动态规划解法**：

```java
// 时间复杂度: O(n)
// 空间复杂度: O(n)
public int fibDP(int n) {
    if (n <= 1) return n;

    int[] dp = new int[n+1];
    dp[0] = 0;
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }

    return dp[n];
}
```

**优化解法**：

```java
// 时间复杂度: O(n)
// 空间复杂度: O(1)
public int fibOptimized(int n) {
    if (n <= 1) return n;

    int prev = 0;
    int curr = 1;

    for (int i = 2; i <= n; i++) {
        int next = prev + curr;
        prev = curr;
        curr = next;
    }

    return curr;
}
```

## 5. 复杂度分析的实际应用

### 5.1 算法选择

根据输入规模选择合适的算法：

| 输入规模 | 合适的时间复杂度 |
|---------|----------------|
| n ≤ 10 | O(n!), O(2^n) |
| n ≤ 20 | O(2^n) |
| n ≤ 500 | O(n^3) |
| n ≤ 5000 | O(n^2) |
| n ≤ 10^6 | O(n log n) |
| n > 10^6 | O(n), O(log n), O(1) |

### 5.2 性能优化技巧

1. **减少嵌套循环**：尽量避免多层嵌套循环
2. **使用适当的数据结构**：哈希表、堆、平衡树等可以提高效率
3. **缓存结果**：避免重复计算
4. **懒加载**：延迟计算直到真正需要
5. **分而治之**：将大问题分解为小问题并解决

### 5.3 算法优化案例

#### 5.3.1 从O(n²)到O(n log n)

**问题**：计算数组中的逆序对数量。

**朴素解法** (O(n²)):
```java
public int countInversions(int[] arr) {
    int count = 0;
    for (int i = 0; i < arr.length; i++) {
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                count++;
            }
        }
    }
    return count;
}
```

**优化解法** (O(n log n))：使用归并排序思想
```java
public int mergeSort(int[] arr, int[] temp, int left, int right) {
    int inversions = 0;
    if (left < right) {
        int mid = (left + right) / 2;

        // 统计左半部分的逆序对
        inversions += mergeSort(arr, temp, left, mid);

        // 统计右半部分的逆序对
        inversions += mergeSort(arr, temp, mid + 1, right);

        // 统计跨越左右两部分的逆序对
        inversions += merge(arr, temp, left, mid, right);
    }
    return inversions;
}

public int merge(int[] arr, int[] temp, int left, int mid, int right) {
    // 合并两个已排序的部分并计算逆序对
    // 实现略...
}
```

## 6. 常见误区与注意事项

### 6.1 复杂度分析误区

1. **忽略常数因子**：当n很大时，常数因子通常可以忽略，但在实践中可能很重要
2. **仅关注时间复杂度**：忽略空间复杂度和其他因素
3. **忽略平均情况**：只考虑最坏情况可能导致对算法性能的误判

### 6.2 实际系统影响因素

实际系统性能受多种因素影响，不仅仅是渐进复杂度：

1. **硬件架构**：缓存大小、CPU流水线、分支预测等
2. **内存访问模式**：局部性原理、缓存命中率
3. **输入分布**：实际数据可能有特定分布，影响算法性能
4. **系统开销**：函数调用、内存分配等

### 6.3 平均情况vs最坏情况

在实际应用中，需权衡考虑算法的平均性能和最坏性能：

- **快速排序** vs **归并排序**：
  - 快速排序平均情况更优，但最坏情况为O(n²)
  - 归并排序保证O(n log n)，但常数因子较大

## 7. 总结

算法复杂度分析是评估和比较算法效率的重要工具。通过理解时间和空间复杂度，可以：

1. **选择合适的算法**：根据问题规模和约束选择最合适的解决方案
2. **预测性能瓶颈**：在系统设计早期识别潜在的性能问题
3. **优化关键代码**：识别并优化程序中复杂度较高的部分

掌握算法复杂度分析不仅有助于编写高效代码，也是深入理解算法设计与计算机科学基础的关键。在实际工作中，应结合理论分析和实际测试，做出明智的设计决策。