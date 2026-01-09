import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { authAPI } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types'

export function useAuth() {
  const store = useAuthStore()
  const queryClient = useQueryClient()

  // API: 로그인(/api/auth/login 🅿️)
  const login = useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (response) => {
      store.setAuth(response.data)
    }
  })

  // ✅ 개선: refresh mutation 제거
  // 토큰 갱신은 Axios 인터셉터(client.ts)에서 자동으로 처리되므로
  // 수동 갱신 mutation은 불필요합니다.

  // API: 로그아웃(/api/auth/logout 🅿️)
  // 로그아웃
  const logout = useMutation({
    mutationFn: () => authAPI.logout(),
    onSettled: () => {
      store.clearAuth()
      queryClient.clear()
    }
  })

  return { login, logout }
}
