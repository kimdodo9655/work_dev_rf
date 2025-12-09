import type {
  ApiResponse,
  LoginData,
  LoginRequest,
  RefreshData,
  RefreshRequest
} from '@/types/auth'

import { api } from './client'
import { API } from './endpoints'

export const authAPI = {
  // 로그인
  async login(data: LoginRequest) {
    const response = await api.post<ApiResponse<LoginData>>(API.AUTH.LOGIN, data)
    return response.data
  },

  // 토큰 갱신
  async refresh(data: RefreshRequest) {
    const response = await api.post<ApiResponse<RefreshData>>(API.AUTH.REFRESH, data)
    return response.data
  },

  // 로그아웃
  async logout() {
    await api.post(API.AUTH.LOGOUT)
  }
}
