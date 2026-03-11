/**
 * 문서 경로: `@/src/composables/utils/useAuthInitializer.ts`
 * 문서 제목: 컴포저블 유틸: use-auth-initializer
 */

/**
 * @file useAuthInitializer.ts
 * @description 인증 초기화 Composable (유틸리티)
 */

import { useRouter } from 'vue-router'

import { authAPI } from '@/api/services/auth'
import { useAuthStore } from '@/stores/auth'
import type { AuthState } from '@/types'
import { extractTokenRefreshPayload } from '@/utils/authPayload'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

/**
 * 앱 초기화 시 인증 상태를 검증하고 라우팅을 처리하는 composable
 */
export function useAuthInitializer() {
  const authStore = useAuthStore()
  const router = useRouter()

  // ============================================================================
  // Validation Functions
  // ============================================================================

  /**
   * 저장된 인증 정보의 유효성을 검사하고 로드
   */
  async function validateAndLoadAuth() {
    const storedData = storage.get()

    // 토큰이 없으면 그냥 종료 (이미 비어있으므로 clear 불필요)
    if (!storedData.accessToken) {
      logger.info('[AUTH INIT] No access token - Skip loading')
      return
    }

    // 토큰 만료 시간 체크
    const now = Math.floor(Date.now() / 1000)
    const isAccessTokenValid = storedData.accessExpires > now
    const isRefreshTokenValid = storedData.refreshExpires > now

    // 두 토큰 모두 만료되었으면 로컬스토리지 삭제하고 종료
    if (!isAccessTokenValid && !isRefreshTokenValid) {
      logger.warn('[AUTH INIT] Both tokens expired - Clear storage', {
        accessExpires: storedData.accessExpires,
        refreshExpires: storedData.refreshExpires,
        currentTime: now
      })
      storage.clear()
      return
    }

    // 분기: access 만료 / refresh 유효
    if (!isAccessTokenValid && isRefreshTokenValid) {
      logger.info('[AUTH INIT] Access token expired - Try refresh', {
        accessExpires: storedData.accessExpires,
        refreshExpires: storedData.refreshExpires,
        currentTime: now
      })

      if (!storedData.refreshToken) {
        logger.warn('[AUTH INIT] Missing refresh token - Clear storage')
        storage.clear()
        return
      }

      try {
        const response = await authAPI.refresh({
          refreshToken: storedData.refreshToken
        })
        const payload = extractTokenRefreshPayload(response)

        if (!payload) {
          throw new Error('Invalid refresh response')
        }

        storage.updateTokens({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          accessTokenExpiresIn: payload.accessTokenExpiresIn,
          refreshTokenExpiresIn: payload.refreshTokenExpiresIn
        })

        logger.info('[AUTH INIT] Token refresh success - Load auth')
        authStore.loadAuth()
      } catch (error) {
        logger.warn('[AUTH INIT] Token refresh failed - Clear storage', { error })
        storage.clear()
      }
      return
    }

    // 유효한 경우에만 authStore에 로드
    logger.info('[AUTH INIT] Valid tokens found - Load auth', {
      accessExpires: storedData.accessExpires,
      refreshExpires: storedData.refreshExpires,
      currentTime: now,
      remainingSeconds: storedData.accessExpires - now
    })

    authStore.loadAuth()
  }

  /**
   * onboarding 상태에서 허용되는 경로인지 체크
   */
  function isOnboardingAllowedPath(path: string): boolean {
    // 규칙: onboarding 허용 경로 고정
    const allowedPaths = ['/bank-select', '/my/organization', '/my/users', '/my/profile']
    return allowedPaths.some((allowed) => path.startsWith(allowed))
  }

  /**
   * 인증 상태에 따라 초기 라우팅 처리
   */
  async function handleInitialRouting(currentPath: string, authState: AuthState) {
    // 역할: 저장 상태와 현재 URL 동기화
    // 에러 페이지는 라우팅하지 않음
    if (currentPath.startsWith('/error/')) {
      logger.info('[AUTH INIT] Error page - No routing needed')
      return
    }

    switch (authState) {
      case 'pre-auth':
        // 로그인 전: 인증 페이지나 단말기 정보 페이지가 아니면 로그인으로
        if (!currentPath.startsWith('/auth') && currentPath !== '/device-info') {
          logger.warn('[AUTH INIT] Not logged in - Redirect to login')
          await router.replace({ name: 'Login' })
        }
        break

      case 'onboarding':
        // 로그인 후, 금융기관 선택 전
        if (currentPath.startsWith('/auth')) {
          // 인증 페이지에 있으면 금융기관 선택으로
          logger.info('[AUTH INIT] Logged in but on auth page - Redirect to bank selection')
          await router.replace({ name: 'BankSelection' })
        } else if (!isOnboardingAllowedPath(currentPath)) {
          // onboarding 허용 경로가 아니면 금융기관 선택으로
          logger.warn('[AUTH INIT] Not allowed in onboarding state - Redirect to bank selection')
          await router.replace({ name: 'BankSelection' })
        }
        break

      case 'auth':
        // 로그인 후, 금융기관 선택 완료
        if (currentPath.startsWith('/auth') && currentPath !== '/auth/auto-logout') {
          // 인증 페이지에 있으면 대시보드로
          logger.info('[AUTH INIT] Already authenticated - Redirect to dashboard')
          await router.replace({ name: 'Dashboard' })
        } else if (currentPath === '/device-info') {
          // 이미 로그인했는데 단말기 정보 페이지에 있으면 대시보드로
          logger.info('[AUTH INIT] Already authenticated - Redirect to dashboard from device-info')
          await router.replace({ name: 'Dashboard' })
        }
        break
    }
  }

  /**
   * 앱 초기화
   */
  async function initialize() {
    logger.info('[AUTH INIT] Starting initialization')

    // 1. 저장된 인증 정보 유효성 검사 및 로드
    await validateAndLoadAuth()

    // 2. 현재 경로 및 인증 상태 확인
    const currentPath = router.currentRoute.value.path
    const authState = authStore.authState

    logger.info('[AUTH INIT] Initial routing check', {
      authState,
      currentPath,
      isLoggedIn: authStore.isLoggedIn,
      hasBankCode: !!authStore.selectedBankCode
    })

    // 3. 인증 상태에 따른 자동 라우팅 (Root 페이지가 아닌 경우에만)
    if (currentPath !== '/') {
      await handleInitialRouting(currentPath, authState)
    }
  }

  return {
    initialize,
    validateAndLoadAuth,
    handleInitialRouting
  }
}
