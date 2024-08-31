# 1.数据库表
car表

|  | 字段名 | 类型 | 描述 |
| --- | --- | --- | --- |
| 编号 | id | int | 1 |
| 品牌编号 | brand_id | int | 1 |
| 汽车名 | car_name | varcahr | 奥迪A6L |
| 汽车图片 | car_pic | varchar |  |
| 汽车类型 | car_type | varchar | 轿车 |
| 汽车售价 | car_price | decaimel | 2.38 |

car_brand表

|  | 字段名 | 类型 | 描述 |
| --- | --- | --- | --- |
| 编号 | id | int | 1 |
| 汽车品牌 | car_brand | varchar | 奥迪 |
| 汽车logo | car_logo | varcahr |  |

user_comment 用户评论表
设计约束：

1. 一个用户对一个车型只能发布一条评论
2. 一个车型可以对应多条评论

接口：

1. 通过汽车编号可以查询该车型的所有评论
|  | 字段名 | 类型 | 描述 |
| --- | --- | --- | --- |
| 编号 | id | int | 1 |
| 汽车编号 | car_id | int | 1 |
| 用户编号 | user_id | int | 1 |
| 评论图片 | comment_pic | varchar | http |
| 评论内容 | comment_content | varchar | 好 |
| 点赞数 | comment_like | int | 12 |
| 收藏数 | comment_collect | int | 34 |

# 
# Server层权限
注释注解，权限放行
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/29509a1d3fe64033b6504daa627314e9.png)![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/6ce70bd11164a98b450f57221cd4e1eb.png)

# Swagger
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/b850bee5d994d15e643ee8bb6470eab1.png)
# Android Lombok
[Android](https://projectlombok.org/setup/android)
```groovy
dependencies {
	compileOnly 'org.projectlombok:lombok:1.18.22'
    annotationProcessor 'org.projectlombok:lombok:1.18.22'
}
```
# Android 请求数据失败
[java.net.ConnectException: Failed to connect to /127.0.0.1:80_切切歆语的博客-CSDN博客](https://blog.csdn.net/dickyqie/article/details/105534207)
![image.png](http://starrylixu.oss-cn-beijing.aliyuncs.com/f9535026d01b9edb72e9822faa157a20.png)
# Android Application保存全局变量
```java
package com.hnucm.c202001020216;

import android.app.Application;

public class DataApplication extends Application {
    public final static String HttpURL="http://10.138.50.158:8080/renren-fast/";
}
```
# AndroidStudio Build Output输出中文乱码解决方法
[AndroidStudio Build Output输出中文乱码解决方法_johnnyjjdd的博客-CSDN博客](https://blog.csdn.net/johnnyjjdd/article/details/106806078)
# Android post 上传数据


# Android控件设置透明度
[Android控件设置透明度的三种方法_ai-exception的博客-CSDN博客_安卓控件透明度](https://blog.csdn.net/qq_36982160/article/details/81235264)
```java
//发布按钮，将发布的内容实体提交到后台
        shareBtn.setOnClickListener(v -> {

            comment.carId= keyCar.id;
            comment.userId= DataApplication.getDataUserDTO().userId;
            comment.userName=DataApplication.getDataUserDTO().username;
            comment.commentPic=DataApplication.getDataUserDTO().userPic;
            comment.commentContent=msgTxd.getText().toString();
            comment.commentLike=0;
            comment.commentCollect=0;
            String dataBody=new Gson().toJson(comment);

            CommentApi api= RetrofitUtils.getRetrofit(DataApplication.HttpURL).create(CommentApi.class);
            RequestBody body=RequestBody.create(okhttp3.MediaType.parse("application/json; charset=utf-8"),dataBody);
            Call<Comment> call= api.addComment(body);
            call.enqueue(new Callback<Comment>() {
                @Override
                public void onResponse(Call<Comment> call, Response<Comment> response) {
                    Log.e(TAG, "onResponse: "+response.body());
                    finish();
                }

                @Override
                public void onFailure(Call<Comment> call, Throwable t) {

                }
            });
        });
```
# 明日工作任务
课设登录界面【ok】
评论点赞 
查询修改接口
# Android dataBinding报错 一般是布局文件有问题
# 设计约束
登录接口设计约束
post请求   入参数
```json
{
  "mobile": "string",
  "password": "string"
}
```
传回的参数
应该返回整个用户实体  以及登录验证状态   
然后可以将登录的用户信息保存为全局变量
```json
{
  "msg": "success",
  "code": 0,
  "expire": 604800,
  "user": {
    "userId": 3,
    "username": "string",
    "userPic": "https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202212191319712.png",
    "mobile": "string",
    "password": "473287f8298dba7163a897908958f7c0eae733e25d2e027992ea2edc9bed2fa8",
    "createTime": "2022-12-19 09:38:21"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwiaWF0IjoxNjcxNDI3NjQyLCJleHAiOjE2NzIwMzI0NDJ9.cXQYOcYw-BZ1rVZKefRocX5RHNrVjI4za_m4YFUqI22W9Fg6yp2AdY9aYTokTgcAqB5tGGVNKlxSwRW6VDsJ1A"
}
```
# MySQL添加注释comment
# Android dataBinding
[Android DataBinding在Activity、Fragment中的使用及数据共享_是阿秋吖的博客-CSDN博客_android databinding fragment](https://blog.csdn.net/A_Intelligence/article/details/110388061)
# 


