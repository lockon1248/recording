<template>
  <a-config-provider :theme="themeConfig" :locale="zhTW">
    <div class="h-screen w-screen flex flex-col overflow-hidden">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import zhTW from 'ant-design-vue/es/locale/zh_TW' // 繁體中文語系

// 三商美邦主題配置
const themeConfig = reactive({
  token: {
    colorPrimary: '#FF9900', // 品牌橘色
    colorInfo: '#FF9900',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    borderRadius: 4, // 稍微銳利的圓角顯得較為專業
    // 自定義字體與背景
    colorBgContainer: '#ffffff'
  },
  components: {
    Button: {
      colorPrimaryHover: '#FFAD33', // 懸停時稍亮的橘色
      controlHeight: 38 // 稍微加高按鈕增加點擊感
    },
    Input: {
      colorBorder: '#d9d9d9',
      hoverBorderColor: '#FF9900' // 輸入框 hover 也要橘色
    }
  }
})
</script>

<style>
/* 確保 html 和 body 也沒有預設的 margin 擋住高度 */
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
