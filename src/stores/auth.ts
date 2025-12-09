// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  // State
  const loginId = ref('')
  const userId = ref<number | null>(null)
  const roleLevel = ref<number | null>(null)
  const accessExpires = ref(0)
  const isLoggedIn = ref(false)

  // 현재 시간을 ref로 관리 (타이머에서 업데이트)
  const currentTime = ref(Math.floor(Date.now() / 1000))

  // Getters
  const remainingSeconds = computed(() => {
    const remaining = accessExpires.value - currentTime.value
    return Math.max(0, remaining)
  })

  const formattedTime = computed(() => {
    const min = Math.floor(remainingSeconds.value / 60)
    const sec = remainingSeconds.value % 60
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  })

  const isExpiringSoon = computed(() => {
    return remainingSeconds.value > 0 && remainingSeconds.value < 300
  })

  const isAdmin = computed(() => roleLevel.value === 100)

  // Actions
  function setAuth(data: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: number
    refreshTokenExpiresIn: number
    loginId: string
    userId: number
    roleLevel: number
  }) {
    console.log('🔐 setAuth 호출됨:', data)
    storage.save(data)
    loginId.value = data.loginId
    userId.value = data.userId
    roleLevel.value = data.roleLevel
    accessExpires.value = data.accessTokenExpiresIn
    isLoggedIn.value = true
    console.log('✅ 로그인 상태:', {
      isLoggedIn: isLoggedIn.value,
      accessExpires: accessExpires.value,
      currentTime: currentTime.value
    })
  }

  function updateTokens(data: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: number
    refreshTokenExpiresIn: number
  }) {
    console.log('🔄 updateTokens 호출됨')
    storage.updateTokens(data)
    accessExpires.value = data.accessTokenExpiresIn
  }

  function loadAuth() {
    console.log('📂 loadAuth 호출됨')
    const data = storage.get()
    console.log('저장된 데이터:', data)

    loginId.value = data.loginId || ''
    userId.value = data.userId
    roleLevel.value = data.roleLevel
    accessExpires.value = data.accessExpires

    const hasToken = !!data.accessToken
    const notExpired = storage.isValid()
    isLoggedIn.value = hasToken && notExpired

    console.log('✅ loadAuth 결과:', {
      hasToken,
      notExpired,
      isLoggedIn: isLoggedIn.value,
      accessExpires: accessExpires.value,
      currentTime: currentTime.value
    })
  }

  function clearAuth() {
    console.log('🗑️ clearAuth 호출됨')
    storage.clear()
    loginId.value = ''
    userId.value = null
    roleLevel.value = null
    accessExpires.value = 0
    isLoggedIn.value = false
    console.log('✅ 로그아웃 완료')
  }

  // 현재 시간 업데이트 함수 (타이머에서 호출)
  function updateCurrentTime() {
    currentTime.value = Math.floor(Date.now() / 1000)
  }

  return {
    // State
    loginId,
    userId,
    roleLevel,
    accessExpires,
    isLoggedIn,

    // Getters
    remainingSeconds,
    formattedTime,
    isExpiringSoon,
    isAdmin,

    // Actions
    setAuth,
    updateTokens,
    loadAuth,
    clearAuth,
    updateCurrentTime // 추가
  }
})
