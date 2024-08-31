# 主线流程
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/f5c8ba81426cb10de6663676de236d13.png)
在Dispathcer的enqueue方法中把请求添加进了队列中，然后通过线程池去执行请求任务，那么线程池的内部是如何实现的呢？
```java
synchronized void enqueue(AsyncCall call) {
    if (runningAsyncCalls.size() < maxRequests && runningCallsForHost(call) < maxRequestsPerHost) {
        //添加到正在执行的异步请求队列
        runningAsyncCalls.add(call);
        //使用线程池执行异步请求
        executorService().execute(call);
    } else {
        //添加到将要运行的异步请求队列
        readyAsyncCalls.add(call);
    }
}

```
# 线程池
## 
什么是线程池呢？
OkHttp源码中的，进入executorService().execute(call); 方法发现，在同步锁的机制下创建了一个线程池
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/de5ab18c3baef79ea078b337887cf03c.png)
## Java中线程池的继承结构
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/2d2a354606070fd19f91138e8d13fe16.png)
Java中的线程池
Executor抽象类，其中只有一个方法。
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/aff89c07fad446c7de4f81ccf5c74bda.png)
使用Executor的实现接口ExecutorService，它也是一个接口。以及它的具体实现类ThreadPoolExecutor来实现线程池。
其中有5个参数：

- 参数1 corePoolSize：核心线程数
- 参数2 ：线程池非核心线程数 线程池规定大小
- 参数3/4：时间数值，线程的缓存时间，单位：时分秒60s
当正在执行的任务runnable（20个）>corepoolsize，那么参数3/参数4才起作用
作用：runnable1执行完毕后，如果闲置时间超过60s，也就是60s内这个线程不需要处理新的任务，会问收Runnable1任务，如果闲置时间小于60s，那么复用Runable1。
- 参数5：workqueue队列，会把超出的任务加入到队列中 缓存起来

利用上面的原理，我们可以实现一个单线程的线程池：线程池中始终只有一个核心线程，并且最大线程数也是1，保证了单线程
```java
ExecutorService service=new ThreadPoolExecutor(
    1,1,60, TimeUnit.SECONDS,new LinkedBlockingDeque<>()
);
```
还可以实现缓存线程池：没有核心线程，而是线程池容量无限大，每次来了新的任务，都能够及时的处理，用正在闲置的线程时会优先使用闲置的线程，避免了频繁创建新线程，例如，如果每个任务处理时间不超过60s，并且每个任务之间的时间间隔不超过60s，那么就能一直复用这一个线程完成任务。
优点就是：既能够及时的处理新任务，又能减少线程的创建。
```java
ExecutorService service=new ThreadPoolExecutor(
    0,Integer.MAX_VALUE,60, TimeUnit.SECONDS,new LinkedBlockingDeque<>()
);
```
## Java中的线程池API
[Android中的线程池](https://www.yuque.com/starryluli/android/eykcuaw5x0d20o0b)
[Java线程池](https://www.yuque.com/starryluli/android/qq2m0aqw5e8kcys2)
# Okhttp中的实现
在Disparcher中可以看到`executorService`方法，创建的正是一个缓存机制的线程池，与我们实现不同的点就是它采用的缓存队列是`SynchronousQueue`，并且利用一个线程工厂来创建新的线程，指定线程的名字是**"OkHttp Dispatcher"，**并且都不是守护线程（false）。
```java
public synchronized ExecutorService executorService() {
    if (executorService == null) {
      executorService = new ThreadPoolExecutor(0, Integer.MAX_VALUE, 60, TimeUnit.SECONDS,
          new SynchronousQueue<Runnable>(), Util.threadFactory("OkHttp Dispatcher", false));
    }
    return executorService;
  }
```
我们也可以实现，自己创建一个线程工厂去指定每次线程池创建的线程的属性：例如指定线程的名字，是否是守护线程等。
:::info
**守护线程**与普通线程的唯一区别是：当JVM中所有的线程都是守护线程的时候，JVM就可以退出了；如果还有一个或以上的非守护线程则不会退出。okhttp设置线程池中的线程是非守护线程，就是为了保证所有的请求（任务）能得到处理，App才会退出。
:::
```java
ExecutorService service=new ThreadPoolExecutor(
        0, Integer.MAX_VALUE, 60, TimeUnit.SECONDS, new LinkedBlockingDeque<>(),
        new ThreadFactory() {
            @Override
            public Thread newThread(Runnable runnable) {
                Thread thread=new Thread("myOkHttp Thread");
                thread.setDaemon(false);
                return thread;
            }
        }
);
```
