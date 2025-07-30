import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/services/api'
import type { AxiosError } from 'axios'

interface UserInfo {
  userId: string
  userName: string
  isAdmin: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  // 状态管理
  const user = ref<UserInfo | null>(
    JSON.parse(localStorage.getItem('userInfo') || 'null')
  )
  const isInitialized = ref(false)
  
  // 计算属性
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.isAdmin === true)
  const userName = computed(() => user.value?.userName || '')
  
  // 初始化认证状态
  const initialize = async () => {
    try {
      await fetchUser()
    } catch (error) {
      console.error('初始化失败:', error)
    }
    isInitialized.value = true
  }
  
  // 获取用户信息
  const fetchUser = async () => {
    try {
      const response = await api.get('/api/auth/me')
      user.value = {
        userId: response.data.userId || '',
        userName: response.data.userName || '',
        isAdmin: Boolean(response.data.isAdmin) // 确保转换为布尔值
    };
      localStorage.setItem('userInfo', JSON.stringify(user.value));
      } catch (error) {
      const err = error as AxiosError
      if (err.response?.status !== 401) {
        ElMessage.error('获取用户信息失败')
      }
      user.value = null
      localStorage.removeItem('userInfo')
    }
  }
  
  // 用户登录
  const login = async (credentials: { userId: string; userPassword: string }) => {
    try {
      const formData = new FormData()
      formData.append('userId', credentials.userId)
      formData.append('userPassword', credentials.userPassword)
      
      const response = await api.post('/api/auth/login', formData)
      
      if (response.status === 200) {
        await fetchUser()
        ElMessage.success(`欢迎回来，${user.value?.userName || '用户'}！`)
        
        const redirect = router.currentRoute.value.query.redirect
        router.push(redirect ? redirect.toString() : '/')
        
        return true
      }
    } catch (error) {
      const err = error as AxiosError
      let errorMessage = '登录失败，请重试'
      
      if (err.response?.status === 401) {
        errorMessage = '用户名或密码错误'
      } else if (!window.navigator.onLine) {
        errorMessage = '网络连接已断开'
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = '请求超时'
      }
      
      ElMessage.error(errorMessage)
      return false
    }
    return false
  }
  
  // 用户注册
  const register = async (data: {
    userId: string
    userName: string
    userPassword: string
    phone: string
    email: string
  }) => {
    try {
      const response = await api.post('/api/users/register', data)
      ElMessage.success('注册成功，请登录')
      return response.data
    } catch (error) {
      const err = error as AxiosError
      let errorMessage = '注册失败'
      
      if (err.response?.status === 400) {
        errorMessage = '输入信息不合法'
      } else if (err.response?.status === 409) {
        errorMessage = '用户ID或邮箱已被注册'
      }
      
      ElMessage.error(errorMessage)
      throw err
    }
  }
  
  // 退出登录
  const logout = async (redirectPath = '/login') => {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.warn('登出请求失败:', error)
    }
    
    user.value = null
    localStorage.removeItem('userInfo')
    
    if (router.currentRoute.value.path !== redirectPath) {
      router.push(redirectPath)
    }
    
    ElMessage.info('您已安全退出系统')
  }
  
  return {
    user,
    isInitialized,
    isAuthenticated,
    isAdmin,
    userName,
    initialize,
    login,
    register,
    logout,
    fetchUser
  }
})