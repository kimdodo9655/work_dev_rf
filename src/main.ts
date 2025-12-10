import '@/assets/styles/global.scss'
import '@flaticon/flaticon-uicons/css/all/all.css'
import '@/api/client'

import { createApp } from 'vue'

import App from '@/App.vue'
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
