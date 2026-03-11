/**
 * 문서 경로: `@/src/utils/browser.ts`
 * 문서 제목: 유틸리티 모듈: browser
 */

type BrowserStorageKind = 'local' | 'session'

// 역할: 브라우저 전역 접근 캡슐화
function getStorage(kind: BrowserStorageKind): Storage | null {
  const target = globalThis as typeof globalThis & {
    localStorage?: Storage
    sessionStorage?: Storage
  }

  if (kind === 'local') {
    return target.localStorage ?? target.window?.localStorage ?? null
  }

  return target.sessionStorage ?? target.window?.sessionStorage ?? null
}

export const browserStorage = {
  getItem(kind: BrowserStorageKind, key: string): string | null {
    return getStorage(kind)?.getItem(key) ?? null
  },

  setItem(kind: BrowserStorageKind, key: string, value: string) {
    getStorage(kind)?.setItem(key, value)
  },

  removeItem(kind: BrowserStorageKind, key: string) {
    getStorage(kind)?.removeItem(key)
  },

  clear(kind: BrowserStorageKind) {
    getStorage(kind)?.clear()
  }
}

export const browserLocation = {
  getPathname(): string {
    if (typeof window === 'undefined') return ''
    return window.location.pathname
  },

  assign(url: string) {
    // 용도: 전체 페이지 이동
    if (typeof window === 'undefined') return
    window.location.href = url
  }
}

export const browserWindow = {
  open(url: string, target?: string, features?: string) {
    if (typeof window === 'undefined') return null
    return window.open(url, target, features)
  }
}

export function createBrowserBroadcastChannel(name: string): BroadcastChannel | null {
  // 규칙: 미지원 환경이면 null
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return null
  }

  return new BroadcastChannel(name)
}
