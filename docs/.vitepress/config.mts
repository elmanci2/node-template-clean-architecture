import { defineConfig } from 'vitepress'
import routes from '../routes/index.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "api-doc",
  description: "a api documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: routes,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
