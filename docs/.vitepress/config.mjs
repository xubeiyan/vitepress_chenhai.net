import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  head: [['link', { rel: 'icon', href: '/icons/university.svg' }]],
  // cleanUrls: true,
  appearance: 'dark',
  outDir: '../dist',
  title: "Chenhai University",
  description: "University of TASA",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Research', link: '/research' },
      { text: 'Teacher', link: '/teacher' },
      { text: 'Student', link: '/student' },
      { text: 'Organization', link: '/organization' },
      { text: 'About', link: '/about' },
    ],

    sidebar: [
      {
        text: 'Link',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Research', link: '/research' },
          { text: 'Teacher', link: '/teacher' },
          { text: 'Student', link: '/student' },
          { text: 'Organization', link: '/organization' },
          { text: 'About', link: '/about' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xubeiyan' }
    ],

  }
})
