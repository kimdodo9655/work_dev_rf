/**
 * 문서 경로: `@/src/router/devRoutes.ts`
 * 문서 제목: 라우터 모듈: dev-routes
 */

import type { RouteRecordRaw } from 'vue-router'

export const devRoutes: RouteRecordRaw[] = [
  {
    path: '/dev/test',
    name: 'DevTest',
    component: () => import('@/features/dev/pages/DevTestPage.vue'),
    meta: {
      title: '개발 테스트',
      layout: 'test',
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth']
    }
  },
  {
    path: '/dev/api',
    name: 'DevApiTest',
    component: () => import('@/features/dev/pages/ApiTesterPage.vue'),
    meta: {
      title: '개발 API 테스트',
      layout: 'test',
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'],
      footerOff: true
    }
  },
  {
    path: '/dev/viewer',
    name: 'DevWebViewer',
    component: () => import('@/features/shared/pages/WebViewerPage.vue'),
    meta: {
      title: '개발 PDF 뷰어',
      layout: 'test',
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth'],
      footerOff: true
    }
  }
]
