<template>
  <div class="min-h-screen w-screen bg-gray-50 flex flex-col items-center py-12 px-4 overflow-auto">
    <div class="w-full max-w-3xl flex justify-between items-center mb-6">
      <div class="flex items-center gap-3">
        <a-button
          @click="goBack"
          type="text"
          class="!flex items-center !text-gray-500 hover:!text-[#F58220]"
        >
          <template #icon><LeftOutlined /></template>
          返回列表
        </a-button>
        <h1 class="text-2xl font-bold text-gray-800 m-0 border-l-2 border-gray-300 pl-4">
          {{ isEditMode ? '編輯系統人員' : '新增系統人員' }}
        </h1>
      </div>

      <div class="flex gap-3">
        <a-button @click="goBack" class="rounded-md">取消</a-button>
        <a-button
          type="primary"
          class="!bg-[#F58220] !border-[#F58220] shadow-sm rounded-md"
          @click="handleSubmit"
        >
          <template #icon><SaveOutlined /></template>
          儲存人員
        </a-button>
      </div>
    </div>
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-200 p-10 mb-10">
      <div class="mb-10 flex items-start gap-4 bg-orange-50 p-4 rounded-lg">
        <div class="w-1.5 h-12 bg-[#F58220] rounded-full"></div>
        <div>
          <h3 class="font-bold text-[#003366] m-0">人員帳號資訊</h3>
          <p class="text-gray-500 text-sm mt-1 m-0">
            請輸入正確的員工編號與姓名。新增完成後，系統將依據所選角色指派對應權限。
          </p>
        </div>
      </div>
      <a-form layout="vertical" :model="formState">
        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
          <a-form-item label="員工編號 (ID)" required>
            <a-input
              v-model:value="formState.empId"
              placeholder="請輸入 8 碼編號"
              class="!h-11"
              :disabled="isEditMode"
            />
          </a-form-item>
          <a-form-item label="人員姓名" required>
            <a-input v-model:value="formState.name" placeholder="請輸入姓名" class="!h-11" />
          </a-form-item>

          <a-form-item label="所屬部門">
            <a-select v-model:value="formState.dept" placeholder="選擇單位" class="!h-11">
              <a-select-option value="壽險業務部">壽險業務部</a-select-option>
              <a-select-option value="資訊開發部">資訊開發部</a-select-option>
              <a-select-option value="客戶服務部">客戶服務部</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="系統權限角色">
            <a-select v-model:value="formState.role" placeholder="選擇角色" class="!h-11">
              <a-select-option value="業務員">業務員</a-select-option>
              <a-select-option value="審核主管">審核主管</a-select-option>
              <a-select-option value="管理員">管理員</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="電子郵件" class="col-span-2">
            <a-input
              v-model:value="formState.email"
              placeholder="example@mli.com.tw"
              class="!h-11"
            />
          </a-form-item>
        </div>

        <div class="mt-6 border-t border-gray-100 pt-8">
          <a-form-item label="帳號啟用狀態">
            <div class="flex items-center gap-3">
              <a-switch v-model:checked="formState.isActive" />
              <span
                class="font-medium"
                :class="formState.isActive ? 'text-green-600' : 'text-gray-400'"
              >
                {{ formState.isActive ? '啟用中' : '已停用' }}
              </span>
            </div>
          </a-form-item>
        </div>
      </a-form>
    </div>

    <div class="text-gray-400 text-xs tracking-widest pb-8">
      © 2025 MLI Financial Group. All Rights Reserved.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LeftOutlined, SaveOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

// 模式判定
const isEditMode = ref(false)

const formState = reactive({
  empId: '',
  name: '',
  dept: undefined,
  role: undefined,
  email: '',
  isActive: true
})

onMounted(() => {
  // 如果網址帶有 id，則為編輯模式
  if (route.params.id || route.query.mode === 'edit') {
    isEditMode.value = true
    // 這裡通常會打 API 撈取資料
  }
})

const goBack = () => {
  router.push({ name: 'memberList' })
}

const handleSubmit = () => {
  if (!formState.empId || !formState.name) {
    message.warning('請填寫必要資訊')
    return
  }
  message.success('資料已儲存')
  router.push({ name: 'memberList' })
}
</script>

<style scoped>
/* 標籤字體加粗 */
:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
}

/* 調整 Ant Design 表單間距 */
:deep(.ant-form-item) {
  margin-bottom: 24px;
}
</style>
