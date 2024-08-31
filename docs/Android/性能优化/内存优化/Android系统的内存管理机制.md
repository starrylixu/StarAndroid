参考资料：
[https://www.jianshu.com/p/2b11639905ec](https://www.jianshu.com/p/2b11639905ec)
[https://zhuanlan.zhihu.com/p/474714333](https://zhuanlan.zhihu.com/p/474714333)
[https://cloud.tencent.com/developer/article/1702525](https://cloud.tencent.com/developer/article/1702525)
[https://www.jianshu.com/p/258229426da4](https://www.jianshu.com/p/258229426da4)
[https://blog.csdn.net/chaihuasong/article/details/110919105](https://blog.csdn.net/chaihuasong/article/details/110919105)

# 

Android系统自己的内存管理机制，你了解Android的整个内存是怎么运行的？和linux的有点像？怎么分配的，怎么回收的，一些限制等？一个进程分配到内存中是怎么被管理的？
# 序言
内存优化是Android 性能优化中最重要的优化点之一，如果没掌握Android系统的内存管理机制，不明白内存的分配和回收的机制，那么在遇到内存泄漏和内存紧张时，我们往往是摸不着头脑。
我们知道JVM的内存管理拥有垃圾回收机制，自身会在虚拟机层面自动分配和释放内存；Android系统的内存管理类似于JVM，通过new关键字来为对象分配内存，内存的释放由GC来回收。
Android系统在内存管理上有一个** Generational Heap Memory**模型，当内存达到某一个阈值时，系统会根据不同的规则自动释放可以释放的内存；那这个阈值是多少？系统会根据什么规则自动释放内存？
# Android进程内存管理
在32位操作系统中，进程的地址空间为0到4GB，被分为两部分，用户空间从0到3G，内核空间从3G到4G；
## Android中的进程
Android中的进程分为**Native进程**和**Java进程**

- Native进程：采用C/C++实现，不包含Dalvik实例的Linux进程，`**/system/bin/**`目录下面的程序文件运行后都是以`**native**`进程形式存在的。例如 `**/system/bin/surfaceflinger**`、`**/system/bin/rild**`等就是Native进程。
- Java进程：实例化了Dalvik虚拟机实例的Linux进程，进程的入口main函数为Java函数。Dalvik虚拟机实例的宿主进程是`**fork()**`系统调用创建的Linux进程，所以每一个Android上的Java进程实际上就是一个Linux进程，只是进程中多了一个Dalvik虚拟机实例。
### Android中进程的堆内存
Heap空间完全由程序员控制，我们使用的C Malloc、C++ new和Java new所申请的空间都是Heap空间， C/C++申请的内存空间在`**Native Heap**`中，而Java申请的内存空间则在`**Dalvik Heap**`中。
Android中的Java程序为什么容易出现OOM？
因为Android系统对Dalvik的VM Heapsize作了硬性限制，当Java进程申请的Java空间超过阈值时，就会抛出OOM异常（这个阈值可以是48M、24M、16M等，视机型而定），可以通过`**adb shell getprop | grep dalvik.vm.heapgrowthlimit**`查看此值。
```powershell
adb shell getprop | grep dalvik.vm.heapgrowthlimit
```
查看更详细的 Dalvik虚拟机堆内存的配置，可以通过命令：
```powershell
getprop | grep dalvik.vm.heap
```

- **[dalvik.vm.heapgrowthlimit]: [192m]**：Dalvik堆内存的增长限制。当堆内存达到此限制时，Dalvik虚拟机将触发垃圾回收以释放内存。
- **[dalvik.vm.heapmaxfree]: [8m]**：Dalvik堆内存的最大空闲空间。当堆内存中的空闲空间超过此限制时，Dalvik虚拟机将释放一部分内存。
- **[dalvik.vm.heapminfree]: [512k]**：Dalvik堆内存的最小空闲空间。当堆内存中的空闲空间低于此限制时，Dalvik虚拟机将触发垃圾回收以释放内存。
- **[dalvik.vm.heapsize]: [512m]**：Dalvik堆内存的初始大小。这是Dalvik虚拟机在应用程序启动时分配的堆内存大小。
- **[dalvik.vm.heapstartsize]: [8m]**：Dalvik堆内存的初始分配大小。这是Dalvik虚拟机在应用程序启动时为堆内存分配的初始大小。
- **[dalvik.vm.heaptargetutilization]: [0.75]**：Dalvik堆内存的目标利用率。这是Dalvik虚拟机在进行垃圾回收时尝试维持的堆内存利用率。
- **[ro.boot.dalvik.vm.heapsize]: [512m]**：Dalvik堆内存的系统默认大小。这是设备制造商在构建Android系统时设置的默认堆内存大小。

也就是说，**程序发生OMM并不表示RAM不足**，而是因为程序申请的Java Heap对象超过了**Dalvik VM Heap Growth Limit**。也就是说，在RAM充足的情况下，也可能发生OOM。
Android中如何应对RAM不足？
Java程序发生OMM并不是表示RAM不足，如果RAM真的不足，会发生什么呢？这时Android的Memory Killer会起作用，当RAM所剩不多时，Memory Killer会**杀死一些优先级比较低的进程（进程优先级）**来释放物理内存，让高优先级程序得到更多的内存。

# Android的内存管理机制
从操作系统的角度来说，内存就是一块**数据存储区域**，是可被操作系统调度的资源。
在多任务（进程）的OS中，内存管理尤为重要，OS需要为每一个进程合理的分配内存资源。所以可以从OS对**内存分配**和**内存回收**两方面来理解内存管理机制。
分配机制：为每一个任务（进程）分配一个合理大小的内存块，保证每一个进程能够正常的运行，同时确保进程不会占用太多的内存。
回收机制：当系统内存不足的时候，需要有一个合理的回收再分配机制，以保证新的进程可以正常运行。回收时杀死那些正在占用内存的进程，OS需要提供一个合理的杀死进程机制。
同样作为一个多任务的操作系统，Android系统对内存管理有有一套自己的方法，手机上的内存资源比PC更少，需要更加谨慎的管理内存。理解Android的内存分配机制有助于我们写出更高效的代码，提高应用的性能。
下面分别从**分配和回收**两方面来描述Android的内存管理机制：
## 分配机制
Android为每个进程分配内存时，采用**弹性的分配方式**，即刚开始并不会给应用分配很多的内存，而是给每一个进程分配一个**“够用”**的内存大小。这个大小值是根据每一个设备的实际的物理内存大小来决定的。随着应用的运行和使用，Android会为进程分配一些额外的内存大小。但是分配的大小是有限度的，系统不可能为每一个应用分配无限大小的内存。
总之，Android系统需要**最大限度的让更多的进程存活在内存中**，以保证用户再次打开应用时减少应用的启动时间，提高用户体验。

## 回收机制
Android对内存的使用方式是**“尽最大限度的使用”**，只有当内存非常不足的时候，才会杀死其它进程来回收足够的内存。但Android系统否可能随便的杀死一个进程，它也有一个机制杀死进程来回收内存。
Android杀死进程有两个参考条件：
**1. 回收收益**
当Android系统开始杀死**LRU缓存**中的进程时，系统会判断每个进程杀死后带来的回收收益。因为Android总是倾向于杀死一个能回收更多内存的进程，从而可以杀死更少的进程，来获取更多的内存。杀死的进程越少，对用户体验的影响就越小。
**2. 进程优先级**
下面将从 Application Framework 和 Linux kernel 两个层次分析 Android 操作系统的资源管理机制。
Android 之所以采用特殊的资源管理机制，原因在于其设计之初就是面向移动终端，所有可用的内存仅限于系统 RAM，必须针对这种限制设计相应的优化方案。当 Android 应用程序退出时，并不清理其所占用的内存，Linux 内核进程也相应的继续存在，所谓“退出但不关闭”。从而使得用户调用程序时能够在第一时间得到响应。当系统内存不足时，系统将激活内存回收过程。为了不因内存回收影响用户体验（如杀死当前的活动进程），Android 基于进程中运行的组件及其状态规定了默认的五个回收优先级：
**Android为每一个进程分配了优先组的概念，优先组越低的进程，被杀死的概率就越大。根据进程的重要性，划分为5级：**
1）前台进程(Foreground process)
用户当前操作所必需的进程。通常在任意给定时间前台进程都为数不多。只有在内存不足以支持它们同时继续运行这一万不得已的情况下，系统才会终止它们。
2）可见进程(Visible process)
没有任何前台组件、但仍会影响用户在屏幕上所见内容的进程。可见进程被视为是极其重要的进程，除非为了维持所有前台进程同时运行而必须终止，否则系统不会终止这些进程。
3）服务进程(Service process)
尽管服务进程与用户所见内容没有直接关联，但是它们通常在执行一些用户关心的操作（例如，在后台播放音乐或从网络下载数据）。因此，除非内存不足以维持所有前台进程和可见进程同时运行，否则系统会让服务进程保持运行状态。
4）后台进程(Background process)
后台进程对用户体验没有直接影响，系统可能随时终止它们，以回收内存供前台进程、可见进程或服务进程使用。 通常会有很多后台进程在运行，因此它们会保存在 LRU 列表中，以确保包含用户最近查看的 Activity 的进程最后一个被终止。如果某个 Activity 正确实现了生命周期方法，并保存了其当前状态，则终止其进程不会对用户体验产生明显影响，因为当用户导航回该 Activity 时，Activity 会恢复其所有可见状态。
5）空进程(Empty process)
不含任何活动应用组件的进程。保留这种进程的的唯一目的是用作缓存，以缩短下次在其中运行组件所需的启动时间。 为使总体系统资源在进程缓存和底层内核缓存之间保持平衡，系统往往会终止这些进程。
通常，前面三种进程不会被杀死。
**ActivityManagerService 集中管理所有进程的内存资源分配。所有进程需要申请或释放内存之前必须调用 ActivityManagerService 对象，获得其“许可”之后才能进行下一步操作，或者 ActivityManagerService 将直接“代劳”**。ActivityManagerService类中涉及到内存回收的几个重要的成员方法如下：trimApplications()、updateOomAdjLocked()、activityIdleInternal() 。这几个成员方法主要负责 Android 默认的内存回收机制，若 Linux 内核中的内存回收机制没有被禁用，则跳过默认回收。
**默认回收过程**
Android 操作系统中的内存回收可分为两个层次，即默认内存回收与Linux内核级内存回收，所有代码可参见 ActivityManagerService.java。
**回收动作入口：activityIdleInternal()**
**Android 系统中内存回收的触发点大致可分为三种情况**。
第一，用户程序调用 StartActivity(), 使当前活动的 Activity 被覆盖；
第二，用户按 back 键，退出当前应用程序；
第三，启动一个新的应用程序。这些能够触发内存回收的事件最终调用的函数接口就是 activityIdleInternal()。当 ActivityManagerService 接收到异步消息 IDLE_TIMEOUT_MSG 或者 IDLE_NOW_MSG 时，activityIdleInternal() 将会被调用。

