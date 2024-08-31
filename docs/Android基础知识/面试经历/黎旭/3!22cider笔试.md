# Java#switch
```java
package review.cider;

public class SwitchTest {
    public static void main(String[] args) {
        SwitchTest(1);System.out.print(",");
        SwitchTest(3);System.out.print(",");
        SwitchTest(4);System.out.print(",");
        SwitchTest(5);System.out.print(",");
    }

    public static void SwitchTest(int value){
        switch (value){
            case 1:
                System.out.print("a");
            case 2:
                System.out.print("b");
                break;
            case 3:
                System.out.print("c");
                return;
            case 4:
                System.out.print("d");
            default:
                System.out.print("*");
                break;
        }
    }
}

```
:::info
ab,c,d*,*,
:::
# Java#static
```java
package review.cider;

public class StaticTest {
    public static void main(String[] args) {
        new Fruit().print();
    }
}
class Fruit{
    static {
        num =1;
        System.out.println("static block");
    }
    static int num=2;
    Fruit(){
        System.out.println("constructor block");
    }
    public void print(){
        System.out.println("num="+num);
    }
}

```
:::info
static block
constructor block
num=2
:::
# Java#List
```java
package review.cider;

import kotlin.collections.ArrayDeque;

import java.util.ArrayList;
import java.util.List;

public class ListTest {
    public static void main(String[] args) {
        List arr=new ArrayList();
        int len=10;
        for(int i=0;i<len;++i){
            if(i%2==0){
                arr.add(i);
            }
        }
        System.out.println(arr);
    }
}

```
:::info
[0, 2, 4, 6, 8]
:::
# Java#finally
```java
package review.cider;

public class FinallyTest {
    public int add(int a,int b){
        try {
            return a+b;
        }catch (Exception e){
            System.out.println("catch 语句块");
        }finally {
            System.out.println("finally 语句块");
        }
        return 0;
    }

    public static void main(String[] args) {
        FinallyTest demo=new FinallyTest();
        System.out.println("和是："+demo.add(9,34));
    }
}

```
:::info
finally 语句块
和是：43
:::
# Java#class
```java
package review.cider;

class Person{
    public Person(){
        System.out.println("this is a person");
    }

}
public class Teacher extends Person{

    private String name="Tom";
    public Teacher(){
        System.out.println("this is a teacher");
        super();
    }


    public static void main(String[] args) {
        Teacher teacher=new Teacher();
        System.out.println(this.name);
    }
}
```
![image.png](/images/27f82882e10f741769cfdea70c6fd08a.png)
# Java#？
```java
package review.cider;

public class SuperTest {
    public Long getLength(){
        return new Long(5);
    }

    public static void main(String[] args) {
        Super sooper=new Super();
        SuperTest sub=new SuperTest();
        System.out.println(sooper.getLength().toString()+","+
                sub.getLength().toString());

    }
}
class Super{
    public Integer getLength(){
        return new Integer(4);
    }
}
```
:::info
4,5
:::
