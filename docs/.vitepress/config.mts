import { defineConfig } from 'vitepress'

import AutoSidebarPlugin from 'vitepress-auto-sidebar-plugin'


// https://vitepress.dev/reference/site-config
export default defineConfig({

  vite: {
    plugins:[
      AutoSidebarPlugin({
        srcDir:'./docs',
        title:{
          map:{
            '/Android基础知识': '🎉Android World🎉'
          }
        }
      })
    ]
  },
  markdown:{
    lineNumbers:true,//代码块显示行数
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true
    }
  },
  lastUpdated: true,//最后更新时间戳
  title: "StarAndroid",
  description: "一个移动开发学习网站",
  themeConfig: {
    outline: 'deep',//文章目录显示所有标题
    lastUpdated: {//最近更新时间
      text: '最近更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    logo: '/logo.svg',//网站logo
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    footer: {//文章尾部
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
          { text: '快速入门', link: '/Android基础知识/A-快速入门/1.Android第一课' },
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
      { text: '说明', link: 'README.md' },
    ],

    //侧边栏
    //多级侧边栏
    //https://vitepress.dev/zh/reference/default-theme-sidebar#collapsible-sidebar-groups
    //友链
    socialLinks: [
      { icon: 'github', link: 'https://github.com/starrylixu' },
      { icon: 'x', link: 'https://ahoy-starry.blog.csdn.net' }
    ]
  }
})
