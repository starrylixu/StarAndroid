![黄绿色手绘风新闻资讯微信公众号封面.gif](http://starrylixu.oss-cn-beijing.aliyuncs.com/788aeef1caa05aa07ba4839df0ff9e65.gif)

1. Activity是什么
2. Activity的生命周期，异常生命周期有哪些情况
3. 两个Activity跳转哪些方法一定会执行，什么情况下哪些方法不会执行
4. Activity的启动模式
5. 退出整个应用的解决方案
6. Activity状态保存和恢复

好文鉴赏：
[浅谈 Android launchMode和taskAffinity - 掘金](https://juejin.cn/post/7026669198537392165)
# 什么是Activity
Activity是Android组件中最基本也是最为常见用的四大组件（Activity，Service服务,Content Provider内容提供者，BroadcastReceiver广播接收器）之一 。
Activity是一个应用程序组件，提供一个屏幕，用户可以用来交互为了完成某项任务，也是四大组件中唯一一个用户可与之交互的组件。通过setContentView方法来显示指定的布局。
# Activity的生命周期
Activity作为App最重要的一个组件，它提供了多个生命周期方法，方便我们去管理Activity的状态。
## 生命周期的流程
Activity从创建到销毁经历了6个生命周期方法。

- onCreate，Activity开始创建，用于做初始化工作，加载布局资源
- onStart，Activity正在被启动，此时Activity还处于不可见状态，用户无法与之交互
- onResume，Activity处于运行状态，用户可与之交互
- onPause，Activity正在停止，但是仍处于可见状态
- onStop，Activity完全不可见
- onDestroy，Activity即将被销毁，释放Activity的资源

onCreate和onDestory很好理解，其他的两对方法怎么理解呢？
onStart和onStop：区分Activity是否可见
onResume和onPause：区分Activity是否处于前台
例如A Activity跳转到B Activity，在调用A的onPause后，A不再处于前台，也就是用户无法与之交互，而是去创建B，直到B处于用户可见并处于前台，之后再调用A的onStop，至此A彻底用户不可见。
![未命名绘图.drawio.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/c9960477cbb18b426ea061edc15eca22.png)

## 具体场景
### 横竖屏切换
一般而言，设备的配置变更，例如横竖屏切换、键盘可用性等会导致Activity重新创建。以横竖屏切换为例，如果需要配置在设备横竖屏切换不销毁Activity重新创建，需要使用到`configChanges`属性
根据configChanges属性配置的不同，Activity的生命周期也会不一样：
#### 不配置
不设置android:configChanges属性时，横竖屏切换都会重启Activity，不会调用onConfigurationChanged()方法。
Activity会依次回调：onPause–>onStop–>onDestroy–>onCreate–>onStart–>onResume
#### 配置orientation
android:configChanges属性值为“orientation”时，会调用onConfigurationChanged()方法；从竖屏切换为横屏时，仍然会重启Activity；从横屏切换为竖屏时，不会重启Activity的生命周期。
#### 配置screenSize
android:configChanges属性为“screenSize”时，会调用onConfigurationChanged()方法；从竖屏切换为横屏时，从横屏切换为竖屏时，都会重启Activity的生命周期。
#### 配置orientation|screenSize
android:configChanges属性为“orientation|screenSize”时，会调用onConfigurationChanged()方法；从竖屏切换为横屏时，从横屏切换为竖屏时，**都不会**重启Activity的生命周期。
### 启用Dialog
在Activity上启用Dialog并不会影响Activity的生命周期（经典面试题，dialog会影响Activity的生命周期吗？）
### 透明Activity
两个Activity跳转，那些生命周期方法必然会被执行？这是我面试遇到的一个问题。
按照通常情况下，A会现置于后台但可见状态，等B置于前台运行状态，A才会完全不可见：A onPause -> B onCreate -> B onStart -> B onResume -> A onStop
如果B是一个透明Activity，或者是对话框样式，那么A不会回调onStop方法，因为A使用处于可见状态。
如果B已经存在于任务栈中，（B的启动模式不是标准模式）B就不会调用onCreate方法
所以一定会执行的就是A onPause -> B onStart -> onResume
例如如下实例：
这是正常情况下的生命周期调用：
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/42cf6702e948e6c291407a4ac5bd8550.png)
如果BActivity设置为透明主题
```markdown
<style name="TranslucentStyle" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="android:windowBackground">@android:color/transparent</item> <!-- 背景色透明 -->
    <item name="android:windowIsTranslucent">true</item> <!-- 是否有透明属性 -->
    <item name="android:backgroundDimEnabled">false</item> <!-- 背景是否半透明 -->
    <item name="android:statusBarColor">@android:color/transparent</item> <!-- 状态栏透明 -->
    <item name="android:windowAnimationStyle">@android:style/Animation.Translucent</item> <!-- activity窗口切换效果 -->
</style>
```
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/357148e7ad266cac6636f2825ae5aa5c.png)
如果是透明的BActivity，那么AActivity会一直处于可见的状态，不过处于可见但不可交互状态，AActivity不会执行onStop方法。
因为onStop（）方法调用后表示当前界面**必定不可见**了。所以当跳转**透明界面或者显示dialog**时候，不会调用onStop()方法，因为当前界面可见。
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/ead8284106d9922b7b27ed54ef29332a.png)
# Activity的启动模式
## 什么是启动模式
决定是生成新的Activity还是重用已存在的Activity。Android 中默认启动模式为 standard，我们可以通过在 AndroidManifest.xml 的 activity 标签下通过 **launchMode** 属性指定我们想要设置的启动模式。
## 任务栈机制
### 什么是任务栈
application中有很多activity，application是通过任务栈的形式对管理这些activity。任务栈有以下几个特点：

