/**
 * 문서 경로: `@/tests/auth-validator.test.ts`
 * 문서 제목: 테스트: auth-validator-test
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  consumeAutoLogoutPageAccess,
  markAutoLogoutPageAccess
} from '../src/utils/authSessionFlags.ts'

function createStorageMock() {
  const store = new Map<string, string>()

  return {
    getItem(key: string) {
      return store.get(key) ?? null
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
    removeItem(key: string) {
      store.delete(key)
    },
    clear() {
      store.clear()
    }
  }
}

test('자동 로그아웃 접근 플래그는 한 번만 소비된다', () => {
  const originalWindow = globalThis.window
  const originalSessionStorage = globalThis.sessionStorage
  const sessionStorage = createStorageMock()

  Object.defineProperty(globalThis, 'window', {
    value: {},
    configurable: true
  })
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: sessionStorage,
    configurable: true
  })

  try {
    assert.equal(consumeAutoLogoutPageAccess(), false)

    markAutoLogoutPageAccess()
    assert.equal(consumeAutoLogoutPageAccess(), true)
    assert.equal(consumeAutoLogoutPageAccess(), false)
  } finally {
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true
    })
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: originalSessionStorage,
      configurable: true
    })
  }
})
