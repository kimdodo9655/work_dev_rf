<template>
  <component :is="currentComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import LoginPage from '@/features/auth/pages/LoginPage.vue'
import BankSelectionPage from '@/features/main/pages/BankSelectionPage.vue'
import DashboardPage from '@/features/main/pages/DashboardPage.vue'
import { useAuthStore } from '@/stores/auth'
import { logger } from '@/utils/logger'

const authStore = useAuthStore()

const currentComponent = computed(() => {
  const state = authStore.authState

  logger.info('[ROOT] Rendering component for auth state', {
    authState: state
  })

  if (state === 'pre-auth') return LoginPage
  if (state === 'onboarding') return BankSelectionPage
  return DashboardPage
})
</script>
