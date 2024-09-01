# startActivityForResult是什么
在启动另外一个Activity的时候，有两种方法，一种是直接使用startActivity，另外一种就是使用startActivityForResult。
startActivityForResult的主要作用就是它可以回传数据，假设我们有两个页面，首先进入第一个页面，里面有一个按钮，用于进入下一个页面，当进入下一个页面时，进行设置操作，并在其finish()动作或者back动作后，将设置的值回传给第一个页面，从而第一个页面来显示所得到的值。这个有一点像回调方法，就是在第二个页面finish()动作或者back动作后，会回调第一个页面的onActivityResult()方法。
# 为什么弃用
耦合度较高
**onActivityResult**里需要处理的各种判断、嵌套，也许是既要处理requestCode也要处理resultCode这种高耦合难以维护的Id判断模式。
# OnActivityResult（）的调用时机
为什么在B的onStop方法中调用调用setResult()函数，A中的OnActivityResult（）没有执行？
因为在 B 退回 A过程中，首先是B处于Pause 状态，然后等待 A 执行restart——〉 start ——〉resume,然后才是B 的stop——〉destroy，而A的 onActivityResult() 需要在 B pause之后，A restart 之前 这中间调用，所以 B中的setResult()函数应该放在B pause 之前调用。
# 平替方法registerForActivityResult
registerForActivityResult有一个Launcher返回值
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/1449b7608d6032fdb1427040cfd9a76f.png)
registerForActivityResult有两个参数
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/013c6d8069cd325b6bc2dc75489aca0b.png)
主要还是ActivityResultContract中，它是一个抽象类，有两个抽象方法createIntent()用于创建一个Intent，返回值是一个Intent。
第二个抽象方法是parseResult()用于接受上一个页面返回的结果
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/0f814ef751381a1e951fb06d8c053c26.png)

## 自定义Contract

1. 创建一个Contract继承自ActivityResultContract，指定输入和输出数据的泛型。
2. 实现其中的两个抽象方法

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/9c9073e7178a2251861682c07016f9cd.png)

3. 在A中拿到register的返回值，通过lanucher去设置要传递的值并启动B，传入的值最终作为Contract的createIntent方法的输入input

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/205134f87cda2fb405f6aaa41f1d40f3.png)

4. 新建一个B，在其中是设置好要回传给A的数据

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/5f80b36b783c69377971bcfae32226ab.png)

5. 在Contract中指定目标Activity

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/8bc82a2919d9be3f4e9659af50ef74bb.png)

6. A中代码简略版，diyPageIntent是一个点击事件监听方法

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/bb94e843a28c4d5bc8a178f97db6a4d4.png)
## 使用系统预置数据传输
无需自定义contract类
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/21c02d3ed52711b1c7f1b7fd532d8088.png)
```kotlin
private val launcherActivity = registerForActivityResult(
    ActivityResultContracts.StartActivityForResult()) {
    val code = it.resultCode
    val data = it.data
}

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    launcherActivity.launch(Intent(this, SecondActivity::class.java))
}

```
## 系统预置请求权限

1. 在Activity中请求权限，result是返回值，true表明权限申请成功。

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/57f8f9b042e14dcb10462417f7721a44.png)
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/1bf5d222d6ae5d7771295d0b31b2506f.png)
还有请求多个权限的预置contract
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/f0a477f4e1d589f1de7a1b7a4015a418.png)
# 更多相关知识
[startActivityForResult被标记为弃用后，如何优雅的启动Activity?_startactivityforresult被弃用_x024的博客-CSDN博客](https://blog.csdn.net/hx7013/article/details/120916287)
