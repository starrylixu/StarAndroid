1. Dart是强类型还是弱类型的语言？
# 变量
## 弱类型
关键字：var，没有初始值可以是任何类型，一旦赋值，类型就确定了
object  动态任意类型，编译阶段检查类型
dynamic 动态任意类型，编译阶段不检查类型
## 强类型
声明类型，变量声明后，类型就确定了
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701341251542-9db8c141-c51b-4554-8a16-62d278b21528.png#averageHue=%23faf9f9&clientId=ue06ad408-d584-4&from=paste&height=468&id=uff5be49c&originHeight=468&originWidth=569&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22978&status=done&style=none&taskId=u88eaa315-40c6-4937-908b-fee38f51c74&title=&width=569)
变量的声明默认值都为null
## 动态类型优势
动态类型有什么优势呢？
### 简化变量定义
可以简化变量类型的定义，例如一个变量的类型不确定，可以声明为：
当然使用dynamic可以实现同样的效果
`Map<String,dynamic> map = <String, dynamic>{};`
`Map<String,Object> map = <String, Object>{};`
```java
void main() {
  var map = <String, dynamic>{};
  map['1']=1;
  map['2']="2";
  map['3']=2.13;
  map['4']=false;
  print(map['1']);
  print(map['2']);
  print(map['3']);
  print(map['4']);
}
//输出结果
1
2
2.13
false
```
### 参数定义
一个方法的入参可能不能确定，或者需要保证方法的扩展性，所有可以定义成动态类型参数。例如Api请求：
```java
  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic> queryParameters,
    ...
  });
```
# const和final
相同点

- 声明的类型可以省略
- 初始后不能在赋值
- 不能和var同时使用

不同点：

- const需要一个确定的值，例如

可以理解成const需要一个”编译时常量“，即所赋值的值在编译时就应当知道它的值
```java
final dt=DateTime.now();//正常
const dt2=DateTime.now();//编译报错
```

- const的不变性可传递
```java
final ls=[1,2,3];
ls[2]=99;//正常

const ls2=[1,2,3];
ls2[2]=99;//运行报错
```

- 内存中是否共用同一块地址

const修饰的对象，相同的内容，在内存中是指向同一块地址
final修饰的对象，相同的内容，在内存中指向的地址是不同的
注意：`identical` 通过比较两个引用的是否是同一个对象判断是否相等
```java
void main() {
 
  final f1=[1,2,3];
  final f2=[1,2,3];
  print(identical(f1,f2));//false
  
  const c1=[1,2,3];
  const c2=[1,2,3];
  print(identical(c1,c2));//true
}

```
使用场景：
const常用于确定的，在运行中不会变化的全局常量值，例如一些资源字符串，视图中内容相同的对象，用const修饰在内容中可以复用
final用在修饰需要初始化的成员变量
# List列表
## 初始化列表
```java
void main() {
 //初始化列表
  List l1=[1,2.23,'3'];
  print(l1);//[1, 2.23, 3]
    
  //指定类型初始化
  List<int> l2=[1,2,3];
  print(l2);//[1, 2, 3]

  //声明列表不初始化，使用add赋值
  List<int> l3=[];
  l3..add(1)..add(2)..add(3);
  print(l3);//[1, 2, 3]

  //初始化定长的列表，长度为3，第二参数是列表元素的默认值
  var l4=List<int>.filled(3,1);
  l4[1]=2;
  l4[2]=3;
  print(l4);//[1, 2, 3]
}

```
常用方法
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701502148165-5b663f08-1d56-4180-a327-678982a28b96.png#averageHue=%23fafaf9&clientId=u6e50582f-81b0-4&from=paste&height=508&id=uc4d836c8&originHeight=508&originWidth=748&originalType=binary&ratio=1&rotation=0&showTitle=false&size=29857&status=done&style=none&taskId=ud5b5ae5e-7edf-4c39-a799-015ade482d0&title=&width=748)
# Map集合
保存键值对，一对对象
```java
void main() {

    //创建一个Map对象
  var m=Map();
  m[1]='1';
  m['1']='2';
  print(m);//{1: 1, 1: 2}

    //指定键和值的类型创建一个Map对象
  Map m2=Map<int,String>();
  m2[1]='1';
  m2[2]='2';
  m2[2]='3';//键相同会覆盖旧值
  print(m2);//{1: 1, 2: 3}
}

```
## 常用方法
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701502667943-88166519-ccb2-4b32-83fb-2daa71f1a918.png#averageHue=%23faf9f8&clientId=u6e50582f-81b0-4&from=paste&height=369&id=u32474327&originHeight=369&originWidth=751&originalType=binary&ratio=1&rotation=0&showTitle=false&size=25332&status=done&style=none&taskId=ua33eefe3-9938-4514-9421-758bc2e094c&title=&width=751)
# Set队列
保证元素唯一的有序队列，这一点和Java语言中的Set集合有一些的区别，因为Java语言中Set集合是无序的唯一队列
因为Dart中的Set队列是一个LinkedHashSet，保证了唯一性又保证有序性
```java
var a = Set();
a.add('java');
a.add('php');
a.add('python');
a.add('java');
a.add('sql');
a.add('swift');
a.add('dart');

print(a);//{java, php, python, sql, swift, dart}
```
## 常用方法
因为Set中的元素具有唯一性，这与数据概念中的集合有相同之处，所以可以使用Set集合来进行集合运算，例如，**交并补**
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701502960042-692e74f1-1a21-4814-a978-f034af1c4177.png#averageHue=%23faf9f9&clientId=u6e50582f-81b0-4&from=paste&height=577&id=uc24fef72&originHeight=577&originWidth=753&originalType=binary&ratio=1&rotation=0&showTitle=false&size=38660&status=done&style=none&taskId=u16111852-191f-4bed-994f-5454519a179&title=&width=753)
# enum枚举
与其他语言的枚举无差异，常用来定义常量


