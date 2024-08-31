# Activity传递数据到Fragment
## 静态添加（fragment已经添加到Activity）

1. 在Fragment中设置setValue,getValue方法，
2. 在activity中获取Fragment对象，fragment.setValue()
3. 在Fragment中getValue()
```java
//Activity中
blankFragment=(BlankFragment) getSupportFragmentManager()
            .findFragmentById(R.id.fragment_view);
blankFragment.setValue("静态加载传递数据");
```
```java
//fragment中
public void setValue(String value){
    mParam=value;
}

public String getValue(){
    return mParam;
}

textView.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        textView.setText(getValue());
    }
});
```
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/cfd94e780e42a79fb44ceed13074f77d.png)
## 动态创建（fragment还没有添加）

1. 在Activity中建一个bundle，把要传的值存入bundle，然后通过fragment的setArguments（bundle）传到fragment
2. 在fragment中用getArguments接收
```java
//Activity中
BlankFragment blankFragment=new BlankFragment();
Bundle bundle=new Bundle();
bundle.putString("key","动态创建传递的值");
blankFragment.setArguments(bundle);
getSupportFragmentManager()
        .beginTransaction()
        .replace(R.id.fragment_view,blankFragment,null)
        .addToBackStack("blank")
        .commit();
```
```java
//fragment中
@Override
public void onCreate(Bundle savedInstanceState) {
    Log.i(TAG, "onCreate: "+hashCode());
    if (getArguments()!=null){
        mParam=getArguments().getString("key");
    }
    super.onCreate(savedInstanceState);

}

//在需要使用的地方使用
@Override
public View onCreateView(LayoutInflater inflater, ViewGroup container,
                         Bundle savedInstanceState) {
    Log.i(TAG, "onCreateView: "+hashCode());
    View view=inflater.inflate(R.layout.fragment_blank, container, false);
    TextView textView=(TextView)view.findViewById(R.id.fragment_tv);
    textView.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            textView.setText(mParam);
        }
    });
    return view;
}
```
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/306ff722c914d8b8af32d0f1f4cbd7e8.png)
# Fragment传递数据到Activity
## 接口回调

1. 定义回调接口
2. 接收方实现接口，以及具体的回调函数
3. 发送方执行回调函数发送数据（在onAttach中获取到Activity，在onDetach中置空避免内存泄露）
4. 接受方接受数据
```java
public interface InteractListener {
    void onInteractListener(String data);
}
```
```java
public class MainActivity extends AppCompatActivity implements InteractListener {
@Override
    public void onInteractListener(String data) {
        Toast.makeText(this,data,Toast.LENGTH_SHORT).show();
    }
}
```
```java
@Override
public void onAttach(@NonNull Context context) {
    Log.i(TAG, "onAttach: "+hashCode());
    if (context instanceof InteractListener){
        mListener= (InteractListener) context;
    }else{
        throw new RuntimeException(context.toString()+"must implement InteractListener");
    }
    super.onAttach(context);

}

@Override
public View onCreateView(LayoutInflater inflater, ViewGroup container,
                         Bundle savedInstanceState) {
    Log.i(TAG, "onCreateView: "+hashCode());
    View view=inflater.inflate(R.layout.fragment_blank, container, false);
    TextView textView=(TextView)view.findViewById(R.id.fragment_tv);
    textView.setOnClickListener(v -> {
        mListener.onInteractListener("fragment发送的数据");
    });
    return view;
}

@Override
public void onDetach() {
    super.onDetach();
    mListener = null;
}
```
理解回调函数 回调函数分为接口、发送方与接收方。
1、定义接口：定义接口回调函数
2、接收方实现接口：接收方通过implements实现接口，并在回调函数中实现具体业务
3、发送方执行回调函数发送数据：发送方获取实现接口的接收方，并在某个事件（如点击事件）中调用回调方法发送数据
4、接收方接受数据： 此时接收方的回调方法被执行，收到了发送方的数据

# Fragment之间传递数据
## 通过FragmentManager
两个Fragment之间传递数据，其实主要解决的问题是如何在AFragment中获取到BFragemnt，这样我们就可以在AFragment中通过调用BFragment中的方法，将值传递到BFragment中。
我们可以通过每个Fragment的标签获取到Fragment实例，从而可以调用具体的方法传递数据
```java
//AFragment中
BFragment mainFragment =
   (MainFragment) getActivity()
   .getSupportFragmentManager()
   .findFragmentByTag("BFragment");
BFragment.setData("具体数据");
```
## 采用接口回调

1. 创建一个接口并定义数据传输的抽象方法
2. 

