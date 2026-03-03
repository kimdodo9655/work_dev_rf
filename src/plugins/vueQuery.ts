/**
 * 문서 경로: `@/src/plugins/vueQuery.ts`
 * 문서 제목: 플러그인 모듈: vue-query
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
