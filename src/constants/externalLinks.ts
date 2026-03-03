/**
 * 문서 경로: `@/src/constants/externalLinks.ts`
 * 문서 제목: 상수 모듈: external-links
 */

export const EXTERNAL_LINKS = {
  register: {
    iros: 'https://www.iros.go.kr/',
    etax: 'https://etax.seoul.go.kr/',
    wetax: 'https://www.wetax.go.kr/'
  }
} as const

export type ExternalLinks = typeof EXTERNAL_LINKS
