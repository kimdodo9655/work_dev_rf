import type { RouteRecordRaw } from 'vue-router'

export const rootRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: () => import('@/components/shared/pages/RootPage.vue'),
    meta: {
      title: '전자등기',
      allowedAuthStates: ['pre-auth', 'onboarding', 'auth']
    }
  }
]
