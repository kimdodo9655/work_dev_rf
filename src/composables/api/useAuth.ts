/**
 * @file useAuth.ts
 * @description 인증 관련 Mutation Composable
 * @domain [P04] 인증
 */

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { authAPI } from '@/api/services/auth'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types'
import { logger } from '@/utils/logger'

/** axios 응답({data}) / DTO 응답(그 자체) 둘 다 지원 */
function unwrap<T>(res: any): T {
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return res as T
}

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
      // ✅ 신규 응답이 axios형/DTO형 무엇이든 지원
      const loginData = unwrap<any>(response)

      if (
        !loginData?.accessToken ||
        !loginData?.refreshToken ||
        !loginData?.loginId ||
        loginData?.userId === undefined ||
        loginData?.roleLevel === undefined
      ) {
        logger.error('[AUTH] Invalid login response', { loginData })
        throw new Error('Invalid login response')
      }

      store.setAuth({
        accessToken: loginData.accessToken,
        refreshToken: loginData.refreshToken,
        accessTokenExpiresIn: loginData.accessTokenExpiresIn || 0,
        refreshTokenExpiresIn: loginData.refreshTokenExpiresIn || 0,
        loginId: loginData.loginId,
        userId: loginData.userId,
        roleLevel: loginData.roleLevel
      })

      queryClient.invalidateQueries({ queryKey: ['auth'] })

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
    mutationFn: () => authAPI.logout(),

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
      redirectTo?: string
      onSuccess?: () => void | Promise<void>
    }
  ): Promise<void> => {
    await loginMutation.mutateAsync(credentials)
    await options?.onSuccess?.()
    await router.push(options?.redirectTo || '/bank-select')
  }

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync()
    await router.push('/auth/login')
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
