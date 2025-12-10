import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { AuthState } from '@/types'
import { storage } from '@/utils/storage'

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

  // 타이머 인터벌 ID
  let timerInterval: ReturnType<typeof setInterval> | null = null

  // ============================================================================
  // Getters - 로그인 상태
  // ============================================================================

  const isLoggedIn = computed(() => {
    const hasToken = !!storage.get().accessToken
    const notExpired = accessExpires.value > currentTime.value
    return hasToken && notExpired
  })

  const isAdmin = computed(() => {
    // 시스템 관리자(100) 또는 서비스 관리자(90)
    return roleLevel.value === 100 || roleLevel.value === 90
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
    // 5분 미만 남았을 때
    return remainingSeconds.value > 0 && remainingSeconds.value < 300
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
    console.log('🔐 [AUTH] 로그인 성공:', { loginId: data.loginId, userId: data.userId })

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

  function updateTokens(data: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: number
    refreshTokenExpiresIn: number
  }) {
    console.log('🔄 [AUTH] 토큰 갱신 성공')

    // storage에 저장
    storage.updateTokens(data)

    // state 업데이트
    accessExpires.value = data.accessTokenExpiresIn
    refreshExpires.value = data.refreshTokenExpiresIn
  }

  function setBankCode(code: string) {
    console.log('🏦 [AUTH] 금융기관 선택:', code)
    selectedBankCode.value = code
    storage.setBankCode(code)
  }

  function loadAuth() {
    console.log('📂 [AUTH] 저장된 인증 정보 로드')

    const data = storage.get()
    console.log('저장된 데이터:', {
      hasToken: !!data.accessToken,
      loginId: data.loginId,
      bankCode: data.bankCode
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
    console.log('🗑️ [AUTH] 로그아웃 처리')

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
  }

  // ============================================================================
  // Actions - 세션 타이머
  // ============================================================================

  function startTimer() {
    // 이미 실행 중이면 중복 방지
    if (timerInterval) return

    console.log('⏰ [AUTH] 세션 타이머 시작')

    timerInterval = setInterval(() => {
      currentTime.value = Math.floor(Date.now() / 1000)

      // 세션 만료 시 자동 로그아웃
      if (isExpired.value) {
        console.warn('⚠️ [AUTH] 세션 만료 - 자동 로그아웃')
        handleAutoLogout()
      }
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval) {
      console.log('⏹️ [AUTH] 세션 타이머 정지')
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  function updateCurrentTime() {
    currentTime.value = Math.floor(Date.now() / 1000)
  }

  function handleAutoLogout() {
    clearAuth()
    window.location.href = '/auth/auto-logout'
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
