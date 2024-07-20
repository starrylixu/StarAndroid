![黄绿色手绘风新闻资讯微信公众号封面 (1).gif](https://cdn.nlark.com/yuque/0/2024/gif/32682386/1704599283938-29ff8ad5-e0f2-4a0b-b401-9c51a3d26b62.gif#averageHue=%2371ba38&clientId=ua2c31edd-b4a1-4&from=paste&height=383&id=u47b2b59f&originHeight=383&originWidth=900&originalType=binary&ratio=1&rotation=0&showTitle=false&size=385716&status=done&style=none&taskId=uf8b8a062-10ce-4f78-9249-c0cefd40619&title=&width=900)
# 什么是Service
`Service` 是一种可**在后台执行长时间运行操作**而不提供界面的应用组件。可以理解为是一种专门用于后台计算的组件。
例如，服务可在后台处理网络事务、播放音乐，执行文件 I/O 或与内容提供程序进行交互。
> 注意：服务在其托管进程的主线程中运行，它既**不**创建自己的线程，也**不**在单独的进程中运行（除非另行指定）。所以在Service中不能进行耗时的操作

# Service的生命周期
与Activity不同，Service的生命周期有两种，这对应着两种创建服务的方式：**启动服务**与**绑定服务**
![](https://cdn.nlark.com/yuque/0/2023/png/32682386/1702519385990-0035f317-7fac-4f4b-a0d8-587d8fe429da.png#averageHue=%23968d6f&clientId=u92d60ce7-d308-4&from=paste&id=ueb870115&originHeight=507&originWidth=389&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8daf4596-ee9a-433a-a3e6-ccf21fc93d7&title=)
图中展示的5个方法是Service内部调用，其次我们还有手动调用的4个方法，提供给开发者去启动/关闭服务，绑定/解绑服务
4个手动调用的方法

- startService() 启动服务
- stopService() 关闭服务
- bindService() 绑定服务
- unbindService() 解绑服务

5个内部自动调用方法

- onCreat() 创建服务
- onStartCommand() 开始服务
- onDestroy() 销毁服务
- onBind() 绑定服务
- onUnbind() 解绑服务

## 手动调用的方法
下面主要分析一下4个手动调用的方法，其他的5个自动调用的方法会被手动调用的方法自动触发
### startService
作用：启动Service服务
调用startService后会自动调用方法：onCreate()和onStartCommand()
需要注意

1. onCreate()和onStartCommand()的区别：一个Service被sartService多次启用，onCreate()只会调用一次，onStartCommand()可以多次调用（onStartCommand的调用次数=startService调用次数）
2. onStartCommand()必须返回一个整数=**描述系统因异常**（1.内存不足2.进程关闭等）在杀死onStartCommand()后的服务后应该如何继续运行

返回值有三种，分别是：

- **START_STICKY（粘性）**：系统在onStartCommand返回后终止服务，**会重新启动服务&调用onStartCommand**，但不保留已传入的intent。适用于媒体播放器类似服务，不执行命令，但要一直执行并随时待命。
- **START_NOT_STICKY（非粘性）**：系统在onStartCommand返回后终止服务，**不会重新启动服务**。可以避免在不必要时服务自动重启以及应用能够轻松重启所有未完成的作业时运行服务。
- **START_REDELIVER_INTENT（重传Intent）**：系统在onStartCommand返回后终止服务，**会重新启动service&通过传递给服务最后一个intent调用onstartCommand()**。适用于主动执行应该立即恢复工作的活跃服务，比如下载文件。

有一个很好的比喻，可以理解为发生车祸后的人：
**START_STICKY**：车祸后自己苏醒，但是失忆；
**START_NOT_STICKY**：车祸后再也没有苏醒；
**START_REDELIVER_INTENT**：车祸后自己苏醒，依然保持记忆。
![](https://cdn.nlark.com/yuque/0/2023/png/32682386/1702521985541-3974b6c2-0252-463e-aeee-437c60ab8f68.png#averageHue=%23f8f8f8&clientId=u0a630a6b-dddf-4&from=paste&id=uc4bcc15e&originHeight=179&originWidth=1119&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7bb805b7-1a50-4daa-8310-3486251d50a&title=)
### stopService
作用：关闭Service服务
调用stopService后会自动调用方法：onDestroy
两种情况下无法关闭服务（无法调用onDestroy）：

1. 服务本身已经被关闭
2. 通过启动&绑定创建的服务未解绑（没有调用unbindService）无法关闭

![](https://cdn.nlark.com/yuque/0/2023/png/32682386/1702522185302-a0596c48-fbce-4446-8a5e-2b5737e05c6e.png#averageHue=%23fbfafa&clientId=u0a630a6b-dddf-4&from=paste&id=u56831e47&originHeight=306&originWidth=1259&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2cf9e726-485b-4716-bc68-b3abc99eb1f&title=)
### bindService
作用：绑定Service服务
调用bindService后会自动调用的方法：onCreate()、onBind()
![](https://cdn.nlark.com/yuque/0/2023/png/32682386/1702522432370-6c82520a-37b3-4927-87d1-b28db3ea9661.png#averageHue=%23fafafa&clientId=u0a630a6b-dddf-4&from=paste&id=u94e569c1&originHeight=244&originWidth=1168&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub3e29339-0622-4761-88e3-b64ec5ee6c0&title=)
### unbindService
作用：解绑Service服务
调用unbindService后会自动调用的方法：onUnbind()、onDestroy()
![](https://cdn.nlark.com/yuque/0/2023/png/32682386/1702522520366-9c10d3c7-727d-4b9e-9cc2-b0b809e06cfb.png#averageHue=%23fbfbfb&clientId=u0a630a6b-dddf-4&from=paste&id=u79ecfcf2&originHeight=299&originWidth=1432&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2e18cab9-24da-4950-9d8a-bcaeff41dc3&title=)
## 启动方式

### 启动服务-只使用startService

![](https://cdn.nlark.com/yuque/0/2023/png/32682386/1702522814009-d1231516-dce8-4408-b760-a423e80560c9.png#averageHue=%23f5f5f5&clientId=u0a630a6b-dddf-4&from=paste&id=u7b84063c&originHeight=147&originWidth=1578&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3857752a-77e9-4021-b746-fbe31a71c41&title=)

1. 一个Service的onCreate只调用一次（只有一个Service实例），onStartCommand调用次数=startService调用次数
2. startService与stopService配对（必须通过stopService关闭Service）
3. 只使用startService，**无法与Activity交互，绑定者无法操作Service**
### 绑定服务-只使用bindService
![](https://cdn.nlark.com/yuque/0/2023/png/32682386/1702522964785-656ac1ae-646d-4a09-9541-2faa8a984e37.png#averageHue=%23f8f8f8&clientId=u0a630a6b-dddf-4&from=paste&id=u236848a8&originHeight=183&originWidth=1718&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9a5b3eb5-6968-4def-b15f-a8772338c47&title=)

1. 一个Service的onCreate只调用一次（只有一个Service实例），onBind调用次数=BindService调用次数，多个绑定者可以绑定到同一个服务上
2. bindService与unbindService配对，当该Service所有绑定者解绑后，系统会自动销毁服务（不需手动stop）
3. bindService**能让Activity与Service交互**，绑定者通过一个**iBinder接口**与服务通信
### 启动服务后绑定-startService+bindService
![](https://cdn.nlark.com/yuque/0/2023/png/32682386/1702523068543-2dfaf050-b052-43ee-8f6a-49301b1ef818.png#averageHue=%23fbfbfb&clientId=u0a630a6b-dddf-4&from=paste&id=ud5839f68&originHeight=456&originWidth=2170&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua6e40376-8081-4a05-9bff-1f74f053ebf&title=)
关于操作Service：

1. startService、stopService只能开启&关闭Service，但无法操作Service
2. bindService、unbindService除了绑定Service还能操作Service

关于Service销毁:

1. startService+bindService开启的Service，绑定者退出后Service仍存在，即调用了unbindService后，**服务不会自动调用onDestory销毁**。这是与只使用bindService最大的区别
2. 只使用bindService开启的Service，绑定者退出后，**Service随着调用者退出销毁**
# Service分类
Service的分类可以按照3个维度划分：

- 按运行地点分（1）本地服务（2）远程服务
- 按运行类型分（1）前台服务（2）后台服务
- 按服务功能分（1）可通信服务（2）不可通信服务
## 按运行地点
### 本地服务
特点：

1. 运行在主线程
2. 主线程被终止后，服务也被终止
3. 节约资源，不需要AIDL/IPC跨进程通信

使用的场景：
处理需要依附于某个进程、不需要常驻的任务。例如音乐播放。
使用实例：
步骤1：新建子类继承Service类
需重写父类的onCreate()、onStartCommand()、onDestroy()和onBind()方法
步骤2：构建用于启动Service的Intent对象
步骤3：调用startService()启动Service、调用stopService()停止服务
步骤4：在AndroidManifest.xml里注册Service
### 远程服务
远程服务一般有两个角色，即客户端和服务端，远程服务提供服务，而调用方成为客户端。
特点：

1. 运行在独立进程，相较于本地服务更耗资源
2. 服务常驻后台，不受其他Activity影响
3. 使用AIDL进行跨进程通信

使用的场景：
系统级别服务（常驻）,多个应用程序共享同一个后台服务（跨进程通信）
> 扩展：IPC：Inter-Process Communication，即跨进程通信
> AIDL：Android Interface Definition Language，即Android接口定义语言；用于让某个Service与多个应用程序组件之间进行跨进程通信，从而可以实现多个应用程序共享同一个Service的功能。

远程服务与本地服务最大的区别是：远程Service与调用者不在同一个进程里（即**远程Service是运行在另外一个进程**）；而本地服务则是与调用者运行在同一个进程里
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1684028869761-ac30ff3c-5a24-45f3-9aa8-6edb5581ff3f.png#averageHue=%23f2f2f2&clientId=u4729d77b-f9a7-4&from=paste&id=Q5IiC&originHeight=240&originWidth=1000&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=47993&status=done&style=none&taskId=u7d710f5c-d036-41fb-85c7-83bfba2b68a&title=)
为了让远程Service与多个应用程序的组件进行**跨进程通信（IPC）**，需要使用AIDL
最简单的多进程通信中，存在两种进程角色：服务器端和客户端
服务器端：
步骤1：新建定义AIDL文件，并声明该服务需要向客户端提供的接口
步骤2：在Service子类中实现AIDL中定义的接口方法，并定义生命周期的方法（onCreat、onBind()、blabla）
步骤3：在AndroidMainfest.xml中注册服务 & 声明为远程服务
客户端：
步骤1：拷贝服务端的AIDL文件到目录下
步骤2：使用**Stub.asInterface接口**获取服务器的Binder，根据需要调用服务提供的接口方法
步骤3：通过Intent指定服务端的服务名称和所在包，**绑定远程Service**
## 按运行类型
### 前台服务
特点：在通知栏显示通知（用户可以看到）
使用的场景：
服务使用时需要让用户知道并进行相关操作，如音乐播放服务（服务被终止时，通知栏的通知也会消失）
使用实例：
用法很简单，只需要在原有的Service类对onCreate()方法进行稍微修改即可，如下图：
只需要在原有的Service类对onCreate()方法，创建一个Notifcation，使得Service在调用onCreate（）方法时，能够以通知的形式显示给用户。当然Service组件本身仍然是不可见的。
### 后台服务
后台：后台任务运行完全不依赖UI，即时Activity被销毁/程序被关闭，只要进程还在，后台任务就可继续运行
特点：处于后台的服务（用户无法看到）
使用的场景：
服务使用时不需要让用户知道并进行相关操作，如天气更新，日期同步（服务被终止时，用户是无法知道的）
## 按服务功能
### 可通信服务
特点：

1. 用bindService创建的服务
2. 调用者退出后，随调用者销毁
3. 只有绑定Service服务（Binder类、bindService()、onBind(）、unbindService()、onUnbind()）才能与Activity通信

使用的场景：
后台服务需要与Activity进行通信
使用实例：
在上面的基础用法上，增设“与Activity通信”的功能，即使用绑定Service服务（Binder类、bindService()、onBind(）、unbindService()、onUnbind()）
步骤1：在新建子类继承Service类，并新建一个**子类继承自Binder类**、写入与Activity关联需要的public方法、创建实例
步骤2：在主布局文件再设置两个Button分别用于绑定和解绑Service
步骤3：在Activity通过调用MyBinder类中的public方法来实现Activity与Service的联系
### 不可通信服务
特点：

1. 用startService启动
2. 调用者退出后，随调用者销毁

使用的场景：
该后台服务不进行任何通信

# 配置清单属性
Service是四大组件之一也需要在AndroidManifest.xml中注册，并配置相关属性，常见属性有：

1. android:name: 服务类名。可以是完整的包名+类名。也可使用. 代替包名。
2. android:exported: 其他应用能否访问该服务，如果不能，则只有本应用或有相同用户ID的应用能访问。默认为false。
3. android:process: 服务所运行的进程名。默认是在当前进程下运行，与包名一致，可以使用这个属性配置**远程服务**
4. android:permission: 申请使用该服务的权限，如果没有配置下相关权限，服务将不执行
# Service与IntentService的区别
## 什么是IntentService
Service是用于后台服务的，保证程序挂到后台时某些组件仍能正常工作。然而Service不是独立的进程，是默认运行在主线程中的。所以如果直接在服务里去处理一些耗时的逻辑，就很容易出现ANR（Application Not Responding）的情况。
所以这个时候就需要用到Android多线程编程的技术了，我们可以**在服务内开启线程**，采用thread+handler方式处理耗时操作。但服务一旦启动，就会一直处于运行状态，必须调用stopSelf()/stopService()才能让服务停止。编写逻辑较复杂。
IntentService是继承Service的，那么它包含了Service的全部特性，当然也包含service的生命周期，那么与service不同的是，IntentService在执行onCreate操作的时候，**内部开了一个线程，去执行耗时操作**。
IntentService是一个通过Context.startService(Intent)启动可以处理异步请求的Service,使用时你只需要继承IntentService和重写其中的`onHandleIntent(Intent)`方法接收一个Intent对象,工作完成后会自动停止服务。所有的请求的处理都在一个工作线程中完成，它们会交替执行(但不会阻塞主线程的执行)，一次只能执行一个请求。
> 扩展：这是一个基于消息机制的服务，每次启动该服务并不是马上处理你的工作，而是首先会创建对应的Looper，Handler并且在MessageQueue中添加的附带客户Intent的Message对象，当Looper发现有Message的时候接着得到Intent对象通过在onHandleIntent((Intent)msg.obj)中调用你的处理程序，处理完后即会停止自己的服务，意思是Intent的生命周期跟你的处理的任务是一致的，所以这个类用下载任务中非常好，下载任务结束后服务自身就会结束退出。

## IntentService的特点

- 会创建独立的worker线程来处理所有的Intent请求；
- 会创建独立的worker线程来处理onHandleIntent()方法实现的代码，无需处理多线程问题；
- 所有请求处理完成后，IntentService会**自动停止**，无需调用stopSelf()方法停止Service；

# Service的创建

如要创建服务，必须创建 `Service` 的子类（或使用它的一个现有子类比如`IntentService`）

- `Service`是系统提供的适用于所有服务的基类
- `IntentService`是系统提供的 `Service` 的子类，它会在其工作线程**逐一处理**所有启动请求

先演示一下通过继承Service类实现服务的创建

1. 创建一个MyService类继承自系统的Service类
2. 重写其中的onCreate()、onBind()、onStartCommand()
3. 在Manifest文件中注册（这是四大组件的共性）

创建一个MyService类继承自系统的Service类
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041044009.png#clientId=uec13dd90-cb79-4&id=TgN5I&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u87f3dd16-2cf1-4b52-ba04-1f1bcdf151d&title=)
在Manifest文件中注册
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041045099.png#clientId=uec13dd90-cb79-4&id=woyV4&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u680500bc-a8d9-4ae6-b1b6-c58d51127ea&title=)

因为Service在其托管进程的主线程中运行，所以我们在MainActivity的主线程中实现启动Service的按钮点击监听；启动方法与Activity极其相似，启动Activity是startActivity()方法；而启动Service是startService(intent)方法;
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041045644.png#clientId=uec13dd90-cb79-4&id=xlNid&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uba79ed4f-2d01-435d-9056-9a234f1207a&title=)
每点击一次启动服务按钮，**onStartCommand**方法都会调用一次，但是**onCreate**始终都只调用了一次
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041048202.png#clientId=uec13dd90-cb79-4&id=F3SBf&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue05ce9c9-5f33-471b-83bc-6204b93c991&title=)
# Service的类型
## 启动式服务

通过`startService()`方法启动，服务启动后与启动者不再有关系，如上面的例子就是**启动服务**，Activity被销毁后，Service还是在后台运行
因此上面的那个案例中我们如果退出了MainActivity，服务的onDestroy()方法也不会执行，服务还是会在后台运行。
> 我们可以在手机的后台看到我们在运行的程序就可以看到我们启动的服务

## 绑定式服务
通过 `bindService()` 方法启动，服务启动后与启动者的生命周期连体，服务的启动者销毁，服务也会被销毁。而且绑定服务**可以与启动者相互通信**。
下面演示一下绑定服务的启动
首先在Activity中创建一个新的按钮，监听MyBindService的启动
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041205988.png#clientId=uec13dd90-cb79-4&id=xZdrq&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u894a2b29-12b0-4a60-ae0d-271d1e89f95&title=)
创建一个MyBindService类继承自Service重写其中的几个方法
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041206658.png#clientId=uec13dd90-cb79-4&id=a77oV&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua5714c7e-0400-4384-98c1-e8add3a4da4&title=)
除了重写必要的方法以外还需要再定义一个内部类继承Binder，在这个类中定义方法和变量，供Service的启动者调用。
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041243749.png#clientId=uec13dd90-cb79-4&id=Iua63&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3424fbda-f743-4a7b-9ad6-d9a773275bc&title=)
快速在Manifest中注册服务
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041207660.png#clientId=uec13dd90-cb79-4&id=aLYf4&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u43f1dffa-802b-498b-9ca3-87151facc8f&title=)
在Activity中启动服务，这次我们是通过bindStart()方法启动的，需要传入三个参数

- 第一个参数是一个 `Intent`，用于显式命名要绑定的服务。
- 第二个参数是 `ServiceConnection` 对象。系统通过调用该对象中的回调方法来传递 `IBinder`实现通信
- 第三个参数是指示绑定选项的标记。如要创建尚未处于活动状态的服务，此参数通常应为 `BIND_AUTO_CREATE`。

![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041210506.png#clientId=uec13dd90-cb79-4&id=ugITK&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u823afb37-1ef4-4bbf-b4fd-7448a0c4611&title=)

Android 系统创建启动者与服务之间的连接时，会对 `ServiceConnection` 调用 `onServiceConnected()`。`onServiceConnected()` 方法包含一个 `IBinder` 参数，启动者随后会使用该参数与绑定服务通信。
所以下面我们在MainActivity中实现一个全局的`ServiceConnection` 对象
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041233181.png#clientId=uec13dd90-cb79-4&id=wNBDE&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue3a73b28-05cd-4bda-a51d-ee5f99f07a1&title=)
这里的 `IBinder` 参数与我们的MyBindService中的onBind()方法返回的参数是一一对应的。正是通过 `IBinder` 参数实现了与绑定服务通信
```java
public IBinder onBind(Intent intent) {
        Log.d(TAG, ":onBind ");
        return new MyBinder();
    }
```
在MainActivity中就可以拿到MyBindService中的内部类MyBinder中的test()方法。
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041246781.png#clientId=uec13dd90-cb79-4&id=NriBy&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u44e11d7e-a9db-4e5e-8d49-0926ba84f2e&title=)
运行打印日志发现test方法成功被调用，而且当我们退出MainActvity时，绑定式服务先解绑，然后自动销毁
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202210041254306.png#clientId=uec13dd90-cb79-4&id=AFiaW&originHeight=1048&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u27349ed2-f074-4341-820d-9d20220c90b&title=)
通过一个IBinder对象作为中间桥梁连接Activity与Service

