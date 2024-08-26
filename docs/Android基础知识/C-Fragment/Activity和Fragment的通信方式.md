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
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683366059748-4fd197e0-ca1f-4b8b-b00c-ea1416077a34.png#averageHue=%23d9d9d9&clientId=udf049f85-6022-4&from=paste&height=571&id=ueddc9120&originHeight=856&originWidth=420&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=58115&status=done&style=none&taskId=uacca6771-0750-4c8c-9fd6-0aeb40a6ef8&title=&width=280)
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
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1683366457118-9fda9da3-d2a8-4318-b98e-86e81a6fb1f5.png#averageHue=%23d8d8d8&clientId=udf049f85-6022-4&from=paste&height=571&id=u24eef9fd&originHeight=856&originWidth=420&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=56943&status=done&style=none&taskId=u7d0d8293-70a8-4d84-9e8e-66ab68a162d&title=&width=280)
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

