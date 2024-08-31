# LeakCanary工具
[【Android开发教程】面试必问：LeakCanary如何解决内存泄露以及原理解析【有源码样例分析】](https://www.bilibili.com/video/BV1kK4y18767?p=1&vd_source=2c2d0ce64b817501491ef975f77fea05)
[**LeakCanary**](https://square.github.io/leakcanary/)** **是 Square 公司为 Android 开发者提供的一个自动检测内存泄漏的工具
用来监控内存泄漏的工具，使用简单只需要引用依赖即可使用
这应该是使用最简单的开源控件了，添加一行依赖即可引入到项目中
```yaml
dependencies {
  // debugImplementation because LeakCanary should only run in debug builds.
  debugImplementation 'com.squareup.leakcanary:leakcanary-android:2.7'
}

```
![image.png](/images/88870ec08c218ee2e5959f3e951a35a5.png)
单例对象  -》 activity  
发生内存泄漏时会通过通知的方式提醒给用户，根据引用链找到可能发生内存泄漏的位置
除此之外它还会保存一份内存快照
/sdcard/Download/包名/2023-05-10_02-29-01_847.hprof
双击可以通过as自带的profiler打开
![image.png](/images/340454f0b0a29f924366582b47af70bd.png)

# LeakCanary是如何安装的
涉及framework
ActivityThread：是不是一个线程？
> 只是一个普通的Java类


在启动一个APP时，系统会去fork一个进程，
而Application是应用会首先加载的一个类，去调用application的 onCreate的方法
但是如果我们的应用中有注册contentprovider那么就会先去执行contentprovider的oncreate方法
handleBindApplication-》installContentProviders
-》installProvider-》attachInfo->**ContentProvider.this.onCreate()**
**可见contentprovider的oncreate的比application的oncreate的调用更早**
```java
//ActivityThread#handleBindApplication
if (!data.restrictedBackupMode) {
    if (!ArrayUtils.isEmpty(data.providers)) {
        //首先会去启动一个contentprovider
        installContentProviders(app, data.providers);
    }
}

try {
    //调用Application的oncreate
    mInstrumentation.onCreate(data.instrumentationArgs);
}
catch (Exception e) {
    throw new RuntimeException(
        "Exception thrown in onCreate() of "
        + data.instrumentationName + ": " + e.toString(), e);
}
```
![image.png](/images/1463705620cf3ea08a2112b6bfa7d454.png)

在创建应用程序类之前加载contentprovider。MainProcessAppWatcherInstaller用于安装泄漏金丝雀。应用程序启动时的App Watch。MainProcessAppWatcherInstaller自动设置在主应用进程中运行的LeakCanary代码。
```java
internal class MainProcessAppWatcherInstaller : ContentProvider() {

  override fun onCreate(): Boolean {
    val application = context!!.applicationContext as Application
    AppWatcher.manualInstall(application)
    return true
  }
    ···
}
```
在leakcanary的manifest中会注册一个contentprovider，最终在app打包的时候会mergManifest，
将app的和lib、module中的manifest合并成一个manifest文件

但并不适合将所有的初始化功能都在contentprovider实现，并且不能去执行耗时操作，提供给其他App去使用，根据刚刚分析的contentprovider的启动会优先于application，这样会拖慢整个app的启动速度
疑问：为什么要抛弃application oncreate, 转而使用provider

## 小总结

1. framework基础知识
2. leakcanary是如何安装的
3. 利用contentprovider初始化功能有什么问题
4. 小疑问

在启动一个APP时，系统会去fork一个进程，
启动一个应用首先会去加载Application类，去调用application的 onCreate的方法
但是如果我们的应用中有注册contentprovider那么就会先去执行contentprovider的oncreate方法
源码中的执行流程是这样的：handleBindApplication-》installContentProviders
-》installProvider-》attachInfo->**ContentProvider.this.onCreate()**
**可见contentprovider的oncreate的比application的oncreate的调用更早**

# 如何检测到内存泄漏
leakCanary能检测的对象：
Activity、fragment、view、Service、ViewModel
创建一个新的默认应用程序InstallableWatcher列表，使用传入的reachabilityWatcher创建(默认为objectWatcher)。一旦安装，这些监视器将传递给它们期望弱可及的reachabilityWatcher对象。传入的reachabilityWatcher可能应该委托给objectWatcher，但可以用来过滤掉特定的实例。
```java
  fun appDefaultWatchers(
    application: Application,
    reachabilityWatcher: ReachabilityWatcher = objectWatcher
  ): List<InstallableWatcher> {
    return listOf(
      ActivityWatcher(application, reachabilityWatcher),
      FragmentAndViewModelWatcher(application, reachabilityWatcher),
      RootViewWatcher(reachabilityWatcher),
      ServiceWatcher(reachabilityWatcher)
    )
  }
```
ObjectWatcher使用的一个弱引用，用于确定哪些对象是弱可及的，哪些不是
对**watchedObject**使用了弱引用，同时注意到里面使用了ReferenceQueue，这两者结合使用可以**实现如果弱引用关联的对象被回收，就会把这个弱引用加入到queue中，以此来判断该对象是否被回收。**
其中queue也是一个弱引用的队列哦
什么是弱引用队列，怎么理解弱引用，弱引用队列中存放的是什么  
```java
fun watch(watchedObject: Any) {
	expectWeaklyReachable(watchedObject, "")
}

@Synchronized override fun expectWeaklyReachable(
    watchedObject: Any,
    description: String
  ) {
    if (!isEnabled()) {
      return
    }
    removeWeaklyReachableObjects()
    val key = UUID.randomUUID()
      .toString()
    val watchUptimeMillis = clock.uptimeMillis()
    val reference =
      KeyedWeakReference(watchedObject, key, description, watchUptimeMillis, queue)
    SharkLog.d {
      "Watching " +
        (if (watchedObject is Class<*>) watchedObject.toString() else "instance of ${watchedObject.javaClass.name}") +
        (if (description.isNotEmpty()) " ($description)" else "") +
        " with key $key"
    }

    watchedObjects[key] = reference
    checkRetainedExecutor.execute {
      moveToRetained(key)
    }
  }
```
## 以检测Activity为例
每一个Activity被销毁时，回调了onDestroy时都会回调此方法onActivityDestoryed方法

在上面的分析中AppWachter会调用到ActivityWatcher，而在ActivityWatcher中注册了ActivityLifecycleCallbacks，同时重写了onActivityDestroy()方法
```java
class ActivityWatcher(
  private val application: Application,
  private val reachabilityWatcher: ReachabilityWatcher
) : InstallableWatcher {

  private val lifecycleCallbacks =
      //注册ActivityLifecycleCallbacks
    object : Application.ActivityLifecycleCallbacks by noOpDelegate() {
      //重写onActivityDestroyed
      override fun onActivityDestroyed(activity: Activity) {
        reachabilityWatcher.expectWeaklyReachable(
          activity, "${activity::class.java.name} received Activity#onDestroy() callback"
        )
      }
    }
    ···
}
```
回到ObjectWatcher中执行如下方法expectWeaklyReachable
主要执行了四步逻辑：

1. 移除弱可达的对象
2. 将当前的watchedObject添加到KeyedWeakReference当中
3. 将这个weakReference保存到数组中
4. 在checkRetainedExecutor中执行moveToRetained方法
```java
  @Synchronized override fun expectWeaklyReachable(
    watchedObject: Any,
    description: String
  ) {
    if (!isEnabled()) {
      return
    }
      //1.移除弱可达的对象
      //每次将已经弱可达的对象从监测数组中移除掉
    removeWeaklyReachableObjects()
      //2.为当前对象生成一个key值
    val key = UUID.randomUUID()
      .toString()
    val watchUptimeMillis = clock.uptimeMillis()
    //3.将当前的watchedObject与弱引用队列queue绑定
    val reference =
      KeyedWeakReference(watchedObject, key, description, watchUptimeMillis, queue)
    SharkLog.d {
      "Watching " +
        (if (watchedObject is Class<*>) watchedObject.toString() else "instance of ${watchedObject.javaClass.name}") +
        (if (description.isNotEmpty()) " ($description)" else "") +
        " with key $key"
    }

    //4.将这个weakReference保存到检测数组中
    watchedObjects[key] = reference
    //5.在checkRetainedExecutor中执行moveToRetained方法
    checkRetainedExecutor.execute {
      moveToRetained(key)
    }
  }
```
再看一看removeWeaklyReachableObjects（）中的逻辑
如果这个对象除了由ObjectWatcher所添加的WeakReference以外，没有其他对象在引用它了，那么这个对象也就可以回收了，watchedObjects也就可以移除他了。
```java
private fun removeWeaklyReachableObjects() {
    //一旦它们所指向的对象变得弱可及，弱引用就会进入队列。
    //这是在结束或垃圾收集实际发生之前。
    var ref: KeyedWeakReference?
    do {
        //1.已经是弱引用了，在弱引用队列中了
      ref = queue.poll() as KeyedWeakReference?
      if (ref != null) {
        //2.从检测列表中移除
        watchedObjects.remove(ref.key)
      }
    } while (ref != null)
  }
```
:::info
 对于弱引用队列的理解：对**watchedObject**使用了弱引用，同时注意到里面使用了ReferenceQueue，这两者结合使用可以**实现如果弱引用关联的对象被回收，就会把这个弱引用加入到queue中，以此来判断该对象是否被回收。**
个人理解：当一个Activity调用onDestory方法后，会去监测这个对象是否是弱可达，如果是的就会进入弱引用队列中。最终延迟5s来触发泄漏检测机制，如果该对象·不存在在弱引用队列中，说明该对象可能发生了内存泄漏
主要存在三个队列，

1. 一个检测数组watchedReferences
2. 一个弱引用队列
3. 一个Retained队列

当一个新的对象调用onDestory方法后，首先会清除之前的弱引用队列中的弱可达对象，然后计算这个对象的key值，然后将它和弱引用队列关联，并将这个对象的key作为下标加入到监测数组中。最终延时5s触发泄漏监测机制，从弱引用队列中能取出该对象，说明它是弱可达的，那么就把它从监测数组中移除，否则就移入到Retained队中，说明这个对象可能发生了泄漏
![image.png](/images/1a73e4bead34b714dcb246521aaceb92.png)
:::
## 这里不是很理解
**checkRetainedExecutor**其实是个单例对象，里面会通过handler来延迟5s来执行方法。如果超过5s则会触发LeakCanary的泄漏检测机制。5s只是个经验值应该，因为GC并不是实时发生，因而预留5s交给GC操作。
触发了LeakCanary的泄漏检测之后，则会执行**HeapDumpTrigger**的dumpHeap方法，在获取到了.hprof文件之后，调用HeapAnalyzerService.runAnalysis()给出分析结果。
关于.hprof文件的分析，不是本文重点，具体可以参考hprof文件协议。其分析基本也就是根据GC Root去寻找泄漏的对象，大体流程图如下。
![](/images/f6c8ce2839689ba1137050b3974ae900.webp)
