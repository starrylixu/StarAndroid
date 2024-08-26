[https://blog.csdn.net/qq_36486247/article/details/103959356](https://blog.csdn.net/qq_36486247/article/details/103959356)

- 将Fragment加载数据的逻辑放到onResume()方法中，这样就保证了Fragment可见时才会加载数据。
- 声明一个变量标记是否是首次执行onResume()方法，因为每次Fragment由不可见变为可见都会执行onResume()方法，需要防止数据的重复加载。
```java
public abstract class BaseFragment<VB  extends ViewDataBinding> extends Fragment {

    public VB mBinding;

    private boolean isFirstLoad=true;//是否第一次可见

    private String TAG="BaseFragment";

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        Log.d(TAG, "onCreateView: "+getClass().getSimpleName());
        Type superClass = getClass().getGenericSuperclass();
        Class<?> aClass=(Class<?>) ((ParameterizedType) superClass).getActualTypeArguments()[0];
        try {
            Method method=aClass.getDeclaredMethod("inflate",LayoutInflater.class,ViewGroup.class,boolean.class);
            mBinding=(VB)method.invoke(null,getLayoutInflater(),container,false);
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return mBinding.getRoot();
    }


    //用户可见时执行此方法
    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "onResume: "+getClass().getSimpleName());

        if(isFirstLoad){
            async();
            isFirstLoad=false;
        }
    }
    protected abstract void async();
}

```
