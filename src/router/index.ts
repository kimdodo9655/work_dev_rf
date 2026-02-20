import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import locale from '@/locales/ko.json'
import { devRoutes } from '@/router/devRoutes'
import { useAuthStore } from '@/stores/auth'
import { UserRoleLevel } from '@/types'
import { handleInvalidAuthState, isValidAuthData } from '@/utils/authValidator'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

/**
 * Route Meta 타입 확장
 */
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

const routes: RouteRecordRaw[] = [
  ...(import.meta.env.DEV ? devRoutes : []),
  /**
   * Root 페이지
   *
   * 사용자의 인증 상태(authState)에 따라 적절한 페이지로 동적 렌더링:
   * - pre-auth: LoginPage 렌더링
   * - onboarding: BankSelectionPage 렌더링
   * - auth: DashboardPage 렌더링
   */
  {
    path: '/',
    name: 'Root',
    component: () => import('@/components/shared/pages/RootPage.vue'),
    meta: {
      title: '전자등기',
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth']
    }
  },

  // ============================================================================
  // Pre-Auth 라우트 (로그인 전)============================================================================

  /**
   * 로그인 페이지
   */
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/components/auth/pages/LoginPage.vue'),
    meta: {
      title: locale.pageTitle.auth.login,
      allowedAuthStates: ['pre-auth']
    }
  },

  /**
   * 회원가입 페이지
   */
  {
    path: '/auth/signup',
    name: 'SignUp',
    component: () => import('@/components/auth/pages/SignupPage.vue'),
    meta: {
      title: locale.pageTitle.auth.signup,
      allowedAuthStates: ['pre-auth']
    }
  },

  /**
   * 프로그램 설치 안내 페이지
   */
  {
    path: '/auth/install',
    name: 'ProgramInstall',
    component: () => import('@/components/auth/pages/ProgramInstallPage.vue'),
    meta: {
      title: locale.pageTitle.auth.install,
      allowedAuthStates: ['pre-auth']
    }
  },

  /**
   * 자동 로그아웃 페이지
   */
  {
    path: '/auth/auto-logout',
    name: 'AutoLogout',
    component: () => import('@/components/auth/pages/AutoLogoutPage.vue'),
    beforeEnter: () => {
      const authStore = useAuthStore()

      // 플래그가 없으면 차단
      if (!authStore.canAccessAutoLogoutPage) {
        logger.warn('[ROUTER] Unauthorized auto-logout page access')
        return '/auth/login'
      }

      // ✅ 플래그 소비 (일회용)
      authStore.canAccessAutoLogoutPage = false
      return true
    },
    meta: {
      title: locale.pageTitle.auth.autoLogout,
      allowedAuthStates: ['pre-auth']
    }
  },

  /**
   * 비밀번호 설정 페이지
   */
  {
    path: '/auth/password-setup',
    name: 'PasswordSetup',
    component: () => import('@/components/auth/pages/PasswordSetupPage.vue'),
    meta: {
      title: locale.pageTitle.auth.passwordSetup,
      allowedAuthStates: ['pre-auth']
    }
  },

  /**
   * MAC 주소 차단 페이지
   */
  {
    path: '/auth/blocked/mac',
    name: 'AccessBlockMac',
    component: () => import('@/components/auth/pages/AccessBlockMacPage.vue'),
    meta: {
      title: locale.pageTitle.auth.blocked.mac,
      allowedAuthStates: ['pre-auth']
    }
  },

  /**
   * 이메일 차단 페이지
   */
  {
    path: '/auth/blocked/email',
    name: 'AccessBlockEmail',
    component: () => import('@/components/auth/pages/AccessBlockEmailPage.vue'),
    meta: {
      title: locale.pageTitle.auth.blocked.email,
      allowedAuthStates: ['pre-auth']
    }
  },

  /**
   * 사용자 계정 차단 페이지
   */
  {
    path: '/auth/blocked/user',
    name: 'AccessBlockUser',
    component: () => import('@/components/auth/pages/AccessBlockUserPage.vue'),
    meta: {
      title: locale.pageTitle.auth.blocked.user,
      allowedAuthStates: ['pre-auth']
    }
  },

  // ============================================================================
  // Onboarding 라우트 (로그인 후, 금융기관 선택 전/후)
  // ============================================================================

  /**
   * 금융기관 선택 페이지
   */
  {
    path: '/bank-select',
    name: 'BankSelection',
    component: () => import('@/components/main/pages/BankSelectionPage.vue'),
    meta: {
      title: locale.pageTitle.main.bankSelect,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth']
    }
  },

  /**
   * 조직 관리 페이지
   */
  {
    path: '/my/organization',
    name: 'OrgMgmt',
    component: () => import('@/components/my/pages/OrgMgmtPage.vue'),
    meta: {
      title: locale.pageTitle.my.organization,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [UserRoleLevel.ORGANIZATION_ADMIN, UserRoleLevel.BRANCH_ADMIN]
    }
  },

  /**
   * 조직 상세 페이지
   * @param {string} orgId - 조직 고유 식별자
   */
  {
    path: '/my/organization/:orgId',
    name: 'OrgDetail',
    component: () => import('@/components/my/pages/OrgDetailPage.vue'),
    meta: {
      title: locale.pageTitle.my.organizationDetail,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [UserRoleLevel.ORGANIZATION_ADMIN, UserRoleLevel.BRANCH_ADMIN]
    }
  },

  /**
   * 사용자 관리 페이지
   */
  {
    path: '/my/users',
    name: 'UserMgmt',
    component: () => import('@/components/my/pages/UserMgmtPage.vue'),
    meta: {
      title: locale.pageTitle.my.users,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [UserRoleLevel.ORGANIZATION_ADMIN, UserRoleLevel.BRANCH_ADMIN]
    }
  },

  /**
   * 사용자 상세 페이지
   * @param {string} userId - 사용자 고유 식별자
   */
  {
    path: '/my/users/:userId',
    name: 'UserDetail',
    component: () => import('@/components/my/pages/UserDetailPage.vue'),
    meta: {
      title: locale.pageTitle.my.userDetail,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [UserRoleLevel.ORGANIZATION_ADMIN, UserRoleLevel.BRANCH_ADMIN]
    }
  },

  /**
   * 내 프로필 페이지
   */
  {
    path: '/my/profile',
    name: 'MyProfile',
    component: () => import('@/components/my/pages/MyProfilePage.vue'),
    meta: {
      title: locale.pageTitle.my.profile,
      requiresAuth: true,
      allowedAuthStates: ['onboarding', 'auth'],
      requiredRoles: [UserRoleLevel.USER]
    }
  },

  /**
   * 디바이스 정보 페이지
   */
  {
    path: '/device-info',
    name: 'DeviceInfo',
    component: () => import('@/components/shared/pages/DeviceInfoPage.vue'),
    meta: {
      title: locale.pageTitle.shared.deviceInfo,
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'],
      layout: 'all'
    }
  },

  // ============================================================================
  // Auth 라우트 (로그인 후, 금융기관 선택 완료)
  // ============================================================================

  /**
   * 대시보드 페이지
   */
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/components/main/pages/DashboardPage.vue'),
    meta: {
      title: locale.pageTitle.main.dashboard,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  /**
   * 웹 뷰어 페이지
   */
  {
    path: '/viewer',
    name: 'WebViewer',
    component: () => import('@/components/shared/pages/WebViewerPage.vue'),
    meta: {
      title: locale.pageTitle.shared.viewer,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  /**
   * 공지사항 목록 페이지
   */
  {
    path: '/notice',
    name: 'Notice',
    component: () => import('@/components/shared/pages/NoticePage.vue'),
    meta: {
      title: locale.pageTitle.shared.notice,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  /**
   * 공지사항 상세 페이지
   * TODO: 동적 라우트 파라미터로 변경 필요
   */
  {
    path: '/notice/001',
    name: 'NoticeDetail',
    component: () => import('@/components/shared/pages/NoticeDetailPage.vue'),
    meta: {
      title: locale.pageTitle.shared.noticeDetail,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  /**
   * 견적 관리 목록 페이지
   */
  {
    path: '/estimate',
    name: 'EstimateMgmt',
    component: () => import('@/components/estimate/pages/EstimateMgmtPage.vue'),
    meta: {
      title: locale.pageTitle.estimate.list,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth'],
      keepAlive: true
    }
  },

  /**
   * 견적서 작성 페이지
   * @param {string} registrationNo - 등기 사건 번호
   */
  {
    path: '/estimate/create/:registrationNo',
    name: 'EstimateCreate',
    component: () => import('@/components/estimate/pages/EstimateDetailPage.vue'),
    meta: {
      title: locale.pageTitle.estimate.createDetail,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth'],
      keepAlive: false
    }
  },

  /**
   * 견적서 상세/수정 페이지
   * @param {string} registrationNo - 등기 사건 번호
   */
  {
    path: '/estimate/detail/:registrationNo',
    name: 'EstimateDetail',
    component: () => import('@/components/estimate/pages/EstimateDetailPage.vue'),
    meta: {
      title: locale.pageTitle.estimate.confirmDetail,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth'],
      keepAlive: false
    }
  },

  /**
   * 등기 사건 현황 페이지
   */
  {
    path: '/registration',
    name: 'RegistrationStatus',
    component: () => import('@/components/registration/pages/CaseStatusContainer.vue'),
    meta: {
      title: locale.pageTitle.registration.caseStatus,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  /**
   * 등기 사건 상세 페이지
   * @param {string} caseId - 등기 사건 고유 식별자
   */
  {
    path: '/registration/:caseId',
    name: 'RegistrationDetail',
    component: () => import('@/components/registration/pages/CaseDetailPage.vue'),
    meta: {
      title: locale.pageTitle.registration.caseDetail,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  /**
   * 등기 일정 관리 페이지
   */
  {
    path: '/registration/schedule',
    name: 'RegistrationSchedule',
    component: () => import('@/components/registration/pages/CaseScheduleMgmtPage.vue'),
    meta: {
      title: locale.pageTitle.registration.schedule,
      requiresAuth: true,
      requiresBankCode: true,
      allowedAuthStates: ['auth']
    }
  },

  // ============================================================================
  // 에러 페이지
  // ============================================================================

  /**
   * 404 Not Found 페이지
   */
  {
    path: '/error/404',
    name: 'NotFound',
    component: () => import('@/components/shared/pages/NotFoundPage.vue'),
    meta: {
      title: locale.pageTitle.error['404'],
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'],
      layout: 'all'
    }
  },

  /**
   * macOS 접근 오류 페이지
   */
  {
    path: '/error/mac-os',
    name: 'ErrorMacOS',
    component: () => import('@/components/shared/pages/AccessErrorMacPage.vue'),
    meta: {
      title: locale.pageTitle.error.macOs,
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'],
      layout: 'all',
      footerOff: true
    }
  },

  /**
   * 모바일 접근 오류 페이지
   */
  {
    path: '/error/mobile',
    name: 'ErrorMobile',
    component: () => import('@/components/shared/pages/AccessErrorMobilePage.vue'),
    meta: {
      title: locale.pageTitle.error.mobile,
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'],
      layout: 'all',
      mobile: true,
      footerOff: true
    }
  },

  // ============================================================================
  // Catch All
  // ============================================================================

  /**
   * 404 Catch All 라우트
   */
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

/*
 * Navigation Guard
 *
 * 모든 라우트 이동 전 실행되는 가드
 *
 * 검증 순서:
 * 1. 페이지 타이틀 설정
 * 2. Root 페이지 예외 처리
 * 3. 에러 페이지 예외 처리
 * 4. 로그인 필요 여부 체크 (requiresAuth)
 * 5. 인증 데이터 유효성 검증
 * 6. 금융기관 선택 필요 여부 체크 (requiresBankCode)
 * 7. 허용된 인증 상태 범위 체크 (allowedAuthStates)
 * 8. 권한 레벨 체크 (requiredRoles)
 * 9. 모든 검증 통과 시 접근 허용
 */
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

    // 1. 페이지 타이틀 설정
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

    // 2. Root 페이지 예외 처리
    if (to.path === '/') {
      next()
      return
    }

    // 3. 에러 페이지 예외 처리
    if (to.path.startsWith('/error/')) {
      next()
      return
    }

    // 4. 로그인 필요 여부 체크
    if (to.meta.requiresAuth) {
      if (!authStore.isLoggedIn) {
        logger.warn('[ROUTER] Unauthorized - Redirect to login')
        next('/auth/login')
        return
      }

      // 5. 인증 데이터 유효성 검증
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

    // 6. 금융기관 선택 필요 여부 체크
    if (to.meta.requiresBankCode && !authStore.selectedBankCode) {
      logger.warn('[ROUTER] Bank code required - Redirect to bank selection')
      next('/bank-select')
      return
    }

    // 7. 허용된 인증 상태 범위 체크
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

    // 8. 권한 레벨 체크
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

    // 9. 모든 검증 통과
    next()
  }
)

export default router
