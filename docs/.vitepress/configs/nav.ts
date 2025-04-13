import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '导航', link: '/nav/' },
  { text: '主页', link: 'https://www.baidu.com' },
  {
    text: 'GitHub',
    items: [{ text: 'BTREE', link: 'https://github.com/ndlxp2008' }],
  },
  {
    text: 'BTREE',
    link: '/info',
  },
]
