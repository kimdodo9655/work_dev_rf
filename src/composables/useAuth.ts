// composables/useAuth.ts
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { authAPI } from '@/api/services/auth'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types'
import { logger } from '@/utils/logger'

export function useAuth() {
  const store = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  // ============================================================================
  // Mutations
  // ============================================================================

  /**
   * 로그인 Mutation
   * API: /api/auth/login 🅿️
   *
   * 로그인 프로세스:
   * 1. mutationFn: API 호출 함수 정의
   * 2. onSuccess: 로그인 성공 시 자동 실행
   *    2-1. 스토어에 인증 정보 저장 (토큰, 사용자 정보 등)
   *    2-2. auth 관련 쿼리 캐시 무효화 (재조회 트리거)
   *    2-3. 성공 로그 기록
   * 3. onError: 로그인 실패 시 자동 실행
   *    3-1. 에러 로그 기록
   */
  const loginMutation = useMutation({
    // 1. API 호출 함수
    mutationFn: (data: LoginRequest) => authAPI.login(data),

    // 2. 로그인 성공 시 처리
    onSuccess: (response) => {
      // 2-1. 스토어에 인증 정보 저장
      store.setAuth(response.data)

      // 2-2. auth 관련 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['auth'] })

      // 2-3. 성공 로그
      logger.info('[AUTH] Login successful')
    },

    // 3. 로그인 실패 시 처리
    onError: (error) => {
      // 3-1. 에러 로그
      logger.error('[AUTH] Login failed', { error })
    }
  })

  /**
   * 로그아웃 Mutation
   * API: /api/auth/logout 🅿️
   *
   * 로그아웃 프로세스:
   * 1. mutationFn: API 호출 함수 정의
   * 2. onSettled: 성공/실패 여부와 관계없이 실행
   *    2-1. 스토어 초기화 (토큰, 사용자 정보 삭제)
   *    2-2. 모든 쿼리 캐시 초기화
   *    2-3. 로그아웃 로그 기록
   */
  const logoutMutation = useMutation({
    // 1. API 호출 함수
    mutationFn: () => authAPI.logout(),

    // 2. 로그아웃 후 처리 (성공/실패 무관)
    onSettled: () => {
      // 2-1. 스토어 초기화
      store.clearAuth()

      // 2-2. 모든 쿼리 캐시 초기화
      queryClient.clear()

      // 2-3. 로그아웃 로그
      logger.info('[AUTH] Logout successful')
    }
  })

  // ============================================================================
  // Business Logic (Helper Functions)
  // ============================================================================

  /**
   * 로그인 + 리다이렉트 헬퍼 함수
   *
   * 실행 순서:
   * 1. loginMutation.mutateAsync() 호출
   *    1-1. API 호출 (authAPI.login)
   *    1-2. 성공 시: onSuccess 콜백 자동 실행
   *         → store.setAuth() 실행
   *         → queryClient.invalidateQueries() 실행
   *    1-3. 실패 시: onError 콜백 자동 실행 및 예외 throw
   * 2. onSuccess 콜백 실행 (options.onSuccess)
   *    2-1. 외부에서 전달받은 성공 콜백 실행
   *    2-2. 예: 아이디 저장, 분석 이벤트 전송 등
   * 3. 리다이렉트 처리
   *    3-1. 지정된 경로로 이동 (기본값: /bank-select)
   *    3-2. router.push() 실행
   *
   * @param credentials - 로그인 정보 (loginId, password)
   * @param options - 선택적 옵션
   * @param options.redirectTo - 로그인 성공 후 이동할 경로 (기본: /bank-select)
   * @param options.onSuccess - 로그인 성공 후 실행할 추가 콜백 함수
   * @throws {Error} 로그인 실패 시 예외 throw
   */
  const login = async (
    credentials: LoginRequest,
    options?: {
      redirectTo?: string
      onSuccess?: () => void | Promise<void>
    }
  ): Promise<void> => {
    // 1. 로그인 API 호출
    //    - mutationFn 실행 → authAPI.login() 호출
    //    - 성공 시: onSuccess 자동 실행 (store.setAuth, queryClient.invalidateQueries)
    //    - 실패 시: onError 실행 후 예외 throw
    await loginMutation.mutateAsync(credentials)

    // 2. 외부 성공 콜백 실행
    //    - 예: 아이디 저장, 로그인 이벤트 추적 등
    //    - 컴포넌트에서 전달한 추가 로직 실행
    await options?.onSuccess?.()

    // 3. 페이지 리다이렉트
    //    - 지정된 경로 또는 기본 경로로 이동
    const redirectPath = options?.redirectTo || '/bank-select'
    await router.push(redirectPath)
  }

  /**
   * 로그아웃 + 로그인 페이지 이동 헬퍼 함수
   *
   * 실행 순서:
   * 1. logoutMutation.mutateAsync() 호출
   *    1-1. API 호출 (authAPI.logout)
   *    1-2. onSettled 콜백 자동 실행
   *         → store.clearAuth() 실행
   *         → queryClient.clear() 실행
   * 2. 로그인 페이지로 리다이렉트
   *    2-1. router.push('/auth/login') 실행
   *
   * @throws {Error} 로그아웃 실패 시 예외 throw
   */
  const logout = async (): Promise<void> => {
    // 1. 로그아웃 API 호출
    //    - mutationFn 실행 → authAPI.logout() 호출
    //    - onSettled 자동 실행 (store.clearAuth, queryClient.clear)
    await logoutMutation.mutateAsync()

    // 2. 로그인 페이지로 리다이렉트
    await router.push('/auth/login')
  }

  // ============================================================================
  // Computed States
  // ============================================================================

  /**
   * 인증 여부
   * - store.isLoggedIn getter 사용 (토큰 존재 여부 + 만료 시간 체크)
   * - true: 로그인 상태 (토큰 존재 + 만료 안됨)
   * - false: 로그아웃 상태 (토큰 없음 or 만료됨)
   */
  const isAuthenticated = computed(() => store.isLoggedIn)

  /**
   * 로딩 상태
   * - 로그인 또는 로그아웃 요청 중이면 true
   * - 두 요청 모두 완료되면 false
   */
  const isLoading = computed(() => loginMutation.isPending.value || logoutMutation.isPending.value)

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // Mutations (원본 - 필요시 직접 제어 가능)
    loginMutation, // 로그인 mutation 객체 (isPending, isError 등 직접 접근)
    logoutMutation, // 로그아웃 mutation 객체

    // Helper Functions (비즈니스 로직 포함)
    login, // 로그인 + 리다이렉트 헬퍼
    logout, // 로그아웃 + 리다이렉트 헬퍼

    // Computed States (파생 상태)
    isAuthenticated, // 로그인 여부 (store.isLoggedIn 사용)
    isLoading // 로딩 상태
  }
}
