import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { AuthState } from '@/types'
import type { TokenRefreshResponse } from '@/types'
import { UserRoleLevel } from '@/types'
import { handleInvalidAuthState, isValidAuthData } from '@/utils/authValidator'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

// ============================================================================
// 상수 정의
// ============================================================================

/** 세션 만료 경고 시간 (초) - 5분 */
const SESSION_WARNING_THRESHOLD = 300

export const useAuthStore = defineStore('auth', () => {
  // ============================================================================
  // State
  // ============================================================================

  const loginId = ref('')
  const userId = ref<number | null>(null)
  const roleLevel = ref<number | null>(null)
  const selectedBankCode = ref<string | null>(null)

  // 토큰 만료 시간 (Unix timestamp 초 단위)
  const accessExpires = ref(0)
  const refreshExpires = ref(0)

  // 현재 시간 (타이머에서 매초 업데이트)
  const currentTime = ref(Math.floor(Date.now() / 1000))

  // 자동 로그아웃 페이지 접근 플래그
  const canAccessAutoLogoutPage = ref(false)

  // 타이머 인터벌 ID
  let timerInterval: ReturnType<typeof setInterval> | null = null

  // 로그아웃 플래그 (경쟁 조건 방지)
  let isLoggingOut = false

  // ============================================================================
  // Getters - 로그인 상태
  // ============================================================================

  const isLoggedIn = computed(() => {
    const hasToken = !!storage.get().accessToken
    const notExpired = accessExpires.value > currentTime.value
    return hasToken && notExpired
  })

  const isAdmin = computed(() => {
    // 시스템 관리자 또는 서비스 관리자
    return roleLevel.value === UserRoleLevel.SUPER_ADMIN || roleLevel.value === UserRoleLevel.ADMIN
  })

  // ============================================================================
  // Getters - 인증 상태 (pre-auth / onboarding / auth)
  // ============================================================================

  const authState = computed<AuthState>(() => {
    if (!isLoggedIn.value) {
      return 'pre-auth' // 로그인 전
    }

    if (!selectedBankCode.value) {
      return 'onboarding' // 로그인 후, 금융기관 선택 전
    }

    return 'auth' // 로그인 후, 금융기관 선택 완료
  })

  // ============================================================================
  // Getters - 세션 타이머
  // ============================================================================

  const remainingSeconds = computed(() => {
    const remaining = accessExpires.value - currentTime.value
    return Math.max(0, remaining)
  })

  const formattedTime = computed(() => {
    const minutes = Math.floor(remainingSeconds.value / 60)
    const seconds = remainingSeconds.value % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  })

  const isExpiringSoon = computed(() => {
    // SESSION_WARNING_THRESHOLD 미만 남았을 때 (5분)
    return remainingSeconds.value > 0 && remainingSeconds.value < SESSION_WARNING_THRESHOLD
  })

  const isExpired = computed(() => {
    return remainingSeconds.value === 0 && isLoggedIn.value
  })

  // ============================================================================
  // Actions - 인증 설정
  // ============================================================================

  function setAuth(data: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: number
    refreshTokenExpiresIn: number
    loginId: string
    userId: number
    roleLevel: number
  }) {
    logger.info('[AUTH] 로그인 성공', { loginId: data.loginId, userId: data.userId })

    // storage에 저장
    storage.save(data)

    // state 업데이트
    loginId.value = data.loginId
    userId.value = data.userId
    roleLevel.value = data.roleLevel
    accessExpires.value = data.accessTokenExpiresIn
    refreshExpires.value = data.refreshTokenExpiresIn

    // 타이머 시작
    startTimer()
  }

  function updateTokens(data: TokenRefreshResponse) {
    // ✅ 필수 값 검증 (없으면 예외)
    if (
      !data.accessToken ||
      !data.refreshToken ||
      data.accessTokenExpiresIn == null ||
      data.refreshTokenExpiresIn == null
    ) {
      throw new Error('Invalid auth data')
    }

    logger.info('[AUTH] 토큰 갱신 성공')

    // storage에 저장
    storage.updateTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpiresIn: data.accessTokenExpiresIn,
      refreshTokenExpiresIn: data.refreshTokenExpiresIn
    })

    // state 업데이트
    accessExpires.value = data.accessTokenExpiresIn
    refreshExpires.value = data.refreshTokenExpiresIn
  }

  function setBankCode(code: string) {
    logger.info('[AUTH] 금융기관 선택', { code })
    selectedBankCode.value = code
    storage.setBankCode(code)
  }

  function loadAuth() {
    logger.info('[AUTH] 저장된 인증 정보 로드 시도')

    const data = storage.get()

    // 토큰이 없으면 로드하지 않고 종료
    if (!data.accessToken) {
      logger.info('[AUTH] No token in storage - Skip loading')
      return
    }

    // ✅ authState 계산 (bankCode 유무로 판단)
    const computedAuthState = data.bankCode ? 'auth' : 'onboarding'

    // ✅ 필수값 검증 (authState 전달)
    if (!isValidAuthData(data, computedAuthState)) {
      logger.error('[AUTH] Invalid stored auth data - Clear and skip loading', {
        authState: computedAuthState
      })
      handleInvalidAuthState()
      return
    }

    logger.info('[AUTH] 저장된 데이터 로드', {
      hasToken: true,
      loginId: data.loginId,
      bankCode: data.bankCode,
      accessExpires: data.accessExpires,
      refreshExpires: data.refreshExpires,
      authState: computedAuthState
    })

    loginId.value = data.loginId || ''
    userId.value = data.userId
    roleLevel.value = data.roleLevel
    selectedBankCode.value = data.bankCode
    accessExpires.value = data.accessExpires
    refreshExpires.value = data.refreshExpires

    // 로그인 상태면 타이머 시작
    if (isLoggedIn.value) {
      startTimer()
    }
  }

  function clearAuth() {
    logger.info('[AUTH] 로그아웃 처리')

    // 타이머 정지
    stopTimer()

    // storage 삭제
    storage.clear()

    // state 초기화
    loginId.value = ''
    userId.value = null
    roleLevel.value = null
    selectedBankCode.value = null
    accessExpires.value = 0
    refreshExpires.value = 0

    // 로그아웃 플래그 초기화
    isLoggingOut = false
  }

  // ============================================================================
  // Actions - 세션 타이머
  // ============================================================================

  function startTimer() {
    // 이미 실행 중이면 중복 방지
    if (timerInterval) return

    logger.info('[AUTH] 세션 타이머 시작')

    // 초기 시간 업데이트
    currentTime.value = Math.floor(Date.now() / 1000)

    // 토큰이 이미 만료되었는지 체크
    if (accessExpires.value <= currentTime.value) {
      logger.warn('[AUTH] 토큰이 이미 만료됨 - 자동 로그아웃')
      handleAutoLogout()
      return
    }

    timerInterval = setInterval(() => {
      currentTime.value = Math.floor(Date.now() / 1000)

      // 세션 만료 시 자동 로그아웃
      if (accessExpires.value <= currentTime.value) {
        logger.warn('[AUTH] 세션 만료 - 자동 로그아웃')
        handleAutoLogout()
      }
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval) {
      logger.info('[AUTH] 세션 타이머 정지')
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  function updateCurrentTime() {
    currentTime.value = Math.floor(Date.now() / 1000)
  }

  function handleAutoLogout() {
    // 이미 로그아웃 처리 중이면 중복 실행 방지
    if (isLoggingOut) {
      logger.info('[AUTH] Already logging out - Skip duplicate execution')
      return
    }

    isLoggingOut = true

    // 자동 로그아웃 페이지 접근 허용 플래그 설정
    canAccessAutoLogoutPage.value = true

    stopTimer()
    clearAuth()

    // 현재 페이지가 자동 로그아웃 페이지가 아니면 이동
    if (window.location.pathname !== '/auth/auto-logout') {
      window.location.href = '/auth/auto-logout'
    }
  }

  // ============================================================================
  // Cleanup
  // ============================================================================

  function cleanup() {
    stopTimer()
  }

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State
    loginId,
    userId,
    roleLevel,
    selectedBankCode,
    accessExpires,
    refreshExpires,
    canAccessAutoLogoutPage,

    // Getters - 로그인 상태
    isLoggedIn,
    isAdmin,
    authState,

    // Getters - 세션 타이머
    remainingSeconds,
    formattedTime,
    isExpiringSoon,
    isExpired,

    // Actions - 인증
    setAuth,
    updateTokens,
    setBankCode,
    loadAuth,
    clearAuth,

    // Actions - 타이머
    startTimer,
    stopTimer,
    updateCurrentTime,
    handleAutoLogout,
    cleanup
  }
})
