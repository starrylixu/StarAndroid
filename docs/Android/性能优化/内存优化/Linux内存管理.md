我们知道Android系统是基于Linux系统实现的，所以学习Android的内存管理之前，我们先来看看linux的内存管理机制
# 序言
Linux的内存分为内核空间和**用户空间**
用户空间中进程的内存，往往称为进程地址空间
Linux采用虚拟内存技术，进程的内存空间只是虚拟内存（也称逻辑内存），而程序的运行需要的是实实在在的内存，即物理内存（RAM）。在必要时，操作系统会将程序运行中申请的内存（虚拟内存）映射到RAM，让进程能够使用物理内存。
# 地址空间

