import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// 1. 導入 Icon 相關插件
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    // 2. 自動導入配置 (整合 Ant Design + Icons)
    Components({
      dts: true, // 自動生成 components.d.ts，讓 VS Code 有語法提示
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
        }),
        // 加入 Icon 解析器
        IconsResolver({
          prefix: 'i' // 使用 i- 作為前綴，例如 <i-material-symbols-lock />
        })
      ]
    }),
    // 3. Icon 插件核心配置
    Icons({
      compiler: 'vue3',
      autoInstall: true // 開啟自動安裝圖示集
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
