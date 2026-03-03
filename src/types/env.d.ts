/**
 * 문서 경로: `@/src/types/env.d.ts`
 * 문서 제목: 타입 정의: env-d
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_IS_DEV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.json' {
  const value: any
  export default value
}

declare module 'pdfjs-dist/build/pdf.mjs' {
  const value: any
  export = value
}
