原文链接：[https://developer.android.google.cn/guide/fragments/create](https://developer.android.google.cn/guide/fragments/create)
# 创建一个Fragment类
创建一个Fragment碎片的方法与Activity的使用类似，不过需要继承AndroidX Fragment 类，然后将片段的布局资源提供给基础构造函数
```java
class ExampleFragment extends Fragment {
    public ExampleFragment() {
        super(R.layout.example_fragment);
    }
}
```
Fragment库还提供了更专门的片段基类:
[DialogFragment](https://developer.android.google.cn/reference/androidx/fragment/app/DialogFragment)：
显示浮动对话框。 使用此类创建对话框是使用 Activity 类中的对话框帮助器方法的一个很好的替代方法，因为片段会自动处理对话框的创建和清理。 有关详细信息，请参阅使用 DialogFragment 显示对话框。
[PreferenceFragmentCompat](https://developer.android.google.cn/reference/androidx/preference/PreferenceFragmentCompat)：
将 Preference 对象的层次结构显示为列表。 您可以使用 PreferenceFragmentCompat 为您的应用程序创建设置屏幕。
# 添加Fragment到Activity中
通常，您的片段必须嵌入到 AndroidX FragmentActivity 中，以便为该活动的布局贡献一部分 UI。 FragmentActivity 是 AppCompatActivity 的基类，因此如果您已经子类化 AppCompatActivity 以在您的应用程序中提供向后兼容性，那么您不需要更改活动基类。

您可以通过在活动的布局文件中定义片段（静态使用）或在活动的布局文件中定义片段容器（动态使用），然后以编程方式从活动中添加片段，将片段添加到活动的视图层次结构中。 在任何一种情况下，您都需要添加一个 FragmentContainerView 来定义片段在 Activity 的视图层次结构中的放置位置。 强烈建议始终使用 FragmentContainerView 作为片段的容器，因为 FragmentContainerView 包含特定于片段的修复，而其他视图组（例如 FrameLayout）不提供。
## 静态添加
静态添加直接在xml布局中添加
```xml
<!-- res/layout/example_activity.xml -->
<androidx.fragment.app.FragmentContainerView
  xmlns:android="http://schemas.android.com/apk/res/android"
  android:id="@+id/fragment_container_view"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:name="com.example.ExampleFragment" />
```
android:name 属性指定要实例化的 Fragment 的类名。 当活动的布局inflated时，指定的片段被实例化，在新实例化的片段上调用 onInflate()，并创建 FragmentTransaction 以将片段添加到 FragmentManager。

## 动态添加
要以编程方式将片段添加到Activity的布局中，布局应包含FragmentContainerView作为片段容器，如以下示例所示:这一次我们并没有用name属性指定具体哪一个Fragment哦
```xml
<!-- res/layout/example_activity.xml -->
<androidx.fragment.app.FragmentContainerView
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/fragment_container_view"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```
与XML方法不同，此处未在FragmentContainerView上使用android:name属性，因此**不会自动实例化特定片段**。相反，我们会通过一个**FragmentTransaction**用于实例化片段并将其添加到Activity的布局中。
当您的活动正在运行时，您可以进行片段事务处理，例如添加、删除或替换片段。 在您的 FragmentActivity 中，您可以获得 FragmentManager 的一个实例，该实例可用于创建 FragmentTransaction。 然后，您可以使用 FragmentTransaction.add() 在 Activity 的 onCreate() 方法中实例化片段，传入布局中容器的 ViewGroup ID 和要添加的片段类，然后提交事务，如 以下示例：
```java
public class ExampleActivity extends AppCompatActivity {
    public ExampleActivity() {
        super(R.layout.example_activity);
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                .setReorderingAllowed(true)
                .add(R.id.fragment_container_view, ExampleFragment.class, null)
                .commit();
        }
    }
}
```
> 注意：在执行FragmentTransaction时，应该始终使用setReorderingAllowed（true）。有关重新排序事务的详细信息，请参阅片段事务。
> 例如，如果您有一个包含多个Fragment的Activity，并且您希望这些Fragment在屏幕方向或大小发生变化时重新排列以适应新的屏幕大小，则可以将**setReorderingAllowed**设置为**true**。这将允许Android自动重新排列Fragment以适应新的屏幕大小。

在前面的示例中，请注意片段事务仅在 savedInstanceState 为 null 时创建。 这是为了确保在首次创建活动时仅添加一次片段。 当发生配置更改并重新创建活动时，savedInstanceState 不再为 null，并且不需要再次添加片段，因为片段会自动从 savedInstanceState 恢复。

如果您的片段需要一些初始数据，可以通过在FragmentTransaction.add（）调用中提供Bundle将参数传递给片段，如下所示:（这也是我们常用的从Activity中传递数据到Fragment中的一种方式）
```java
public class ExampleActivity extends AppCompatActivity {
    public ExampleActivity() {
        super(R.layout.example_activity);
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (savedInstanceState == null) {
            Bundle bundle = new Bundle();
            bundle.putInt("some_int", 0);

            getSupportFragmentManager().beginTransaction()
                .setReorderingAllowed(true)
                .add(R.id.fragment_container_view, ExampleFragment.class, bundle)
                .commit();
        }
    }
}
```
然后可以通过调用requireArguments（）从片段中检索参数Bundle，并且可以使用适当的Bundle getter方法来检索每个参数。
```java
class ExampleFragment extends Fragment {
    public ExampleFragment() {
        super(R.layout.example_fragment);
    }

    @Override
    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        int someInt = requireArguments().getInt("some_int");
        ...
    }
}
```
