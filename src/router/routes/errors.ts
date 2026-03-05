/**
 * 문서 경로: `@/src/router/routes/errors.ts`
 * 문서 제목: 라우트 정의: errors
 */

import type { RouteRecordRaw } from 'vue-router'
import { MESSAGES } from '@/constants/messages'

export const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/error/404',
    name: 'NotFound',
    component: () => import('@/features/shared/pages/NotFoundPage.vue'),
    meta: {
      title: MESSAGES.pageTitle.error['404'],
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'],
      layout: 'all'
    }
  },
  {
    path: '/error/mac-os',
    name: 'ErrorMacOS',
    component: () => import('@/features/shared/pages/AccessErrorMacPage.vue'),
    meta: {
      title: MESSAGES.pageTitle.error.macOs,
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'],
      layout: 'all',
      footerOff: true
    }
  },
  {
    path: '/error/mobile',
    name: 'ErrorMobile',
    component: () => import('@/features/shared/pages/AccessErrorMobilePage.vue'),
    meta: {
      title: MESSAGES.pageTitle.error.mobile,
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'],
      layout: 'all',
      mobile: true,
      footerOff: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/error/404'
  }
]
