import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { authAPI } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types/auth'
import { storage } from '@/utils/storage'

export function useAuth() {
  const store = useAuthStore()
  const queryClient = useQueryClient()

  // 로그인
  const login = useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (response) => {
      store.setAuth(response.data)
    }
  })

  // 토큰 갱신
  const refresh = useMutation({
    mutationFn: () => {
      const { refreshToken } = storage.get()
      if (!refreshToken) throw new Error('No refresh token')
      return authAPI.refresh({ refreshToken })
    },
    onSuccess: (response) => {
      store.updateTokens(response.data)
    },
    onError: () => {
      store.clearAuth()
    }
  })

  // 로그아웃
  const logout = useMutation({
    mutationFn: () => authAPI.logout(),
    onSettled: () => {
      store.clearAuth()
      queryClient.clear()
    }
  })

  return { login, refresh, logout }
}
