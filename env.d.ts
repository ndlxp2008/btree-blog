/// <reference types="vitepress/client" />

import { DefaultTheme } from 'vitepress'

declare module 'vitepress' {
  export namespace DefaultTheme {
    export interface Config {
      /**
       * 访客统计配置
       */
      visitor?: {
        badgeId: string
      }
    }
  }
}
