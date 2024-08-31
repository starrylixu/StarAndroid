# Unity与安卓通信（2）

## 安卓

### 1.新建一个安卓项目

![](/images/1b97a59486efb3ad7b8f2650145f30ce.png)

### 2.新建一个Module

![](/images/e5d08fc1ad17db50015cf214fb510d74.png)

创建一个Android Library的Module，一定要更改一下左边的选项，因为as默认是选择Phone&Tablet，取一个名字unitytoandroidlib

![](/images/af4819161f2c81208cd717694bb862ea.png)

![](/images/963ebd4481f7e0cf081bafcc8550e50c.png)

### 3.在Module里新建一个java文件

在Module里新建一个java文件，取名为Test

![](/images/e0b1e80e64b3a796ca3e26eee27cb7f9.png)

在Test.class里编写如下代码

```java
package com.example.unitytoandroidlib;

import android.util.Log;

public class Test {
    
        //无参无返回值
        public void NoParm(){
            Log.i("Unity","This is NoParm");
        }

        //有参有返回值
        public int OneParm(String val){
            Log.i("Unity",val);
            return 10;
        }

        //静态方法有参有返回值
        public static int sOneParm(String val){
            Log.i("Unity","sOneParm"+val);
            return 20;
        }
}
```

### 3.Rebuild Project

这一次我们是在创建的unitytoandroidlib下生成了aar文件

![](/images/3e968de3a9df18116c3d6f9d2b7b086e.png)

## unity

### 1.切换到安卓平台

![](/images/30fe733a8feedd4779909e8379ea7b90.png)

### 2.添加aar文件

在Assets文件夹下，创建一个Android文件夹，将在as中build出来的aar文件拖到Android文件夹下，如图所示

![](/images/df0510124e48dc0353859b8cc48d5a42.png)

### 3.创建UI

![](/images/cb4d2c075efeb7a8c5811f389abeeb21.png)

![](/images/ce437f1b9bd2451d6096da161df59eda.png)

### 4.编写一个C#脚本

编写一个C#脚本，取名为Test，必须要保证C#脚本的文件名和C#脚本里的类名一致否则无法挂载到UI按钮组件上

除此之外，实例化类对象时，括号中的字符串参数要填写在as中包名及类名

![](/images/d4a815f075db7c17eee795002a9aac0b.png)

```c
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Test : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void TestOne()
    {
        //实例化一个此类对象
        AndroidJavaObject jo = new AndroidJavaObject("com.example.unitytoandroidlib.Test");
        jo.Call("NoParm");
    }

    public void TestTwo()
    {
        //实例化一个此类对象
        AndroidJavaObject jo = new AndroidJavaObject("com.example.unitytoandroidlib.Test");
        int result = jo.Call<int>("OneParm","This is OneParm");
        Debug.Log("TestTwo=" + result);
    }

    public void TestThree()
    {
        //找到此类，从而调用其中的静态方法
        AndroidJavaClass jc = new AndroidJavaClass("com.example.unitytoandroidlib.Test");
        int result = jc.CallStatic<int>("sOneParm", "This is sOneParm");
        Debug.Log("TestThree=" + result);
    }
}
```

### 5.挂在函数

选中UI按钮组件，在inspector视图下，为不同的组件挂载不同的函数达到函数监听响应的功能

![](/images/5a2a75f7ecd39749cbd0661e29fe73b9.png)

## 运行

![](/images/9f47e36fd0ff6b3e6026a316bc1930ac.png)
