<script setup lang="ts">
import { inject, Ref, computed } from 'vue'
import { useData } from 'vitepress'
import { useSidebar } from 'vitepress/theme'

import { usePageId } from '../composables'

const DEV = inject<Ref<boolean>>('DEV')
const { theme } = useData()
const { footer, visitor } = theme.value

const { hasSidebar } = useSidebar()
const pageId = usePageId()
const isDocFooterVisible = computed(() => {
  return !DEV || footer.message || footer.copyright || visitor.badgeId
})
</script>
<template>
  <div v-if="isDocFooterVisible" class="m-doc-footer-wrapper">
    <div v-show="hasSidebar" class="m-doc-footer">
      <div class="footer-content">
        <div class="left-section">
          <div class="visitor-container">
            <img v-if="!DEV && visitor" class="visitor"
              :src="`https://visitor-badge.laobi.icu/badge?page_id=${visitor.badgeId}.${pageId}`"
              title="当前页面累计访问数"
              @error="handleImageError" />
          </div>
          <div v-if="footer?.message" class="footer-message">
            {{ footer.message }}
          </div>
        </div>
        
        <div v-if="footer?.copyright" class="copyright-section">
          <span class="copyright-icon">©</span>
          <span class="copyright-text">{{ footer.copyright }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.m-doc-footer-wrapper {
  background: linear-gradient(to right, var(--vp-c-bg-soft) 30%, transparent);
  backdrop-filter: blur(8px);
  border-radius: 12px 12px 0 0;
  margin-top: 2rem;
}

.m-doc-footer {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 2rem;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.visitor-container {
  position: relative;
  padding: 4px;
  background: var(--vp-c-bg);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.visitor {
  height: 28px;
  transition: transform 0.2s;
}

.visitor:hover {
  transform: scale(1.05);
}

.footer-message {
  font-size: 0.925rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  padding: 6px 12px;
  background: var(--vp-c-mute);
  border-radius: 6px;
}

.copyright-section {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
}

.copyright-icon {
  font-size: 1.1em;
  margin-right: 4px;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .left-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .visitor {
    margin: 0 auto;
  }
  
  .footer-message {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .m-doc-footer {
    padding: 1rem;
  }
  
  .copyright-section {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>