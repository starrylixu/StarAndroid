Drawable是一种可以在Canvas上进行绘制的抽象概念。
最常见的图片和颜色都可以是Drawable

1. Drawable的层级关系
2. Drawable的分类
3. 自定义Drawable（优点，简单比自定义View成本低）
# Drawable简介
Drawable常用来最为View的背景，通常是通过XML来定义。
Drawable的内部宽高参数比较重要，通过`getIntrinsicWidth`和`getIntrinsicHeight`方法获取。但这并不是Drawable真正的大小。比如因为作为View的背景时Drawable会被拉伸。
实际的区域大小（宽高）可以通过`getBounds`方法获得。
![image.png](/images/f9e97ebb73bb3d6948ed23939a6cadd2.png)
# Drawable的分类

1. BitmapDrawable  最简单的Drawable，表示一张图片
2. ShapeDrawable  通过颜色来构造的图形，分为纯色和渐变效果。
3. LayerDrawable  对应XML标签  <layer-list>  层次化的Drawable集合，多个Drawable的叠加效果。
4. StateListDrawable  对应<selector>标签  是一个Drawable集合 根据View的状态来选择合适的Drawable。主要用于设置可单击的View背景。例如导航栏的选中状态。
5. LevelListDrawable  对应<level-list>标签  是一个Drawable集合  可根据不同的等级切换对应的Drawable.
6. TransitionDrawable  对应<transition>标签  用于实现Drawable之间的淡入淡出。
7. InsetDrawable  对应<inset>标签  可以将其他Drawable内嵌到其中
8. ScaleDrawable  对应<scale>标签  根据自己的等级指定Drawable的缩放比例
9. ClipDrawable  对应于<clip>标签  根据自己的等级来裁剪另一个Drawable。
# 自定义Drawable
Drawable的使用范围：

- 作为ImageView的图像来显示
- 作为View的背景

自定义的Drawable无法再xml中使用。
