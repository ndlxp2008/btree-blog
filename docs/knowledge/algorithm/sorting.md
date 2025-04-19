# 排序算法

排序算法是计算机科学中最基础也是最重要的算法之一，它的目标是将一组数据按照特定顺序（通常是升序或降序）重新排列。本文档介绍常见的排序算法及其实现、复杂度分析和适用场景。

## 目录

- [排序算法](#排序算法)
  - [目录](#目录)
  - [1. 排序算法概述](#1-排序算法概述)
    - [1.1 排序算法的分类](#11-排序算法的分类)
    - [1.2 评价排序算法的指标](#12-评价排序算法的指标)
    - [1.3 排序算法的稳定性](#13-排序算法的稳定性)
  - [2. 基础排序算法](#2-基础排序算法)
    - [2.1 冒泡排序 (Bubble Sort)](#21-冒泡排序-bubble-sort)
    - [2.2 选择排序 (Selection Sort)](#22-选择排序-selection-sort)
    - [2.3 插入排序 (Insertion Sort)](#23-插入排序-insertion-sort)
  - [3. 高级排序算法](#3-高级排序算法)
    - [3.1 快速排序 (Quick Sort)](#31-快速排序-quick-sort)
    - [3.2 归并排序 (Merge Sort)](#32-归并排序-merge-sort)
    - [3.3 堆排序 (Heap Sort)](#33-堆排序-heap-sort)
  - [4. 特殊排序算法](#4-特殊排序算法)
    - [4.1 希尔排序 (Shell Sort)](#41-希尔排序-shell-sort)
    - [4.2 计数排序 (Counting Sort)](#42-计数排序-counting-sort)
    - [4.3 基数排序 (Radix Sort)](#43-基数排序-radix-sort)
    - [4.4 桶排序 (Bucket Sort)](#44-桶排序-bucket-sort)
  - [5. 排序算法的比较](#5-排序算法的比较)
  - [6. 实际应用中的选择](#6-实际应用中的选择)
  - [7. 排序算法可视化](#7-排序算法可视化)

## 1. 排序算法概述

### 1.1 排序算法的分类

排序算法可以从多个维度进行分类：

- **比较类排序**：通过比较来决定元素间的相对次序
  - 交换排序（冒泡排序、快速排序）
  - 插入排序（简单插入排序、希尔排序）
  - 选择排序（简单选择排序、堆排序）
  - 归并排序

- **非比较类排序**：不通过比较来决定元素间的相对次序
  - 计数排序
  - 基数排序
  - 桶排序

### 1.2 评价排序算法的指标

- **时间复杂度**：算法执行所需的时间
  - 最好情况
  - 平均情况
  - 最坏情况

- **空间复杂度**：算法执行所需的额外空间

- **稳定性**：相等元素的相对位置是否改变

### 1.3 排序算法的稳定性

**稳定**的排序算法会保持相等元素的相对位置不变，这在多条件排序时特别重要。

稳定的排序算法包括：
- 冒泡排序
- 插入排序
- 归并排序
- 计数排序
- 基数排序
- 桶排序

不稳定的排序算法包括：
- 选择排序
- 希尔排序
- 快速排序
- 堆排序

## 2. 基础排序算法

### 2.1 冒泡排序 (Bubble Sort)

**基本思想**：
重复遍历待排序序列，每次比较相邻元素，如果顺序错误则交换，每轮遍历后最大元素"浮"到序列末尾。

**代码实现**：
```java
public void bubbleSort(int[] arr) {
    int n = arr.length;
    boolean swapped;

    for (int i = 0; i < n - 1; i++) {
        swapped = false;

        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换 arr[j] 和 arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }

        // 如果没有发生交换，则数组已排序
        if (!swapped) {
            break;
        }
    }
}
```

**复杂度分析**：
- 时间复杂度：
  - 最好情况：O(n)，当数组已排序
  - 平均情况：O(n²)
  - 最坏情况：O(n²)，当数组逆序
- 空间复杂度：O(1)
- 稳定性：稳定

**优缺点**：
- 优点：实现简单，对小数据集效率还行
- 缺点：对于大数据集性能较差

### 2.2 选择排序 (Selection Sort)

**基本思想**：
每次从未排序部分找出最小元素，放到已排序部分的末尾。

**代码实现**：
```java
public void selectionSort(int[] arr) {
    int n = arr.length;

    for (int i = 0; i < n - 1; i++) {
        // 寻找未排序部分的最小元素
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        // 将找到的最小元素放到已排序部分的末尾
        int temp = arr[minIndex];
        arr[minIndex] = arr[i];
        arr[i] = temp;
    }
}
```

**复杂度分析**：
- 时间复杂度：O(n²)，无论输入如何都执行相同次数的比较和交换
- 空间复杂度：O(1)
- 稳定性：不稳定

**优缺点**：
- 优点：交换次数少，适合交换代价高的情况
- 缺点：时间复杂度固定为O(n²)

### 2.3 插入排序 (Insertion Sort)

**基本思想**：
构建有序序列，对未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

**代码实现**：
```java
public void insertionSort(int[] arr) {
    int n = arr.length;

    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        // 将大于key的元素向右移动
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

**复杂度分析**：
- 时间复杂度：
  - 最好情况：O(n)，当数组已排序
  - 平均情况：O(n²)
  - 最坏情况：O(n²)，当数组逆序
- 空间复杂度：O(1)
- 稳定性：稳定

**优缺点**：
- 优点：对于小规模或接近有序的数据非常高效
- 缺点：对于大规模乱序数据效率低

## 3. 高级排序算法

### 3.1 快速排序 (Quick Sort)

**基本思想**：
选择一个基准元素，将数组分为两部分，一部分小于基准，一部分大于基准，然后递归排序这两部分。

**代码实现**：
```java
public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        // 分区操作，返回基准点位置
        int pivot = partition(arr, low, high);

        // 递归排序左右两部分
        quickSort(arr, low, pivot - 1);
        quickSort(arr, pivot + 1, high);
    }
}

private int partition(int[] arr, int low, int high) {
    // 选择最后一个元素作为基准
    int pivot = arr[high];
    int i = low - 1; // 小于基准的元素最后一个位置

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            // 交换元素
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    // 将基准放到正确位置
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    return i + 1; // 返回基准位置
}
```

**复杂度分析**：
- 时间复杂度：
  - 平均情况：O(n log n)
  - 最坏情况：O(n²)，当输入数组已排序或逆序
- 空间复杂度：O(log n)，递归调用栈
- 稳定性：不稳定

**优化策略**：
- 随机选择基准元素
- 三数取中法选择基准
- 处理小规模子数组时切换到插入排序
- 尾递归优化

### 3.2 归并排序 (Merge Sort)

**基本思想**：
将数组分成两半分别排序，然后合并这两个有序数组。使用分治法（Divide and Conquer）。

**代码实现**：
```java
public void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        // 找出中间点
        int mid = left + (right - left) / 2;

        // 递归排序左右两半
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);

        // 合并已排序的两半
        merge(arr, left, mid, right);
    }
}

private void merge(int[] arr, int left, int mid, int right) {
    // 计算两个子数组的大小
    int n1 = mid - left + 1;
    int n2 = right - mid;

    // 创建临时数组
    int[] L = new int[n1];
    int[] R = new int[n2];

    // 复制数据到临时数组
    for (int i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
    }

    // 合并两个临时数组
    int i = 0, j = 0;
    int k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    // 复制L[]的剩余元素
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    // 复制R[]的剩余元素
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}
```

**复杂度分析**：
- 时间复杂度：O(n log n)，各种情况下都是
- 空间复杂度：O(n)
- 稳定性：稳定

**优缺点**：
- 优点：稳定且时间复杂度固定，适合大规模数据排序
- 缺点：需要额外空间，不是原地排序算法

### 3.3 堆排序 (Heap Sort)

**基本思想**：
利用堆这种数据结构所设计的排序算法。将数组视为二叉堆，先构建最大堆，然后将堆顶元素与末尾元素交换，调整堆结构。

**代码实现**：
```java
public void heapSort(int[] arr) {
    int n = arr.length;

    // 构建最大堆
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // 逐个将堆顶元素（最大值）移到数组末尾
    for (int i = n - 1; i > 0; i--) {
        // 将当前最大元素移到末尾
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        // 重新调整剩余元素为最大堆
        heapify(arr, i, 0);
    }
}

private void heapify(int[] arr, int n, int i) {
    int largest = i; // 初始化最大元素为根节点
    int left = 2 * i + 1; // 左子节点
    int right = 2 * i + 2; // 右子节点

    // 如果左子节点大于根节点
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    // 如果右子节点大于当前最大值
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    // 如果最大元素不是根节点，交换并继续调整堆
    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;

        // 递归调整受影响的子树
        heapify(arr, n, largest);
    }
}
```

**复杂度分析**：
- 时间复杂度：O(n log n)，各种情况下都是
- 空间复杂度：O(1)
- 稳定性：不稳定

**优缺点**：
- 优点：是原地排序算法，不需要额外空间，时间复杂度恒定
- 缺点：实现较复杂，不稳定

## 4. 特殊排序算法

### 4.1 希尔排序 (Shell Sort)

**基本思想**：
插入排序的改进版，通过将序列按步长分组后进行插入排序，逐步减小步长直至为1。

**代码实现**：
```java
public void shellSort(int[] arr) {
    int n = arr.length;

    // 设定初始步长gap，逐步缩小
    for (int gap = n/2; gap > 0; gap /= 2) {
        // 对各个分组进行插入排序
        for (int i = gap; i < n; i++) {
            // 将arr[i]插入到所在分组的正确位置
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
}
```

**复杂度分析**：
- 时间复杂度：取决于步长序列，最坏为O(n²)，使用合适步长可达到O(n^1.3)
- 空间复杂度：O(1)
- 稳定性：不稳定

**优缺点**：
- 优点：对于中等规模数据效率高，不需要额外空间
- 缺点：最优步长序列的选择比较复杂

### 4.2 计数排序 (Counting Sort)

**基本思想**：
统计小于等于每个元素的个数，然后根据统计结果将元素放到正确位置。适用于范围较小的整数。

**代码实现**：
```java
public void countingSort(int[] arr) {
    if (arr.length == 0) return;

    // 找出最大值
    int max = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    // 创建计数数组
    int[] count = new int[max + 1];

    // 统计每个元素出现次数
    for (int i = 0; i < arr.length; i++) {
        count[arr[i]]++;
    }

    // 累加统计小于等于当前元素的个数
    for (int i = 1; i <= max; i++) {
        count[i] += count[i - 1];
    }

    // 创建结果数组
    int[] output = new int[arr.length];

    // 从后向前遍历，保证稳定性
    for (int i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }

    // 复制结果到原数组
    for (int i = 0; i < arr.length; i++) {
        arr[i] = output[i];
    }
}
```

**复杂度分析**：
- 时间复杂度：O(n + k)，其中k是元素的范围
- 空间复杂度：O(n + k)
- 稳定性：稳定

**优缺点**：
- 优点：对于元素范围较小的数据集，效率非常高
- 缺点：需要额外空间，且当元素范围很大时效率降低

### 4.3 基数排序 (Radix Sort)

**基本思想**：
从最低有效位开始，依次对每一位进行排序（通常使用计数排序）。

**代码实现**：
```java
public void radixSort(int[] arr) {
    // 找出最大值
    int max = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    // 对每一位进行计数排序
    for (int exp = 1; max / exp > 0; exp *= 10) {
        countingSortByDigit(arr, exp);
    }
}

private void countingSortByDigit(int[] arr, int exp) {
    int n = arr.length;
    int[] output = new int[n];
    int[] count = new int[10]; // 0-9的计数

    // 统计当前位上每个数字出现的次数
    for (int i = 0; i < n; i++) {
        count[(arr[i] / exp) % 10]++;
    }

    // 累加统计
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // 从后向前构建输出数组
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    // 复制到原数组
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}
```

**复杂度分析**：
- 时间复杂度：O(d(n + k))，其中d是最大数字的位数，k是进制（这里是10）
- 空间复杂度：O(n + k)
- 稳定性：稳定

**优缺点**：
- 优点：适用于整数和字符串排序，且可以避开比较操作
- 缺点：需要额外空间，且对于位数不同的元素效率不一

### 4.4 桶排序 (Bucket Sort)

**基本思想**：
将元素分到有限数量的桶中，对每个桶分别排序，然后合并结果。

**代码实现**：
```java
public void bucketSort(double[] arr) {
    int n = arr.length;
    if (n <= 0) return;

    // 创建桶
    List<List<Double>> buckets = new ArrayList<>(n);
    for (int i = 0; i < n; i++) {
        buckets.add(new ArrayList<>());
    }

    // 将元素分配到桶中
    for (int i = 0; i < n; i++) {
        int bucketIndex = (int) (n * arr[i]);
        buckets.get(bucketIndex).add(arr[i]);
    }

    // 对每个桶内部排序
    for (int i = 0; i < n; i++) {
        Collections.sort(buckets.get(i));
    }

    // 合并桶中元素
    int index = 0;
    for (int i = 0; i < n; i++) {
        for (double value : buckets.get(i)) {
            arr[index++] = value;
        }
    }
}
```

**复杂度分析**：
- 时间复杂度：
  - 平均情况：O(n + k)，其中k是桶的个数
  - 最坏情况：O(n²)，当所有元素都被分到同一个桶中
- 空间复杂度：O(n + k)
- 稳定性：取决于桶内排序算法，一般实现为稳定

**优缺点**：
- 优点：当元素分布均匀时效率很高
- 缺点：需要额外空间，且当元素分布不均匀时效率降低

## 5. 排序算法的比较

| 排序算法 | 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 | 稳定性 |
|---------|--------------|---------|---------|-----------|-------|
| 冒泡排序 | O(n²) | O(n) | O(n²) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(n²) | O(1) | 不稳定 |
| 插入排序 | O(n²) | O(n) | O(n²) | O(1) | 稳定 |
| 快速排序 | O(n log n) | O(n log n) | O(n²) | O(log n) | 不稳定 |
| 归并排序 | O(n log n) | O(n log n) | O(n log n) | O(n) | 稳定 |
| 堆排序 | O(n log n) | O(n log n) | O(n log n) | O(1) | 不稳定 |
| 希尔排序 | O(n log n) ~ O(n²) | O(n log n) | O(n²) | O(1) | 不稳定 |
| 计数排序 | O(n + k) | O(n + k) | O(n + k) | O(n + k) | 稳定 |
| 基数排序 | O(d(n + k)) | O(d(n + k)) | O(d(n + k)) | O(n + k) | 稳定 |
| 桶排序 | O(n + k) | O(n + k) | O(n²) | O(n + k) | 稳定 |

## 6. 实际应用中的选择

在实际应用中，选择合适的排序算法需要考虑以下因素：

1. **数据规模**：
   - 小规模数据（< 50元素）：插入排序
   - 中等规模：快速排序、归并排序、堆排序
   - 大规模：归并排序、基数排序（特定条件下）

2. **数据特征**：
   - 已经部分有序：插入排序
   - 取值范围小的整数：计数排序
   - 均匀分布的数据：桶排序
   - 带有限位数的整数：基数排序

3. **内存限制**：
   - 内存受限：堆排序、希尔排序（原地排序算法）
   - 足够内存：归并排序、快速排序

4. **稳定性要求**：
   - 需要稳定：归并排序、插入排序、冒泡排序
   - 不需要稳定：快速排序、堆排序

5. **实现复杂度**：
   - 简单实现：插入排序、冒泡排序
   - 复杂实现：快速排序、归并排序、堆排序

**常见应用场景示例**：
- Java中的`Arrays.sort()`对基本类型使用变种的快速排序，对对象使用归并排序
- 数据库索引通常使用B树或B+树，内部节点排序可能采用插入排序
- 大规模外部排序常用归并排序的变种
- 嵌入式系统常用插入排序或希尔排序，以减少代码大小

## 7. 排序算法可视化

理解排序算法的运行过程可以通过可视化工具更直观：

- [VisuAlgo](https://visualgo.net/en/sorting) - 提供多种排序算法的可视化
- [Sorting Algorithms Animations](https://www.toptal.com/developers/sorting-algorithms) - 排序算法并行比较
- [Algorithm Visualizer](https://algorithm-visualizer.org/) - 排序算法可视化工具