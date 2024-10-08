# 抽象类
对一类具有共有属性和行为的子类的抽象，为子类提供一个公共特性的通用模板
抽象类是**对事物的一种抽象**，描述的是某一类特性的事物。表示 这个对象是什么。（is-a关系——强调所属关系）	
## 抽象类的特点

1. 抽象类不能实例化
2. 用关键字abstract修饰
3. 抽象类中可以有非抽象方法
4. 有抽象方法的类一定是抽象类，抽象类不一定有抽象方法
5. 一个子类只能继承一个抽象类
# 接口
接口可以理解成是更加抽象的抽象类，接口中定义一系列通用的抽象方法，用于子类去实现
接口是**对行为功能的抽象**，描述是否具备某种行为特征。表示 这个对象能做什么。（has-a关系——强调功能实现）
## 接口的特点

1. 接口不是类，而是一个集合，是抽象方法和**常量**的集合。
2. 接口没有构造方法
3. 接口中的方法必须都是抽象的。
4. 用inteface关键字修饰接口
5. 用implements 实现接口
6. 一个子类可以实现多个接口
