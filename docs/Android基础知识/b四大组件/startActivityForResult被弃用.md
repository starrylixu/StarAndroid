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
![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251949891.png)
registerForActivityResult有两个参数
![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251949784.png)
主要还是ActivityResultContract中，它是一个抽象类，有两个抽象方法createIntent()用于创建一个Intent，返回值是一个Intent。
第二个抽象方法是parseResult()用于接受上一个页面返回的结果
![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251949034.png)

## 自定义Contract

1. 创建一个Contract继承自ActivityResultContract，指定输入和输出数据的泛型。
2. 实现其中的两个抽象方法

![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251949681.png)

3. 在A中拿到register的返回值，通过lanucher去设置要传递的值并启动B，传入的值最终作为Contract的createIntent方法的输入input

![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251950445.png)

4. 新建一个B，在其中是设置好要回传给A的数据

![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251950519.png)

5. 在Contract中指定目标Activity

![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251950186.png)

6. A中代码简略版，diyPageIntent是一个点击事件监听方法

![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251950664.png)
## 使用系统预置数据传输
无需自定义contract类
![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251950150.png)
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

![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251950393.png)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683343271549-5f7f7452-4136-4297-b3a7-c88e5b91998f.png#averageHue=%233d3f31&clientId=u7ac164a3-72e6-4&from=paste&height=65&id=ud6dcc8a6&originHeight=97&originWidth=735&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=38572&status=done&style=none&taskId=ub774406e-2c96-45cb-88cb-025a4ef265d&title=&width=490)
还有请求多个权限的预置contract
![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251950709.png)
# 更多相关知识
[startActivityForResult被标记为弃用后，如何优雅的启动Activity?_startactivityforresult被弃用_x024的博客-CSDN博客](https://blog.csdn.net/hx7013/article/details/120916287)
