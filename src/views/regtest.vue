<template>
  <div class="register-container">
    <!-- 背景装饰元素 -->
    <div class="particles">
      <div class="particle" v-for="i in 30" :key="i" :style="particleStyle(i)"></div>
    </div>
    <div class="grid-lines"></div>
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
    
    <!-- 注册卡片 -->
    <div class="register-card">
      <div class="card-header">
        <h1 class="register-title">用户注册</h1>
        <div class="tech-lines">
          <div class="line"></div>
          <div class="circle"></div>
          <div class="line"></div>
        </div>
      </div>
      
      <el-form 
        ref="registerFormRef" 
        :model="registerForm" 
        :rules="registerRules"
        label-position="top"
        class="register-form"
      >
        <div class="form-grid">
          <div class="form-column">
            <el-form-item label="用户ID" prop="userId">
              <el-input 
                v-model="registerForm.userId" 
                placeholder="请输入用户ID"
                clearable
              >
                <template #prefix>
                  <i class="fas fa-id-card"></i>
                </template>
              </el-input>
              <div class="form-tip">唯一标识，登录时使用</div>
            </el-form-item>
            
            <el-form-item label="用户名" prop="userName">
              <el-input 
                v-model="registerForm.userName" 
                placeholder="请输入用户名"
                clearable
              >
                <template #prefix>
                  <i class="fas fa-user"></i>
                </template>
              </el-input>
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="registerForm.password" 
                type="password"
                placeholder="请输入密码"
                show-password
                clearable
              >
                <template #prefix>
                  <i class="fas fa-lock"></i>
                </template>
              </el-input>
              <div class="form-tip">8-64个字符</div>
            </el-form-item>
          </div>
          
          <div class="form-column">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input 
                v-model="registerForm.confirmPassword" 
                type="password"
                placeholder="请再次输入密码"
                show-password
                clearable
              >
                <template #prefix>
                  <i class="fas fa-lock"></i>
                </template>
              </el-input>
            </el-form-item>
            
            <el-form-item label="手机号" prop="phone">
              <el-input 
                v-model="registerForm.phone" 
                placeholder="请输入手机号"
                clearable
              >
                <template #prefix>
                  <i class="fas fa-mobile-alt"></i>
                </template>
              </el-input>
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input 
                v-model="registerForm.email" 
                placeholder="请输入邮箱"
                clearable
              >
                <template #prefix>
                  <i class="fas fa-envelope"></i>
                </template>
              </el-input>
            </el-form-item>
          </div>
        </div>
        
        <div class="form-actions">
          <el-button 
            type="primary" 
            @click="handleRegister"
            :loading="loading"
            class="register-btn"
          >
            <span v-if="!loading">创建账户</span>
            <span v-else>注册中...</span>
          </el-button>
          
          <el-button @click="goToLogin" class="login-btn">
            返回登录
          </el-button>
        </div>
      </el-form>
      
      <div class="tech-footer">
        <div class="tech-node" v-for="i in 5" :key="i"></div>
      </div>
    </div>
    
    <div class="bottom-info">
      <p>© 2025 虚拟电厂谷峰枢调系统 | 安全注册通道</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const registerFormRef = ref<FormInstance>()
const loading = ref(false)

const registerForm = reactive({
  userId: '',
  userName: '',
  password: '',
  confirmPassword: '',
  phone: '',
  email: ''
})

const validatePassword = (rule: any, value: string, callback: any) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules = reactive({
  userId: [
    { required: true, message: '请输入用户ID', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在3-50个字符', trigger: 'blur' }
  ],
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2-50个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 64, message: '长度在8-64个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { 
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { 
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ]
})

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    loading.value = true
    
    // 准备注册数据
    const registerData = {
      userId: registerForm.userId,
      userName: registerForm.userName,
      userPassword: registerForm.password,
      phone: registerForm.phone,
      email: registerForm.email
    }
    
    await authStore.register(registerData)
    
    // 注册成功后自动填充登录表单并跳转到登录页
    router.push({ 
      path: '/login',
      query: { userId: registerForm.userId }
    })
    
    ElMessage.success('注册成功！请登录您的账户')
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || '注册失败，请稍后重试'
    ElMessage.error(errorMessage)
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
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
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');

.register-container {
  position: fixed;
  top: 60px; /* 导航栏高度 */
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #0c1b3a 0%, #050a1a 100%);
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

.register-card {
  width: 800px;
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

.register-title {
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
    width: 150px;
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

.register-form {
  margin-top: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
  
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

.form-tip {
  font-size: 12px;
  color: rgba(125, 157, 204, 0.7);
  margin-top: 6px;
  padding-left: 8px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 40px;
}

.register-btn {
  width: 200px;
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

.login-btn {
  width: 200px;
  height: 48px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: 1px solid rgba(0, 167, 255, 0.5);
  border-radius: 6px;
  color: #a0d7ff;
  font-size: 16px;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
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
  margin-top: 40px;
  
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

@media (max-width: 850px) {
  .register-card {
    width: 90%;
    max-width: 500px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .register-btn, .login-btn {
    width: 160px;
  }
}
</style>