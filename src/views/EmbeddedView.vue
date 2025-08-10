<template>
  <div class="embedded-container">
    <!-- 左侧导航栏 -->
    <div class="left-sidebar">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          <el-icon><Monitor /></el-icon>
          <span class="font">防火墙页面</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><DataAnalysis /></el-icon>
          <span class="font">用户管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><Setting /></el-icon>
          <span class="font">系统设置</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><HelpFilled /></el-icon>
          <span class="font">帮助文档</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="right-content">
      <iframe 
        ref="contentFrame"
        :src="currentUrl" 
        frameborder="0" 
        style="width: 100%; height: 100%;"
        @load="handleIframeLoad"
      ></iframe>
      <div v-if="loading" class="loading-overlay">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span>页面加载中...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 每个页面独立配置（前端开发人员可修改此处）
const pageConfig = [
  {
    name: '防火墙页面',
    url: '/proxy/fhq/',
  },
  {
    name: '用户管理',
    url: '/users',
  },
  {
    name: '系统设置',
    url: '/xt',
  },
  {
    name: '帮助文档',
    url: '/help',
  }
]

const activeIndex = ref('1')
const loading = ref(true)

const currentUrl = computed(() => {
  return pageConfig[parseInt(activeIndex.value) - 1].url
})

const handleSelect = (index: string) => {
  activeIndex.value = index
  loading.value = true
}

const handleIframeLoad = () => {
  loading.value = false
}
</script>

<style scoped>
.embedded-container {
  position: fixed; 
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
}

.font {
  color: #ffffff;
}

.el-menu-item {
  background-color: #0B4187 !important
}

.left-sidebar {
  width: 220px;
  background: #0D4594 !important;
  border-right: 1px solid #e6e6e6;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.el-menu-vertical {
  border-right: none;
  flex-grow: 0;
}

.right-content {
  flex: 1;
  height: 100%;
  background-color: #f5f7fa;
  position: relative;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-icon {
  font-size: 40px;
  margin-bottom: 10px;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>