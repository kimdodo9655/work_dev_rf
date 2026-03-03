/**
 * 문서 경로: `@/src/router/routes/onboarding.ts`
 * 문서 제목: 라우트 정의: onboarding
 */

import type { RouteRecordRaw } from 'vue-router'

import locale from '@/locales/ko.json'
import { UserRoleLevel } from '@/types'

export const onboardingRoutes: RouteRecordRaw[] = [
  {
    path: '/bank-select',
    name: 'BankSelection',
    component: () => import('@/features/main/pages/BankSelectionPage.vue'),
    meta: {
      title: locale.pageTitle.main.bankSelect,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth']
    }
  },
  {
    path: '/my/organization',
    name: 'OrgMgmt',
    component: () => import('@/features/my/pages/OrgMgmtPage.vue'),
    meta: {
      title: locale.pageTitle.my.organization,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [UserRoleLevel.ORGANIZATION_ADMIN, UserRoleLevel.BRANCH_ADMIN]
    }
  },
  {
    path: '/my/organization/:orgId',
    name: 'OrgDetail',
    component: () => import('@/features/my/pages/OrgDetailPage.vue'),
    meta: {
      title: locale.pageTitle.my.organizationDetail,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [UserRoleLevel.ORGANIZATION_ADMIN, UserRoleLevel.BRANCH_ADMIN]
    }
  },
  {
    path: '/my/users',
    name: 'UserMgmt',
    component: () => import('@/features/my/pages/UserMgmtPage.vue'),
    meta: {
      title: locale.pageTitle.my.users,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [UserRoleLevel.ORGANIZATION_ADMIN, UserRoleLevel.BRANCH_ADMIN]
    }
  },
  {
    path: '/my/users/:userId',
    name: 'UserDetail',
    component: () => import('@/features/my/pages/UserDetailPage.vue'),
    meta: {
      title: locale.pageTitle.my.userDetail,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [UserRoleLevel.ORGANIZATION_ADMIN, UserRoleLevel.BRANCH_ADMIN]
    }
  },
  {
    path: '/my/profile',
    name: 'MyProfile',
    component: () => import('@/features/my/pages/MyProfilePage.vue'),
    meta: {
      title: locale.pageTitle.my.profile,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [UserRoleLevel.USER]
    }
  },
  {
    path: '/device-info',
    name: 'DeviceInfo',
    component: () => import('@/features/shared/pages/DeviceInfoPage.vue'),
    meta: {
      title: locale.pageTitle.shared.deviceInfo,
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'],
      layout: 'all'
    }
  }
]
