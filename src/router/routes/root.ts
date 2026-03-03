/**
 * 문서 경로: `@/src/router/routes/root.ts`
 * 문서 제목: 라우트 정의: root
 */

import type { RouteRecordRaw } from 'vue-router'

export const rootRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: () => import('@/features/app/pages/RootPage.vue'),
    meta: {
      title: '전자등기',
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth']
    }
  }
]
