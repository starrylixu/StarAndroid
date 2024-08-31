:::info
这篇文章很详细，需要理解整个Glide的思想，慢慢啃
:::
[Glide使用简介及流程分析](https://www.jianshu.com/p/7125feef0ddf)
Glide的加载过程大致如下:

1. Glide#with获取与生命周期绑定的 **RequestManager**
2. RequestManager通过load获取对应的 **RequestBuilder**。
3. RequestBuilder构建对应的**Request**, **Target** 将Request,Target 交给RequestManager进行统一管理。
4. 调用RequestManager#**track**开始进行图片请求。
5. request通过Engine分别尝试从活动缓存、Lru缓存、文件缓存中加载图片，当以上的缓存中都不存在对应的图片后，会从网络中获取。
6. 网络获取大致可以分成，ModelLoader模型匹配，DataFetcher数据获取，然后经历解码、图片变换、转换。如果能够进行缓存原始数据，还会将解码的数据进行编码缓存到文件。

![](/images/877ab143af66f9ab394a61280029d6c6.webp)
![](/images/d7721918cdf1a88ea26f2ec4f0e1d5f0.webp)
# 源码中涉及的类
## RequestManagerRetriever
**RequestManagerRetriever**类负责RequestManager的创建，并通过创建RequestManagerFragment / **SupportRequestManagerFragment** 并与RequestManager进行绑定，来赋予RequestManager生命周期

RequestManagerRetriever是一个单例类，可以理解为一个工厂类，通过get方法接收不同的参数，来创建RequestManager。
如果是在子线程进行的with操作，那么Glide将默认使用**ApplicationContext**
```java
if (Util.isOnBackgroundThread()) {
    return get(activity.getApplicationContext());
} 
```
```java
@NonNull
  public RequestManager get(@NonNull Context context) {
    if (context == null) {
      throw new IllegalArgumentException("You cannot start a load on a null Context");
    } else if (Util.isOnMainThread() && !(context instanceof Application)) {
      ···
    }

    return getApplicationManager(context);
  }

  @NonNull
  public RequestManager get(@NonNull FragmentActivity activity) {
    if (Util.isOnBackgroundThread()) {
      return get(activity.getApplicationContext());
    } else {
     ···
      return supportFragmentGet(activity, fm, /*parentHint=*/ null, isActivityVisible(activity));
    }
  }

  @NonNull
  public RequestManager get(@NonNull Fragment fragment) {
    Preconditions.checkNotNull(
        fragment.getContext(),
        "You cannot start a load on a fragment before it is attached or after it is destroyed");
    if (Util.isOnBackgroundThread()) {
      return get(fragment.getContext().getApplicationContext());
    } else {
      ····
      return supportFragmentGet(fragment.getContext(), fm, fragment, fragment.isVisible());
    }
  }

  @SuppressWarnings("deprecation")
  @NonNull
  public RequestManager get(@NonNull Activity activity) {
    if (Util.isOnBackgroundThread()) {
      return get(activity.getApplicationContext());
    } else {
      ····
      return fragmentGet(activity, fm, /*parentHint=*/ null, isActivityVisible(activity));
    }
  }

  @SuppressWarnings("deprecation")
  @NonNull
  public RequestManager get(@NonNull View view) {
    if (Util.isOnBackgroundThread()) {
      return get(view.getContext().getApplicationContext());
    }
      ···
    return get(fragment);
  }

```
## RequestManager
Glide用来**管理和开始请求的类**，实现了LifecycleListener接口并重写了如下方法，可以使用Activity和Fragment的生命周期事件机制的开启，停止及重启请求任务。
```java
/** 
  * 开始图片加载请求，
    一般在Activity或者Fragment的onStart方法内执行，
    用来重启失败或暂停的任务。*/
@Override
public void onStart() {    
  resumeRequests();
}
/** 
  * 暂停图片加载请求，
    一般在Activity或Fragment的onStop方法内执行，
    用来暂停任务。*/
@Override
public void onStop() {    
  pauseRequests();
}
/** 
* 取消正在执行的请求，
	以及释放已完成请求的资源。*/
@Override
public void onDestroy() {    
  requestTracker.clearRequests();
}
```
## Engine
负责开始加载任务，以及管理活跃的，已缓存的资源
## BitmapPool（bitmap对象的缓存池）
Bitmap内存池,用来复用对象
## Target
LifecycleListener接口的子类，Glide用来加载资源并在加载时通知相关声明周期事件的接口。
ViewTarget是它的抽象实现类。
典型的生命周期是**onLoadStarted -> onResourceReady or onLoadFailed -> onLoadCleared**，然而并不保证一定按照此顺序执行，比如：如果资源已经在内存中，则onLoadStarted就不会被调用，同样的，如果Target如果永远不被清除，则onLoadCleared永远不会被调用。
```java
//加载开始时调用
void onLoadStarted(@Nullable Drawable placeholder);
//加载失败是调用
void onLoadFailed(@Nullable Drawable errorDrawable);
//加载结束时调用
void onResourceReady(R resource, Transition<? super R> transition);
//加载任务取消并且资源被释放时调用
void onLoadCleared(@Nullable Drawable placeholder);
//取回目标大小，Callback的实现类为SizeDeterminer，在ViewTarget.class中
void getSize(SizeReadyCallback cb);
```

## ViewTarget
加载资源的基类。Target的部分实现类。根据参数的类型，有不同的实现方法，并能通过ViewTreeObserver.OnDrawListener来决定View的大小。
在需要检测任意涉及到复用View的ViewGroup时（比如listview），该类用setTag方法来存储一些标志，当检测到复用时，之前的加载任务和对应的资源文件会被取消或复用。
```java
ImageViewTarget：在ImageView中展示图片的基类，有如下两个子类
  DrawableImageViewTarget：当参数是drawable的使用使用
    //核心方法
    @Override
    protected void setResource(Bitmap resource) { 
       view.setImageBitmap(resource);
    }
  BitmapImageViewTarget：当参数是bitmap 的时候使用
    //核心方法
    @Override
    protected void setResource(Bitmap resource) { 
       view.setImageBitmap(resource);
    }
```
## LifecycleListener
Fragment和Activity生命周期方法的监听类，主要用来监听onStart，onStop，onDestroy三个方法。实现类如下RequestTracker
![image.png](/images/8f2a359556e8d60c1ca68737a20a9c0c.png)
![image.png](/images/7939e8627628a1ed9352d48c207bb31c.png)
```java
RequestManager：负责监听Fragment和Activity中对应的方法
      @Override
      public void onStart() {  
        resumeRequests();  //重启暂停或者失败的任务
        targetTracker.onStart();
      }
      @Override
      public void onStop() {  
        pauseRequests();  //暂停正在执行的任务
        targetTracker.onStop();
      }
DefaultConnectivityMonitor：负责网络状态监听广播的注册于反注册
      @Override
      public void onStart() {  
        register();
      }
      @Override
      public void onStop() {  
        unregister();
      }
BaseTarget：空实现,真正的实现者是其子类ImageViewTarget，用来开始与暂停动画
      @Override
      public void onStart() {  
        if (animatable != null) {    
          animatable.start();  
        }
      }
      @Override
      public void onStop() {  
        if (animatable != null) {    
          animatable.stop();  
        }
      }
TargetTracker：该类调用的，其实是Target类中对应的方法
      @Override
      public void onStart() {  
        for (Target<?> target : Util.getSnapshot(targets)) {    
          target.onStart();  
        }
      }
      @Override
      public void onStop() {  
        for (Target<?> target : Util.getSnapshot(targets)) {   
         target.onStop();  
        }
      }

RequestFutureTarget：空实现，忽略
NullConnectivityMonitor：空实现，忽略
```
## DataFetcher
数据提取的抽象接口，根据资源的来源有不同的实现，例如
```java

HttpUrlFetcher //加载网络图片数据
AssetPathFetcher //加载Asset图片数据
LocalUriFetcher //加载本地图片数据
ThumbFetcher //加载MediaStore中的缩略图数据
```


