import api from './api'

// 简化服务，大部分功能已移至authStore
export const AuthService = {
  // 获取当前用户信息
  async getCurrentUser() {
    const response = await api.get('/api/auth/me')
    return response.data
  },
  
  // 退出登录
  async logout() {
    await api.post('/api/auth/logout')
  }
}