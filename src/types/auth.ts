// API 응답 공통 구조
export interface ApiResponse<T> {
  status: number
  code: string
  title: string
  message: string
  data: T
}

// 로그인 요청
export interface LoginRequest {
  loginId: string
  password: string
}

// 로그인 응답
export interface LoginData {
  accessToken: string
  refreshToken: string
  loginId: string
  userId: number
  roleLevel: number
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
}

// 토큰 갱신
export interface RefreshRequest {
  refreshToken: string
}

export interface RefreshData {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
}
