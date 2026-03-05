<!-- 문서 경로: `@/src/components/layout/AppFooter.vue`
문서 제목: 재사용 레이아웃 컴포넌트: app-footer -->

<template>
  <footer class="main-footer" :class="authStore.authState === 'pre-auth' ? 'pre-auth-footer' : ''">
    <img src="@/assets/images/logo/bankclear_logo_bk.png" alt="bank logo" />
    <nav>
      <ul>
        <li>
          <router-link to="/terms">서비스 이용약관</router-link>
        </li>
        <li>
          <router-link to="/privacy">개인정보처리방침</router-link>
        </li>
      </ul>
    </nav>
    <p>COPYRIGHT ⓒ 2025 BANKCLEAR Inc. ALL RIGHTS RESERVED.</p>
  </footer>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
