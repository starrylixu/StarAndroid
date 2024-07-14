![join us.gif](https://cdn.nlark.com/yuque/0/2024/gif/32682386/1714660181006-cca9bc26-a2d1-47b8-9b88-1ca543f3d150.gif#averageHue=%23a1c3a6&clientId=ueaa9afc0-7e3f-4&from=drop&id=u1a78a5e1&originHeight=383&originWidth=900&originalType=binary&ratio=1&rotation=0&showTitle=false&size=499440&status=done&style=none&taskId=ue910be8d-db71-4474-82d2-57df67ba59a&title=)
# 资源网站
Flutter官网：[https://flutter.cn/](https://flutter.cn/)
Dart官网：[https://dart.cn/](https://dart.cn/)
Flutter实战第二版：[https://book.flutterchina.club/](https://book.flutterchina.club/)
Flutter中文社区：[https://flutterchina.club/](https://flutterchina.club/)
开源UI框架：[https://blog.csdn.net/kongTy/article/details/120218937](https://blog.csdn.net/kongTy/article/details/120218937)
第三方开源库：[https://www.jianshu.com/p/7f02a4e615ec](https://www.jianshu.com/p/7f02a4e615ec)
在线编译：[https://dartpad.cn/](https://dartpad.cn/?)
# 简介
`Flutter`是谷歌开发的一款开源， 免费的，基于`Dart`语言的UI框架，可以快速在IOS和Android上构建高质量的原生应用，而且还可以构建桌面应用，web应用和嵌入式应用。它最大的特点就是跨平台和高性能。
`Dart`是由谷歌，在2011年开发的计算机编程语言，它可以被用于web, 服务器，移动应用和物联网等多个领域。号称要取代 `JavaScript`
## 跨平台
跨平台最大的优势就是：节省开发成本，一统天下。这也是谷歌公司的野心和战略部署

- Dart统一前端
- Golong统一后端

虽然很多公司确实有从Java转为go去开发后端，在移动端开发中Flutter也越来越火，但是说统一前后端很难，至少特定的语言诞生于特定的环境用来解决特定的问题，一门语言想”一统天下“，不可能做到面面俱到。
## 高性能
Flutter 应用的性能，接近原生app.
Flutter 采用 用GPU (图形显示）渲染技术。
Flutter 应用的刷新频率可达**120fps** (120帧每秒）
可以用Flutter来**开发游戏**
React Native 开发的应用的刷新频率只能达到**60fps**(60帧每秒）
## 发展历程
2015,Flutter(当时叫sky) 在dart开发者峰会上亮相，其目的就是能够以每秒120帧的速度持续渲染。
2018-6, Flutter 发布了首个预览版本
2018-12，Flutter1.0发布
2019-9，Flutter 1.9发布，添加web端支持
2020-9，Flutter 1.22发布，带来了对ios14和a 和android 11的支持
2021-3，Flutter 2.0发布
2022-5，Flutter 3.0发布
当前版本（截至2024年4月）：[Flutter 3.19.2](https://storage.flutter-io.cn/flutter_infra_release/releases/stable/windows/flutter_windows_3.16.2-stable.zip)
因为是出于学习的目的，所以不使用最新版本的。本文使用的是：[Flutter 3.13.9](https://storage.flutter-io.cn/flutter_infra_release/releases/stable/windows/flutter_windows_3.13.9-stable.zip)
## 跨平台框架的比较
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695528079073-bfbb481b-8f32-46b7-a9fa-cf4ec30ad329.png#averageHue=%23494c58&clientId=u3c0e8f10-9660-4&from=paste&height=414&id=u55e7901e&originHeight=799&originWidth=1462&originalType=binary&ratio=1&rotation=0&showTitle=false&size=352286&status=done&style=none&taskId=u0e29fbb0-4d7f-49fa-951e-b13a36495cc&title=&width=758)
## 成功案例
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695528143565-58c69659-e042-460e-afd5-f27622349390.png#averageHue=%23dfc975&clientId=u3c0e8f10-9660-4&from=paste&height=551&id=ua463c4e1&originHeight=834&originWidth=1448&originalType=binary&ratio=1&rotation=0&showTitle=false&size=243906&status=done&style=none&taskId=u8ccff52b-bcb7-4d9a-b3b5-e3768f365bd&title=&width=957)

# 环境搭建（windows）
## 基础环境
Windows系统上只能搭建Android开发环境
Mac系统上可以搭建Android和IOS的开发环境
个人喜欢用Android Studio，不过VScode也是一款热门的Flutter IDE
VScode下载：[https://code.visualstudio.com/docs/?dv=win](https://code.visualstudio.com/docs/?dv=win)
## 搭建Windows下的安卓环境
在 Windows 操作系统上安装和配置 Flutter 开发环境：可以在这个链接查看`flutter doctor`命令的使用
[https://flutter.cn/docs/get-started/install/windows](https://flutter.cn/docs/get-started/install/windows)
**JDK和Android Studio默认已经装好了，不再记录。**
从如上的链接下载Flutter 的SDK压缩包，然后解压缩，并把`.../flutter/bin`路径配置到windows的环境变量中
我下载的是3.13版本
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701785629650-f275abff-8a29-473b-b748-aa79a46f24c0.png#averageHue=%23fcfaf8&clientId=u69e22abb-9c8f-4&from=paste&height=49&id=u1618e9da&originHeight=74&originWidth=713&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=7500&status=done&style=none&taskId=u2796a707-636d-4333-a522-2de792011e0&title=&width=475.3333333333333)

## 搭建Mac下的安卓环境
额，还没有Mac设备
如果你的 Mac 是 [Apple silicon](https://support.apple.com/en-us/HT211814) 处理器，那么有些 Flutter 组件就需要通过 Rosetta 2 来转换适配（[详情](https://github.com/cfug/flutter.cn/pull/7119#issuecomment-1124537969)）。要在 Apple silicon 处理器上运行所有 Flutter 组件，请运行以下指令来安装 [Rosetta 2](https://support.apple.com/en-us/HT211861)。
在控制台执行如下命令：
```
sudo softwareupdate --install-rosetta --agree-to-license
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32682386/1718975749143-6d9c5fa0-ab41-43ee-b47b-0ba4ca843173.png#averageHue=%23ededed&clientId=u39fe5c2d-ee83-4&from=paste&height=329&id=ud9a10545&originHeight=658&originWidth=1780&originalType=binary&ratio=2&rotation=0&showTitle=false&size=222555&status=done&style=none&taskId=u0f4f84ec-6276-44bc-b7bd-f2e5c0600c5&title=&width=890)
Mac电脑配置环境变量

1. 系统环境变量在 /etc/profile 文件中配置，编辑该文件需要 root 权限
2. /._p用户环境变量可以在 ~/.bash_profile 文件内配置

[https://blog.csdn.net/liaowenxiong/article/details/112180532](https://blog.csdn.net/liaowenxiong/article/details/112180532)
```
export PUB_HOSTED_URL=https://mirrors.tuna.tsinghua.edu.cn/dart-pub;
export FLUTTER_STORAGE_BASE_URL=https://mirrors.tuna.tsinghua.edu.cn/flutter
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32682386/1719140795903-82c8673f-0907-4303-becf-14335776f0f8.png#averageHue=%23f8f8f7&clientId=u3af8c254-9304-4&from=paste&height=757&id=uda3c4a04&originHeight=1514&originWidth=3018&originalType=binary&ratio=2&rotation=0&showTitle=false&size=857922&status=done&style=none&taskId=udcb9dd61-a48b-4d0d-8455-a286dacd2ce&title=&width=1509)
可以看到通过export能够查看到我们刚刚配置的变量，说明配置成功
下载mac平台下的flutter sdk并解压后，然后同样的方式在.bash_profile文件中配置
```
export PATH=$HOME/sdk/flutter_3.13.9/bin:$PATH
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32682386/1719141802688-aabda9e2-7802-4c4e-bf5d-126994c31bea.png#averageHue=%23f4f4f4&clientId=u3af8c254-9304-4&from=paste&height=176&id=ud0738ee9&originHeight=352&originWidth=1306&originalType=binary&ratio=2&rotation=0&showTitle=false&size=100342&status=done&style=none&taskId=ufcf90cb6-4206-4410-b5b8-cd1b169ab72&title=&width=653)
验证配置是否成功
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32682386/1719151275452-fa41f89d-9a32-487d-8dbe-1451cc4da751.png#averageHue=%23ececec&clientId=u3b3d51dd-0194-4&from=paste&height=88&id=ud92ca705&originHeight=176&originWidth=1088&originalType=binary&ratio=2&rotation=0&showTitle=false&size=65458&status=done&style=none&taskId=u61226167-454e-41e4-b9be-d0766053bf3&title=&width=544)
如此mac的flutter环境算是配置完成啦
## 配置资源镜像
由于在国内访问Flutter有时可能会受到限制，Flutter官方为中国开发者搭建了临时镜像，可以将下面的资源地址加到环境变量中：
在中国网络环境下使用 Flutter：[https://flutter.cn/community/china](https://flutter.cn/community/china)
```java
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
```
找到我的电脑=》右键 点击属性=》点击高级系统设置 =》参考下图
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695530051457-f4337563-544c-4f2c-997d-8b8344a098c3.png#averageHue=%23f3f2f2&clientId=u3c0e8f10-9660-4&from=paste&height=665&id=u55790dae&originHeight=997&originWidth=1541&originalType=binary&ratio=1&rotation=0&showTitle=false&size=244858&status=done&style=none&taskId=u954e5944-c19a-4a9b-ad24-24572d1e4aa&title=&width=1027.3333333333333)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695530124070-63bbc65f-573c-4ca3-8258-42a0ec82353f.png#averageHue=%23b2b1b1&clientId=u3c0e8f10-9660-4&from=paste&height=662&id=u34feeb40&originHeight=993&originWidth=1518&originalType=binary&ratio=1&rotation=0&showTitle=false&size=244344&status=done&style=none&taskId=u1319d10e-59b1-47db-a4a2-91eebfd2c86&title=&width=1012)

## JDK
JDK下载略
## Android Studio
安装AS略

## Flutter SDK
下载Flutter SDK压缩包：[https://flutter.cn/docs/release/archive?tab=windows](https://flutter.cn/docs/release/archive?tab=windows)
然后解压到一个指定路径下，并配置好环境变量：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701785710858-d7ab9b69-92ac-45f3-a11e-4a9b724735ca.png#averageHue=%23f4f3f2&clientId=u69e22abb-9c8f-4&from=paste&height=375&id=uc33a50d9&originHeight=563&originWidth=527&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=38302&status=done&style=none&taskId=u0da51cfb-57b7-4721-92b4-2c083535d5c&title=&width=351.3333333333333)
验证flutter安装是否成功：
```java
flutter doctor
```
运行之后发现绿色的是运行成功的，感叹号和红色叉叉是存在问题
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695531663451-29c9fe63-338b-4513-acf5-5981bbb5a272.png#averageHue=%23181818&clientId=u3c0e8f10-9660-4&from=paste&height=379&id=ufa56a90d&originHeight=568&originWidth=1113&originalType=binary&ratio=1&rotation=0&showTitle=false&size=85748&status=done&style=none&taskId=u83d367ea-f023-4bc0-9750-cfe8fe548e1&title=&width=742)
### 问题一
授权问题
```java
[!] Android toolchain - develop for Android devices (Android SDK version 33.0.1)
    X cmdline-tools component is missing
      Run `path/to/sdkmanager --install "cmdline-tools;latest"`
      See https://developer.android.com/studio/command-line for more details.
    X Android license status unknown.
      Run `flutter doctor --android-licenses` to accept the SDK licenses.
      See https://flutter.dev/docs/get-started/install/windows#android-setup for more details.
```
解决措施：[https://blog.csdn.net/u013365445/article/details/120600314](https://blog.csdn.net/u013365445/article/details/120600314)
切换到sdkManger的位置，`sdkmanager.bat`在sdk的`tools/bin`目录下，然后在执行命令
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701785904197-2016f138-5423-4ada-9450-a1c1a6d2f991.png#averageHue=%23fcfbfa&clientId=u69e22abb-9c8f-4&from=paste&height=249&id=u33858eb3&originHeight=374&originWidth=826&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=36616&status=done&style=none&taskId=u5ea8caff-551e-4e8b-890a-6aa6415610d&title=&width=550.6666666666666)
```java
sdkmanager --install "cmdline-tools;latest"
flutter doctor --android-licenses
```
如若还是不行，进入AS的Android SDK Tools下勾选8.0的版本，再次执行如上命令
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1698755245459-63c81b84-3100-4178-9e56-00ca04a81033.png#averageHue=%233e4349&clientId=uf0a4db1d-c306-4&from=paste&height=712&id=u3e2b3818&originHeight=712&originWidth=982&originalType=binary&ratio=1&rotation=0&showTitle=false&size=87568&status=done&style=none&taskId=u9ba0b415-82f5-4e6c-b46e-6fd853c0e6b&title=&width=982)
### 问题二
问题二是桌面端开发的配置
找到Flutter的安装目录下，以管理员方式启动flutter_console，输入如下代码：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1699760432420-3da0fe6b-6d4d-44bc-a37e-910cb94ba18c.png#averageHue=%23faf9f9&clientId=ud729c35b-b05e-4&from=paste&height=508&id=ub1ed0e88&originHeight=762&originWidth=1102&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=69600&status=done&style=none&taskId=ua71b0f38-1c06-45d1-9e65-18448fcbedd&title=&width=734.6666666666666)
安装window  桌面端开发sdk
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1699762036085-c891cf4e-8359-49d6-8206-efaea8246e99.png#averageHue=%23eceae9&clientId=ud729c35b-b05e-4&from=paste&height=355&id=ua1e13954&originHeight=533&originWidth=987&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=180946&status=done&style=none&taskId=u14b7fa29-6507-462e-801e-43fcf31880e&title=&width=658)
### 问题三
如果找不到某一个开发工具的位置，可以使用如下命令更改
如何修改开发工具在flutter中的路径配置，如下是修改Android Studio的路径配置。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1699759523145-760b0748-c7e5-4164-a374-d63b05718694.png#averageHue=%2312100f&clientId=ud729c35b-b05e-4&from=paste&height=109&id=wtLO8&originHeight=163&originWidth=1134&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=16809&status=done&style=none&taskId=u3622933d-8326-4e6c-a121-002db4449c1&title=&width=756)
### 修改项目中的Flutter版本
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1698755537473-d0c94adc-547e-4323-999c-2fbff6435d12.png#averageHue=%233d4145&clientId=uf0a4db1d-c306-4&from=paste&height=712&id=ufbbd5dd7&originHeight=712&originWidth=982&originalType=binary&ratio=1&rotation=0&showTitle=false&size=57256&status=done&style=none&taskId=u8e52b120-378b-490d-8a8a-03d894cd187&title=&width=982)
# 初始化项目
通过Android Studio初始化项目就不记录了，主要记录以下VSCode创建项目。开发过程中使用AS比较多，所以比较熟悉，但是VSCode也不能完全不会使用。
## 通过vscode创建项目
### 创建项目
```java
flutter create [项目名]
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695537740372-b0566665-0eaa-4090-a7ed-584b2acbdaa7.png#averageHue=%231c1c1b&clientId=u51e73602-2b24-4&from=paste&height=389&id=u31b99169&originHeight=583&originWidth=1306&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=60742&status=done&style=none&taskId=uc44c7c58-e164-4fbc-931f-870590e4d52&title=&width=870.6666666666666)
### 修改镜像源
防止每次创建项目都像如下一样需要修改项目的build.gradle文件，可以直接修改flutter sdk的配置文件，让每一次创建新的项目都是使用配置文件里的内容![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695538061731-26f16580-48a4-477f-8c7f-b6e487edb1e0.png#averageHue=%2321201f&clientId=u412c8271-b125-4&from=paste&height=672&id=ue0af4204&originHeight=1008&originWidth=1920&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=240787&status=done&style=none&taskId=ue2fc1367-cd5e-419c-96ee-e7dae2a40f0&title=&width=1280)
修改Flutter SDK的`build.gradle.kts`文件
```java
maven { url 'https://maven.aliyun.com/repository/google' }
maven { url 'https://maven.aliyun.com/repository/jcenter' }
maven { url 'https://maven.aliyun.com/repository/public' }
maven { url 'https://maven.aliyun.com/nexus/content/groups/public' }
```
这是我的安装地址`D:\Android\Flutter\flutter3.13\flutter\packages\flutter_tools\gradle`
**找到文件发现是kts格式，用下面替换**
```
repositories {
    maven { url = uri("https://maven.aliyun.com/repository/google") }
    maven { url = uri("https://maven.aliyun.com/repository/jcenter") }
    maven { url = uri("https://maven.aliyun.com/repository/public") }
    maven { url = uri("https://maven.aliyun.com/nexus/content/groups/public") }
}
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701786433021-180320a9-6785-4c77-868f-2548d68168c6.png#averageHue=%23353e48&clientId=u69e22abb-9c8f-4&from=paste&height=465&id=u595618c7&originHeight=698&originWidth=902&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=78052&status=done&style=none&taskId=uc11ac86b-d33d-49cd-b4f7-a095e7be2e2&title=&width=601.3333333333334)
### 运行项目
```java
fullter run
```
通过vscode运行项目，可以实现实时热更新
## 通过AS创建项目
略
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1701786488132-673ee740-51da-4384-af17-369944357656.png#averageHue=%232b2d31&clientId=u69e22abb-9c8f-4&from=paste&height=466&id=uc541fbc1&originHeight=699&originWidth=915&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=27695&status=done&style=none&taskId=u3a6341b2-8c61-44d0-a191-5419c3dfd48&title=&width=610)
