import type { RouteLocationNormalized } from 'vue-router'

import locale from '@/locales/ko.json'

type AuthState = 'pre-auth' | 'onboarding' | 'auth'

export function resolvePageTitle(to: RouteLocationNormalized, authState: AuthState): string {
  let pageTitle = (to.meta.title as string | undefined) || '전자등기'

  if (to.path === '/' || to.name === 'Root') {
    switch (authState) {
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

  return pageTitle
}
