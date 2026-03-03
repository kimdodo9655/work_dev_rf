import type { RouteRecordRaw } from 'vue-router'

import locale from '@/locales/ko.json'

export const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/error/404',
    name: 'NotFound',
    component: () => import('@/features/shared/pages/NotFoundPage.vue'),
    meta: {
      title: locale.pageTitle.error['404'],
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'],
      layout: 'all'
    }
  },
  {
    path: '/error/mac-os',
    name: 'ErrorMacOS',
    component: () => import('@/features/shared/pages/AccessErrorMacPage.vue'),
    meta: {
      title: locale.pageTitle.error.macOs,
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
      title: locale.pageTitle.error.mobile,
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
