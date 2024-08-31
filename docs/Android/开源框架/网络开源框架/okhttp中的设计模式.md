# 目录
责任链模式：OkHttp中的拦截器实现了责任链模式，能够对请求和响应进行处理，同时允许在处理过程中添加额外的操作和处理逻辑。
自定义日志拦截器：[https://blog.csdn.net/qq_42805756/article/details/85061943](https://blog.csdn.net/qq_42805756/article/details/85061943)
拦截器的使用样例，自定义日志拦截器
```kotlin
OkHttpClient.Builder builder = new OkHttpClient.Builder();
  	builder.addInterceptor(addGzipInterceptor());
    builder.addInterceptor(addHeaderInterceptor());
    builder.addNetworkInterceptor(addNetWorkCacheInterceptor());
    builder.addInterceptor(addOffLineCacheInterceptor());
    //设置缓存
    Cache cache = new Cache(CacheFileUtils.getInstance().getCacheJsonFile(), 1024 * 1024 * 250);//缓存文件为250MB
    builder.cache(cache);

    //设置超时
    builder.connectTimeout(30, TimeUnit.SECONDS);
    builder.readTimeout(30, TimeUnit.SECONDS);
    builder.writeTimeout(30, TimeUnit.SECONDS);
    //错误重连
    builder.retryOnConnectionFailure(true);
    // Log信息拦截器
    if (BuildConfig.DEV) {
        HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor(new HttpLogger());
        loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
        builder.addInterceptor(loggingInterceptor);
    }


    OkHttpClient client = builder.build();
    retrofit = new Retrofit.Builder()
            .baseUrl(HttpUrl.parse(GlobalConfig.getBaseServerUrl()))
            .addConverterFactory(GsonConverterFactory.create())
            .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
            .client(client)
            .build();
```
工厂模式：OkHttp内部使用了大量工厂模式，通过抽象工厂、具体工厂、抽象产品、具体产品等组合实现了更高的可扩展性和灵活性。
构建者模式：OkHttp内置的Request.Builder和Response.Builder使用了构建者模式，方便用户定制自己的请求和响应。
观察者模式：OkHttp中的Callback使用了观察者模式，让用户能够回调自己定义的方法，以便在请求执行完成后进行操作。
单例模式：OkHttp中的OkHttpClient、Dispatcher和ConnectionPool使用了单例模式，确保全局仅存在一个实例，提高了资源利用率。

# 建造者模式
## 什么是建造者模式
将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。
建造者模式是一步一步创建一个复杂的对象，它允许用户**只通过指定复杂对象的类型和内容就可以构建它们**，用户**不需要知道**内部的具体构建细节。建造者模式属于对象创建型模式。
## 建造者模式的类图


## 建造者模式实例
用户需要盖房子的例子。
例如用户需要盖房子，那么他会去联系设计师，根据用户的需求先设计出一套图纸，再将图纸交给建筑工人去建造，最终工人交互房子给用户。
因此涉及到四个对象：设计师，图纸，工人，房子
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/326d19c8cfdcdd0f46b1bcaf794088cf.png)

首先是House，房子对象，房子对象有它的属性，例如要建的高度宽度颜色等。
```java
/**
 * 需要建造的房子
 */
public class House {

    private int height;
    private int width;
    private String color;

    public House() {
    }

    public House(int height, int width, String color) {
        this.height = height;
        this.width = width;
        this.color = color;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    @Override
    public String toString() {
        return "具体建造出的House--->>>{" +
                "height=" + height +
                ", width=" + width +
                ", color='" + color + '\'' +
                '}';
    }
}

```
其次是HouseParam房子图纸对象，它与House对象的属性完全一致，因为我们最终就是按照房子的设计图纸来建筑房子，但有一点不同的是设计图纸是有默认值的，这样即使用户不提任何要求，就说“我要一个房子”，我们也可以建造出一个带有默认值的房子，而不需要用户关系任何细节。
```java
/**
 * 房子的设计图纸
 */
public class HouseParam {
    private int height=100;
    private int width=50;
    private String color="白色";

    public HouseParam() {
    }

    public HouseParam(int height, int width, String color) {
        this.height = height;
        this.width = width;
        this.color = color;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    @Override
    public String toString() {
        return "House的图纸--->>> {" +
                "height=" + height +
                ", width=" + width +
                ", color='" + color + '\'' +
                '}';
    }
}

```
图纸是设计师设计出来的，所以还要有设计师HouseDesigner，它拥有设计图纸的能力，所以持有着图纸的应用，能创造图纸，并且根据用户的需求能为房子图纸设置属性
最终设计师也能和工人沟通，将图纸给工人，工人最终完成建造交互房子给设计师。
```java
/**
 * 房子设计师
 */
public class HouseDesigner {


    private HouseParam houseParam = new HouseParam();
    private Worker worker=new Worker();

    public void setHeight(int height){
        houseParam.setHeight(height);
    }

    public void setWidth(int width){
        houseParam.setWidth(width);
    }

    public void setColor(String color){
        houseParam.setColor(color);
    }

    public static House build(){
        worker.setHouseParam(houseParam);
        return worker.buildHouse();
    }
}
```
建筑工人对象，主要完成3件事情：

