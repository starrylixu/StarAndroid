# 安卓与Unity通信（1）

通过导入Unity的classes.jar，继承unity的UnityPlayerActivity实现unity与安卓的交互

## 安卓

### 1.创建一个安卓空项目

我将其更名为unitytoandroid

记住选择的API等级，在unity中会用到，如图我用的是API21，Android5.0

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/0ea8d4e5a13e4bfdf9cdd1390953cda1.png)

创建好后，as默认打开是在Android结构下

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/fcc11286345e915c0cc75a886cc6b2f0.png)

我们将其切换到Project结构目录下

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/60c4311c6a004e9e36990697b96e5ec7.png)

### 2.导入classes.jar

1.  导入unity的jar包
在unity的安装目录下找到classes.jar文件，并将其复制到as的libs文件下`D:\Unity\UntiyDownLoad\2020.3.26f1c1\Editor\Data\PlaybackEngines\AndroidPlayer\Variations\mono\Release\Classes`
![](http://starrylixu.oss-cn-beijing.aliyuncs.com/c8af783fd0a193f17c2d83df3d91ec7d.png)
![](http://starrylixu.oss-cn-beijing.aliyuncs.com/2f0cb758cf348586c1ef4592166f82b3.png) 
2.  右键classes.jar，选择add as library，点击ok，完成classes.jar文件的导入
![](http://starrylixu.oss-cn-beijing.aliyuncs.com/445fe66777ebf557d787ccbb6cc11e2b.png) 

### 3、编写MainActivity

在MainActivity中编写通信代码，如果显示没有UnityPlayerActivity，则在unity的安装目录下`D:\Unity\UntiyDownLoad\2020.3.26f1c1\Editor\Data\PlaybackEngines\AndroidPlayer\Source\com\unity3d\player`找到`UnityPlayerActivity.java`这个类，这是因为在2019版以后的unity中`UnityPlayerActivity.java`不再放在classes.jar中

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/29b62cb7541f260a4376974af4e95d6d.png)

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/b36f30800eee1623058d2871f56dd759.png)

找到这个类之后将其放在com.example.unitytoandroid包目录下，与MainActivity同级

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/4004290a3a0ebfbd7fbcd4eb2dad101d.png)

这样就不会再出现报错

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/816224ec7ab0a3dc45cb6f34a62bd4ce.png)

然后在MainActivity中编写通信代码，

```java
package com.example.unitytoandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;

public class MainActivity extends UnityPlayerActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }
	
    //在unity中调用的测试方法，负责打印从unity中传来的字符串
    public void TestAndroid(String val){
        Log.i("unity",val);
    }
}
```

### 4、src文件

把src文件下的所有文件删除，打开AndroidManifest.xml文件，删除当中的报错代码，有时也不会报错但也要删除否则在unity中运行时也会报错，删除后AndroidManifest.xml文件代码应如下

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/0fa08e146caa1f45aaf754151b841e0c.png)

删除后AndroidManifest.xml文件中应该只有两行代码

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/35e10c58c523e9f8df53822a5e87214c.png)

### 5、build.gradle文件

有三处要改

1、 将`plugins {`
`id 'com.android.application'`
`}`更改为

```java
plugins {
    id 'com.android.library'
}
```

2、 并且删除`applicationId "com.example.unitytoandroid"`

3、 修改implementation files('libs\classes.jar')为compileOnly files('libs\classes.jar')

```java
compileOnly files('libs\\classes.jar')
```

### 6、Rebuild Project

在上方工具栏找到Build->Rebuild project，成功运行出来，我们便得到了aar文件

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/fe47ccd0fec9809dbbd8d74665b3fa3d.png)

## Unity

### 1、创建一个unity项目

创建一个Unity项目将其切换到安卓平台

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/98f5d837e51d48be7fb7f4672f8144b4.png)

### 2、添加app-debug.aar文件

把app-debug.aar文件添加到unity中，并将其解压获取AndroidManifest.xml文件，同样放在同级文件下

如果电脑没有解压aar格式的软件，可以复制一份aar文件，更改后缀名为zip然后解压，取出AndroidManifest.xml文件，双击打开可以查看AndroidManifest.xml文件里的内容

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/ebf2d18761eaeb549eaa4c0cbc145357.png)

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/46c4696add02b1458691da1ff558a1b0.png)

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/d9bb6370e2192ac0eae980bf793cce8e.png)

### 3、创建一个UI按钮

在unity中创建一个UI按钮，并编写一个脚本

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/95ec744821b5139edde4df0878203a75.png)

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/95fee8238a47467f7775b6b21bc9b353.png)

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

    public void TestAndroid()
    {
        AndroidJavaClass jc = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
        AndroidJavaObject jo = jc.GetStatic<AndroidJavaObject>("currentActivity");
        jo.Call("TestAndroid", "this is unity");
    }
}
```

将脚本挂在Button上

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/034cbbcdeff638647b27bf2b6201640e.png)

### 4、在unity里build

build之前要确保unity中API的等级设置要与AS中的一样

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/7f27f5c3ecaf220419da1d80e30bcd61.png)

## 运行

在手机上点击按钮，as中弹出提示，标识通信成功

![](http://starrylixu.oss-cn-beijing.aliyuncs.com/e88461455026e5c40f511218e6f4c131.png)
