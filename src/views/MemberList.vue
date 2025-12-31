<template>
  <div class="h-full w-screen flex items-stretch overflow-hidden bg-gray-50">
    <div class="w-[200px] flex-shrink-0 border-r border-gray-200 relative">
      <sidebar class="h-full absolute" />
    </div>
    <div class="flex-[5] flex flex-col min-w-0 overflow-hidden">
      <div class="flex-1 flex flex-col p-8 overflow-auto gap-3">
        <div class="mb-4 flex justify-between items-end">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">人員權限設定</h1>
            <p class="text-gray-500">管理系統使用者之存取權限與帳號狀態</p>
          </div>
        </div>
        <div class="flex gap-4 justify-between">
          <div class="flex items-center gap-2">
            <a-input-search v-model:value="searchEmpId" placeholder="搜尋員編" style="width: 250px" />
            <a-input-search v-model:value="searchName" placeholder="搜尋姓名" style="width: 250px" />
            <a-input-search v-model:value="searchDept" placeholder="搜尋部門" style="width: 250px" />
          </div>
          <a-button @click="toMemberForm()" type="primary" class="!bg-[#F58220] !border-[#F58220]"> 新增人員 </a-button>
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
                <a-badge :status="record.status === '啟用' ? 'success' : 'default'" :text="record.status" />
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button type="link" @click="toMemberForm(record as Member)">修改權限</a-button>
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
import { useMemberStore, type Member } from '@/stores/member'
import router from '@/router'
import Sidebar from '@/components/Sidebar.vue'
const memberStore = useMemberStore()
const searchEmpId = ref('')
const searchName = ref('')
const searchDept = ref('')
// 定義表格欄位
const columns = [
  { title: '員工編號', dataIndex: 'empId', key: 'empId' },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '所屬部門', dataIndex: 'dept', key: 'dept' },
  { title: '系統角色', dataIndex: 'role', key: 'role' },
  { title: '帳號狀態', key: 'status', dataIndex: 'status' },
  { title: '操作', key: 'action' }
]

const filteredStaffData = computed(() => {
  const empIdKeyword = searchEmpId.value.trim().toLowerCase()
  const nameKeyword = searchName.value.trim().toLowerCase()
  const deptKeyword = searchDept.value.trim().toLowerCase()
  if (!empIdKeyword && !nameKeyword && !deptKeyword) return memberStore.members
  return memberStore.members.filter(item => {
    if (empIdKeyword && !item.empId.toLowerCase().includes(empIdKeyword)) return false
    if (nameKeyword && !item.name.toLowerCase().includes(nameKeyword)) return false
    if (deptKeyword && !item.dept.toLowerCase().includes(deptKeyword)) return false
    return true
  })
})

const toMemberForm = (record?: Member) => {
  // 根據 mode 參數決定是新增還是編輯
  console.log(`前往 ${record ? '編輯' : '新增'} 人員表單`)
  if (record?.empId) {
    memberStore.setSelectedMemberId(record.empId)
    router.push({
      name: 'memberForm',
      params: { id: record.empId },
      query: { mode: 'edit' }
    })
    return
  }
  memberStore.setSelectedMemberId(null)
  router.push({ name: 'memberForm', query: { mode: 'add' } })
}
</script>

<style scoped>
/* 統一表格表頭樣式 */
:deep(.ant-table-thead > tr > th) {
  background-color: #fff7ed; /* 使用淡淡的三商橘背景 */
  color: #003366; /* 三商藍字體 */
  font-weight: bold;
}
</style>
