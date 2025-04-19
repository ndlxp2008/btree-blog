# 排序算法

排序算法是计算机科学中最基础也是最重要的算法之一，它们用于将一组数据按照特定顺序重新排列。

## 排序算法概述

### 常见衡量指标

1. **时间复杂度**：算法执行所需的时间
2. **空间复杂度**：算法执行所需的额外空间
3. **稳定性**：相同键值的元素在排序前后相对位置是否改变
4. **内部排序与外部排序**：数据是否完全加载到内存

## 常见排序算法

### 1. 冒泡排序 (Bubble Sort)

通过重复比较相邻元素并交换位置，使较大元素"冒泡"到数组末端。

```java
public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换arr[j]和arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}
```

- **时间复杂度**：O(n²)
- **空间复杂度**：O(1)
- **稳定性**：稳定

### 2. 选择排序 (Selection Sort)

每次从未排序部分找出最小元素，放到已排序部分的末尾。

```java
public void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        // 交换元素
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}
```

- **时间复杂度**：O(n²)
- **空间复杂度**：O(1)
- **稳定性**：不稳定

### 3. 插入排序 (Insertion Sort)

构建有序序列，对未排序数据，在已排序序列中从后向前扫描，找到相应位置插入。

```java
public void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        // 将比key大的元素向右移动
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

- **时间复杂度**：O(n²)，最好情况O(n)
- **空间复杂度**：O(1)
- **稳定性**：稳定

### 4. 希尔排序 (Shell Sort)

插入排序的改进版，通过增量序列对间隔为h的元素进行插入排序。

```java
public void shellSort(int[] arr) {
    int n = arr.length;
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
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

- **时间复杂度**：取决于步长序列，平均为O(n^1.3)
- **空间复杂度**：O(1)
- **稳定性**：不稳定

### 5. 归并排序 (Merge Sort)

分治算法，将数组分成两半，排序后合并。

```java
public void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

private void merge(int[] arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int[] L = new int[n1];
    int[] R = new int[n2];

    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
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

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}
```

- **时间复杂度**：O(n log n)
- **空间复杂度**：O(n)
- **稳定性**：稳定

### 6. 快速排序 (Quick Sort)

选择一个"基准"元素，将小于基准的元素放在左边，大于基准的放在右边，递归排序子数组。

```java
public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

private int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            // 交换元素
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    // 交换pivot到正确位置
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    return i + 1;
}
```

- **时间复杂度**：平均O(n log n)，最坏O(n²)
- **空间复杂度**：O(log n)
- **稳定性**：不稳定

### 7. 堆排序 (Heap Sort)

利用堆这种数据结构所设计的排序算法。

```java
public void heapSort(int[] arr) {
    int n = arr.length;

    // 构建最大堆
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // 从堆顶取出元素
    for (int i = n - 1; i > 0; i--) {
        // 交换当前根与末尾元素
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        // 调整剩余堆
        heapify(arr, i, 0);
    }
}

private void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;

    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;

        heapify(arr, n, largest);
    }
}
```

- **时间复杂度**：O(n log n)
- **空间复杂度**：O(1)
- **稳定性**：不稳定

### 8. 计数排序 (Counting Sort)

利用数组下标来确定元素位置的排序方式。

```java
public void countingSort(int[] arr) {
    int n = arr.length;

    // 找出最大值
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    // 创建计数数组
    int[] count = new int[max + 1];

    // 统计每个元素出现次数
    for (int i = 0; i < n; i++) {
        count[arr[i]]++;
    }

    // 重建排序数组
    int index = 0;
    for (int i = 0; i <= max; i++) {
        while (count[i] > 0) {
            arr[index++] = i;
            count[i]--;
        }
    }
}
```

- **时间复杂度**：O(n+k)，k为数据范围
- **空间复杂度**：O(k)
- **稳定性**：稳定

### 9. 桶排序 (Bucket Sort)

将数据分到有限数量的桶里，每个桶再分别排序。

```java
public void bucketSort(float[] arr) {
    int n = arr.length;
    if (n <= 0) return;

    // 创建桶
    @SuppressWarnings("unchecked")
    List<Float>[] buckets = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        buckets[i] = new ArrayList<>();
    }

    // 将元素放入桶中
    for (int i = 0; i < n; i++) {
        int bucketIndex = (int) (n * arr[i]);
        buckets[bucketIndex].add(arr[i]);
    }

    // 对每个桶排序
    for (int i = 0; i < n; i++) {
        Collections.sort(buckets[i]);
    }

    // 合并桶中元素
    int index = 0;
    for (int i = 0; i < n; i++) {
        for (float num : buckets[i]) {
            arr[index++] = num;
        }
    }
}
```

- **时间复杂度**：平均O(n+k)
- **空间复杂度**：O(n+k)
- **稳定性**：稳定

### 10. 基数排序 (Radix Sort)

按照低位先排序，然后收集；再按照高位排序，然后再收集。

```java
public void radixSort(int[] arr) {
    int n = arr.length;

    // 找出最大值
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    // 对每一位进行计数排序
    for (int exp = 1; max / exp > 0; exp *= 10) {
        countingSortByDigit(arr, n, exp);
    }
}

private void countingSortByDigit(int[] arr, int n, int exp) {
    int[] output = new int[n];
    int[] count = new int[10];

    // 统计每个位上的数字出现次数
    for (int i = 0; i < n; i++) {
        count[(arr[i] / exp) % 10]++;
    }

    // 计算位置
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // 构建输出数组
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

- **时间复杂度**：O(d*(n+k))，d为位数，k为基数
- **空间复杂度**：O(n+k)
- **稳定性**：稳定

## 排序算法比较

| 排序算法 | 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 | 稳定性 |
|---------|--------------|---------|---------|-----------|-------|
| 冒泡排序 | O(n²)        | O(n)    | O(n²)   | O(1)      | 稳定   |
| 选择排序 | O(n²)        | O(n²)   | O(n²)   | O(1)      | 不稳定 |
| 插入排序 | O(n²)        | O(n)    | O(n²)   | O(1)      | 稳定   |
| 希尔排序 | O(n^1.3)     | O(n)    | O(n²)   | O(1)      | 不稳定 |
| 归并排序 | O(n log n)   | O(n log n) | O(n log n) | O(n) | 稳定   |
| 快速排序 | O(n log n)   | O(n log n) | O(n²)   | O(log n) | 不稳定 |
| 堆排序   | O(n log n)   | O(n log n) | O(n log n) | O(1) | 不稳定 |
| 计数排序 | O(n+k)       | O(n+k)  | O(n+k)  | O(k)      | 稳定   |
| 桶排序   | O(n+k)       | O(n+k)  | O(n²)   | O(n+k)    | 稳定   |
| 基数排序 | O(d*(n+k))   | O(d*(n+k)) | O(d*(n+k)) | O(n+k) | 稳定 |

## 如何选择排序算法

1. **数据量小**：简单算法如插入排序通常更快
2. **数据量大**：
   - 内存受限：归并排序
   - 要求稳定：归并排序
   - 平均性能要求高：快速排序
3. **数据特性**：
   - 数据基本有序：插入排序
   - 数据范围有限：计数排序、基数排序
   - 数据分布均匀：桶排序

## 实际应用中的排序

1. **系统排序函数**：多采用快速排序、归并排序或堆排序的混合策略
2. **数据库排序**：常用B树索引加速排序
3. **大数据排序**：外部归并排序