# 函数
## 函数定义
函数的定义与调用，写法格式与Java无异
```java
void main() {
  var ans=add(1,2);
  print(ans);
}


int add(int a,int b){
  return a+b;
}
```
## 可选参数
可选参数，可选参数使用[]包裹，并且需要指定默认值，调用方法时，可选参数可填可不填，不填时使用默认值。
```java
void main() {

  var ans=add(1,2);
  var ans1=add(1);
  print(ans);
  print(ans1);
}


int add(int a,[int b=2]){
  return a+b;
}

```
## 命名参数
命名参数，命名参数使用{}包裹，调用包含命名参数的方法时可以通过键值的形式对参数传值，例如：
可选参数无法指定传参和实参的对应关系，但是命名参数通过键值对可以指定，无需按照函数中参数定义的顺序传参。
```java
//可选参数
int add1([int a=1,int b=2]){
  return a+b;
}

//命名参数
int add2({int a=1,int b=2}){
  return a+b;
}

void main() {

  var ans1=add1(1,2);
  var ans2=add2(b:1,a:2);
  print(ans1);//3
  print(ans2);//3
}
```
## 返回函数对象
函数的返回类型可以是函数，关键字是`Function`
```java
Function makeAdd(int x) {
  return (int y) => x + y;
}

//调用
var add = makeAdd(1);
print(add(5));
```
# 操作符
常用的操作符
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701513010646-867d0f01-d1e4-4f8a-a8be-2f6df018a792.png#averageHue=%23fafaf9&clientId=uf653289c-09f8-4&from=paste&height=683&id=u58b24384&originHeight=683&originWidth=821&originalType=binary&ratio=1&rotation=0&showTitle=false&size=39316&status=done&style=none&taskId=uda6f130e-6f2d-4074-8f9c-3305f897743&title=&width=821)
除此之外还有类型判断操作符：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701513096269-d9d438e9-7641-44c8-88b4-79f700725f96.png#averageHue=%23f8f8f7&clientId=uf653289c-09f8-4&from=paste&height=337&id=u17558fc0&originHeight=337&originWidth=818&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21325&status=done&style=none&taskId=ucb565553-0ee5-401e-bb90-9941fd4e333&title=&width=818)
条件判断操作符
条件？表达式1：表达式2：三目运算符
表达式1 ?? 表达式2：类似kotlin中的`?.`运算符，表达式1的结果非空，则返回表达式1的结果，否则执行表达式2
```java
  bool isFinish = true;
  String txtVal = isFinish ? 'yes' : 'no';

  bool isFinish;
  isFinish = isFinish ?? false;
  or
  isFinish ??= false;
```
级联运算符`..`
可以实现类似链式调用的效果。
# 异常体系
异常体系类似Java的异常体系，同样分为Exception和Error
**Exception：可以捕获，可以安全处理**
**Error：不可捕获，如系统错误**

