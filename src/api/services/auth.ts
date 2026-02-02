// --------------------------------------------------
// [P04] 인증
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignUpRequest,
  SignUpResponse,
  ValidateEmailTokenRequest,
  ValidateEmailTokenResponse,
  VerifyEmail_1Request
} from '@/types'
import type { SetPasswordResponse, VerifyEmail_1Response } from '@/types/api'

export const authAPI = {
  async signup(data: SignUpRequest) {
    // --------------------------------------------------
    // [P04-01][POST - /api/auth/signup] 회원가입
    // --------------------------------------------------
    return apiHelpers.post<SignUpResponse>(API.AUTH.SIGNUP, data)
  },

  async login() {
    // --------------------------------------------------
    // [P04-02][POST - /api/auth/login] 로그인
    // --------------------------------------------------
    return apiHelpers.post(API.AUTH.LOGIN)
  },

  async logout() {
    // --------------------------------------------------
    // [P04-03][POST - /api/auth/logout] 로그아웃
    // --------------------------------------------------
    return apiHelpers.post<LogoutResponse>(API.AUTH.LOGOUT)
  },

  async refresh(data: RefreshTokenRequest) {
    // --------------------------------------------------
    // [P04-04][POST - /api/auth/refresh] 토큰 갱신
    // --------------------------------------------------
    return apiHelpers.post<RefreshTokenResponse>(API.AUTH.REFRESH, data)
  },

  async emailVerifyValidate(data: ValidateEmailTokenRequest) {
    // --------------------------------------------------
    // [P04-05][POST - /api/auth/email-verify/validate] 이메일 토큰 검증
    // --------------------------------------------------
    return apiHelpers.post<ValidateEmailTokenResponse>(API.AUTH.EMAIL_VERIFY_VALIDATE, data)
  },

  async emailVerify(data: VerifyEmail_1Request) {
    // --------------------------------------------------
    // [P04-06][POST - /api/auth/email-verify] 이메일 인증 완료
    // --------------------------------------------------
    return apiHelpers.post<VerifyEmail_1Response>(API.AUTH.EMAIL_VERIFY, data)
  },

  async setPassword() {
    // --------------------------------------------------
    // [P04-07][POST - /api/auth/password] 비밀번호 설정
    // --------------------------------------------------
    return apiHelpers.post<SetPasswordResponse>(API.AUTH.PASSWORD)
  }
}
