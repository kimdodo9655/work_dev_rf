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

    <DialogProvider />
    <component :is="DevNav" v-if="isDev && DevNav" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import DialogProvider from '@/components/layout/DialogProvider.vue'
import { useAuthInitializer } from '@/composables/utils/useAuthInitializer'
import { ensureIconStylesLoaded } from '@/plugins/iconStyles'
// import { useDeviceDetection } from '@/composables/utils/useDeviceDetection'
import { useAuthStore } from '@/stores/auth'
import { ENV } from '@/utils/env'
import { logger } from '@/utils/logger'

const route = useRoute()
const authStore = useAuthStore()
const { initialize } = useAuthInitializer()
const isDev = ENV.IS_DEV
const DevNav = isDev
  ? defineAsyncComponent(() => import('@/features/dev/components/DevNav.vue'))
  : null
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
  // 아이콘 폰트 CSS를 비동기로 로드해 초기 번들 블로킹을 줄인다.
  void ensureIconStylesLoaded()

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
