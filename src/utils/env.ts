/**
 * 환경변수 유틸리티
 */
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8100',
  APP_TITLE: import.meta.env.VITE_APP_TITLE || '전자등기',
  IS_DEV: import.meta.env.VITE_IS_DEV === 'true'
}
