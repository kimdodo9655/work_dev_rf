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
import { useAuthStore } from '@/stores/auth'
import type { BankResponse } from '@/types'
import { logger } from '@/utils/logger'

/** axios 응답({data}) / DTO 응답(그 자체) 둘 다 지원 */
function unwrap<T>(res: any): T {
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return res as T
}

const router = useRouter()
const authStore = useAuthStore()

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
  const payload = unwrap<any>(bankResponse.value)

  if (!payload) return []

  // 케이스1) 바로 배열
  if (Array.isArray(payload)) return payload as BankResponse[]

  // 케이스2) { banks: [] }
  if (Array.isArray(payload?.banks)) return payload.banks as BankResponse[]

  // 케이스3) { result: { banks: [] } } 같은 래핑
  if (Array.isArray(payload?.result?.banks)) return payload.result.banks as BankResponse[]
  if (Array.isArray(payload?.result)) return payload.result as BankResponse[]

  return []
})

// ============================================================================
// 금융기관 선택 상태
// ============================================================================
const selectedBankCode = ref<string | null>(null)

const handleClickBank = (bank: BankResponse) => {
  if (!bank.isActive) {
    logger.warn('[BANK_SELECT] Inactive bank clicked', { bank })
    alert('현재 사용할 수 없는 금융기관입니다.')
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
const handleConfirmSelection = () => {
  if (!selectedBankCode.value) {
    alert('금융기관을 선택해주세요.')
    return
  }

  const selectedBank = banks.value.find((bank) => bank.code === selectedBankCode.value)

  if (!selectedBank?.code) {
    alert('선택한 금융기관 정보를 찾을 수 없습니다.')
    return
  }

  logger.info('[BANK_SELECT] Bank selection confirmed', {
    code: selectedBank.code,
    name: selectedBank.name
  })

  authStore.setBankCode(selectedBank.code)
  router.push('/dashboard')
}
</script>
