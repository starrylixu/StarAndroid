# 泛型
## 容器泛型
```java
void main(List<String> args) {
  var l = <String>[];
  l.add("a");
  l.add('b');
  print(l);
}

```
## 函数泛型
```java
void main(List<String> args) {
  addCache(1, 1);
  addCache('2', 2);
  addCache('1', 1.234);
}

addCache<K, V>(K key, V value) {
  print("$key $value");
}

//输出
1 1
2 2
1 1.234
```
## 泛型上限下限
略
# 异步支持
[异步支持](https://www.yuque.com/starryluli/srhmb8/nbb8bviuod4f8p9z)
# typedef类型定义

- 简化函数的定义，相当于将一个多出需要使用的函数，通过typedef定义一个”简称“，方便全局管理
- 简化类型的定义，作用相似

简化函数的定义
```dart
typedef MyPrint = void Function(String val);

class PrintClass {
  MyPrint print;
  PrintClass(this.print);
}

main() {
  PrintClass coll = PrintClass((String val) => print(val));
  coll.print('hello world');
}

//输出
hello world
```
简化类型的定义
```dart
typedef MapStringAny = Map<String, dynamic>;
typedef MapAnyString = Map<dynamic, String>;
typedef MapStringString = Map<String, String>;
typedef MapStringDouble = Map<String, double>;
typedef MapDoubleString = Map<double, String>;
typedef MapDoubleDouble = Map<double, double>;
typedef MapIntInt = Map<int, int>;
typedef MapIntDouble = Map<int, double>;

typedef ListString = List<String>;
typedef ListInt = List<int>;
typedef ListDouble = List<double>;
typedef ListAny = List<dynamic>;
```
# 空安全
dart语言在2.12之后支持空安全的特性。这个特点和kotlin类似
成员变量默认不可空，如果只声明不赋值会报错。
```dart
String name="lixu";
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701667922285-43581be0-0e18-48f8-8a1e-871b0b3a1c0b.png#averageHue=%23252525&clientId=u965649b7-97dc-4&from=paste&height=358&id=uff468cbf&originHeight=358&originWidth=955&originalType=binary&ratio=1&rotation=0&showTitle=false&size=41730&status=done&style=none&taskId=u5d4b4b95-a827-4f5c-8176-abf5e5b52a4&title=&width=955)
使用`type?`可以声明一个可空的成员变量，可空成员变量就与在未引用空安全之前的变量是一样的，需要在使用前判空。
```dart
num? age;
```
如果确实需要声明一个不可空的变量，并在声明之后再初始化，需要搭配关键字late，标识这个变量不可空，并且延迟初始化。
```dart
late String name;
```
操作符`value?.`与`value??`
`value?.`：表示value不为空才执行
`value??`：表示value为空才执行
```dart
void main(List<String> args) {
  String? value;
  print(value?.length);
  String result = value ?? "value 为空";
  print(result);
}
//输出
null
value 为空
```
集合的可空定义
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701668899731-80fcfe8f-36ee-4fd3-bb1a-6bc833cc2d8d.png#averageHue=%23f7f6f6&clientId=u965649b7-97dc-4&from=paste&height=188&id=u7db54731&originHeight=188&originWidth=668&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14703&status=done&style=none&taskId=u0b882d5c-bcc9-4874-8eda-d9d90e28a96&title=&width=668)

# 扩展
这和kotlin中的扩展函数异曲同工之妙。
语法是：
```dart
extension 扩展类名 on 需要被扩展的类名{
	扩展函数的返回类型 扩展函数名(参数列表){
    	//函数体
  }
}
```
```dart
void main(List<String> args) {
  print("string".getFirstChar());
}


//给String类扩展一个获取首字母的函数
extension ExString on String {
  String getFirstChar() => this[0];
}

//输出
s
```
如果需要给一个类扩展一个属性：
```dart
void main(List<String> args) {
  print("string".lastChar);
}
extension ExString on String {
  //扩展属性，获取最后一个字母
  String get lastChar => this[this.length - 1];
}

//输出
g
```
扩展在项目中的使用可以用来替代工具类的书写。例如我们需要封装一个自己的Toast工具类，完全可以用扩展取代我们Java编码创建一个类并书写多个static方法的方式
使用扩展，包括kotlin中的扩展函数可以让我们去扩展已有的类，并使用面向对象的方式去调用这些扩展方法和属性。

