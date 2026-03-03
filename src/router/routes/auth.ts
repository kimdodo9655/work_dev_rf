/**
 * 문서 경로: `@/src/router/routes/auth.ts`
 * 문서 제목: auth 구현 파일
 */

import type { RouteRecordRaw } from 'vue-router'

import locale from '@/locales/ko.json'
import { useAuthStore } from '@/stores/auth'
import { logger } from '@/utils/logger'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/features/auth/pages/LoginPage.vue'),
    meta: {
      title: locale.pageTitle.auth.login,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/signup',
    name: 'SignUp',
    component: () => import('@/features/auth/pages/SignupPage.vue'),
    meta: {
      title: locale.pageTitle.auth.signup,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/install',
    name: 'ProgramInstall',
    component: () => import('@/features/auth/pages/ProgramInstallPage.vue'),
    meta: {
      title: locale.pageTitle.auth.install,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/auto-logout',
    name: 'AutoLogout',
    component: () => import('@/features/auth/pages/AutoLogoutPage.vue'),
    beforeEnter: () => {
      const authStore = useAuthStore()

      if (!authStore.canAccessAutoLogoutPage) {
        logger.warn('[ROUTER] Unauthorized auto-logout page access')
        return '/auth/login'
      }

      authStore.canAccessAutoLogoutPage = false
      return true
    },
    meta: {
      title: locale.pageTitle.auth.autoLogout,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/password-setup',
    name: 'PasswordSetup',
    component: () => import('@/features/auth/pages/PasswordSetupPage.vue'),
    meta: {
      title: locale.pageTitle.auth.passwordSetup,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/blocked/mac',
    name: 'AccessBlockMac',
    component: () => import('@/features/auth/pages/AccessBlockMacPage.vue'),
    meta: {
      title: locale.pageTitle.auth.blocked.mac,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/blocked/email',
    name: 'AccessBlockEmail',
    component: () => import('@/features/auth/pages/AccessBlockEmailPage.vue'),
    meta: {
      title: locale.pageTitle.auth.blocked.email,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/blocked/user',
    name: 'AccessBlockUser',
    component: () => import('@/features/auth/pages/AccessBlockUserPage.vue'),
    meta: {
      title: locale.pageTitle.auth.blocked.user,
      allowedAuthStates: ['pre-auth']
    }
  }
]
