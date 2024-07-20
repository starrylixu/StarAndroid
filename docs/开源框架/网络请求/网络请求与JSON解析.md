![](https://starrylixu.oss-cn-beijing.aliyuncs.com/picgo/202407132141012.jpeg)<br />网络请求是 Android开发中必不可少的一部分，几乎是个app都需要请求网络获取数据。那么实现网络请求的方式是如何的呢？以及网络请求的主流方式是怎么样的呢？<br />首先来看看比较原始的一种网络请求方式吧！
<a name="db94a9fe"></a>
# 网络请求权限
在Android应用开发中，有严格的权限把控，既然需要访问网络自然需要**网络请求权限**
```java
<uses-permission android:name="android.permission.INTERNET"/>
```
除此之外还需要加上这一行，否则http的网页请求不成功
```java
android:usesCleartextTraffic="true"
```
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429173308.png#id=icaxR&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="39106f55"></a>

# 网络请求
<a name="5234dcfa"></a>
## 网络在主线程异常
这段代码是网络请求数据，http://121.4.44.56/user（目前这个链接已失效，但并不影响理解文章）这是老师提前发在网上的数据文件，可通过这个网址访问，其中的数据是：<br />![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429174240.png#id=t8MPz&originHeight=152&originWidth=524&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
```java
try {
    URL url = new URL("http://121.4.44.56/user");
    HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
    urlConnection.setRequestMethod("GET");

    InputStream inputStream = urlConnection.getInputStream();// 字节流
    Reader reader = new InputStreamReader(inputStream);//字符流
    BufferedReader bufferedReader = new BufferedReader(reader);// 缓存流
    String result = "";
    String temp;
    while ((temp = bufferedReader.readLine()) != null) {
        result += temp;
    }
    Log.i("MainActivity", result);
    inputStream.close();
    reader.close();
    bufferedReader.close();
} catch (Exception e) {
    e.printStackTrace();
}
```
将这段代码放在主线程下执行会出现`警告warn`
```java
W/System.err: android.os.NetworkOnMainThreadException
```

这是因为在Android中网络请求不能在主线程，而我们的APP的生命周期中执行的方法默认是主线程（UI线程）不能执行耗时的操作<br />常见的耗时操作有：读取文件（读数据库）、网络请求
<a name="2826cf85"></a>
## 子线程网络请求
因此我们需要创建一个子线程来访问网络数据，并且在**子线程中**将获取到的数据显示在`TextView`控件上
```java
Thread thread=new Thread(){
@Override
public void run() {
    //run()方法执行的代码都是在子线程中
    super.run();

    //网络请求
    try {
        //请求服务器端
        URL url = new URL("http://121.4.44.56/user");
        HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
        urlConnection.setRequestMethod("GET");

        //获取io输入字节流->字符流->缓存流
        InputStream inputStream = urlConnection.getInputStream();// 字节流
        Reader reader = new InputStreamReader(inputStream);//字符流
        BufferedReader bufferedReader = new BufferedReader(reader);// 缓存流

        String result = "";
        String temp;
        while ((temp = bufferedReader.readLine()) != null) {
        	result += temp;
   		}
        Log.i("MainActivity", result);
        //在子线程中将获取到的数据显示在`TextView`控件上
        textView.setText(result);
        inputStream.close();
        reader.close();
        bufferedReader.close();
   		} catch (Exception e) {
    		e.printStackTrace();
    	}

    }

};
thread.start();
```
运行发现虚拟机上**只显示一部分数据**，查看日志窗口发现：<br />![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429143453.png#id=x3rZI&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="7a483b4a"></a>

## 线程切换
打开logcat日志台，可以看到有如下警告：**在错误的线程中执行**
```java
W/System.err: android.view.ViewRootImpl$CalledFromWrongThreadException: Only the original thread that created a view hierarchy can touch its views.
```
出现这个警告⚠️原因： 对于UI控件的操作不能放在子线程中->需要放到主线程中执行->线程切换<br />![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429143614.png#id=pi4wR&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />不能直接在主线程中设置，因为主线程和子线程是一起运行的，它们在运行时是无法人为预知的<br />我们需要在子线程中网络请求到数据，再通过`**runOnUiThread(new Runnable()**`实现线程切换将请求到的内容设置到`**TextView**`中
```java
String finalResult=result;
runOnUiThread(new Runnable() {
    @Override
    public void run() {
    textView.setText(finalResult);
    }
});
```
这样就能完成的显示请求到的数据了<br />![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429144035.png#id=nRwX1&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="c1ed471d"></a>
# JSON数据解析
[JSON](https://baike.baidu.com/item/JSON)([JavaScript](https://baike.baidu.com/item/JavaScript) Object Notation, JS 对象简谱) 是一种**轻量级的数据交换格式**。它基于 [ECMAScript](https://baike.baidu.com/item/ECMAScript) (欧洲计算机协会制定的js规范)的一个子集，采用完全独立于编程语言的文本格式来存储和表示数据。简洁和清晰的层次结构使得 JSON 成为理想的数据交换语言。 易于人阅读和编写，同时也易于机器解析和生成，并有效地提升网络传输效率。<br />问题：网络请求是耗时的，那么如何一次请求到所有的数据呢？<br />如图一次请求到年龄，姓名和是否是学生三个数据，但是我们只需要姓名，我们就只需要通过JSON解析字符串，再通过 键名  获取到姓名
<a name="5d961e79"></a>
## 基本类型
`json`数据结构的特点：`"key":value`
```java
//json结构 "key":value { "age":30,"name":"张三", "isstudent":true }
//如何从json结构中解析出数据
```
```java
 try {
     //json解析字符串
     JSONObject jsonObject=new JSONObject(finalResult);
     //通过 键 获取到 值
     String name=jsonObject.getString("name");
     textView.setText(name);
     } catch (JSONException e) {
        e.printStackTrace();
     }
}
```
json字符串的数据结构可以是浮点型，整型，长整型，字符串型，布尔型 ，数组类型，josn类型，class类型等等<br />![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429185825.png#id=xmuPG&originHeight=309&originWidth=769&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="38543913"></a>

## Json类型
json数据结构还可以是json类型的，这种情况需要嵌套解析，`**http://121.4.44.56/object1**`文件里的内容如下：
```java
{ "age":20,
 "name":"张三", 
 "isstudent":true,
 "class":
 	{"grade":"18级",
     "classname":"计算机科学与技术"
    }
}
```
嵌套解析其实也很好理解，如果就是一层JSON，那么解析一次就可以拿到值了。JSON中的值类型也是JSON类型的，通过“键找值”的方式再次解析即可。那么如果出现了很复杂的JSON数据，嵌套了3，4层，那么解析起来也是很麻烦的
```java
//json解析字符串
JSONObject jsonObject=new JSONObject(finalResult);
//首先获取到嵌套的json类型，这也可以看做通过 键 找 值
//class是键名，{"grade":"18级","classname":"计算机科学与技术"}是值
JSONObject classObj=jsonObject.getJSONObject("class");
//再通过 键 获取到 值
String className=classObj.getString("classname");
```

![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429151433.png#id=xNHle&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="f45a735a"></a>
## 数组类型
json数据结构还可以是**数组类型**，`**http://121.4.44.56/object2**`文件里的内容如下：
```json
{ "grade":"18级",
  "classname":"计算机科学与技术",
  "students":["张三","李四","王五"] 
}
```
解析数组类型，使用了`**JSONArray**`**类，**理解成一个普通的数组即可，按照下标取值就可以拿到数组中的元素
```java
JSONObject jsonObject=new JSONObject(finalResult);
//通过数组名获取到数组
JSONArray jsonArray= jsonObject.getJSONArray("students");
//遍历数组，打印日志
for(int i=0;i<jsonArray.length();++i){
     String student=jsonArray.getString(i);//根据下标获取
     Log.i("Students","student = "+student);
}
```
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429152218.png#id=jaVJB&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="7ef24d92"></a>
## Json数组类型
再复杂一丢丢，json数组类型，`**http://121.4.44.56/object3**`文件里的内容如下：


```json
{ "grade":"20级","classname":"计算机科学与技术",
"students":[
{ "id":"001","age":30,"name":"张三", "isstudent":false },
{ "id":"002","age":25,"name":"李四111", "isstudent":true },
{ "id":"003","age":26,"name":"王1111五", "isstudent":true }
]}
```
JSON数组：

- 首先它是一个数组，所以按照数组的解析方式，拿到这个数组
- 其次数组中的每个下标都是一个JSON类型的字符串，按照解析JSON的方式解析即可

一下就是解析JSON数组类型，拿到数组中每个JSON字符串中的`**name**`和`**age**`字段
```java
//通过数组名获取到数组
JSONArray jsonArray= jsonObject.getJSONArray("students");
//遍历数组，打印日志
 for(int i=0;i<jsonArray.length();++i){
    //根据下标获取每一个json数据
 	JSONObject studentobj=jsonArray.getJSONObject(i);
    //通键名获取到每一个json数据下的值
    String name=studentobj.getString("name");
    Integer age=studentobj.getInt("age");
    //打印日志
    Log.i("MainActivity","name = "+name+" age = "+age);
  }
```
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429153414.png#id=NXUC6&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />学习要求：会解析json数据结构，会构json造数据结构<br />例如京东列表：
```java
{"list":[{"name":iphone12,"price":6799},{"name":iphone12 plus,"price":7988},{},{}]}
```
其实解析JSON字符串就是按照固定的方式 键 找 值，不过可能值的类型不同而已，嵌套的深度不同而已。<br />开发人员应当关注数据即可，而不应当网络请求拿到数据，还要去做层层解析，将JSON转换成实体对象。并且JSON中的嵌套层数太深也会增加开发人员解析的难度。因此聪明了开发者将JSON解析也封装成框架，使用这些框架，自动帮我们将JSON字符串转换成实体对象。
<a name="6c8e1cda"></a>
# JSON解析框架 GSON
[google/gson：一个Java序列化/反序列化库，用于将Java Objects转换为JSON并返回 (github.com)](https://github.com/google/gson)

优点

1. 直接将字符串解析成对象
2. 解析成为一个实体类
<a name="2835acce"></a>
## 添加GSON框架依赖

```java
implementation 'com.google.code.gson:gson:2.9.0'
```
<a name="126f7043"></a>
## 创建实体类
创建用来接收JSON字符串的实体类，要求实体类字段的名称和类型与JSON字符串严格一致
```json
{ "age":30,"name":"张三", "isstudent":true }
```
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429154517.png#id=G1HLa&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="db9d2cb3"></a>
## 使用GSON框架解析
<a name="b0f0c11b"></a>
### 普通json数据类型类
```java
//1.创建一个GSON对象
Gson gson=new Gson();
//2.fromJson()方法解析json字符串
//两个参数前者是网络请求到的json字符串
//后者是json字符串对应的实体类
Student student=gson.fromJson(finalResult,Student.class);
Log.i("MainActivity", "run: "+student.name);
```
![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429155333.png#id=Hppwi&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="d47adbed"></a>
### 嵌套json类型实体类
如果是json类型嵌套实体类，那么实体类应该做如下修改：
```json
{ "age":20,"name":"张三", "isstudent":true,"class":{"grade":"18级","classname":"计算机科学与技术"} }
```

Json数据类型对应java的类，所以嵌套的Json结构，改写成实体类时也是**嵌套的类（内部类）**，除此之外还要**声明这个内部类**<br />因为这里键名是class与java的关键字冲突，**所以要注解"class"**，然后换个变量名<br />![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429155602.png#id=iVrmE&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429155816.png#id=jRf13&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />在`MainActivity`的子线程中解析数据并打印<br />![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429160051.png#id=dHSaF&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="774b2101"></a>
### json数组实体类
通常使用java集合类中的**List可变数组**定义json数据结构中的数组<br />![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429161020.png#id=yRNj8&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429160754.png#id=GUow2&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="37ee34a3"></a>
## 实体类插件GsonFormatPlus(Java版)
GSON框架虽然简化了我们解析数据的过程，但是需要书写一个实体类又给我们添加了麻烦，复杂的JSON字符串，可能有近百个键值，如果有嵌套，编写实体类更加困难，所以可以通过如下插件**一键生成Json数据结构**的实体类
<a name="e655a410"></a>
### 安装GsonFormatPlus

![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429195001.png#id=uE9uU&originHeight=1021&originWidth=1472&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="d7098f50"></a>
### 打开GsonFormatPlus

![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429195050.png#id=TYfr6&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="e366ccf1"></a>
### 设置GsonFormatPlus

![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429161429.png#id=wTn3m&originHeight=1032&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="ecff77a8"></a>
### 使用GsonFormatPlus
在左侧粘贴json数据结构的字符串，然后ok即可<br />![](https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/img/20220429195204.png#id=ImPhs&originHeight=1040&originWidth=1480&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="fQnFR"></a>
## 实体类插件JSONToKotlinClass(kotlin版)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1693379958936-63ac401c-97f9-4612-8c05-ab71fa803097.png#averageHue=%2342464b&clientId=ua74c690a-10a1-4&from=paste&height=354&id=ud9310f96&originHeight=708&originWidth=982&originalType=binary&ratio=2&rotation=0&showTitle=false&size=176673&status=done&style=none&taskId=u45e7327e-83a1-420d-a69c-c17d37a0610&title=&width=491)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1693380033802-bfc93a18-1b32-4b73-9818-eae86aecd942.png#averageHue=%23484c51&clientId=ua74c690a-10a1-4&from=paste&height=333&id=u614fc767&originHeight=665&originWidth=580&originalType=binary&ratio=2&rotation=0&showTitle=false&size=140669&status=done&style=none&taskId=u0685e065-42a2-46bd-b5de-0ec144b1877&title=&width=290)
