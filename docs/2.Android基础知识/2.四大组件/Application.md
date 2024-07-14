# Application的oncreate方法会执行几次，会不会多次执行？
[Android Application的生命周期](https://www.jianshu.com/p/b71de1435666)
# 一个App有几个进程，可以有多个进程吗？为什么说开启多进程会导致单例模式失效。
[Android 如何开启多进程？应用是否可以开启N个进程？](https://www.jianshu.com/p/8e2c5fbfb047)
[Android：全面解析 Application类 - 掘金](https://juejin.cn/post/6844903496806825998)
关于Application必知的知识
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1680701452693-06259cf6-3df2-4b62-a4b0-0c895bfc6191.png#averageHue=%232b2b2b&clientId=u6ad5b1c8-6a6b-4&from=paste&height=297&id=ub00f778d&originHeight=445&originWidth=975&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=75521&status=done&style=none&taskId=u9b7e548f-06e5-4387-b504-45d5cad4057&title=&width=650)
由此可见Application就很适合存放一些全局的静态变量

![](https://cdn.nlark.com/yuque/0/2023/webp/32682386/1680706071321-b1ba9bff-0858-4dc3-99d1-040f28cdb227.webp#averageHue=%23fdfdfd&clientId=u6ad5b1c8-6a6b-4&from=paste&id=u15f2a312&originHeight=1018&originWidth=1894&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ueb524ba1-74fd-4f2e-9dc7-2edf7284514&title=)
## 初始化全局变量
继承Application类，主要重写里面的onCreate()方法，就是创建的时候，初始化变量的值。然后在整个应用中的各个文件中就可以对该变量进行操作了。
但不能做耗时操作，因为会拖慢程序的启动速度
这些共享数据只在应用程序的生命周期内有效，当该应用程序被杀死，这些数据也会被清空，所以只能存储一些具备 **临时性的共享数据**

