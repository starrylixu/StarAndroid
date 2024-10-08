# Unity怎么通过WIFI连接真机调试

最近又在折腾unity，之前运行调试程序，我都是用USB连接手机直接调试，每次调试后又要断开USB，拿着手机去走动运行探测周围平面，这样一个下午跑十几次，就需要插拔USB二十多次，这无疑很麻烦，而且对手机的接口有很大的伤害，比如现在我的手机USB接口就很松动，因此特折腾了一下用WIFI连接真机调试

# 1.'adb' 不是内部或外部命令，也不是可运行的程序

一开始打开cmd去运行adb就出现这个提示

很明显是没配环境变量，所以我们先在SDK的目录下找到这个文件夹：并复制这个路径`......\SDK\platform-tools`

在这个目录下找到我们可以找到adb.exe，什么是ADB呢

> ADB，即 Android Debug Bridge，ADB具有安装卸载apk、拷贝推送文件、查看设备硬件信息、查看应用程序占用资源、在设备执行shell命令等功能，是 Android 开发/测试人员不可替代的强大工具。


![](http://starrylixu.oss-cn-beijing.aliyuncs.com/d924e11da2818fca5c1b04b80f8d8c48.png)

# 2.添加系统环境变量

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/9589178917659476ede8d547e8935481.png)

配置好环境变量后，在CMD中输入adb，可以看到这次有交互式输出，说明环境变量配好了

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/6d908321df02645ea368f5bbb16431a5.png)

# 3.Unity怎么通过WIFI真机调试

接下来做正事，Unity怎么通过WIFI真机调试

第一步用USB将电脑和手机连接起来，除此之外还要打开手机的**开发者模式**以及**USB调试模式**（关于如何打开请百度）

第二步设置手机与电脑通信的端口号

```bash
adb tcpip 5555
```

第三步保证手机和电脑连接在同一个局域网中，我是直接手机开了一个热点，然后电脑连接手机的热点

第四步查看手机的IP地址（不知带怎么查请百度）

第五步连接手机

```bash
adb connect 手机IP:5555
```

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/bd299a07ca18c294ea136478d1c613a7.png)

连接手机后，就可以直接拔掉USB啦，此后运行调试应用只要保证手机和电脑在同一个子网中即可。

连接成功后打开Unity，选择运行设备为我们的真机，然后Build And Run，这样无需用USB连接电脑应用就直接跑到手机上啦

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/cdd94c0d8da8225632d253295b862851.png)
