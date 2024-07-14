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
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683341678740-de48dd51-68c8-46bb-b3dd-9960031c107d.png#averageHue=%234b4732&clientId=u5fe37365-570d-4&from=paste&height=121&id=u9480acc7&originHeight=181&originWidth=718&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=69743&status=done&style=none&taskId=u6e6624b5-6bdf-49ad-8333-32334fd166f&title=&width=478.6666666666667)
registerForActivityResult有两个参数
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683340736411-d79a7c37-bc8f-4006-8dc2-e7040aee6723.png#averageHue=%232c2b2d&clientId=u5fe37365-570d-4&from=paste&height=199&id=u393f2468&originHeight=298&originWidth=763&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=112487&status=done&style=none&taskId=u4649f180-97c9-4949-ae74-0d4fe2cbb69&title=&width=508.6666666666667)
主要还是ActivityResultContract中，它是一个抽象类，有两个抽象方法createIntent()用于创建一个Intent，返回值是一个Intent。
第二个抽象方法是parseResult()用于接受上一个页面返回的结果
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683340964753-e457110d-53ab-4016-aeb3-da91c454b856.png#averageHue=%232c303a&clientId=u5fe37365-570d-4&from=paste&height=163&id=u8f175233&originHeight=244&originWidth=697&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=112185&status=done&style=none&taskId=ubea2abcb-062a-4077-86b6-d01e34adb17&title=&width=464.6666666666667)

## 自定义Contract

1. 创建一个Contract继承自ActivityResultContract，指定输入和输出数据的泛型。
2. 实现其中的两个抽象方法

![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683341597815-58ad54d8-7ab5-4a03-aab3-21f8bcbc2396.png#averageHue=%232d2d2c&clientId=u5fe37365-570d-4&from=paste&height=325&id=u70d2b33b&originHeight=488&originWidth=670&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=146825&status=done&style=none&taskId=u218706b7-b5f8-4d36-b64c-20f5c007ee3&title=&width=446.6666666666667)

3. 在A中拿到register的返回值，通过lanucher去设置要传递的值并启动B，传入的值最终作为Contract的createIntent方法的输入input

![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683341958605-87b9a435-4396-442b-83f4-b44341fecfb6.png#averageHue=%232c2c2b&clientId=u5fe37365-570d-4&from=paste&height=261&id=u4f1edcfa&originHeight=392&originWidth=1108&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=137887&status=done&style=none&taskId=ud86ab3a7-1287-4661-9296-aea5785b64d&title=&width=738.6666666666666)

4. 新建一个B，在其中是设置好要回传给A的数据

![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683342147311-caccc4fe-9ba6-42fb-b17d-4850a5baa2fd.png#averageHue=%23433e33&clientId=u5fe37365-570d-4&from=paste&height=197&id=ua65d0da0&originHeight=295&originWidth=507&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=100411&status=done&style=none&taskId=u85ad42de-546f-4fde-8629-d8fc47feafc&title=&width=338)

5. 在Contract中指定目标Activity

![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683342725708-8b4080b8-a937-4409-9ac2-d3970dae1a78.png#averageHue=%232d2c2b&clientId=u7ac164a3-72e6-4&from=paste&height=331&id=uc07abd10&originHeight=496&originWidth=700&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=137182&status=done&style=none&taskId=u0366fcae-d873-4c63-9fc2-aa01a7dd5cf&title=&width=466.6666666666667)

6. A中代码简略版，diyPageIntent是一个点击事件监听方法

![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683342244365-342cb6bc-298a-450f-9f6a-97b5df10e530.png#averageHue=%232c2c2c&clientId=u5fe37365-570d-4&from=paste&height=185&id=uecdfa529&originHeight=278&originWidth=1077&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=98639&status=done&style=none&taskId=uc126b13c-8e03-454f-bc08-81fa0d723ac&title=&width=718)
## 使用系统预置数据传输
无需自定义contract类
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683343012006-33158c97-8d33-4804-96e9-3e1401c20901.png#averageHue=%232d2d2c&clientId=u7ac164a3-72e6-4&from=paste&height=492&id=ud435abd2&originHeight=738&originWidth=1140&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=275582&status=done&style=none&taskId=u30b09aea-e50d-42ee-b896-7f9355750f4&title=&width=760)
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

![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683343204479-fa583f30-25b8-4072-b824-3b8ae7036c67.png#averageHue=%232d2d2c&clientId=u7ac164a3-72e6-4&from=paste&height=105&id=u5a4d6c1d&originHeight=158&originWidth=1087&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=65067&status=done&style=none&taskId=u42e6f605-5bfc-4c94-ae48-d9ca2b546da&title=&width=724.6666666666666)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683343271549-5f7f7452-4136-4297-b3a7-c88e5b91998f.png#averageHue=%233d3f31&clientId=u7ac164a3-72e6-4&from=paste&height=65&id=ud6dcc8a6&originHeight=97&originWidth=735&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=38572&status=done&style=none&taskId=ub774406e-2c96-45cb-88cb-025a4ef265d&title=&width=490)
还有请求多个权限的预置contract
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683343352685-d0f24c8c-cd88-42ae-b361-d8211f052f73.png#averageHue=%23fdfefa&clientId=u7ac164a3-72e6-4&from=paste&height=163&id=u9b77bcda&originHeight=245&originWidth=916&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=211823&status=done&style=none&taskId=u2f313671-d20c-45f5-89bd-c7dabc2a3ed&title=&width=610.6666666666666)
# 更多相关知识
[startActivityForResult被标记为弃用后，如何优雅的启动Activity?_startactivityforresult被弃用_x024的博客-CSDN博客](https://blog.csdn.net/hx7013/article/details/120916287)
