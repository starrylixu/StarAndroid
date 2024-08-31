[Android跨进程通信IPC之1——Linux基础](https://www.jianshu.com/p/36b488863bc0)
[进阶之路 | 奇妙的Activity之旅 - 掘金](https://juejin.cn/post/6844904070361120775)
# IPC
[Binder机制原理_独饮敌敌畏丶的博客-CSDN博客_binder机制原理](https://blog.csdn.net/afdafvdaa/article/details/124172584?spm=1001.2014.3001.5502)
[【IPC实战①】Messenger实战_独饮敌敌畏丶的博客-CSDN博客](https://blog.csdn.net/afdafvdaa/article/details/124674902?spm=1001.2014.3001.5502)
# IPC-AIDL
[AIDL详解 安卓最新AIDL详解！！！！！！！！_卡卡技术猫的博客-CSDN博客_aidl](https://blog.csdn.net/suiyue010211/article/details/126109284?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522166919563216782388039777%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=166919563216782388039777&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_click~default-2-126109284-null-null.142^v66^control,201^v3^control_2,213^v2^t3_esquery_v2&utm_term=AIDL&spm=1018.2226.3001.4187)
[CopyOnWriteArrayList原理，优缺点，使用场景_二十六画生的博客的博客-CSDN博客_copyonwritearraylist 缺点](https://blog.csdn.net/u010002184/article/details/90452918)
## Android Interface Definition Language，也就是Android接口定义语言

- 为什么要设计出这么一门语言？
- 它有哪些语法？
- 我们应该如何使用它？
- 再深入一点，我们可以思考，我们是如何通过它来达到我们的目的的？
- 更深入一点，为什么要这么设计这门语言？会不会有更好的方式来实现我们的目的？

[Android：学习AIDL，这一篇文章就够了(上)_lypeer的博客-CSDN博客_aidl](https://blog.csdn.net/luoyanglizi/article/details/51980630)
![image.png](/images/bcb96cb1251baf176bc189787810ef07.png)
在客户端修改，增加一本新书
![image.png](/images/bb411134c715d73c87ba85a7ec1bf89e.png)
观察者模式，客户端注册服务端方法，服务端触发事件回调客户端的监听方法
![image.png](/images/adbecb354821bdce056649da5b4701b3.png)
退出活动，应该取消注册，但是却找不到此客户端
demo app 的演示到从为止
注意这里为什么服务端无法成功解除注册
page71-84
退出BookManagerActivity后服务端无法找到注册的listener
对象无法跨进程直接传输
Binder会把 客户端传来的对象重新转化并生成一个新的对象。
![image.png](/images/9682d7a5d4dff136186082c1fb900b25.png)
新的demo  chapter2_1
使用RemoteCallBackList成功解决取消注册
![image.png](/images/99af5fa9bf8cbd80caa932f1f1a5b661.png)
执行耗时操作
客户端在主线程中请求服务器端的耗时操作时
主线程长时间阻塞，客户端可能会ANR
服务端调用客户端的方法时，它也是运行在客户端的线程池中，并不是服务端的哦
因此主动调用还是被动调用都不要放在主线程中
![image.png](/images/9e168e8ae1ec16fe21c4ce434b375f12.png)
# Binder死亡代理
 我们都知道，在和service进行交互时，service返回一个Binder对象。Binder是工作在service端，如果，由于某种原因，服务端出现故障而死亡，那么该返回的Binder对象也将消失，这时，如果我们在客户端在使用Binder对象进行某些函数调用将会出现错误。为了避免该情况的发生，我们可以为Binder对象设置死亡代理。当出现和服务端连接发生故障时，系统将自动调用死亡代理函数binderDied（）。
死亡代理是由
DeathRecipient 来实现，使用它比较简单，只要重写里面的binderDied（）方法即可。

- linkToDeath（）:为Binder对象设置死亡代理。 
- unlinkToDeath（）：将设置的死亡代理标志清除。
```java
//DeathRecipient方法应该是运行在Binder线程池
private IBinder.DeathRecipient mDeathRecipient =new IBinder.DeathRecipient() {
    @Override
    public void binderDied() {
        Log.e(TAG, "binderDied: "+Thread.currentThread().getName());
        if(mRemoteBookManager==null){
            return;
        }
        //unlinkToDeath（）：将设置的死亡代理标志清除。
        mRemoteBookManager.asBinder().unlinkToDeath(mDeathRecipient,0);
        mRemoteBookManager=null;
        //TODO:这里重新绑定远程Service
    }
};
private final ServiceConnection mConnection = new ServiceConnection() {
    public void onServiceConnected(ComponentName className, IBinder service) {
        IBookManager bookManager = IBookManager.Stub.asInterface(service);
        mRemoteBookManager = bookManager;
        try {
            //为Binder对象设置死亡代理。
            mRemoteBookManager.asBinder().linkToDeath(mDeathRecipient,0);
            List<Book> list = bookManager.getBookList();
            Log.i(TAG, "query book list, list type:"
                  + list.getClass().getCanonicalName());
            Log.i(TAG, "query book list: "+ list);
            Book newBook=new Book(3,"开源艺术探索");
            bookManager.addBook(newBook);
            Log.i(TAG, "add book: "+newBook);
            List<Book> newList=bookManager.getBookList();
            Log.i(TAG, "query book list: "+ newList);
            bookManager.registerListener(mOnNewBookArrivedListener);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
        mRemoteBookManager=null;
        //onServiceDisconnected应该是运行在主线程
        Log.e(TAG, "onServiceDisconnected: binder died!"+Thread.currentThread().getName());
    }

};
```
原文链接：
[android 之 linkToDeath和unlinkToDeath。(死亡代理)_L_L_R_A_C的博客-CSDN博客_linktodeath](https://blog.csdn.net/lea_fy/article/details/52987004)
在命令行以su命令杀死服务端进程
![image.png](/images/86841755cbe347b5e6fe73df30ac0204.png)
# AIDL权限验证
权限验证有两种方式：

- 在onBind()中验证
- 在服务端的onTransact()方法中验证
## 在onBind()中验证(page90)
在menifest中声明
```xml
<!--    AIDL的权限验证  声明权限-->
    <permission android:name="com.hnucm.chapter2_1.permission.ACCESS_BOOK_SERVICE"
        android:protectionLevel="normal"/>
```
在服务端的onBind中
```java
 @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        int check=checkCallingOrSelfPermission("com.hnucm.chapter2_1.permission.ACCESS_BOOK_SERVICE");
        if(check== PackageManager.PERMISSION_DENIED){
            Log.e(TAG, "onBind: 没有权限 无法绑定服务" );
            return null;//验证不通过
        }
        return mBinder;
    }

```
![image.png](/images/51a21a6a7435eacebf21d7955f3098ff.png)
```xml
<!--    内部应用绑定服务-->
    <uses-permission android:name="com.hnucm.chapter2_1.permission.ACCESS_BOOK_SERVICE"/>
```
![image.png](/images/2eeb6b29fda1e64720af4cfd7ff39d18.png)
## 在onTeansact()中验证
即验证了包名又验证了permission
```java
private Binder mBinder = new IBookManager.Stub() {
        //....
        
        //page90 权限验证的第二种方法
        public boolean onTransact(int code, Parcel data, Parcel reply, int flags)
                throws RemoteException {
            //采用permission验证
            int check = checkCallingOrSelfPermission("com.ryg.chapter_2.permission.ACCESS_BOOK_SERVICE");
            Log.d(TAG, "check=" + check);
            if (check == PackageManager.PERMISSION_DENIED) {
                return false;
            }

            String packageName = null;
            //getCallingUid()方法获取到包名
            String[] packages = getPackageManager().getPackagesForUid(
                    getCallingUid());
            if (packages != null && packages.length > 0) {
                packageName = packages[0];
            }
            Log.d(TAG, "onTransact: " + packageName);
            if (!packageName.startsWith("com.hnucm")) {
                return false;
            }

            return super.onTransact(code, data, reply, flags);
        }

    };
```
# ContentProvider
[Carson带你学Android：关于ContentProvider的知识都在这里了！_Carson带你学Android的博客-CSDN博客_contentprovider](https://blog.csdn.net/carson_ho/article/details/76101093)
ContentProvider通过uri来标识其它应用要访问的数据，通过`ContentResolver`的增、删、改、查方法实现对共享数据的操作。还可以通过注册ContentObserver来监听数据是否发生了变化来对应的刷新页面。
提供的专门用于不同应用间进行数据共享的方式，底层实现也是Binder（和Messenger一样）
> URI是什么？
> URL是Uniform Resource Locator的缩写，译为"统一资源定位符"。URL是一种URI（Uniform Resource Identifier，URI)，它标识一个互联网[资源](https://baike.baidu.com/item/%E8%B5%84%E6%BA%90)，并指定对其进行操作或获取该资源的方法。

ContentProvider的使用流程：
继承ContentProvider类并实现六个抽象方法。

- onCreate()：由系统回调运行在主线程中
- getType()：用来返回一个Uri请求所对应的媒体类型
- query()、update()、insert()、delete()：由外界回调运行在Binder线程池中

ContentProvider主要易表格的形式组织数据。
## 1.自定义BookProvider继承ContentProvider
```java
package com.example.chapter2_2;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class BookProvider extends ContentProvider {
    private final static String TAG="BookProvider";
    @Override
    public boolean onCreate() {
        Log.d(TAG, "onCreate ,current thread: "+Thread.currentThread().getName());
        return false;
    }

    @Nullable
    @Override
    public Cursor query(@NonNull Uri uri, @Nullable String[] projection, @Nullable String selection, @Nullable String[] selectionArgs, @Nullable String sortOrder) {
        Log.d(TAG, "onCreate ,current thread: "+Thread.currentThread().getName());
        return null;
    }

    @Nullable
    @Override
    public String getType(@NonNull Uri uri) {
        Log.d(TAG, "getType");
        return null;
    }

    @Nullable
    @Override
    public Uri insert(@NonNull Uri uri, @Nullable ContentValues values) {
        Log.d(TAG, "insert");
        return null;
    }

    @Override
    public int delete(@NonNull Uri uri, @Nullable String selection, @Nullable String[] selectionArgs) {
        Log.d(TAG, "delete");
        return 0;
    }

    @Override
    public int update(@NonNull Uri uri, @Nullable ContentValues values, @Nullable String selection, @Nullable String[] selectionArgs) {
        Log.d(TAG, "update");
        return 0;
    }
}

```
## 2.注册BookProvider
```java
<provider
    android:authorities="com.hnucm.chapter2_2.book.provider"
    android:name=".BookProvider"
    android:permission="com.hnucm.PROVIDER"
    android:process=":provider">
</provider>
```
## 3.外部调用
```java

package com.example.chapter2_2;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;

public class ProviderActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_provider);
        Uri uri=Uri.parse("content://com.hnucm.chapter2_2.book.provider");
        getContentResolver().query(uri,null,null,null,null);
        getContentResolver().query(uri,null,null,null,null);
        getContentResolver().query(uri,null,null,null,null);
    }
}
```
首先BookProvider 调用onCreate()方法，运行在主线程
其后三次调用query()方法，执行在Binder线程池中（这里有一个疑问，Binder线程池是怎么处理进程和分配资源的）
![image.png](/images/8a23741c3ae0b9d0a29988ec3773c017.png)
## 4.通过BookProvider调用数据
首先建立一个数据库保存数据
```java
package com.example.chapter2_2;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DbOpenHelper extends SQLiteOpenHelper {

    private static final String DB_NAME = "book_provider.db";
    public static final String BOOK_TABLE_NAME = "book";
    public static final String USER_TABlE_NAME = "user";

    private static final int DB_VERSION = 3;

    //图书和用户信息表
    private String CREATE_BOOK_TABLE = "CREATE TABLE IF NOT EXISTS "
            + BOOK_TABLE_NAME + "(_id INTEGER PRIMARY KEY," + "name TEXT)";

    private String CREATE_USER_TABLE = "CREATE TABLE IF NOT EXISTS "
            + USER_TABlE_NAME + "(_id INTEGER PRIMARY KEY," + "name TEXT,"
            + "sex INT)";

    public DbOpenHelper(Context context) {
        super(context, DB_NAME, null, DB_VERSION);
    }

    //执行SQL语句
    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_BOOK_TABLE);
        db.execSQL(CREATE_USER_TABLE);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // TODO ignored
    }

}

```
ContentProvider通过Uri来区分外界要访问的数据集合
外界根据Uri取出Uri_Code，然后根据Uri_Code得到数据表的名称，从而对表中的数据CRUD
```java

public class BookProvider extends ContentProvider {
    private final static String TAG="BookProvider";

    //...

    //外界通过这个方法 根据Uri取出Uri_Code，然后根据Uri_Code得到数据表的名称，从而对表中的数据CRUD
    private String getTableName(Uri uri) {
        String tableName = null;
        switch (sUriMatcher.match(uri)) {
            case BOOK_URI_CODE:
                tableName = DbOpenHelper.BOOK_TABLE_NAME;
                break;
            case USER_URI_CODE:
                tableName = DbOpenHelper.USER_TABLE_NAME;
                break;
            default:break;
        }
        return tableName;
    }
}

```
![image.png](/images/14c463dfaf84012fae08f462b0832de6.png)
![image.png](/images/fd8a207fa91d0d50979d97a999d25fb2.png)
# Socket套接字
不仅可以实现进程间通信，还可以实现设备间通信。
分类

- 流式套接字：TCP协议
- 用户数据报套接字：UDP协议

知识点TCP与UDP的区别
# Socket实现跨进程聊天程序
## 1.声明权限
```xml
  	<!--    声明权限-->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```
## 2.服务端设计
服务端记得注册哦，不然会报  no fund错误
```java
package com.hnucm.chapter2_3;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Random;


import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

public class TCPServerService extends Service {

    private final static String TAG="TCPServerService";
    private boolean mIsServiceDestoryed = false;
    private String[] mDefinedMessages = new String[] {
            "你好啊，哈哈",
            "请问你叫什么名字呀？",
            "今天北京天气不错啊，shy",
            "你知道吗？我可是可以和多个人同时聊天的哦",
            "给你讲个笑话吧：据说爱笑的人运气不会太差，不知道真假。"
    };

    @Override
    public void onCreate() {
        new Thread(new TcpServer()).start();
        super.onCreate();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        mIsServiceDestoryed = true;
        super.onDestroy();
    }

    private class TcpServer implements Runnable {

        @SuppressWarnings("resource")
        @Override
        public void run() {
            ServerSocket serverSocket = null;
            try {
                serverSocket = new ServerSocket(8688);
            } catch (IOException e) {
                Log.i(TAG, "run: establish tcp server failed, port:8688");
                e.printStackTrace();
                return;
            }

            while (!mIsServiceDestoryed) {
                try {
                    // 接受客户端请求
                    final Socket client = serverSocket.accept();
                    Log.i(TAG, "run: accept");
                    new Thread() {
                        @Override
                        public void run() {
                            try {
                                responseClient(client);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        };
                    }.start();

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private void responseClient(Socket client) throws IOException {
        // 用于接收客户端消息
        BufferedReader in = new BufferedReader(new InputStreamReader(
                client.getInputStream()));
        // 用于向客户端发送消息
        PrintWriter out = new PrintWriter(new BufferedWriter(
                new OutputStreamWriter(client.getOutputStream())), true);
        out.println("欢迎来到聊天室！");
        while (!mIsServiceDestoryed) {
            String str = in.readLine();
            Log.i(TAG, "responseClient: msg from client:" + str);
            if (str == null) {
                break;
            }
            int i = new Random().nextInt(mDefinedMessages.length);
            String msg = mDefinedMessages[i];
            out.println(msg);
            Log.i(TAG, "responseClient: send :" + msg);
        }
        Log.i(TAG, "responseClient: client quit.");
        // 关闭流
        MyUtils.close(out);
        MyUtils.close(in);
        client.close();
    }

}

```
## 3.客户端
```java
package com.hnucm.chapter2_3;

import java.io.*;
import java.net.Socket;
import java.sql.Date;
import java.text.SimpleDateFormat;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.SystemClock;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class TCPClientActivity extends Activity implements OnClickListener {

    private static final String TAG="TCPClientActivity";
    private static final int MESSAGE_RECEIVE_NEW_MSG = 1;
    private static final int MESSAGE_SOCKET_CONNECTED = 2;

    private Button mSendButton;
    private TextView mMessageTextView;
    private EditText mMessageEditText;

    private PrintWriter mPrintWriter;
    private Socket mClientSocket;

    @SuppressLint("HandlerLeak")
    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
            case MESSAGE_RECEIVE_NEW_MSG: {
                mMessageTextView.setText(mMessageTextView.getText()
                        + (String) msg.obj);
                break;
            }
            case MESSAGE_SOCKET_CONNECTED: {
                mSendButton.setEnabled(true);
                break;
            }
            default:
                break;
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mMessageTextView = (TextView) findViewById(R.id.msg_container);
        mSendButton = (Button) findViewById(R.id.send);
        mSendButton.setOnClickListener(this);
        mMessageEditText = (EditText) findViewById(R.id.msg);
        Intent service = new Intent(this, TCPServerService.class);
        startService(service);
        new Thread() {
            @Override
            public void run() {
                connectTCPServer();
            }
        }.start();
    }

    @Override
    protected void onDestroy() {
        if (mClientSocket != null) {
            try {
                mClientSocket.shutdownInput();
                mClientSocket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        super.onDestroy();
    }

    @Override
    public void onClick(View v) {
        if (v == mSendButton) {
            final String msg = mMessageEditText.getText().toString();
            if (!TextUtils.isEmpty(msg) && mPrintWriter != null) {
                //这里mPrintWriter执行IO操作也必须在子线程中哦，书中有错误
                new Thread(){
                    @Override
                    public void run() {
                        super.run();
                        mPrintWriter.println(msg);
                    }
                }.start();
                mMessageEditText.setText("");
                String time = formatDateTime(System.currentTimeMillis());
                final String showedMsg = "self " + time + ":" + msg + "\n";
                mMessageTextView.setText(mMessageTextView.getText() + showedMsg);
            }
        }
    }

    @SuppressLint("SimpleDateFormat")
    private String formatDateTime(long time) {
        return new SimpleDateFormat("(HH:mm:ss)").format(new Date(time));
    }

    private void connectTCPServer() {
        Socket socket = null;
        while (socket == null) {
            try {
                socket = new Socket("localhost", 8688);
                mClientSocket = socket;
                mPrintWriter = new PrintWriter(new BufferedWriter(
                        new OutputStreamWriter(socket.getOutputStream())), true);
                mHandler.sendEmptyMessage(MESSAGE_SOCKET_CONNECTED);
                Log.i(TAG, "connectTCPServer: connect server success");
            } catch (IOException e) {
                SystemClock.sleep(1000);
                Log.i(TAG, "connectTCPServer: connect tcp server failed, retry...");
            }
        }

        try {
            // 接收服务器端的消息
            BufferedReader br = new BufferedReader(new InputStreamReader(
                    socket.getInputStream()));
            while (!TCPClientActivity.this.isFinishing()) {
                String msg = br.readLine();
                Log.i(TAG, "connectTCPServer: receive :" + msg);
                if (msg != null) {
                    String time = formatDateTime(System.currentTimeMillis());
                    final String showedMsg = "server " + time + ":" + msg
                            + "\n";
                    mHandler.obtainMessage(MESSAGE_RECEIVE_NEW_MSG, showedMsg)
                            .sendToTarget();
                }
            }
            Log.i(TAG, "connectTCPServer: quit...");
            MyUtils.close(mPrintWriter);
            MyUtils.close(br);
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```
主线程访问访问网络错误
![image.png](/images/1948de090cb367658fe8efbcdc9b7762.png)
书中客户端的代码有错误，IO操作不应该在主线程中执行，应将`mPrintWriter.println(msg);`在子线程中执行
```java
@Override
    public void onClick(View v) {
        if (v == mSendButton) {
            final String msg = mMessageEditText.getText().toString();
            if (!TextUtils.isEmpty(msg) && mPrintWriter != null) {
                //这里mPrintWriter执行IO操作也必须在子线程中哦，书中有错误
                new Thread(){
                    @Override
                    public void run() {
                        super.run();
                        mPrintWriter.println(msg);
                    }
                }.start();
                mMessageEditText.setText("");
                String time = formatDateTime(System.currentTimeMillis());
                final String showedMsg = "self " + time + ":" + msg + "\n";
                mMessageTextView.setText(mMessageTextView.getText() + showedMsg);
            }
        }
    }
```
![image.png](/images/cbf3c65c6308efdb96bcbfa59e53cb48.png)
# Binder连接池（page112-121)
AIDL是进程间通信的首选。
## AIDL的使用流程

1. 创建一个Service和AIDL接口
2. 创建一个类继承自AIDL接口中的Stub类，并实现Stub中的抽象方法（有哪些抽象方法？）
3. 在Service的onBind方法中返回这个类对象
4. 客户端绑定服务端Service（怎么绑定）

缺点（限制）：业务大时，Service的数量会增多，会消耗系统资源。如何减少Service的数量，将所有的AIDL放在同一个Service中管理？？
## Binder连接池的工作机制
Binder连接池的主要作用就是将每个业务模块的Binder请求**统一转发到远程Service**中去执行，从而**避免了重复创建Service**的过程。
![image.png](/images/ed99688e43d72a576a38d4c033b43b4d.png)
## 多业务模块使用AIDL
一个客户端调用多个业务模块` SecurityCenterImpl `和` ComputeImpl` ，通过中间层Binder池调用queryBinder方法统一拿到不同的业务请求转发给远程Service中，这样便实现了一个Service管理多个AIDL接口：具体代码看module：chapter2_4
```java

package com.hnucm.chapter2_4;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

public class BinderPoolActivity extends AppCompatActivity {

    private static final String TAG = "BinderPoolActivity";

    private ISecurityCenter mSecurityCenter;
    private ICompute mCompute;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //在子线程中连接远程Service 回顾一下客户端的主线程不要调用服务端的方法，有可能是耗时操作，所以最好在子线程中运行
        new Thread(() -> doWork()).start();
    }

    private void doWork() {
        //创建Binder池实例
        BinderPool binderPool = BinderPool.getInsance(BinderPoolActivity.this);
        //Binder池调用queryBinder方法统一拿到不同的业务请求转发给远程Service中
        IBinder securityBinder = binderPool.queryBinder(BinderPool.BINDER_SECURITY_CENTER);//调用queryBinder方法
        mSecurityCenter = (ISecurityCenter) SecurityCenterImpl.asInterface(securityBinder);
        Log.d(TAG, "visit ISecurityCenter");
        String msg = "hello world-安卓";
        Log.d(TAG, "doWork content:" + msg);
        try {
            //执行加密操作
            String password = mSecurityCenter.encrypt(msg);
            Log.d(TAG, "doWork: encrypt:" + password);
            Log.d(TAG, "doWork: decrypt:" + mSecurityCenter.decrypt(password));
        } catch (RemoteException e) {
            e.printStackTrace();
        }

        Log.d(TAG, "visit ICompute");
        //Binder池调用queryBinder方法统一拿到不同的业务请求转发给远程Service中
        IBinder computeBinder = binderPool.queryBinder(BinderPool.BINDER_COMPUTE);//调用queryBinder方法
        mCompute = ComputeImpl.asInterface(computeBinder);
        try {
            Log.d(TAG, "doWork: 3+5=" + mCompute.add(3, 5));
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }
}
```
### 为什么要在子线程中执行
![image.png](/images/39fe148955cd6e3fa3ec95d451bfaf88.png)
![image.png](/images/6cde9e9856031b6c5de92c7111545771.png)
### 如何扩展业务
只需要新增AIDL接口，以及修改BinderPoolImpl池中的queryBinder方法，无需新增Service类
但缺点也很明显，BinderPoolImpl的逻辑判断会越来越多。
# 如何选择IPC方式
![image.png](/images/a3187865a69bff333a523e8f074fd8d0.png)
