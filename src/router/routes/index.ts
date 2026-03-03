import type { RouteRecordRaw } from 'vue-router'

import { authRoutes } from '@/router/routes/auth'
import { errorRoutes } from '@/router/routes/errors'
import { onboardingRoutes } from '@/router/routes/onboarding'
import { protectedRoutes } from '@/router/routes/protected'
import { rootRoutes } from '@/router/routes/root'

export const appRoutes: RouteRecordRaw[] = [
  ...rootRoutes,
  ...authRoutes,
  ...onboardingRoutes,
  ...protectedRoutes,
  ...errorRoutes
]
