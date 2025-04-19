# 贪心算法

贪心算法(Greedy Algorithm)是一种在每一步选择中都采取当前状态下最好或最优的选择，从而希望导致结果是最好或最优的算法。贪心算法在有最优子结构的问题中尤为有效。本文档介绍贪心算法的基本概念、应用场景以及经典问题。

## 1. 基本概念

### 1.1 定义

贪心算法是一种通过局部最优选择来寻找全局最优解的方法。在每一步决策中，贪心算法都选择当前看起来最好的选择，而不考虑未来可能的后果。

### 1.2 贪心策略的特点

- **贪心选择性**：算法通过一系列步骤来构建解决方案，每一步都做出当时看起来最优的选择。
- **无回溯**：一旦做出选择，就不再改变，不像动态规划会考虑多种可能性。
- **局部最优**：在每一步都选择局部最优解，希望最终能达到全局最优解。

### 1.3 适用条件

贪心算法能够得到全局最优解的问题通常具备以下两个性质：

1. **贪心选择性质**：局部最优选择能导致全局最优解。
2. **最优子结构**：问题的最优解包含其子问题的最优解。

### 1.4 与动态规划的比较

| 特性 | 贪心算法 | 动态规划 |
|------|---------|---------|
| 策略 | 做出当前最优选择 | 考虑所有可能的选择并保存子问题解 |
| 适用问题 | 具有贪心选择性质 | 具有重叠子问题和最优子结构 |
| 时间复杂度 | 通常更低 | 通常更高 |
| 解的质量 | 部分问题可得到全局最优解 | 能保证得到全局最优解 |
| 实现复杂度 | 通常更简单 | 通常更复杂 |

## 2. 经典贪心算法问题

### 2.1 活动选择问题

**问题描述**：有n个活动，每个活动有开始时间和结束时间。要求选择尽可能多的活动，使得所选活动互不重叠。

**贪心策略**：按照活动的结束时间排序，每次选择结束时间最早的、与已选活动不冲突的活动。

**代码实现**：
```java
public class ActivitySelection {
    public static int maxActivities(int[] start, int[] finish) {
        int n = start.length;

        // 按结束时间排序
        // 这里假设输入的活动已经按结束时间排序

        int count = 1; // 至少选择第一个活动
        int lastEnd = finish[0];

        for (int i = 1; i < n; i++) {
            // 如果当前活动的开始时间大于等于上一个选择的活动的结束时间
            if (start[i] >= lastEnd) {
                count++;
                lastEnd = finish[i];
            }
        }

        return count;
    }

    public static void main(String[] args) {
        int[] start = {1, 3, 0, 5, 8, 5};
        int[] finish = {2, 4, 6, 7, 9, 9};

        System.out.println("最多可选择的活动数: " + maxActivities(start, finish));
    }
}
```

### 2.2 分数背包问题

**问题描述**：有n个物品，每个物品有重量和价值。背包最大承重为W，物品可以分割，求解如何选择物品放入背包使总价值最大。

**贪心策略**：计算每个物品的单位重量价值（价值/重量），按单位价值降序排列，优先选择单位价值高的物品。

**代码实现**：
```java
class Item {
    double weight;
    double value;

    public Item(double weight, double value) {
        this.weight = weight;
        this.value = value;
    }

    public double getUnitValue() {
        return value / weight;
    }
}

public class FractionalKnapsack {
    public static double getMaxValue(Item[] items, double capacity) {
        // 按单位价值降序排序
        Arrays.sort(items, (a, b) -> Double.compare(b.getUnitValue(), a.getUnitValue()));

        double totalValue = 0;
        double currentWeight = 0;

        for (Item item : items) {
            if (currentWeight + item.weight <= capacity) {
                // 可以完整放入
                currentWeight += item.weight;
                totalValue += item.value;
            } else {
                // 只能部分放入
                double remainingCapacity = capacity - currentWeight;
                totalValue += item.getUnitValue() * remainingCapacity;
                break;
            }
        }

        return totalValue;
    }

    public static void main(String[] args) {
        Item[] items = {
            new Item(10, 60),
            new Item(20, 100),
            new Item(30, 120)
        };
        double capacity = 50;

        System.out.println("最大价值: " + getMaxValue(items, capacity));
    }
}
```

### 2.3 霍夫曼编码

**问题描述**：给定一组字符及其出现频率，设计一种编码方式，使得编码后的平均长度最小。

**贪心策略**：使用最小堆（优先队列）构建霍夫曼树，频率低的字符编码长，频率高的字符编码短。

