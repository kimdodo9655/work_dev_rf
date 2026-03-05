/**
 * 문서 경로: `@/src/utils/env.ts`
 * 문서 제목: 유틸리티 모듈: env
 */

/**
 * 환경변수 유틸리티
 */
const APP_TITLE_BASE = String(import.meta.env.VITE_APP_TITLE || '전자등기')
  .replace(/^\[[^\]]+\]\s*/g, '')
  .trim()

export const ENV = {
  MODE: import.meta.env.MODE,
  APP_TITLE_BASE,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8100',
  APP_TITLE: import.meta.env.VITE_APP_TITLE || '전자등기',
  APP_ENV_PREFIX:
    import.meta.env.MODE === 'dev-local'
      ? '[로컬] '
      : import.meta.env.MODE === 'development'
        ? '[개발서버] '
        : '',
  APP_TITLE_WITH_ENV:
    import.meta.env.MODE === 'dev-local'
      ? `[로컬] ${APP_TITLE_BASE}`
      : import.meta.env.MODE === 'development'
        ? `[개발서버] ${APP_TITLE_BASE}`
        : APP_TITLE_BASE,
  IS_DEV: import.meta.env.VITE_IS_DEV === 'true'
}
