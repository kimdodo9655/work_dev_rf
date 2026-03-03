/**
 * 문서 경로: `@/src/router/guards/accessGuard.ts`
 * 문서 제목: 라우트 가드: access-guard
 */

import type { RouteLocationNormalized } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { handleInvalidAuthState, isValidAuthData } from '@/utils/authValidator'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

export function resolveAccessRedirect(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  authStore: ReturnType<typeof useAuthStore>
): string | null {
  if (to.path === '/' || to.path.startsWith('/error/')) {
    return null
  }

  const currentAuthState = authStore.authState

  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      logger.warn('[ROUTER] Unauthorized - Redirect to login')
      return '/auth/login'
    }

    const authData = storage.get()
    if (!isValidAuthData(authData, currentAuthState)) {
      logger.error('[ROUTER] Invalid auth data detected', {
        from: from.path,
        to: to.path,
        authState: currentAuthState
      })
      handleInvalidAuthState()
      return '/auth/login'
    }
  }

  if (to.meta.requiresBankCode && !authStore.selectedBankCode) {
    logger.warn('[ROUTER] Bank code required - Redirect to bank selection')
    return '/bank-select'
  }

  if (to.meta.allowedAuthStates && to.meta.allowedAuthStates.length > 0) {
    if (!to.meta.allowedAuthStates.includes(currentAuthState)) {
      logger.warn('[ROUTER] Invalid auth state', {
        current: currentAuthState,
        allowed: to.meta.allowedAuthStates
      })
      return '/'
    }
  }

  if (to.meta.requiredRoles && to.meta.requiredRoles.length > 0) {
    if (authStore.isAdmin) return null

    if (!authStore.roleLevel || !to.meta.requiredRoles.includes(authStore.roleLevel)) {
      logger.warn('[ROUTER] Insufficient permissions', {
        userRole: authStore.roleLevel,
        requiredRoles: to.meta.requiredRoles
      })
      return '/error/404'
    }
  }

  return null
}