1. 拿到图纸
2. 根据图纸建造房子
3. 交互房子给设计师
```java
/**
 * 建筑工人
 */
public class Worker {

    private HouseParam houseParam;
    //拿到图纸
    public void setHouseParam(HouseParam houseParam){
        this.houseParam=houseParam;
    }
    //盖房子
    //交互
    public House buildHouse(){
        House house=new House();
        house.setHeight(houseParam.getHeight());
        house.setWidth(houseParam.getWidth());
        house.setColor(houseParam.getColor());
        return house;
    }
}

```
最终用户只需要和设计师沟通，我需要建造一栋房子
```java
public class Client {
    public static void main(String[] args) {

        HouseDesigner designer=new HouseDesigner();
        designer.setHeight(100);
        designer.setWidth(100);
        designer.setColor("红色");
        House house= designer.build();

        System.out.println(house);
    }
}

```
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/dc7aa2db1912d14ab1357aeeddc24650.png)
可见，建造者模式主要利用了复制的思想，用户提供需求给设计师，设计师设计好图纸，最终工人按照图纸复刻出一栋房子即可。
## Okhttp中的实现
链式调用，okhttp中的建造者可以实现链式调用，我们也来优化一下我们的实现。
只需要改造一下**HouseDesigner类，**让它的每一个为设置属性的方法返回自身。
```java
package com.hnucm.a3_okhttp_java.build;

/**
 * 房子设计师
 */
public class HouseDesigner {


    private static HouseParam houseParam = new HouseParam();
    private static Worker worker=new Worker();

    public HouseDesigner setHeight(int height){
        houseParam.setHeight(height);
        return this;

    }

    public  HouseDesigner setWidth(int width){
        houseParam.setWidth(width);
        return this;

    }

    public  HouseDesigner setColor(String color){
        houseParam.setColor(color);
        return this;
    }

    public static House build(){

        worker.setHouseParam(houseParam);
        return worker.buildHouse();
    }
}

```
```java
public class Client {
    public static void main(String[] args) {

        //第一版实现
        /*HouseDesigner designer=new HouseDesigner();
        designer.setHeight(100);
        designer.setWidth(100);
        designer.setColor("红色");
        House house= designer.build();*/


        House house=new HouseDesigner().setWidth(100).setColor("黑色").build();
        System.out.println(house);
    }
}
```
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/a5f75a97bef7041b258f3d3122d43fab.png)
在**Okhttp**中，我们都知道**OkHttpClient**和**Request**都使用了建造者模式，以**Request**为例：
```java
Request request=new Request.Builder()
	.url("https://www.baidu.com")
    .get()
	.build();
```
Reqeust是我们需要的对象，而Builder就是构造这个对象的“图纸”，Builder也是Request的内部类，从它们的属性就可以窥见，Builder确实就是Request的“图纸”。
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/c5957fe69c4e3dc3992a6d35cf282a51.png)![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/beb49d38dbc8371e4e1163e71356a34c.png)
以下方法均来自Builder类中，可以看到它的这些方法确实是返回了this，因此能够实现链式调用。
```java
public Builder url(HttpUrl url) {
  if (url == null) throw new NullPointerException("url == null");
  this.url = url;
  return this;
}
public Builder header(String name, String value) {
  headers.set(name, value);
  return this;
}
public Builder addHeader(String name, String value) {
  headers.add(name, value);
  return this;
}
···
```
那么何时我们将Builder这一份图纸复制给了Request呢？
在Builder中有build方法，也是我们客户端最后调用的方法，它返回的就是一个Request对象，并将this（也就是我们的Builder对象，我们的“图纸”）传递给Request，并创建了Request。
```java
public Request build() {
  if (url == null) throw new IllegalStateException("url == null");
  return new Request(this);
}
```
以下就是Request的构造函数，它的所有属性都是从“图纸”builder对象中复制过来的。
```java
Request(Builder builder) {
    this.url = builder.url;
    this.method = builder.method;
    this.headers = builder.headers.build();
    this.body = builder.body;
    this.tag = builder.tag != null ? builder.tag : this;
  }
```
## 优缺点
优点

