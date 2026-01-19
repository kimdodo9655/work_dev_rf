<template>
  <div class="login-page">
    <div class="left">
      <i class="fi fi-ss-house-building"></i>
      <h1 class="multi-line">법무대리인<br />등기지원시스템</h1>
    </div>
    <div class="right">
      <h4><i class="fi fi-br-sign-in-alt"></i>로그인</h4>

      <form @submit.prevent="handleSubmit">
        <ul>
          <li>
            <input
              v-model="loginId"
              aria-label="아이디"
              type="text"
              placeholder="아이디"
              :disabled="isSubmitting"
            />
            <i class="fi fi-ss-user left"></i>
          </li>
          <li>
            <input
              v-model="password"
              aria-label="비밀번호"
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호"
              :disabled="isSubmitting"
            />
            <i class="fi fi-sr-lock left"></i>

            <i
              :class="[
                'eye',
                showPassword ? 'fi fi-sr-eye eye-on' : 'fi fi-rr-eye-crossed eye-off'
              ]"
              @click="togglePasswordVisibility"
              style="cursor: pointer"
            ></i>
          </li>
          <li class="line-option mb-20">
            <i
              :class="rememberLoginId ? 'fi fi-sr-check-circle on' : 'fi fi-ss-circle off'"
              @click="toggleRememberLoginId"
              style="cursor: pointer"
            ></i>
            <p class="remember-login-text" @click="toggleRememberLoginId">아이디 기억하기</p>

            <router-link to="/auth/password-setup">비밀번호 변경</router-link>
          </li>
          <li>
            <input type="submit" value="로그인" :disabled="isSubmitting" />
          </li>
          <li class="line-option">
            <i class="fi fi-rs-exclamation"></i>
            <p>아직 회원이 아니신가요?</p>
            <router-link to="/auth/signup">회원가입</router-link>
          </li>
        </ul>

        <!-- 에러 메시지 표시 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

import { useAuth } from '@/composables/useAuth'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { logger } from '@/utils/logger'

// ============================================================================
// Composables
// ============================================================================
const { login, loginMutation } = useAuth()
const { getErrorMessage } = useErrorHandler()

// ============================================================================
// Constants
// ============================================================================
const STORAGE_KEY = 'REMEMBER_LOGIN_ID' as const

const DEV_DEFAULT_CREDENTIALS = {
  loginId: import.meta.env.DEV ? 'admin' : '',
  password: import.meta.env.DEV ? 'P@ssw0rd1!' : ''
} as const

// ============================================================================
// UI State
// ============================================================================
const loginId = ref<string>(DEV_DEFAULT_CREDENTIALS.loginId)
const password = ref<string>(DEV_DEFAULT_CREDENTIALS.password)
const errorMessage = ref<string>('')
const showPassword = ref<boolean>(false)
const rememberLoginId = ref<boolean>(false)

// ============================================================================
// UI Computed
// ============================================================================
const isSubmitting = computed<boolean>(() => loginMutation.isPending.value)

// ============================================================================
// Remember Login ID
// ============================================================================
const toggleRememberLoginId = (): void => {
  rememberLoginId.value = !rememberLoginId.value
}

const saveLoginId = (): void => {
  try {
    if (rememberLoginId.value && loginId.value.trim()) {
      localStorage.setItem(STORAGE_KEY, loginId.value)
      logger.info('[LOGIN] Login ID saved to localStorage')
    } else {
      localStorage.removeItem(STORAGE_KEY)
      logger.info('[LOGIN] Login ID removed from localStorage')
    }
  } catch (error) {
    logger.error('[LOGIN] Failed to save login ID', { error })
  }
}

const loadSavedLoginId = (): void => {
  try {
    const savedLoginId = localStorage.getItem(STORAGE_KEY)
    if (savedLoginId) {
      loginId.value = savedLoginId
      rememberLoginId.value = true
      logger.info('[LOGIN] Saved login ID loaded from localStorage')
    }
  } catch (error) {
    logger.error('[LOGIN] Failed to load saved login ID', { error })
  }
}

// ============================================================================
// UI Event Handlers
// ============================================================================
const togglePasswordVisibility = (): void => {
  showPassword.value = !showPassword.value
}

const validateForm = (): boolean => {
  errorMessage.value = ''

  if (!loginId.value.trim()) {
    errorMessage.value = '아이디를 입력해주세요.'
    return false
  }

  if (!password.value.trim()) {
    errorMessage.value = '비밀번호를 입력해주세요.'
    return false
  }

  return true
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return

  try {
    await login(
      {
        loginId: loginId.value,
        password: password.value
      },
      {
        redirectTo: '/bank-select',
        onSuccess: () => {
          saveLoginId()
        }
      }
    )
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
    password.value = ''
  }
}

// ============================================================================
// Lifecycle Hooks
// ============================================================================
onMounted(() => {
  loadSavedLoginId()
  logger.info('[LOGIN] Login page mounted')
})
</script>
