# 【Android】Android与Unity安卓AR通信（3）

unity导出作为安卓项目中的库来使用

1. 首先打开一个安卓项目
2. 准备好unity中Export出的安卓包

## unity

在unity中勾选

![](/images/375df58fb2a2f362cf25d76621169102.png)

然后export

## 安卓

打开一个现有的，取消gradle的下载，在Project Structure中设置自己下好了的gradle版本，如下是我的版本

![](/images/ceffe7aeed48f2da79c869c62e7021f3.png)

## 1. 找不到unityStreamingAssets文件错误

![](/images/1eac2b0db4fe8df1a3255a42ed937e37.png)

在gradle.properties里添加如下代码

```
 unityStreamingAssets=.unity3d, google-services-desktop.json, google-services.json, GoogleService-Info.plist
```

2. 找不到NDK

Location specified by ndk.dir (D:\AndroidTool\TEMP\android-ndk-r16b) did not contain a valid NDK

![](/images/4cde506b15b971de3759a902bc969e7b.png)

```
ndk.dir=D\:/Unity/UntiyDownLoad/2020.3.26f1c1/Editor/Data/PlaybackEngines/AndroidPlayer/NDK
```

## 尝试将Unity中AR项目导入到AS

![](/images/4f2e1b1c198bf98c203e082ca2e33842.png)

解决方案：

1.删掉setting.gradle中的部分代码

![](/images/1ba47991189802da4843a082e75e737c.png)

2.将项目的build.gradle更改

```java
// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath "com.android.tools.build:gradle:7.0.4"

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}


allprojects {
    buildscript {
        repositories {
            google()
            jcenter()
        }
    }

    repositories {
        google()
        jcenter()
        flatDir {
            dirs "${project(':unityLibrary').projectDir}/libs"
        }
    }
}
task clean(type: Delete) {
    delete rootProject.buildDir
}
```

3.MainActivity中样例代码

```java
package com.unity3d.player;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button button=(Button)findViewById(R.id.button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(MainActivity.this,UnityPlayerActivity.class);
                startActivity(intent);
            }
        });
    }


}
```

activity_main.xml样例代码

```java
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <Button
        android:id="@+id/button"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:text="Button"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.529"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_bias="0.27" />

</androidx.constraintlayout.widget.ConstraintLayout>
```
