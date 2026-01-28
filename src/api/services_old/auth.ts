import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  TokenRefreshResponse
} from '@/types'

export const authAPI = {
  /**
   * 로그인
   * @param data - 로그인 정보 (아이디, 비밀번호)
   * @returns 로그인 응답 (액세스 토큰, 리프레시 토큰, 사용자 정보)
   * @throws {ApiError} 로그인 실패 시
   *
   * @example
   * const response = await authAPI.login({
   *   loginId: 'admin',
   *   password: 'password123'
   * })
   * console.log(response.data) // LoginResponse
   */
  async login(data: LoginRequest) {
    return apiHelpers.post<ApiResponse<LoginResponse>>(API.AUTH.LOGIN, data)
  },

  /**
   * 토큰 갱신
   * @param data - 리프레시 토큰
   * @returns 갱신된 토큰 정보
   * @throws {ApiError} 토큰 갱신 실패 시
   *
   * @example
   * const response = await authAPI.refresh({
   *   refreshToken: 'eyJhbGc...'
   * })
   * console.log(response.data) // TokenRefreshResponse
   */
  async refresh(data: RefreshTokenRequest) {
    return apiHelpers.post<ApiResponse<TokenRefreshResponse>>(API.AUTH.REFRESH, data)
  },

  /**
   * 로그아웃
   * @returns 로그아웃 성공 여부
   * @throws {ApiError} 로그아웃 실패 시
   *
   * @example
   * await authAPI.logout()
   */
  async logout() {
    return apiHelpers.post<ApiResponse<void>>(API.AUTH.LOGOUT)
  }
}
