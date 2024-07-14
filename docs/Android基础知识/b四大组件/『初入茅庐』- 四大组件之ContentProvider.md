![黄绿色手绘风新闻资讯微信公众号封面 (3).gif](https://cdn.nlark.com/yuque/0/2024/gif/32682386/1704617525888-08bf9286-21c3-481b-97b6-35a84fa6fe8d.gif#averageHue=%2370b737&clientId=u3cd30631-5e21-4&from=paste&height=383&id=u08edee3d&originHeight=383&originWidth=900&originalType=binary&ratio=1&rotation=0&showTitle=false&size=388371&status=done&style=none&taskId=uc8310bc6-47d4-4091-8a6c-adf0e3e5b1f&title=&width=900)
[https://blog.csdn.net/qq_29966203/article/details/90382633](https://blog.csdn.net/qq_29966203/article/details/90382633)
# 什么是ContentProvider
ContentProvider是内容提供者，是**数据共享型**组件，主要用于实现组件之间或者应用之间的数据共享。
实现各个APP应用/进程间进行数据交互与共享（是一种跨进程通信实现方式）
怎么理解ContentProvider呢，可以把他看作是一种对底层数据库的抽象，它不提供数据，只是数据的搬运工，通过它可以把自己的应用数据根据需求开放给其他应用进行增、删、改、查。
![](https://cdn.nlark.com/yuque/0/2023/png/32682386/1702540120129-538e38bb-b5d7-4d34-adf8-b57841a4a39b.png#averageHue=%23fdfbfb&clientId=u175b4156-d8bf-4&from=paste&id=u51748173&originHeight=460&originWidth=720&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue76176c6-b7d2-4bfa-bc51-0617040c579&title=)
# 数据共享的原理
因为涉及到跨进程通信，就不展开了。使用的是Binder机制
![](https://cdn.nlark.com/yuque/0/2023/png/32682386/1702540173920-8bc8047b-8c5f-4025-93cc-8249cceb0b37.png#averageHue=%23f7f7f6&clientId=u175b4156-d8bf-4&from=paste&id=ube847403&originHeight=773&originWidth=960&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u87179aaa-8b28-488c-9e3f-1e3992a07d2&title=)
# 统一标识符
ContentProvider使用统一资源标识符定位资源。
什么是统一资源定位符？
**Uniform Resource Identifier**，即统一资源标识符，简称**URI**
作用：**唯一标识 ContentProvider 与 其中的数据**：外界进程通过 URI 找到对应的ContentProvider 与 其中的数据，再进行数据操作。所以**ContentProvider只是数据的搬运工，从哪里搬运，使用URI来指定**
分类：URI分为 系统预置 & 自定义，分别对应系统内置的数据（如通讯录、日程表等等）和自定义数据库。
URI的组成部分：
![](https://cdn.nlark.com/yuque/0/2023/png/32682386/1702550260676-21ec9743-ca25-45f0-926f-5caafb8842bb.png#averageHue=%23ededed&clientId=u175b4156-d8bf-4&from=paste&id=uc9da09e0&originHeight=208&originWidth=800&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u285ac68e-d317-4ac5-ba73-0dcbe6f9022&title=)
样例：
```java
content://com.scc.userprovider/user    多条
content://com.scc.userprovider/user/10  第10条（单条）
```
# ContentProvider
数据组织方式：ContentProvider主要以表格形式组织数据（表、记录、字段）
主要使用方法：增删改查
以下4个方法由外部进程回调，并运行在ContentProvider进程的Binder线程池中（不是主线程）
```java
// 外部进程向 ContentProvider 中添加数据
public Uri insert(Uri uri, ContentValues values)
// 外部进程 删除 ContentProvider 中的数据
public int delete(Uri uri, String selection, String[] selectionArgs)
// 外部进程更新 ContentProvider 中的数据
public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs)
// 外部应用 获取 ContentProvider 中的数据
public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs,  String sortOrder)　

```
存在多线程并发访问，需要实现**线程同步**

1. 若ContentProvider的数据存储方式是使用SQLite & 一个，则不需要，因为SQLite内部实现好了线程同步，若是多个SQLite则需要，因为SQL对象之间无法进行线程同步
2. 若ContentProvider的数据存储方式是内存，则需要自己实现线程同步
# **ContentResolver**
故名思义：内容解析器。ContentProvider通过暴露出增删改查的方法以便外界提供操作数据，而外界并非直接获取ContentProvider对象来操作这些数据，而是利用ContentResolver通过URI来操作这些数据。

1. 充当不同应用调用方访问同一个ContentProvider共享数据的接口
2. 统一管理同一个应用中访问不同的应用提供的ContentProvider间的操作

解释一下什么是：充当不同应用调用方访问同一个ContentProvider共享数据的接口
因为一般来说ContentProvider是单例模式，即数据的提供者只有一个，而多个应用都可通过ContentResolver调用ContentProvider的增删改查操作数据，ContentResolver调用的数据操作会让同一个ContentProvider处理。
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32682386/1704617007548-6caf0842-7b35-45a8-8535-01346ba06b2e.png#averageHue=%23f6f5f5&clientId=u3cd30631-5e21-4&from=paste&height=455&id=ub1cf8a15&originHeight=455&originWidth=1165&originalType=binary&ratio=1&rotation=0&showTitle=false&size=95928&status=done&style=none&taskId=u6fca278e-57c5-4d53-ad24-2e447dd6e43&title=&width=1165)
除此之外 ContentResolver 也发挥着 统一管理不同 ContentProvider间的操作 的作用
一款应用可能要使用多个ContentProvider（手机中可能安装很多含有Provider应用，比如联系人应用、日历应用、字典应用等等），故用一个ContentResolver对所有ContentProvider统一管理能降低操作成本，实现难度小。而如何区分不同的ContentProvider，那就是通过URI来区分。所以大家肯定对URI所发挥的作用理解更深了。
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32682386/1704617418369-9ff92961-18de-4369-9473-fbdac0d15f98.png#averageHue=%23f5f5f4&clientId=u3cd30631-5e21-4&from=paste&height=405&id=u21e1af39&originHeight=405&originWidth=1474&originalType=binary&ratio=1&rotation=0&showTitle=false&size=109771&status=done&style=none&taskId=uc94dba9a-7fda-4f7f-8fdd-f1fc43d6bef&title=&width=1474)
主要使用：ContentResolver提供了与ContentProvider一一对应的CRUD方法。
```java
// 外部进程向 ContentProvider 中添加数据
public Uri insert(Uri uri, ContentValues values)　
// 外部进程 删除 ContentProvider 中的数据
public int delete(Uri uri, String selection, String[] selectionArgs)
// 外部进程更新 ContentProvider 中的数据
public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs)　
// 外部应用 获取 ContentProvider 中的数据
public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder)

```
