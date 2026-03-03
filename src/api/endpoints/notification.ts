/**
 * 문서 경로: `@/src/api/endpoints/notification.ts`
 * 문서 제목: API 엔드포인트: notification
 */

export const NOTIFICATION = {
  LIST: '/api/notifications',
  CREATE: '/api/notifications',
  READ: (id: string | number) => `/api/notifications/${id}/read`,
  CLEAR_ALL: '/api/notifications/clear-all'
} as const
