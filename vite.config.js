import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()], // 只写一次
  // base: "/AI-Mental-Health-Assistant/", // 关键修复 // 只写一次
  base: "/AI-Mental-Health-Assistant/", // 关键修复

  server: {
    proxy: {
      '/api': {
        target: 'http://159.75.169.224:1235',
        changeOrigin: true
      }
    }
  }
})