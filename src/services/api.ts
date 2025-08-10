import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import router from '@/router'

let API_BASE_URL = 'http://localhost:8081'

const getEnvValue = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_BASE_URL || API_BASE_URL
  }
  else if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_API_BASE_URL || API_BASE_URL
  }
  return API_BASE_URL
}

// 获取最终的环境变量值
API_BASE_URL = getEnvValue()

// 创建axios实例（使用处理后的环境变量）
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 保持开启
})

api.interceptors.request.use(config => {
  // 不再需要Token逻辑，因为使用Session认证
  return config
})

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      if (!router.currentRoute.value.path.startsWith('/login')) {
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default api