<template>
  <div class="h-full w-full flex flex-col justify-center items-center bg-gray-100">
    <a-card class="w-[350px] !rounded-xl shadow-2xl overflow-hidden border-none">
      <div class="h-1.5 w-full bg-[#FF9900]"></div>
      <div class="p-8">
        <div class="text-center mb-8">
          <div class="text-[#003366] text-xl font-bold tracking-widest">三商美邦人壽</div>
          <div class="text-gray-400 text-size-sm mt-1 uppercase tracking-tighter">數位錄音系統</div>
          <div class="text-gray-400 text-xs mt-1 uppercase tracking-tighter">Digital Recording</div>
        </div>
        <a-form layout="vertical">
          <a-form-item class="!mb-4">
            <a-input v-model:value="username" placeholder="員編" />
          </a-form-item>
          <a-form-item class="!mb-8">
            <a-input-password v-model:value="password" placeholder="密碼" autocomplete />
          </a-form-item>
          <a-button type="primary" block @click="handleLogin" class="!h-10 !bg-[#FF9900] !border-[#FF9900] font-bold">
            登 入
          </a-button>
        </a-form>
        <div class="text-center mt-6">
          <span class="text-gray-300 text-[10px]">© 2025 MLI Financial Group</span>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = () => {
  if (!username.value || !password.value) {
    message.warning('請輸入帳密')
    return
  }
  if (username.value === 'adm' && password.value === '111') {
    loading.value = true
  } else if (username.value !== 'adm') {
    message.error('密碼錯誤')
    return
  }
  // 模擬登入
  setTimeout(() => {
    localStorage.setItem('user_token', 'active')
    router.push('/')
    loading.value = false
  }, 1000)
}
</script>

<style scoped>
/* 深度覆蓋 Ant Design Vue 的標籤間距，讓排版更緊湊 */
:deep(.ant-form-item-label) {
  padding-bottom: 4px;
}
</style>
