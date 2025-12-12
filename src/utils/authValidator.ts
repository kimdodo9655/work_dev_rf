import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

/**
 * LocalStorage에서 가져온 인증 데이터 타입
 */
interface AuthData {
  accessToken: string | null
  refreshToken: string | null
  loginId: string | null
  userId: number | null
  roleLevel: number | null
  bankCode: string | null
  accessExpires: number
  refreshExpires: number
}

// ✅ 중복 실행 방지 플래그
let isHandlingInvalidAuth = false

/**
 * 인증 데이터 유효성 검증
 *
 * 로그인 후 필수값들이 모두 올바른 타입과 값으로 존재하는지 확인
 * auth 상태에서는 bankCode도 필수
 *
 * @param data - storage.get()으로 가져온 인증 데이터
 * @param authState - 현재 인증 상태 (선택적, auth 상태일 때 bankCode 검증)
 * @returns 유효하면 true, 아니면 false
 */
export function isValidAuthData(
  data: Partial<AuthData>,
  authState?: 'pre-auth' | 'onboarding' | 'auth'
): boolean {
  // 1. 토큰 검증
  if (!data.accessToken || typeof data.accessToken !== 'string' || data.accessToken.trim() === '') {
    logger.warn('[AUTH_VALIDATOR] Invalid accessToken', {
      exists: !!data.accessToken,
      type: typeof data.accessToken
    })
    return false
  }

  if (
    !data.refreshToken ||
    typeof data.refreshToken !== 'string' ||
    data.refreshToken.trim() === ''
  ) {
    logger.warn('[AUTH_VALIDATOR] Invalid refreshToken', {
      exists: !!data.refreshToken,
      type: typeof data.refreshToken
    })
    return false
  }

  // 2. 사용자 정보 검증
  if (!data.loginId || typeof data.loginId !== 'string' || data.loginId.trim() === '') {
    logger.warn('[AUTH_VALIDATOR] Invalid loginId', {
      exists: !!data.loginId,
      type: typeof data.loginId
    })
    return false
  }

  if (data.userId === null || data.userId === undefined || typeof data.userId !== 'number') {
    logger.warn('[AUTH_VALIDATOR] Invalid userId', {
      value: data.userId,
      type: typeof data.userId
    })
    return false
  }

  if (
    data.roleLevel === null ||
    data.roleLevel === undefined ||
    typeof data.roleLevel !== 'number'
  ) {
    logger.warn('[AUTH_VALIDATOR] Invalid roleLevel', {
      value: data.roleLevel,
      type: typeof data.roleLevel
    })
    return false
  }

  // 3. 만료 시간 검증
  if (!data.accessExpires || typeof data.accessExpires !== 'number' || data.accessExpires <= 0) {
    logger.warn('[AUTH_VALIDATOR] Invalid accessExpires', {
      value: data.accessExpires,
      type: typeof data.accessExpires
    })
    return false
  }

  if (!data.refreshExpires || typeof data.refreshExpires !== 'number' || data.refreshExpires <= 0) {
    logger.warn('[AUTH_VALIDATOR] Invalid refreshExpires', {
      value: data.refreshExpires,
      type: typeof data.refreshExpires
    })
    return false
  }

  // ✅ 4. auth 상태에서 bankCode 검증
  if (authState === 'auth') {
    if (!data.bankCode || typeof data.bankCode !== 'string' || data.bankCode.trim() === '') {
      logger.warn('[AUTH_VALIDATOR] Missing bankCode in auth state', {
        authState,
        bankCode: data.bankCode
      })
      return false
    }
  }

  logger.debug('[AUTH_VALIDATOR] Auth data is valid', { authState })
  return true
}

/**
 * 비정상 인증 상태 처리
 *
 * 1. 에러 로깅
 * 2. LocalStorage 정리
 * 3. 사용자 알림
 * 4. 로그인 페이지로 리다이렉트
 */
export function handleInvalidAuthState() {
  // ✅ 이미 처리 중이면 중복 실행 방지
  if (isHandlingInvalidAuth) {
    logger.info('[AUTH_VALIDATOR] Already handling invalid auth - Skip duplicate')
    return
  }

  isHandlingInvalidAuth = true

  logger.error('[AUTH_VALIDATOR] Invalid auth state detected - Force logout')

  // 이미 로그인 페이지면 중복 처리 방지 (무한 루프 방지)
  if (window.location.pathname === '/auth/login') {
    logger.info('[AUTH_VALIDATOR] Already on login page - Skip handling')
    isHandlingInvalidAuth = false
    return
  }

  // 이미 인증 관련 페이지면 중복 처리 방지
  if (window.location.pathname.startsWith('/auth/')) {
    logger.info('[AUTH_VALIDATOR] Already on auth page - Skip handling')
    isHandlingInvalidAuth = false
    return
  }

  // LocalStorage 정리
  storage.clear()
  logger.info('[AUTH_VALIDATOR] LocalStorage cleared')

  // 사용자 알림 (고정 메시지)
  alert('인증 정보가 올바르지 않습니다.\n다시 로그인해주세요.')

  // 로그인 페이지로 이동
  logger.info('[AUTH_VALIDATOR] Redirecting to login page')
  window.location.href = '/auth/login'

  // 페이지 이동 후 플래그는 자동으로 초기화됨 (새 페이지 로드)
}

/**
 * 개발 환경용 상세 검증 로그
 *
 * 개발 중에만 상세한 검증 정보를 콘솔에 출력
 *
 * @param data - 검증할 인증 데이터
 */
export function logAuthDataValidation(data: Partial<AuthData>) {
  if (import.meta.env.DEV) {
    console.group('[AUTH_VALIDATOR] Detailed Validation')
    console.log('accessToken:', !!data.accessToken, typeof data.accessToken)
    console.log('refreshToken:', !!data.refreshToken, typeof data.refreshToken)
    console.log('loginId:', data.loginId, typeof data.loginId)
    console.log('userId:', data.userId, typeof data.userId)
    console.log('roleLevel:', data.roleLevel, typeof data.roleLevel)
    console.log('bankCode:', data.bankCode, typeof data.bankCode)
    console.log('accessExpires:', data.accessExpires, typeof data.accessExpires)
    console.log('refreshExpires:', data.refreshExpires, typeof data.refreshExpires)
    console.groupEnd()
  }
}
