import { createRouter, createWebHistory } from 'vue-router'
import UserManagement from '@/views/UserManagement.vue'
import HomePage from '@/views/HomePage.vue'
import AboutPage from '@/views/AboutPage.vue'
import ErrorPage from '@/views/ErrorPage.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LargeScreen from '@/views/LargeScreen.vue'
import { useAuthStore } from '@/stores/authStore'
import { ElMessage } from 'element-plus'
import LargeScreenError from '@/views/LargeScreenError.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    meta: { requiresAuth: false }
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, requiresAdmin: true, fullScreen: true }
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: AboutPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/dp',
    name: 'LargeScreen',
    component: LargeScreen,
    meta: { 
      requiresAuth: false,
      fullScreen: true
     }
  },
  {
    path: '/dp3',
    name: 'LargeScreenError',
    component: LargeScreenError,
    meta: { 
      requiresAuth: false,
      fullScreen: true
     }
  },
  {
    path: '/test',
    name: 'TestScreen',
    component: () => import('@/views/TestScreen.vue'),
    meta: { 
      requiresAuth: false,
      fullScreen: true
    }
  },
  // 添加新路由
  {
    path: '/embedded',
    name: 'EmbeddedView',
    component: () => import('@/views/EmbeddedView.vue'),
    meta: { 
      requiresAuth: true, // 需要登录
      fullScreen: false   // 非全屏模式
    }
  },
  {
    path: '/404',
    name: 'ErrorPage',
    component: ErrorPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // 初始化认证状态
  if (!authStore.isInitialized) {
    await authStore.initialize();
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ 
      path: '/login', 
      query: { redirect: to.fullPath } 
    })
  } 
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    ElMessage.warning('您已登录，无需重复操作')
  }
  else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
    ElMessage.error('需要管理员权限')
  } 
  else {
    next()
  }
})

export default router