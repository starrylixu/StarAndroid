
[https://blog.csdn.net/guolin_blog/article/details/47028975](https://blog.csdn.net/guolin_blog/article/details/47028975)
[https://www.jianshu.com/p/1d7a93e63306](https://www.jianshu.com/p/1d7a93e63306)
[https://juejin.cn/post/6844903745814265870#heading-1](https://juejin.cn/post/6844903745814265870#heading-1)

1. context的继承结构
# 什么是Context
Context英文直译就是【上下文】，什么意思呢，比如我们在做英语阅读文章时遇到一个生词，常常要去找上下文推测词义，因为上下文能提供一个场景，我们能从这个场景中去推测词义。
而在Android系统中，我们如果要在某处获取资源，系统服务，启动Activity等都需要这个【上下文】，这些我们需要获取的资源，系统服务就可以看作是“生词”，因为我们不知道它在哪，而Context就像是为我们提供一个场景的“上下文”，通过“上下文”我们就能找到这些“生词”。
当然这是个人理解！来看看官方的定义：
Context提供了关于应用环境全局信息的**接口**。它是一个抽象类，它的执行被Android系统所提供。它允许获取以应用为特征的资源和类型，是一个**统领**一些资源（应用程序环境变量等）的**上下文**。就是说，它描述一个应用程序环境的信息（即上下文）
# context的继承结构
Context是一个抽象类，直系子类有两个，一个是**ContextWrapper**，一个是**ContextImpl**。
ContextWrapper是上下文功能的封装类，而ContextImpl则是上下文功能的实现类。
而ContextWrapper又有三个直接的子类，ContextThemeWrapper、Service和Application。其中，ContextThemeWrapper是一个带主题的封装类，而它有一个直接子类就是Activity。
Application、Activity这样的类其实并不会去具体实现Context的功能，而仅仅是做了一层接口封装而已，Context的具体功能都是由ContextImpl类去完成的。
![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251949884.png)
Context的两个子类分工明确，其中ContextImpl是Context的具体实现类，ContextWrapper是Context的包装类。Activity，Application，Service虽都继承自ContextWrapper（Activity继承自ContextWrapper的子类ContextThemeWrapper），但它们初始化的过程中都会创建ContextImpl对象，由ContextImpl实现Context中的方法。

# Context有几种类型
3中类型：
Application、Service、Activity

# Context数量问题
一个应用程序有多少个Context
Context数量 = Activity数量 + Service数量 + Application的数量

# Context有什么用

1. 四大组件的交互，包括启动 Activity、Broadcast、Service，获取 ContentResolver 等
2. 获取系统/应用资源，包括 AssetManager、PackageManager、Resources、System Service 以及 color、string、drawable 等
3. 文件管理，包括获取缓存文件夹、删除文件、SharedPreference 相关等
4. 数据库操作（SQLite）相关，包括打开数据库、删除数据库、获取数据库路径等
5. 其它辅助功能，比如设置 ComponentCallbacks，即监听配置信息改变、内存不足等事件的发生
# Context的作用域
由于Context的具体实例是由**ContextImpl**类去实现的，因此在绝大多数场景下，Activity、Service和Application这三种类型的Context都是可以通用的。
不过有几种场景比较特殊，比如**启动Activity**，还有**弹出Dialog**。出于安全原因的考虑，Android是**不允许Activity或Dialog凭空出现的**，一个Activity的启动必须要建立在另一个Activity的基础之上，也就是以此形成的返回栈。而**Dialog则必须在一个Activity上面弹出**（除非是System Alert类型的Dialog），因此在这种场景下，我们只能使用Activity类型的Context，否则将会出错。
![](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251949629.png)
使用的注意事项：

1. Activity所持有的Context的作用域最广，无所不能

因为Activity继承自ContextThemeWrapper，而Application和Service继承自ContextWrapper，很显然ContextThemeWrapper在ContextWrapper的基础上又做了一些操作使得Activity变得更强大。

2. Start an Activity 不推荐使用 Application & Service

如果我们用ApplicationContext去启动一个LaunchMode为standard的Activity的时候会报错：
```java
android.util.AndroidRuntimeException: 
Calling startActivity from outside of an 
Activity context requires the FLAG_ACTIVITY_NEW_TASK flag.
Is this really what you want?
```
这是因为非Activity类型的Context并没有所谓的任务栈，所以待启动的Activity就找不到栈了。解决这个问题的方法就是为待启动的Activity指定`FLAG_ACTIVITY_NEW_TASK`标记位，这样启动的时候就为它创建一个新的任务栈，而此时Activity是以**singleTask**模式启动的。所有这种用Application启动Activity的方式不推荐使用，Service同Application。

3. LayoutInflate 不推荐使用 Application & Service

在Application和Service中去layout inflate也是合法的，但是会使用系统默认的主题样式，如果你自定义了某些样式可能不会被使用。所以这种方式也不推荐使用。
[https://blog.csdn.net/qq_29966203/article/details/90735948](https://blog.csdn.net/qq_29966203/article/details/90735948)
