<template>
  <div class="h-full flex items-stretch overflow-hidden bg-[#F0F2F5]">
    <div class="w-[200px] flex-shrink-0 z-10 shadow-lg">
      <sidebar class="h-full" />
    </div>
    <div class="flex-1 flex flex-col min-w-0">
      <div class="p-8 flex flex-col flex-1 overflow-auto gap-3">
        <div class="mb-4 flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">錄音案件清單</h1>
            <p class="text-gray-400 text-lg">請選擇案件進行錄音作業或查看進度</p>
          </div>
          <a-button
            type="primary"
            class="!bg-[#F58220] !border-[#F58220]"
            @click="handleCreate"
          >
            新增錄音
          </a-button>
        </div>
        <div class="flex items-center gap-2">
          <a-input-search
            v-model:value="searchCaseId"
            placeholder="搜尋案件編號"
            style="width: 250px"
            size="large"
            class="shadow-sm"
          />
          <a-input-search
            v-model:value="searchName"
            placeholder="搜尋姓名"
            style="width: 250px"
            size="large"
            class="shadow-sm"
          />
          <a-input-search
            v-model:value="searchType"
            placeholder="搜尋投保險種"
            style="width: 250px"
            size="large"
            class="shadow-sm"
          />
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-auto">
          <a-table
            :columns="columns"
            :data-source="filteredCaseData"
            :pagination="{ pageSize: 10, position: ['bottomRight'] }"
            class="custom-table"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag
                  :class="
                    record.status === '已完成'
                      ? '!bg-green-50 !text-green-500 !border-green-200'
                      : '!bg-orange-50 !text-orange-500 !border-orange-200'
                  "
                >
                  {{ record.status }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'action'">
                <div class="min-h-[25px] min-w-[25px] flex items-center justify-center">
                  <i-material-symbols-edit-square-outline
                    class="text-orange-500 cursor-pointer"
                    @click="handleGo('edit', record)"
                  />
                </div>
              </template>
              <template v-else-if="column.key === 'recording'">
                <div class="min-h-[25px] min-w-[25px] flex items-center justify-center">
                  <a-button
                    class="!border-orange-400 !text-orange-500 hover:!bg-orange-50"
                    size="small"
                    @click="handleGo('recording', record)"
                  >
                    錄音
                  </a-button>
                </div>
              </template>
              <template v-else-if="column.key === 'note'">
                <div class="flex gap-3">
                  <a-button
                    class="!border-orange-400 !text-orange-500 hover:!bg-orange-50"
                    size="small"
                    @click="handleGo('view', record)"
                  >
                    聆聽錄音
                  </a-button>
                </div>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecordingStore, type RecordingCase } from '@/stores/recording'
import Sidebar from '@/components/Sidebar.vue'
const searchName = ref('')
const searchType = ref('')
const searchCaseId = ref('')
const router = useRouter()
const recordingStore = useRecordingStore()
// 定義表格欄位
const columns = [
  { title: '案件編號', dataIndex: 'caseId', key: 'caseId' },
  { title: '客戶姓名', dataIndex: 'name', key: 'name' },
  { title: '身分證字號', dataIndex: 'idNumber', key: 'idNumber' },
  { title: '投保險種', dataIndex: 'type', key: 'type' },
  { title: '案件狀態', dataIndex: 'status', key: 'status' },
  { title: '建立日期', dataIndex: 'date', key: 'date' },
  { title: '備註', key: 'remark', dataIndex: 'remark' },
  { title: '說明', key: 'direction', dataIndex: 'direction' },
  { title: '編輯', key: 'action', dataIndex: 'action' },
  { title: '錄音', key: 'recording', dataIndex: 'recording' },
  { title: '照會', key: 'note', dataIndex: 'note' }
]
// 模擬案件資料
const filteredCaseData = computed(() => {
  const caseIdKeyword = searchCaseId.value.trim().toLowerCase()
  const nameKeyword = searchName.value.trim().toLowerCase()
  const typeKeyword = searchType.value.trim().toLowerCase()
  if (!caseIdKeyword && !nameKeyword && !typeKeyword) return recordingStore.cases
  return recordingStore.cases.filter(item => {
    if (caseIdKeyword && !item.caseId.toLowerCase().includes(caseIdKeyword)) return false
    if (nameKeyword && !item.name.toLowerCase().includes(nameKeyword)) return false
    if (typeKeyword && !item.type.toLowerCase().includes(typeKeyword)) return false
    return true
  })
})

const handleGo = (type: string, record: RecordingCase) => {
  recordingStore.setSelectedCaseId(record.caseId)
  if (type === 'recording') {
    router.push({ name: 'recording', params: { id: record.caseId } })
  } else if(type==='view') {
    router.push({ name: 'recordingView', params: { id: record.caseId } })
  } else{
    router.push({ name: 'recordingCompiler', params: { id: record.caseId } })
  }
}

const handleCreate = () => {
  recordingStore.setSelectedCaseId(null)
  router.push({ name: 'recordingCompiler' })
}
</script>
<style scoped>
/* 微調 Ant Design 表格樣式使其更清爽 */
:deep(.ant-table-thead > tr > th) {
  background-color: #fff7ed; /* 使用淡淡的三商橘背景 */
  color: #003366; /* 三商藍字體 */
  font-weight: bold;
}
:deep(.ant-table-pagination) {
  padding-right: 20px;
}
</style>
