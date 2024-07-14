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
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683356555358-44fce67a-bdc4-4bf2-ada7-848afc14a127.png#averageHue=%23393736&clientId=u8d405981-5319-4&from=paste&id=u7ae5ec14&originHeight=800&originWidth=299&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=93756&status=done&style=none&taskId=u2fd57c3d-e524-4e78-b790-3082107e01e&title=)
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
![](https://cdn.nlark.com/yuque/0/2023/webp/32682386/1683358349862-37a06ca8-1c3d-4dee-ab0a-e487f944cafa.webp#averageHue=%23e6e6e6&clientId=ua41b0820-43e4-4&from=paste&id=u57981de2&originHeight=675&originWidth=340&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uc685233d-50c5-4fd7-9aab-34680d90005&title=)

Activity 生命周期对片段生命周期的影响
用下图来表示 Activity 和 Fragment 的生命周期变化的先后过程是:
### 静态加载（不确定）
静态加载Fragment，打开界面直到显示：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683360406615-5729667d-da73-4b0e-b7c9-94c253717f01.png#averageHue=%232e2d2c&clientId=ua1dd4c4c-b896-4&from=paste&height=231&id=u1b4e6426&originHeight=346&originWidth=1436&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=111229&status=done&style=none&taskId=ud48294ee-0617-4a71-8a9e-831ad8619e2&title=&width=957.3333333333334)
回到Home界面
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683360553085-5b00facc-f100-411c-87a2-7fce731d1231.png#averageHue=%232e2d2c&clientId=ua1dd4c4c-b896-4&from=paste&height=139&id=u7e4391eb&originHeight=209&originWidth=1360&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=66347&status=done&style=none&taskId=u13c8c1b9-e2ab-44ed-9855-3b0291c1c09&title=&width=906.6666666666666)
重新显示：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683360599329-e07e8501-7b18-4614-9275-18101d73e343.png#averageHue=%232e2d2c&clientId=ua1dd4c4c-b896-4&from=paste&height=159&id=u827745b2&originHeight=238&originWidth=1364&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=77397&status=done&style=none&taskId=u6f716475-a033-4283-b502-a7d311cb94b&title=&width=909.3333333333334)
正常销毁：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683360658457-8d434682-14ba-4a6f-a6ed-5fa7991d4a6e.png#averageHue=%232e2d2c&clientId=ua1dd4c4c-b896-4&from=paste&height=180&id=u94883eff&originHeight=270&originWidth=1404&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=88654&status=done&style=none&taskId=ua3cdb14b-4946-4a68-a685-5c44403acea&title=&width=936)
### 动态加载
进入Activity界面，点击按钮加载Fragment（add）
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683361521070-8a127db8-abd5-4ef8-95d3-fa7e87260412.png#averageHue=%232e2d2c&clientId=u3a431eaf-97fb-4&from=paste&height=210&id=u175d189a&originHeight=315&originWidth=1467&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=100950&status=done&style=none&taskId=ua79aa743-e805-458f-955d-e000f976a87&title=&width=978)
进入后台：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683361592500-3d596627-cc88-484d-ba9a-f9a0f7449002.png#averageHue=%232e2d2c&clientId=u3a431eaf-97fb-4&from=paste&height=112&id=u3af90dae&originHeight=168&originWidth=1354&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=54817&status=done&style=none&taskId=u692a0f2a-ed5e-4a3b-a9c7-188c5b15868&title=&width=902.6666666666666)
回到前台：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683361625389-0792c31e-9280-4395-8356-5ae6a8204b4e.png#averageHue=%232e2d2c&clientId=u3a431eaf-97fb-4&from=paste&height=165&id=u8a51df51&originHeight=248&originWidth=1358&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=77576&status=done&style=none&taskId=u7d7ab428-a3e9-4460-bff0-7d57d42abb8&title=&width=905.3333333333334)
销毁Activity
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683361661665-17bac2d5-6b61-43d4-9d07-c5d21ad384da.png#averageHue=%232e2d2c&clientId=u3a431eaf-97fb-4&from=paste&height=178&id=uf8275547&originHeight=267&originWidth=1425&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=92155&status=done&style=none&taskId=u51f5cb6b-b810-48f8-a8f0-751378374b7&title=&width=950)
通过add、hide、show方式切换Fragment时所有的view都会保存在内存，**不会销毁与重建**

**使用replace方式切换会进行销毁和重建**
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683362221577-977b5b70-c151-43ee-8bd9-061a6a6d3667.png#averageHue=%232f2e2c&clientId=u3a431eaf-97fb-4&from=paste&height=381&id=uadccd1af&originHeight=571&originWidth=1649&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=208362&status=done&style=none&taskId=ua4c82216-9713-4184-a856-2501b43781c&title=&width=1099.3333333333333)