- 在建造者模式中， **客户端不必知道产品内部组成的细节**，将产品本身与产品的创建过程解耦，使得相同的创建过程可以创建不同的产品对象。
- 每一个具体建造者都相对独立，而与其他的具体建造者无关，因此可以**很方便地替换具体建造者或增加新的具体建造者**， 用户使用不同的具体建造者即可得到不同的产品对象 。
- 可以更加精细地控制产品的创建过程 。将复杂产品的创建步骤分解在不同的方法中，使得创建过程更加清晰，也更方便使用程序来控制创建过程。
- **增加新的具体建造者无须修改原有类库的代码**，指挥者类针对抽象建造者类编程，系统扩展方便，**符合“开闭原则”**。

缺点：

- 建造者模式所创建的产品一般具有较多的共同点，其组成部分相似，**如果产品之间的差异性很大，则不适合使用建造者模式**，因此其使用范围受到一定的限制。
- 如果**产品的内部变化复杂**，可能会导致需要定义很多具体建造者类来实现这种变化，导致系统变得很庞大。


# 责任链模式
[视频去哪了？-创建者去哪了？-播单去哪了？-哔哩哔哩视频](https://www.bilibili.com/list/watchlater?oid=884249843&bvid=BV1aK4y1Y71n&spm_id_from=333.1007.top_right_bar_window_view_later.content.click&p=145)
在之前的okhttp的异步请求流程分析中，在`AsyncCall`这个类中获得了一个Response对象，根据方法名getResponseWithInterceptorChain();可以得知是通过责任链的方式得到的一个response对象。那么这个方法之下执行了一些什么呢？
```java
@Override protected void execute() {
      boolean signalledCallback = false;
      try {
        Response response = getResponseWithInterceptorChain();
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
点进去，发现它是外部类RealCall中的一个方法，在其中添加了很多的拦截器
```groovy
Response getResponseWithInterceptorChain() throws IOException {
    List<Interceptor> interceptors = new ArrayList<>();
    // 添加自定义拦截器
    // 我们可以自定义拦截器，它会优先执行，按照我们自定义的规则优先拦截
    interceptors.addAll(client.interceptors());
    // 重试重定向拦截器：负责请求失败的时候实现重试重定向功能
    interceptors.ad  d(retryAndFollowUpInterceptor);
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
如上有多个拦截器，例如我们的一个请求发送过来，首先会经过重试重定向拦截器的处理，如果请求失败会多次重试，然后会进行请求头信息处理拦截器处理，再来到缓存拦截器处理，如此线性的执行，如果在缓存拦截器中找到了当前请求的缓存Response那就会直接返回缓存的Response，同样也是依层次线性往上返回，而不会再去执行到连接服务器请求的拦截器，这样节省了系统性能。
将多种责任划分开来，各司其职。
同时我们也可以自定拦截器，添加进来。
```groovy
// 添加自定义拦截器
// 我们可以自定义拦截器，它会优先执行，按照我们自定义的规则优先拦截
interceptors.addAll(client.interceptors());
```
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/ca97f068a3c3ea0134e5bdb888f5acf9.png)
## 责任链举例
抽象责任
具体责任
每一个责任可以看作是一个责任节点，每一个责任节点要关联下一个责任节点，并且每个节点需要处理自身的责任，如果当前责任节点有能力处理这个任务，那么就去执行，否则就要传递给下一个节点处理。
```java
public abstract class BaseTask {
    //当前节点 有没有能力执行这个任务
    private boolean isTask;

    BaseTask(boolean isTask){
        this.isTask=isTask;
    }
    //执行的下一个节点
    private BaseTask nextTask;
    //添加下一个节点任务
    public void addNextTask(BaseTask nextTask){
        this.nextTask=nextTask;
    }

    //具体由子节点决定执行什么任务
    public abstract  void doAction();
    //执行任务
    public void action(){
        //当前节点有能力执行任务，则执行，否则继续往下走，交给下一个任务节点
        if(isTask){
            doAction();//执行子节点  链条断开
        }else{
            //继续执行下一个 任务节点
            if(nextTask!=null){nextTask.action();}
        }
    }
}

```
具体责任
具体责任继承抽象责任，实现父类的抽象方法，在其中执行具体的责任
```java


public class Task1 extends BaseTask{
    Task1(boolean isTask) {
        super(isTask);
    }

    @Override
    public void doAction() {
        System.out.println("task1 任务节点执行了");
    }
}

```
客户端去调用时，只需要给每一个节点添加它所关联的下一个节点，然后启动任务。
执行的逻辑其实很简单，首先我们的task1执行action方法，会去调用到父类BaseTask的action方法，根据isTask的值来决定是：

- 执行当前节点的doAction方法
- 还是去执行下一个节点的action方法

如果是执行当前节点的doAction方法，那么这个任务就被拦截了，责任链被切断。如何是继续去执行下一个节点的action方法，那么同样又会调用到父类BaseTask的action方法。
```java
public class ChainClient {
    public static void main(String[] args) {
        Task1 task1=new Task1(false);
        Task2 task2=new Task2(false);
        Task3 task3=new Task3(true);
        Task4 task4=new Task4(false);
        task1.addNextTask(task2);
        task2.addNextTask(task3);
        task3.addNextTask(task4);
        task1.action();
    }
}
```
## okhttp中的责任链
根据上面的代码，可以看到我们是把所有的责任节点添加到了一个集合中，然后通过chain（这是一个接口它的实现类是RealInterceptorChain）的proceed方法去执行原始的请求。

```java
Response getResponseWithInterceptorChain() throws IOException {
    //将所有的责任节点添加到集合中
    List<Interceptor> interceptors = new ArrayList<>();
    ···
    //将集合interceptors作为参数传入
    Interceptor.Chain chain = new RealInterceptorChain(interceptors, null, null, null, 0,
            originalRequest, this, eventListener, client.connectTimeoutMillis(),
            client.readTimeoutMillis(), client.writeTimeoutMillis());
	//推进任务在责任链上流动
    return chain.proceed(originalRequest);
}

```
来到RealInterceptorChain类的proceed方法中
```java
 public Response proceed(Request request, StreamAllocation streamAllocation, HttpCodec httpCodec,
      RealConnection connection) throws IOException {
    
    //异常处理
     ······

    // 唤起下一个责任节点
     //注意：这里的interceptors就是我们在外面看到的责任链集合
     //index起始值是0，标识当前是哪一个责任节点
    RealInterceptorChain next = new RealInterceptorChain(interceptors, streamAllocation, httpCodec,
        connection, index + 1, request, call, eventListener, connectTimeout, readTimeout,
        writeTimeout);
     //拿到当前的责任节点
    Interceptor interceptor = interceptors.get(index);
     //执行当前任务节点的intercept方法，并携带着下一个节点next对象
    Response response = interceptor.intercept(next);

    //对返回结果response的处理
     ·······

    return response;
  }
```
## 责任链举例2
同样的基于okhttp的责任链，我们先看一个简单的责任链的实现
首先定义一个接口，用于抽象出子类需要去决定处理任务后推进任务到下一个节点的方法
```java
interface IBaseTask {

    /**
     *
     * @param isTask 是否有能力处理这个任务
     * @param iBaseTask 下一个责任节点
     */
    void doRunAction(String isTask,IBaseTask iBaseTask) throws Exception;
}

```
每一个责任节点都实现类接口IBaseTask，根据isTask是否有能力处理这个任务来决定，

- 处理这个任务
- 还是推进这个任务到下一个责任节点
```java
public class Task1 implements IBaseTask{
    @Override
    public void doRunAction(String isTask, IBaseTask iBaseTask) throws Exception {
        if ("no".equals(isTask)){
            System.out.println("Task1 处理了任务...");

        }else{
            iBaseTask.doRunAction(isTask,iBaseTask);
        }
    }
}

```
最终负责管理这些节点的类也实现IBaseTask接口，它掌管着所有的责任节点，以及实现doRunAction，负责取出责任节点，并调用节点的doRunAction方法，具体是否能处理这个任务由节点本身决定。
```java
public class ChainManager implements IBaseTask{
    //当前的责任节点下标
    private int index=0;
    //责任节点集合
    List<IBaseTask> list=new ArrayList<>();
    //增加一个责任节点
    public void addTask(IBaseTask iBaseTask){
        list.add(iBaseTask);
    }

    //处理任务
    @Override
    public void doRunAction(String isTask, IBaseTask iBaseTask) throws Exception {
        if(index>=list.size()){
            throw new Exception("下标超出");
        }
        IBaseTask iBaseTaskResult=list.get(index);
        index++;
        iBaseTaskResult.doRunAction(isTask,iBaseTask);
    }
}

```
对于客户端使用，只需要添加节点，然后执行doRunAction方法，推进任务执行。
```java
public class Chain2Client {
    public static void main(String[] args) throws Exception {
        ChainManager manager=new ChainManager();
        manager.addTask(new Task1());
        manager.addTask(new Task2());
        manager.addTask(new Task3());
        manager.doRunAction("ok",manager);
    }
}

```
这个设计中很巧妙的是ChainManager类也实现了IBaseTask接口，并且客户端在调用doRunAction方法时传入的下一个节点并不是哪一个具体节点（第二个参数），而是ChainManager对象它本身。
这样我们分析一下，首先doRunAction来到ChainManager类中，因为index初始为0，所以去取出来的iBaseTaskResult就是Task1，然后index++，再调用iBaseTaskResult的doRunAction，并且将iBaseTask传入，也就是一开始传入的manager，所以这里起始调用的就是task1的doRunAction，并且manager也被传入进来。如果在task1中不能处理任务，又会通过传入的iBaseTask，也就是manager，调用doRunAction又回到ChainManager类中，因为index已经被++了，这次再取出来的iBaseTaskResult就是task2了，如此往下哥节点流动，知道任务被处理完成。
## 回到源码
根据案例2的分析，我们知道源码中的RealInterceptorChain其实就充当着manager的角色，负责管理所以的责任节点，通过index++去取出下一个节点。
第三步拿到的责任节点就是在集合中的第一个责任节点，没有自定义拦截器的情况下，第一个责任节点就是**RetryAndFollowUpInterceptor**，然后调用它内部的`intercept`方法
```java
 public Response proceed(Request request, StreamAllocation streamAllocation, HttpCodec httpCodec,
      RealConnection connection) throws IOException {
    
    //1.异常处理
     ······

    // 2.唤起下一个责任节点
     //注意：这里的interceptors就是我们在外面看到的责任链集合
     //index起始值是0，标识当前是哪一个责任节点
    RealInterceptorChain next = new RealInterceptorChain(interceptors, streamAllocation, httpCodec,
        connection, index + 1, request, call, eventListener, connectTimeout, readTimeout,
        writeTimeout);
     //3.拿到当前的责任节点
    Interceptor interceptor = interceptors.get(index);
     //4.执行当前任务节点的intercept方法，并携带着下一个节点next对象
    Response response = interceptor.intercept(next);

    //5.对返回结果response的处理
     ·······

    return response;
  }
```
来到**RetryAndFollowUpInterceptor**，然后调用它内部的`intercept`方法
只看重点部分，首先它将传入的下一个节点chain转为RealInterceptorChain对象，执行完自己的责任后，就调用了proceed方法，这是的realChain是RealInterceptorChain对象，所以又回到了RealInterceptorChain类中的proceed方法
因为之前index+1了，所以再取就是下一个责任节点了，然后依次不断往责任链的下游流动，并且可以肯定每一个责任节点中的intercept方法都会调用RealInterceptorChain类中的proceed方法
```java
@Override public Response intercept(Chain chain) throws IOException {
    Request request = chain.request();
    //1.将传入的下一个节点chain转为RealInterceptorChain对象
    RealInterceptorChain realChain = (RealInterceptorChain) chain;
    Call call = realChain.call();
    //2.执行自己的责任
    streamAllocation = new StreamAllocation(client.connectionPool(), createAddress(request.url()),
        call, eventListener, callStackTrace);
    ······
    while (true) {
      ······
      try {
          //3.通过realChain继续推进任务链的下流
        response = realChain.proceed(request, streamAllocation, null, null);
        releaseConnection = false;
      } 
     ······
    }
  }
```
**BridgeInterceptor**类，请求头拦截器，其他的拦截器就不看了。
```java
@Override public Response intercept(Chain chain) throws IOException {
    Request userRequest = chain.request();
    Request.Builder requestBuilder = userRequest.newBuilder();

    RequestBody body = userRequest.body();
    //1.执行当前节点的责任
    ······

    //2.调用proceed方法
    Response networkResponse = chain.proceed(requestBuilder.build());

    ······

    return responseBuilder.build();
  }

```
