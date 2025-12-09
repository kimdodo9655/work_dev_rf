<template>
  <div id="app">
    <div class="wrapper" :class="currentAuthState === 'pre-auth' ? 'pre-auth-wrapper' : ''">
      <AppHeader v-if="currentAuthState !== 'pre-auth'" />

      <div class="content" v-if="currentAuthState !== 'pre-auth'">
        <router-view />
      </div>

      <div class="full-content" v-if="currentAuthState === 'pre-auth'">
        <div class="full-content-inner">
          <router-view />
        </div>
      </div>

      <button
        style="
          width: 100%;
          padding: 15px;
          background-color: #ddd;
          color: #333;
          cursor: pointer;
          border-radius: 10px;
          margin-bottom: 10px;
        "
        @click="isVisible = !isVisible"
      >
        TEMP (Testing UI)
      </button>
      <div style="width: 100%; background-color: #fff; border-radius: 10px" v-show="isVisible">
        <TempLogin />
        <TempPdf />
      </div>

      <AppFooter />
    </div>

    <DevNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// [DEV] 개발요 도구 네비게이션
import DevNav from '@/components/dev/DevNav.vue'
// 공통 레이아웃
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
// [DEV] 개발요 도구 상태관리
import { useDevOptions } from '@/composables/useDevOptions'

// 테스트용 임시 파일
import TempLogin from './components/dev/TEMP/TempLogin.vue'
import TempPdf from './components/dev/TEMP/TempPdf.vue'

// Temp 요소 on/off
const isVisible = ref(false)

// [DEV] 전역적으로 상태 초기화
const { currentAuthState } = useDevOptions() // 'pre-auth', 'onboarding', 'auth'
</script>
