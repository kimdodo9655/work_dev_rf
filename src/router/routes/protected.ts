/**
 * 문서 경로: `@/src/router/routes/protected.ts`
 * 문서 제목: protected 구현 파일
 */

import type { RouteRecordRaw } from 'vue-router'

import locale from '@/locales/ko.json'

export const protectedRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/features/main/pages/DashboardPage.vue'),
    meta: {
      title: locale.pageTitle.main.dashboard,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },
  {
    path: '/viewer',
    name: 'WebViewer',
    component: () => import('@/features/shared/pages/WebViewerPage.vue'),
    meta: {
      title: locale.pageTitle.shared.viewer,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },
  {
    path: '/notice',
    name: 'Notice',
    component: () => import('@/features/shared/pages/NoticePage.vue'),
    meta: {
      title: locale.pageTitle.shared.notice,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },
  {
    path: '/notice/:noticeId',
    name: 'NoticeDetail',
    component: () => import('@/features/shared/pages/NoticeDetailPage.vue'),
    meta: {
      title: locale.pageTitle.shared.noticeDetail,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },
  {
    path: '/estimate',
    name: 'EstimateMgmt',
    component: () => import('@/features/estimate/pages/EstimateMgmtPage.vue'),
    meta: {
      title: locale.pageTitle.estimate.list,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth'],
      keepAlive: true
    }
  },
  {
    path: '/estimate/create/:registrationNo',
    name: 'EstimateCreate',
    component: () => import('@/features/estimate/pages/EstimateDetailPage.vue'),
    meta: {
      title: locale.pageTitle.estimate.createDetail,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth'],
      keepAlive: false
    }
  },
  {
    path: '/estimate/detail/:registrationNo',
    name: 'EstimateDetail',
    component: () => import('@/features/estimate/pages/EstimateDetailPage.vue'),
    meta: {
      title: locale.pageTitle.estimate.confirmDetail,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth'],
      keepAlive: false
    }
  },
  {
    path: '/registration',
    name: 'RegistrationStatus',
    component: () => import('@/features/registration/pages/CaseStatusContainer.vue'),
    meta: {
      title: locale.pageTitle.registration.caseStatus,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },
  {
    path: '/registration/:caseId',
    name: 'RegistrationDetail',
    component: () => import('@/features/registration/pages/CaseDetailPage.vue'),
    meta: {
      title: locale.pageTitle.registration.caseDetail,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },
  {
    path: '/registration/schedule',
    name: 'RegistrationSchedule',
    component: () => import('@/features/registration/pages/CaseScheduleMgmtPage.vue'),
    meta: {
      title: locale.pageTitle.registration.schedule,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  }
]
