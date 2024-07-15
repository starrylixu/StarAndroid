import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  //最后更新时间戳
 lastUpdated: true,
  title: "StarAndroid",
  description: "一个移动开发学习网站",
  themeConfig: {
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
          { text: '快速入门', link: '/a快速入门/1.Android第一课' },
          { text: '四大组件', link: '/b四大组件/『初入茅庐』- 四大组件之ContentProvider' },
          { text: 'Fragment', link: '/dart/Dart基础' },
          { text: 'View', link: '/Java/2.Java特性' },
          { text: '多线程', link: '/Kotlin/协程' }
        ]
      },
      { text: 'Flutter', link: '/Flutter/1.控件' },
      { text: '开发工具', link: '/开发工具/Git使用指南' },
      {
        text: '语言学习',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'Dart', link: '/dart/Dart基础' },
          { text: 'Java', link: '/Java/2.Java特性' },
          { text: 'Kotlin', link: '/Kotlin/协程' }
        ]
      }
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
        '/开发框架/': [
          {
            text: "开发框架",
            items: [
              { text: '网络请求的历史渊源', link: '/开发框架/网络请求的历史渊源' },
              { text: '网络请求与JSON解析', link: '/开发框架/网络请求与JSON解析' },
              { text: '网络请求之okhttp框架', link: '/开发框架/网络请求之okhttp框架' }
            ]
          }
          ],
          '/Java/': [
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
            '/Flutter/': [
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
      }
    ,
    //友链
    socialLinks: [
      { icon: 'github', link: 'https://github.com/starrylixu' },
      { icon: 'x', link: 'https://ahoy-starry.blog.csdn.net' }
    ]
  }
})
