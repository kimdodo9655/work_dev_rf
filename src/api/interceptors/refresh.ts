/**
 * 문서 경로: `@/src/api/interceptors/refresh.ts`
 * 문서 제목: API 인터셉터: refresh
 */

import axios from 'axios'

import { API } from '@/api/endpoints'
import { useAuthStore } from '@/stores/auth'
import type { TokenRefreshResponse } from '@/types'
import { shouldSkipAutoRefreshRequest } from '@/utils/authInterceptorRules'
import { extractTokenRefreshPayload } from '@/utils/authPayload'
import { createBrowserBroadcastChannel } from '@/utils/browser'
import { ENV } from '@/utils/env'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

let refreshPromise: Promise<void> | null = null
let lastRefreshTime = 0
const REFRESH_COOLDOWN = 60 * 10000

const authChannel = createBrowserBroadcastChannel('auth-refresh-channel')

type AuthRefreshChannelMessage =
  | { type: 'REFRESH_FAIL' }
  | { type: 'REFRESH_SUCCESS'; tokens?: TokenRefreshResponse }

authChannel?.addEventListener('message', (event) => {
  const message = (event.data ?? {}) as AuthRefreshChannelMessage
  const { type } = message

  if (type === 'REFRESH_SUCCESS') {
    lastRefreshTime = Date.now()
    const syncedTokens = extractTokenRefreshPayload(message.tokens)
    if (syncedTokens) {
      storage.updateTokens(syncedTokens)
      useAuthStore().updateTokens(syncedTokens)
    }
    logger.info('[AUTH][BC] Refresh success synced from another tab')
  }

  if (type === 'REFRESH_FAIL') {
    logger.warn('[AUTH][BC] Refresh failed in another tab')
  }
})

export function shouldSkipAutoRefresh(url: string | undefined): boolean {
  const skipUrls = [API.AUTH.LOGIN, API.AUTH.LOGOUT, API.AUTH.REFRESH]
  return shouldSkipAutoRefreshRequest(url, skipUrls)
}

export async function runRefreshOnce({
  ignoreCooldown = false
}: { ignoreCooldown?: boolean } = {}) {
  const now = Date.now()

  if (!ignoreCooldown && now - lastRefreshTime < REFRESH_COOLDOWN) {
    logger.debug('[REFRESH] Skipped by cooldown', {
      timeSinceLastRefresh: Math.floor((now - lastRefreshTime) / 1000),
      cooldownSeconds: REFRESH_COOLDOWN / 1000
    })
    return
  }

  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const { refreshToken } = storage.get()
      if (!refreshToken) throw new Error('No refresh token')

      logger.info('[REFRESH] Refresh started', { ignoreCooldown })

      const { data } = await axios.post(`${ENV.API_BASE_URL}${API.AUTH.REFRESH}`, { refreshToken })
      const newTokens = extractTokenRefreshPayload(data)
      if (!newTokens) {
        throw new Error('Invalid refresh response')
      }

      storage.updateTokens(newTokens)
      useAuthStore().updateTokens(newTokens)

      lastRefreshTime = Date.now()
      authChannel?.postMessage({ type: 'REFRESH_SUCCESS', tokens: newTokens })
      logger.info('[REFRESH] Refresh success')
    } catch (error) {
      authChannel?.postMessage({ type: 'REFRESH_FAIL' })
      logger.error('[REFRESH] Refresh failed', { error })
      throw error
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}
