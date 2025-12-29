<template>
  <div class="h-screen flex items-stretch overflow-hidden bg-[#F0F2F5]">
    <div class="w-64 flex-shrink-0 z-10 shadow-lg">
      <sidebar class="h-full" />
    </div>
    <div class="flex-1 flex flex-col min-w-0">
      <div class="p-8 flex flex-col flex-1 overflow-auto">
        <div class="mb-8 flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">錄音案件清單</h1>
            <p class="text-gray-400 text-lg">請選擇案件進行錄音作業或查看進度</p>
          </div>
          <a-input-search
            placeholder="搜尋身分證字號或姓名"
            style="width: 350px"
            size="large"
            class="shadow-sm"
          />
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <a-table
            :columns="columns"
            :data-source="caseData"
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
                <div class="flex gap-3">
                  <a-button
                    class="!border-orange-400 !text-orange-500 hover:!bg-orange-50"
                    size="small"
                    @click="handleGo(record)"
                  >
                    進入錄音
                  </a-button>
                </div>
              </template>
            </template>
          </a-table>
        </div>

        <div class="mt-auto pt-10 pb-4 text-center text-gray-400 text-xs tracking-widest">
          © 2025 MLI Financial Group. All Rights Reserved.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()

// 定義表格欄位
const columns = [
  { title: '案件編號', dataIndex: 'caseId', key: 'caseId' },
  { title: '客戶姓名', dataIndex: 'name', key: 'name' },
  { title: '身分證字號', dataIndex: 'idNumber', key: 'idNumber' },
  { title: '投保險種', dataIndex: 'type', key: 'type' },
  { title: '案件狀態', key: 'status', dataIndex: 'status' },
  { title: '建立日期', dataIndex: 'date', key: 'date' },
  { title: '操作', key: 'action' }
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
    date: '2025-12-29'
  },
  {
    key: '2',
    caseId: 'REC-20251229-002',
    name: '李○玲',
    idNumber: 'F224****56',
    type: '終身壽險',
    status: '已完成',
    date: '2025-12-28'
  }
  // 可以依此類推增加更多資料...
])

const handleGo = (record: any) => {
  console.log('跳轉至錄音頁面', record.caseId)
  router.push('/recordingView')
}

const handleDetail = (record: any) => {
  console.log('查看案件詳情', record.caseId)
}
</script>

<style scoped>
/* 微調 Ant Design 表格樣式使其更清爽 */
:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  font-weight: 600;
}

:deep(.ant-table-pagination) {
  padding-right: 20px;
}
</style>
