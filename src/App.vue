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
import { storage } from '@/utils/storage'

import TempLogin from './components/dev/TEMP/TempLogin.vue'
import TempPdf from './components/dev/TEMP/TempPdf.vue'

const authStore = useAuthStore()
const router = useRouter()

// Temp 요소 on/off (기존)
const isVisible = ref(false)

// ============================================================================
// Lifecycle
// ============================================================================
onMounted(async () => {
  logger.info('[APP] Application mounted')

  // 1. 저장된 인증 정보 유효성 검사 및 로드 👈 추가
  validateAndLoadAuth()

  // 2. 현재 경로 및 인증 상태 확인
  const currentPath = router.currentRoute.value.path
  const authState = authStore.authState

  logger.info('[APP] Initial routing check', {
    authState,
    currentPath,
    isLoggedIn: authStore.isLoggedIn,
    hasBankCode: !!authStore.selectedBankCode
  })

  // 3. 인증 상태에 따른 자동 라우팅 (Root 페이지가 아닌 경우에만)
  if (currentPath !== '/') {
    await handleInitialRouting(currentPath, authState)
  }
})

onBeforeUnmount(() => {
  logger.info('[APP] Application unmounting')
  authStore.cleanup()
})

// ============================================================================
// 인증 정보 유효성 검사 및 로드
// ============================================================================
function validateAndLoadAuth() {
  const storedData = storage.get()

  // 토큰이 없으면 로컬스토리지 전체 삭제
  if (!storedData.accessToken) {
    logger.warn('[APP] No access token found - Clear storage')
    storage.clear()
    return
  }

  // 토큰 만료 시간 체크
  const now = Math.floor(Date.now() / 1000)
  const isAccessTokenValid = storedData.accessExpires > now
  const isRefreshTokenValid = storedData.refreshExpires > now

  // 두 토큰 모두 만료되었으면 로컬스토리지 전체 삭제
  if (!isAccessTokenValid && !isRefreshTokenValid) {
    logger.warn('[APP] Both tokens expired - Clear storage', {
      accessExpires: storedData.accessExpires,
      refreshExpires: storedData.refreshExpires,
      currentTime: now
    })
    storage.clear()
    return
  }

  // accessToken만 만료되었으면 로컬스토리지 전체 삭제
  if (!isAccessTokenValid && isRefreshTokenValid) {
    logger.warn('[APP] Access token expired - Clear storage', {
      accessExpires: storedData.accessExpires,
      refreshExpires: storedData.refreshExpires,
      currentTime: now
    })
    storage.clear()
    return
  }

  // 유효한 경우에만 정상 로드
  logger.info('[APP] Valid tokens found - Load auth', {
    accessExpires: storedData.accessExpires,
    refreshExpires: storedData.refreshExpires,
    currentTime: now,
    remainingSeconds: storedData.accessExpires - now
  })

  authStore.loadAuth()
}

// ============================================================================
// 초기 라우팅 처리
// ============================================================================
async function handleInitialRouting(
  currentPath: string,
  authState: 'pre-auth' | 'onboarding' | 'auth'
) {
  // 에러 페이지는 라우팅하지 않음
  if (currentPath.startsWith('/error/')) {
    logger.info('[APP] Error page - No routing needed')
    return
  }

  switch (authState) {
    case 'pre-auth':
      // 로그인 전: 인증 페이지나 단말기 정보 페이지가 아니면 로그인으로
      if (!currentPath.startsWith('/auth') && currentPath !== '/device-info') {
        logger.warn('[APP] Not logged in - Redirect to login')
        await router.replace('/auth/login')
      }
      break

    case 'onboarding':
      // 로그인 후, 금융기관 선택 전
      if (currentPath.startsWith('/auth')) {
        // 인증 페이지에 있으면 금융기관 선택으로
        logger.info('[APP] Logged in but on auth page - Redirect to bank selection')
        await router.replace('/bank-select')
      } else if (!isOnboardingAllowedPath(currentPath)) {
        // onboarding 허용 경로가 아니면 금융기관 선택으로
        logger.warn('[APP] Not allowed in onboarding state - Redirect to bank selection')
        await router.replace('/bank-select')
      }
      break

    case 'auth':
      // 로그인 후, 금융기관 선택 완료
      if (currentPath.startsWith('/auth') && currentPath !== '/auth/auto-logout') {
        // 인증 페이지에 있으면 대시보드로
        logger.info('[APP] Already authenticated - Redirect to dashboard')
        await router.replace('/dashboard')
      } else if (currentPath === '/device-info') {
        // 이미 로그인했는데 단말기 정보 페이지에 있으면 대시보드로
        logger.info('[APP] Already authenticated - Redirect to dashboard from device-info')
        await router.replace('/dashboard')
      }
      break
  }
}

// onboarding 상태에서 허용되는 경로 체크
function isOnboardingAllowedPath(path: string): boolean {
  const allowedPaths = ['/bank-select', '/my/organization', '/my/users', '/my/profile']
  return allowedPaths.some((allowed) => path.startsWith(allowed))
}
</script>
