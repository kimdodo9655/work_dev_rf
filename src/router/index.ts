import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

// Meta 타입 정의
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    titleAuth?: string // 로그인 후 타이틀 추가
    requiresAuth?: boolean
    requiredRoles?: string[]
    isOnboarding?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  // Root - 로그인 상태에 따라 동적으로 컴포넌트 변경
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/auth/pages/LoginPage.vue'),
    meta: {
      title: '로그인', // 로그인 전
      titleAuth: '나의 사건 정보', // 로그인 후
      requiresAuth: false
    }
  },

  // Error Pages
  {
    path: '/error/404',
    name: 'NotFound',
    component: () => import('@/components/shared/pages/NotFoundPage.vue'),
    meta: {
      title: '잘못된 페이지 접근',
      requiresAuth: false
    }
  },
  {
    path: '/error/mac-os',
    name: 'AccessErrorMac',
    component: () => import('@/components/shared/pages/AccessErrorMacPage.vue'),
    meta: {
      title: '접속 오류 (Mac OS)',
      requiresAuth: false
    }
  },
  {
    path: '/error/mobile',
    name: 'AccessErrorMobile',
    component: () => import('@/components/shared/pages/AccessErrorMobilePage.vue'),
    meta: {
      title: '접속 오류 (모바일)',
      requiresAuth: false
    }
  },

  // shared Pages
  {
    path: '/viewer',
    name: 'WebViewer',
    component: () => import('@/components/shared/pages/WebViewerPage.vue'),
    meta: {
      title: '웹뷰어',
      requiresAuth: true
    }
  },
  {
    path: '/device-info',
    name: 'DeviceInfo',
    component: () => import('@/components/shared/pages/DeviceInfoPage.vue'),
    meta: {
      title: '등록 단말기 입력 정보 확인',
      requiresAuth: true
    }
  },

  // Auth Pages (직접 접근용 - 필요시)
  {
    path: '/auth/login',
    redirect: '/'
  },
  {
    path: '/auth/signup',
    name: 'SignUp',
    component: () => import('@/components/auth/pages/SignupPage.vue'),
    meta: {
      title: '회원가입',
      requiresAuth: false
    }
  },
  {
    path: '/auth/install',
    name: 'ProgramInstall',
    component: () => import('@/components/auth/pages/ProgramInstallPage.vue'),
    meta: {
      title: '프로그램 설치',
      requiresAuth: false
    }
  },
  {
    path: '/auth/auto-logout',
    name: 'AutoLogout',
    component: () => import('@/components/auth/pages/AutoLogoutPage.vue'),
    meta: {
      title: '자동 로그아웃',
      requiresAuth: false
    }
  },
  {
    path: '/auth/password-setup',
    name: 'PasswordSetup',
    component: () => import('@/components/auth/pages/PasswordSetupPage.vue'),
    meta: {
      title: '비밀번호 설정',
      requiresAuth: true
    }
  },
  {
    path: '/auth/blocked/mac',
    name: 'AccessBlockMac',
    component: () => import('@/components/auth/pages/AccessBlockMacPage.vue'),
    meta: {
      title: '사이트 접속 차단 (Mac Address 오류)',
      requiresAuth: false
    }
  },
  {
    path: '/auth/blocked/email',
    name: 'AccessBlockEmail',
    component: () => import('@/components/auth/pages/AccessBlockEmailPage.vue'),
    meta: {
      title: '사이트 접속 차단 (이메일 인증)',
      requiresAuth: false
    }
  },
  {
    path: '/auth/blocked/user',
    name: 'AccessBlockUser',
    component: () => import('@/components/auth/pages/AccessBlockUserPage.vue'),
    meta: {
      title: '사이트 접속 차단 (사용자 사용유무)',
      requiresAuth: false
    }
  },

  // Main Pages
  {
    path: '/bank-select',
    name: 'BankSelection',
    component: () => import('@/components/main/pages/BankSelectionPage.vue'),
    meta: {
      title: '금융기관 선택',
      requiresAuth: true,
      isOnboarding: true
    }
  },
  {
    path: '/dashboard',
    redirect: '/' // 대시보드도 루트로 리다이렉트
  },

  // My Pages
  {
    path: '/my/organization',
    name: 'OrgMgmt',
    component: () => import('@/components/my/pages/OrgMgmtPage.vue'),
    meta: {
      title: '기관/지점 정보 관리',
      requiresAuth: true,
      requiredRoles: ['기관 관리자', '지점 관리자']
    }
  },
  {
    path: '/my/organization/:orgId',
    name: 'OrgDetail',
    component: () => import('@/components/my/pages/OrgDetailPage.vue'),
    meta: {
      title: '기관/지점 등록 정보',
      requiresAuth: true,
      requiredRoles: ['기관 관리자', '지점 관리자']
    }
  },
  {
    path: '/my/users',
    name: 'UserMgmt',
    component: () => import('@/components/my/pages/UserMgmtPage.vue'),
    meta: {
      title: '사용자 정보 관리',
      requiresAuth: true,
      requiredRoles: ['기관 관리자', '지점 관리자']
    }
  },
  {
    path: '/my/users/:userId',
    name: 'UserDetail',
    component: () => import('@/components/my/pages/UserDetailPage.vue'),
    meta: {
      title: '사용자 등록 정보',
      requiresAuth: true,
      requiredRoles: ['기관 관리자', '지점 관리자']
    }
  },
  {
    path: '/my/profile',
    name: 'MyInfo',
    component: () => import('@/components/my/pages/MyProfilePage.vue'),
    meta: {
      title: '내 정보 관리',
      requiresAuth: true
    }
  },

  // Estimate Pages
  {
    path: '/estimate',
    name: 'CaseEstimateMgmt',
    component: () => import('@/components/estimate/pages/EstimateMgmtContainer.vue'),
    meta: {
      title: '등기 견적 관리',
      requiresAuth: true
    }
  },
  {
    path: '/estimate/create/:registrationNo',
    name: 'EstimateCreateSubmitDetail',
    component: () => import('@/components/estimate/pages/EstimateDetailPage.vue'),
    meta: {
      title: '견적서 작성/제출 상세',
      requiresAuth: true
    }
  },
  {
    path: '/estimate/detail/:registrationNo',
    name: 'EstimateConfirmWithdrawDetail',
    component: () => import('@/components/estimate/pages/EstimateDetailPage.vue'),
    meta: {
      title: '견적서 확인/철회 상세',
      requiresAuth: true
    }
  },

  // Registration Pages
  {
    path: '/registration',
    name: 'CaseStatus',
    component: () => import('@/components/registration/pages/CaseStatusContainer.vue'),
    meta: {
      title: '등기 진행 현황',
      requiresAuth: true
    }
  },
  {
    path: '/registration/:caseId',
    name: 'CaseDetail',
    component: () => import('@/components/registration/pages/CaseDetailPage.vue'),
    meta: {
      title: '등기 진행 상세',
      requiresAuth: true
    }
  },
  {
    path: '/registration/schedule',
    name: 'CaseScheduleMgmt',
    component: () => import('@/components/registration/pages/CaseScheduleMgmtPage.vue'),
    meta: {
      title: '등기 일정 관리',
      requiresAuth: true
    }
  },

  // 404 Catch All (맨 마지막에 위치)
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

