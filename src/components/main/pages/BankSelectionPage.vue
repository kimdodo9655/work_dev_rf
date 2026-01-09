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

import { banksAPI } from '@/api/banks'
import { useAuthStore } from '@/stores/auth'
import type { Bank } from '@/types'
import { logger } from '@/utils/logger'

const router = useRouter()
const authStore = useAuthStore()

// ============================================================================
// 금융기관 목록 조회
// ============================================================================
const { data: bankResponse } = useQuery({
  queryKey: ['banks', 'list'],
  queryFn: () => banksAPI.getList()
})

// 금융기관 목록
const banks = computed(() => bankResponse.value?.data || [])

// ============================================================================
// 금융기관 선택 상태
// ============================================================================
const selectedBankCode = ref<string | null>(null)

// 금융기관 클릭 (선택만 하고 이동은 안함)
const handleClickBank = (bank: Bank) => {
  // 비활성 금융기관은 선택 불가
  if (!bank.isActive) {
    logger.warn('[BANK_SELECT] Inactive bank clicked', { bank })
    alert('현재 사용할 수 없는 금융기관입니다.')
    return
  }

  logger.info('[BANK_SELECT] Bank clicked', {
    code: bank.code,
    name: bank.name
  })

  // 선택된 금융기관 코드 저장 (로컬 상태에만)
  selectedBankCode.value = bank.code
}

// ============================================================================
// 금융기관 선택 완료
// ============================================================================
const handleConfirmSelection = () => {
  if (!selectedBankCode.value) {
    alert('금융기관을 선택해주세요.')
    return
  }

  const selectedBank = banks.value.find((bank) => bank.code === selectedBankCode.value)

  if (!selectedBank) {
    alert('선택한 금융기관 정보를 찾을 수 없습니다.')
    return
  }

  logger.info('[BANK_SELECT] Bank selection confirmed', {
    code: selectedBank.code,
    name: selectedBank.name
  })

  // Store에 금융기관 코드 저장 (이제 실제로 저장)
  authStore.setBankCode(selectedBank.code)

  // 대시보드로 이동
  router.push('/dashboard')
}
</script>
