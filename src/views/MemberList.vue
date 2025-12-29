<script setup lang="ts">
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import router from '@/router'

// 定義表格欄位
const columns = [
  { title: '員工編號', dataIndex: 'empId', key: 'empId' },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '所屬部門', dataIndex: 'dept', key: 'dept' },
  { title: '系統角色', dataIndex: 'role', key: 'role' },
  { title: '帳號狀態', key: 'status', dataIndex: 'status' },
  { title: '操作', key: 'action' }
]

// 模擬人員資料
const staffData = ref([
  {
    key: '1',
    empId: 'MLI00123',
    name: '林O芬',
    dept: '壽險業務部',
    role: '業務員',
    status: '啟用'
  },
  {
    key: '2',
    empId: 'MLI00456',
    name: '陳O志',
    dept: '資訊開發部',
    role: '系統管理員',
    status: '啟用'
  },
  {
    key: '3',
    empId: 'MLI00789',
    name: '王O明',
    dept: '客戶服務部',
    role: '審核主管',
    status: '停用'
  }
])

const searchQuery = ref('')
const filteredStaffData = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  if (!keyword) return staffData.value
  return staffData.value.filter((item) => {
    return (
      item.empId.toLowerCase().includes(keyword) ||
      item.name.toLowerCase().includes(keyword) ||
      item.dept.toLowerCase().includes(keyword) ||
      item.role.toLowerCase().includes(keyword)
    )
  })
})


const toMemberForm = (record?: any) => {
  // 根據 mode 參數決定是新增還是編輯
  console.log(`前往 ${record ? '編輯' : '新增'} 人員表單`)
  if (record?.empId) {
    router.push({
      name: 'memberForm',
      params: { id: record.empId },
      query: { mode: 'edit' }
    })
    return
  }
  router.push({ name: 'memberForm', query: { mode: 'add' } })
}
</script>

<template>
  <div class="h-screen w-screen flex items-stretch overflow-hidden bg-gray-50">
    <div class="w-[200px] flex-shrink-0 border-r border-gray-200">
      <sidebar class="h-full" />
    </div>
    <div class="flex-[5] flex flex-col min-w-0 overflow-hidden">
      <div class="flex-1 flex flex-col p-8 overflow-auto">
        <div class="mb-8 flex justify-between items-end">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">人員權限設定</h1>
            <p class="text-gray-500">管理系統使用者之存取權限與帳號狀態</p>
          </div>
          <div class="flex items-center gap-4">
            <a-input-search
              v-model:value="searchQuery"
              placeholder="搜尋員編、姓名或部門"
              style="width: 320px"
            />
            <a-button @click="toMemberForm()" type="primary" class="!bg-[#F58220] !border-[#F58220]"> 新增人員 </a-button>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <a-table
            :columns="columns"
            :data-source="filteredStaffData"
            :pagination="{ pageSize: 10 }"
            :scroll="{ x: 'max-content' }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-badge
                  :status="record.status === '啟用' ? 'success' : 'default'"
                  :text="record.status"
                />
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button type="link" @click="toMemberForm(record)">修改權限</a-button>
              </template>
            </template>
          </a-table>
        </div>

        <div class="mt-auto pt-8 text-center text-gray-400 text-xs tracking-widest">
          © 2025 MLI Financial Group. All Rights Reserved.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 統一表格表頭樣式 */
:deep(.ant-table-thead > tr > th) {
  background-color: #fff7ed; /* 使用淡淡的三商橘背景 */
  color: #003366; /* 三商藍字體 */
  font-weight: bold;
}
</style>
