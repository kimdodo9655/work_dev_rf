export const EXTERNAL_LINKS = {
  register: {
    iros: 'https://www.iros.go.kr/',
    etax: 'https://etax.seoul.go.kr/',
    wetax: 'https://www.wetax.go.kr/'
  }
} as const

export type ExternalLinks = typeof EXTERNAL_LINKS
