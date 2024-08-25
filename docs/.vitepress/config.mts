import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  //最后更新时间戳
 lastUpdated: true,
  title: "StarAndroid",
  description: "一个移动开发学习网站",
  themeConfig: {
    outline: 'deep',
    lastUpdated: {
      text: '最近更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    logo: '/logo.svg',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    //文章尾部
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You'
    },
    //去编辑链接
    editLink: {
      pattern: 'https://github.com/starrylixu/StarAndroid/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    // https://vitepress.dev/reference/default-theme-config
    //导航栏
    nav: [
      { text: '主页', link: '/' },
      {
        text: 'Android', items: [
          { text: '快速入门', link: '/Android基础知识/1快速入门/Android第一课' },
          { text: '四大组件', link: '/Android基础知识/b四大组件/四大组件之ContentProvider' },
          { text: 'Fragment', link: '/Android基础知识/cFragment/Fragment简单使用' },
          { text: 'View', link: '/Android基础知识/dView/1.ViewPager和ViewPager2的区别' },
          { text: '多线程', link: '/Android基础知识/e多线程/1.实现多线程' }
        ]
      },
      { text: 'Flutter', link: '/Flutter/1.控件' },
    
      {
        text: '语言学习',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'Dart', link: '/dart/Dart基础' },
          { text: 'Java', link: '/Java/2.Java特性' },
          { text: 'Kotlin', link: '/Kotlin/协程' }
        ]
      },
      { text: '开发工具', link: '/开发工具/Git使用指南' },
    ],

    //侧边栏
    //多级侧边栏
    //https://vitepress.dev/zh/reference/default-theme-sidebar#collapsible-sidebar-groups
    sidebar: 
    {
      '/Android/': [
        {
          text: "Android",
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' },
            { text: '目录大纲', link: '/目录大纲' }
          ]
        }
      ],
      '/Android基础知识/1快速入门/':[
        {
          text: "Android基础知识-快速入门",
          items: [
            { text: 'Android历史简介', link: '/Android基础知识/1快速入门/Android第一课' },
            { text: '怎么把androidStudio卸载干净', link: '/Android基础知识/1快速入门/2.怎么把androidStudio卸载干净' },
            { text: 'TextView如何实现走马灯的效果', link: '/Android基础知识/1快速入门/3.TextView如何实现走马灯的效果' },
            { text: '如何为组件添加响应', link: '/Android基础知识/1快速入门/4.如何为组件添加响应' },
            { text: '5.如何实现页面的跳转，并传输参数',link: '/Android基础知识/1快速入门/5.如何实现页面的跳转，并传输参数'},
            { text: '6.如何实现界面间的数据传输', link: '/Android基础知识/1快速入门/6.如何实现界面间的数据传输' },
            { text: 'Fragment的使用', link: '/Android基础知识/1快速入门/7.Fragment的使用' },
            { text: 'RecyclerView列表组件', link: '/Android基础知识/1快速入门/8.RecyclerView列表组件' },
            { text: 'SharedPreferences简单数据存储', link: '/Android基础知识/1快速入门/9.SharedPreferences简单数据存储' },
            { text: '11.网络请求数据与JSON解析', link: '/Android基础知识/1快速入门/11.网络请求数据与JSON解析' },
            { text: '12.1网络请求之Retrofit', link: '/Android基础知识/1快速入门/12.1网络请求之Retrofit' },
            { text: '12.网络编程之网络请求', link: '/Android基础知识/1快速入门/12.网络编程之网络请求' },
            { text: '目录大纲', link: '/目录大纲' }
          ]
        }
      ],
      '/Android基础知识/b四大组件/':[
        {
          text: "Android基础知识-四大组件",
          items: [
            { text: 'Android四大组件之Activity', link: '/Android基础知识/b四大组件/Android四大组件之Activity' },
            { text: '四大组件之Service', link: '/Android基础知识/b四大组件/四大组件之Service' },
            { text: '四大组件之BroadcastReceiver', link: '/Android基础知识/b四大组件/四大组件之BroadcastReceiver' },
            { text: '四大组件之ContentProvider', link: '/Android基础知识/b四大组件/四大组件之ContentProvider' },
            { text: 'Application', link: '/Android基础知识/b四大组件/Application' },
            { text: 'Context',link: '/Android基础知识/b四大组件/Context'},
            { text: 'startActivityForResult被弃用', link: '/Android基础知识/b四大组件/startActivityForResult被弃用' },
          ]
        }
      ],
      '/Android基础知识/cFragment/':[
        {
          text: "Fragment",
          items: [
            { text: 'Fragment简单使用', link: '/Android基础知识/cFragment/Fragment简单使用' },
            { text: 'Fragment的生命周期', link: '/Android基础知识/cFragment/Fragment的生命周期' },
            { text: 'FragmentManager', link: '/Android基础知识/cFragment/FragmentManager' },
            { text: 'Activity和Fragment的通信方式', link: '/Android基础知识/cFragment/Activity和Fragment的通信方式' },
          ]
        }
      ],
      '/Android基础知识/dView/':[
        {
          text: "View",
          items: [
            { text: '1.ViewPager和ViewPager2的区别', link: '/Android基础知识/dView/1.ViewPager和ViewPager2的区别' },
            { text: '2.RecyclerView的预拉取机制（转载总结）', link: '/Android基础知识/dView/2.RecyclerView的预拉取机制（转载总结）' },
            { text: '3.RecyclerView缓存失效的情况', link: '/Android基础知识/dView/3.RecyclerView缓存失效的情况' },
            { text: '5.嵌套RecyclerView的缓存池共用', link: '/Android基础知识/dView/5.嵌套RecyclerView的缓存池共用' },
            { text: '6.自定义View', link: '/Android基础知识/dView/6.自定义View' },
            { text: '7.Window',link: '/Android基础知识/dView/7.Window'},
            { text: '8.xml文件是如何转换成View对象的', link: '/Android基础知识/dView/8.xml文件是如何转换成View对象的' },
            { text: '9.滑动冲突', link: '/Android基础知识/dView/9.滑动冲突' },
            { text: '10.View的事件分发', link: '/Android基础知识/dView/10.View的事件分发' },
            { text: '11.动画', link: '/Android基础知识/dView/11.动画' },
            { text: '12.布局常见问题', link: '/Android基础知识/dView/12.布局常见问题' },
            { text: '13.WebView使用简介', link: '/Android基础知识/dView/13.WebView使用简介' },
          ]
        }
      ],
        '/Android基础知识/e多线程/':[
          {
            text: "多线程",
            items: [
              { text: '实现多线程', link: '/Android基础知识/e多线程/1.实现多线程' },
              { text: '线程创建的开销', link: '/Android基础知识/e多线程/2.线程创建的开销' },
              { text: 'Java线程池', link: '/Android基础知识/e多线程/3.Java线程池' },
              { text: '线程相关问题', link: '/Android基础知识/e多线程/4.线程相关问题' },
              { text: 'Android中的线程池', link: '/Android基础知识/e多线程/5.Android中的线程池' },
              { text: 'ThreadLocal',link: '/Android基础知识/e多线程/6.ThreadLocal'},
              { text: '7.1Handler的常见应用场景', link: '/Android基础知识/e多线程/7.1Handler的常见应用场景' },
              { text: '7.2同步消息屏障', link: '/Android基础知识/e多线程/7.2同步消息屏障' },
              { text: '7.Handler异步消息机制', link: '/Android基础知识/e多线程/7.Handler异步消息机制' },
              { text: '8.HandlerThread', link: '/Android基础知识/e多线程/8.HandlerThread' },
              { text: 'startActivityForResult被弃用', link: '/Android基础知识/e多线程/7.1Handler的常见应用场景' },
              { text: 'startActivityForResult被弃用', link: '/Android基础知识/e多线程/7.1Handler的常见应用场景' },
              
            ]
          }
      ],

      '/dart/': [
        {
          text: "Dart语言",
          items: [
            { text: 'mac下flutter环境配置', link: '/dart/mac下flutter环境配置' },
            { text: 'Dart环境安装', link: '/dart/Dart环境安装' },
            { text: 'Dart基础', link: '/dart/Dart基础' },
            { text: 'Dart语言进阶', link: '/dart/Dart语言进阶' },
            { text: '异步支持', link: '/dart/异步支持' }
          ]
        }
        ],
        '/开源框架/网络请求/': [
          {
            text: "网络请求",
            items: [
              { text: '网络请求的历史渊源', link: '/开源框架/网络请求/网络请求的历史渊源' },
              { text: '网络请求与JSON解析', link: '/开源框架/网络请求/网络请求与JSON解析' },
              { text: '网络请求之okhttp框架', link: '/开源框架/网络请求/网络请求之okhttp框架' }
            ],
          }
          ],

          '/开源框架/RxJava/': [
            {
              text :"RxJava",
              items: [
                { text: '1.RxJava2简介与使用', link: '/开源框架/RxJava/1.RxJava2简介与使用' },
                { text: '2.RxJava2核心实现-操作符', link: '/开源框架/RxJava/2.RxJava2核心实现-操作符' },
                { text: '3.RxJava2核心实现-线程调度', link: '/开源框架/RxJava/3.RxJava2核心实现-线程调度' },
                { text: '4.RxJava2框架设计', link: '/开源框架/RxJava/4.RxJava2框架设计' },
                { text: '5.RxJava2内存泄漏', link: '/开源框架/RxJava/5.RxJava2内存泄漏' },
                { text: '6.RxJava2手写RxBus', link: '/开源框架/RxJava/6.RxJava2手写RxBus' },
                { text: '7.RxJava2之衍生框架', link: '/开源框架/RxJava/7.RxJava2之衍生框架' },
              ],
            }
            ],
          '/Java/': [
            {
              text: "Java",
              items: [
                { text: 'Java的抽象类和接口', link: '/Java/Java的抽象类和接口' },
                { text: 'Java特性', link: '/Java/2.Java特性' },
                { text: '3.Java数据类型', link: '/Java/3.Java数据类型' },
                { text: '5.Java序列化', link: '/Java/5.Java序列化' },
                { text: '6.Java内部类（转载）', link: '/Java/6.Java内部类（转载）' },
                { text: '5.Java序列化', link: '/Java/5.Java序列化' },
                { text: '7.1Java集合', link: '/Java/7.1Java集合' },
                { text: '7.2Java集合框架', link: '/Java/7.2Java集合框架' },
                { text: '7.3Java集合概述(上)', link: '/Java/7.3Java集合概述(上)' },
                { text: '7.4Java常见面试题题总结（下）', link: '/Java/7.4Java常见面试题题总结（下）' },
                { text: '7.5HashMap的实现原理', link: '/Java/7.5HashMap的实现原理' },
                { text: '7.6ConcurrentHashMap', link: '/Java/7.6ConcurrentHashMap' },
                { text: '7.Java集合体系', link: '/Java/7.Java集合体系' },
                { text: '8.Java中的异常体系', link: '/Java/8.Java中的异常体系' },
                { text: '9.1Java Memory Model', link: '/Java/9.1Java Memory Model' },
                { text: '9.2Java虚拟机', link: '/Java/9.2Java虚拟机' },
                { text: '9.3Java虚拟机的内存结构', link: '/Java/9.3Java虚拟机的内存结构' },
                { text: '9.4Java的类加载机制（转载总结）', link: '/Java/9.4Java的类加载机制（转载总结）' },
                { text: '9.5Java的类加载器', link: '/Java/9.5Java的类加载器' },
                { text: '10.JavaGC回收机制', link: '/Java/10.JavaGC回收机制' },
                { text: '11.1Java多线程理论基础', link: '/Java/11.1Java多线程理论基础' },
                { text: '11.2Java多线程基础知识', link: '/Java/11.2Java多线程基础知识' },
                { text: '11.3Java多线程之详解synchronized关键字', link: '/Java/11.3Java多线程之详解synchronized关键字' },
                { text: '11.4Java多线程之详解CAS', link: '/Java/11.4Java多线程之详解CAS' },
                { text: '11.5Java多线程死锁与死锁的避免', link: '/Java/11.5Java多线程死锁与死锁的避免' },
                { text: '11.Java多线程', link: '/Java/11.Java多线程' },
                { text: '12.Java的强软弱虚', link: '/Java/12.Java的强软弱虚' },
                { text: '13.Java注解', link: '/Java/13.Java注解' },
                { text: 'Java的抽象类和接口', link: '/Java/Java的抽象类和接口' },
                { text: 'Java的抽象类和接口', link: '/Java/Java的抽象类和接口' },
              ]
            }
          ],
          '/Flutter/': [
            {
                text: "Flutter基础",
                items: [
                  { text: '基础控件使用', link: '/Flutter/1.控件' },
                  { text: 'Scaffold的使用', link: '/Flutter/1.Scaffold的实践' },
                  { text: '常用布局', link: '/Flutter/3.布局' },
                  { text: '手势处理', link: '/Flutter/4.手势' },
                  { text: '组件化开发', link: '/Flutter/5.组件化开发' },
                  { text: '导包', link: '/Flutter/6.导包' },
                  { text: 'Retrofit', link: '/Flutter/7.Retrofit' },
                  { text: 'dio框架', link: '/Flutter/8.dio框架' },
                  { text: '跳转和生命周期', link: '/Flutter/9.跳转和生命周期' },
                  { text: '开发技巧', link: '/Flutter/10.开发技巧' },
                  { text: '组件化开发', link: '/5.组件化开发' },
                  { text: '组件化开发', link: '/5.组件化开发' },
                ]
              }
          ],
          '/Compose/': [
            {
                text: "Compose",
                items: [
                  { text: '1Compose入门', link: '/Compose/8.1Compose入门' },
                  { text: '8.2Compose布局', link: '/Compose/8.2Compose布局' },
                  { text: '8.3Compose状态', link: '/Compose/8.3Compose状态' },
                  { text: '8.4Compose的隐式传参', link: '/Compose/8.4Compose的隐式传参' },
                  { text: '8.5Compose的主题（未完）', link: '/Compose/8.5Compose的主题（未完）' }
                ]
              }
          ],
      }
    ,
    //友链
    socialLinks: [
      { icon: 'github', link: 'https://github.com/starrylixu' },
      { icon: 'x', link: 'https://ahoy-starry.blog.csdn.net' }
    ]
  }
})
