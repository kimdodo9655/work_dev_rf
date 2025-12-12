import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { RoleLevel } from '@/types'
import { handleInvalidAuthState, isValidAuthData } from '@/utils/authValidator'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

// Meta 타입 정의
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean // 로그인 필요 여부
    requiresBankCode?: boolean // 금융기관 선택 필요 여부
    requiredRoles?: RoleLevel[] // 필요 권한
    allowedAuthStates?: ('pre-auth' | 'onboarding' | 'auth')[] // 허용된 인증 상태
  }
}

const routes: RouteRecordRaw[] = [
  // ============================================================================
  // Root - 인증 상태에 따라 동적 컴포넌트 렌더링
  // ============================================================================

  {
    path: '/',
    name: 'Root',
    component: () => import('@/components/shared/pages/RootPage.vue'),
    meta: {
      title: '전자등기',
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'] // 모든 상태에서 접근 가능
    }
  },

  // ============================================================================
  // Pre-Auth (로그인 전)
  // ============================================================================

  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/components/auth/pages/LoginPage.vue'),
    meta: {
      title: '로그인',
      allowedAuthStates: ['pre-auth']
    }
  },

  {
    path: '/auth/signup',
    name: 'SignUp',
    component: () => import('@/components/auth/pages/SignupPage.vue'),
    meta: {
      title: '회원가입',
      allowedAuthStates: ['pre-auth']
    }
  },

  {
    path: '/auth/install',
    name: 'ProgramInstall',
    component: () => import('@/components/auth/pages/ProgramInstallPage.vue'),
    meta: {
      title: '프로그램 설치',
      allowedAuthStates: ['pre-auth']
    }
  },

  {
    path: '/auth/auto-logout',
    name: 'AutoLogout',
    component: () => import('@/components/auth/pages/AutoLogoutPage.vue'),
    meta: {
      title: '자동 로그아웃',
      allowedAuthStates: ['pre-auth']
    }
  },

  {
    path: '/auth/password-setup',
    name: 'PasswordSetup',
    component: () => import('@/components/auth/pages/PasswordSetupPage.vue'),
    meta: {
      title: '비밀번호 설정',
      allowedAuthStates: ['pre-auth']
    }
  },

  {
    path: '/auth/blocked/mac',
    name: 'AccessBlockMac',
    component: () => import('@/components/auth/pages/AccessBlockMacPage.vue'),
    meta: {
      title: '사이트 접속 차단 (Mac Address 오류)',
      allowedAuthStates: ['pre-auth']
    }
  },

  {
    path: '/auth/blocked/email',
    name: 'AccessBlockEmail',
    component: () => import('@/components/auth/pages/AccessBlockEmailPage.vue'),
    meta: {
      title: '사이트 접속 차단 (이메일 인증)',
      allowedAuthStates: ['pre-auth']
    }
  },

  {
    path: '/auth/blocked/user',
    name: 'AccessBlockUser',
    component: () => import('@/components/auth/pages/AccessBlockUserPage.vue'),
    meta: {
      title: '사이트 접속 차단 (사용자 사용유무)',
      allowedAuthStates: ['pre-auth']
    }
  },

  // ============================================================================
  // Onboarding (로그인 후, 금융기관 선택 전)
  // ============================================================================

  {
    path: '/bank-select',
    name: 'BankSelection',
    component: () => import('@/components/main/pages/BankSelectionPage.vue'),
    meta: {
      title: '금융기관 선택',
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'] // auth 상태에서도 접근 가능 (변경용)
    }
  },

  {
    path: '/my/organization',
    name: 'OrgMgmt',
    component: () => import('@/components/my/pages/OrgMgmtPage.vue'),
    meta: {
      title: '기관/지점 정보 관리',
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [RoleLevel.ORGANIZATION_ADMIN, RoleLevel.BRANCH_ADMIN]
    }
  },

  {
    path: '/my/organization/:orgId',
    name: 'OrgDetail',
    component: () => import('@/components/my/pages/OrgDetailPage.vue'),
    meta: {
      title: '기관/지점 등록 정보',
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [RoleLevel.ORGANIZATION_ADMIN, RoleLevel.BRANCH_ADMIN]
    }
  },

  {
    path: '/my/users',
    name: 'UserMgmt',
    component: () => import('@/components/my/pages/UserMgmtPage.vue'),
    meta: {
      title: '사용자 정보 관리',
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [RoleLevel.ORGANIZATION_ADMIN, RoleLevel.BRANCH_ADMIN]
    }
  },

  {
    path: '/my/users/:userId',
    name: 'UserDetail',
    component: () => import('@/components/my/pages/UserDetailPage.vue'),
    meta: {
      title: '사용자 등록 정보',
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [RoleLevel.ORGANIZATION_ADMIN, RoleLevel.BRANCH_ADMIN]
    }
  },

  {
    path: '/my/profile',
    name: 'MyProfile',
    component: () => import('@/components/my/pages/MyProfilePage.vue'),
    meta: {
      title: '내 정보 관리',
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [RoleLevel.USER]
    }
  },

  {
    path: '/device-info',
    name: 'DeviceInfo',
    component: () => import('@/components/shared/pages/DeviceInfoPage.vue'),
    meta: {
      title: '등록 단말기 정보',
      allowedAuthStates: ['onboarding', 'auth']
    }
  },

  // ============================================================================
  // Auth (로그인 후, 금융기관 선택 완료)
  // ============================================================================

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/components/main/pages/DashboardPage.vue'),
    meta: {
      title: '메인화면',
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  {
    path: '/viewer',
    name: 'WebViewer',
    component: () => import('@/components/shared/pages/WebViewerPage.vue'),
    meta: {
      title: '웹뷰어',
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  {
    path: '/estimate',
    name: 'EstimateMgmt',
    component: () => import('@/components/estimate/pages/EstimateMgmtContainer.vue'),
    meta: {
      title: '등기 견적 관리',
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  {
    path: '/estimate/create/:registrationNo',
    name: 'EstimateCreate',
    component: () => import('@/components/estimate/pages/EstimateDetailPage.vue'),
    meta: {
      title: '견적서 작성/제출 상세',
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  {
    path: '/estimate/detail/:registrationNo',
    name: 'EstimateDetail',
    component: () => import('@/components/estimate/pages/EstimateDetailPage.vue'),
    meta: {
      title: '견적서 확인/철회 상세',
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  {
    path: '/registration',
    name: 'RegistrationStatus',
    component: () => import('@/components/registration/pages/CaseStatusContainer.vue'),
    meta: {
      title: '등기 진행 현황',
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  {
    path: '/registration/:caseId',
    name: 'RegistrationDetail',
    component: () => import('@/components/registration/pages/CaseDetailPage.vue'),
    meta: {
      title: '등기 진행 상세',
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  {
    path: '/registration/schedule',
    name: 'RegistrationSchedule',
    component: () => import('@/components/registration/pages/CaseScheduleMgmtPage.vue'),
    meta: {
      title: '등기 일정 관리',
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  // ============================================================================
  // 에러 페이지 (모든 상태에서 접근 가능)
  // ============================================================================

  {
    path: '/error/404',
    name: 'NotFound',
    component: () => import('@/components/shared/pages/NotFoundPage.vue'),
    meta: {
      title: '페이지를 찾을 수 없습니다',
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth']
    }
  },

  {
    path: '/error/mac-os',
    name: 'ErrorMacOS',
    component: () => import('@/components/shared/pages/AccessErrorMacPage.vue'),
    meta: {
      title: '접속 오류 (Mac OS)',
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth']
    }
  },

  {
    path: '/error/mobile',
    name: 'ErrorMobile',
    component: () => import('@/components/shared/pages/AccessErrorMobilePage.vue'),
    meta: {
      title: '접속 오류 (모바일)',
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth']
    }
  },

  // ============================================================================
  // Catch All
  // ============================================================================

  {
    path: '/:pathMatch(.*)*',
    redirect: '/error/404'
  }
]

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

// ============================================================================
// Navigation Guards
// ============================================================================

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()

    // ✅ 인증 정보 로드 (Router Guard 추가)
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

    // 1. 페이지 타이틀 설정
    document.title = to.meta.title ? `${to.meta.title} - 전자등기` : '전자등기'

    // 2. Root 페이지는 동적 컴포넌트 렌더링하므로 통과
    if (to.path === '/') {
      next()
      return
    }

    // 3. 에러 페이지는 모든 상태에서 접근 가능
    if (to.path.startsWith('/error/')) {
      next()
      return
    }

    // 4. 인증 필요 체크 + ✅ 인증 데이터 검증
    if (to.meta.requiresAuth) {
      if (!authStore.isLoggedIn) {
        logger.warn('[ROUTER] Unauthorized - Redirect to login')
        next('/auth/login')
        return
      }

      // ✅ 로그인 상태이면 인증 데이터 유효성 검증 (authState 전달)
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

    // 5. 금융기관 선택 필요 체크
    if (to.meta.requiresBankCode && !authStore.selectedBankCode) {
      logger.warn('[ROUTER] Bank code required - Redirect to bank selection')
      next('/bank-select')
      return
    }

    // 6. 인증 상태 허용 범위 체크
    if (to.meta.allowedAuthStates && to.meta.allowedAuthStates.length > 0) {
      if (!to.meta.allowedAuthStates.includes(currentAuthState)) {
        logger.warn('[ROUTER] Invalid auth state', {
          current: currentAuthState,
          allowed: to.meta.allowedAuthStates
        })

        // Root로 리다이렉트 (Root에서 상태에 맞는 컴포넌트 렌더링)
        next('/')
        return
      }
    }

    // 7. 권한 체크
    if (to.meta.requiredRoles && to.meta.requiredRoles.length > 0) {
      // 시스템/서비스 관리자(SUPER_ADMIN:100, ADMIN:90)는 모든 페이지 접근 가능
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

    // 8. 정상 진행
    next()
  }
)

export default router