1. 任务栈是app管理activity的一种容器，遵循先进后出原则
2. 一个app默认只有一个任务栈，由系统指定
3. 一个app可以有多个任务栈，需要开发者手动指定
4. 多任务栈出栈（点击back）规则：出栈时，先将前台栈清空，再去清空后台栈，即先进后出的规则清空栈
### taskAffinity
taskAffinity是指activity的任务栈的相关性。拥有相同affinity的activity在概念上属于同一个task。默认情况下，所有Activity所需的任务栈的名字为**应用的包名**
一个task的affinity取决于这个task内的根activity的taskaffinity。taskaffinity属性用于指定当前Activity所关联的任务栈，它的作用主要有：

1. 通过**FLAG_ACTIVITY_NEW_TASK**标记给activity指定任务栈
2. 决定Activity重新归属的任务（与allowTaskReparenting联合实现把一个应用程序的activity移到另一个程序的任务栈中）

如何理解呢？如果A Activity启动B Activity，其中B Activity指定一个新的的taskAffinity，那么B Activity是运行在启动它的 A Activity同一个任务栈中还是会去创建一个新的呢？
且看下面分析：
当初次启动一个App时，系统会创建一个默认Task，这个Task会得到一个taskAffinity，这个taskAffinity的值就是第一个Activity的taskAffinity。
再启动新的Activity，如果将要被启动的Activity没有配置taskAffinity，那么直接进入当前默认Task栈。
如果将要被启动的Activity设置了launchMode="singleTask"，系统会先比对要被启动的Activity的taskAffinity和当前的Task的taskAffinity是否相同：如果相同，正常入栈；如果不同，Activity会去寻找和它的taskAffinity相同的Task入栈，找不到系统就为它创建一个新的Task。
因此，对于singleTask启动模式的Activity而言，如果它配置了一个新的taskAffinity，那么它也会被放在另一个Task中。
如下我设置一个SingleActivity的taskAffinity为新值，那么启动的SingleActivity会在一个新的任务栈中
```kotlin
<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:supportsRtl="true"
    android:theme="@style/Theme.Android_study">
    <activity
        android:name=".MainActivity"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>

    </activity>
    <activity android:name="com.starry.a5_activity.SingleActivity"
        android:launchMode="singleTask"
        android:taskAffinity="${applicationId}.singleTask"/>
</application>
```
效果是不是很熟悉，没错这就是我们常见的一种app应用启动小程序的场景，使用`lanchMode=singleInstance`也能实现这种效果：
![微信图片_20240107111702.jpg](http://starrylixu.oss-cn-beijing.aliyuncs.com/5d1f96fa2b5f275c2fc61f5ec0aaf7f2.jpeg)![微信图片_20240107112203.jpg](http://starrylixu.oss-cn-beijing.aliyuncs.com/b46c5e7409c7b6007887846bd7618a86.jpeg)
## 五种启动模式
### Standard
每启动一次Activity，就会创建一个新的Activity的实例并将该实例置于栈顶
如果我们在Activity以外启动Actiivity，可能会报这个错误：
`**_Calling startActivity() from outside of an Activity  context requires the FLAG_ACTIVITY_NEW_TASK flag. Is this really what you want?_**`
**_例如在Application中启动Activity:_**
因ApplicationContext没有任务栈，故无法采用标准模式启动Activity，但可通过为待启动的Activity（一般为MainActivity）指定标记位：FLAG_ACTIVITY_NEW_TASK，则启动时就会该Activity创建一个新的任务栈（实际上采用了singleTask模式）
使用场景：
正常的去打开一个新的页面，这种启动模式使用最多，最普通 。
### SingleTop
启动Activity，若创建的Activity位于任务栈**栈顶**，则Activity的实例不会重建，而是重用栈顶的实例。（调用实例的**onNewIntent**（），可以通过intent传值，不调用onCreate（）和onStart（））
否则就创建该Activity新实例并置于栈顶
使用场景：
singleTop适合**接收通知**启动的内容显示页面。例如，某个新闻客户端的新闻内容页面
假如一个新闻客户端，在通知栏收到了3条推送，点击每一条推送会打开新闻的详情页，如果为默认的启动模式的话，点击一次打开一个页面，会打开三个详情页，这肯定是不合理的。如果启动模式设置为singleTop，当点击第一条推送后，新闻详情页已经处于栈顶，当我们第二条和第三条推送的时候，只需要通过Intent传入相应的内容即可，并不会重新打开新的页面，这样就可以避免重复打开页面了。
### SingleTask
**查看Activity所在的任务栈**是否存在，若不存在则重建一个任务栈，创建Activity实例并置于栈顶（可通过**TaskAffinity**属性指定Activity想要的任务栈
这个过程还存在一个任务栈的匹配，因为这个模式启动时，会在自己需要的任务栈中寻找实例，这个任务栈就是通过taskAffinity属性指定。如果这个任务栈不存在，则会创建这个任务栈。**不设置taskAffinity属性的话，默认为应用的包名。**
```kotlin
<activity
     android:name=".SingleTaskActivity"
     android:launchMode="singleTask">
</activity>

<activity
     android:name=".SingleTaskActivity"
     android:launchMode="singleTask"
     android:taskAffinity="${applicationId}.singleTask">
</activity>

```

- 若存在任务栈，则查看该Activity是否存在栈中，若不存在，则创建Activity实例并置于栈顶
- 若该Activity存在栈中，在将实例上的所有Activity出栈，使该Activity位于栈顶（回调`onNewIntent`）

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/d00324c17a4b4b8027cab5356ead88de.png)
使用场景
SingleTask这种启动模式最常使用的就是一个**APP的首页**，因为一般为一个APP的第一个页面，且长时间保留在栈中，所以最适合设置singleTask启动模式来复用。

