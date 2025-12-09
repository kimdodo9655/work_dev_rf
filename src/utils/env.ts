/**
 * 환경변수 유틸리티
 */
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
  IS_DEV: import.meta.env.VITE_IS_DEV === 'true'
}
