Android的动画分为3种：

1. View动画：对场景对象的图像变换
2. 帧动画：一系列图片的切换实现动画
3. 属性动画：动态地改变对象的属性实现动画
# View动画

1. 平移动画
2. 缩放动画
3. 旋转动画
4. 透明度动画

![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/7d8b90f228691aa62b092c0a7330da72.png)
# 帧动画
顺序播放一组预先定义好的图片。
系统提供AnimationDrawable来使用帧动画。
尽量避免使用过多尺寸较大的图片。
## xml定义AnimationDrawable
## 播放帧动画
# View动画的特殊使用场景

1. ViewGroup中控制子元素的出场效果
2. 实现Activity的切换效果
## LayoutAnimation
作用于ViewGroup，为ViewGroup指定一个动画。
### 1.定义LayoutAnimation
```xml
//res/anim/layout_animation.xml
<?xml version="1.0" encoding="utf-8"?>
<layoutAnimation xmlns:android="http://schemas.android.com/apk/res/android"
    android:delay="0.5"
    android:animationOrder="normal"
    android:animation="@anim/anim_item">
</layoutAnimation>
```
### 2.为子元素指定具体的入场动画
```xml
//res/anim/anim_item.xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="300"
    android:shareInter="@android:anim/accelerate_interpolator"
    android:shareInterpolator="true">
    <alpha
        android:fromAlpha="0.0"
        android:toAlpha="1.0"/>
    <translate
        android:fromXDelta="500"
        android:toXDelta="0"/>
</set>
```
### 3.为ViewGroup指定layoutAnimation属性
通过xml属性指定
`android:layoutAnimation="@anim/layout_animation"`
```xml
<com.hnucm.chapter7_1.ui.RevealLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:layoutAnimation="@anim/layout_animation"
    android:orientation="vertical"
    android:padding="12dp" >

    <Button
        android:id="@+id/button1"
        style="@style/AppTheme.Button.Green"
        android:onClick="onButtonClick"
        android:text="Activity切换动画" />

    <Button
        android:id="@+id/button2"
        style="@style/AppTheme.Button.Green"
        android:onClick="onButtonClick"
        android:text="Button放大动画" />

    <Button
        android:id="@+id/button3"
        style="@style/AppTheme.Button.Green"
        android:onClick="onButtonClick"
        android:text="LayoutAnimation" />

</com.hnucm.chapter7_1.ui.RevealLayout>
```
当然也可以通过Java代码指定
```java
ListView listView = (ListView) layout.findViewById(R.id.list);
Animation animation = AnimationUtils.loadAnimation(this, R.anim.anim_item);
LayoutAnimationController controller = new LayoutAnimationController(animation);
controller.setDelay(0.5f);
controller.setOrder(LayoutAnimationController.ORDER_NORMAL);
listView.setLayoutAnimation(controller);
```
![1.gif](http://starrylixu.oss-cn-beijing.aliyuncs.com/b75714fbd56d367f1e1522572fc37149.gif)![b7de457b-3675-4e7f-871a-d9db9c2789ce.gif](http://starrylixu.oss-cn-beijing.aliyuncs.com/660963bd2e5e95431b433c116d2509b8.gif)![1.gif](http://starrylixu.oss-cn-beijing.aliyuncs.com/92a4690d1cf041beb6207d3f09adabfe.gif)![1.gif](http://starrylixu.oss-cn-beijing.aliyuncs.com/30782712f1c6ad9b11a03b1d0e93aba2.gif)
## Activity的切换效果
主要用到`overridePendingTransition(R.anim.enter_anim, R.anim.exit_anim);`方法。
注意：这个方法必须在startActivity或者finish()之后被调用。

- enterAnim   ->  Activity被打开时所需要的动画资源id
- exitAnim  ->  Activity被暂停时，所需要的动画资源id

启动Activity时，添加自定义的切换效果
```java
Intent intent = new Intent(this, TestActivity.class);
startActivity(intent);
overridePendingTransition(R.anim.enter_anim, R.anim.exit_anim);
```
当Activity退出时，指定自定义的切换效果。
```java
public void finish() {
    super.finish();
    overridePendingTransition(R.anim.enter_anim, R.anim.exit_anim);
}
```
Fragment也可以添加切换动画（API  11）中引入，需要考虑兼容性问题。通过FragmentTransaction中的setCustomAnimations()方法来添加切换动画。
# 属性动画
[属性动画概览 | Android 开发者 | Android Developers](https://developer.android.google.cn/guide/topics/graphics/prop-animation?hl=zh-cn)
[Android属性动画,看完这篇够用了吧](https://zhuanlan.zhihu.com/p/264929902)
## 使用属性动画
属性动画是API  11新加入的特性。属性动画可以对**任何对象**做动画，极其灵活可以实现一些四种简单变换之外的动画。
常用的动画类：

- ObjectAnimator
- ValueAnimator
- AnimatorSet

开发中建议**使用代码实现属性动画**。
## 理解插值器和估值器
TimeInterpolator  时间插值器  ：根据时间流逝的百分比来计算出当前属性值改变的百分比。

- 线性插值器  LinearInterpolator   匀速动画
- AcclerateDecelerateInterpolator   加减速插值器
- DecelerateInterpolator   减速插值器
- AccelerateInterpolator 持续加速
- OvershootInterpolator 结束时回弹一下
- AnticipateInterpolator 开始回拉一下
- BounceInterpolator 结束时Q弹一下
- CycleInterpolator 来回循环

TypeEvaluator   类型估值器   ：根据当前属性改变的百分比来计算改变后的属性值

- IntEvaluator：针对整型属性
- FloatEvaluator：针对浮点型属性
- ArgbEvaluator：针对Color属性

自定义插值器：需要实现IntEvaluator或者TimeInterpolator 
自定义估值器：需要实现TypeEvaluator  
## 属性动画的监听器
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/be0f892d2f7827e45a2953e290c33081.png)
属性动画提供了监听器用于监听动画的播放过程。

- AnimatorUpdateListener：每播放一帧都会被调用一次
- AnimatorListener
```java
//Animator.AnimatorListener
public static interface AnimatorListener {

       
        default void onAnimationStart(Animator animation, boolean isReverse) {
            onAnimationStart(animation);
        }

        
        default void onAnimationEnd(Animator animation, boolean isReverse) {
            onAnimationEnd(animation);
        }

        void onAnimationStart(Animator animation);

        void onAnimationEnd(Animator animation);

        void onAnimationCancel(Animator animation);

        void onAnimationRepeat(Animator animation);
    }
```
```java
//ValueAnimator.AnimatorUpdateListener
public static interface AnimatorUpdateListener {
        void onAnimationUpdate(ValueAnimator animation);

    }
```
## 对任意属性做动画
属性动画原理：要求动画作用的对象提供该属性的get和set方法，属性动画根据外界传递的该属性的初始值和最终值，随着时间推移多次调用set方法实现动画
属性动画生效的两个条件：

- 对象必须提供set方法，如果动画没有传递初始值，还需要提供get方法，因为系统需要去取对象属性的初始值
- 对象的set方法对属性做的改变必须能够通过某种方法反映出来，比如UI的改变。

如果对象属性没有set方法如何解决？

1. 给对象加上set、get方法。如果是系统对象，不能修改SDK，有限制。
2. 用一个类包装原始对象，间接为其提供get和set方法。
3. 采用ValueAnimator，监听动画过程，自己实现属性的改变

Button继承自TextView，其setWidth方法，并不是设置View的宽度，而是设置TextView的最大和最小宽度。
```java
@android.view.RemotableViewMethod
    public void setWidth(int pixels) {
        mMaxWidth = mMinWidth = pixels;
        mMaxWidthMode = mMinWidthMode = PIXELS;

        requestLayout();
        invalidate();
    }
```
因此要实现button的宽度的属性动画，我们需要解决set方法的问题。
这里有一个问题，我直接使用如下代码也能改变button的宽度，不知为何
```java
public void onClick(View v){
        if(v==mButton){
            ObjectAnimator.ofInt(mButton,"width",500).setDuration(5000).start();
//            performAnimation();
        }
    }
```
```java
//2.用一个类包装原始对象，间接为其提供get和set方法。
    public void onClick(View v){
        if(v==mButton){
            ObjectAnimator.ofInt(mButton,"width",500).setDuration(5000).start();
//            performAnimation();
        }
    }
    private void performAnimation() {
        ViewWrapper viewWrapper=new ViewWrapper(mButton);
        ObjectAnimator.ofInt(viewWrapper,"width",mButton.getWidth(),500).setDuration(5000).start();
    }

    private static class ViewWrapper{
        private View mTarget;
        public ViewWrapper(View target){
            mTarget=target;
        }
        public int getWidth(){
            return mTarget.getLayoutParams().width;
        }
        public void setWidth(int width){
            mTarget.getLayoutParams().width=width;
            mTarget.requestLayout();
        }
    }
```

```java
    3.采用ValueAnimator，监听动画过程，自己实现属性的改变
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            Button button = (Button)findViewById(R.id.button1);
            performAnimate(button, button.getWidth(), 500);
        }
    }

    Animation.AnimationListener listener;
    Animator.AnimatorListener listener1;
    ValueAnimator.AnimatorUpdateListener animatorUpdateListener;

    private void performAnimate(final View target, final int start, final int end) {
        ValueAnimator valueAnimator = ValueAnimator.ofInt(1, 100);
        valueAnimator.addUpdateListener(new AnimatorUpdateListener() {

            // 持有一个IntEvaluator对象，方便下面估值的时候使用
            private IntEvaluator mEvaluator = new IntEvaluator();

            @Override
            public void onAnimationUpdate(ValueAnimator animator) {
                // 获得当前动画的进度值，整型，1-100之间
                int currentValue = (Integer) animator.getAnimatedValue();
                Log.d(TAG, "current value: " + currentValue);

                // 获得当前进度占整个动画过程的比例，浮点型，0-1之间
                float fraction = animator.getAnimatedFraction();
                // 直接调用整型估值器通过比例计算出宽度，然后再设给Button
                target.getLayoutParams().width = mEvaluator.evaluate(fraction, start, end);
                target.requestLayout();
            }
        });

        valueAnimator.setDuration(5000).start();
    }
```
## 属性动画工作原理
这一部分的源码变化较大，待进一步研究
ObjectAnimator继承了ValueAnimator
### ObjectAnimator#start
```java
@Override
    public void start() {
        AnimationHandler.getInstance().autoCancelBasedOn(this);
        if (DBG) {
            Log.d(LOG_TAG, "Anim target, duration: " + getTarget() + ", " + getDuration());
            for (int i = 0; i < mValues.length; ++i) {
                PropertyValuesHolder pvh = mValues[i];
                Log.d(LOG_TAG, "   Values[" + i + "]: " +
                    pvh.getPropertyName() + ", " + pvh.mKeyframes.getValue(0) + ", " +
                    pvh.mKeyframes.getValue(1));
            }
        }
        super.start();
    }
```
### ValueAnimator#start
```java
private void start(boolean playBackwards) {
        if (Looper.myLooper() == null) {
            throw new AndroidRuntimeException("Animators may only be run on Looper threads");
        }
        mReversing = playBackwards;
        mSelfPulse = !mSuppressSelfPulseRequested;
        // Special case: reversing from seek-to-0 should act as if not seeked at all.
        if (playBackwards && mSeekFraction != -1 && mSeekFraction != 0) {
            if (mRepeatCount == INFINITE) {
                // Calculate the fraction of the current iteration.
                float fraction = (float) (mSeekFraction - Math.floor(mSeekFraction));
                mSeekFraction = 1 - fraction;
            } else {
                mSeekFraction = 1 + mRepeatCount - mSeekFraction;
            }
        }
        mStarted = true;
        mPaused = false;
        mRunning = false;
        mAnimationEndRequested = false;
        // Resets mLastFrameTime when start() is called, so that if the animation was running,
        // calling start() would put the animation in the
        // started-but-not-yet-reached-the-first-frame phase.
        mLastFrameTime = -1;
        mFirstFrameTime = -1;
        mStartTime = -1;
        addAnimationCallback(0);

        if (mStartDelay == 0 || mSeekFraction >= 0 || mReversing) {
            // If there's no start delay, init the animation and notify start listeners right away
            // to be consistent with the previous behavior. Otherwise, postpone this until the first
            // frame after the start delay.
            startAnimation();
            if (mSeekFraction == -1) {
                // No seek, start at play time 0. Note that the reason we are not using fraction 0
                // is because for animations with 0 duration, we want to be consistent with pre-N
                // behavior: skip to the final value immediately.
                setCurrentPlayTime(0);
            } else {
                setCurrentFraction(mSeekFraction);
            }
        }
    }
```
# 使用动画的注意事项
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/7316b4d2b43826135f0de3cd3ac8bdec.png)