### SingleInstance
单实例模式，顾名思义，只有一个实例。该模式具备singleTask模式的所有特性外，与它的区别就是，这种模式下的Activity会**单独占用一个Task栈**，具有全局唯一性，即整个系统中就这么一个实例，由于栈内复用的特性，后续的请求均不会创建新的Activity实例，除非这个特殊的任务栈被销毁了。以singleInstance模式启动的Activity在整个系统中是单例的，如果在启动这样的Activiyt时，已经存在了一个实例，那么会把它所在的任务调度到前台，重用这个实例。
一旦该模式的Activity实例已存在某个栈中，任何应用激活该Activity**都会重用该栈中的实例**并进入该应用中，即 **多个应用共享该栈中实例**
使用场景：
SingleInstance适合**需要与程序分离开的页面**。例如**闹铃提醒**、**电话拨号盘界面**，以及微信的小程序界面。

# Activity之间数据传递
## 通过Intent
这种方式通常用来传输简单的数据
发送数据
```java
Intent intent =new Intent(EX06.this,OtherActivity.class); 
intent.putExtra("boolean_key", true);
intent.putExtra("string_key", "string_value");
startActivity(intent);
```
接收数据
```java
   Intent intent=getIntent();
   intent.getBooleanExtra("boolean_key",false);
   intent.getStringExtra("string_key");
```
## 通过Bundle
这种方式通常用来传输多种数据类型
### 传输基本数据类型
发送数据
```java
Intent intent =new Intent(CurrentActivity.this,OtherActivity.class);
Bundle bundle =new Bundle();
bundle.putBoolean("boolean_key", true);
bundle.putString("string_key", "string_value");
intent.putExtra("key", bundle);// 封装对象
startActivity(intent);// 启动新的 Activity
```
接收数据
```java
Intent intent =getIntent();
Bundle bundle =intent.getBundleExtra("key");
bundle.getBoolean("boolean_key");
bundle.getString("string_key");
```
### 传输对象
对象数据需要先将对象序列化才能进行传输，可以让需要传输的对象实现Serializable或者Parcelable接口，然后使用Intent或者Bundle传输
发送数据
```java
Person person = new Person();
person.setName("chenjy");
person.setAge(18);

Bundle bundle = new Bundle();
bundle.putSerializable("person",person);

Intent intent = new Intent(MainActivity.this, SecondActivity.class);
intent.putExtras(bundle);
startActivity(intent);
```
接收数据
```java
Person person = (Person)getIntent().getSerializableExtra("person");
```
## 通过全局变量
如果想使某些数据长时间驻留内存，以便程序随时调用，建议采用全局对象。**Application全局类**不需要定义静态变量只要定义普通成员变量即可，但全局类中必须有一个无参构造方法，编写完Application类后，还需要在清单文件中配置全局类名，否则系统不会自动创建全局对象。
定义全局类
```java
public class MainApplication extends Application {
    private String username; //Application设置应用的全局变量
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
}

```
配置清单文件
```java
<application
    android:name=".MainApplication">
```
更新或获取全局变量
```java
public class MainActivity extends Activity {
    application =(MainApplication)getApplication();
       application.setUsername("lixu");
}
public class OtherActivity extends Activity {
    application = (MainApplication) getApplication();
    username = application.getUsername();
}
```
这种方式虽好，但是需要注意不要在Application当中初始化大对象，否则会拖慢App的首次启动速度，并且只有需要多处需要使用的对象才会设置为全局变量，切不可泛滥使用全局变量。
## 通过EventBus
当传输的数据量较大的时候Parcelable虽然很便捷，但是会出现异常**TransactionTooLargeException**。只时候就需要用到插件EventBus。
EventBus 是一款基于事件总线的优秀开源框架，使用的是发布 订阅者模型。发布者通过EventBus发布事件，订阅者通过EventBus订阅事件。当发布者发布事件时，订阅该事件的订阅者的事件处理方法将被调用。
关于EventBus的具体使用，之后的章节中会记录。
使用主要分为四步：

