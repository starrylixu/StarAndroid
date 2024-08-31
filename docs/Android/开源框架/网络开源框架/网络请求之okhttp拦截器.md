**1.什么是拦截器**
**2拦截器有什么作用**
**3拦截器的分类及作用**
**4怎么自定义拦截器（如何使用）**
参考资料：[https://juejin.cn/post/7043336794099679268#heading-0](https://juejin.cn/post/7043336794099679268#heading-0)
# 什么是拦截器
拦截器是okhttp提供的一种强大的机制，还记得之前（[网络请求与JSON解析](https://www.yuque.com/starryluli/android/ut05ygge2nnlcsp3)）说过原生的网络请求的缺点吗？
> 1. 每次网络访问需要放在子线程里
> 2. 每次得到结果需要返回到主线程才能更新控件显示
> 3. **需要对各种情况进行处理，没有对状态码判断**

而这里的拦截器就可以解决第三点这个痛点，拦截器可以**实现网络监听、请求以及响应重写、请求失败重试等功能**
# 拦截器的分类
okhttp的拦截器有五种：

- **RetryAndFollowUpInterceptor**：负责请求失败的时候实现**重试重定向**功能。
- **BridgeInterceptor**：将用户构造的请求转换为向服务器发送的请求，将服务器返回的响应转换为对用户友好的响应。
- **CacheInterceptor**：读取缓存、更新缓存。
- **ConnectInterceptor**：与服务器建立连接。
- **CallServerInterceptor**：从服务器读取响应。

# 拦截器的原理（不理解）
在[网络请求之okhttp异步请求流程分析](https://www.yuque.com/starryluli/android/dcb5n5cxwel5nuw9)一文中提到获取网络请求响应的核心是`**getResponseWithInterceptorChain()**`方法，从方法名可以知道是通过拦截器链来获取响应，在okhttp中采用了责任链的设计模式（可以扩展写一篇okhttp中的设计模式）来实现拦截器链。
> `**责任链模式**`：在责任链模式中，每一个对象和其下家的引用而接起来形成一条链。请求在这个链上传递，直到链上的某一个对象决定处理此请求。客户并不知道链上的哪一个对象最终处理这个请求，客户只需要将请求发送到责任链即可，无须关心请求的处理细节和请求的传递，所以职责链将请求的发送者和请求的处理者解耦了。

它可以设置任意数量的`**Intercepter**`来对网络请求及其响应做任何中间处理，比如：

- 设置缓存
- Https证书认证
- 统一对请求加密
- 打印log
- 过滤请求

回顾一下`**getResponseWithInterceptorChain()**`**方法**
```kotlin
Response getResponseWithInterceptorChain() throws IOException {
    //1.Interceptor泛型List集合，拦截器集合
    List<Interceptor> interceptors = new ArrayList<>();
    //2.添加用户自定义的拦截器到拦截器链中，并在系统默认的拦截器之前执行
    interceptors.addAll(client.interceptors());
    //3.添加系统五大拦截器
    //添加重试重定向拦截器
    interceptors.add(retryAndFollowUpInterceptor);
    //添加桥接拦截器，在此拦截器中默认添加许多请求头和解析响应头
    interceptors.add(new BridgeInterceptor(client.cookieJar()));
    //添加缓存拦截器，根据需要是否从缓存中返回响应
    interceptors.add(new CacheInterceptor(client.internalCache()));
    //添加连接拦截器
    interceptors.add(new ConnectInterceptor(client));
    if (!forWebSocket) {
      interceptors.addAll(client.networkInterceptors());
    }
    //发送请求，并获取响应数据
    interceptors.add(new CallServerInterceptor(forWebSocket));
    //4.创建拦截器链
    Interceptor.Chain chain = new RealInterceptorChain(
        interceptors, null, null, null, 0, originalRequest);
    //5.通过拦截器proceed()方法执行具体的请求
    return chain.proceed(originalRequest);
  }


```
这个方法主要做了四个动作：

1. 首先创建了一个拦截器List集合，泛型是`**Interceptor**`，也就是拦截器
2. 接着创建了一系列的系统拦截器(一开始介绍的五大拦截器)以及我们自定义的拦截器`**client.interceptors()**`和`**client.networkInterceptors()**`，并添加到集合中
3. 然后构建了拦截器链`**RealInterceptorChain**`
4. 最后通过执行**拦截器链**的`**proceed()**`方法开始了获取服务器响应的整个流程。这个方法也是整个拦截器链的核心

接下来就看一下RealInterceptorChain中的proceed()方法。
```kotlin
public Response proceed(Request request, StreamAllocation streamAllocation, HttpCodec httpCodec,
      RealConnection connection) throws IOException {
    if (index >= interceptors.size()) throw new AssertionError();

    calls++;
    ......

    // Call the next interceptor in the chain.
    // 1.调用链中的下一个拦截器,index+1代表着下一个拦截器的索引
    RealInterceptorChain next = new RealInterceptorChain(interceptors, streamAllocation, httpCodec,
        connection, index + 1, request, call, eventListener, connectTimeout, readTimeout,
        writeTimeout);
    // 2.取出要调用的拦截器    
    Interceptor interceptor = interceptors.get(index);
    // 3.调用每个拦截器的intercept方法
    Response response = interceptor.intercept(next);

    ......
    return response;
  }

```
proceed()方法的核心就是创建下一个拦截器。首先创建了一个拦截器，并且将index = index+1，然后我们根据index从存放拦截器的集合interceptors中取出当前对应的拦截器，并且调用拦截器中的intercept()方法。这样，当下一个拦截器希望自己的下一级继续处理这个请求的时候，可以调用传入的责任链的proceed()方法。（不太理解也不赞同，责任链的proceed()方法）
# 重试重定向拦截器
`**RetryAndFollowUpInterceptor**`：重试重定向拦截器，负责在请求失败的时候重试以及重定向的自动后续请求。但**并不是所有的请求失败都可以进行重连**，那哪些可以重连呢，判断依据是什么？
查看`**RetryAndFollowUpInterceptor**`中的`**intercept**`方法如下：
```kotlin
# RetryAndFollowUpInterceptor
# 重试重定向拦截器

@Override public Response intercept(Chain chain) throws IOException {
  Request request = chain.request();
  RealInterceptorChain realChain = (RealInterceptorChain) chain;
  Call call = realChain.call();
  EventListener eventListener = realChain.eventListener();
  // 创建streamAllocation，什么用呢
  StreamAllocation streamAllocation = new StreamAllocation(client.connectionPool(),
      createAddress(request.url()), call, eventListener, callStackTrace);
  this.streamAllocation = streamAllocation;

  int followUpCount = 0;
  Response priorResponse = null;
  // 进入循环
  while (true) {
     // 判断是否取消请求
    if (canceled) {
      streamAllocation.release();
      throw new IOException("Canceled");
    }

    Response response;
    boolean releaseConnection = true;
    try {
        // 【1】、将请求发给下一个拦截器，在执行的过程中可能会出现异常
      response = realChain.proceed(request, streamAllocation, null, null);
      releaseConnection = false;
    } catch (RouteException e) {
      // The attempt to connect via a route failed. The request will not have been sent.
      // 【2】、路由连接失败，请求不会再次发送
      // 在recover方法中会判断是否进行重试，如果不重试抛出异常
      // 在一开始我们提到了并不是所有的失败都可以进行重连，具体哪些请求可以进行重连就在这个recover方法中。
      if (!recover(e.getLastConnectException(), streamAllocation, false, request)) {
        throw e.getFirstConnectException();
      }
      releaseConnection = false;
      // 满足重试条件，继续重连
      continue;
    } catch (IOException e) {
      // An attempt to communicate with a server failed. The request may have been sent.
      // 【3】、尝试与服务器通信失败，请求不会再次发送
      boolean requestSendStarted = !(e instanceof ConnectionShutdownException);
      if (!recover(e, streamAllocation, requestSendStarted, request)) throw e;
      releaseConnection = false;
      // 满足重试条件，继续重连
      continue;
    } finally {
      // We're throwing an unchecked exception. Release any resources.
      if (releaseConnection) {
        streamAllocation.streamFailed(null);
        streamAllocation.release();
      }
    }

    // Attach the prior response if it exists. Such responses never have a body.
    if (priorResponse != null) {
      response = response.newBuilder()
          .priorResponse(priorResponse.newBuilder()
                  .body(null)
                  .build())
          .build();
    }

    Request followUp;
    try {
        // 【4】、在followUpRequest中会判断是否需要重定向，如果需要重定向会返回一个Request用于重定向
      followUp = followUpRequest(response, streamAllocation.route());
    } catch (IOException e) {
      streamAllocation.release();
      throw e;
    }
    // followUp == null 表示不进行重定向，返回response
    if (followUp == null) {
      streamAllocation.release();
      return response;
    }

    closeQuietly(response.body());
     // 【5】、重定向次数最大为20次
    if (++followUpCount > MAX_FOLLOW_UPS) {
      streamAllocation.release();
      throw new ProtocolException("Too many follow-up requests: " + followUpCount);
    }

    if (followUp.body() instanceof UnrepeatableRequestBody) {
      streamAllocation.release();
      throw new HttpRetryException("Cannot retry streamed HTTP body", response.code());
    }
    // 重新创建StreamAllocation实例
    if (!sameConnection(response, followUp.url())) {
      streamAllocation.release();
      streamAllocation = new StreamAllocation(client.connectionPool(),
          createAddress(followUp.url()), call, eventListener, callStackTrace);
      this.streamAllocation = streamAllocation;
    } else if (streamAllocation.codec() != null) {
      throw new IllegalStateException("Closing the body of " + response
          + " didn't close its backing stream. Bad interceptor?");
    }
    // 重新赋值进行循环
    request = followUp;
    priorResponse = response;
  }
}

```
