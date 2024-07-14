[https://developer.android.google.cn/guide/fragments/fragmentmanager?hl=zh-cn](https://developer.android.google.cn/guide/fragments/fragmentmanager?hl=zh-cn)
# FragmentManager简介
[FragmentManager](https://developer.android.google.cn/reference/androidx/fragment/app/FragmentManager?hl=zh-cn) 类负责在应用的 fragment 上执行一些操作，如添加、移除或替换操作，以及将操作添加到返回堆栈。
如果您使用的是 [Jetpack Navigation](https://developer.android.google.cn/guide/navigation?hl=zh-cn) 库，则您可能永远都不会与 FragmentManager 直接进行交互，因为该库会代表您来使用 FragmentManager。尽管如此，任何使用 fragment 的应用都在某种程度上使用了 FragmentManager，因此您需要了解它是什么以及如何工作。
# 获取FragmentManager
每个 [FragmentActivity](https://developer.android.google.cn/reference/androidx/fragment/app/FragmentActivity?hl=zh-cn) 及其子类（如 [AppCompatActivity](https://developer.android.google.cn/reference/androidx/appcompat/app/AppCompatActivity?hl=zh-cn)）都可以通过 [getSupportFragmentManager()](https://developer.android.google.cn/reference/androidx/fragment/app/FragmentActivity?hl=zh-cn#getSupportFragmentManager()) 方法访问 FragmentManager。
Fragment 也能够托管一个或多个子 fragment。在 fragment 内，您可以通过 [getChildFragmentManager()](https://developer.android.google.cn/reference/androidx/fragment/app/Fragment?hl=zh-cn#getChildFragmentManager()) 获取对管理 fragment 子级的 FragmentManager 的引用。 如果您需要访问其宿主 FragmentManager，可以使用 [getParentFragmentManager()](https://developer.android.google.cn/reference/androidx/fragment/app/Fragment?hl=zh-cn#getParentFragmentManager())。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1682503391267-945073e4-b285-4857-806b-663d3c7ea4c1.png#averageHue=%23f7f7f7&clientId=uebd04a33-fb0d-4&from=paste&id=ud57227f7&originHeight=829&originWidth=1255&originalType=url&ratio=1&rotation=0&showTitle=false&size=62154&status=done&style=none&taskId=u6fe54445-9db3-42aa-bc6e-d36b7ca1bb0&title=)
图 1 显示了两个示例，每个示例中都有一个 activity 宿主。这两个示例中的宿主 activity 都以 [BottomNavigationView](https://developer.android.google.cn/reference/com/google/android/material/bottomnavigation/BottomNavigationView?hl=zh-cn) 的形式向用户显示顶级导航，该视图负责以应用中的不同屏幕换出宿主 fragment，其中每个屏幕都实现为单独的 fragment。
**示例 1** 中的宿主 fragment 托管两个子 fragment，这些子 fragment 构成拆分视图屏幕。**示例 2** 中的宿主 fragment 托管一个子 fragment，该子 fragment 构成[滑动视图](https://developer.android.google.cn/guide/navigation/navigation-swipe-view-2?hl=zh-cn#implement_swipe_views)的显示 fragment。
基于此设置，您可以将每个宿主视为具有与其关联的 FragmentManager，用于管理其子 fragment。图 2 说明了这一点，并显示了 supportFragmentManager、parentFragmentManager 和 childFragmentManager 之间的属性映射。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1682503397256-d180006a-a626-4ec0-93d7-88d9f6359439.png#averageHue=%23f5f5f5&clientId=uebd04a33-fb0d-4&from=paste&id=uab7773b7&originHeight=774&originWidth=1600&originalType=url&ratio=1&rotation=0&showTitle=false&size=176155&status=done&style=none&taskId=u937cf351-6364-4288-88c9-8d1068b0387&title=)
# 使用FragmentManager
FragmentManager 管理 fragment 返回堆栈。在运行时，FragmentManager 可以执行添加或移除 fragment 等返回堆栈操作来响应用户互动。每一组更改作为一个单元（称为 [FragmentTransaction](https://developer.android.google.cn/reference/androidx/fragment/app/FragmentTransaction?hl=zh-cn)）一起提交。
当用户按设备上的“返回”按钮时，或者当您调用 FragmentManager.popBackStack() 时，最上面的 fragment 事务会从堆栈中弹出。（在提交事务的时候要相应的 [addToBackStack()](https://developer.android.google.cn/reference/androidx/fragment/app/FragmentTransaction?hl=zh-cn#addToBackStack(java.lang.String)) ，才会将事务提交到堆栈中，默认是不会添加到堆栈中的）
## 执行事务
如需在布局容器中显示 fragment，请使用 FragmentManager 创建 **FragmentTransaction**。在事务中，您随后可以对容器执行 [add()](https://developer.android.google.cn/reference/androidx/fragment/app/FragmentTransaction?hl=zh-cn#add(int,%20java.lang.Class%3C?%20extends%20androidx.fragment.app.Fragment%3E,%20android.os.Bundle)) 或 [replace()](https://developer.android.google.cn/reference/androidx/fragment/app/FragmentTransaction?hl=zh-cn#replace(int,%20java.lang.Class%3C?%20extends%20androidx.fragment.app.Fragment%3E,%20android.os.Bundle)) 操作。
```java
FragmentManager fragmentManager = getSupportFragmentManager();
fragmentManager.beginTransaction()
    .replace(R.id.fragment_container, ExampleFragment.class, null)
    .setReorderingAllowed(true)
    .addToBackStack("name") // name can be null添加到堆栈中
    .commit();
```
调用 addToBackStack() 会将事务提交到返回堆栈。用户稍后可以通过按“返回”按钮反转事务，并恢复上一个 fragment。如果您在一个事务中添加或移除了多个 fragment，弹出返回堆栈时，所有这些操作都会撤消。
。在 addToBackStack() 调用中提供的可选名称使您能够使用 [popBackStack()](https://developer.android.google.cn/reference/androidx/fragment/app/FragmentManager?hl=zh-cn#popBackStack(java.lang.String,%20int)) 弹回到该特定事务。
常用方法：
```java
//在Activity添加Fragment，第一个参数表示Fragment的布局id，
//第二个参数表示要添加的Fragment，第三个参数为为Fragment设置的tag，
//后续可以用这个tag进行查询
public abstract FragmentTransaction add(@IdRes int containerViewId, Fragment fragment,@Nullable String tag);

////替换宿主中一个已经存在的 fragment，这一个方法等价于先调用 remove(), 再调用 add()
public abstract FragmentTransaction replace(@IdRes int containerViewId, Fragment fragment,@Nullable String tag);

////移除一个已经存在的 fragment，如果之前添加到宿主上，那它的布局也会被移除
public abstract FragmentTransaction remove(Fragment fragment);

////隐藏一个已存的 fragment，其实就是将添加到宿主上的布局隐藏
public abstract FragmentTransaction hide(Fragment fragment);

//显示前面隐藏的 fragment，这只适用于之前添加到宿主上的 fragment
public abstract FragmentTransaction show(Fragment fragment);

////将指定的 fragment 将布局上解除，当调用这个方法时，fragment 的布局已经销毁了
public abstract FragmentTransaction detach(Fragment fragment);

//当前面解除一个 fragment 的布局绑定后，调用这个方法可以重新绑定，
//这将导致该 fragment 的布局重建，然后添加、展示到界面上
public abstract FragmentTransaction attach(Fragment fragment);
```
## 查找现有的Fragment
可以使用 [findFragmentById()](https://developer.android.google.cn/reference/androidx/fragment/app/FragmentManager?hl=zh-cn#findFragmentById(int)) 获取对布局容器中当前 fragment 的引用。
```java
getSupportFragmentManager().findFragmentById(R.id.fragment_container);
```
也可以为 fragment 分配一个唯一的标记，并使用 findFragmentByTag() 获取引用。 您可以在布局中定义的 fragment 上使用 android:tag XML 属性来分配标记，也可以在 FragmentTransaction 中的** add() 或 replace() **操作期间分配标记。
```java
getSupportFragmentManager().findFragmentByTag("tag");
```
## Fragment、FragmentManager、FragmentTransaction区别
Fragment
其实是对 View 的封装，它持有 view, containerView, fragmentManager, childFragmentManager 等信息
FragmentManager
是一个**抽象类**，它定义了对一个 Activity/Fragment 中 添加进来的 Fragment 列表、Fragment 回退栈的操作、管理方法,还定义了获取事务对象的方法,具体实现在 FragmentImpl 中
FragmentTransation
定义了对 Fragment 添加、替换、隐藏等操作，还有四种提交方法,具体实现是在 BackStackRecord 中

