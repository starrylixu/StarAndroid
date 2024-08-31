# 基本用法
[Android基础入门：EventBus实现总线数据分发](https://www.yuque.com/starryluli/xv1nr0/ag7gi8?view=doc_embed)
# 技术亮点

1. 静态单例
2. 反射
3. 观察者设计模式
# 源码分析
## register(this)
```java
//在MainActivity中注册
    EventBus.getDefault().register(this);
```
```java
//入参是object类型  所以可以注册Fragment
public void register(Object subscriber) {
        if (AndroidDependenciesDetector.isAndroidSDKAvailable() && !AndroidDependenciesDetector.areAndroidComponentsAvailable()) {
            // Crash if the user (developer) has not imported the Android compatibility library.
            throw new RuntimeException("It looks like you are using EventBus on Android, " +
                    "make sure to add the \"eventbus\" Android library to your dependencies.");
        }

    	//首先获得class对象
        Class<?> subscriberClass = subscriber.getClass();
    	//遍历class的所有方法 找到有subscribe注解的所有方法生成一个集合返回
        List<SubscriberMethod> subscriberMethods = subscriberMethodFinder.findSubscriberMethods(subscriberClass);
        synchronized (this) {
            for (SubscriberMethod subscriberMethod : subscriberMethods) {
                subscribe(subscriber, subscriberMethod);
            }
        }
    }
```
## findSubscriberMethods(subscriberClass)
```java
List<SubscriberMethod> findSubscriberMethods(Class<?> subscriberClass) {
        //METHOD_CACHE缓存  先从缓存中读取订阅者的class
        /**
        */
        List<SubscriberMethod> subscriberMethods = METHOD_CACHE.get(subscriberClass);
        if (subscriberMethods != null) {
            return subscriberMethods;
        }

        if (ignoreGeneratedIndex) {
            subscriberMethods = findUsingReflection(subscriberClass);
        } else {
            subscriberMethods = findUsingInfo(subscriberClass);
        }
        if (subscriberMethods.isEmpty()) {
            throw new EventBusException("Subscriber " + subscriberClass
                    + " and its super classes have no public methods with the @Subscribe annotation");
        } else {
            METHOD_CACHE.put(subscriberClass, subscriberMethods);
            return subscriberMethods;
        }
    }
```
# 第一集31min