**代码实现**：
```java
class HuffmanNode {
    char data;
    int frequency;
    HuffmanNode left, right;

    public HuffmanNode(char data, int frequency) {
        this.data = data;
        this.frequency = frequency;
        left = right = null;
    }
}

public class HuffmanCoding {
    public static void printCodes(HuffmanNode root, String code) {
        if (root == null) {
            return;
        }

        // 是叶子节点
        if (root.left == null && root.right == null && Character.isLetter(root.data)) {
            System.out.println(root.data + ": " + code);
            return;
        }

        // 递归左右子树
        printCodes(root.left, code + "0");
        printCodes(root.right, code + "1");
    }

    public static HuffmanNode buildHuffmanTree(char[] data, int[] freq, int size) {
        // 创建优先队列（最小堆）
        PriorityQueue<HuffmanNode> pq = new PriorityQueue<>(
            (a, b) -> a.frequency - b.frequency
        );

        // 创建叶子节点并加入优先队列
        for (int i = 0; i < size; i++) {
            pq.add(new HuffmanNode(data[i], freq[i]));
        }

        // 构建霍夫曼树
        while (pq.size() > 1) {
            // 取出两个频率最小的节点
            HuffmanNode left = pq.poll();
            HuffmanNode right = pq.poll();

            // 创建内部节点，频率为两个子节点之和
            HuffmanNode node = new HuffmanNode('$', left.frequency + right.frequency);
            node.left = left;
            node.right = right;

            // 将新节点加入优先队列
            pq.add(node);
        }

        // 返回霍夫曼树的根节点
        return pq.peek();
    }

    public static void main(String[] args) {
        char[] data = {'a', 'b', 'c', 'd', 'e', 'f'};
        int[] freq = {5, 9, 12, 13, 16, 45};

        HuffmanNode root = buildHuffmanTree(data, freq, data.length);
        System.out.println("霍夫曼编码:");
        printCodes(root, "");
    }
}
```

### 2.4 最小生成树问题

#### 2.4.1 Kruskal 算法

**问题描述**：在带权无向图中找到一棵最小生成树，使得树中所有边的权重和最小。

**贪心策略**：按边的权重从小到大排序，每次选择不会形成环的最小权重边。

**代码实现**：
```java
class Edge implements Comparable<Edge> {
    int src, dest, weight;

    public Edge(int src, int dest, int weight) {
        this.src = src;
        this.dest = dest;
        this.weight = weight;
    }

    @Override
    public int compareTo(Edge other) {
        return this.weight - other.weight;
    }
}

class DisjointSet {
    int[] parent, rank;

    public DisjointSet(int n) {
        parent = new int[n];
        rank = new int[n];

        // 初始化
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    // 查找操作
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // 路径压缩
        }
        return parent[x];
    }

    // 合并操作
    public void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return;

        // 按秩合并
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }
}

public class KruskalMST {
    public static List<Edge> findMST(List<Edge> edges, int vertices) {
        // 结果列表，存储MST的边
        List<Edge> result = new ArrayList<>();

        // 按权重排序
        Collections.sort(edges);

        // 创建并查集
        DisjointSet ds = new DisjointSet(vertices);

        int edgeCount = 0;
        int index = 0;

        // 选择V-1条边
        while (edgeCount < vertices - 1 && index < edges.size()) {
            Edge edge = edges.get(index++);

            int srcRoot = ds.find(edge.src);
            int destRoot = ds.find(edge.dest);

            // 如果不形成环，则加入结果
            if (srcRoot != destRoot) {
                result.add(edge);
                ds.union(srcRoot, destRoot);
                edgeCount++;
            }
        }

        return result;
    }

    public static void main(String[] args) {
        int vertices = 4;
        List<Edge> edges = Arrays.asList(
            new Edge(0, 1, 10),
            new Edge(0, 2, 6),
            new Edge(0, 3, 5),
            new Edge(1, 3, 15),
            new Edge(2, 3, 4)
        );

        List<Edge> mst = findMST(edges, vertices);

        System.out.println("最小生成树的边:");
        for (Edge edge : mst) {
            System.out.println(edge.src + " -- " + edge.dest + " == " + edge.weight);
        }
    }
}
```

#### 2.4.2 Prim 算法

**贪心策略**：从任意顶点开始，每次选择一条连接已选顶点集合和未选顶点集合的最小权重边。

