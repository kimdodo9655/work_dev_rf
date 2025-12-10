<template>
  <div id="app">
    <div class="wrapper" :class="authStore.authState === 'pre-auth' ? 'pre-auth-wrapper' : ''">
      <AppHeader v-if="authStore.authState !== 'pre-auth'" />

      <div class="content" v-if="authStore.authState !== 'pre-auth'">
        <router-view />
      </div>

      <div class="full-content" v-if="authStore.authState === 'pre-auth'">
        <div class="full-content-inner">
          <router-view />
        </div>
      </div>

      <AppFooter />
    </div>

    <DevNav />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

import DevNav from '@/components/dev/DevNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useAuthInitializer } from '@/composables/useAuthInitializer'
import { useAuthStore } from '@/stores/auth'
import { logger } from '@/utils/logger'

const authStore = useAuthStore()
const { initialize } = useAuthInitializer()

// ============================================================================
// Lifecycle
// ============================================================================
onMounted(async () => {
  logger.info('[APP] Application mounted')
  await initialize()
})

onBeforeUnmount(() => {
  logger.info('[APP] Application unmounting')
  authStore.cleanup()
})
</script>
