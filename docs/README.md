# android_starry

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



## Android新星学习路线



## Android基础知识