# 类
## 类的定义
可以看到这种构造函数的写法和Java的有所不同，其实它是Dart的一种语法糖。
```java
class Point{
	num x,y;
    Point(this.x,this.y);//构造函数
}
```
如上代码等价于：
```java
class Point{
  num x,y;
  Point(num x,num y){
    this.x=x;
    this.y=y;
  }
}
```

## 命名构造函数
命名构造函数，可以从一个Map中生成一个Point对象
```java
class Point {
  num x, y;
  Point.fromJson(Map json)
      : x = json['x'],
        y = json['y'];
}
```
## 重定向构造函数
调用fronJson函数，最终通过this重定向到`Point(this.x, this.y);`来构造对象。
```java
class Point {
  num x, y;
  Point(this.x, this.y);
  // 重定向构造函数
  Point.fromJson(Map json) 
    : this(json['x'], json['y']);
   @override
  String toString() {
    return "$x, $y";
  }
}

void main(){
  Point p=Point.fromJson({"x":10,"y":20});
  print(p);
}
```
## get和set
get和set是类中特殊的成员函数，用于对属性获取值和赋值。
有点和Java中的getName和setName方法的作用类似，不过在调用上dart更简约，统一是`p.name`调用，而Java中是需要`p.getName()`，`p.setName()`；
```java
class Person {
  String? _name;
  set name(String value){
    _name=value;
  }
  
  String get name{
    return "person is $_name";
  }
}

void main(){
  var p=Person();
  p.name="lixu";
  print(p.name);
}
```
并且利用箭头函数简化get和set
```java
class Person {
  String? _name;
  set name(String value)=>_name=value;
  String get name =>  "person is $_name";
}

void main(){
  var p=Person();
  p.name="lixu";
  print(p.name);
}
```
# 静态
## 静态变量
静态变量可以通过外部直接访问，不需要将类实例化
## 静态方法
静态方法同样也可以通过外部直接访问

# 抽象类与接口
标识一个类是抽象类的关键字是`abstract`
抽象类的派生子类使用的关键字是`implement`
dart中没有接口的关键字，但是可以使用abstract实现
编码规范上可以对用作接口用途的抽象类命名为字母I开头，如`IBook`
Dart可以实现从标准类派生出子类，因此标准类与抽象类最大的区别就是抽象类是不能被实例化。
## extends继承
通过继承可以派生子类，重写父类中的方法。
继承和实现的区别，子类**继承**父类可以选择覆盖父类的方法，但子类**实现**父类必须覆盖父类的所有方法
子类继承父类：
```java
class Phone {
  void startUp() {
    print("开机");
  }

  void shutDown() {
    print("关机");
  }
}

class Android extends Phone {
  void startUp() {
    print("Android 开机");
  }
}

void main() {
  Phone p = Android();
  p.startUp();
}

```
子类实现父类：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701658597844-ec372c2d-bb63-4208-9c84-2ed97f910ba9.png#averageHue=%23222222&clientId=udc39f2f0-df39-4&from=paste&height=411&id=ubcde7994&originHeight=616&originWidth=803&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=65921&status=done&style=none&taskId=u49190ff5-70aa-4dd0-b434-6aa4c559b24&title=&width=535.3333333333334)

# 工厂函数

