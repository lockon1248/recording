<template>
  <div class="w-64 h-full bg-[#F58220] flex flex-col shadow-lg overflow-hidden">
    
    <div class="p-6 border-b border-white/20">
      <div class="text-white font-bold text-lg tracking-widest">功能選單</div>
    </div>
    <nav class="flex-1 py-4">
      <ul class="list-none p-0 m-0">
        <li 
          @click="activeKey = 'permission'"
          :class="[
            'flex items-center px-6 py-4 cursor-pointer transition-all duration-200',
            activeKey === 'permission' ? 'bg-[#E67610] text-white shadow-inner' : 'text-white/80 hover:bg-white/10 hover:text-white'
          ]"
        >
          <span class="mr-3 text-xl">👤</span>
          <span class="font-bold tracking-wide">人員權限設定</span>
        </li>
        <li 
          @click="activeKey = 'recordingList'"
          :class="[
            'flex items-center px-6 py-4 cursor-pointer transition-all duration-200',
            activeKey === 'recordingList' ? 'bg-[#E67610] text-white shadow-inner' : 'text-white/80 hover:bg-white/10 hover:text-white'
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
import { ref,watch } from 'vue';

// 用來記錄目前選中的項目
const activeKey = ref('cases');

// 監聽 activeKey 的變化，並根據選中的項目導航到對應的路由
watch(activeKey, (newKey) => {
  if (newKey === 'permission') {
    // 導航到人員權限設定頁面
    window.location.href = '/permission';
  } else if (newKey === 'recordingList') {
    // 導航到錄音案件清單頁面
    window.location.href = '/recordingList';
  }
});
</script>