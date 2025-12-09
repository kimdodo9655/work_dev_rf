/**
 * API 엔드포인트 상수
 * 모든 API 경로를 한 곳에서 관리
 */
export const API = {
  // 인증
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh'
  }

  // TODO: 백엔드 API 개발 후 아래 형식으로 추가
  // USER: {
  //   PROFILE: '/api/users/profile',
  //   LIST: '/api/users',
  //   DETAIL: (userId: number) => `/api/users/${userId}`,
  //   UPDATE: (userId: number) => `/api/users/${userId}`,
  //   DELETE: (userId: number) => `/api/users/${userId}`
  // }
} as const
