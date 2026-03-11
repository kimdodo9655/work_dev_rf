<!-- 문서 경로: `@/src/features/main/pages/BankSelectionPage.vue`
문서 제목: 기능 페이지/컴포넌트: bank-selection-page -->

<template>
  <div class="bank-list">
    <div
      v-for="bank in banks"
      :key="bank.code"
      class="bank-item"
      :class="{
        disabled: !bank.isActive,
        selected: selectedBankCode === bank.code
      }"
      @click="handleClickBank(bank)"
    >
      <div class="bank-info">
        <h3>{{ bank.name }}</h3>
        <p>코드: {{ bank.code }}</p>
        <p v-if="!bank.isActive" class="inactive-badge">비활성</p>
      </div>
      <div v-if="selectedBankCode === bank.code" class="check-icon">✓</div>
    </div>
  </div>

  <!-- 선택 완료 버튼 -->
  <div class="action-buttons">
    <button class="confirm-btn" :disabled="!selectedBankCode" @click="handleConfirmSelection">
      {{ selectedBankCode ? '금융기관 선택 완료' : '금융기관을 선택해주세요' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { bankAPI } from '@/api/services/bank'
import { useDialog } from '@/composables/utils/useDialog'
import { useAuthStore } from '@/stores/auth'
import type { BankResponse } from '@/types'
import { extractArrayByKeys } from '@/utils/apiPayload'
import { logger } from '@/utils/logger'

const router = useRouter()
const authStore = useAuthStore()
const { alert } = useDialog()

// ============================================================================
// 금융기관 목록 조회
// ============================================================================
const { data: bankResponse } = useQuery({
  queryKey: ['banks', 'list'],
  queryFn: () => bankAPI.getList()
  // ✅ 신규 서비스 함수명: list() (프로젝트에 맞게 필요 시 조정)
})

// 금융기관 목록
const banks = computed<BankResponse[]>(() => {
  return extractArrayByKeys<BankResponse>(bankResponse.value, ['banks'])
})

// ============================================================================
// 금융기관 선택 상태
// ============================================================================
const selectedBankCode = ref<string | null>(null)

const handleClickBank = async (bank: BankResponse) => {
  if (!bank.isActive) {
    logger.warn('[BANK_SELECT] Inactive bank clicked', { bank })
    await alert({
      title: '선택 불가',
      message: '현재 사용할 수 없는 금융기관입니다.'
    })
    return
  }

  logger.info('[BANK_SELECT] Bank clicked', {
    code: bank.code,
    name: bank.name
  })

  selectedBankCode.value = bank.code || null
}

// ============================================================================
// 금융기관 선택 완료
// ============================================================================
const handleConfirmSelection = async () => {
  if (!selectedBankCode.value) {
    await alert({
      title: '선택 필요',
      message: '금융기관을 선택해주세요.'
    })
    return
  }

  const selectedBank = banks.value.find((bank) => bank.code === selectedBankCode.value)

  if (!selectedBank?.code) {
    await alert({
      title: '선택 오류',
      message: '선택한 금융기관 정보를 찾을 수 없습니다.'
    })
    return
  }

  logger.info('[BANK_SELECT] Bank selection confirmed', {
    code: selectedBank.code,
    name: selectedBank.name
  })

  authStore.setBankCode(selectedBank.code)
  router.push({ name: 'Dashboard' })
}
</script>
