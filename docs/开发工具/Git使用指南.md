
下载好git之后，在AS中做好基础的信息配置
# git修改用户名和邮箱
这种操作并不会切换git提交代码时的用户，使用git push的时候还是原来的账户，因为它只修改git commit时的账户
```groovy
git config --global user.name "xxx"
git config --global user.email "xxx"
```
# git切换账户
真正切换账户时需要按照如下操作
修改你本地git仓库里面的`**config**`文件。目录位于 .git -》config 文件 。在url前面手动输入用户名和密码 格式为 https://username:userpassword@具体的仓库地址； 示例 
```groovy
https://hui0413:lxth0411@gitee.com/starry_lixu/nqpen-sdk.git
```
# 分支
## 设置保护分支
使用git来管理代码时，防止意外提交和开发者随意提交到master分支，一般master分支只能从其他分支合并代码，然后master只能管理员能推送或是合并，组员只能拉取，这样才能保护我们的master分支稳定
分支的分类：

- 常规分支：仓库成员（开发者权限及以上）可推送分支
- 保护分支：可自定义保护策略，默认仓库管理员才能管理（推送）被保护的分支
- 只读分支：任何人都无法推送代码（包括管理员和所有者），需要推送代码时应设为“常规”或“保护”分支。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695909369014-1185d86b-3add-4556-b3ff-cfd870130ae0.png#averageHue=%23fbfaf8&clientId=u38f5333d-c08a-4&from=paste&height=339&id=uf0493820&originHeight=508&originWidth=1885&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=76371&status=done&style=none&taskId=u5ae34bb8-310f-402f-843f-d474533539b&title=&width=1256.6666666666667)
这样之后，非管理员用户如果再提交代码到master分支，那么就会权限不足
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695909671229-0395f664-4d3d-4166-aa09-f1d77984d268.png#averageHue=%232f2d2c&clientId=u38f5333d-c08a-4&from=paste&height=283&id=u7950b6b1&originHeight=424&originWidth=1338&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=90547&status=done&style=none&taskId=ucf1e1a1f-70f7-45a9-94cd-68b3125b223&title=&width=892)
## 分支的概念
### 查看本地分支
```groovy
git branch
```
### 查看远程分支
```groovy
git branch -r
```
创建分支
```groovy
git branch [新分支名]
```
## 常规分支提交代码
### 创建本地分支
那么就需要这个非管理员的开发者创建一个本地分支，开发者基于这个分支继续开发项目，例如开发者创建一个本地分支`**dev**`
```groovy
git branch dev
```
### 切换分支
并将分支从master切换到dev，对应AS可以看到小标签出现在dev分支上
```groovy
git checkout dev
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695910353545-229602d7-b3aa-49c4-a66e-e745e26a0e80.png#averageHue=%233d444c&clientId=u38f5333d-c08a-4&from=paste&height=255&id=u0eabb8a2&originHeight=383&originWidth=580&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=16766&status=done&style=none&taskId=u9275c58d-d1c5-47f5-9d9d-5349e3afac9&title=&width=386.6666666666667)
### 提交并推送代码
然后开发者修改了代码，就将代码提交到远程仓库
```groovy
git add .
git commit -m '附加信息'
git push [远程仓库名] [远程分支名]
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695910469732-1d0e22f8-6c28-4523-9864-3af58a27d93c.png#averageHue=%23948f6f&clientId=u38f5333d-c08a-4&from=paste&height=672&id=u7ea84df9&originHeight=1008&originWidth=1920&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=214494&status=done&style=none&taskId=udea20ff8-767d-4bf3-8641-599fafe0bb9&title=&width=1280)
这样代码只是提交到了远程仓库的同名dev分区下，并不会主动合入到master分区中，所以需要开发者主动到gitee官网查看，提交一个pull requests
### 提交pull requests
然后审查人员看到了，就能审查代码选择合入到master分区中。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695911063785-34b579ea-9996-4fe7-a936-12c3ef808159.png#averageHue=%23f7f5f2&clientId=u38f5333d-c08a-4&from=paste&height=570&id=u8dce4978&originHeight=855&originWidth=1920&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=132037&status=done&style=none&taskId=u81473554-39da-424f-8870-46c1c106220&title=&width=1280)
管理员登录自己的gitee就能处理代码选择是否合并
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32682386/1695911321080-f80799c1-d7da-4bc2-858f-b6e42e261dae.png#averageHue=%23fdfcfc&clientId=u38f5333d-c08a-4&from=paste&height=570&id=yJ6Ct&originHeight=855&originWidth=1920&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=162756&status=done&style=none&taskId=u19b2f3de-4add-4494-bfd6-729f8c54112&title=&width=1280)
## 常规分支合并代码
### 拉取远程代码
首先需要将代码从远程仓库pull下来，从master分支pull
```groovy
git pull origin master
```
### 合并代码
之后可以看到本地的dev分支仍然是老样子，这是因为pull下来还需要合并分支，将master上的代码合并到dev上
记得操作下面命令时要确认自己切换到了dev分区
```groovy
git merge master
```
这样就能将远程master仓库中最新的代码拉取并合并到本地进行开发啦
### 继续开发
开发部分功能后可以先commit到自己的dev分支，等到功能开发完成再一次性push到master分支，并提交一个pull requests，由管理员审查代码之后就可以继续执行上面的pull、merge操作，如此反复。

# 在指定的某一个分支基础上创建一个新分支
## 命令方式

1. 切换到指定的分支
```dart
git checkout a
```

2. 拉取指定分支的最新代码
```dart
git pull
```

3. 在本地分支创建一个新的分支，并且切换到这个分支
```dart
git checkout -b b
```

4. 把本地分支推送到远程仓库
```dart
git push origin b
```

5. 将本地分支与远程分支关联
```dart
git branch --set-upstream-to=origin/b b
```
如果不关联，我们默认提交代码还是会提交到master分支上，如下可以看到虽然有一个远程dev分支，但是我们`git branch -vv`查看可以看到本地分支并没有关联远程分支
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32682386/1718536546247-72e31ae9-267f-40db-a147-897a6c518289.png#averageHue=%23faf8f6&clientId=u0c8d47cb-4899-4&from=paste&height=136&id=ub2e2b91d&originHeight=170&originWidth=638&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=24168&status=done&style=none&taskId=u87700499-a42c-43e0-8f4c-6f7c8d0bdab&title=&width=510.4)
而关联成功后，我们在本地dev分支使用`git push`提交代码会默认提交到远程dev分支下
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32682386/1718536690490-422dafec-b61e-4c42-9b9d-249f0e08b691.png#averageHue=%23f9f8f6&clientId=u0c8d47cb-4899-4&from=paste&height=138&id=ua3dfd877&originHeight=172&originWidth=902&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=34172&status=done&style=none&taskId=ub39b59ef-b89b-405b-8f67-5b21004a2b9&title=&width=721.6)
## 图形方式
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32682386/1718536897598-51914492-293e-4ced-9708-041b2f139b9d.png#averageHue=%23cae0e6&clientId=u0c8d47cb-4899-4&from=paste&height=472&id=u1d6891df&originHeight=590&originWidth=585&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=84964&status=done&style=none&taskId=ua1c63fb9-705f-4259-853d-626effe5a9c&title=&width=468)