## 工厂模式
之前有学到抽象类是不能实例化对象的，并且构造抽象类的目的是派生出子类。
如图，我们直接去尝试实例化抽象类对象是会编译报错
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701659097370-8557b1d9-28f9-4175-90dc-494e48e936f4.png#averageHue=%23232323&clientId=udc39f2f0-df39-4&from=paste&height=262&id=ucbff4d22&originHeight=262&originWidth=1128&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=39465&status=done&style=none&taskId=u7ce4f498-469c-4dfc-b4a2-40d5b49fc59&title=&width=1128)
利用factory关键字可以很方便的实现简单工厂模式，这样我们可以通过指定类型去实现抽象类的派生类的具体对象。
```java
abstract class Phone {
  void call();

  factory Phone(String type) {
    switch (type) {
      case 'Android':
        return Android();
      case 'IOS':
        return IOS();
      default:
        throw Exception("类型错误");
    }
  }
}

class Android implements Phone {
  @override
  void call() {
    print("android calling ...");
  }
}

class IOS implements Phone {
  @override
  void call() {
    print("IOS calling ...");
  }
}

void main(List<String> args) {
  var p = Phone("Android");
  p.call();
}
//输出
//android calling ...
```
## 单例模式
使用factory去修饰构造函数
```java
class Phone {
  static final Phone _instance = Phone._internal();

  Phone._internal();

  factory Phone() => _instance;

  void call() {
    print("calling ...");
  }
}

void main() {
  var p1 = Phone();
  var p2 = Phone();
  print(identical(p1, p2));
}
//输出
//true
```
## 缓存对象
[Dart中的factory关键字](https://www.yuque.com/starryluli/srhmb8/nvvlfyewt8g610it)
## 
# 多继承
多继承使用with关键字
多继承中如何解决函数名冲突
mixin 关键字的作用
## mixin与with
使用mixin关键字定义可被混入的类，子类使用with关键字实现混入（就是多继承的意思），可以看到xiaomi的实例对象同时具备了被混入的类中的成员方法
```java
mixin Phone {
  void call() {
    print("call");
  }
}

mixin Android {
  void playStore() {
    print("play store ...");
  }
}

mixin IOS {
  void appleStore() {
    print("apple store ...");
  }
}

class Xioami with Phone, Android, IOS {}

void main(List<String> args) {
  var p = Xioami();
  p.call();
  p.appleStore();
  p.playStore();
}

```
如果出现了函数名冲突会按照混入的顺序，最后混入的对象的成员函数会覆盖之前混入的成员函数的实现，例如：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701661008827-c5096845-4f50-4ccf-a458-28b7b00b5f71.png#averageHue=%231f1e1e&clientId=u7974505d-b381-4&from=paste&height=900&id=ucc24b5a9&originHeight=900&originWidth=606&originalType=binary&ratio=1&rotation=0&showTitle=false&size=52734&status=done&style=none&taskId=ua960f489-0030-454c-8bca-05f9786fe0c&title=&width=606)
如果我们尝试对被mixin修饰的类，声明一个构造函数，这是不被允许的。因为被mixin修饰的类是很纯粹的，它就应该被子类混入，而不应该具备实例化自身对象的能力。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701661148914-1feec9c1-591d-4054-955e-010b823b33c0.png#averageHue=%23232323&clientId=u7974505d-b381-4&from=paste&height=180&id=u7094da88&originHeight=180&originWidth=597&originalType=binary&ratio=1&rotation=0&showTitle=false&size=13032&status=done&style=none&taskId=u1534f849-451a-46e8-bbb5-292297979b4&title=&width=597)
## mixin class
当然也支持一个类需要能够被混入又能被继承，变得不那么纯粹，那就使用mixin和calss关键字同时修饰它。
官方是这么说的：
`mixin`声明一个可被混入的mixin。`class`声明一个类。`mixin class`声明了一个既可用作常规类又可用作mixin的类，具有相同的名称和相同的类型。
## mixin on
如果我们在混入的时候需要加入限定条件，例如在逻辑上如果我们实现一个类想混入Android，那么应当先混入Phone；如何在语法上实现这种依赖关系呢？可以使用on关键字
例如如下的代码中，我们使用on修饰Android和IOS，让二者依赖Phone，所以在派生子类Xiaomi时如果只混入Android，而不混入Phone会提示报错。并且**先后顺序**也有讲究，必须先混入Phone，再混入Android或IOS
```java

mixin  Phone {
  void call() {
    print("call");
  }
}


mixin  Android on Phone{


  void playStore() {
    print("play store ...");
  }

  void call() {
    print("android calling ...");
  }
}

mixin IOS on Phone {
  void appleStore() {
    print("apple store ...");
  }

  void call() {
    print("ios calling ...");
  }
}


class Xioami with  Android {}

```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701662086600-6df7202c-eee4-4e5b-8ddf-494b7914d3bd.png#averageHue=%23252524&clientId=u7974505d-b381-4&from=paste&height=155&id=ue7b3753b&originHeight=155&originWidth=831&originalType=binary&ratio=1&rotation=0&showTitle=false&size=20326&status=done&style=none&taskId=u81444cbc-3ff2-4a73-b978-3bafb340b1a&title=&width=831)
