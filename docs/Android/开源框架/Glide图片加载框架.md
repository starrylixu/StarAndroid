![image.png](/images/b6e7dfe061dfd22614fec53da91763ef.png)
# With()源码
```java

public class Glide {
    ...

    // with()重载种类非常多，根据传入的参数可分为：
    // 1. 非Application类型的参数（Activity & Fragment  ）
    // 2. Application类型的参数（Context）
    // 下面将详细分析

// 参数1：Application类型
 public static RequestManager with(Context context) {
        RequestManagerRetriever retriever = RequestManagerRetriever.get();
        // 步骤1：调用RequestManagerRetriever类的静态get()获得RequestManagerRetriever对象 - 单例实现
        return retriever.get(context);
        // 步骤2：调用RequestManagerRetriever实例的get()获取RequestManager对象 & 绑定图片加载的生命周期 ->>分析1
    }

// 参数2：非Application类型（Activity & Fragment ）
    public static RequestManager with(Activity activity) {
        RequestManagerRetriever retriever = RequestManagerRetriever.get();
        return retriever.get(activity);
    }

    public static RequestManager with(Fragment fragment) {
        RequestManagerRetriever retriever = RequestManagerRetriever.get();
        return retriever.get(fragment);

  @TargetApi(Build.VERSION_CODES.HONEYCOMB)
    public static RequestManager with(android.app.Fragment fragment) {
        RequestManagerRetriever retriever = RequestManagerRetriever.get();
        return retriever.get(fragment);
    }

    }
}

<-- 分析1：RequestManagerRetriever对象的实例 get（）-->
// 作用：
  // 1. 获取RequestManager对象
  // 2. 将图片加载的生命周期与Activity/Fragment的生命周期进行绑定

  public class RequestManagerRetriever implements Handler.Callback {
      ...

    // 实例的get（）重载种类很多，参数分为：（与with（）类似）
    // 1. Application类型（Context）
    // 2. 非Application类型（Activity & Fragment ）- >>分析3
    // 下面会详细分析

// 参数1：Application类型（Context） 
   public RequestManager get(Context context) {
        return getApplicationManager(context);
        // 调用getApplicationManager（）最终获取一个RequestManager对象 ->>分析2
        // 因为Application对象的生命周期即App的生命周期
        // 所以Glide加载图片的生命周期是自动与应用程序的生命周期绑定，不需要做特殊处理（若应用程序关闭，Glide的加载也会终止）
    }

// 参数2：非Application类型（Activity & Fragment  ）
// 将Glide加载图片的生命周期与Activity生命周期同步的具体做法：向当前的Activity添加一个隐藏的Fragment
// 原因：因Fragment的生命周期 与 Activity 的是同步的，通过添加隐藏的Fragment 从而监听Activity的生命周期，
    //从而实现Glide加载图片的生命周期与Activity的生命周期 进行同步。
 @TargetApi(Build.VERSION_CODES.HONEYCOMB)
    public RequestManager get(Activity activity) {
        if (Util.isOnBackgroundThread() || Build.VERSION.SDK_INT < Build.VERSION_CODES.HONEYCOMB) {
            return get(activity.getApplicationContext());
        } else {

            assertNotDestroyed(activity);
             //判断activity是否已经销毁

            android.app.FragmentManager fm = activity.getFragmentManager();
            // 获取FragmentManager 对象
            
            return fragmentGet(activity, fm);
           // 通过fragmentGet返回RequestManager->>分析4
           
           
        }
    }

    public RequestManager get(FragmentActivity activity) {
      // 逻辑同上，此处不作过多描述
      ...

    }

    public RequestManager get(Fragment fragment) {
        // 逻辑同上，此处不作过多描述
      ...
    }

}

<-- 分析2：getApplicationManager（context）-->
private RequestManager getApplicationManager(Context context) {

      ...

        Glide glide = Glide.get(context);
        // 通过单例模式创建Glide实例 ->>分析3
        applicationManager =
            new RequestManager(
                glide, new ApplicationLifecycle(), new EmptyRequestManagerTreeNode());
      }
    }
  }
  return applicationManager;
}

<-- 分析3：Glide.get(context) -->
public static Glide get(Context context) {
  if (glide == null) {
  // 单例模式的体现
    synchronized (Glide.class) {
      if (glide == null) {
        Context applicationContext = context.getApplicationContext();
        
        List<GlideModule> modules = new ManifestParser(applicationContext).parse();
        // 解析清单文件配置的自定义GlideModule的metadata标签，返回一个GlideModule集合

        GlideBuilder builder = new GlideBuilder(applicationContext);
        // 步骤1：创建GlideBuilder对象
        for (GlideModule module : modules) {
          module.applyOptions(applicationContext, builder);
        }
        glide = builder.createGlide();
        // 步骤2：根据GlideBuilder对象创建Glide实例
        // GlideBuilder会为Glide设置一默认配置，如：Engine，RequestOptions，GlideExecutor，MemorySizeCalculator
       
        for (GlideModule module : modules) {
          module.registerComponents(applicationContext, glide.registry);
           // 步骤3：利用GlideModule 进行延迟性的配置和ModelLoaders的注册
        }
      }
    }
  }
  return glide;
}
// 回到分析1 进入 分析2的地方


<--分析4：fragmentGet(） -->
// 作用：
           // 1. 创建Fragment
           // 2. 向当前的Activity中添加一个隐藏的Fragment
           // 3. 将RequestManager与该隐藏的Fragment进行绑定
 RequestManager fragmentGet(Context context, android.app.FragmentManager fm) {
     
        RequestManagerFragment current = getRequestManagerFragment(fm);
        // 获取RequestManagerFragment
        // 作用：利用Fragment进行请求的生命周期管理 

        RequestManager requestManager = current.getRequestManager();

        // 若requestManager 为空，即首次加载初始化requestManager 
        if (requestManager == null) {
            // 创建RequestManager传入Lifecycle实现类，如ActivityFragmentLifecycle
            requestManager = new RequestManager(context, current.getLifecycle(), current.getRequestManagerTreeNode());
            current.setRequestManager(requestManager);
            // 调用setRequestManager设置到RequestManagerFragment 
        }
        return requestManager;
    }

```
![image.png](/images/d7a792fda37c7c41a871b8404c8c5ee3.png)
# Glide4.11
[Glide 4.11 源码解析(一)：图片加载流程_make sure you’re using the provided registry rathe_鹭岛猥琐男的博客-CSDN博客](https://blog.csdn.net/zzw0221/article/details/107146650)

