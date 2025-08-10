<template>
  <div class="login-container">
    <!-- 背景装饰元素 -->
    <div class="particles">
      <div class="particle" v-for="i in 30" :key="i" :style="particleStyle(i)"></div>
    </div>
    <div class="grid-lines"></div>
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="card-header">
        <h1 class="login-title">虚拟电厂谷峰枢调系统后台登录</h1>
        <div class="tech-lines">
          <div class="line"></div>
          <div class="circle"></div>
          <div class="line"></div>
        </div>
      </div>

      <el-form 
        ref="loginFormRef" 
        :model="loginForm" 
        :rules="loginRules"
        label-position="top"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input 
            v-model="loginForm.userId" 
            placeholder="请输入用户ID"
            clearable
          >
            <template #prefix>
              <i class="fas fa-user"></i>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <i class="fas fa-lock"></i>
            </template>
          </el-input>
        </el-form-item>
        
        <!-- 新增验证码区域 -->
        <el-form-item label="验证码" prop="captcha">
          <div class="captcha-container">
            <el-input 
              v-model="loginForm.captcha" 
              placeholder="请输入验证码"
              class="captcha-input"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <i class="fas fa-shield-alt"></i>
              </template>
            </el-input>
            <div 
              class="captcha-display"
              @click="refreshCaptcha"
            >
              {{ captchaCode }}
            </div>
          </div>
        </el-form-item>
        
        <div class="form-actions">
          <el-button 
            type="primary" 
            @click="handleLogin"
            :loading="loading"
            class="login-btn"
          >
            <span v-if="!loading">登录系统</span>
            <span v-else>登录中...</span>
          </el-button>
          
          <el-button @click="goToRegister" class="register-btn">
            注册新账号
          </el-button>
        </div>
      </el-form>
      
      <div class="tech-footer">
        <div class="tech-node" v-for="i in 5" :key="i"></div>
      </div>
    </div>
    
    <div class="bottom-info">
      <p>© 2025 虚拟电厂谷峰枢调系统 | 安全登录通道</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/authStore'
import { ElNotification } from 'element-plus'
import '@/styles/local-fonts.css';

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

// 新增验证码相关变量
const captchaCode = ref('')

const loginForm = reactive({
  userId: '',
  password: '',
  captcha: '' // 新增验证码字段
})

