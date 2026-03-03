export const NOTIFICATION = {
  LIST: '/api/notifications',
  CREATE: '/api/notifications',
  READ: (id: string | number) => `/api/notifications/${id}/read`,
  CLEAR_ALL: '/api/notifications/clear-all'
} as const
