<template>
  <div id="app">
    <div class="wrapper" :class="authStore.authState === 'pre-auth' ? 'pre-auth-wrapper' : ''">
      <AppHeader v-if="authStore.authState !== 'pre-auth'" />

      <div class="content" v-if="authStore.authState !== 'pre-auth'">
        <router-view />
      </div>

      <div class="full-content" v-if="authStore.authState === 'pre-auth'">
        <div class="full-content-inner">
          <router-view />
        </div>
      </div>

      <!-- 기존 TEMP 버튼 등은 그대로 유지 -->
      <button
        style="
          width: 100%;
          padding: 15px;
          background-color: #ddd;
          color: #333;
          cursor: pointer;
          border-radius: 10px;
          margin-bottom: 10px;
        "
        @click="isVisible = !isVisible"
      >
        TEMP (Testing UI)
      </button>
      <div style="width: 100%; background-color: #fff; border-radius: 10px" v-show="isVisible">
        <TempLogin />
        <TempPdf />
      </div>

      <AppFooter />
    </div>

    <DevNav />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import DevNav from '@/components/dev/DevNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { logger } from '@/utils/logger'

import TempLogin from './components/dev/TEMP/TempLogin.vue'
import TempPdf from './components/dev/TEMP/TempPdf.vue'

const authStore = useAuthStore()
const router = useRouter()

// Temp 요소 on/off (기존)
const isVisible = ref(false)

// ============================================================================
// Lifecycle
// ============================================================================
onMounted(() => {
  logger.info('[APP] Application mounted')

  // 1. 저장된 인증 정보 로드
  authStore.loadAuth()

  // 2. 인증 상태에 따라 초기 라우팅
  const currentPath = router.currentRoute.value.path
  const authState = authStore.authState

  logger.info('[APP] Auth state:', {
    authState,
    currentPath,
    isLoggedIn: authStore.isLoggedIn
  })

  // 로그인 전 페이지가 아닌데 로그인 안 되어 있으면 로그인 페이지로
  // if (
  //   authState === 'pre-auth' &&
  //   !currentPath.startsWith('/auth') &&
  //   !currentPath.startsWith('/error')
  // ) {
  //   logger.warn('[APP] Not logged in - Redirect to login')
  //   router.push('/auth/login')
  // }
})

onBeforeUnmount(() => {
  logger.info('[APP] Application unmounting')
  authStore.cleanup()
})
</script>
