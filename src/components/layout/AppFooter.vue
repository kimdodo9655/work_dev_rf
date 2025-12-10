<template>
  <footer class="main-footer" :class="authStore.authState === 'pre-auth' ? 'pre-auth-footer' : ''">
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
import locale from '@/locales/ko.json'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
