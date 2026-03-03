export const BANK = {
  LIST: '/api/banks',
  DETAIL: (code: string | number) => `/api/banks/${code}`
} as const
