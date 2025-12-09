import { ref, watch } from 'vue'

export type AuthState = 'pre-auth' | 'onboarding' | 'auth'
export type LevelState = '100' | '200' | '300'

// 전역 상태
const currentAuthState = ref<AuthState>('pre-auth')
const currentLevelState = ref<LevelState>('100')

// 초기화 여부
let initialized = false

export function useDevOptions() {
  // 최초 1회만 localStorage에서 로드
  if (!initialized) {
    const savedAuthState = localStorage.getItem('authState') as AuthState | null
    if (savedAuthState && ['pre-auth', 'onboarding', 'auth'].includes(savedAuthState)) {
      currentAuthState.value = savedAuthState
    }

    const savedLevelState = localStorage.getItem('levelState') as LevelState | null
    if (savedLevelState && ['100', '200', '300'].includes(savedLevelState)) {
      currentLevelState.value = savedLevelState
    }

    // 상태 변경 시 localStorage에 자동 저장
    watch(currentAuthState, (newState) => {
      localStorage.setItem('authState', newState)
    })

    watch(currentLevelState, (newLevel) => {
      localStorage.setItem('levelState', newLevel)
    })

    initialized = true
  }

  const setAuthState = (state: AuthState) => {
    currentAuthState.value = state
  }

  const setLevelState = (level: LevelState) => {
    currentLevelState.value = level
  }

  return {
    // 상태
    currentAuthState,
    currentLevelState,

    // 메서드
    setAuthState,
    setLevelState,

    // 상수
    AUTH_STATES: ['pre-auth', 'onboarding', 'auth'] as const,
    LEVEL_STATES: ['100', '200', '300'] as const
  }
}
