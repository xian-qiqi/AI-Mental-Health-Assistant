import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()], // 只写一次
  // 注释掉或删除 base 配置（Netlify 不需要）
  // base: "/AI-Mental-Health-Assistant/", // GitHub Pages部署路径
  
  server: {
    proxy: {
      '/api': {
        target: 'http://159.75.169.224:1235',
        changeOrigin: true
      }
    }
  }
})