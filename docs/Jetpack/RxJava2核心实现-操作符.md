非常好的一个课程：<br />[43-RxLifecycle手写实现_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1H54y1j7uN/?p=43&spm_id_from=pageDriver&vd_source=2c2d0ce64b817501491ef975f77fea05)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1696512058009-c9ff6c3c-bd88-4dac-aa56-4a76b71e3780.png#averageHue=%23e5e4de&clientId=u4cc19069-1665-4&from=paste&height=121&id=u45c35e32&originHeight=182&originWidth=547&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=56548&status=done&style=none&taskId=ue1e8211f-9d1a-4ddf-82cc-2ef94e0125d&title=&width=364.6666666666667)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1696518074588-ce70ba29-0435-4be3-a5dd-bdb0351f8199.png#averageHue=%23e7e7e7&clientId=u1a90049e-899d-4&from=paste&height=176&id=ub4c81888&originHeight=264&originWidth=1097&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=126182&status=done&style=none&taskId=uc31f644e-5966-4d6a-9594-c742deb0fa3&title=&width=731.3333333333334)
<a name="DLntd"></a>
# 观察者模式
主要有两个角色，观察者和被观察者， 被观察者会有一个持有观察者的引用的列表，通过遍历这个列表去依次调用观察者的方法，通知观察者做出响应。例如UI控件的点击事件也可以看成是一种观察者模式。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1696518103579-be241f35-14f7-48b1-b6f8-e9f0871c7dec.png#averageHue=%23f4f2f2&clientId=u1a90049e-899d-4&from=paste&height=303&id=u901d518d&originHeight=454&originWidth=1111&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=224680&status=done&style=none&taskId=ud05ded57-e306-45c8-b3c7-f0c9e3f665c&title=&width=740.6666666666666)

RxJava中的观察者是一种**变种的观察者模式**，将被观察者和事件解耦，被观察者是ObservableSource，但是事件是Emitter，最终由它的实现类CreateEmitter通知观察者列表，通过将被观察者和事件解耦，由事件去驱动观察者做出响应。<br />CreateEmitter持有一个观察者列表，它发送事件时，可以直接调用观察者来对事件做出处理<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1696518207856-8879d78a-1eb0-4fb5-b33a-faf74d60a9a7.png#averageHue=%23f5f5f5&clientId=u1a90049e-899d-4&from=paste&height=305&id=u9b771edf&originHeight=457&originWidth=742&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=104111&status=done&style=none&taskId=u24308a70-1d13-4088-af07-619f8e93fce&title=&width=494.6666666666667)

- ObservableSource：被观察者的顶层接口，其中提供一个订阅方法subscribe()，通过这个方法建立被观察者和观察者间的联系，相当于标准观察模式中的addObserver()方法。
- Observer：观察者接口，提供处理事件的回调方法，以及建立订阅关系时候会默认调用的方法onSubscribe()
- Observable：被观察者抽象类，虽然并不是具体的被观察者，但是是RxJava框架的入口。继承顶层ObservableSource接口并实现其中的订阅方法subscribe()，但是这个方法并不是先具体和哪一个观察者建立订阅，而是提供一个抽象的方法subscribeActual()，供开发者去实现，让开发指定具体的观察者。
- Emitter：事件发射器的接口，提供发送事件的方法。被观察者和观察者虽然建立订阅关系了，但是并没有事件，那么事件就有Emitter定义，并且通过一个接口和被观察者建立联系
- ObservableOnSubscribe：被观察者和事件建立建立联系的接口
- ObservableXXXX：具体的被观察者实现类，持有ObservableOnSubscribe接口的引用。在subscribeActual方法中调用观察者的订阅方法，并创建具体的发射器实例，最后事件发射器实例和被观察者绑定
- XXXEmitter：事件发射器的具体实现，持有观察者的引用