1. 定义事件
2. 订阅事件
3. 注册订阅者
4. 发送事件

定义事件
```java
public class MessageEvent {

    private String message;

    public MessageEvent(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

```
订阅事件
使用`@Subscribe`注解来定义订阅者方法，方法名可以是任意合法的方法名，参数类型为订阅事件的类型。(threadMode = ThreadMode.MAIN)中使用了ThreadMode.MAIN这个模式，表示该函数在主线程即UI线程中执行
```java
@Subscribe(threadMode = ThreadMode.MAIN)
public void onMessageEvent(MessageEvent event) {
    ...
}

```
注册订阅者
订阅者还需要在总线上注册，并在不需要时在总线上注销，只用注册的订阅者才会收到总线上发来的事件。
```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    // 注册订阅者
    EventBus.getDefault().register(this);
}

@Override
protected void onDestroy() {
    super.onDestroy();
    // 注销订阅者
    EventBus.getDefault().unregister(this);
}    

```
发布事件
```java
EventBus.getDefault().post(new MessageEvent("Post Event!"));
```
# 退出整个应用的解决方案
## 利用SingleTask
将主Activity（程序入口）设为SingTask模式，然后在要退出的Activity中转到主Activity，然后重写主Activity的onNewIntent函数，并在函数中加上一句finish。因为栈内复用
## 利用广播
在每个Activity创建时（onCreate时）给Activity注册一个广播接收器，当退出时发送该广播即可。大概的代码如下：一般将以下代码写在一个基类中，不然每个Activity都要写这一段代码
```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    IntentFilter filter = new IntentFilter();
    filter.addAction("finish");
    registerReceiver(mFinishReceiver, filter)
……
}

private BroadcastReceiver mFinishReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
        if("finish".equals(intent.getAction())) {
            Log.e("#########", "I am " + getLocalClassName()
                  + ",now finishing myself...");
            finish();
        }
    }
};

```
在退出时执行以下代码即可关闭所有界面完全退出程序：
```java
getApplicationContext().sendBroadcast(new Intent("finish"));
```
## 使用退出类
最流行的方式是定义一个栈，写一个自定义的MyApplication类，利用**单例模式**去单独对Activity进行管理，在每个Activity的onCreate()方法中调用`**MyApplication.getInstance().addActivity(this)**`将当前的Activity添加到栈中统一管理，如果需要退出应用程序时再调用`**MyApplication.getInstance().exit()**`方法直接就完全退出了应用程序。
```java
public class SysApplication extends Application { 
    private List<Activity> mList = new LinkedList<Activity>(); 
    private static SysApplication instance; 

    private SysApplication() {   
    } 
    public synchronized static SysApplication getInstance() { 
        if (null == instance) { 
            instance = new SysApplication(); 
        } 
        return instance; 
    } 
    // add Activity  
    public void addActivity(Activity activity) { 
        mList.add(activity); 
    } 

    public void exit() { 
        try { 
            for (Activity activity : mList) { 
                if (activity != null) 
                    activity.finish(); 
            } 
        } catch (Exception e) { 
            e.printStackTrace(); 
        } finally { 
            System.exit(0); 
        } 
    } 
    public void onLowMemory() { 
        super.onLowMemory();     
        System.gc(); 
    }  
}

```
在应用程序里面 的activity的oncreate里面添加SysApplication.getInstance().addActivity(this）如：
```java
public void onCreate(Bundle savedInstanceState){
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);
    SysApplication.getInstance().addActivity(this); 
}

```
# Activity状态保存和恢复
一般来说, 调用onPause()和onStop()方法后的activity实例仍然存在于内存中, activity的所有信息和状态数据不会消失, 当activity重新回到前台之后, 所有的改变都会得到保留.
有些内存不足、设备配置、意外操作可能会在运行时发生变化（例如屏幕方向、键盘可用性及语言设定切换而不是正常的应用程序行为）。 发生这种变化时，Android系统会破坏正在运行的 Activity。但系统会使用一组存储在Bundle对象中的键值对的集合来保存该Activity当前状态。这样如果用户导航回它，系统会创建一个新的Activity实例并使用一组保存的数据描述Activity被销毁的状态。从而回复之前"实例状态"。
要妥善处理重启行为，Activity 必须通过常规的Activity 生命周期恢复其以前的状态，在 Activity 生命周期中，Android 会在停止 Activity 之前调用 `onSaveInstanceState()`，以便您保存有关应用状态的数据。 然后，您可以在 `onCreate()` 或 `onRestoreInstanceState() `期间恢复 Activity 状态。
因此结合之前的生命周期方法，一个Activity从创建到销毁执行的生命周期方法有： onResume -> onSaveInstanceState（保存数据） ->onPuase -> onStop ->onDestory -> onCreate -> onStart -> onRestoreInstanceState（恢复数据）->onResumne
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/bfa51232a7593d735613e8c043ccff20.png)
这里存在几个问题：

