import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "StarAndroid",
  description: "一个移动开发学习网站",
  themeConfig: {
    logo: '/logo.svg',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You'
    },
    editLink: {
      pattern: 'https://github.com/starrylixu/StarAndroid/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: 'Android', link: '/markdown-examples' },
      { text: 'Flutter', link: '/Flutter/1.控件' },
      {
        text: '语言学习',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: '目录大纲', link: '/目录大纲' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Android',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: '目录大纲', link: '/目录大纲' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/starrylixu' },
      { icon: 'x', link: 'https://ahoy-starry.blog.csdn.net' }
    ]
  }
})
