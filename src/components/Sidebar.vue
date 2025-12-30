<template>
  <div class="h-full w-full bg-[#F58220] flex flex-col shadow-lg overflow-hidden">
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
    <div class="p-4 text-white/40 text-[10px] text-center italic">
      MLI Recording System
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const activeKey = computed(() => route.name)
</script>
