# 官方的描述
:::info
Use the factory keyword when implementing a constructor that doesn’t always create a new instance of its class. For example, a factory constructor might return an instance from a cache, or it might return an instance of a subtype.
当你使用factory关键词时，你能控制在使用**构造函数**时，**并不总是创建一个新的该类的对象**，比如它可能会从缓存中返回一个已有的实例，或者是返回子类的实例。
:::
由此可见它的应用场景也很明晰，factory关键字作用在**构造函数**上：

1. 避免创建过多的重复实例，如果已创建该实例，则从缓存中拿
2. 调用子类的构造函数
3. 实现单例模式
## 缓存对象
首先来看第一个场景，缓存对象实例，避免创建重复的实例对象
```java
class Factory{
  late final String name;
  //用来缓存对象
  static final Map<String,Factory> _cache=<String,Factory>{};
  factory Factory(String name){
    return _cache.putIfAbsent(name, () => Factory._internal(name));
  }

  //私有化构造函数
  Factory._internal(this.name){
    print("生成新的实例：$name");
  }
}

main(){
  var p1=Factory("1");
  var p2=Factory("2");
  var p3=Factory("1");
  //identical会对两个对象的地址进行比较，相同返回true，
  print(identical(p1, p2));
  //返回ture，说明p1和p2就是同一个对象
  print(identical(p1, p3));
}
```
## 单例实现
```java
class Singleton{
  static final Singleton _singleton=Singleton._internal();
  factory Singleton(){
    return _singleton;
  }
  Singleton._internal();
}
```
## 工厂模式
学过设计模式，应该知道工厂设计模式，最简单的工厂设计模式有三个角色，工厂角色，抽象产品，具体产品。在工厂角色中，持有抽象产品的引用，利用里氏代换原则，我们可以调用具体产品角色的构造函数，返回具体的产品。
这里使用factory修饰构造函数，可以实现类似的效果，具体看代码：
如下根据传入的type来决定返回哪一个具体的动物对象实例。
```java
abstract class Animal {
  String? name;
  void getNoise();
  factory Animal(String type, String name) {
    switch (type) {
      case "cat":
        return new Cat(name);
      case "dog":
        return new Dog(name);
      default:
        throw "The '$type' is not an animal";
    }
  }
}

class Cat implements Animal {
  String? name;
  Cat(this.name);

  @override
  void getNoise() {
    print("${this.name}: 喵~");
  }
}

class Dog implements Animal {
  String? name;
  Dog(this.name);

  @override
  void getNoise() {
    print("${this.name}: 旺~");
  }
}
void main() {
  var cat = new Animal("cat", "花花");
  var dog = new Animal("dog", "小黑");
  cat.getNoise(); // 花花:  喵~
  dog.getNoise(); // 小黑: 旺~
}

```
