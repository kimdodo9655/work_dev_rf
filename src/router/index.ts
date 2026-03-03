import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import locale from '@/locales/ko.json'
import { devRoutes } from '@/router/devRoutes'
import { appRoutes } from '@/router/routes'
import { useAuthStore } from '@/stores/auth'
import { UserRoleLevel } from '@/types'
import { handleInvalidAuthState, isValidAuthData } from '@/utils/authValidator'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    requiresBankCode?: boolean
    requiredRoles?: UserRoleLevel[]
    allowedAuthStates?: ('pre-auth' | 'onboarding' | 'auth')[]
    keepAlive?: boolean
    layout?: string
    footerOff?: boolean
    mobile?: boolean
  }
}

const shouldEnableDevRoutes =
  import.meta.env.DEV ||
  import.meta.env.MODE === 'development' ||
  import.meta.env.VITE_IS_DEV === 'true'

const routes: RouteRecordRaw[] = [...(shouldEnableDevRoutes ? devRoutes : []), ...appRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()
    authStore.loadAuth()

    const currentAuthState = authStore.authState
    const userRoleLevel = authStore.roleLevel
    const isAdmin = authStore.isAdmin

    logger.debug('[ROUTER] Navigation', {
      from: from.path,
      to: to.path,
      currentAuthState,
      userRoleLevel,
      isLoggedIn: authStore.isLoggedIn,
      hasBankCode: !!authStore.selectedBankCode
    })

    let pageTitle = to.meta.title || '전자등기'

    if (to.path === '/' || to.name === 'Root') {
      switch (currentAuthState) {
        case 'pre-auth':
          pageTitle = locale.pageTitle.auth.login
          break
        case 'onboarding':
          pageTitle = locale.pageTitle.main.bankSelect
          break
        case 'auth':
          pageTitle = locale.pageTitle.main.dashboard
          break
        default:
          pageTitle = '전자등기'
      }
    }

    document.title = pageTitle ? `${pageTitle} - 전자등기` : '전자등기'

    if (to.path === '/') {
      next()
      return
    }

    if (to.path.startsWith('/error/')) {
      next()
      return
    }

    if (to.meta.requiresAuth) {
      if (!authStore.isLoggedIn) {
        logger.warn('[ROUTER] Unauthorized - Redirect to login')
        next('/auth/login')
        return
      }

      const authData = storage.get()
      if (!isValidAuthData(authData, currentAuthState)) {
        logger.error('[ROUTER] Invalid auth data detected', {
          from: from.path,
          to: to.path,
          authState: currentAuthState
        })
        handleInvalidAuthState()
        next('/auth/login')
        return
      }
    }

    if (to.meta.requiresBankCode && !authStore.selectedBankCode) {
      logger.warn('[ROUTER] Bank code required - Redirect to bank selection')
      next('/bank-select')
      return
    }

    if (to.meta.allowedAuthStates && to.meta.allowedAuthStates.length > 0) {
      if (!to.meta.allowedAuthStates.includes(currentAuthState)) {
        logger.warn('[ROUTER] Invalid auth state', {
          current: currentAuthState,
          allowed: to.meta.allowedAuthStates
        })
        next('/')
        return
      }
    }

    if (to.meta.requiredRoles && to.meta.requiredRoles.length > 0) {
      if (isAdmin) {
        next()
        return
      }

      if (!userRoleLevel || !to.meta.requiredRoles.includes(userRoleLevel)) {
        logger.warn('[ROUTER] Insufficient permissions', {
          userRole: userRoleLevel,
          requiredRoles: to.meta.requiredRoles
        })
        next('/error/404')
        return
      }
    }

    next()
  }
)

export default router
