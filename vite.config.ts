/**
 * 문서 경로: `@/vite.config.ts`
 * 문서 제목: vite.config 구현 파일
 */

import vue from '@vitejs/plugin-vue'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      open: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  build: {
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('html2canvas')) return 'html2canvas-vendor'
          if (id.includes('jspdf')) return 'jspdf-vendor'
          if (id.includes('pdfjs-dist')) return 'pdfjs-vendor'
          if (id.includes('@fullcalendar')) return 'calendar-vendor'
          if (id.includes('chart.js')) return 'chart-vendor'
          if (id.includes('@tanstack/vue-query')) return 'query-vendor'
          return undefined
        }
      }
    }
  },
  server: {
    port: 8101,
    proxy: {
      '/api': {
        target: 'http://localhost:8100',
        changeOrigin: true
      }
    }
  }
})
