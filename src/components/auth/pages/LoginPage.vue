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
              aria-label="id"
              type="text"
              placeholder="아이디"
              :disabled="login.isPending.value"
            />
            <i class="fi fi-ss-user"></i>
          </li>
          <li>
            <input
              v-model="password"
              aria-label="password"
              type="password"
              placeholder="비밀번호"
              :disabled="login.isPending.value"
            />
            <i class="fi fi-sr-lock"></i>
          </li>
          <li>
            <input type="checkbox" id="test" value="test" />
            <label for="test"> test </label>

            <router-link to="/auth/password-setup">password-setup</router-link>
          </li>
          <li>
            <input type="submit" value="로그인" :disabled="login.isPending.value" />
          </li>
          <li>
            <i class="fi fi-ss-exclamation"></i>
            <router-link to="/auth/signup">signup</router-link>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { logger } from '@/utils/logger'

const router = useRouter()
const { login } = useAuth()
const { getErrorMessage } = useErrorHandler()

// ============================================================================
// 폼 데이터
// ============================================================================
const loginId = ref('admin')
const password = ref('P@ssw0rd1!')
const errorMessage = ref('')

// ============================================================================
// 로그인 처리
// ============================================================================
const handleSubmit = async () => {
  // API-CALL: 로그인(/api/auth/login 🅿️) 호출
  // 1. 유효성 검증
  if (!loginId.value.trim()) {
    errorMessage.value = '아이디를 입력해주세요.'
    return
  }

  if (!password.value.trim()) {
    errorMessage.value = '비밀번호를 입력해주세요.'
    return
  }

  // 2. 에러 메시지 초기화
  errorMessage.value = ''

  // 3. 로그인 API 호출
  try {
    await login.mutateAsync({
      loginId: loginId.value,
      password: password.value
    })

    logger.info('[LOGIN] Login success', { loginId: loginId.value })

    // 4. 성공 시 금융기관 선택 페이지로 이동
    router.push('/bank-select')
  } catch (error: any) {
    logger.error('[LOGIN] Login failed', { error })

    // 5. 에러 메시지 표시
    errorMessage.value = getErrorMessage(error)
  }
}
</script>
