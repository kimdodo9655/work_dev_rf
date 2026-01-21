<template>
  <div id="app">
    <div class="wrapper" :class="wrapperClass">
      <AppHeader v-if="shouldShowHeader" />

      <div class="content" v-if="layoutType === 'default'">
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component" v-if="route.meta.keepAlive" :key="route.path" />
          </keep-alive>
          <component :is="Component" v-if="!route.meta.keepAlive" :key="route.path" />
        </router-view>
      </div>

      <div class="full-content" v-if="layoutType === 'pre-auth'">
        <div class="full-content-inner">
          <router-view />
        </div>
      </div>

      <div class="all-content" v-if="layoutType === 'all'">
        <router-view />
      </div>

      <div class="test-content" v-if="layoutType === 'test'">
        <router-view />
      </div>

      <AppFooter v-if="shouldShowFooter" />
    </div>

    <DevNav />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import DevNav from '@/components/dev/DevNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useAuthInitializer } from '@/composables/useAuthInitializer'
// import { useDeviceDetection } from '@/composables/useDeviceDetection'
import { useAuthStore } from '@/stores/auth'
import { logger } from '@/utils/logger'

const route = useRoute()
const authStore = useAuthStore()
const { initialize } = useAuthInitializer()
// const { checkAndRedirect } = useDeviceDetection()

// ============================================================================
// Computed
// ============================================================================
const layoutType = computed(() => {
  if (route.meta.layout === 'all') return 'all'
  if (route.meta.layout === 'test') return 'test'
  if (authStore.authState === 'pre-auth') return 'pre-auth'
  return 'default'
})

const shouldShowHeader = computed(() => {
  return layoutType.value === 'default'
})

const shouldShowFooter = computed(() => {
  return !route.meta.footerOff
})

const wrapperClass = computed(() => {
  const classes: string[] = []

  if (layoutType.value === 'pre-auth') classes.push('pre-auth-wrapper')
  if (layoutType.value === 'all') classes.push('all-content-wrapper')
  if (layoutType.value === 'test') classes.push('test-content-wrapper')
  if (route.meta.mobile) classes.push('mob-wrapper')

  return classes
})

// ============================================================================
// Lifecycle
// ============================================================================
onMounted(async () => {
  if (!route.path.startsWith('/error')) {
    // 모바일, macOs 차단
    // checkAndRedirect()
  }

  logger.info('[APP] Application mounted')
  await initialize()
})

onBeforeUnmount(() => {
  logger.info('[APP] Application unmounting')
  authStore.cleanup()
})
</script>
