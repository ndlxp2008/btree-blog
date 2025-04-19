# Java 并发编程

## 1. 并发基础

### 1.1 并发与并行

- **并发(Concurrency)**: 多个任务在重叠的时间段内执行，通过CPU时间片切换实现
- **并行(Parallelism)**: 多个任务在同一时刻同时执行，需要多核CPU支持

### 1.2 线程状态

Java线程的生命周期包含以下状态:

- **NEW**: 线程已创建但尚未启动
- **RUNNABLE**: 线程正在JVM中执行
- **BLOCKED**: 线程阻塞等待监视器锁
- **WAITING**: 线程无限期等待另一个线程执行特定操作
- **TIMED_WAITING**: 线程等待另一个线程在指定时间内执行操作
- **TERMINATED**: 线程已完成执行

## 2. 线程创建与管理

### 2.1 创建线程

Java提供三种创建线程的方式:

#### 继承Thread类

```java
public class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }

    public static void main(String[] args) {
        MyThread thread = new MyThread();
        thread.start();
    }
}
```

#### 实现Runnable接口

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }

    public static void main(String[] args) {
        Thread thread = new Thread(new MyRunnable());
        thread.start();
    }
}
```

#### 使用Lambda表达式(Java 8+)

```java
public class LambdaThread {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            System.out.println("Thread running: " + Thread.currentThread().getName());
        });
        thread.start();
    }
}
```

### 2.2 线程控制

#### 线程休眠

```java
try {
    Thread.sleep(1000); // 休眠1秒
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
```

#### 线程等待与通知

```java
public class WaitNotifyExample {
    public static void main(String[] args) {
        Object lock = new Object();

        Thread waiter = new Thread(() -> {
            synchronized (lock) {
                try {
                    System.out.println("Waiter: Waiting for notification");
                    lock.wait();
                    System.out.println("Waiter: Notification received");
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        });

        Thread notifier = new Thread(() -> {
            synchronized (lock) {
                System.out.println("Notifier: Sleeping for 2 seconds");
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println("Notifier: Notifying waiter");
                lock.notify();
            }
        });

        waiter.start();
        notifier.start();
    }
}
```

#### 线程中断

```java
Thread thread = new Thread(() -> {
    while (!Thread.currentThread().isInterrupted()) {
        // 执行任务
    }
    System.out.println("Thread interrupted and terminated");
});

thread.start();
// 一段时间后中断线程
thread.interrupt();
```

#### 线程加入

```java
Thread thread = new Thread(() -> {
    try {
        Thread.sleep(2000);
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
    System.out.println("Thread completed");
});

thread.start();

try {
    thread.join(); // 等待线程完成
    System.out.println("Thread joined");
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
```

## 3. 线程同步与锁

### 3.1 synchronized关键字

#### 同步方法

```java
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}
```

#### 同步代码块

```java
public class Counter {
    private int count = 0;
    private final Object lock = new Object();

    public void increment() {
        synchronized (lock) {
            count++;
        }
    }

    public int getCount() {
        synchronized (lock) {
            return count;
        }
    }
}
```

### 3.2 Lock接口

Java提供了Lock接口及其实现类，相比synchronized提供更多灵活性:

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Counter {
    private int count = 0;
    private final Lock lock = new ReentrantLock();

    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock(); // 确保锁释放
        }
    }

    public int getCount() {
        lock.lock();
        try {
            return count;
        } finally {
            lock.unlock();
        }
    }
}
```

### 3.3 读写锁

```java
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteCounter {
    private int count = 0;
    private final ReadWriteLock lock = new ReentrantReadWriteLock();

    public void increment() {
        lock.writeLock().lock();
        try {
            count++;
        } finally {
            lock.writeLock().unlock();
        }
    }

    public int getCount() {
        lock.readLock().lock();
        try {
            return count;
        } finally {
            lock.readLock().unlock();
        }
    }
}
```

### 3.4 StampedLock (Java 8+)

```java
import java.util.concurrent.locks.StampedLock;

public class StampedCounter {
    private int count = 0;
    private final StampedLock lock = new StampedLock();

    public void increment() {
        long stamp = lock.writeLock();
        try {
            count++;
        } finally {
            lock.unlockWrite(stamp);
        }
    }

    public int getCount() {
        long stamp = lock.tryOptimisticRead();
        int currentCount = count;
        if (!lock.validate(stamp)) {
            stamp = lock.readLock();
            try {
                currentCount = count;
            } finally {
                lock.unlockRead(stamp);
            }
        }
        return currentCount;
    }
}
```

## 4. 线程池与Executor框架

### 4.1 线程池概念

线程池管理一组工作线程，减少线程创建/销毁开销，控制并发数量。

### 4.2 Executors工厂方法

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ExecutorExample {
    public static void main(String[] args) {
        // 固定大小线程池
        ExecutorService fixedPool = Executors.newFixedThreadPool(5);

        // 缓存线程池
        ExecutorService cachedPool = Executors.newCachedThreadPool();

        // 单线程线程池
        ExecutorService singlePool = Executors.newSingleThreadExecutor();

        // 调度线程池
        ScheduledExecutorService scheduledPool = Executors.newScheduledThreadPool(5);

        // 提交任务
        fixedPool.submit(() -> {
            System.out.println("Task executed by " + Thread.currentThread().getName());
        });

        // 不要忘记关闭线程池
        fixedPool.shutdown();
    }
}
```

### 4.3 自定义线程池

```java
import java.util.concurrent.*;

ThreadPoolExecutor executor = new ThreadPoolExecutor(
    5,              // 核心线程数
    10,             // 最大线程数
    60, TimeUnit.SECONDS,  // 空闲线程存活时间
    new ArrayBlockingQueue<>(100),  // 工作队列
    new ThreadPoolExecutor.CallerRunsPolicy()  // 拒绝策略
);
```

### 4.4 常见拒绝策略

- **AbortPolicy**: 抛出RejectedExecutionException异常
- **CallerRunsPolicy**: 由调用线程执行任务
- **DiscardPolicy**: 丢弃任务，不抛异常
- **DiscardOldestPolicy**: 丢弃队列最前面的任务，然后提交当前任务

## 5. 并发工具类

### 5.1 并发容器

#### ConcurrentHashMap

```java
import java.util.concurrent.ConcurrentHashMap;

ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
map.put("key", 1);
map.putIfAbsent("key", 2); // 不会更新现有值
```

#### CopyOnWriteArrayList

```java
import java.util.concurrent.CopyOnWriteArrayList;

CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
list.add("item1");
// 适合读多写少的场景
```

#### ConcurrentLinkedQueue

```java
import java.util.concurrent.ConcurrentLinkedQueue;

ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<>();
queue.offer("item1");
String item = queue.poll();
```

### 5.2 同步工具类

#### CountDownLatch

```java
import java.util.concurrent.CountDownLatch;

public class CountDownLatchExample {
    public static void main(String[] args) throws InterruptedException {
        int workerCount = 5;
        CountDownLatch latch = new CountDownLatch(workerCount);

        for (int i = 0; i < workerCount; i++) {
            final int workerId = i;
            new Thread(() -> {
                try {
                    System.out.println("Worker " + workerId + " is working");
                    Thread.sleep((int) (Math.random() * 1000));
                    System.out.println("Worker " + workerId + " finished");
                    latch.countDown();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }

        // 等待所有工作线程完成
        latch.await();
        System.out.println("All workers finished, main thread continues");
    }
}
```

#### CyclicBarrier

```java
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierExample {
    public static void main(String[] args) {
        int partyCount = 3;
        CyclicBarrier barrier = new CyclicBarrier(partyCount, () -> {
            System.out.println("All threads reached barrier, executing barrier action");
        });

        for (int i = 0; i < partyCount; i++) {
            final int threadId = i;
            new Thread(() -> {
                try {
                    System.out.println("Thread " + threadId + " is working");
                    Thread.sleep((int) (Math.random() * 1000));
                    System.out.println("Thread " + threadId + " reached barrier");
                    barrier.await();
                    System.out.println("Thread " + threadId + " continues");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
```

#### Semaphore

```java
import java.util.concurrent.Semaphore;

public class SemaphoreExample {
    public static void main(String[] args) {
        // 限制最多3个线程同时访问资源
        Semaphore semaphore = new Semaphore(3);

        for (int i = 0; i < 10; i++) {
            final int threadId = i;
            new Thread(() -> {
                try {
                    System.out.println("Thread " + threadId + " is waiting for permit");
                    semaphore.acquire();
                    System.out.println("Thread " + threadId + " acquired permit");

                    // 模拟资源访问
                    Thread.sleep((int) (Math.random() * 1000));

                    System.out.println("Thread " + threadId + " releasing permit");
                    semaphore.release();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }
    }
}
```

#### Phaser

```java
import java.util.concurrent.Phaser;

public class PhaserExample {
    public static void main(String[] args) {
        int parties = 3;
        Phaser phaser = new Phaser(parties);

        for (int i = 0; i < parties; i++) {
            final int threadId = i;
            new Thread(() -> {
                System.out.println("Thread " + threadId + " arriving at phase " + phaser.getPhase());
                phaser.arriveAndAwaitAdvance();

                System.out.println("Thread " + threadId + " arriving at phase " + phaser.getPhase());
                phaser.arriveAndAwaitAdvance();

                System.out.println("Thread " + threadId + " arriving at phase " + phaser.getPhase());
                phaser.arriveAndDeregister();
            }).start();
        }
    }
}
```

### 5.3 并发队列

#### BlockingQueue

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueueExample {
    public static void main(String[] args) {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(5);

        // 生产者线程
        new Thread(() -> {
            try {
                for (int i = 0; i < 10; i++) {
                    String item = "Item " + i;
                    System.out.println("Producing: " + item);
                    queue.put(item);  // 队列满时阻塞
                    Thread.sleep(100);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();

        // 消费者线程
        new Thread(() -> {
            try {
                Thread.sleep(500);
                while (true) {
                    String item = queue.take();  // 队列空时阻塞
                    System.out.println("Consuming: " + item);
                    Thread.sleep(200);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }
}
```

## 6. CompletableFuture (Java 8+)

### 6.1 创建CompletableFuture

```java
import java.util.concurrent.CompletableFuture;

public class CompletableFutureExample {
    public static void main(String[] args) throws Exception {
        // 创建已完成的Future
        CompletableFuture<String> completed = CompletableFuture.completedFuture("Result");

        // 创建异步任务
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "Async result";
        });

        // 等待结果
        String result = future.get();
        System.out.println(result);
    }
}
```

### 6.2 CompletableFuture组合

```java
CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> "Hello");
CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> "World");

// 组合两个Future的结果
CompletableFuture<String> combinedFuture = future1.thenCombine(future2, (result1, result2) -> result1 + " " + result2);

// 链式调用转换结果
CompletableFuture<Integer> lengthFuture = combinedFuture.thenApply(String::length);

// 消费结果
combinedFuture.thenAccept(System.out::println);

// 完成时执行，不关心结果
combinedFuture.thenRun(() -> System.out.println("Computation finished"));

// 异常处理
combinedFuture.exceptionally(ex -> {
    System.err.println("Exception: " + ex.getMessage());
    return "Error occurred";
});
```

### 6.3 组合多个CompletableFuture

```java
CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> "Task 1");
CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> "Task 2");
CompletableFuture<String> future3 = CompletableFuture.supplyAsync(() -> "Task 3");

// 等待所有任务完成
CompletableFuture<Void> allFutures = CompletableFuture.allOf(future1, future2, future3);

// 等待任意一个任务完成
CompletableFuture<Object> anyFuture = CompletableFuture.anyOf(future1, future2, future3);
```

## 7. 并发最佳实践

### 7.1 避免死锁

- 固定锁的获取顺序
- 使用超时锁
- 避免在持有锁时调用外部方法

### 7.2 优化并发性能

- 细化锁的粒度
- 避免长时间持有锁
- 使用并发容器代替同步集合
- 考虑无锁算法和数据结构

### 7.3 线程安全的单例模式

```java
// 双重检查锁定
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

// 静态内部类方式
public class Singleton {
    private Singleton() {}

    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}

// 枚举方式
public enum Singleton {
    INSTANCE;

    public void doSomething() {
        // 方法实现
    }
}
```

### 7.4 线程安全的延迟初始化

```java
// 使用Supplier延迟初始化
private static class Holder<T> {
    private T value;
    private volatile boolean initialized = false;

    public T get(Supplier<T> supplier) {
        if (!initialized) {
            synchronized (this) {
                if (!initialized) {
                    value = supplier.get();
                    initialized = true;
                }
            }
        }
        return value;
    }
}
```

## 8. Java 9+ 并发特性

### 8.1 Flow API (Java 9 响应式流)

```java
import java.util.concurrent.Flow;
import java.util.concurrent.SubmissionPublisher;
import java.util.concurrent.TimeUnit;

public class FlowExample {
    public static void main(String[] args) throws InterruptedException {
        // 创建Publisher
        SubmissionPublisher<String> publisher = new SubmissionPublisher<>();

        // 创建Subscriber
        Flow.Subscriber<String> subscriber = new Flow.Subscriber<>() {
            private Flow.Subscription subscription;

            @Override
            public void onSubscribe(Flow.Subscription subscription) {
                this.subscription = subscription;
                subscription.request(1); // 请求一个元素
            }

            @Override
            public void onNext(String item) {
                System.out.println("Received: " + item);
                subscription.request(1); // 请求下一个元素
            }

            @Override
            public void onError(Throwable throwable) {
                throwable.printStackTrace();
            }

            @Override
            public void onComplete() {
                System.out.println("Completed");
            }
        };

        // 订阅
        publisher.subscribe(subscriber);

        // 发布元素
        publisher.submit("Item 1");
        publisher.submit("Item 2");
        publisher.submit("Item 3");

        // 完成并关闭
        publisher.close();

        // 等待处理完成
        TimeUnit.SECONDS.sleep(1);
    }
}
```

### 8.2 VarHandle (Java 9)

```java
import java.lang.invoke.MethodHandles;
import java.lang.invoke.VarHandle;

public class VarHandleExample {
    private int x;
    private static final VarHandle X_HANDLE;

    static {
        try {
            X_HANDLE = MethodHandles.lookup()
                       .findVarHandle(VarHandleExample.class, "x", int.class);
        } catch (ReflectiveOperationException e) {
            throw new Error(e);
        }
    }

    public void increment() {
        // 原子性操作
        X_HANDLE.getAndAdd(this, 1);
    }

    public int get() {
        // 获取值，包含内存屏障
        return (int) X_HANDLE.getVolatile(this);
    }

    public void set(int value) {
        // 设置值，包含内存屏障
        X_HANDLE.setVolatile(this, value);
    }
}
```

## 9. 总结

Java提供了丰富的并发编程工具，从基础的线程管理、同步机制，到高级的线程池、并发容器和CompletableFuture。掌握这些特性可以帮助开发人员编写高效、安全的多线程应用程序。在使用这些工具时，需要注意避免死锁、竞态条件等常见并发问题，并根据应用场景选择合适的并发控制机制。