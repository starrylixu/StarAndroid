# 什么是内存泄漏
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/774b9a7d8a6135ad83bf5669e9262216.png)
如下是常见的内存溢出导致应用奔溃
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/f2743b7117e259d24f8659cf618a9dcf.png)
# 垃圾回收机制
Java中垃圾回收机制
判断一个对象是否存活
在Java中有一个GC Root引用链，如果一个对象被GC Root直接或者间接引用那么这个对象就是GC可达的。
而没有在GC Root引用链上的对象就是不可达的对象会被垃圾回收机制回收

APP的生命周期很长，Activity的生命周期较短
如果**长生命周期**的对象引用一个**短生命周期**的对象，在短生命周期的对象被销毁时，就会因为存在引用链导致短生命周期的对象无法被回收，而常驻在内存中，导致内存泄漏。例如一个application引用了一个activity对象，那么activity销毁时就会导致activity无法被回收而内存泄漏
而当大量的内存泄露，最终导致内存不够用的时候，就会出现内存溢出

# 