1. 什么时候会去调用`onSaveInstanceState`保存Activity状态？
2. 什么时候会去调用`onRestoreInstanceState`恢复Activity的状态？
3. 在`onCreate()` 与在 `onRestoreInstanceState() `中恢复 Activity 状态有什么区别？

第一个问题：什么时候会去调用onSaveInstanceState保存Activity状态？
首先要知道并不是每次Activity即将要销毁都会调用`onRestoreInstanceState()`，只有在一些非用户操作导致Activity被回收的情况下才会去保存状态，例如因为内存不足，屏幕翻转，APP进入后台等。而当用户主动的点击back销毁Activity时，是不会调用的。
因为系统有可能"未经你的允许"销毁Activity，这种情况下则`onSaveInstanceState`会被系统调用，这是系统的责任，所以它必须要提供一个机会来保存Activity上的数据。
第二个问题：什么时候会去调用onRestoreInstanceState恢复Activity的状态？
`onSaveInstanceState`方法和`onRestoreInstanceState`方法“不一定”是成对的被调用的，`onRestoreInstanceState`被调用的前提是，activity“确实”**被系统**销毁了，而如果仅仅是停留在有这种可能性的情况下，则该方法不会被调用
例如，当正在显示activity A的时候，用户按下HOME键回到主界面，然后用户紧接着又返回到activity A，这种情况下activity A一般不会因为内存的原因被系统销毁，故activity A的`onRestoreInstanceState`方法不会被执行。
另外，`onRestoreInstanceState`的bundle参数也会传递到`onCreate`方法中，你也可以选择在`onCreate`方法中做数据还原。
第三个问题：在onCreate() 与在 onRestoreInstanceState() 中恢复 Activity 状态有什么区别？
我们知道在创建一个Activity时，onCreate方法一定会被回调，而onRestoreInstanceState只有在恢复由系统回收的Activity实例时才会回调。所以onCreate()里的Bundle参数可能为空，例如第一次创建这个Activity，如果使用onCreate()来恢复数据，一定要做非空判断。而onRestoreInstanceState的Bundle参数一定不会是空值。
## 保存状态
在需要保存状态的Activity中重写onSaveInstanceState方法，并使用Bundle保存数据，在Activity之间的参数传递有使用到Bundle
```java
static final String STATE_SCORE = "playerScore";
static final String STATE_LEVEL = "playerLevel";
...

@Override
public void onSaveInstanceState(Bundle savedInstanceState) {
    // 保存用户自定义的状态
    savedInstanceState.putInt(STATE_SCORE, mCurrentScore);
    savedInstanceState.putInt(STATE_LEVEL, mCurrentLevel);
    
    // 调用父类交给系统处理，这样系统能保存视图层次结构状态
    super.onSaveInstanceState(savedInstanceState);
}

```
## 恢复状态
可以在 `onCreate()` 或 `onRestoreInstanceState() `期间恢复 Activity 状态
### onCreate中恢复
因为可能这是第一次创建这一个Activity，不存在有要恢复的状态。所以需要对savedInstanceState判空
```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState); // 记得总是调用父类
   
    // 检查是否正在重新创建一个以前销毁的实例
    if (savedInstanceState != null) {
        // 从已保存状态恢复成员的值
        mCurrentScore = savedInstanceState.getInt(STATE_SCORE);
        mCurrentLevel = savedInstanceState.getInt(STATE_LEVEL);
    } else {
        // 可能初始化一个新实例的默认值的成员
    }
    ...
}

```
### onRestoreInstanceState中恢复
而在onRestoreInstanceState中恢复状态就不需要判空，因为只有需要恢复状态时，这个方法才会被调用，简而言之就是savedInstanceState参数不会为空，因此自然不需要判空处理
```java
public void onRestoreInstanceState(Bundle savedInstanceState) {
    // 总是调用超类，以便它可以恢复视图层次超级
    super.onRestoreInstanceState(savedInstanceState);
   
    // 从已保存的实例中恢复状态成员
    mCurrentScore = savedInstanceState.getInt(STATE_SCORE);
    mCurrentLevel = savedInstanceState.getInt(STATE_LEVEL);
}

```
其实这种状态恢复的方法是比较繁琐的，后面我们会学习使用JetPack中的ViewModel来保存Activity的状态。
