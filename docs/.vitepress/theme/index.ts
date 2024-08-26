import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import './global.css'
import codeblocksFold from 'vitepress-plugin-codeblocks-fold'; // 导入方法
import 'vitepress-plugin-codeblocks-fold/style/index.css'; // 导入样式
import giscusTalk from 'vitepress-plugin-comment-with-giscus'

export default {
  extends: DefaultTheme,

  setup() {
    const route = useRoute()
    const initZoom = () => {
      // 为所有图片增加缩放功能
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )

    //代码块折叠
    const { frontmatter } = useData();// 获取前言和路由
    codeblocksFold({ route, frontmatter }, true, 400);


    // 评论组件 - https://giscus.app/
    giscusTalk({
        repo: 'starrylixu/StarAndroid',
        repoId: 'R_kgDOMV61Ig',
        category: 'General', // 默认: `General`
        categoryId: 'DIC_kwDOMV61Is4Ch7OL',
        mapping: 'pathname', // 默认: `pathname`
        inputPosition: 'top', // 默认: `top`
        lang: 'zh-CN', // 默认: `zh-CN`
        // i18n 国际化设置（注意：该配置会覆盖 lang 设置的默认语言）
        // 配置为一个对象，里面为键值对组：
        // [你的 i18n 配置名称]: [对应 Giscus 中的语言包名称]
        locales: {
            'zh-Hans': 'zh-CN',
            'en-US': 'en'
        },
        homePageShowComment: false, // 首页是否显示评论区，默认为否
        lightTheme: 'light', // 默认: `light`
        darkTheme: 'transparent_dark', // 默认: `transparent_dark`
        // ...
    }, {
        frontmatter, route
    },
        // 是否全部页面启动评论区。
        // 默认为 true，表示启用，此参数可忽略；
        // 如果为 false，表示不启用。
        // 可以在页面使用 `comment: true` 前言单独启用
        true
    );
  }
}

