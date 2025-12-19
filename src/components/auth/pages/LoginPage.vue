<template>
  <div class="login-page">
    <div class="left">
      <h1 class="multi-line">법무대리인<br />등기지원시스템</h1>
    </div>
    <div class="right">
      <div>
        <h4>임시 로그인(SUPER_ADMIN)</h4>

        <form @submit.prevent="handleSubmit">
          <input
            v-model="loginId"
            aria-label="id"
            type="text"
            placeholder="아이디"
            :disabled="login.isPending.value"
          />

          <input
            v-model="password"
            aria-label="password"
            type="password"
            placeholder="비밀번호"
            :disabled="login.isPending.value"
          />

          <!-- 에러 메시지 표시 -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <input type="submit" value="로그인" :disabled="login.isPending.value" />
        </form>
      </div>
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

<style lang="scss" scoped>
.error-message {
  color: red;
  font-size: 14px;
  margin: 10px 0;
}

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
