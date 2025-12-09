import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
// import eslint from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [
    vue()
    // eslint({
    //   cache: false,
    //   include: ['src/**/*.ts', 'src/**/*.vue'],
    //   exclude: ['node_modules']
    // })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/assets/styles/variables.scss";`,
      }
    }
  },
  server: {
    port: 8101,
    proxy: {
      '/api': {
        target: 'http://localhost:8101',
        changeOrigin: true
      }
    }
  }
})
