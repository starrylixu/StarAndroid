# 什么是Fragment
Fragment指碎片。是Activity界面中的一部分，是界面中可重复使用的一部分，可以理解成模块化的Activity.
（1）Fragment不能独立存在，必须嵌入到Activity中
（2）Fragment具有自己的生命周期，接收它自己的事件，并可以在Activity运行时被添加或删除
（3）Fragment的生命周期直接受所在的Activity的影响。如：当Activity暂停时，它拥有的所有Fragment们都暂停
# 为什么要引入Fragment
为了解决不同屏幕分辩率的动态和灵活UI设计

1. 模块化+复用

一个Fragment相当于一个Activity模块，可将业务逻辑分离，并且为多个Activity使用

2. UI灵活

能够比较容易适配手机和平板，根据屏幕的宽度决定Fragment的放置

3. 占内存小

Fragment轻量不消耗手机资源，启动顺滑流畅。而Activity的启动设置Android系统对ActivityManager的调度，会关联许多资源和进行诸多复杂运算。
# 生命周期
## 生命周期方法详解
![image.png](/images/e6d9c9f8e9cc803b27794578a4fec1ea.png)
1、 onAttach：Fragment和Activity建立关联的时候调用，可以获得对应的Context或Activity，这里拿到的Activity是mHost.getActivity()
2、 onCreate：Fragment对象初始创建，用于执行初始化操作。
由于Fragment的onCreate调用时，关联的Activity可能没有创建好，所以不要有依赖外部Activity布局的操作。依赖Activity的操作可以放在onActivityCreate中。
3、 onCreateView：为Fragment创建视图（加载布局）时调用（给当前的fragment绘制UI布局，可以使用线程更新UI）
4、 onActivityCreated：当与Fragment关联的Activity中的onCreate方法执行完后调用（表示activity执行onCreate方法完成了的时候会调用此方法）
这个方法里做些和布局、状态恢复有关的操作，如
onViewStateRestored(Bundle)用于一个Fragment在从就状态回复，获取saveInstanceState恢复状态。
以上4步同步于Activity的onCreate
5、 onStart：Fragment可见时调用，将Fragment对象显示给用户。同步于Activity的onStart
6、 onResume：Fragment对象可见并可与用户交互时调用。同步于Activity的onResume
7、 onPause：Fragment对象与用户不再交互。同步于Activity的onPause
8、 onStop：Fragment对象不再显示给用户。同步于Activity的onStop
9、 onDestroyView：Fragment中的布局被移除时调用（表示fragment销毁相关联的UI布局）
10、onDestroy：Fragment状态清理完成
11、 onDetach：Fragment和Activity解除关联的时候调用（脱离activity）
## 生命周期调用场景

- fragment被创建

onAttach()–>onCreate()–>onCreateView()–>onActivityCreated()

- fragment显示

onStart()–>onResume()

- fragment进入后台模式

onPause()–>onStop()–>onDestroyView()

- fragment被销毁（持有它的activity被销毁）

onPause()–>onStop()–>onDestroyView()–>onDestroy()–>onDetach()

- fragment重新恢复

onCreateView()–>onActivityCreated()–>onStart()–>onResume()
## Activity和Fragment的生命周期
![](/images/37ebb9d9d0e9bcc93d6762c1c22811af.webp)

Activity 生命周期对片段生命周期的影响
用下图来表示 Activity 和 Fragment 的生命周期变化的先后过程是:
### 静态加载（不确定）
静态加载Fragment，打开界面直到显示：
![image.png](/images/6bb9da5907fb377d703babf58dbeb542.png)
回到Home界面
![image.png](/images/ea8f43637e00a2c35536342d5a77c5a8.png)
重新显示：
![image.png](/images/b72756e33a200a063e4d51be52bdafc0.png)
正常销毁：
![image.png](/images/3ed04f515e36719fba309ba55e45f40c.png)
### 动态加载
进入Activity界面，点击按钮加载Fragment（add）
![image.png](/images/82c94d76294197837444fad3876e5c3f.png)
进入后台：
![image.png](/images/3637d9e3b53ad47bc10f03f6523e6c1e.png)
回到前台：
![image.png](/images/fc51d2507911176a3a4be28d499414dd.png)
销毁Activity
![image.png](/images/625bb6fa10dc102f9e6e42f5d7885991.png)
通过add、hide、show方式切换Fragment时所有的view都会保存在内存，**不会销毁与重建**

**使用replace方式切换会进行销毁和重建**
![image.png](/images/206530167bdf56883a2be1a802d88ec8.png)

