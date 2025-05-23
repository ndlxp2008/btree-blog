<script setup lang="ts">
import { useData, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, provide, computed } from 'vue'
import Giscus from '@giscus/vue'

import { usePageId } from '../composables'

import MNavVisitor from './MNavVisitor.vue'
import MDocFooter from './MDocFooter.vue'
import MGoTop from './MGoTop.vue'
import MDHBackgroud from './MDHBackgroud.vue'

const { Layout } = DefaultTheme
const { isDark, theme, frontmatter, page } = useData()
const pageId = usePageId()

const { comment } = theme.value

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

function updateMetaThemeColor() {
  if (inBrowser) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')!
    // #1b1b1f 是 vitepress 在 dark 模式下的背景色
    metaThemeColor.setAttribute('content', isDark.value ? '#1b1b1f' : '#3eaf7c')
  }
}

updateMetaThemeColor()

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    updateMetaThemeColor()
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )}px at ${x}px ${y}px)`,
  ]

  // @ts-ignore
  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    updateMetaThemeColor()
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    },
  )
})
</script>
<template>
  <Layout v-bind="$attrs">
    <!--
      相关插槽
      https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
      https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/Layout.vue
    -->
    <template #home-hero-after>
      <MDHBackgroud />
    </template>
    <template #nav-bar-title-after>
      <MNavVisitor />
    </template>
    <template #doc-after>
      <MDocFooter />
    </template>
    <template #doc-footer-before>
      <MGoTop />
    </template>
  </Layout>
</template>
<style>
.prev-next.prev-next {
  border-top: none;
}

.doc-comments {
  margin-top: 24px;
  margin-bottom: 48px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 24px;
}
</style>