**代码实现**：
```java
public class PrimMST {
    public static void findMST(int[][] graph, int vertices) {
        // 存储已选择的顶点
        boolean[] inMST = new boolean[vertices];

        // 存储MST中边的权重和父节点
        int[] key = new int[vertices];
        int[] parent = new int[vertices];

        // 初始化
        Arrays.fill(key, Integer.MAX_VALUE);
        Arrays.fill(parent, -1);

        // 从顶点0开始
        key[0] = 0;

        // MST包含V个顶点，需要选择V-1条边
        for (int count = 0; count < vertices - 1; count++) {
            // 找到未选择顶点中key值最小的
            int u = -1;
            int minKey = Integer.MAX_VALUE;

            for (int v = 0; v < vertices; v++) {
                if (!inMST[v] && key[v] < minKey) {
                    minKey = key[v];
                    u = v;
                }
            }

            // 将找到的顶点加入MST
            inMST[u] = true;

            // 更新相邻顶点的key值
            for (int v = 0; v < vertices; v++) {
                if (graph[u][v] != 0 && !inMST[v] && graph[u][v] < key[v]) {
                    parent[v] = u;
                    key[v] = graph[u][v];
                }
            }
        }

        // 打印MST
        System.out.println("边\t权重");
        for (int i = 1; i < vertices; i++) {
            System.out.println(parent[i] + " - " + i + "\t" + graph[i][parent[i]]);
        }
    }

    public static void main(String[] args) {
        int[][] graph = {
            {0, 2, 0, 6, 0},
            {2, 0, 3, 8, 5},
            {0, 3, 0, 0, 7},
            {6, 8, 0, 0, 9},
            {0, 5, 7, 9, 0}
        };

        findMST(graph, 5);
    }
}
```

### 2.5 Dijkstra 最短路径算法

**问题描述**：在带权有向图中，找到从一个顶点到其他所有顶点的最短路径。

**贪心策略**：每次选择当前已知最短路径的顶点，更新其相邻顶点的最短路径估计。

**代码实现**：
```java
public class Dijkstra {
    public static void findShortestPaths(int[][] graph, int src, int vertices) {
        // 最短距离数组
        int[] dist = new int[vertices];

        // 已处理的顶点集合
        boolean[] sptSet = new boolean[vertices];

        // 初始化
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        // 查找所有顶点的最短路径
        for (int count = 0; count < vertices - 1; count++) {
            // 找到未处理顶点中距离最小的
            int u = minDistance(dist, sptSet, vertices);

            // 标记为已处理
            sptSet[u] = true;

            // 更新相邻顶点的距离
            for (int v = 0; v < vertices; v++) {
                if (!sptSet[v] && graph[u][v] != 0 &&
                    dist[u] != Integer.MAX_VALUE &&
                    dist[u] + graph[u][v] < dist[v]) {
                    dist[v] = dist[u] + graph[u][v];
                }
            }
        }

        // 打印结果
        System.out.println("顶点\t距离");
        for (int i = 0; i < vertices; i++) {
            System.out.println(i + "\t" + dist[i]);
        }
    }

    private static int minDistance(int[] dist, boolean[] sptSet, int vertices) {
        int min = Integer.MAX_VALUE;
        int minIndex = -1;

        for (int v = 0; v < vertices; v++) {
            if (!sptSet[v] && dist[v] <= min) {
                min = dist[v];
                minIndex = v;
            }
        }

        return minIndex;
    }

    public static void main(String[] args) {
        int[][] graph = {
            {0, 4, 0, 0, 0, 0, 0, 8, 0},
            {4, 0, 8, 0, 0, 0, 0, 11, 0},
            {0, 8, 0, 7, 0, 4, 0, 0, 2},
            {0, 0, 7, 0, 9, 14, 0, 0, 0},
            {0, 0, 0, 9, 0, 10, 0, 0, 0},
            {0, 0, 4, 14, 10, 0, 2, 0, 0},
            {0, 0, 0, 0, 0, 2, 0, 1, 6},
            {8, 11, 0, 0, 0, 0, 1, 0, 7},
            {0, 0, 2, 0, 0, 0, 6, 7, 0}
        };

        findShortestPaths(graph, 0, 9);
    }
}
```

### 2.6 任务调度问题

**问题描述**：有n个任务，每个任务有截止时间和收益。如果在截止时间前完成任务，可以获得对应收益。每个任务需要1个单位时间执行，求解如何安排任务使得总收益最大。

**贪心策略**：按照收益降序排序任务，尽可能安排在截止时间前的最晚时刻。

