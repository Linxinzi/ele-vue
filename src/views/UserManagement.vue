<template>
  <div class="user-management">
    <h2>用户管理</h2>
    
    <div v-if="authStore.isAdmin">
      <!-- 搜索和操作区域 -->
      <div class="toolbar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户ID、用户名、手机号或邮箱"
          clearable
          style="width: 300px; margin-right: 15px"
          @clear="fetchUsers"
          @keyup.enter="fetchUsers"
        >
          <template #append>
            <el-button :icon="Search" @click="fetchUsers" />
          </template>
        </el-input>
        
        <el-button type="primary" :icon="Refresh" @click="fetchUsers">刷新</el-button>
      </div>
      
      <!-- 用户表格 -->
      <el-table 
        :data="filteredUsers" 
        style="width: 100%" 
        border 
        v-loading="loading"
        height="calc(100vh - 260px)"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userId" label="用户ID" />
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="balance" label="余额" align="right">
          <template #default="{ row }">
            {{ formatBalance(row.balance) }}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="row.role === 'ADMIN' ? 'danger' : 'success'">
              {{ row.role === 'ADMIN' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="active" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.active === 'active' ? 'success' : 'danger'">
              {{ row.active === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row, $index }">
            <el-button 
              size="small" 
              type="primary" 
              :icon="Edit" 
              @click="handleEdit(row)"
            />
            <el-button
              size="small"
              :type="row.active === 'active' ? 'danger' : 'success'"
              :icon="row.active === 'active' ? SwitchButton : Check"
              @click="toggleStatus(row)"
            />
            <el-button 
              size="small" 
              type="warning" 
              :icon="Delete" 
              @click="handleDelete(row, $index)"
            />
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页控件 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalUsers"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 编辑用户对话框 -->
      <el-dialog 
        v-model="editDialogVisible" 
        :title="currentEditUser ? `编辑用户 - ${currentEditUser.userName}` : '编辑用户'"
        width="500px"
      >
        <el-form 
          v-if="currentEditUser" 
          :model="currentEditUser" 
          label-width="90px"
          ref="editFormRef"
          :rules="editFormRules"
        >
          <el-form-item label="用户ID">
            <el-input v-model="currentEditUser.userId" disabled />
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="currentEditUser.userName" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="currentEditUser.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="currentEditUser.email" />
          </el-form-item>
          <el-form-item label="余额" prop="balance">
            <el-input-number 
              v-model="currentEditUser.balance" 
              :precision="2" 
              :step="0.1" 
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="currentEditUser.role" style="width: 100%">
              <el-option label="管理员" value="ADMIN" />
              <el-option label="普通用户" value="USER" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="active">
            <el-select v-model="currentEditUser.active" style="width: 100%">
              <el-option label="启用" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </template>
      </el-dialog>
    </div>
    
    <div v-else class="permission-denied">
      <el-alert
        title="权限不足"
        type="error"
        description="需要管理员权限才能访问此页面"
        show-icon
        :closable="false"
      />
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Edit, SwitchButton, Check, Delete } from '@element-plus/icons-vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

// 定义用户类型
interface User {
  id: number;
  userId: string;
  userName: string;
  phone: string;
  email: string;
  balance: number;
  role: string;
  active: string;
}

const authStore = useAuthStore()

// 用户数据
const users = ref<User[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)

// 编辑相关
const editDialogVisible = ref(false)
const currentEditUser = ref<User | null>(null)
const editFormRef = ref<FormInstance>()

// 表单验证规则
const editFormRules = ref<FormRules>({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 50, message: '用户名长度在2-50个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  balance: [
    { required: true, message: '请输入余额', trigger: 'blur' },
    { type: 'number', min: 0, message: '余额不能为负数', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ],
  active: [
    { required: true, message: '请选择用户状态', trigger: 'change' }
  ]
})

// 过滤后的用户数据
const filteredUsers = computed(() => {
  if (!searchKeyword.value) return users.value
  const keyword = searchKeyword.value.toLowerCase()
  return users.value.filter(user => 
    user.userId.toLowerCase().includes(keyword) ||
    user.userName.toLowerCase().includes(keyword) ||
    (user.phone && user.phone.includes(keyword)) ||
    (user.email && user.email.toLowerCase().includes(keyword))
  )
})

// 格式化余额显示
const formatBalance = (balance: number) => {
  return `¥${balance.toFixed(2)}`
}

// 获取用户数据
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await api.get('/api/users', {
      params: {
        page: currentPage.value - 1,
        size: pageSize.value,
        search: searchKeyword.value
      }
    })
    users.value = response.data
    totalUsers.value = response.headers['x-total-count'] || response.data.length
  } catch (error) {
    ElMessage.error('获取用户数据失败')
    console.error('获取用户数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 编辑用户
const handleEdit = (user: User) => {
  currentEditUser.value = { ...user }
  editDialogVisible.value = true
}

// 保存编辑
const saveEdit = async () => {
  if (!editFormRef.value || !currentEditUser.value) return
  
  try {
    await editFormRef.value.validate()
    
    // 更新用户信息
    const { id } = currentEditUser.value
    const response = await api.put(`/api/users/${id}`, currentEditUser.value)
    
    // 更新本地数据
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value[index] = response.data
    }
    
    ElMessage.success('用户信息已更新')
    editDialogVisible.value = false
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('更新用户信息失败')
  }
}

// 切换用户状态
const toggleStatus = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要${user.active === 'active' ? '禁用' : '启用'}用户 ${user.userName} 吗？`,
      '操作确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 调用切换状态API
    const response = await api.patch(`/api/users/${user.id}/toggle-status`)
    
    // 更新本地数据
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].active = response.data.active
    }
    
    ElMessage.success(`用户已${response.data.active === 'active' ? '启用' : '禁用'}`)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('切换用户状态失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

// 删除用户
const handleDelete = async (user: User, index: number) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 ${user.userName} 吗？此操作不可恢复！`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      }
    )
    
    // 调用删除API
    await api.delete(`/api/users/${user.id}`)
    
    // 更新本地数据
    users.value.splice(index, 1)
    totalUsers.value--
    
    ElMessage.success('用户已删除')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
    }
  }
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchUsers()
}

// 当前页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchUsers()
}

// 组件挂载时获取用户数据
onMounted(() => {
  if (authStore.isAdmin) {
    fetchUsers()
  }
})
</script>

<style scoped>
.user-management {
  padding: 20px;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.toolbar {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.permission-denied {
  text-align: center;
  padding: 50px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.permission-denied .el-alert {
  margin-bottom: 20px;
  max-width: 500px;
}

.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.el-table {
  flex: 1;
  margin-bottom: 15px;
}

.el-button + .el-button {
  margin-left: 8px;
}
</style>