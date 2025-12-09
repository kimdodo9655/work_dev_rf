<template>
  <footer class="main-footer" :class="currentAuthState === 'pre-auth' ? 'pre-auth-footer' : ''">
    <img src="@/assets/images/logo/bankclear_logo_bk.png" alt="bank logo" />
    <nav>
      <ul>
        <li>
          <router-link to="/terms">{{ locale.footer.terms }}</router-link>
        </li>
        <li>
          <router-link to="/privacy">{{ locale.footer.privacy }}</router-link>
        </li>
      </ul>
    </nav>
    <p>{{ locale.footer.copyright }}</p>
  </footer>
</template>

<script lang="ts" setup>
import { useDevOptions } from '@/composables/useDevOptions'
import locale from '@/locales/ko.json'

// 전역적으로 상태 초기화
const { currentAuthState } = useDevOptions() // 'pre-auth', 'onboarding', 'auth'
</script>
