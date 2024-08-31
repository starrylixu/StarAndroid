# View基础知识
1. View的位置参数
2. MotionEvent
3. TouchSlop
4. VelocityTracker
5. GestureDetector
6. Scroller
## 什么是View
View是所有控件的基类，它是界面层控件的一种抽象
android studio查看类的继承体系（快捷键CTRL+H）
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/57570ede2ab629caab10359a0c3aa409.png)
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/138f41a1d9856da5cd61413ce0bdb35d.png)
可见ViewGroup也是继承自View，这让我想到了组合设计模式
## View的位置参数
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/fb22b41f6989925f673f078db3524a70.png)
在onCreate()[回调](https://so.csdn.net/so/search?q=%E5%9B%9E%E8%B0%83&spm=1001.2101.3001.7020)方法中去调用view.getLeft(), getRight()…getX()、getY() 等值为0
View的显示必须经历Measure（测量）、Layout（布局）和Draw（绘制）过程。而在Measure与Layout过程完成之后，View的width、height、top、left等属性才被正确赋值，此时我们才能获取到正确的值，这几个过程都晚于onCreate执行
[android view.getLeft(), getRight()...等获取值为0_轻狂书生YT的博客-CSDN博客_view getleft 0](https://blog.csdn.net/qq_41466437/article/details/106279868)
疑问：View是在什么时候绘制的？？
[Activity启动后View何时开始绘制（onCreate中还是onResume之后？）](https://www.jianshu.com/p/c5d200dde486)
View在平移的过程中，top和left是原始左上角的位置信息，其值不会发生变化，此时发生改变的是x，y，translationX和translationY。
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/d20e8e783f11459aa8a5fd404ba0c0c4.png)
## MotionEvent和TouchSlop
## Scroller弹性滑动

# View的滑动
三种实现View滑动的方式

1. 通过View本身提供的scrollTo/scrollBy
2. 通过动画给View施加平移效果
3. 通过改变View的LayoutParams使得View重新布局
## 使用scrollTo/scrollBy
scrollBy也是调用了scrollTo方法
scrollBy：基于当前位置的相对滑动
scrollTo：基于所传递参数的绝对滑动
```java
/**                                                                    
 * Set the scrolled position of your view. This will cause a call to   
 * {@link #onScrollChanged(int, int, int, int)} and the view will be   
 * invalidated.                                                        
 * @param x the x position to scroll to                                
 * @param y the y position to scroll to                                
 */                                                                    
public void scrollTo(int x, int y) {                                   
    if (mScrollX != x || mScrollY != y) {                              
        int oldX = mScrollX;                                           
        int oldY = mScrollY;                                           
        mScrollX = x;                                                  
        mScrollY = y;                                                  
        invalidateParentCaches();                                      
        onScrollChanged(mScrollX, mScrollY, oldX, oldY);               
        if (!awakenScrollBars()) {                                     
            postInvalidateOnAnimation();                               
        }                                                              
    }                                                                  
}  

 /**                                                                       
  * Move the scrolled position of your view. This will cause a call to     
  * {@link #onScrollChanged(int, int, int, int)} and the view will be      
  * invalidated.                                                           
  * @param x the amount of pixels to scroll by horizontally                
  * @param y the amount of pixels to scroll by vertically                  
  */                                                                       
 public void scrollBy(int x, int y) {                                      
     scrollTo(mScrollX + x, mScrollY + y);                                 
 }                                                                         
```

```java
textView.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        //绝对滑动
        textView1.scrollTo(-100,0);
        Log.e(TAG, "onClick: textview1 mScrollX="+textView1.getScrollX() );
        //相对滑动
        textView.scrollBy(-100,0);
        Log.e(TAG, "onClick: textview mScrollX="+textView.getScrollX() );
    }
});
```
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/78feb7df28b7a16efd4e6404cac7bc9b.png)
滑动过程中的几个要点：详看Demo  chapter3_1

1. View本身不会移动，移动的是View中的内容
2. mScrollX的大小是View左边缘到View中内容的左边缘的水平距离
3. mScrollY的大小是View上边缘到View中内容的上边缘的水平距离
4. 从左往右滑动，mScrollX为正值（View左边缘在View中内容的左边缘的右边）

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/ec9a62044868bfad138bf3dd77c7b4a5.png)
## 使用动画
在1000ms内从原点水平右移200px，并保持状态
```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:fillAfter="true"
    android:zAdjustment="normal" >

    <translate
        android:duration="1000"
        android:fromXDelta="0"
        android:fromYDelta="0"
        android:interpolator="@android:anim/linear_interpolator"
        android:toXDelta="200"
        android:toYDelta="0" />
</set>
```
```java
      //使用原生动画实现滑动
        Animation animation= AnimationUtils.loadAnimation(this,R.anim.a1_translate);

        findViewById(R.id.textView1).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                textView1.startAnimation(animation);
            }
        });
//        使用属性动画实现滑动
        textView2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ObjectAnimator.ofFloat(textView2,"translationX",0,100).setDuration(1000).start();
            }
        });
```
原生动画与属性动画的区别（在Android3.0的前提下，因为Android3.0之前没有属性动画）
原生动画并不能真正改变View的位置，如果控件有交互事件，那么控件内容不在原始位置了，但是View容器还在原始位置能响应交互事件。
可以新位置只是View的一个影像。
但是属性动画可以解决这个问题。
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/d379870f31aa2a61631c577d1bab17fb.png)
## 改变布局参数
实现把textView3控件向右平移100px
```java
textView3.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        ViewGroup.MarginLayoutParams params=(ViewGroup.MarginLayoutParams)textView3.getLayoutParams();
        params.leftMargin+=100;
        textView3.requestLayout();
    }
});
```

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/1168e587e8eb4bb6df9ea01c8639157e.png)
## 滑动方式的对比

