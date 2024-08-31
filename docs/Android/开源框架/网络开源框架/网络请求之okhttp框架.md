
![](/images/a5b04cd491bc341ef82224ac2318bfa2.jpeg)
# 上期回顾

> 上一期我们实现了Android的网络编程，通过Java代码在子线程中请求数据，再通过Java代码解析json数据，因为对于较复杂的json数据，通过java代码需要逐层解析比较困难，所以我们又通过第三方框架GSON，使用它可以直接将字符串解析成对象，并且封装成为一个实体类，配合实体类插件GsonFormatPlus，让我们只需通过简单的几行代码就实现数据解析

网络请求：java-》OKHTTP
数据解析：java解析-》GSON配合插件解析
> 网络编程的数据解析部分已经十分的方便了，但网络请求数据部分，通过java代码创建子线程请求到数据，然后又要通过`runOnUiThread(new Runnable()`方法线程切换到主线程将设数据设置到主线程的控件上，对于开发不便，我们这期学习如何使用OKHTTP框架实现网络请求，解决线程切换的问题

# 原生网络请求的缺点
> 1. 每次网络访问需要放在子线程里
> 2. 每次得到结果需要返回到主线程才能更新控件显示
> 3. 需要对各种情况进行处理，没有对状态码判断


# okhttp框架引入
框架官网地址：[**https://github.com/square/okhttp**](https://github.com/square/okhttp)
在Android应用开发中，有严格的权限把控，既然需要访问网络自然需要**网络请求权限**
```java
<uses-permission android:name="android.permission.INTERNET"/>
```
除此之外还需要加上这一行，否则http的网页请求不成功
```java
android:usesCleartextTraffic="true"
```
![](/images/e1e350d18ff854554d4e2497e0296c9e.png)
添加依赖
```java
implementation("com.squareup.okhttp3:okhttp:4.9.3")
```
![](/images/bf19c1f6ab4437bfa0eb9c85871f02e0.png)
# okhttp使用步骤
1、创建`**OkHttpClient**`: 首先，我们需要创建一个 `**OkHttpClient**` 对象，这个对象会管理一些共享的资源，如：连接池、拦截器等。
2、创建 `**Request**`: 接下来，我们需要创建一个 `**Request**` 对象，这个对象包含有请求地址、头信息、请求方法、请求体等相关内容。
3、发送请求: 使用 `**OkHttpClient**` 的 `**newCall()**` 方法创建一个 `**Call**` 对象，其实实际请求网络的是Call接口的真正的实现类是RealCall，通过调用 Call 的 `**execute() 同步**`或者`** enqueue() 异步**` 方法来发送请求。**怎么理解同步和异步呢？**
4、处理响应: 发送请求后，`**OkHttp**`会返回一个 `**Response**` 对象，这个对象包含有响应状态码、头信息、响应体等相关内容。
5、释放资源: 最后，我们需要释放一些资源，如：连接池、缓存等。
![](/images/b6f27757a0c3e5976cfbb4d84ebcdee4.jpeg)
## 发起异步请求

```java
//发起异步请求
//无需手动创建子线程，框架默认帮我们创建

//1.创建一个okhttp对象
OkHttpClient okHttpClient=new OkHttpClient();
//2.创建一个Request对象
//里面存放请求到的数据，调用Request类里的builder()方法，相当于调用了Request的静态方法
//.url请求的地址
//.get() 请求的方式 常用的请求方法1.get() 2.post() 这个由后端的接口决定
//.build()
Request request=new Request.Builder()
        .url("http://121.4.44.56/object")
        .get()
        .build();
//3.创建Call对象
Call call = okHttpClient.newCall(request);
//4.发起请求
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
## 发起同步请求
```java
//发起同步请求
//无需手动创建子线程，框架默认帮我们创建

//1.创建一个okhttp对象
OkHttpClient okHttpClient=new OkHttpClient();
//2.创建一个Request对象
//里面存放请求到的数据，调用Request类里的builder()方法，相当于调用了Request的静态方法
//.url请求的地址
//.get() 请求的方式 常用的请求方法1.get() 2.post() 这个由后端的接口决定
//.build()
Request request=new Request.Builder()
        .url("http://121.4.44.56/object")
        .get()
        .build();
//3.创建Call对象
Call call = okHttpClient.newCall(request);
//4.发起请求
//发送请求后，当前线程就会进入阻塞状态，直到收到响应
Response response = call.execute();
```
# okhttp的优点
[概述 - OkHttp (square.github.io)](https://square.github.io/okhttp/)
由此我们可以知道okhttp框架相较于传统的网络请求的优势：
优势一：无需自己创建子线程，okhttp自动帮我们创建
优势二：返回的数据不再是数据流，而是转换好的string字符串
优势三：自动处理异常情况，提供`onFailure()`方法
当然OkHttp的功能不仅仅如此，如下是okhttp的优点：（每一点都可以展开讲一篇博文）
> 1. 高效性能: OkHttp使用现代的**HTTP/2**协议来减少网络请求的延迟和提升性能。
> 2. 简单易用: OkHttp提供了简单易用的API和丰富的文档，开发者可以快速上手使用。
> 3. 自定义拦截器: OkHttp支持**自定义拦截器**，可以用于添加请求头、重定向请求、设置缓存等操作。
> 4. 连接池: OkHttp使用**连接池技术**，可以减少网络请求的连接建立时间，提升性能。
> 5. 支持异步请求: OkHttp支持**异步请求**，可以避免主线程阻塞，提高应用程序的响应速度。
> 6. 支持缓存: OkHttp支持**缓存技术**，可以减少网络请求的次数，提升性能。
> 7. 支持HTTPS: OkHttp支持HTTPS协议，可以保证数据传输的安全性。

OkHttp 适用于 Android 5.0+（API 级别 21+）和 Java 8+。


> 


打印测试结果：

![](/images/347121a6a655e9f2d43deb6ffab2600f.png)

# gson数据解析

以上通过okhttp请求返回的数据还是没有经过解析的，我们可以使用上节课的GSON搭配实体类插件`GsonFormatPlus`来解析数据
第一步：添加gson依赖
```java
//添加GSON依赖
implementation 'com.google.code.gson:gson:2.9.0'
```
第二步：创建实体类
我们可以复制json数据，通过实体类插件`GsonFormatPlus`快速创建
![](/images/c3ee084dd477f6f2f52890b88b772d00.gif)
第三步：解析数据
```java
//GSON搭配实体类插件`GsonFormatPlus`来解析数据
Gson gson=new Gson();
Student student=gson.fromJson(result,Student.class);
```
![](/images/8e55da690f522e8d7b1fd93e167de48f.png)
第四步：设置到文本控件上显示
我们先得给文本控件取一个id，为了方便查看，我设置了文本的大小和颜色
![](/images/d34ab2fc95a1d8400b44548665e8b8c2.png)
然后将解析出的数据设置到文本控件上
同样的在okhttp中我们需要切换线程到主线程来设置数据到控件上，说明okhttp框架只帮我们解决了构建子线程的问题，线程切换还是需要自己实现
![](/images/a9cbf7f0858571cf79d208bc2c43a9d8.png)
运行可以看到名字已经解析出来并显示在虚拟机上
![](/images/dc9bcddf52e5d132eb522bd66edbdc31.png)
> 小tips：这里我不知为什么没写线程切换直接跑，也运行出来了。没搞懂，先记录在这里
> 为什么不能在子线程更新UI？本质是什么？这里可以扩展写一篇

# fastmock在线接口
[1.介绍 · fastmock教程 (gitee.io)](https://marvengong.gitee.io/fastmock-docs/)
fastmock可以让你在没有后端程序的情况下能真实地在线模拟ajax请求，你可以用fatmock实现项目初期纯前端的效果演示，也可以用fastmock实现开发中的数据模拟从而实现前后端分离。
# okhttp小结
原生的网络请求存在的问题：

1. 每次网络访问需要放在子线程里
2. 每次得到结果需要返回到主线程才能更新控件显示
3. 需要对各种情况进行处理，没有对状态码判断

okhttp解决的问题：

1. 无需自己创建子线程，okhttp自动帮我们创建
2. 返回的数据不再是数据流，而是转换好的string字符串
3. 自动处理异常情况，提供`onFailure()`方法

但是也仍然存在一下不足：

1. 获取的json字符串，仍然需要借助GSON框架去解析为实体类
2. 没有实现线程切换，如果需要将请求到的数据绑定到UI上需要手动切换线程
# 

> 网络请求-》java-》OKHTTP-》Retrofit
> 数据解析-》java解析-》GSON配合插件解析


`Retrofit`是对http网络请求框架的封装，一般由`okhttp`来负责网络请求，`retrofit`对请求接口
进行封装。`retrofit`通过接口和注解来描述我们的网络请求，然后通过`client`去调用`okhttp`
框架，通过`addConverterFactory`来实现对返回的json数据进行处理，转换成我们需要的数
据类型，可以理解为**okhttp的加强版，底层封装了Okhttp**。

## 框架引入

```java
    //添加okhttp依赖/
    implementation("com.squareup.okhttp3:okhttp:4.9.3")
    //添加Retrofit依赖
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
```

![](/images/096da1671e8a3c92e0732c0b05e8ac28.png)

## 框架使用

### 创建接口

创建一个接口，返回值是Call类型，使用泛型封装Student类，注意引入包不要用okhttp的

![](/images/3fbd71b5c4ec2c730c4beddac75cc093.png)

```java
import retrofit2.Call;
import retrofit2.http.GET;

public interface Api {
    //http://121.4.44.56/object
    //使用get注解，放入请求的地址的最后一部分，前面的部分会在别处拼接
    @GET("object")
    Call<Student> getStudent();
}
```

### 数据请求&数据解析

回到MainActivity方法，将之前写的用okhttp框架的所有代码注释，以及删除对于的所有包

使用Retrofit框架来实现同样的功能

值得注意的是Retrofit框架在okhttp的基础上进一步封装，我们无需手动解析数据，也无需抛出线程

```java
//使用Retrofit框架
//1..创建一个Retrofit对象
Retrofit retrofit=new Retrofit.Builder()
    .baseUrl("http://121.4.44.56/")
    .addConverterFactory(GsonConverterFactory.create())//表示以GSON框架解析数据
    .build();

//2.获取到Api接口
//返回一个接口实例
Api api = retrofit.create(Api.class);

//3.通过Api获取到实体类Student
retrofit2.Call<Student> call=api.getStudent();

//4.enqueue一个队列，程序可以发起多个请求，将这些请求存在队列中一个一个的处理
call.enqueue(new Callback<Student>() {
    @Override
    public void onResponse(Call<Student> call, Response<Student> response) {
        //请求成功：返回的结果是一个call对象，而不再是response，
        //默认将请求的结果抛回到主线程
        Student student = response.body();
        txtView.setText(student.name);
    }

    @Override
    public void onFailure(Call<Student> call, Throwable t) {
        //请求失败
    }
});
```

### 日志拦截（Retrofit优化）

Retrofit框架看上去已经很完美了，但是因为它帮我们完成了数据解析，我们无法捕获数据解析是否成功，所以当数据解析失败时通过`response.body();`是获取不到数据的

面对这个问题同样也有解决办法

我们引入一下依赖

```java
//拦截日志依赖
implementation 'com.squareup.okhttp3:logging-interceptor:4.9.3'
```

![](/images/042070a3b9af0238e4c19943c9bc97f8.png)

通过如下工具类进行拦截，使用这个工具类我们通过日志过滤的方法查看请求的状态和数据解析是否成功

```java

public class RetrofitUtils {

    public static Retrofit getRetrofit(String url) {
        //日志显示级别
        HttpLoggingInterceptor.Level level= HttpLoggingInterceptor.Level.BODY;
        //新建log拦截器
        HttpLoggingInterceptor loggingInterceptor=new HttpLoggingInterceptor(new HttpLoggingInterceptor.Logger() {
            @Override
            public void log(String message) {
                Log.d("RetrofitMessage","OkHttp====Message:"+message);
            }
        });
        loggingInterceptor.setLevel(level);
        //定制OkHttp
        OkHttpClient.Builder httpClientBuilder = new OkHttpClient
                .Builder();
        //OkHttp进行添加拦截器loggingInterceptor
        httpClientBuilder.addInterceptor(loggingInterceptor);

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(url)
                .addConverterFactory(GsonConverterFactory.create())
                .client( httpClientBuilder.build())
                .build();

        return retrofit;
    }

}
```

使用这个工具类也能简化请求数据的代码，我们只需这么一行代码就能拿到Api接口实例

```java
Api api = RetrofitUtils.getRetrofit("http://121.4.44.56/").create(Api.class);
```

![](/images/ad45265e7952a093d8cd0fac82de3049.png)

通过debug级的日志过滤我们可以查看数据请求的状态信息和数据解析结果，也方便我们排错分析

![](/images/8c114e6deb18276b7ba552e2c24cb70e.png)

# 笔记源码
[starry陆离/LessonTwo - 码云 - 开源中国 (gitee.com)](https://gitee.com/starry_lixu/LessonTwo)