// ============================================
// Navigation Guards
// ============================================

/**
 * 인증 체크 함수
 */
function checkAuth(): boolean {
  return storage.isValid()
}

/**
 * 사용자 권한 조회 함수
 * roleLevel을 문자열 권한으로 매핑
 */
function getUserRoles(): string[] {
  const { roleLevel } = storage.get()

  if (!roleLevel) return []

  // roleLevel에 따른 권한 매핑
  const roleMap: Record<number, string[]> = {
    100: ['시스템 관리자'], // SUPER_ADMIN
    50: ['기관 관리자'],
    40: ['지점 관리자'],
    30: ['일반 사용자']
  }

  return roleMap[roleLevel] || []
}

/**
 * 전역 네비게이션 가드
 */
router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const isAuthenticated = checkAuth()
    const requiresAuth = to.meta.requiresAuth

    logger.debug('Navigation', {
      to: to.path,
      from: from.path,
      requiresAuth,
      isAuthenticated
    })

    // 페이지 타이틀 설정 (로그인 상태에 따라 다른 타이틀 사용)
    let pageTitle = '전자등기'

    if (to.path === '/' && to.meta.titleAuth && isAuthenticated) {
      // 루트 경로이고 로그인 상태이면 titleAuth 사용
      pageTitle = `${to.meta.titleAuth} - 전자등기`
    } else if (to.meta.title) {
      // 그 외에는 기본 title 사용
      pageTitle = `${to.meta.title} - 전자등기`
    }

    document.title = pageTitle

    // 1. 인증이 필요한 페이지인데 로그인하지 않은 경우
    if (requiresAuth && !isAuthenticated) {
      logger.warn('Unauthorized access attempt', { to: to.path })

      // 루트가 아닌 경우만 루트로 리다이렉트 (무한 루프 방지)
      if (to.path !== '/') {
        next({ path: '/', query: { redirect: to.fullPath } })
        return
      }
    }

    // 2. 권한 체크 (requiredRoles가 있는 경우)
    if (
      isAuthenticated &&
      requiresAuth &&
      to.meta.requiredRoles &&
      to.meta.requiredRoles.length > 0
    ) {
      const userRoles = getUserRoles()
      const hasRequiredRole = to.meta.requiredRoles.some((role) => userRoles.includes(role))

      if (!hasRequiredRole) {
        logger.warn('Insufficient permissions', {
          required: to.meta.requiredRoles,
          userRoles
        })
        next({ name: 'NotFound' })
        return
      }
    }

    // 3. 정상 진행
    next()
  }
)

/**
 * 네비게이션 후 처리
 */
router.afterEach((to, from) => {
  logger.debug('Navigation completed', {
    to: to.path,
    from: from.path
  })
})

/**
 * 인증 관련 이벤트 리스너
 * Axios 인터셉터에서 발생하는 로그아웃 이벤트 처리
 */
window.addEventListener('auth:logout', () => {
  logger.warn('Auth logout event received')
  // 이미 루트에 있으면 리로드, 아니면 루트로 이동
  if (window.location.pathname === '/') {
    window.location.reload()
  } else {
    window.location.href = '/'
  }
})

export default router
