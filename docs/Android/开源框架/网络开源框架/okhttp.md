1. 网络请求的历史渊源
2. 原生网络请求简单介绍
3. okhttp的基本使用，以及优点
   1. 同步请求
   2. 异步请求
4. okhttp的异步请求流程
5. okhttp的同步请求流程
6. okhttp如何实现连接池和缓存？
7. okhttp线程池
8. okhttp拦截器
9. okhttp取消请求
10. retrofit

> ![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/0512d2ef2e66f862052707134e67386b.png)HTTP/2 支持允许对同一主机的所有请求共享一个套接字。
> - 连接池可减少请求延迟（如果 HTTP/2 不可用）。
> - 透明 GZIP 可缩小下载大小。
> - 响应缓存完全避免了重复请求的网络。

OkHttp 适用于 Android 5.0+（API 级别 21+）和 Java 8+。
# 简单使用
[12.网络编程之网络请求](https://www.yuque.com/starryluli/xegbta/wrk8kl?view=doc_embed)
## 使用步骤
1、创建`**OkHttpClient**`: 首先，我们需要创建一个 `**OkHttpClient**` 对象，这个对象会管理一些共享的资源，如：连接池、拦截器等。
2、创建 `**Request**`: 接下来，我们需要创建一个 `**Request**` 对象，这个对象包含有请求地址、头信息、请求方法、请求体等相关内容。
3、发送请求: 使用 `**OkHttpClient**` 的 `**newCall()**` 方法创建一个 `**Call**` 对象，其实实际请求网络的是Call接口的真正的实现类是RealCall，通过调用 Call 的 `**execute() **`或者`** enqueue()**` 方法来发送请求。
4、处理响应: 发送请求后，`**OkHttp**`会返回一个 `**Response**` 对象，这个对象包含有响应状态码、头信息、响应体等相关内容。
5、释放资源: 最后，我们需要释放一些资源，如：连接池、缓存等。
![](https://starrylixu.oss-cn-beijing.aliyuncs.com/b6f27757a0c3e5976cfbb4d84ebcdee4.jpeg)
## 发起同步请求
```java
//[1]、创建OkhttpClient对象
OkHttpClient client = new OkHttpClient.Builder()
    .readTimeout(5000, TimeUnit.MILLISECONDS)
    .build();

//[2]、请求报文创建，包含常用的请求信息，如url、get/post方法，设置请求头等
Request request = new Request.Builder()
    .url("http://www.baidu.com")
    .get()
    .build();

//[3]、创建Call对象
Call call = client.newCall(request);

try {
    //[4]、同步请求，发送请求后，就会进入阻塞状态，直到收到响应
    Response response = call.execute();
    Log.d(TAG, "requestNet: response");
} catch (IOException e) {
    e.printStackTrace();
}

```
## 发起异步请求
```java
//发起请求
//无需手动创建子线程，框架默认帮我们创建

//1.创建一个okhttpclient对象
OkHttpClient okHttpClient=new OkHttpClient();

//2.创建一个Request对象，里面存放请求到的数据，调用Request类里的builder()方法，相当于调用了Request的静态方法
//.url请求的地址
//.get() 请求的方式 常用的请求方法1.get()   2.post() 这个由后端的接口决定
//.build()
Request request=new Request.Builder()
        .url("http://121.4.44.56/object")
        .get()
        .build();

//3.将数据放到okHttpClient对象中
Call call = okHttpClient.newCall(request);


//enqueue一个队列，程序可以发起多个请求，将这些请求存在队列中一个一个的处理
call.enqueue(new Callback() {
    @Override
    public void onFailure(@NonNull Call call, @NonNull IOException e) {
        //请求失败
    }

    @Override
    public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
        //请求成功,通过response对象返回请求到的数据
        String result=response.body().string();
        Log.i("onResponse", "onResponse: "+result);
    }
});
```
同步请求和异步请求的使用在前3步都是相同的，只用在第4步的时候同步请求调用的是`call.execute()`方法，异步请求调用的是`call.enqueue()`方法。
# 优点
OkHttp是一个功能强大的**HTTP客户端库**，具有以下使用优点：

1. 高效性能: OkHttp使用现代的**HTTP/2**协议来减少网络请求的延迟和提升性能。
2. 简单易用: OkHttp提供了简单易用的API和丰富的文档，开发者可以快速上手使用。
3. 自定义拦截器: OkHttp支持**自定义拦截器**，可以用于添加请求头、重定向请求、设置缓存等操作。
4. 连接池: OkHttp使用**连接池技术**，可以减少网络请求的连接建立时间，提升性能。
5. 支持异步请求: OkHttp支持**异步请求**，可以避免主线程阻塞，提高应用程序的响应速度。
6. 支持缓存: OkHttp支持**缓存技术**，可以减少网络请求的次数，提升性能。
7. 支持HTTPS: OkHttp支持HTTPS协议，可以保证数据传输的安全性。

总的来说，OkHttp是一个功能强大、性能优越、易于使用的HTTP客户端库，它为开发者提供了很多优秀的特性和功能，可以有效地提高网络请求和数据传输的效率和质量。
# HTTP的请求过程
DNS解析——》获取到IP——》TCP三次握手
# Dispatcher分发器

# 常见面试
OkHttp是什么？它有什么优点？
OkHttp是如何处理网络请求的？
OkHttp如何实现连接池和缓存？
OkHttp如何处理HTTPS连接？
OkHttp支持哪些**拦截器**？它们分别**用于什么场景**？
OkHttp如何支持取消请求？
OkHttp的请求和响应是如何处理的？如何处理JSON数据？
OkHttp支持哪些身份验证方式？
OkHttp在Android中的使用步骤是什么？
Retrofit和OkHttp的区别是什么？


![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/7441785450b62ef70d9575c032083a02.png)
HttpURLConnection每一次网络请求都会重新建立一个连接，频繁的建立和释放网络连接会耗费大量资源
Okhttp 使用 Socket 建立长连接，使用连接池技术，可以减少网络请求的连接建立时间，提升性能。
# 异步请求流程分析
参考文章：[https://juejin.cn/post/7041855208418181127](https://juejin.cn/post/7041855208418181127)
## 1.构建OkhttpClient对象
相当于配置中心，所有的请求都会共享这些配置，`**OkhttpClient**`中定义了网络协议、DNS、请求时间等等。创建对象的方式有两种

- 一种是通过直接new对象的方式
- 一种是通过Builder模式设置参数来进行创建。（扩展构建OkhttpClient对象时的设计模式-构建者模式）
```java
方法一:使用默认参数，不需要配置参数
OkHttpClient client = new OkHttpClient();

方法二:通过Builder来配置参数
OkHttpClient client = new OkHttpClient.Builder()
        .readTimeout(5000, TimeUnit.MILLISECONDS)
        .build();
```
## 2.构建Request对象
`**Request**`：网络请求信息的封装类，内置**url、head、get/post**请求等。 `**Request**`对象的构建只能通过builder模式来构建，具体的构建过程同OkhttpClient是一样的，都是使用了Builder构建模式。
```java
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
```groovy
@Override public void enqueue(Callback responseCallback) {
    //使用synchronized锁住了当前对象，防止多线程同时调用，this == realCall对象
      synchronized (this) {
          //1、判断当前call是否已经执行过
        if (executed) throw new IllegalStateException("Already Executed");
        executed = true;
      }
      //打印堆栈信息
      captureCallStackTrace();
      eventListener.callStart(this);
      //2、封装一个AsyncCall对象，完成实际的异步请求
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
```groovy
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
          responseCallback.onFailure(RealCall.this, new IOException("Canceled"));
        } else {
          signalledCallback = true;
          responseCallback.onResponse(RealCall.this, response);
        }
      } catch (IOException e) {
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
从上面的`**getResponseWithInterceptorChain();**`**方法知道，在这里进入了正式的网络请求以及响应数据的获取。**

1. **什么是拦截器**
2. **拦截器有什么作用**
3. **拦截器的分类及作用**
4. **怎么自定义拦截器（如何使用）**
```groovy
Response getResponseWithInterceptorChain() throws IOException {

    // Build a full stack of interceptors.
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
这里我们再次回到第5步中的`**executed()**`方法中，可以看到我们是通过getResponseWithInterceptorChain()拿到了服务器返回的响应`**Response**`，然后进行请求成功或者请求失败的回调，到这里为止，一次完整的网络请求请求已经结束了。但是细心的小伙伴会发现这段代码中有一个finally，那代表着我们的请求不管成功与否，都会进入到这个finally当中。接下来我们就来看一下这个finally中的代码。
```groovy
@Override protected void execute() {
      boolean signalledCallback = false;
      try {
        //构建拦截器链，返回Response对象
        Response response = getResponseWithInterceptorChain();
        //判断重定向拦截器是否取消
        if (retryAndFollowUpInterceptor.isCanceled()) {
          signalledCallback = true;
          responseCallback.onFailure(RealCall.this, new IOException("Canceled"));
        } else {
          signalledCallback = true;
          responseCallback.onResponse(RealCall.this, response);
        }
      } catch (IOException e) {
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
    // 等待队列中没有人物，直接return
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
# 源码解析
## 创建OkHttpClient对象
创建OkHttpClient: 首先，我们需要创建一个 OkHttpClient 对象，这个对象会管理一些共享的资源，如：连接池、拦截器等。相当于配置中心
```java
//1.创建一个okhttpclient对象
OkHttpClient okHttpClient=new OkHttpClient();
```
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/13c5feb5658d1a9b09972dedea9a4712.png)
Builder是OkHttpClient的一个静态内部类，采用的是创建者模式，将复杂对象的创建与它的表示分离，在Builder的构造方法中，实例化了分发器Dispatcher和连接池ConnectionPool，以及对各种属性进行初始化配置。
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/846ea9363c7be0952106bc30d0711b45.png)
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/1831ba04a964c8c884aaa2804e0007fc.png)
```java
final Dispatcher dispatcher;//调度器
final @Nullable
Proxy proxy;//代理
final List<Protocol> protocols;//协议
final List<ConnectionSpec> connectionSpecs;//传输层版本和连接协议
final List<Interceptor> interceptors;//拦截器
final List<Interceptor> networkInterceptors;//网络拦截器
final EventListener.Factory eventListenerFactory;
final ProxySelector proxySelector;//代理选择器
final CookieJar cookieJar;//cookie
final @Nullable
Cache cache;//cache 缓存
final @Nullable
InternalCache internalCache;//内部缓存
final SocketFactory socketFactory;//socket 工厂
final @Nullable
SSLSocketFactory sslSocketFactory;//安全套层socket工厂 用于https
final @Nullable
CertificateChainCleaner certificateChainCleaner;//验证确认响应书，适用HTTPS 请求连接的主机名
final HostnameVerifier hostnameVerifier;//主机名字确认
final CertificatePinner certificatePinner;//证书链
final Authenticator proxyAuthenticator;//代理身份验证
final Authenticator authenticator;//本地省份验证
final ConnectionPool connectionPool;//链接池 复用连接
final Dns dns; //域名
final boolean followSslRedirects;//安全套接层重定向
final boolean followRedirects;//本地重定向
final boolean retryOnConnectionFailure;//重试连接失败
final int connectTimeout;//连接超时
final int readTimeout;//读取超时
final int writeTimeout;//写入超时

```
## 创建Request对象
创建 Request: 接下来，我们需要创建一个 Request 对象，这个对象包含有请求地址、头信息、请求方法、请求体等相关内容。
```java
//2.创建一个Request对象，里面存放请求到的数据，调用Request类里的builder()方法，相当于调用了Request的静态方法
//.url请求的地址
//.get() 请求的方式 常用的请求方法1.get()   
//2.post() 这个由后端的接口决定
//.build()
Request request=new Request.Builder()
        .url("http://121.4.44.56/object")
        .get()
        .build();
```
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/33be6c5808448fbfbbdbe6b4d2733b3b.png)
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/791a3c085db60788ef1dfbffd8741e09.png)
这里可以继续深入，get()方法和post()

## 创建Call对象
```java
//3.将数据放到okHttpClient对象中
Call call = okHttpClient.newCall(request);
```
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/66ea37c7c93d223cebbcde22a7bcffa7.png)
Call是一个接口，实则调用的是它的实现类RealCall
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/0800f31d0f9d877749e617f4c854ba84.png)
在RealCall类中的静态方法中创建了call对象
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/d53d1ebff6e5307787918b8f96ff17c0.png)
## 异步请求
```java
//enqueue一个队列，程序可以发起多个请求，将这些请求存在队列中一个一个的处理
call.enqueue(new Callback() {
    @Override
    public void onFailure(@NonNull Call call, @NonNull IOException e) {
        //请求失败
    }

    @Override
    public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
        //请求成功,通过response对象返回请求到的数据
        String result=response.body().string();
        Log.i("onResponse", "onResponse: "+result);
    }
});
```
同样调用的也是Call接口在RealCall实现类中的enqueue方法
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/d998b8bedefb10bfddb49e9cd1b84eb3.png)


当面试官要求你详细讲解OkHttp的原理时，你可以按照以下步骤来解释连接池、请求队列和线程池等机制是如何帮助OkHttp高效地处理并发请求的：

连接池（Connection Pool）：
OkHttp使用连接池来管理网络连接，以避免多次建立和关闭连接的开销。连接池会预先创建一定数量的连接，这些连接可以被多个请求重复使用。它有效地减少了每次请求的连接建立和关闭所需的时间，提升了性能。

连接池还具备以下特点：

复用连接：连接池会重复使用已建立的连接，即使它们来自不同的请求。
HTTP/2支持：OkHttp支持使用HTTP/2协议进行请求，连接池会复用单个HTTP/2连接，可以在一个连接上同时发起多个请求。
限制连接数：连接池可以设置最大连接数，用于限制并发连接的数量，以防止消耗过多的资源。
自动清理：OkHttp会定期检查空闲连接，并关闭长时间未使用的连接，以释放资源。


请求队列（Request Queue）：
OkHttp使用请求队列来排队和调度发送的请求。请求队列按照先进先出的顺序处理请求，以确保公平性和按序执行。

请求队列有以下作用：

请求调度：请求队列按照请求的顺序来排队，并将请求发送到连接池。
请求取消：请求队列可以轻松地取消排队中的请求，以避免发送不必要的请求。
流量控制：通过请求队列，OkHttp可以智能地控制请求数量，避免过多的请求同时发送，从而减少网络拥塞的风险。


线程池（Thread Pool）：
OkHttp使用线程池来管理网络请求的执行线程。线程池是一个用于处理并发任务的工具，可以在有限数量的线程下同时执行多个网络请求。

线程池的功能包括：

线程复用：线程池会重用已有的线程，避免频繁地创建和销毁线程，减少了开销。
线程数量控制：线程池可以限制并发线程的数量，以防止过多的线程占用系统资源。
任务调度：线程池可以按照先进先出的方式执行网络请求任务，确保请求按照合理的顺序执行。
异常处理：线程池在执行任务过程中能够捕获并处理异常，从而确保线程的稳定性和健壮性。

通过连接池、请求队列和线程池的组合使用，OkHttp能够有效地管理并发的请求。它能够高效地重用连接、合理地安排请求顺序，并在有限的线程数量下并发地执行多个请求，从而提升网络请求的速度和性能。

# 连接池
当你在面试中要结合源码扩展讲解OkHttp中的连接池，你可以按照以下步骤来解释：

连接池的初始化：
OkHttp的连接池使用的是ConnectionPool类，它在OkHttpClient的构造函数中进行初始化。可以通过new ConnectionPool(maxIdleConnections, keepAliveDuration, TimeUnit)方法来创建连接池对象，其中maxIdleConnections表示最大空闲连接数，keepAliveDuration表示连接的存活时间。
连接的创建与回收：
当通过OkHttp发送请求时，连接池会负责创建和分配连接。在源码中，连接池通过get方法来获取连接，如果连接池中有可用的空闲连接，则返回一个空闲连接，否则会创建一个新的连接。在请求完成后，连接池会通过put方法将连接返回并标记为可复用。
连接的空闲和保活：
连接池会跟踪和管理空闲连接，以避免频繁地创建和销毁连接。空闲的连接指的是当前没有被分配给请求的连接。连接池会根据空闲连接的数量和空闲时间进行管理。如果空闲连接数量超过最大空闲连接数，则连接池会关闭多余的连接。

连接池还通过连接的存活时间来控制连接的保活。在源码中，可以看到连接池会监控连接的使用情况和空闲时间，并定期清理过期的连接。

连接的重用和回收：
连接池会确保连接的重用，以减少网络的延迟和资源的消耗。当返回一个连接给连接池时，连接池会通过检查连接是否可复用来决定是否将连接放入空闲连接池中。如果连接满足可复用的条件，它会被标记为可用的空闲连接，等待下一次请求使用。如果连接不可复用，则会被关闭和丢弃。
多线程并发管理：
连接池需要在多线程环境下进行线程安全的管理。在OkHttp的连接池实现中，使用了同步的操作来确保连接的正确分配和回收，以及空闲连接的管理。

以上是对OkHttp连接池的简要讲解，如果具体还需要深入了解连接池的实现原理，你可以参考OkHttp源码中的ConnectionPool类以及相关的调用链和调用关系，进一步了解其实现细节。
