import type { ApiResponse, LoginData, LoginRequest, RefreshData, RefreshRequest } from '@/types' // 경로 변경

import { apiHelpers } from './client' // apiHelpers 사용
import { API } from './endpoints'

export const authAPI = {
  // 로그인
  async login(data: LoginRequest) {
    return apiHelpers.post<ApiResponse<LoginData>>(API.AUTH.LOGIN, data)
  },

  // 토큰 갱신
  async refresh(data: RefreshRequest) {
    return apiHelpers.post<ApiResponse<RefreshData>>(API.AUTH.REFRESH, data)
  },

  // 로그아웃
  async logout() {
    return apiHelpers.post(API.AUTH.LOGOUT)
  }
}
