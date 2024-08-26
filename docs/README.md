# StarAndroid

## 项目介绍

这是一个使用vitepress搭建的个人博客网站

[VitePress | 由 Vite 和 Vue 驱动的静态站点生成器](https://vitepress.dev/zh/)

### 自动生成生成侧边栏

[VitePress Auto SideBar Plugin](https://vitepress-auto-sidebar-plugin.netlify.app/)

安装插件之后，只需要在config文件中，配置相关参数即可

```cmd
npm install vitepress-auto-sidebar-plugin --save-dev
```

### 图片放大

[vuepress-plugin-medium-zoom ](https://vuepress-community.netlify.app/zh/plugins/medium-zoom/#安装)

图片支持点击缩放

```cmd
npm install -D vuepress-plugin-medium-zoom
```

新建`docs/.vitepress/theme/index.ts`，添加如下代码

```typescript{2-4}
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import './global.css'

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
  }
}
```

这时候，点击图片放大的功能已经实现了，但是效果不尽如人意，会被其他层级的元素遮挡图片(*例如左侧的导航栏*)，所以需要修改一下样式

新建`docs/.vitepress/theme/global.css`，添加如下样式代码，然后在`docs/.vitepress/theme/index.ts`引入它

```css
.medium-zoom-overlay {
  background-color: var(--vp-c-bg) !important;
  z-index: 100;
}

.medium-zoom-overlay ~ img {
  z-index: 101;
}

.medium-zoom--opened .medium-zoom-overlay {
  opacity: 0.9 !important;
}
```

### 代码块行数

全局配置

```typescript
export default defineConfig({

  vite: {
    plugins:[
      AutoSidebarPlugin({
        srcDir:'./docs'
      })
    ]
  },
  markdown:{
    lineNumbers:true//代码块显示行数
  },
})
```

### 代码块折叠

install

```
npm i vitepress-plugin-codeblocks-fold
```

use

```ts{}
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme';
import { useData, useRoute } from 'vitepress';
import codeblocksFold from 'vitepress-plugin-codeblocks-fold'; // import method
import 'vitepress-plugin-codeblocks-fold/style/index.css'; // import style

export default {
    ...DefaultTheme,
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp(ctx);
        // ...
    },
    setup() {
        // get frontmatter and route
        const { frontmatter } = useData();
        const route = useRoute();
        // basic use
        codeblocksFold({ route, frontmatter }, true, 400);
    }
};
```

### 评论区

[Giscus | 评论插件 ](https://vuepress-theme-hope.github.io/v1/comment/zh/guide/giscus.html)

准备工作：

1. 你需要创建一个公开仓库，并开启评论区，以作为评论存放的地点
2. 你需要安装 [Giscus App (opens new window)](https://github.com/apps/giscus)，使其有权限访问对应仓库，不要忘了这一步哦。

在完成以上步骤后，请前往 [Giscus 页面 (opens new window)](https://giscus.app/zh-CN)获得你的设置。你只需要填写仓库和 Discussion 分类，之后滚动到页面下部的 “启用 giscus” 部分，复制 `data-repo`, `data-repo-id`, `data-category` 和 `data-category-id` 四项，因为它们是必须的。

install

```cmd
npm i vitepress-plugin-comment-with-giscus
```

use

```typescript
import DefaultTheme from 'vitepress/theme';
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';
import { toRefs } from "vue";

export default {
    ...DefaultTheme,
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp(ctx);
        // ...
    },
    setup() {
        // 获取前言和路由
        const { frontmatter } = toRefs(useData());
        const route = useRoute();
        
        // 评论组件 - https://giscus.app/
        giscusTalk({
            repo: '你的仓库地址',
            repoId: '你的仓库id',
            category: '你选择的分类', // 默认: `General`
            categoryId: '你的分类id',
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
};
```

如何获取repoId和categoryId，操作文档：[如何获取 Github 仓库的 Repo_id 和 Category_id](https://iling.me/blog/posts/how-to-get-github-repo-id/)

[Explorer - GitHub Docs](https://docs.github.com/en/graphql/overview/explorer)

```json
{
  repository(owner: "starrylixu", name: "StarAndroid") {
    id
    discussionCategories (first: 5) {
      nodes {
        name
        id
      }
    }
  }
}
```


## Android新星学习路线
https://roadmap.sh/android
