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
              <template v-else-if="column.key === 'note'">
                <div class="flex gap-3">
                  <a-button
                    class="!border-orange-400 !text-orange-500 hover:!bg-orange-50"
                    size="small"
                    @click="handleGo('view', record)"
                  >
                    進入錄音
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
import Sidebar from '@/components/Sidebar.vue'
const searchCaseId = ref('')
const searchName = ref('')
const searchType = ref('')
const router = useRouter()
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
  { title: '照會', key: 'note', dataIndex: 'note' }
]
// 模擬案件資料
const caseData = ref([
  {
    key: '1',
    caseId: 'REC-20251229-001',
    name: '張○明',
    idNumber: 'A123****89',
    type: '投資型保險',
    status: '待錄音',
    date: '2025-12-29',
    remark: '客戶要求下午兩點後聯繫',
    direction: '初次投保，需詳加說明投資風險'
  },
  {
    key: '2',
    caseId: 'REC-20251229-002',
    name: '李○玲',
    idNumber: 'F224****56',
    type: '終身壽險',
    status: '已完成',
    date: '2025-12-28',
    remark: '件急，已完成審核',
    direction: '續保客戶，流程簡化'
  },
  {
    key: '3',
    caseId: 'REC-20251230-015',
    name: '王○傑',
    idNumber: 'B121****12',
    type: '重大疾病險',
    status: '審核中',
    date: '2025-12-30',
    remark: '需補件：健檢報告',
    direction: '保額較高，需強化健康告知確認'
  },
  {
    key: '4',
    caseId: 'REC-20251230-022',
    name: '陳○芳',
    idNumber: 'H225****44',
    type: '年金保險',
    status: '錄音中',
    date: '2025-12-30',
    remark: '',
    direction: '網路投保轉人工錄音'
  },
  {
    key: '5',
    caseId: 'REC-20251227-009',
    name: '林○宏',
    idNumber: 'E122****33',
    type: '長照險',
    status: '待補件',
    date: '2025-12-27',
    remark: '身分證影本模糊',
    direction: '客戶高齡，建議語速放慢'
  },
  {
    key: '6',
    caseId: 'REC-20251231-001',
    name: '趙○雲',
    idNumber: 'P123****77',
    type: '小額終老保險',
    status: '待錄音',
    date: '2025-12-31',
    remark: '偏遠地區客戶，訊號可能不佳',
    direction: '政策性保險，注意法規宣導'
  },
  {
    key: '7',
    caseId: 'REC-20251231-005',
    name: '孫○美',
    idNumber: 'G221****90',
    type: '防癌險',
    status: '已撤銷',
    date: '2025-12-31',
    remark: '客戶意願變更',
    direction: '電訪後決定取消'
  },
  {
    key: '8',
    caseId: 'REC-20251226-041',
    name: '周○宇',
    idNumber: 'K121****21',
    type: '傷害保險',
    status: '已完成',
    date: '2025-12-26',
    remark: '',
    direction: '外勤職業，加強意外定義說明'
  },
  {
    key: '9',
    caseId: 'REC-20251229-088',
    name: '郭○伶',
    idNumber: 'L222****11',
    type: '定期壽險',
    status: '待錄音',
    date: '2025-12-29',
    remark: '需確認受益人資訊',
    direction: '單純定期險，預計錄音耗時短'
  },
  {
    key: '10',
    caseId: 'REC-20251230-050',
    name: '楊○恩',
    idNumber: 'D124****66',
    type: '醫療保險',
    status: '錄音失敗',
    date: '2025-12-30',
    remark: '斷線，需重新預約',
    direction: '實支實付型，需核對正本收據規範'
  }
])

const filteredCaseData = computed(() => {
  const caseIdKeyword = searchCaseId.value.trim().toLowerCase()
  const nameKeyword = searchName.value.trim().toLowerCase()
  const typeKeyword = searchType.value.trim().toLowerCase()
  if (!caseIdKeyword && !nameKeyword && !typeKeyword) return caseData.value
  return caseData.value.filter(item => {
    if (caseIdKeyword && !item.caseId.toLowerCase().includes(caseIdKeyword)) return false
    if (nameKeyword && !item.name.toLowerCase().includes(nameKeyword)) return false
    if (typeKeyword && !item.type.toLowerCase().includes(typeKeyword)) return false
    return true
  })
})

const handleGo = (type: string, record: any) => {
  console.log(record)
  if (type === 'edit') {
    router.push({ name: 'recordingCompiler', params: { id: record.caseId } })
  } else {
    router.push({ name: 'recordingView', params: { id: record.caseId } })
  }
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