1. scrollTo/scrollBy：操作简单，适合对View内容的滑动
2. 动画：操作简单。主要适用没有交互的View和实现复杂的动画效果（3.0以上用属性动画既简单也适用交互View）
3. 改变布局参数：操作稍稍复杂，适用于有交互的View
# 弹性滑动
## 使用Scroller
## 使用动画
## 使用延时策略
[Android事件分发机制详解_谁谁谁动了我的博客-CSDN博客_安卓事件分发](https://blog.csdn.net/zjm807778317/article/details/123987990?spm=1001.2014.3001.5501)

[总结一下RecyclerView侧滑菜单的两种实现 - 掘金](https://juejin.cn/post/6997013239926095880#comment)
[RecyclerView - 使用ItemTouchHelper实现侧滑删除效果_fjnu_se的博客-CSDN博客](https://blog.csdn.net/fjnu_se/article/details/121896299)
# 事件分发机制（难点）

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/de94e3c9b09410f545213d40cbecba46.png)
[View的事件分发机制](https://zhuanlan.zhihu.com/p/158195747#:~:text=View%20%E7%9A%84%E4%BA%8B%E4%BB%B6%E5%88%86%E5%8F%91%E5%85%B6%E5%AE%9E%E5%B0%B1%E6%98%AF%E7%82%B9%E5%87%BB%E4%BA%8B%E4%BB%B6%EF%BC%88%20MotionEvent%20%EF%BC%89%E4%BB%8E%E4%BA%A7%E7%94%9F%E5%90%8E%E7%B3%BB%E7%BB%9F%E5%BC%80%E5%A7%8B%E5%88%86%E5%8F%91%EF%BC%8C%E5%88%B0%E4%BC%A0%E9%80%92%E7%BB%99%E4%B8%80%E4%B8%AA%E5%85%B7%E4%BD%93%E7%9A%84%20View%20%EF%BC%88%20%E6%88%96%E8%80%85Activity%20%EF%BC%89%E7%9A%84%E8%BF%87%E7%A8%8B%EF%BC%8CView,DOWN%20%E5%BC%80%E5%A7%8B%EF%BC%8C%E4%B8%AD%E9%97%B4%E6%9C%89%E4%B8%8D%E5%AE%9A%E6%95%B0%E4%B8%AA%20MOVE%20%2C%E6%9C%80%E5%90%8E%E4%BB%A5%20UP%20%E6%88%96%E8%80%85%20CANCLE%20%E7%BB%93%E6%9D%9F%E3%80%82)
[Android事件分发机制详解：史上最全面、最易懂](https://www.jianshu.com/p/38015afcdb58)
点击事件的传递顺序：Activity->Window->ViewGroup->具体的View
点击事件的三大方法：

- `dispatchTouchEvent` 对一个事件进行分发，可能是分发给下一层处理，或者分发给自己。 
- `onInterceptTouchEvent` 这个方法只有 ViewGroup 有，用来判断对事件是否进行拦截，如果拦截就不会分发给下一层. 
- `onTouchEvent` 对事件进行处理，消耗或者不消耗，不消耗就会返回给上层。对于 ViewGroup 和 View 这个方法还受到 OnTouchListener 和 enable 属性 的影响，具体的后面会阐述。
```java
    /**
     * Called to process touch screen events.  You can override this to
     * intercept all touch screen events before they are dispatched to the
     * window.  Be sure to call this implementation for touch screen events
     * that should be handled normally.
     *
     * @param ev The touch screen event.
     *
     * @return boolean Return true if this event was consumed.
     */
    public boolean dispatchTouchEvent(MotionEvent ev) {
        //空方法、空实现
        if (ev.getAction() == MotionEvent.ACTION_DOWN) {
            onUserInteraction();
        }
    	//
        if (getWindow().superDispatchTouchEvent(ev)) {
            return true;
        }
        return onTouchEvent(ev);
    }
```
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/52e5564e06cb11213fbbc92df1ac09b4.png)
Window是如何将事件传递给ViewGroup的？
Window是一个抽象类，其中的`superDispatchTouchEvent`方法也是抽象方法。
它的实现类是PhoneWindow，这个类不能在AS中查看。
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/9eb0d68df29721fc5278f560636c038c.png)
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/4058b4d177d9cb0f553add9315a4008f.png)

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/1b5a78978b46929f04a64280f08ca36f.png)
DecorView类也是在`package com.android.internal.policy;`这个包目录下。
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/edb84e2aa34327c2c60ae780bb41651e.png)
# 滑动冲突
## 常见的滑动冲突场景
![image.png](https://starrylixu.oss-cn-beijing.aliyuncs.com/171f5fdf4b3d995186eedd0be4b73566.png)
场景一：外部控件左右滑动，内部控件上下滑动：类似ViewPager嵌套Fragment（ListView）
场景二：类似ScrollView嵌套ListView
## 滑动冲突的处理规则
场景一：滑动的角度、距离差和速度差
场景二：业务的划分
## 滑动冲突的解决方式

1. 外部拦截法

事件先经过父容器的拦截处理，重写父容器的`onInterceptTouchEvent`方法

2. 内部拦截法

重写子元素的`dispatchTouchEvent`方法
### 外部拦截法
```java
public boolean onInterceptTouchEvent(MotionEvent event) {
        boolean intercepted = false;
        int x = (int) event.getX();
        int y = (int) event.getY();

        switch (event.getAction()) {
        case MotionEvent.ACTION_DOWN: {
            intercepted = false;
            if (!mScroller.isFinished()) {
                mScroller.abortAnimation();
                intercepted = true;
            }
            break;
        }
        case MotionEvent.ACTION_MOVE: {
            int deltaX = x - mLastXIntercept;
            int deltaY = y - mLastYIntercept;
            if (父容器需要拦截的事件规则) {
                intercepted = true;
            } else {
                intercepted = false;
            }
            break;
        }
        case MotionEvent.ACTION_UP: {
            intercepted = false;
            break;
        }
        default:
            break;
        }

        Log.d(TAG, "intercepted=" + intercepted);
        mLastX = x;
        mLastY = y;
        mLastXIntercept = x;
        mLastYIntercept = y;

        return intercepted;
    }
```
### 内部拦截法
父容器不拦截任何事件，所有的事件都传递给子元素，如果子元素需要此事件就直接消耗掉，否则就交由父容器进行处理。
```java
public boolean dispatchTouchEvent(MotionEvent event) {
        int x = (int) event.getX();
        int y = (int) event.getY();

        switch (event.getAction()) {
        case MotionEvent.ACTION_DOWN: {
            parent.requestDisallowInterceptTouchEvent(true);
            break;
        }
        case MotionEvent.ACTION_MOVE: {
            int deltaX = x - mLastX;
            int deltaY = y - mLastY;
            Log.d(TAG, "dx:" + deltaX + " dy:" + deltaY);
            if (父容器需要当前点击事件) {
                parent.requestDisallowInterceptTouchEvent(false);
            }
            break;
        }
        case MotionEvent.ACTION_UP: {
            break;
        }
        default:
            break;
        }

        mLastX = x;
        mLastY = y;
        return super.dispatchTouchEvent(event);
    }
```
