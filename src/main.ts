/**
 * 문서 경로: `@/src/main.ts`
 * 문서 제목: 애플리케이션 부트스트랩
 */

import '@/assets/styles/global.scss'
import '@/api/client'

import { createApp } from 'vue'

import App from '@/App.vue'
import { setupCodeFormatter } from '@/plugins/codeFormatter'
import { setupVueQuery } from '@/plugins/vueQuery'
import router from '@/router'
import pinia from '@/stores'
import { ENV } from '@/utils/env'
import { logger } from '@/utils/logger'

const app = createApp(App)

// 플러그인 등록
app.use(pinia)
app.use(router)
setupVueQuery(app)
setupCodeFormatter(app)

// 전역 에러 핸들러
app.config.errorHandler = (err, _instance, info) => {
  logger.error('Global error', { error: err, info })
}

// 환경 정보 로그 (개발 환경에서만 출력)
logger.info('Application Started')
logger.info('Environment info', {
  apiBaseUrl: ENV.API_BASE_URL,
  isDev: ENV.IS_DEV
})

app.mount('#app')
