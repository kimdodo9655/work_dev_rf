/**
 * 문서 경로: `@/src/router/routes/protected.ts`
 * 문서 제목: 라우트 정의: protected
 */

import type { RouteRecordRaw } from 'vue-router'
import { MESSAGES } from '@/constants/messages'

export const protectedRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/features/main/pages/DashboardPage.vue'),
    meta: {
      title: MESSAGES.pageTitle.main.dashboard,
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
      title: MESSAGES.pageTitle.shared.viewer,
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
      title: MESSAGES.pageTitle.shared.notice,
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
      title: MESSAGES.pageTitle.shared.noticeDetail,
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
      title: MESSAGES.pageTitle.estimate.list,
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
      title: MESSAGES.pageTitle.estimate.createDetail,
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
      title: MESSAGES.pageTitle.estimate.confirmDetail,
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
      title: MESSAGES.pageTitle.registration.caseStatus,
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
      title: MESSAGES.pageTitle.registration.caseDetail,
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
      title: MESSAGES.pageTitle.registration.schedule,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  }
]
