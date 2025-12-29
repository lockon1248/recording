<template>
  <div class="h-screen w-screen flex items-stretch overflow-hidden">
    <div class="flex-1 min-w-[200px]">
      <sidebar class="h-full" />
    </div>
    <div class="flex-[5] flex flex-col justify-center items-center bg-white relative">
      
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-[0.4em] mb-4 text-[#003366]">三商美邦人壽</h1>
        <p class="text-gray-400 text-sm tracking-[0.2em] uppercase mb-8">
          Digital Recording System
        </p>
        <div class="w-12 h-1 bg-[#FF9900] mx-auto"></div>
        <p class="mt-10 text-xl font-light tracking-widest text-gray-600">
          歡迎使用錄音管理系統
        </p>
      </div>

      <div class="absolute bottom-10 text-gray-500 text-xs tracking-widest">
        © 2025 MLI Financial Group. All Rights Reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
// 無邏輯純靜態頁面
</script>
