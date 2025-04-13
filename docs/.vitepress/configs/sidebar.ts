import type { DefaultTheme } from 'vitepress'

import { setSidebar } from '../tool/gen_sidebar'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/info': [
    {
      text: '案例bbb',
      collapsed: true,
      items: [
        { text: 'Markdown案例', link: '/test' },
        { text: 'Runtime API Examples', link: '/test' },
      ],
    },
  ],

  '/test': [
    {
      text: '案例aaaa',
      collapsed: true,
      items: setSidebar('/docs/info/'),
    },
  ],
}

export default sidebar
