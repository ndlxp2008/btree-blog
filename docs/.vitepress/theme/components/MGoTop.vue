<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const scrollThreshold = 300 // 滚动多少距离后显示按钮

// 监听滚动事件
const handleScroll = () => {
  visible.value = window.scrollY > scrollThreshold
}

// 回到顶部方法
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 初始检查
  handleScroll()
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
<template>
  <div class="go-top-button" :class="{ 'visible': visible }" @click="scrollToTop" title="回到顶部">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z" />
    </svg>
  </div>
</template>
<style scoped>
.go-top-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--vp-c-brand);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s;
  z-index: 100;
}

.go-top-button.visible {
  opacity: 0.9;
  transform: translateY(0);
}

.go-top-button:hover {
  opacity: 1;
  background-color: var(--vp-c-brand-dark);
}

.go-top-button svg {
  fill: currentColor;
}
</style>