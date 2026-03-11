/**
 * 문서 경로: `@/vite.config.ts`
 * 문서 제목: TypeScript 모듈: vite-config
 */

import vue from '@vitejs/plugin-vue'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const shouldAnalyze = mode === 'analyze'
  const isProdBuild = mode === 'prod'

  return {
    plugins: [
      vue(),
      ...(shouldAnalyze
        ? [
            visualizer({
              filename: 'dist/stats.html',
              gzipSize: true,
              brotliSize: true,
              open: true
            })
          ]
        : [])
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
      // 규칙:
      // - prod: 주석 제거 + minify 유지
      // - local/development/analyze: 비압축 유지
      minify: isProdBuild ? 'esbuild' : false,
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
    esbuild: {
      // legal comment까지 포함해 운영 번들에서는 주석이 남지 않도록 명시
      legalComments: isProdBuild ? 'none' : 'inline'
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
  }
})
