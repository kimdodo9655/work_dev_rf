/**
 * 문서 경로: `@/src/router/guards/titleGuard.ts`
 * 문서 제목: 라우트 가드: title-guard
 */

import type { RouteLocationNormalized } from 'vue-router'

import { MESSAGES } from '@/constants/messages'

type AuthState = 'pre-auth' | 'onboarding' | 'auth'

export function resolvePageTitle(to: RouteLocationNormalized, authState: AuthState): string {
  let pageTitle = (to.meta.title as string | undefined) || '전자등기'

  if (to.path === '/' || to.name === 'Root') {
    switch (authState) {
      case 'pre-auth':
        pageTitle = MESSAGES.pageTitle.auth.login
        break
      case 'onboarding':
        pageTitle = MESSAGES.pageTitle.main.bankSelect
        break
      case 'auth':
        pageTitle = MESSAGES.pageTitle.main.dashboard
        break
      default:
        pageTitle = '전자등기'
    }
  }

  return pageTitle
}
