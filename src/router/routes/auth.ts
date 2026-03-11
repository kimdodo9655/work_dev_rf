/**
 * 문서 경로: `@/src/router/routes/auth.ts`
 * 문서 제목: 라우트 정의: auth
 */

import type { RouteRecordRaw } from 'vue-router'

import { MESSAGES } from '@/constants/messages'
import { consumeAutoLogoutPageAccess } from '@/utils/authSessionFlags'
import { logger } from '@/utils/logger'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/features/auth/pages/LoginPage.vue'),
    meta: {
      title: MESSAGES.pageTitle.auth.login,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/signup',
    name: 'SignUp',
    component: () => import('@/features/auth/pages/SignupPage.vue'),
    meta: {
      title: MESSAGES.pageTitle.auth.signup,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/install',
    name: 'ProgramInstall',
    component: () => import('@/features/auth/pages/ProgramInstallPage.vue'),
    meta: {
      title: MESSAGES.pageTitle.auth.install,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/auto-logout',
    name: 'AutoLogout',
    component: () => import('@/features/auth/pages/AutoLogoutPage.vue'),
    beforeEnter: () => {
      // 규칙: auto-logout 직접 진입 금지
      if (!consumeAutoLogoutPageAccess()) {
        logger.warn('[ROUTER] Unauthorized auto-logout page access')
        return '/auth/login'
      }
      return true
    },
    meta: {
      title: MESSAGES.pageTitle.auth.autoLogout,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/password-setup',
    name: 'PasswordSetup',
    component: () => import('@/features/auth/pages/PasswordSetupPage.vue'),
    meta: {
      title: MESSAGES.pageTitle.auth.passwordSetup,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/blocked/mac',
    name: 'AccessBlockMac',
    component: () => import('@/features/auth/pages/AccessBlockMacPage.vue'),
    meta: {
      title: MESSAGES.pageTitle.auth.blocked.mac,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/blocked/email',
    name: 'AccessBlockEmail',
    component: () => import('@/features/auth/pages/AccessBlockEmailPage.vue'),
    meta: {
      title: MESSAGES.pageTitle.auth.blocked.email,
      allowedAuthStates: ['pre-auth']
    }
  },
  {
    path: '/auth/blocked/user',
    name: 'AccessBlockUser',
    component: () => import('@/features/auth/pages/AccessBlockUserPage.vue'),
    meta: {
      title: MESSAGES.pageTitle.auth.blocked.user,
      allowedAuthStates: ['pre-auth']
    }
  }
]
