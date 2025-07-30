<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="register-title">用户注册</h2>
      
      <el-form 
        ref="registerFormRef" 
        :model="registerForm" 
        :rules="registerRules"
        label-width="100px"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input 
            v-model="registerForm.userId" 
            placeholder="请输入用户ID"
            clearable
          />
          <div class="form-tip">唯一标识，登录时使用</div>
        </el-form-item>
        
        <el-form-item label="用户名" prop="userName">
          <el-input 
            v-model="registerForm.userName" 
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
          />
          <div class="form-tip">8-64个字符</div>
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password"
            placeholder="请再次输入密码"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model="registerForm.phone" 
            placeholder="请输入手机号"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="registerForm.email" 
            placeholder="请输入邮箱"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleRegister"
            :loading="loading"
          >
            注册
          </el-button>
          
          <el-button @click="goToLogin">
            返回登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.register-card {
  width: 560px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  margin-bottom: 24px;
  color: #409eff;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>