import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // Ant Design Vue 4.x 使用 CSS-in-JS，不需要引入 CSS 檔
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      // 確保將 '@' 正確指向 'src' 資料夾
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})