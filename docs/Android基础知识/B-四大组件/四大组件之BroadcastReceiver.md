

![广播](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251651460.gif)
[https://www.jianshu.com/p/ca3d87a4cdf3](https://www.jianshu.com/p/ca3d87a4cdf3)



# 什么是广播接收器
BroadcastReceiver是广播接收器，是一种消息型组件。用于在**不同的组件**乃至**不同的应用**之间传递消息，是四大组件之一
在我们的App中不同应用一般都处于不同的进程，由此可见，四大组件的广播接收器也是一种跨进程通信的工具。
# 工作原理
广播采用了设计模式中的观察者模式，基于消息的发布和订阅事件模型
模型中有三个角色：

1. 消息订阅者（广播接收者）
2. 消息发布者（广播发布者）
3. 消息中心（AMS，即Activity Manager Service）

原理示意图：
![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251651076.png)

# 使用流程
自定义一个广播接收者，继承自BroadcastReceiver，并重写抽象方法onReceive()，在其中实现接受广播后的具体逻辑事件，默认情况下，广播接收器运行在 UI 线程，因此，onReceive()方法**不能执行耗时操作**，否则将导致**ANR**
```java
//广播接收者，订阅者
// 继承BroadcastReceivre基类
public class mBroadcastReceiver extends BroadcastReceiver {

  // 复写onReceive()方法
  // 接收到广播后，则自动调用该方法
  @Override
  public void onReceive(Context context, Intent intent) {
   //写入接收广播后的操作
	}
}

```
# 广播接收器的注册方式
分为两种：1. 静态注册 2. 动态注册
## 静态注册
使用：在androidManifest文件中通过** receive **标签声明
特点：常驻、不受任何组件的生命周期影响（应用程序关闭后，如果有信息广播，程序依旧会被系统调用），耗电，占内存
```xml
<receiver>
  android:enabled=["true" | "false"]
  //此broadcastReceiver能否接收其他App的发出的广播
  //默认值是由receiver中有无intent-filter决定的：如果有intent-filter，默认值为true，否则为false
  android:exported=["true" | "false"]
  android:icon="drawable resource"
  android:label="string resource"
  //继承BroadcastReceiver子类的类名
  android:name=".mBroadcastReceiver"
  //具有相应权限的广播发送者发送的广播才能被此BroadcastReceiver所接收；
  android:permission="string"
  //BroadcastReceiver运行所处的进程
  //默认为app的进程，可以指定独立的进程
  //注：Android四大基本组件都可以通过此属性指定自己的独立进程
  android:process="string" >

  //用于指定此广播接收器将接收的广播类型
  //本示例中给出的是用于接收网络状态改变时发出的广播
  <intent-filter>
    <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
  </intent-filter>
</receiver>
```
静态广播在APP未启动的时候，就可以接受到广播，处理相应的逻辑。例如实现**某些应用的开机自启动**，就可以使用静态注册广播的方式实现。
## 动态注册
使用：指用代码调用Context.registerReceiver()方法
特点：非常驻、灵活、跟随组件的生命周期变化（组件结束，广播结束。故在组件结束前，必须移除广播接收器）
```java
// 选择在Activity生命周期方法中的onResume()中注册
@Override
protected void onResume(){
    super.onResume();

    // 1. 实例化BroadcastReceiver子类 &  IntentFilter
    // 创建一个广播接收器对象
    mBroadcastReceiver mBroadcastReceiver = new mBroadcastReceiver();
    IntentFilter intentFilter = new IntentFilter();

    // 2. 设置接收广播的类型
    // 广播的类型有几种
    intentFilter.addAction(android.net.conn.CONNECTIVITY_CHANGE);

    // 3. 动态注册：调用Context的registerReceiver（）方法
    registerReceiver(mBroadcastReceiver, intentFilter);
}


// 注册广播后，要在相应位置记得销毁广播
// 即在onPause() 中unregisterReceiver(mBroadcastReceiver)
// 当此Activity实例化时，会动态将MyBroadcastReceiver注册到系统中
// 当此Activity销毁时，动态注册的MyBroadcastReceiver将不再接收到相应的广播。
@Override
protected void onPause() {
    super.onPause();
    //销毁在onResume()方法中的广播
    unregisterReceiver(mBroadcastReceiver);
}
```
## 动态注册和销毁广播的最佳时机
Activity的生命周期是成对出现的：

- onCreate() & onDestory()
- onStart() & onStop()：Activity是否可见
- onResume() & onPause()：Activity是否位于前台

在**onResume()注册、onPause()注销**是因为onPause()在App死亡前一定会被执行，从而保证广播在App死亡前一定会被注销，从而防止内存泄露。
什么情况下onStop()不会执行？

1. 为什么不在onCreate() & onDestory() 或 onStart() & onStop()注册、注销？：当系统因为内存不足（优先级更高的应用需要内存，请看上图红框）要回收Activity占用的资源时，Activity在执行完onPause()方法后就会被销毁，有些生命周期方法onStop()，onDestory()可能不会执行。
2. 将广播的注销放在onStop()，onDestory()方法里的话，有可能在Activity被销毁后还未执行onStop()，onDestory()方法，即广播仍还未注销，从而导致内存泄露。
# 广播的应用场景
## 举例-动态注册监听系统状态变化
首先需要在manifest文件中声明网络权限
```java
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```
动态注册一个网络变化状态的广播接收器
```java
class MainActivity : AppCompatActivity() {
    private lateinit var mBinding: ActivityMainBinding
    //1.网络状态广播接收器全局变量
    private lateinit var networkReceiver: BroadcastReceiver
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mBinding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(mBinding.root)
        //2.创建广播接收器实例
        val intentFilter = IntentFilter();
        intentFilter.addAction("android.net.conn.CONNECTIVITY_CHANGE");
        networkReceiver = NetWorkReceiver()
        //3.注册广播接收器
        registerReceiver(networkReceiver, intentFilter);
    }

    override fun onDestroy() {
        super.onDestroy()
        //4.取消注册
        unregisterReceiver(networkReceiver)
    }

    inner class NetWorkReceiver : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val connectivityManager = getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
            val network = connectivityManager.activeNetwork
            val networkCapabilities = connectivityManager.getNetworkCapabilities(network)
            if (networkCapabilities != null) {
                if (networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                    Toast.makeText(this@MainActivity, "WIFI", Toast.LENGTH_SHORT).show()
                } else if (networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
                    Toast.makeText(this@MainActivity, "流量", Toast.LENGTH_SHORT).show()
                }
            } else {
                Toast.makeText(this@MainActivity, "没有网络", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
```
## 举例-静态注册实现应用开机自启动
首先需要在manifest文件中声明权限
```java
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```
实现自启动广播接收器
```java
class BootReceiver: BroadcastReceiver() {
    private val ACTION = "android.intent.action.BOOT_COMPLETED"
    override fun onReceive(context: Context?, intent: Intent?) {
        Log.i("lixu", "onReceive: lixu")
        if(ACTION==intent?.action){
            //去启动activity的主界面
            val intent1=Intent(context, MainActivity::class.java)
            intent1.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            context?.startActivity(intent1)
        }
    }
}
```
在manifest文件中静态注册
```java
<receiver
    android:name=".BootReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED" />
        <category android:name="android.intent.category.HOME" />
    </intent-filter>

</receiver>
```
# 发送自定义广播
以上的广播举例都是去监听系统的广播，而如果我们需要自己定义一个广播，然后在其他地方监听它，如何实现呢？
其实很简单，就是

1.  发送一个广播  
2. 定义广播接收器接收广播 相比于之前的监听**系统广播**，只多了一步发送广播的逻辑

发送广播通过Intent发送
```kotlin
val intent = Intent("广播的名字")
intent.setPackage(packageName)
sendBroadcast(intent)
```
**为什么需要**`**intent.setPackage(packageName)**`**呢？因为不指定广播发送的应用程序，这条自定义的广播就是隐式广播，而静态注册的广播接收器是无法收到隐式广播的，所以需要通过**`**intent.setPackage(packageName)**`**指定发送的应用程序，让它变成一条显示广播**
# 广播发送的本质
广播  是  用  **意图（Intent）**标识
定义广播的本质：定义广播所具备的 意图 （Intent）
广播的发送：实质就是 广播发送者  将此广播的 意图（Intent）通过**sendBroadcast（）**方法发送出去
# 广播的类型
广播分为5中类型：

1. 普通广播
2. 系统广播
3. 有序广播
4. 粘性广播
5. App应用内广播（本地广播）
> 还有另一种分类方法：标准广播和有序广播：
> 标准广播：完全异步的广播-》所有的接收者几乎在同一时刻接收到这一条广播，没有任何先后顺序可言
> 有序广播：同步执行的广播-》接收者会按照优先级接收广播，先收到到的接收者可以截断广播
> 问题：系统广播是标准广播还是有序广播？有序广播怎么定义接收者的优先级？


## 普通广播
即 开发者自身定义 intent的广播（最常用）。
```java
Intent intent = new Intent();
//对应BroadcastReceiver中intentFilter的action
intent.setAction(BROADCAST_ACTION);
//发送广播
sendBroadcast(intent);
```
若被注册了的广播接收者中注册时**intentFilter**的**action**与上述匹配，则会接收此广播（即进行回调onReceive()）。如下mBroadcastReceiver则会接收上述广播
```java
<receiver 
    //此广播接收者类是mBroadcastReceiver
    android:name=".mBroadcastReceiver" >
    //用于接收网络状态改变时发出的广播
    <intent-filter>
        <action android:name="BROADCAST_ACTION" />
    </intent-filter>
</receiver>
```
## 系统广播
系统广播是Android系统内置的广播，只要涉及到手机的基本操作（如开机、网络状态变化、拍照等等），都会发出相应的广播。我们的应用程序可以通过监听这些广播来得到系统的状态信息。
每个广播都有特定的Intent - Filter（包括具体的action），Android系统广播action如下：
`**【Android Sdk】\platforms\【任意的Android API版本】\data\broadcast_actions.txt**`**在这个文件中可以查看所有的系统广播列表**

| 系统操作 | action |
| --- | --- |
| 监听网络变化 | android.net.conn.CONNECTIVITY_CHANGE |
| 关闭或打开飞行模式 | Intent.ACTION_AIRPLANE_MODE_CHANGED |
| 充电时或电量发生变化 | Intent.ACTION_BATTERY_CHANGED |
| 电池电量低 | Intent.ACTION_BATTERY_LOW |
| 电池电量充足（即从电量低变化到饱满时会发出广播 | Intent.ACTION_BATTERY_OKAY |
| 系统启动完成后(仅广播一次) | Intent.ACTION_BOOT_COMPLETED |
| 按下照相时的拍照按键(硬件按键)时 | Intent.ACTION_CAMERA_BUTTON |
| 屏幕锁屏 | Intent.ACTION_CLOSE_SYSTEM_DIALOGS |
| 设备当前设置被改变时(界面语言、设备方向等) | Intent.ACTION_CONFIGURATION_CHANGED |
| 插入耳机时 | Intent.ACTION_HEADSET_PLUG |
| 未正确移除SD卡但已取出来时(正确移除方法:设置--SD卡和设备内存--卸载SD卡) | Intent.ACTION_MEDIA_BAD_REMOVAL |
| 插入外部储存装置（如SD卡） | Intent.ACTION_MEDIA_CHECKING |
| 成功安装APK | Intent.ACTION_PACKAGE_ADDED |
| 成功删除APK | Intent.ACTION_PACKAGE_REMOVED |
| 重启设备 | Intent.ACTION_REBOOT |
| 屏幕被关闭 | Intent.ACTION_SCREEN_OFF |
| 屏幕被打开 | Intent.ACTION_SCREEN_ON |
| 关闭系统时 | Intent.ACTION_SHUTDOWN |
| 重启设备 | Intent.ACTION_REBOOT |

当使用系统广播时，**只需要在注册广播接收者**时定义相关的action即可，并不需要手动发送广播，当系统有相关操作时会**自动进行系统广播**
## 有序广播
定义：发送出去的广播被广播接收者**按照先后顺序**接收（同步发送的广播）
发送有序广播时，通过`**sendOrderedBroadcast(intent);**`发送
广播接受者接收广播的顺序规则：

1. 按照Priority属性值从大-小排序；
2. Priority属性相同者，动态注册的广播优先；

特点：

1. 接收广播按顺序接收
2. 先接收的广播接收者可以对广播进行**截断**，即后接收的广播接收者不再接收到此广播；
3. 先接收的广播接收者可以对广播进行**修改**，那么后接收的广播接收者将接收到被修改后的广播、

个人理解：普通广播是异步的，广播发送后接收者都机会接收到消息；而有序广播是同步的，广播的接受会按照优先级顺序接受，只有当高一级的接收者接收到消息并不拦截时，下一级的接收者才能收到广播。
## 本地广播
背景：Android中的广播可以跨App直接通信（**exported**对于有intent-filter情况下默认值为true）
可能出现的冲突：

1. 其他App针对性发出与当前App intent-filter相匹配的广播，由此导致当前App不断接收广播并处理；
2. 其他App注册与当前App一致的intent-filter用于接收广播，获取广播具体信息；即会出现安全性 & 效率性的问题。

解决方案：
使用使用App应用内广播（本地广播）

1. App应用内广播可理解为一种**局部广播**，广播的发送者和接收者都同属于一个App。
2. 相比于全局广播（普通广播），App应用内广播优势体现在：**安全性高 & 效率高**

**曾遇到过一个面试题：系统广播和本地广播的最主要的区别是什么？系统广播可以跨进程通信，本地广播不可以，安全性和效率更高。**
### 使用方式-将全局广播设置成局部广播

1. 注册广播时将**exported**属性设置为false，使得非本App内部发出的此广播不被接收；
2. 在广播发送和接收时，增设相应权限permission，用于权限验证；
3. 发送广播时**指定该广播接收器所在的包名（**通过**intent.setPackage(packageName)**指定报名**）**，此广播将只会发送到此包中的App内与之相匹配的有效广播接收器中。
### 使用封装好的LocalBroadcastManager类
注册/取消注册广播接收器和发送广播时将参数的context变成了**LocalBroadcastManager**的单一实例
```java
//注册应用内广播接收器
//步骤1：实例化BroadcastReceiver子类 & IntentFilter mBroadcastReceiver 
mBroadcastReceiver = new mBroadcastReceiver(); 
IntentFilter intentFilter = new IntentFilter(); 

//步骤2：实例化LocalBroadcastManager的实例
localBroadcastManager = LocalBroadcastManager.getInstance(this);

//步骤3：设置接收广播的类型 
intentFilter.addAction(android.net.conn.CONNECTIVITY_CHANGE);

//步骤4：调用LocalBroadcastManager单一实例的registerReceiver方法进行动态注册 
localBroadcastManager.registerReceiver(mBroadcastReceiver, intentFilter);

//取消注册应用内广播接收器
localBroadcastManager.unregisterReceiver(mBroadcastReceiver);

//发送应用内广播
Intent intent = new Intent();
intent.setAction(BROADCAST_ACTION);
localBroadcastManager.sendBroadcast(intent);
```
## 粘性广播
由于在Android5.0 & API 21中已经失效，所以不建议使用，在这里也不作过多的总结。

# 简析广播源码
## 系统广播
广播接受者BoardcastReceiver，并重写onReceive()方法，通过**Binder** 机制在**AMS**注册
广播发送者 通过Binder 机制向AMS发送广播
AMS根据广播发送者要求，在已注册列表中，寻找合适的广播接收器（寻找依据：IntentFilter）并将广播发送到合适的广播接受者相应的消息循环队列中
广播接受者通过消息循环，拿到此广播，并回调onReceive()方法。
其中广播发送者与广播接受者的执行是异步的，即广播发送者不会关心有无接受者接收&也不确定接受者何时才能接收到。
![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202408251652132.png)

## 本地广播
下面简析一下LocalBroadcastManager源码
### 实例化广播
首先回顾一下实例化LocalBroadcastManager对象，很明显像单例模式的调用
```java
//步骤2：实例化LocalBroadcastManager的实例
localBroadcastManager = LocalBroadcastManager.getInstance(this);
```
看一下它的构造函数，不出所料构造函数被私有化。构造函数中基于主线程的 Looper 新建了一个 Handler，handleMessage中会调用接收器对广播的消息进行处理。
```java

public static LocalBroadcastManager getInstance(@NonNull Context context) {
    synchronized (mLock) {
        if (mInstance == null) {
            mInstance = new LocalBroadcastManager(context.getApplicationContext());
        }
        return mInstance;
    }
}

private LocalBroadcastManager(Context context) {
    mAppContext = context;
    mHandler = new Handler(context.getMainLooper()) {

        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case MSG_EXEC_PENDING_BROADCASTS:
                    //核心部分
                    executePendingBroadcasts();
                    break;
                default:
                    super.handleMessage(msg);
            }
        }
    };
}
```
### 注册广播
```java
//步骤4：调用LocalBroadcastManager单一实例的registerReceiver方法进行动态注册 
localBroadcastManager.registerReceiver(mBroadcastReceiver, intentFilter);
```
mReceivers 存储广播和过滤器信息，以BroadcastReceiver作为 key，IntentFilter链表作为 value。mReceivers 是接收器和IntentFilter的对应表，主要作用是方便在unregisterReceiver(…)取消注册，同时作为对象锁限制注册接收器、发送广播、取消接收器注册等几个过程的并发访问。
mActions 以Action为 key，注册这个Action的BroadcastReceiver链表为 value。mActions 的主要作用是方便在广播发送后快速得到可以接收它的BroadcastReceiver。
```java
//存储广播和过滤器信息
HashMap<BroadcastReceiver, ArrayList<IntentFilter>> mReceivers
            = new HashMap<BroadcastReceiver, ArrayList<IntentFilter>>();
//存储接收者
HashMap<String, ArrayList<ReceiverRecord>> mActions
            = new HashMap<String, ArrayList<ReceiverRecord>>();
 
public void registerReceiver(BroadcastReceiver receiver, IntentFilter filter) {
    synchronized (mReceivers) {
        ReceiverRecord entry = new ReceiverRecord(filter, receiver);
        ArrayList<IntentFilter> filters = mReceivers.get(receiver);
        if (filters == null) {
            filters = new ArrayList<IntentFilter>(1);
            mReceivers.put(receiver, filters);
        }
        filters.add(filter);
        for (int i=0; i<filter.countActions(); i++) {
            String action = filter.getAction(i);
            ArrayList<ReceiverRecord> entries = mActions.get(action);
            if (entries == null) {
                entries = new ArrayList<ReceiverRecord>(1);
                mActions.put(action, entries);
            }
            entries.add(entry);
        }
    }
}  
```
### 发送广播
```java
//发送应用内广播
Intent intent = new Intent();
intent.setAction(BROADCAST_ACTION);
localBroadcastManager.sendBroadcast(intent);
```
先根据Action从mActions中取出ReceiverRecord列表，循环每个ReceiverRecord判断 filter 和 intent 中的 action、type、scheme、data、categoried 是否 match（intentFilter的match机制），是的话则保存到receivers列表中，发送 what 为MSG_EXEC_PENDING_BROADCASTS的消息，通过 Handler 去处理。
```java
public boolean sendBroadcast(Intent intent) {
    synchronized (mReceivers) {
        final String action = intent.getAction();
        final String type = intent.resolveTypeIfNeeded(mAppContext.getContentResolver());
        final Uri data = intent.getData();
        final String scheme = intent.getScheme();
        final Set<String> categories = intent.getCategories();
        ……
        ArrayList<ReceiverRecord> entries = mActions.get(intent.getAction());
        if (entries != null) {
            if (debug) Log.v(TAG, "Action list: " + entries);
 
            ArrayList<ReceiverRecord> receivers = null;
            for (int i=0; i<entries.size(); i++) {
                ReceiverRecord receiver = entries.get(i);
                if (receiver.broadcasting) {
                    if (debug) {
                        Log.v(TAG, "  Filter's target already added");
                    }
                    continue;
                }
 
                int match = receiver.filter.match(action, type, scheme, data,
                        categories, "LocalBroadcastManager");
                if (match >= 0) {
                    if (debug) Log.v(TAG, "  Filter matched!  match=0x" +
                            Integer.toHexString(match));
                    if (receivers == null) {
                        receivers = new ArrayList<ReceiverRecord>();
                    }
                    receivers.add(receiver);
                    receiver.broadcasting = true;
                } else {
                    ……
                }
            }
 
            if (receivers != null) {
                for (int i=0; i<receivers.size(); i++) {
                    receivers.get(i).broadcasting = false;
                }
                mPendingBroadcasts.add(new BroadcastRecord(intent, receivers));
                if (!mHandler.hasMessages(MSG_EXEC_PENDING_BROADCASTS)) {
                    mHandler.sendEmptyMessage(MSG_EXEC_PENDING_BROADCASTS);
                }
                return true;
            }
        }
    }
    return false;
}

```
### 消息处理
mPendingBroadcasts转换为数组BroadcastRecord，循环每个receiver，调用其onReceive函数，这样便完成了广播的核心逻辑。
```java

private void executePendingBroadcasts() {
    while (true) {
        BroadcastRecord[] brs = null;
        synchronized (mReceivers) {
            final int N = mPendingBroadcasts.size();
            if (N <= 0) {
                return;
            }
            brs = new BroadcastRecord[N];
            //将mPendingBroadcasts转换为数组BroadcastRecord
            mPendingBroadcasts.toArray(brs);
            mPendingBroadcasts.clear();
        }
        //遍历数组BroadcastRecord
        for (int i=0; i<brs.length; i++) {
            BroadcastRecord br = brs[i];
            for (int j=0; j<br.receivers.size(); j++) {
                //调用每一个receiver的onReceive方法
                br.receivers.get(j).receiver.onReceive(mAppContext, br.intent);
            }
        }
    }
}

```
### 取消注册
取消注册就是通过遍历数组BroadcastRecord，将需要移除的接收者一一移除
```java
public void unregisterReceiver(BroadcastReceiver receiver) {
    synchronized (mReceivers) {
        ArrayList<IntentFilter> filters = mReceivers.remove(receiver);
        if (filters == null) {
            return;
        }
        for (int i=0; i<filters.size(); i++) {
            IntentFilter filter = filters.get(i);
            for (int j=0; j<filter.countActions(); j++) {
                String action = filter.getAction(j);
                ArrayList<ReceiverRecord> receivers = mActions.get(action);
                if (receivers != null) {
                    for (int k=0; k<receivers.size(); k++) {
                        if (receivers.get(k).receiver == receiver) {
                            receivers.remove(k);
                            k--;
                        }
                    }
                    if (receivers.size() <= 0) {
                        mActions.remove(action);
                    }
                }
            }
        }
    }
}

```
