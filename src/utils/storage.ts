// localStorage 키 상수
const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  ACCESS_EXPIRES: 'access_expires',
  REFRESH_EXPIRES: 'refresh_expires',
  LOGIN_ID: 'login_id',
  USER_ID: 'user_id',
  ROLE_LEVEL: 'role_level',
  BANK_CODE: 'bank_code'
} as const

export const storage = {
  // ============================================================================
  // 저장
  // ============================================================================

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

  // 금융기관 코드 저장
  setBankCode(code: string) {
    localStorage.setItem(KEYS.BANK_CODE, code)
  },

  // ============================================================================
  // 조회
  // ============================================================================

  get() {
    return {
      accessToken: localStorage.getItem(KEYS.ACCESS_TOKEN),
      refreshToken: localStorage.getItem(KEYS.REFRESH_TOKEN),
      accessExpires: Number(localStorage.getItem(KEYS.ACCESS_EXPIRES)) || 0,
      refreshExpires: Number(localStorage.getItem(KEYS.REFRESH_EXPIRES)) || 0,
      loginId: localStorage.getItem(KEYS.LOGIN_ID),
      userId: Number(localStorage.getItem(KEYS.USER_ID)) || null,
      roleLevel: Number(localStorage.getItem(KEYS.ROLE_LEVEL)) || null,
      bankCode: localStorage.getItem(KEYS.BANK_CODE)
    }
  },

  // accessToken만 조회
  getAccessToken() {
    return localStorage.getItem(KEYS.ACCESS_TOKEN)
  },

  // refreshToken만 조회
  getRefreshToken() {
    return localStorage.getItem(KEYS.REFRESH_TOKEN)
  },

  // bankCode만 조회
  getBankCode() {
    return localStorage.getItem(KEYS.BANK_CODE)
  },

  // ============================================================================
  // 삭제
  // ============================================================================

  clear() {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
  },

  // bankCode만 삭제
  clearBankCode() {
    localStorage.removeItem(KEYS.BANK_CODE)
  },

  // ============================================================================
  // 유효성 체크
  // ============================================================================

  /**
   * 토큰 유효성 검사
   * @returns 'valid' | 'refresh_needed' | 'invalid'
   */
  checkTokenValidity(): 'valid' | 'refresh_needed' | 'invalid' {
    const { accessToken, accessExpires, refreshExpires } = this.get() // ✅ refreshToken 제거

    // 토큰이 없으면 invalid
    if (!accessToken) {
      return 'invalid'
    }

    const now = Math.floor(Date.now() / 1000)
    const isAccessTokenValid = accessExpires > now
    const isRefreshTokenValid = refreshExpires > now

    // 두 토큰 모두 만료 → invalid
    if (!isAccessTokenValid && !isRefreshTokenValid) {
      return 'invalid'
    }

    // accessToken만 만료, refreshToken 유효 → refresh 필요
    if (!isAccessTokenValid && isRefreshTokenValid) {
      return 'refresh_needed'
    }

    // accessToken 유효 → valid
    return 'valid'
  },

  // 금융기관 선택 여부 체크
  hasBankCode() {
    return !!this.getBankCode()
  }
}
