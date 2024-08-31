# 涉及的类
![image.png](/images/ed1aa4aff2bd2cb2f79c139a97a5374c.png)
首先我们学习了OkHttp的使用[网络请求之okhttp框架](https://www.yuque.com/starryluli/android/ctrtgpfwggf1g8zd)，如何发起一个同步请求和异步请求
# 异步请求流程分析
参考文章：[https://juejin.cn/post/7041855208418181127](https://juejin.cn/post/7041855208418181127)
## 1.构建OkhttpClient对象
相当于配置中心，所有的请求都会共享这些配置，`**OkhttpClient**`中定义了网络协议、DNS、请求时间等等。创建对象的方式有两种

- 一种是通过直接new对象的方式
- 一种是通过Builder模式设置参数来进行创建。（扩展构建OkhttpClient对象时的设计模式-构建者模式）

Builder是OkHttpClient中的一个内部类，负责构建各种参数。
```java
方法一:使用默认参数，不需要配置参数
OkHttpClient client = new OkHttpClient();
//使用构建者模式配置参数和拦截器
OkHttpClient client = new OkHttpClient.Builder().build();

方法二:通过Builder来配置参数
OkHttpClient client = new OkHttpClient.Builder()
        .readTimeout(5000, TimeUnit.MILLISECONDS)
        .build();
```
## 2.构建Request对象
`**Request**`：网络请求信息的封装类，内置**url、head、get/post**请求等。 `**Request**`对象的构建只能通过builder模式来构建，具体的构建过程同OkhttpClient是一样的，都是使用了Builder构建模式。
```java
//这是Request中的一个内部类
public static class Builder {
    HttpUrl url;
    String method;
    okhttp3.Headers.Builder headers;
    RequestBody body;
    Object tag;

    public Builder() {
        this.method = "GET";
        this.headers = new okhttp3.Headers.Builder();
    }

    Builder(Request request) {
        this.url = request.url;
        this.method = request.method;
        this.body = request.body;
        this.tag = request.tag;
        this.headers = request.headers.newBuilder();
    }

    ......
}
```
## 3.创建Call对象
`**Call**`：网络请求的执行者，Call用来描述一个可被执行、中断的请求，`**client.newCall(request)**` 方法就是指创建一个新的将要被执行的请求，每一个Request最终将会被封装成一个`**Realcall**`对象。Realcall是Call接口唯一的实现类，`**AsyncCall**`是Realcall中的内部类，**可以把 RealCall 理解为同步请求操作，而 AsyncCall 则是异步请求操作**。
```groovy
public interface Call extends Cloneable {
    
  //返回当前请求
  Request request();

  //同步请求方法，此方法会阻塞当前线程直到请求结果返回
  Response execute() throws IOException;

  //异步请求方法，此方法会将请求添加到队列中，然后等待请求返回
  void enqueue(Callback responseCallback);

  //取消请求
  void cancel();

  //请求是否在执行，当execute()或者enqueue(Callback responseCallback)执行后该方法返回true
  boolean isExecuted();

  //请求是否被取消
  boolean isCanceled();

  //创建一个新的一模一样的请求
  Call clone();

  interface Factory {
    Call newCall(Request request);
  }
}
```

## 4.发送异步请求
调用`**call.enqueue()**`正式的开始进行网络请求了。前面我们提到，`**RealCall**`是`**Call**`唯一的 实现类，所以我们来查看`**RealCall**`中的`**enqueue()**`。
```java
@Override public void enqueue(Callback responseCallback) {
//使用synchronized锁住了当前对象，
//防止多线程同时调用，this == realCall对象
synchronized (this) {
    //1、判断当前call是否已经执行过
    if (executed) throw new IllegalStateException("Already Executed");
    executed = true;
}
//打印堆栈信息
captureCallStackTrace();
eventListener.callStart(this);
//2、封装一个AsyncCall对象，完成实际的异步请求
//重点需要观察的方法
client.dispatcher().enqueue(new AsyncCall(responseCallback));
}

```
在`**enqueue**`方法中首先会判断当前的`**call**`是否已经执行过一次，如果已经执行过的话，就会抛出一个异常，如果没有执行的话会给`**executed**`变量进行赋值，表示已经执行过，从这里也可以看出`**call**`只能执行一次。**（为什么Call只能执行一次呢）**
接着我们看最后一行，一共做了两件事：

1. 先是封装了一个`**AsyncCall**`对象，
2. 然后通过`**client.dispatcher().enqueue()**`方法开始实际的异步请求。

进入AsyncCall中查看代码，如下
```groovy
final class AsyncCall extends NamedRunnable {
  private final Callback responseCallback;
      AsyncCall(Callback responseCallback) {
        super("OkHttp %s", redactedUrl());
        this.responseCallback = responseCallback;
      }
      ......
  }

```
我们看到`**AsyncCall**`类继承自`**NamedRunnable**`，紧接着我们再进入到`**NamedRunnable**`中可以看到它实现了`**Runnable**`接口，所以最终确定`**AsyncCall**`就是一个`**Runnable**`。
```groovy
public abstract class NamedRunnable implements Runnable {
  protected final String name;

  public NamedRunnable(String format, Object... args) {
    this.name = Util.format(format, args);
  }

  @Override public final void run() {
       ......
  }
}

```
看完封装`**AsyncCall**`对象之后，我们再来看一下`**client.dispatcher().enqueue()**`，先是通过`**client.dispatcher()**`获取到`**dispatcher**`对象，然后调用`**Dispatcher**`中的`**enqueue**`方法。那么这个`**Dispatcher**`是什么呢？
## 5.Dispatcher分发器
`**Disparcher**`**是一个任务分发器，用于管理其对应的OkhttpClient的所有请求。它的主要功能如下：**

1. **发起/取消网络请求API：execute、enqueue 、cancel**
2. **线程池管理异步任务**
3. **记录同步任务、异步任务以及等待执行的异步任务（内部维护了三个队列）**
```groovy
public final class Dispatcher {
  /** 最大并发请求数 */
  private int maxRequests = 64;
  /** 每个主机的最大请求数 */
  private int maxRequestsPerHost = 5;
  private @Nullable Runnable idleCallback;
  /** Executes calls. Created lazily. */
  /**线程池 */
  private @Nullable ExecutorService executorService;

  /** Ready async calls in the order they'll be run. */
  /** 将要运行异步请求队列 */
  private final Deque<AsyncCall> readyAsyncCalls = new ArrayDeque<>();

  /** Running asynchronous calls. Includes canceled calls that haven't finished yet. */
  /** 正在执行的异步请求队列，包含了已经取消但是还没有执行完成的请求 */
  private final Deque<AsyncCall> runningAsyncCalls = new ArrayDeque<>();

  /** Running synchronous calls. Includes canceled calls that haven't finished yet. */
  /** 正在执行的同步请求队列，包含了已经取消但是还没有执行完成的请求 */
  private final Deque<RealCall> runningSyncCalls = new ArrayDeque<>();

  public Dispatcher(ExecutorService executorService) {
    this.executorService = executorService;
  }

  public Dispatcher() {
  }


```
了解完`**Dispatcher**`之后，我们继续回到刚才的 `**client.dispatcher().enqueue()**`方法，查看`**Dispatcher**`中的`**enqueue()**`，如下：
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
当**正在执行的异步请求队列中的数量小于最大并发请求数**(64)并且**正在执行的请求主机数小于每个主机的最大请求数**(5)时，就会把请求`**call**`添加到**正在执行的异步请求队列**中，并且使用线程池执行异步请求。
反之如果这个判断条件不成立，就会把请求call添加到**将要运行的异步请求队列**中缓存起来，添加到等待队列中。这里我们先留个疑问，**添加到等待队列中的任务什么时候会被执行呢？** 此问题稍后再议
在将请求添加到执行的异步请求队列中后，立马通过线程池来执行异步请求`**executorService().execute(call);**`**所以我们先通过**`**executorService()**`**来了解一下分发器的线程池**
```groovy
  public synchronized ExecutorService executorService() {
    if (executorService == null) {
      executorService = new ThreadPoolExecutor(0, Integer.MAX_VALUE, 60, TimeUnit.SECONDS,
          new SynchronousQueue<Runnable>(), Util.threadFactory("OkHttp Dispatcher", false));
    }
    return executorService;
  }

```
分发器的线程池借助了 `**ThreadPoolExecutor**`这个Java类来定义线程池：[Android中的线程池](https://www.yuque.com/starryluli/android/eykcuaw5x0d20o0b)（这一块要复习线程池的知识了）

- 核心线程池的数量：0
- 最大线程数量：Integer.MAX_VALUE
- 空闲线程的闲置时间：60s
- 线程创建工厂：Util.threadFactory("OkHttp Dispatcher", false));

其实和`**Executors.newCachedThreadPool()**`创建的线程一样。首先核心线程为0，表示线程池不会一直为我们缓存线程，线程池中所有线程都是在60s内没有工作就会被回收，当需要线程池执行任务时，如果不存在空闲线程那么也不需要等待，直接开启一个新的线程来执行任务，等待队列的不同指定了线程池的不同排队机制
等待队列`**BlockingQueue**`有：

1. `**ArrayBlockingQueue**` 
2. `**LinkedBlockingQueue**`
3. `**SynchronousQueue**` 

**分别去了解一下这三种队列的区别**
在前面我们提到了AsyncCall可以当做是一个异步请求，它继承自NamedRunnable，而NamedRunnable实现了Runnable，既然它是一个Runnable，那么它就一定有run方法，所以通过NamedRunnable中的run方法可以知道`**executorService().execute(call)**`这行代码最终的执行就是在AsyncCall中的`**execute()**`中进行的，代码如下：
```groovy
#AsyncCall
@Override protected void execute() {
	boolean signalledCallback = false;
      try {
        //构建拦截器链，返回Response对象
        Response response = getResponseWithInterceptorChain();
        //判断重定向拦截器是否取消
        if (retryAndFollowUpInterceptor.isCanceled()) {
          signalledCallback = true;
            //回调失败
          responseCallback.onFailure(RealCall.this, new IOException("Canceled"));
        } else {
          signalledCallback = true;
            //回调成功
          responseCallback.onResponse(RealCall.this, response);
        }
      } catch (IOException e) {
          //signalledCallback为true说明这个错误是用户使用okhttp不规范造成的
        if (signalledCallback) {
          // Do not signal the callback twice!
          Platform.get().log(INFO, "Callback failure for " + toLoggableString(), e);
        } else {
          eventListener.callFailed(RealCall.this, e);
          responseCallback.onFailure(RealCall.this, e);
        }
      } finally {
        client.dispatcher().finished(this);
      }
    }
  }

```
**在execute()方法中重点关注**`**getResponseWithInterceptorChain();**`**方法，通过构建拦截器链返回一个Response()对象，真正的网络请求代码在这个方法中。**
## 6.拦截器Interceptors
从上面的`**getResponseWithInterceptorChain();**`**方法知道，在这里进入了正式的网络请求以及响应数据的获取。暂且只需要知道它返回了一个Response对象，具体实现下章再分析。**

1. **什么是拦截器**
2. **拦截器有什么作用**
3. **拦截器的分类及作用**
4. **怎么自定义拦截器（如何使用）**
```groovy
Response getResponseWithInterceptorChain() throws IOException {
    List<Interceptor> interceptors = new ArrayList<>();
    // 添加自定义拦截器
    interceptors.addAll(client.interceptors());
    // 重试重定向拦截器：负责请求失败的时候实现重试重定向功能
    interceptors.add(retryAndFollowUpInterceptor);
    // 桥接拦截器：将用户构造的请求转换为向服务器发送的请求，将服务器返回的响应转换为对用户友好的响应
    // 主要对 Request 中的 Head 设置默认值，比如 Content-Type、Keep-Alive、Cookie 等
    interceptors.add(new BridgeInterceptor(client.cookieJar()));
    // 缓存拦截器：读取缓存、更新缓存
    interceptors.add(new CacheInterceptor(client.internalCache()));
    // 连接拦截器：负责建立与服务器地址之间的连接，也就是 TCP 链接。
    interceptors.add(new ConnectInterceptor(client));
    if (!forWebSocket) {
        interceptors.addAll(client.networkInterceptors());
    }
    // 服务请求拦截器：从服务器读取响应
    interceptors.add(new CallServerInterceptor(forWebSocket));

    Interceptor.Chain chain = new RealInterceptorChain(interceptors, null, null, null, 0,
            originalRequest, this, eventListener, client.connectTimeoutMillis(),
            client.readTimeoutMillis(), client.writeTimeoutMillis());

    return chain.proceed(originalRequest);
}

```

## 7.获取Response响应、调用finished方法
这里我们再次回到第5步中的`**executed()**`方法中，可以看到我们是通过`getResponseWithInterceptorChain`()拿到了服务器返回的响应`**Response**`，然后进行请求成功或者请求失败的回调，到这里为止，一次完整的网络请求请求已经结束了。但是细心的小伙伴会发现这段代码中有一个finally，那代表着我们的请求不管成功与否，都会进入到这个finally当中。接下来我们就来看一下这个finally中的代码。
```groovy
#AsyncCall
@Override protected void execute() {
	boolean signalledCallback = false;
      try {
        //构建拦截器链，返回Response对象
        Response response = getResponseWithInterceptorChain();
        //判断重定向拦截器是否取消
        if (retryAndFollowUpInterceptor.isCanceled()) {
          signalledCallback = true;
            //回调失败
          responseCallback.onFailure(RealCall.this, new IOException("Canceled"));
        } else {
          signalledCallback = true;
            //回调成功
          responseCallback.onResponse(RealCall.this, response);
        }
      } catch (IOException e) {
          //signalledCallback标识对错误责任划分
          //signalledCallback为true说明这个错误是用户使用okhttp不规范造成的
        if (signalledCallback) {
          Platform.get().log(INFO, "Callback failure for " + toLoggableString(), e);
        } else {
          eventListener.callFailed(RealCall.this, e);
          responseCallback.onFailure(RealCall.this, e);
        }
      } finally {
        client.dispatcher().finished(this);
      }
    }
  }

```
在`**finally**`中执行了`**client.dispatcher().finished(this)**`,可以得知是先获取到了`**Dispatcher**`对象，然后再`**Dispatcher**`中调用了`**finished**`方法。我们进入`**finished**`方法中，代码如下：
```groovy
  private <T> void finished(Deque<T> calls, T call, boolean promoteCalls) {
    int runningCallsCount;
    Runnable idleCallback;
    synchronized (this) {
      //不管是同步还是异步，执行完之后都要移除
      if (!calls.remove(call)) throw new AssertionError("Call wasn't in-flight!");
      //调整整个异步请求任务队列
      if (promoteCalls) promoteCalls();
      //重新计算正在执行的线程数量
      runningCallsCount = runningCallsCount();
      idleCallback = this.idleCallback;
    }

    if (runningCallsCount == 0 && idleCallback != null) {
      idleCallback.run();
    }
  }
```
`**finished**`方法中先是将此次请求从队列中移除，然后调用了`**promoteCalls**`方法。接下来看一下`**promoteCalls**`方法中的具体逻辑。
```groovy
private void promoteCalls() {
    // 如果正在运行的任务已满，直接return
    if (runningAsyncCalls.size() >= maxRequests) return; // Already running max capacity.
    // 等待队列中没有任务，直接return
    if (readyAsyncCalls.isEmpty()) return; // No ready calls to promote.
    // 遍历等待缓存的异步缓存队列
    for (Iterator<AsyncCall> i = readyAsyncCalls.iterator(); i.hasNext(); ) {
      AsyncCall call = i.next();
      // 同一Host的请求不大于5个
      if (runningCallsForHost(call) < maxRequestsPerHost) {
        //取出并移除
        i.remove();
        //将readyAsyncCalls取出的请求添加到正在执行的请求队列中
        //这里就把等待队列中的请求添加到了执行队列中
        runningAsyncCalls.add(call);
        //交给线程池来处理请求
        executorService().execute(call);
      }

      if (runningAsyncCalls.size() >= maxRequests) return; // Reached max capacity.
    }
  }

```
`**promoteCalls**`中关键的一点是从`**runningCallsCount**`中**取出下一个请求**，然后添加到`**runningAsyncCalls**`中，最后交由线程池来处理。所以前面我们提的问题 **添加到等待队列中的任务什么时候会被执行？** 也有了答案，请求就是在这里执行的。
最后我们来看一下`**runningCallsCout**`()方法，runningCallsCount()方法**重新计算了正在执行的线程数量**，方法很简单，就是获取了当前正在执行的同步请求数量和异步请求数量。
```groovy
public synchronized int runningCallsCount() {
  return runningAsyncCalls.size() + runningSyncCalls.size();
}

```

# 主线流程
![image.png](/images/a38029100196b8bf16607c6450244ad0.png)
