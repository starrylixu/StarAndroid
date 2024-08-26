安装分布式版本管理系统Git。
a. 安装分布式版本管理系统Git。
```java
yum install git -y
```
b. 使用Git将NVM的源码克隆到本地的~/.nvm目录下，并检查最新版本。
**说明：**由于网络原因，可能会出现无法克隆的问题，建议您多尝试几次。
```java
git clone https://gitee.com/mirrors/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
```
c. 依次运行以下命令，配置NVM的环境变量。

d. 运行以下命令，修改npm镜像源为阿里云镜像，以加快Node.js下载速度。
```java
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
```
e. 运行以下命令，查看Node.js版本。
```java
nvm list-remote
```
f. 安装多个Node.js版本。
i. 安装v14.0.0版本。
```java
nvm install v14.0.0
```
ii. 安装v16.0.0版本。
```java
nvm install v16.0.0
```
g. 查看已安装的Node.js版本。
```java
nvm ls
```
返回结果如下所示，表示当前已安装v14.0.0、v16.0.0两个版本，正在使用的是v16.0.0版本。
**说明：**您可以运行**nvm use <版本号>**命令切换Node.js的版本。例如，切换至Node.js v18.0.0版本的命令为**nvm use v18.0.0**。
```
echo ". ~/.nvm/nvm.sh" >> /etc/profile
source /etc/profile
```
```
v14.0.0
->      v16.0.0
default -> v14.0.0
iojs -> N/A (default)
unstable -> N/A (default)
node -> stable (-> v16.0.0) (default)
stable -> 16.0 (-> v16.0.0) (default)
lts/* -> lts/hydrogen (-> N/A)
lts/argon -> v4.9.1 (-> N/A)
lts/boron -> v6.17.1 (-> N/A)
lts/carbon -> v8.17.0 (-> N/A)
lts/dubnium -> v10.24.1 (-> N/A)
lts/erbium -> v12.22.12 (-> N/A)
lts/fermium -> v14.21.3 (-> N/A)
lts/gallium -> v16.20.1 (-> N/A)
lts/hydrogen -> v18.16.1 (-> N/A)
```


