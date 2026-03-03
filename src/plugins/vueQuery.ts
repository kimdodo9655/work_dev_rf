/**
 * 문서 경로: `@/src/plugins/vueQuery.ts`
 * 문서 제목: vue Query 구현 파일
 */

import { VueQueryPlugin } from '@tanstack/vue-query'
import type { App } from 'vue'

export function setupVueQuery(app: App) {
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
          staleTime: 5 * 60 * 1000 // 5분
        }
      }
    }
  })
}
