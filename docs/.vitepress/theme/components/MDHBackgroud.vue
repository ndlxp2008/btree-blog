<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const { isDark } = useData()
const route = useRoute()

// 只在首页显示
const isHomePage = computed(() => {
  return route.path === '/' || route.path === '/vitepress-nav-template/'
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null

// 波浪配置
const waves = [
  { amplitude: 40, frequency: 0.02, speed: 0.5, color: '#3eaf7c', opacity: 0.3 },
  { amplitude: 15, frequency: 0.03, speed: 0.7, color: '#3eaf7c', opacity: 0.2 },
  { amplitude: 30, frequency: 0.04, speed: 0.9, color: '#3eaf7c', opacity: 0.1 }
]

// 暗色模式下的波浪颜色
const darkWaves = [
  { amplitude: 40, frequency: 0.02, speed: 0.5, color: '#4abf8a', opacity: 0.3 },
  { amplitude: 15, frequency: 0.03, speed: 0.7, color: '#4abf8a', opacity: 0.2 },
  { amplitude: 30, frequency: 0.04, speed: 0.9, color: '#4abf8a', opacity: 0.1 }
]

// 技术关键词
const keywords = ref([
  { text: 'Vue', x: 0, y: 0, speed: 0.2, opacity: 0, targetOpacity: 1, fontSize: 14 },
  { text: 'Webpack', x: 0, y: 0, speed: 0.15, opacity: 0, targetOpacity: 1, fontSize: 15 },
  { text: 'Vite', x: 0, y: 0, speed: 0.25, opacity: 0, targetOpacity: 1, fontSize: 14 },
  { text: 'TypeScript', x: 0, y: 0, speed: 0.35, opacity: 0, targetOpacity: 1, fontSize: 18 },
  { text: 'Node.js', x: 0, y: 0, speed: 0.2, opacity: 0, targetOpacity: 1, fontSize: 16 },
  { text: 'CSS', x: 0, y: 0, speed: 0.4, opacity: 0, targetOpacity: 1, fontSize: 14 },
  { text: 'HTML', x: 0, y: 0, speed: 0.3, opacity: 0, targetOpacity: 1, fontSize: 15 },
  { text: 'Java', x: 0, y: 0, speed: 0.18, opacity: 0, targetOpacity: 1, fontSize: 16 },
  { text: 'Python', x: 0, y: 0, speed: 0.32, opacity: 0, targetOpacity: 1, fontSize: 17 },
  { text: 'Docker', x: 0, y: 0, speed: 0.26, opacity: 0, targetOpacity: 1, fontSize: 14 },
  { text: 'Git', x: 0, y: 0, speed: 0.38, opacity: 0, targetOpacity: 1, fontSize: 15 },
  { text: 'SQL', x: 0, y: 0, speed: 0.19, opacity: 0, targetOpacity: 1, fontSize: 16 },
  { text: 'Spring Boot', x: 0, y: 0, speed: 0.22, opacity: 0, targetOpacity: 1, fontSize: 17 },
  { text: 'Spring Cloud', x: 0, y: 0, speed: 0.28, opacity: 0, targetOpacity: 1, fontSize: 16 },
  { text: 'MyBatis', x: 0, y: 0, speed: 0.17, opacity: 0, targetOpacity: 1, fontSize: 15 },
  { text: 'Kafka', x: 0, y: 0, speed: 0.33, opacity: 0, targetOpacity: 1, fontSize: 16 },
  { text: 'Redis', x: 0, y: 0, speed: 0.29, opacity: 0, targetOpacity: 1, fontSize: 15 },
  { text: 'Nginx', x: 0, y: 0, speed: 0.36, opacity: 0, targetOpacity: 1, fontSize: 14 },
])

// 获取当前波浪配置
const currentWaves = computed(() => {
  return isDark.value ? darkWaves : waves
})

// 获取当前关键词颜色
const keywordColor = computed(() => {
  return isDark.value ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'
})

let time = 0
let canvasWidth = 0
let canvasHeight = 0

// 初始化关键词位置
const initializeKeywords = () => {
  keywords.value.forEach(kw => {
    kw.x = Math.random() * canvasWidth
    kw.y = Math.random() * (canvasHeight - 150) + 50 // 限制在波浪区域内
    kw.opacity = 0
    kw.targetOpacity = Math.random() * 0.5 + 0.3 // 目标透明度
  })
}

// 绘制波浪和关键词
const drawWaves = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清空画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // 绘制每一层波浪
  currentWaves.value.forEach(wave => {
    ctx.beginPath()
    ctx.fillStyle = wave.color
    ctx.globalAlpha = wave.opacity
    ctx.moveTo(0, canvasHeight)
    for (let x = 0; x <= canvasWidth; x += 5) {
      const y = canvasHeight - 100 - wave.amplitude * Math.sin(x * wave.frequency + time * wave.speed)
      ctx.lineTo(x, y)
    }
    ctx.lineTo(canvasWidth, canvasHeight)
    ctx.lineTo(0, canvasHeight)
    ctx.closePath()
    ctx.fill()
  })

  // 绘制关键词
  ctx.fillStyle = keywordColor.value
  ctx.font = 'bold 16px Arial'
  keywords.value.forEach(kw => {
    // 计算基于最上层波浪的 Y 位置 (简化处理，取第一个波浪)
    const wave = currentWaves.value[0]
    const waveY = canvasHeight - 100 - wave.amplitude * Math.sin(kw.x * wave.frequency + time * wave.speed)

    // 更新位置和透明度
    kw.x += kw.speed
    if (kw.x > canvasWidth + 50) { // 漂出右边
      kw.x = -50 // 从左边重新进入
      kw.y = Math.random() * (canvasHeight - 150) + 50
      kw.opacity = 0 // 重新进入时隐藏
      kw.targetOpacity = Math.random() * 0.5 + 0.3
    }

    // 时隐时现效果 (透明度渐变)
    if (Math.abs(kw.opacity - kw.targetOpacity) > 0.01) {
      kw.opacity += (kw.targetOpacity - kw.opacity) * 0.02 // 缓慢变化
    } else if (Math.random() < 0.005) { // 随机改变目标透明度
      kw.targetOpacity = kw.targetOpacity > 0.3 ? 0 : Math.random() * 0.5 + 0.3
    }

    ctx.globalAlpha = kw.opacity
    ctx.font = `bold ${kw.fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText(kw.text, kw.x, waveY - kw.fontSize / 2) // 绘制在波浪上方一点
  })

  // 恢复默认透明度
  ctx.globalAlpha = 1.0

  // 更新时间
  time += 0.05

  // 请求下一帧动画
  animationFrameId = requestAnimationFrame(drawWaves)
}

// 调整画布大小
const resizeCanvas = () => {
  if (!canvasRef.value) return

  canvasWidth = window.innerWidth
  canvasHeight = 300 // 固定高度或根据需要调整

  canvasRef.value.width = canvasWidth
  canvasRef.value.height = canvasHeight

  // 重新初始化关键词位置
  initializeKeywords()
}

onMounted(() => {
  if (isHomePage.value) {
    resizeCanvas() // 会调用 initializeKeywords
    drawWaves()

    window.addEventListener('resize', resizeCanvas)
  }
})

onBeforeUnmount(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }

  window.removeEventListener('resize', resizeCanvas)
})
</script>
<template>
  <div v-if="isHomePage" class="ocean-background">
    <canvas ref="canvasRef" class="ocean-canvas"></canvas>
  </div>
</template>
<style scoped>
.ocean-background {
  position: absolute;
  width: 100%;
  height: 300px;
  left: 0;
  top: 0;
  z-index: -1;
  overflow: hidden;
}

.ocean-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
</style>