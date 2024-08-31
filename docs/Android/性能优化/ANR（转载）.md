参考资料：[https://juejin.cn/post/7157227625549660174](https://juejin.cn/post/7157227625549660174#heading-13)

1. ANR是什么
2. 造成ANR的原因有哪些
3. 怎么解决ANR
# 什么是ANR
ANR的全称：应用程序无响应（ANR：Application NotResponding）
# 造成ANR的原因

1. 主线程被IO操作（从Android 4.0之后网络IO不允许在主线程中）阻塞。
2. 主线程中存在耗时的计算
3. 主线程中错误的操作，比如Thread.wait或者Thread.sleep等

造成ANR的条件是多样的：

- `InputDispatching Timeout`：5秒内无法响应屏幕触摸事件或键盘输入事件
- `BroadcastQueue Timeout` ：在执行前台广播（BroadcastReceiver）的onReceive()函数时10秒没有处理完成，后台广播为60秒。
- `Service Timeout` ：前台服务20秒内，后台服务在200秒内没有执行完毕。
- `ContentProvider Timeout` ：ContentProvider的publish在10s内没进行完。

那么系统是如何检测到App长时间无响应呢？Android系统中的`ActivityManagerService`（简称AMS）和`WindowManagerService`（简称WAS）会检测App的响应时间，如果App在特定时间无法响应屏幕触摸或者键盘输入事件，就会出现ANR。
# ANR触发原理
## Service Timeout
[https://developer.aliyun.com/article/687786](https://developer.aliyun.com/article/687786)
[https://juejin.cn/post/7157227625549660174#heading-13](https://juejin.cn/post/7157227625549660174#heading-13)
[https://www.jianshu.com/p/388166988cef](https://www.jianshu.com/p/388166988cef)
[http://gityuan.com/2016/07/02/android-anr/](http://gityuan.com/2016/07/02/android-anr/)
# 如何解决ANR
首先需要定位ANR发生的位置：通过ANR日志定位问题
可以通过查看/data/anr/traces.txt即可，最新的ANR信息在最开始部分。
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/0bcde093db643d207131e3093c5d50ef.png)
解决的思路：将所有的耗时操作在子线程中进行
1、使用AsyncTask处理耗时IO操作。
2、使用Thread或者HandlerThread时，调用Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND)设置优先级，否则仍然会降低程序响应，因为默认Thread的优先级和主线程相同。
3、使用Handler处理工作线程结果，而不是使用Thread.wait()或者Thread.sleep()来阻塞主线程。
4、Activity的onCreate和onResume回调中尽量避免耗时的代码。
BroadcastReceiver中onReceive代码也要尽量减少耗时，建议使用IntentService处理。
将所有耗时操作，比如访问网络，Socket通信，查询大量SQL 语句，复杂逻辑计算等都放在子线程中去，然后通过handler.sendMessage、runonUIThread、AsyncTask、RxJava等方式更新UI。无论如何都要确保用户界面的流畅
度。如果耗时操作需要让用户等待，那么可以在界面上显示度条。

作者：小池laucherish
链接：[https://www.jianshu.com/p/108299cecd90](https://www.jianshu.com/p/108299cecd90)
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

ANR（Application Not Responding）指的是Android中一个应用程序在执行过程中出现了长时间无响应的情况。当系统检测到应用程序被锁死时，系统会向用户显示一个弹框，提示用户该应用程序未响应。如果用户点击“等待”按钮，则系统会等待一段时间尝试恢复该应用程序。如果在超时时间内该应用程序仍未恢复，系统会强制停止该应用程序并向用户报告问题。
ANR 通常是由以下情况引起的：

主线程卡死：Android 应用程序的主线程用于处理用户界面事件和应用逻辑等任务，在主线程中占用 CPU 时间过长，可能导致其他任务无法及时处理，从而导致 ANR。
进行耗时操作：一些任务，例如网络请求、大量数据处理和读写文件等操作可能需要花费较长时间，如果这些操作在主线程上执行，就会导致主线程阻塞，从而导致 ANR。
UI渲染问题：UI渲染操作也可能导致 ANR，例如因为界面过于复杂需要大量时间进行绘制；在主线程上执行长时间的动画；应用程序可能会由于遇到无法处理的视图层级、布局等问题而无法响应。

为避免 ANR，Android开发者可以采取以下几个步骤：

将长时间的任务放到工作线程中执行，避免在主线程上执行操作。
对于大量数据的读取和写入，可以采用分批次的方式进行，从而避免一次全部加载/写入而导致 ANR。
在使用大量的图形资源或布局时，避免嵌套过深、过于复杂的视图层级和布局，避免卡顿导致的 ANR。
合理利用 Handler、AsyncTask 等机制，让 UI 渲染任务异步执行。
在开发的过程中注意及时释放资源，例如关闭线程、移除无用的倒计时器等，避免资源浪费。
使用性能分析工具进行检测和优化，从而及时发现和解决耗时操作的问题，避免 ANR。