![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1696520033747-25419a19-28dd-416b-8711-fd9f61fcc1cd.png#averageHue=%23f6f5f5&clientId=u1a90049e-899d-4&from=paste&height=317&id=u31ef60bf&originHeight=475&originWidth=1085&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=279017&status=done&style=none&taskId=u84ce8f47-949c-4b2d-9739-d461f161e3f&title=&width=723.3333333333334)

<a name="dZalr"></a>
## 手写观察者模式
<a name="ln7ua"></a>
### ObservableSource
```java
public interface ObservableSource<T> {
    /**
     * 相当于标准的观察者模式中的addObserver方法
     * @param observer
     */
    void subscribe(Observer observer);
}
```
<a name="RzVVc"></a>
### Observer
```java
public interface Observer<T> {

    //建立订阅关系时候会默认调用的方法
    void onSubscribe();

    //使用泛型，因为事件的类型是不确定的
    void onNext(T t);

    void onComplete();

    void onError(Throwable throwable);
}
```

<a name="qxJAJ"></a>
### Observable
```java
public abstract class Observable<T> implements ObservableSource<T>{

    /**
     * 实现顶层的订阅方法建立订阅关系
     * 但是并不解决一下问题：
     * 具体和哪一个观察者建立订阅？
     * 怎么建立订阅？
     * 而是将这些交给开发人员去做，提供一个抽象方法，保证扩展性
     * @param observer
     */
    @Override
    public void subscribe(Observer observer) {

        //注意这里并没有指定具体和谁建立订阅，而是调用了一个抽象方法
        subscribeActual(observer);
    }

    /**
     * 提供一个抽象方法，供开发者去实现
     * @param observer
     */
    protected abstract void subscribeActual(Observer observer);

    /**
     * create操作符
     */
    public static <T> Observable<T> create(ObservableOnSubscribe<T> source){
        //返回一个具体的被观察者
        return new ObservableCreate<>(source);
    }
}
```
<a name="HhMx2"></a>
### Emitter
```java
public interface Emitter<T> {

    void onNext(T t);

    void onComplete();

    void onError(Throwable throwable);
}

```

<a name="bRQtc"></a>
## 手写create操作符

<a name="EVaCM"></a>
### 具体被观察者create操作符
```java
public class ObservableCreate<T> extends Observable<T> {

    //持有ObservableOnSubscribe的引用，并构造传入
    final ObservableOnSubscribe<T> source;
    public ObservableCreate(ObservableOnSubscribe<T> source) {
        this.source = source;
    }

    @Override
    protected void subscribeActual(Observer observer) {
        //建立订阅的时候调用
        observer.onSubscribe();
        //创建具体的发射器实例，并闯入具体的事件T，和具体的观察者
        CreateEmitter<T> emitter=new CreateEmitter<T>(observer);
        //最好还需要将事件和被观察者绑定在一起
        source.subscribe(emitter);
    }

    /**
     * 具体的事件发射器，实现Emitter接口
     *
     * @param <T>
     */
    static class CreateEmitter<T> implements Emitter<T> {
        //持有观察者的引用，在Emitter接口的方法中调用观察者的对应回调接口
        Observer<T> observer;
        boolean done;

        public CreateEmitter(Observer<T> observer) {
            this.observer = observer;
        }

        @Override
        public void onNext(T t) {
            if(done)return;
            observer.onNext(t);
        }

        @Override
        public void onComplete() {
            if (done)return;
            observer.onComplete();
            done=true;
        }

        @Override
        public void onError(Throwable throwable) {
            if (done)return;
            observer.onError(throwable);
        }
    }
}

```
<a name="JiXg6"></a>
### Observable
```java
public abstract class Observable<T> implements ObservableSource<T>{

    ···

    /**
     * create操作符
     */
    public static <T> Observable<T> create(ObservableOnSubscribe<T> source){
        //返回一个具体的被观察者
        return new ObservableCreate<>(source);
    }
}
```

<a name="KyGXd"></a>
### 具体使用
```java
public static void main(String[] args) {
    Observable.create(new ObservableOnSubscribe<Object>() {
        @Override
        public void subscribe(Emitter<Object> emitter) {
            emitter.onNext("111");
            emitter.onNext("222");
            emitter.onNext("333");
        }
    }).subscribe(new Observer() {
        @Override
        public void onSubscribe() {
            System.out.println("onSubscribe");
        }

        @Override
        public void onNext(Object o) {
            System.out.println("onNext"+o.toString());
        }

        @Override
        public void onComplete() {
            System.out.println("onComplete");
        }

        @Override
        public void onError(Throwable throwable) {
            System.out.println("onError");
        }
    });
}
```
<a name="eMb5s"></a>
# 装饰器模式
通过继承实现扩展带来的问题，继承扩展功能会导致子类的数量剧增，并且上层父类的功能变化，会对所有的子类产生影响，有时候这并不是好事。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1696518954398-71fa5d22-4ec3-4851-9dcb-eabbe8e56cab.png#averageHue=%23ededed&clientId=u1a90049e-899d-4&from=paste&height=309&id=u12eb949f&originHeight=464&originWidth=893&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=54095&status=done&style=none&taskId=u9352b6a5-c8c0-44a2-8da2-1ec4bd3b59c&title=&width=595.3333333333334)<br />通过组合代替继承去扩展功能，这就是装饰者模式。<br />例如有一个炒粉父类，现在需要扩展功能得到鸡蛋炒粉，使用继承我们创建了一个鸡蛋炒粉的子类，如果需要在鸡蛋炒粉的功能上扩展，我们又要创建一个子类火腿鸡蛋炒粉，这样可能导致一条很深或者很大的继承树。<br />使用装饰器模式可以解决这个问题，其中具体构件角色和抽象装饰角色拥有共同的父类，并且抽象装饰角色持有**共同父类**的引用，基于注入的构件去派生子类扩展功，这样继承树的结构就只有两层。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1696518980901-772c99db-eb31-4bc0-ba98-24d299837f1c.png#averageHue=%23f8f8f8&clientId=u1a90049e-899d-4&from=paste&height=337&id=ud499d6cd&originHeight=505&originWidth=1078&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=192539&status=done&style=none&taskId=u07de49e1-9f0f-4bce-91d4-fe5ccd895b7&title=&width=718.6666666666666)
<a name="pQmH5"></a>
## 手写装饰器模式
框架基于create操作符，扩展了很多其他的操作符。并且这些操作符都是一个Observable的子类，所以很容易就理清楚结构<br />抽象构件角色：Observable<br />抽象装饰者角色：AbstractObservableWithUpStream<br />具体构件角色：ObservableCreate<br />具体装饰者角色：ObservableMap
<a name="NN8FQ"></a>
## 手写map操作符
<a name="pe6mP"></a>
### 抽象装饰者角色
其中source是需要被装饰的对象
```java
public abstract class AbstractObservableWithUpStream<T, U> extends Observable<U> {
    //本身也是一个抽象类所以无需实现Observable下的subscribeActual方法
    //并且是去扩展功能，可能会出现类型转换，所以需要指定两类泛型
    //持有被观察者的引用
    protected final ObservableSource source;

    protected AbstractObservableWithUpStream(ObservableSource source) {
        this.source = source;
    }
}

```
<a name="dOagi"></a>
### 具体构件角色
```java
public class ObservableMap<T, U> extends AbstractObservableWithUpStream<T, U> {

    //用于实现类型转换的接口
    Function<T,U> function;

    //这里的source就是需要被装饰的对象
    protected ObservableMap(ObservableSource source,Function<T,U> function) {
        super(source);
        this.function=function;
    }

    //具体的被观察者map，·不再像create一样继承Observable，而是继承抽象装饰类
    //因此Observable相当于标准装饰器模式中的抽象构件
    //而ObservableCreate是具体的构建，接下来的其他被观察者都是基于Create扩展功能得到的
    @Override

    protected void subscribeActual(Observer observer) {
        //并不能直接调用observer，因为需要对事件做一些处理
        //被装饰的对象调用扩展的功能，MapObserver就是在实现扩展功能
        source.subscribe(new MapObserver(observer,function));

    }

    static class MapObserver<T,U> implements Observer<T>{

        //将下游的观察者以及用来做类型转换的接口构造注入
        final Observer<U> downStream;//注意这里的泛型，因为需要发射的是转换后的事件，所以泛型是U
        final Function<T,U> mapper;

        MapObserver(Observer<U> downStream, Function<T, U> mapper) {
            this.downStream = downStream;
            this.mapper = mapper;
        }

        @Override
        public void onSubscribe() {
            //这里不再需要去实现，因为create操作符（被装饰者）完成了订阅
            //但是还是需要主动调用
            downStream.onSubscribe();
        }

        @Override
        public void onNext(T t) {
            //map的核心操作
            //1.首先对时间做转换
            U u=mapper.apply(t);
            //2.然后由下游的观察者去发射事件
            downStream.onNext(u);
        }

        @Override
        public void onComplete() {
            downStream.onComplete();
        }

        @Override
        public void onError(Throwable throwable) {
            downStream.onError(throwable);
        }
    }
}

/**
 * 用于类型转换的接口，将T类型的事件转换为R类型
 * @param <T>
 * @param <R>
 */
public interface Function<T, R> {
    R apply(T t);
}


```

<a name="jyqnY"></a>
## 手写flatMap操作符
<a name="MWzfa"></a>
### 具体装饰者
同样是继承抽象装饰者`**AbstractObservableWithUpStream**`，然后将将需要装饰的对象注入`**ObservableSource<T> source**`和类型转换的接口实例，不同的是转换接口需要做的是**将类型为T的事件转换为一个观察者类型，最后**在onNext方法中通过function接口将事件T转换为`**ObservableSource<U>**`类型，然后再由这个新的观察者去调用onNext方法去发射事件u
```java
public class ObservableFlatMap<T,U> extends AbstractObservableWithUpStream<T,U>{

    //这里不同的是，flatMap是将类型为T的事件转换为一个观察者类型
    //所以第二个泛型是ObservableSource<U>
    Function<T,ObservableSource<U>> function;

    protected ObservableFlatMap(ObservableSource<T> source,Function<T,ObservableSource<U>> function) {
        super(source);
        this.function=function;
    }

    //同样的这个source就是上游的被观察者，需要被装饰的对象
    @Override
    protected void subscribeActual(Observer<U> observer) {
        source.subscribe(new MergeObserver(function,observer));
    }


    static class MergeObserver<T,U> implements Observer<T>{

        final Function<T,ObservableSource<U>> mapper;
        final Observer<U> downStream;

        MergeObserver(Function<T, ObservableSource<U>> mapper, Observer<U> downStream) {
            this.mapper = mapper;
            this.downStream = downStream;
        }


        @Override
        public void onSubscribe() {
            downStream.onSubscribe();
        }

        //核心在这里，首先通过mapper将事件t转换为一个被观察者
        //然后由这个，新的被观察者去发射事件
        @Override
        public void onNext(T t) {
            ObservableSource<U> observable=mapper.apply(t);
            observable.subscribe(new Observer<U>() {
                @Override
                public void onSubscribe() {

                }

                @Override
                public void onNext(U u) {
                    downStream.onNext(u);
                }

                @Override
                public void onComplete() {

                }

                @Override
                public void onError(Throwable throwable) {

                }
            });
        }

        @Override
        public void onComplete() {
            downStream.onComplete();
        }

        @Override
        public void onError(Throwable throwable) {
            downStream.onError(throwable);
        }
    }
}

```


