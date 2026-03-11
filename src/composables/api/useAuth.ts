/**
 * 문서 경로: `@/src/composables/api/useAuth.ts`
 * 문서 제목: 컴포저블 API: use-auth
 */

/**
 * @file useAuth.ts
 * @description 인증 관련 Mutation Composable
 * @domain [P04] 인증
 */

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRouter } from 'vue-router'

import { authAPI } from '@/api/services/auth'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types'
import { extractLoginResponsePayload } from '@/utils/authPayload'
import { clearManualLogoutInProgress, markManualLogoutInProgress } from '@/utils/authSessionFlags'
import { logger } from '@/utils/logger'

export function useAuth() {
  const store = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  // ============================================================================
  // Mutations
  // ============================================================================

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),

    onSuccess: (response) => {
      // 규칙: 로그인 응답 shape는 여기서만 흡수
      const loginData = extractLoginResponsePayload(response)
      if (!loginData) {
        logger.error('[AUTH] Invalid login response', { loginData })
        throw new Error('Invalid login response')
      }

      store.setAuth({
        accessToken: loginData.accessToken,
        refreshToken: loginData.refreshToken,
        accessTokenExpiresIn: loginData.accessTokenExpiresIn,
        refreshTokenExpiresIn: loginData.refreshTokenExpiresIn,
        loginId: loginData.loginId,
        userId: loginData.userId,
        roleLevel: loginData.roleLevel
      })

      queryClient.invalidateQueries({ queryKey: ['auth'] })
      clearManualLogoutInProgress()

      logger.info('[AUTH] Login successful', {
        loginId: loginData.loginId,
        userId: loginData.userId
      })
    },

    onError: (error) => {
      logger.error('[AUTH] Login failed', { error })
    }
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // 순서: 로그아웃 플래그 선반영
      markManualLogoutInProgress()
      return authAPI.logout()
    },

    onSettled: () => {
      store.clearAuth()
      queryClient.clear()
      logger.info('[AUTH] Logout successful')
    }
  })

  // ============================================================================
  // Helper Functions
  // ============================================================================

  const login = async (
    credentials: LoginRequest,
    options?: {
      redirectTo?: RouteLocationRaw
      onSuccess?: (response: unknown) => void | Promise<void>
    }
  ): Promise<void> => {
    // 옵션: path / name / params 모두 허용
    const response = await loginMutation.mutateAsync(credentials)
    await options?.onSuccess?.(response)
    await router.push(options?.redirectTo || { name: 'BankSelection' })
  }

  const logout = async (): Promise<void> => {
    // 규칙: API 실패와 무관하게 로컬 인증 종료
    await logoutMutation.mutateAsync()
    await router.push({ name: 'Login' })
  }

  // ============================================================================
  // Computed States
  // ============================================================================

  const isAuthenticated = computed(() => store.isLoggedIn)
  const isLoading = computed(() => loginMutation.isPending.value || logoutMutation.isPending.value)

  return {
    loginMutation,
    logoutMutation,
    login,
    logout,
    isAuthenticated,
    isLoading
  }
}