**代码实现**：
```java
class Job {
    char id;
    int deadline;
    int profit;

    public Job(char id, int deadline, int profit) {
        this.id = id;
        this.deadline = deadline;
        this.profit = profit;
    }
}

public class JobScheduling {
    public static void scheduleJobs(Job[] jobs) {
        // 按照收益降序排序
        Arrays.sort(jobs, (a, b) -> b.profit - a.profit);

        // 找到最大截止时间
        int maxDeadline = 0;
        for (Job job : jobs) {
            maxDeadline = Math.max(maxDeadline, job.deadline);
        }

        // 初始化时间槽
        char[] result = new char[maxDeadline];
        boolean[] slot = new boolean[maxDeadline];

        // 填充任务
        for (Job job : jobs) {
            // 找到可用的最晚时间槽
            for (int j = Math.min(maxDeadline - 1, job.deadline - 1); j >= 0; j--) {
                if (!slot[j]) {
                    result[j] = job.id;
                    slot[j] = true;
                    break;
                }
            }
        }

        // 打印结果
        System.out.print("调度顺序: ");
        for (int i = 0; i < maxDeadline; i++) {
            if (slot[i]) {
                System.out.print(result[i] + " ");
            }
        }
        System.out.println();
    }

    public static void main(String[] args) {
        Job[] jobs = {
            new Job('a', 2, 100),
            new Job('b', 1, 19),
            new Job('c', 2, 27),
            new Job('d', 1, 25),
            new Job('e', 3, 15)
        };

        scheduleJobs(jobs);
    }
}
```

## 3. 贪心算法的应用场景

### 3.1 常见应用领域

1. **图论问题**
   - 最小生成树 (Kruskal 和 Prim 算法)
   - 最短路径 (Dijkstra 算法)
   - 图着色问题

2. **系统设计**
   - 任务调度
   - 资源分配
   - 负载均衡

3. **数据压缩**
   - 霍夫曼编码
   - 游程编码 (Run-length encoding)

4. **网络路由**
   - 路由表优化
   - 带宽分配

5. **机器学习**
   - 决策树算法中的特征选择
   - 贪心特征选择

### 3.2 现实生活中的应用

1. **找零钱问题**：使用最少的纸币和硬币组合找零。
2. **会议室安排**：在有限的会议室中安排尽可能多的会议。
3. **文件存储系统**：优化文件存储以最小化访问时间。
4. **网络资源分配**：分配网络带宽使得总体满意度最大。

## 4. 贪心算法的实现技巧

### 4.1 通用实现步骤

1. **定义问题**：明确要优化的目标函数和约束条件。
2. **确定贪心策略**：找到每一步的最优选择标准。
3. **证明策略可行**：论证局部最优选择能导致全局最优解（如果可能）。
4. **实现算法**：按照贪心策略实现求解过程。
5. **优化和测试**：检查边界情况，优化算法效率。

### 4.2 常用数据结构

- **优先队列/堆**：快速获取当前最优选择。
- **排序**：按特定条件排序后顺序处理。
- **贪心和动态规划结合**：有些问题可以先用贪心算法得到近似解，再用动态规划优化。

### 4.3 常见误区

1. **过度信任贪心策略**：并非所有问题都适合贪心算法，需要证明贪心选择性质。
2. **忽略边界情况**：特别是空集合、单元素集合、极端值等情况。
3. **误判贪心标准**：选择不恰当的贪心策略会导致非最优解。

## 5. 贪心算法的缺点和局限性

### 5.1 不适用的情况

1. **全局最优解依赖于历史决策**：当前最优选择依赖于之前的选择时，贪心算法可能失效。
2. **复杂约束条件**：当问题有多个相互影响的约束条件时，简单的贪心策略难以适用。
3. **无法回溯**：一旦做出选择，无法修改，这在某些问题中会导致次优解。

### 5.2 验证贪心解的正确性

1. **数学归纳法**：证明每一步的贪心选择都是最优的。
2. **交换论证**：证明任何非贪心解都可以通过交换变成贪心解而不降低解的质量。
3. **反例检验**：尝试寻找贪心算法失效的例子。

## 6. 总结

贪心算法是一种简单而强大的问题解决策略，在满足特定条件的问题中可以高效地得到最优解或近似最优解。虽然贪心算法相比动态规划或回溯法在适用范围上有所限制，但它的简单性和高效性使其成为算法设计中不可或缺的工具。

理解贪心算法的关键在于：
1. 识别问题是否具有贪心选择性质和最优子结构
2. 设计合适的贪心策略
3. 证明贪心策略的正确性

对于不确定是否可用贪心算法的问题，可以先尝试设计贪心策略，然后通过反例检验其正确性，或者考虑使用动态规划等更通用的算法。