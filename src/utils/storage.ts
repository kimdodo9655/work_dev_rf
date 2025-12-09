// localStorage 키 상수
const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  ACCESS_EXPIRES: 'access_expires',
  REFRESH_EXPIRES: 'refresh_expires',
  LOGIN_ID: 'login_id',
  USER_ID: 'user_id',
  ROLE_LEVEL: 'role_level'
} as const

export const storage = {
  // 저장
  save(data: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: number
    refreshTokenExpiresIn: number
    loginId: string
    userId: number
    roleLevel: number
  }) {
    localStorage.setItem(KEYS.ACCESS_TOKEN, data.accessToken)
    localStorage.setItem(KEYS.REFRESH_TOKEN, data.refreshToken)
    localStorage.setItem(KEYS.ACCESS_EXPIRES, String(data.accessTokenExpiresIn))
    localStorage.setItem(KEYS.REFRESH_EXPIRES, String(data.refreshTokenExpiresIn))
    localStorage.setItem(KEYS.LOGIN_ID, data.loginId)
    localStorage.setItem(KEYS.USER_ID, String(data.userId))
    localStorage.setItem(KEYS.ROLE_LEVEL, String(data.roleLevel))
  },

  // 토큰만 업데이트
  updateTokens(data: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: number
    refreshTokenExpiresIn: number
  }) {
    localStorage.setItem(KEYS.ACCESS_TOKEN, data.accessToken)
    localStorage.setItem(KEYS.REFRESH_TOKEN, data.refreshToken)
    localStorage.setItem(KEYS.ACCESS_EXPIRES, String(data.accessTokenExpiresIn))
    localStorage.setItem(KEYS.REFRESH_EXPIRES, String(data.refreshTokenExpiresIn))
  },

  // 조회
  get() {
    return {
      accessToken: localStorage.getItem(KEYS.ACCESS_TOKEN),
      refreshToken: localStorage.getItem(KEYS.REFRESH_TOKEN),
      accessExpires: Number(localStorage.getItem(KEYS.ACCESS_EXPIRES)) || 0,
      refreshExpires: Number(localStorage.getItem(KEYS.REFRESH_EXPIRES)) || 0,
      loginId: localStorage.getItem(KEYS.LOGIN_ID),
      userId: Number(localStorage.getItem(KEYS.USER_ID)) || null,
      roleLevel: Number(localStorage.getItem(KEYS.ROLE_LEVEL)) || null
    }
  },

  // 삭제
  clear() {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
  },

  // 유효성 체크
  isValid() {
    const { accessToken, accessExpires } = this.get()
    if (!accessToken) return false

    const now = Math.floor(Date.now() / 1000)
    return accessExpires > now + 30 // 30초 버퍼
  }
}
