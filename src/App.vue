<template>
  <div class="app-container">
    <!-- 顶部导航栏（在全屏模式下隐藏） -->
    <div v-if="!isFullScreen" class="nav-container">
    <el-menu
      mode="horizontal"
      background-color="#409EFF"
      text-color="#fff"
      active-text-color="#ffd04b"
      :default-active="activeMenu"
      router
    >
      <el-menu-item index="/">首页</el-menu-item>
      
      <!-- 管理员功能 -->
      <el-sub-menu v-if="authStore.isAdmin" index="system">
        <template #title>系统管理</template>
        <el-menu-item index="/dp">数据大屏</el-menu-item>
        <el-menu-item index="/test">测试</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="/about">关于系统</el-menu-item>
      
      <!-- 添加内嵌页面入口 -->
      <el-menu-item v-if="authStore.isAuthenticated" index="/embedded">
        <el-icon><Connection /></el-icon>
        <span>管理员面板</span>
      </el-menu-item>
      
      <!-- 登录状态 -->
      <div class="user-info">
        <el-dropdown v-if="authStore.isAuthenticated">
          <span class="el-dropdown-link">
            <el-avatar :size="30" style="margin-right: 8px" src="tx.jpg" />
            {{ authStore.userName }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="authStore.logout()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <div v-else>
          <el-button type="text" @click="showRegisterDialog">注册</el-button>
          <el-button type="primary" @click="showLoginDialog">登录</el-button>
        </div>
      </div>
    </el-menu>
    </div>
    <!-- 主要内容区 -->
    <div class="main-content" :class="{ 
      'full-screen': isFullScreen,
      'no-padding': $route.path === '/embedded'  // 为内嵌页面移除内边距
    }">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import router from './router'
// 导入Connection图标
import { Connection } from '@element-plus/icons-vue'

const route = useRoute()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)

// 检查当前路由是否需要全屏显示
const isFullScreen = computed(() => route.meta.fullScreen || false)

const showLoginDialog = () => {
  router.push('/login')
}

const showRegisterDialog = () => {
  router.push('/register')
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* 改为白色背景 */
  background: transparent !important;
}

.nav-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  width: 100%;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
  /* 内容区背景也设为白色 */
  background: transparent !important;
  padding-top: 60px !important;
}

/* 全屏模式下的样式 */
.main-content.full-screen {
  padding: 0 !important;
  height: 100vh;
  /* 全屏模式保持深色背景 */
  /* background: linear-gradient(135deg, #0c1a3d, #162d5e); */
  background: transparent !important;
}


/* 添加内嵌页面无内边距样式 */
.main-content.no-padding {
  padding: 0 !important;
}

.user-info {
  position: absolute;
  right: 20px;
  top: 10px;
  display: flex;
  align-items: center;
  color: white;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
}

/* 恢复导航栏天蓝色背景 */
.el-menu {
  background-color: #409EFF !important;
}
</style>