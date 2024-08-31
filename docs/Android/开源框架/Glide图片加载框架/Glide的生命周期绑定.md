# 引入依赖
以下的所有分析都是基于此版本的Glide分析
```java
//引入第三方库glide
implementation 'com.github.bumptech.glide:glide:4.11.0'
annotationProcessor 'com.github.bumptech.glide:compiler:4.11.0'
```
# 问题导入

1. Glide是如何感知当前页面的生命周期的？通过创建一个无UI的Fragment来实现；
2. Glide是如何传递生命周期的呢？RequestManager与Fragment之间通过Lifecycle、LifecycleListener接口回调的方式来实现。
:::info
关于为什么要设置Fragment的map缓存问题在文章中有解答
:::
[Android 【手撕Glide】--Glide是如何关联生命周期的？](https://www.jianshu.com/p/79dd4953ec25)
# 如何感知生命周期
在Glide的加载流程中我们说过：
**RequestManagerRetriever**类负责RequestManager的创建，并通过创建RequestManagerFragment / **SupportRequestManagerFragment** 并与RequestManager进行绑定，来赋予RequestManager生命周期
RequestManagerRetriever是一个单例类，可以理解为一个工厂类，通过get方法接收不同的参数，来创建RequestManager。
可以看到get方法有如下5种重载：
其实只要分为两种情况：

1. 传入的是Application参数——绑定应用程序生命周期
2. 传入的不是Application参数——绑定Activity/Fragment生命周期
```java
RequestManager get(@NonNull Context context) {}
RequestManager get(@NonNull FragmentActivity activity) {}
RequestManager get(@NonNull Fragment fragment) {}
RequestManager get(@NonNull Activity activity) {}
RequestManager get(@NonNull View view) {}
```
![image.png](/images/00a4ca32cd6b11827913d37c419fa391.png)
## 传入Application参数
传入Application Context或者在子线程使用：调用`**getApplicationManager(context);**`这样被绑定的图片生命周期就和应用程序一样了。
这里获取Lifecycle对象，用的是ApplicationLifecycle，由于没有绑定具有生命周期的对象，所以这里只会调用onStart()，这种情况绑定的图片的生命周期就和Application一样长了。
```java
 @NonNull
  private RequestManager getApplicationManager(@NonNull Context context) {
     //1.双重检测锁的单例写法
    if (applicationManager == null) {
      synchronized (this) {
        if (applicationManager == null) {
          
          Glide glide = Glide.get(context.getApplicationContext());
          applicationManager =
              factory.build(
                  glide,
                  //2.绑定的生命周期回调
                  new ApplicationLifecycle(),
                  new EmptyRequestManagerTreeNode(),
                  context.getApplicationContext());
        }
      }
    }
     //返回一个RequestManager类型的单例对象
    return applicationManager;
  }
```
可以看到**ApplicationLifecycle 中只调用了onStart()，**可以看到ApplicationLifecycle类中没有什么生命周期方法，仅仅一个onStart()，用来通知观察者图片已经绑定了。
```java
class ApplicationLifecycle implements Lifecycle {
  @Override
  public void addListener(@NonNull LifecycleListener listener) {
    listener.onStart();
  }

  @Override
  public void removeListener(@NonNull LifecycleListener listener) {
    // Do nothing.
  }
}

```
## 传入非Application

1. 创建一个无UI的Fragment，具体来说是**SupportRequestManagerFragment**／RequestManagerFragment（已废弃），并绑定到当前Activity，这样Fragment就可以感知Activity的生命周期；
2. 在创建Fragment时，初始化Lifecycle、**LifecycleListener**，并且在Fragment生命周期的onStart() 、onStop()、 onDestroy()中调用相关方法；
3. 在创建RequestManager时传入Lifecycle 对象，并且**RequestManager**实现了**LifecycleListener**接口；
4. 这样当Activity生命周期变化的时候，就能通过接口回调去通知RequestManager处理请求，从而管理Glide的图片请求。

创建了一个无UI的Fragment，**SupportRequestManagerFragment。**
![image.png](/images/b2a0ff20ebe85cb38884d68022a22127.png)
```java
  @NonNull
  private SupportRequestManagerFragment getSupportRequestManagerFragment(
      @NonNull final FragmentManager fm, @Nullable Fragment parentHint, boolean isParentVisible) {
     //1、由FragmentManager通过tag获取fragment
    SupportRequestManagerFragment current =
        (SupportRequestManagerFragment) fm.findFragmentByTag(FRAGMENT_TAG);
    if (current == null) {
    //2、从缓存集合中获取fragment的，map以fragmentManger为key，
      //以fragment为value进行存储（为什么需要缓存，如果不缓存会有什么后果）
      current = pendingSupportRequestManagerFragments.get(fm);
      if (current == null) {
          //3、创建一个fragment实例
        current = new SupportRequestManagerFragment();
        current.setParentFragmentHint(parentHint);
        if (isParentVisible) {
            //4.调用SupportRequestManagerFragment对象的getGlideLifecycle()方法
          current.getGlideLifecycle().onStart();
        }
          //5.将创建的Fragment放入HashMap缓存
        pendingSupportRequestManagerFragments.put(fm, current);
          //6.提交事物，将fragment绑定到Activity    
        fm.beginTransaction().add(current, FRAGMENT_TAG).commitAllowingStateLoss();
          //7.发消息，从map缓存中删除fragment (为什么马上要删除呢)
          //将要移除的fm通过handler发送出去 转到8
        handler.obtainMessage(ID_REMOVE_SUPPORT_FRAGMENT_MANAGER, fm).sendToTarget();
      }
    }
    return current;
  }


@Override
public boolean handleMessage(Message message) {
...
switch (message.what) {
    //8.从map缓存中删除fragment   
  case ID_REMOVE_SUPPORT_FRAGMENT_MANAGER:
    FragmentManager supportFm = (FragmentManager) message.obj;
    key = supportFm;
    //移除supportFm，就是7处通过obtainMessage传过来的fm    
    removed = pendingSupportRequestManagerFragments.remove(supportFm);
    break;
}
```
通过上面的分析主要有三个疑问：

1. 为什么创建一个fragment就能绑定图片的生命周期？
2. 为什么需要缓存创建的fragment？
3. 为什么创建完fragment，又要将其从缓存中移除？

### 绑定生命周期
第一个疑问：为什么创建一个fragment就能绑定图片的生命周期？
可以看到在【4】调用SupportRequestManagerFragment对象的getGlideLifecycle()方法，不同于传入Application直接调用ApplicationLifecycle。
getGlideLifecycle()方法返回的是一个**ActivityFragmentLifecycle**对象，细看此类的实现：
它实现了Lifecycle接口，并且保存着一个LifecycleListener的Set集合。而我们的addListener方法一共就在三处调用，添加的正是RequestManager对象（因为它实现类LifecycleListener接口）。
![image.png](/images/9b55075c6cf8a9ee0a82af8c1b95ec30.png)
```java
class ActivityFragmentLifecycle implements Lifecycle {
  private final Set<LifecycleListener> lifecycleListeners =
      Collections.newSetFromMap(new WeakHashMap<LifecycleListener, Boolean>());
  private boolean isStarted;
  private boolean isDestroyed;

  @Override
  public void addListener(@NonNull LifecycleListener listener) {
    lifecycleListeners.add(listener);

    if (isDestroyed) {
      listener.onDestroy();
    } else if (isStarted) {
      listener.onStart();
    } else {
      listener.onStop();
    }
  }

  @Override
  public void removeListener(@NonNull LifecycleListener listener) {
    lifecycleListeners.remove(listener);
  }

  void onStart() {
    isStarted = true;
    for (LifecycleListener lifecycleListener : Util.getSnapshot(lifecycleListeners)) {
      lifecycleListener.onStart();
    }
  }

  void onStop() {
    isStarted = false;
    for (LifecycleListener lifecycleListener : Util.getSnapshot(lifecycleListeners)) {
      lifecycleListener.onStop();
    }
  }

  void onDestroy() {
    isDestroyed = true;
    for (LifecycleListener lifecycleListener : Util.getSnapshot(lifecycleListeners)) {
      lifecycleListener.onDestroy();
    }
  }
}
```
在RequestManager中实现LifecycleListener接口中的方法，通过TargetTracker对象去开始，结束图片请求。这就是为什么说RequestManager是**管理和开始请求的类。**
**我们的**SupportRequestManagerFragment相当于被观察者，它拥有一系列的生命周期方法，在它的生命周期方法中调用着ActivityFragmentLifecycle的回调方法，而在ActivityFragmentLifecycle中又调用LifecycleListener接口的回调方法，而RequestManager实现了LifecycleListener接口，所以RequestManager作为观察者最终就能监听到SupportRequestManagerFragment生命周期的变化，从而实现对图片请求开始和结束的控制。
```java
//开始执行图片请求
@Override
public synchronized void onStart() {
    resumeRequests();
    targetTracker.onStart();
}

//停止执行图片请求
@Override
public synchronized void onStop() {
    pauseRequests();
    targetTracker.onStop();
}

//释放请求图片的资源与取消注册事件监听
@Override
public synchronized void onDestroy() {
    targetTracker.onDestroy();
    for (Target<?> target : targetTracker.getAll()) {
      clear(target);
    }
    targetTracker.clear();
    requestTracker.clearRequests();
    lifecycle.removeListener(this);
    lifecycle.removeListener(connectivityMonitor);
    mainHandler.removeCallbacks(addSelfToLifecycle);
    glide.unregisterRequestManager(this);
}
```
如此看来确实妙不可言。我们不需要在我们的真实UI上（Activity和Fragment）去管理图片请求，而是利用一个无UI的Fragment，通过去监听这个无UI的fragment的生命周期来管理和开始图片请求。
通过使用无 UI 的 Fragment，Glide 可以将图片加载任务与具体的 UI 元素（如 ImageView）解耦。这意味着即使 UI 元素发生了变化（如旋转屏幕导致 Activity 重新创建），Glide 也可以确保加载的图片正确地显示在新的 UI 元素上。

### 缓存Fragment
第二个问题：为什么需要缓存创建的fragment？
第三个问题：为什么创建完fragment，又要将其从缓存中移除？
因为当**【6】提交事务，将fragment绑定到Activity**  调用FragmentManager的add()方法时，是通过开启事务的方式来进行绑定的，这个过程是异步的，具体来说，就是调用add方法时，并不是马上就和activity绑定好了，而是通过Hander来处理的。
分析下面的场景：
```java
@Override
protected void onStart() {
    super.onStart();
    Glide.with(this).load("xx").into(image1);
    Glide.with(this).load("xx").into(image2);
}
```

1. 在第一次调用第一行代码的时候，会生成一个Fragment对象，通过FragmentManager将Fragment与Activity绑定，这个绑定过程是通过Handler发消息来完成的，假设这个消息为m1；
2. 紧接着使用Handler来发送消息从HashMap中删除刚才保存的Fragment，假设这个消息为m2；
3. 由于是异步的，在消息未处理之前已经开始执行第二行Glide代码了，具体说可能是m1，m2还没有处理，就已经开始调用getSupportRequestManagerFragment方法了，这个方法内部是获取Fragment对象的，具体分析上面说过了；如果不用map来缓存fragment，那么代码流程应该是这样的

![image.png](/images/2b599c353b1278b2ab420184ca328a41.png)
因为**【6】提交事务，将fragment绑定到Activity**  可能还没有完成，此时通过`findFragmentByTag`就找不到Fragment，就会重新生成一个Fragment，这是Glide所不允许的，每一个Activity或者Fragment在使用Glide时，只能有一个所依附的无UI的Fragment。所以将之前所生成的Fragment存储到HashMap中，这样就不会重复生成。
等到SupportRequestManagerFragment与Activity**绑定完成后**，也就是消息m1处理完成后，再将Fragment从Map中销毁。
所以使用缓存其实就是为了保证在提交事务，将fragment绑定到Activity 这个过程间隙中，能获取到这个无UI的Fragemnt，而不会去创建重复的。
