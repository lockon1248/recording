<template>
  <div class="h-full w-full bg-[#F58220] flex flex-col shadow-lg overflow-hidden relative z-20">
    <div class="p-6 border-b border-white/20">
      <div class="text-white font-bold text-lg tracking-widest">功能選單</div>
    </div>
    <nav class="flex-1 py-4">
      <ul class="list-none p-0 m-0">
        <li 
          @click="router.push({ name: 'memberList' })"
          :class="[
            'flex items-center px-6 py-4 cursor-pointer transition-all duration-200',
            activeKey === 'memberList'
              ? 'bg-white text-black shadow-inner'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          ]"
        >
          <span class="mr-3 text-xl">👤</span>
          <span class="font-bold tracking-wide">人員權限設定</span>
        </li>
        <li 
          @click="router.push({ name: 'recordingList' })"
          :class="[
            'flex items-center px-6 py-4 cursor-pointer transition-all duration-200',
            activeKey === 'recordingList'
              ? 'bg-white text-black shadow-inner'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          ]"
        >
          <span class="mr-3 text-xl">📋</span>
          <span class="font-bold tracking-wide">錄音案件清單</span>
        </li>
      </ul>
    </nav>
    <div class="p-4 flex flex-col gap-3">
      <a-button
        type="text"
        class="!text-white !border-white/60 !border !rounded-md hover:!text-white hover:!border-white"
        @click="handleLogout"
      >
        登出
      </a-button>
      <div class="text-white/40 text-[10px] text-center italic">MLI Recording System</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const activeKey = computed(() => route.name)

const handleLogout = () => {
  localStorage.removeItem('user_token')
  router.push({ name: 'login' })
}
</script>
