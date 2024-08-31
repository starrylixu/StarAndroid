# 简介
MPAndroidChart是一个Android原生实现的图标库，可以实现常见的折线图、柱状图、雷达图、饼图等效果。
具体可以实现哪些图表，每种图表的效果如何，可以详看官网地址
官网地址：[https://github.com/PhilJay/MPAndroidChart](https://github.com/PhilJay/MPAndroidChart)
引入依赖：
```groovy
repositories {
    maven { url 'https://jitpack.io' }
}

dependencies {
    implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'
}
```
定义布局
```groovy
   <com.github.mikephil.charting.charts.LineChart
    android:id="@+id/chart"
    android:layout_width="match_parent"
    android:layout_height="240dp" />
```
# 折线图
本文记录以下如何使用此框架实现折线图，一副折线图我暂且将其分为

1. x轴，
2. y轴（分左边y轴和右边y轴）
3. 图表内容样式
4. 图标中的数据

四个部分组成，因此我们在设置一副图表时需要对这些部分一一设置样式。
![](/images/471edc2494bedb995c5e3fe015baf5c7.png)
## 设置图例属性
设置图例的形状
```groovy
chart.legend.form = Legend.LegendForm.CIRCLE //设置图例的形状为圆形。
```
```java
public static enum LegendForm {
    NONE,
    EMPTY,
    DEFAULT,
    SQUARE,
    CIRCLE,
    LINE;

    private LegendForm() {
    }
}
```
其下`chart`代表就是我们的折线图图表实例对象
```groovy
chart.clear()//清除图表中的所有数据和设置。
chart.legend.textColor = black //设置图例的文本颜色为黑色
chart.legend.form = Legend.LegendForm.CIRCLE //设置图例的形状为圆形。
chart.legend.verticalAlignment = Legend.LegendVerticalAlignment.BOTTOM//
chart.legend.horizontalAlignment = Legend.LegendHorizontalAlignment.CENTER
chart.legend.orientation = Legend.LegendOrientation.HORIZONTAL
chart.setNoDataText("没有数据")

//是否显示边界
chart.setDrawBorders(false)
// 没有描述的文本
chart.description.isEnabled = false
// 支持触控手势
chart.setTouchEnabled(true)
chart.setDragDecelerationFrictionCoef(0.9f)
// 支持缩放和拖动
chart.setDragEnabled(false)
chart.setScaleEnabled(false)
chart.setDrawGridBackground(false)
chart.isHighlightPerDragEnabled = true
// 如果禁用,扩展可以在x轴和y轴分别完成
chart.setPinchZoom(true)
// 设置背景颜色(灰色)
chart.setBackgroundColor(Color.WHITE)
//默认x动画
chart.animateX(500)

chart.extraLeftOffset = 15f
chart.extraRightOffset = 15f
chart.legend.typeface = Typeface.createFromAsset(
    this@NewBabyGrowActivity.assets,
    Converts.FONT_PATH
)
```
