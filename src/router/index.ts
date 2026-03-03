/**
 * 문서 경로: `@/src/router/index.ts`
 * 문서 제목: 라우터 모듈: index
 */

import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { devRoutes } from '@/router/devRoutes'
import { resolveAccessRedirect } from '@/router/guards/accessGuard'
import { resolvePageTitle } from '@/router/guards/titleGuard'
import { appRoutes } from '@/router/routes'
import { useAuthStore } from '@/stores/auth'
import { UserRoleLevel } from '@/types'
import { logger } from '@/utils/logger'

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

    logger.debug('[ROUTER] Navigation', {
      from: from.path,
      to: to.path,
      currentAuthState,
      userRoleLevel,
      isLoggedIn: authStore.isLoggedIn,
      hasBankCode: !!authStore.selectedBankCode
    })

    const pageTitle = resolvePageTitle(to, currentAuthState)
    document.title = pageTitle ? `${pageTitle} - 전자등기` : '전자등기'
    const redirectPath = resolveAccessRedirect(to, from, authStore)
    if (redirectPath) {
      next(redirectPath)
      return
    }
    next()
  }
)

export default router
