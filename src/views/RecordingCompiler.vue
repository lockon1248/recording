<template>
  <div class="min-h-screen w-screen bg-gray-50 flex flex-col items-center py-12 px-4 overflow-auto">
    <div class="w-full max-w-3xl flex justify-between items-center mb-6">
      <div class="flex items-center gap-3">
        <a-button @click="goBack" type="text" class="!flex items-center !text-gray-500 hover:!text-[#F58220]">
          <template #icon><LeftOutlined /></template>
          返回列表
        </a-button>
        <h1 class="text-2xl font-bold text-gray-800 m-0 border-l-2 border-gray-300 pl-4">
          {{ isEditMode ? '編輯錄音案件' : '新增錄音案件' }}
        </h1>
      </div>
      <div class="flex gap-3">
        <a-button type="primary" class="!bg-[#F58220] !border-[#F58220] shadow-sm rounded-md" @click="handleSubmit">
          <template #icon><SaveOutlined /></template>
          儲存內容
        </a-button>
      </div>
    </div>
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-200 p-10 mb-10">
      <div class="mb-10 flex items-start gap-4 bg-orange-50 p-4 rounded-lg">
        <div class="w-1.5 h-12 bg-[#F58220] rounded-full"></div>
        <div>
          <h3 class="font-bold text-[#003366] m-0">案件基本資訊</h3>
          <p class="text-gray-500 text-sm mt-1 m-0">請更新客戶資訊與備註內容，儲存後可回到清單。</p>
        </div>
      </div>
      <a-form layout="vertical" :model="formState">
        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
          <a-form-item label="案件編號">
            <a-input v-model:value="formState.caseId" class="!h-11" disabled />
          </a-form-item>
          <a-form-item label="客戶姓名" required>
            <a-input v-model:value="formState.name" placeholder="請輸入客戶姓名" class="!h-11" />
          </a-form-item>
          <a-form-item label="身分證字號" required>
            <a-input v-model:value="formState.idNumber" placeholder="請輸入身分證字號" class="!h-11" />
          </a-form-item>
          <a-form-item label="投保險種">
            <a-input v-model:value="formState.type" placeholder="請輸入投保險種" class="!h-11" />
          </a-form-item>
          <a-form-item label="說明">
            <a-input v-model:value="formState.direction" placeholder="請輸入說明" class="!h-11" />
          </a-form-item>
          <a-form-item label="備註" class="col-span-2">
            <a-textarea v-model:value="formState.remark" placeholder="請輸入備註" :rows="4" />
          </a-form-item>
        </div>
      </a-form>
    </div>
    <CommonModal
      v-model:open="leaveModalOpen"
      :title="leaveTitle"
      :content="leaveContent"
      ok-text="離開"
      cancel-text="留在此頁"
      :show-cancel="true"
      @ok="confirmLeave"
      @cancel="stayOnPage"
    />
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LeftOutlined, SaveOutlined } from '@ant-design/icons-vue'
import { useUnsavedWarning } from '@/composables/useUnsavedWarning'
import { useRecordingStore, type RecordingCase } from '@/stores/recording'
import CommonModal from '@/components/CommonModal.vue'
const route = useRoute()
const router = useRouter()
const recordingStore = useRecordingStore()
const isEditMode = ref(false)
const formState = reactive({
  caseId: '',
  name: '',
  idNumber: '',
  type: '',
  direction: '',
  remark: '',
  status: '待錄音',
  date: ''
})

const {
  modalOpen: leaveModalOpen,
  modalTitle: leaveTitle,
  modalContent: leaveContent,
  confirmLeave,
  cancelLeave,
  requestLeave,
  syncSnapshot
} = useUnsavedWarning(formState, {
  title: '資料尚未儲存',
  content: '你已修改資料，離開將不會保存。是否仍要離開？'
})

onMounted(() => {
  const caseId = (route.params.id as string | undefined) || recordingStore.selectedCaseId || ''
  formState.caseId = caseId
  if (caseId) {
    const currentCase = recordingStore.getCaseById(caseId)
    if (currentCase) {
      Object.assign(formState, currentCase)
      isEditMode.value = true
    }
  } else {
    isEditMode.value = false
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const rand = String(Math.floor(Math.random() * 900) + 100)
    formState.caseId = `REC-${yyyy}${mm}${dd}-${rand}`
    formState.date = `${yyyy}-${mm}-${dd}`
  }
  syncSnapshot()
})

const goBack = () => {
  requestLeave({ name: 'recordingList' })
}

const handleSubmit = () => {
  if (!formState.name || !formState.idNumber) {
    message.warning('請填寫必要資訊')
    return
  }
  const payload: RecordingCase = {
    caseId: formState.caseId,
    name: formState.name,
    idNumber: formState.idNumber,
    type: formState.type,
    direction: formState.direction,
    remark: formState.remark,
    status: formState.status || '待錄音',
    date: formState.date || ''
  }
  recordingStore.saveCase(payload)
  message.success('資料已儲存')
  syncSnapshot()
  router.push({ name: 'recordingList' })
}

const stayOnPage = () => {
  cancelLeave()
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