// 修复类型问题
const loginRules: FormRules = reactive({
  userId: [
    { required: true, message: '请输入用户ID', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在3-50个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 64, message: '长度在8-64个字符', trigger: 'blur' }
  ],
  // 新增验证码验证规则 - 修复类型问题
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { 
      validator: (_, value, callback) => {
        if (value !== captchaCode.value) {
          callback(new Error('验证码错误'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 生成随机四位数字验证码
const generateCaptcha = (): string => {
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += Math.floor(Math.random() * 10)
  }
  return code
}

// 刷新验证码
const refreshCaptcha = () => {
  captchaCode.value = generateCaptcha()
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    // 验证表单
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    // 单独验证验证码
    if (loginForm.captcha !== captchaCode.value) {
      ElNotification({
        title: '验证码错误',
        message: '请输入正确的验证码',
        type: 'error',
        duration: 3000
      })
      // refreshCaptcha()
      return
    }
    
    loading.value = true
    
    // 调用登录方法
    await authStore.login({
      userId: loginForm.userId,
      userPassword: loginForm.password
    })
    
    // 登录成功后跳转到首页
    router.push('/')
    
  } catch (error: any) {
    console.error('登录失败:', error)
    
    // 显示友好的错误提示
    ElNotification({
      title: '登录失败',
      message: error.message || '用户名或密码错误',
      type: 'error',
      duration: 3000
    })
    
    // 登录失败时刷新验证码
    // refreshCaptcha()
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

// 粒子动画效果
const particleStyle = (index: number) => {
  const size = Math.random() * 3 + 1;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const animationDelay = Math.random() * 5;
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${posX}%`,
    top: `${posY}%`,
    animationDelay: `${animationDelay}s`,
    opacity: Math.random() * 0.5 + 0.3
  };
};

// 初始化时生成验证码
onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped lang="scss">
@import '@/assets/fonts/font-awesome/css/all.css';
.login-container {
  position: fixed; 
  top: 60px; /* 导航栏高度 */
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #3F5499 0%, #050a1a 100%);
  overflow: hidden;
  z-index: 1000;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  
  .particle {
    position: absolute;
    background: #0dcaf0;
    border-radius: 50%;
    animation: float 15s infinite linear;
    
    @keyframes float {
      0% { transform: translateY(0) translateX(0); }
      25% { transform: translateY(-20px) translateX(10px); }
      50% { transform: translateY(0) translateX(20px); }
      75% { transform: translateY(20px) translateX(10px); }
      100% { transform: translateY(0) translateX(0); }
    }
  }
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(13, 202, 240, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13, 202, 240, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 1;
  opacity: 0.4;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 2;
  
  &.top-left {
    top: 30px;
    left: 30px;
    border-top: 2px solid #0dcaf0;
    border-left: 2px solid #0dcaf0;
  }
  
  &.top-right {
    top: 30px;
    right: 30px;
    border-top: 2px solid #0dcaf0;
    border-right: 2px solid #0dcaf0;
  }
  
  &.bottom-left {
    bottom: 30px;
    left: 30px;
    border-bottom: 2px solid #0dcaf0;
    border-left: 2px solid #0dcaf0;
  }
  
  &.bottom-right {
    bottom: 30px;
    right: 30px;
    border-bottom: 2px solid #0dcaf0;
    border-right: 2px solid #0dcaf0;
  }
}

.login-card {
  width: 420px;
  padding: 40px 35px;
  background: rgba(16, 36, 73, 0.7);
  border: 1px solid rgba(0, 167, 255, 0.3);
  border-radius: 12px;
  box-shadow: 
    0 0 30px rgba(26, 109, 255, 0.5),
    inset 0 0 20px rgba(0, 167, 255, 0.1);
  position: relative;
  z-index: 10;
  overflow: hidden;
  margin-top: -60px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #1a6dff, #0dcaf0);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #1a6dff, #0dcaf0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(26, 109, 255, 0.5);
  letter-spacing: 2px;
}

.tech-lines {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  
  .line {
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #0dcaf0, transparent);
  }
  
  .circle {
    width: 10px;
    height: 10px;
    background: #0dcaf0;
    border-radius: 50%;
    margin: 0 15px;
    box-shadow: 0 0 10px #0dcaf0;
  }
}

:deep(.el-form-item) {
  margin-bottom: 28px;
  
  .el-form-item__label {
    color: #a0d7ff;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 8px;
    letter-spacing: 1px;
  }
}

:deep(.el-input) {
  .el-input__wrapper {
    background: rgba(0, 167, 255, 0.05);
    border: 1px solid rgba(0, 167, 255, 0.3);
    border-radius: 6px;
    box-shadow: none;
    padding: 0 15px;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #0dcaf0;
      box-shadow: 0 0 8px rgba(13, 202, 240, 0.3);
    }
    
    &.is-focus {
      border-color: #1a6dff;
      box-shadow: 0 0 12px rgba(26, 109, 255, 0.5);
    }
  }
  
  .el-input__inner {
    color: #ffffff;
    height: 46px;
    font-size: 14px;
    letter-spacing: 0.5px;
    
    &::placeholder {
      color: rgba(125, 157, 204, 0.7);
    }
  }
  
  .el-input__prefix {
    color: #7d9dcc;
    margin-right: 10px;
    font-size: 16px;
  }
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
  align-items: stretch;
}

.login-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(90deg, #1a6dff, #0dcaf0);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  box-shadow: 0 0 15px rgba(26, 109, 255, 0.5);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 25px rgba(26, 109, 255, 0.8);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

.register-btn {
  width: 100%;
  height: 48px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: 1px solid rgba(0, 167, 255, 0.5);
  border-radius: 6px;
  color: #a0d7ff;
  font-size: 14px;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  margin: 0; /* 移除外边距 */
  
  &:hover {
    background: rgba(0, 167, 255, 0.1);
    color: #ffffff;
    border-color: #0dcaf0;
    box-shadow: 0 0 10px rgba(13, 202, 240, 0.3);
  }
}

.tech-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  
  .tech-node {
    width: 8px;
    height: 8px;
    background: #0dcaf0;
    border-radius: 50%;
    box-shadow: 0 0 8px #0dcaf0;
    animation: pulse 2s infinite;
    
    &:nth-child(2n) {
      animation-delay: 0.5s;
    }
    
    &:nth-child(3n) {
      animation-delay: 1s;
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
}

.bottom-info {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: rgba(125, 157, 204, 0.7);
  font-size: 12px;
  letter-spacing: 1px;
  z-index: 5;
}

/* 新增验证码容器样式 */
.captcha-container {
  display: flex;
  width: 100%;
  gap: 10px;
}

.captcha-input {
  flex: 2; /* 输入框占2/3宽度 */
}

.captcha-display {
  flex: 1; /* 显示框占1/3宽度 */
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(13, 202, 240, 0.1);
  border: 1px solid rgba(13, 202, 240, 0.3);
  border-radius: 4px;
  color: #0dcaf0;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 3px;
  font-family: 'Orbitron', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  box-shadow: 0 0 8px rgba(13, 202, 240, 0.2);
  
  &:hover {
    background: rgba(13, 202, 240, 0.2);
    box-shadow: 0 0 12px rgba(13, 202, 240, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
}
</style>