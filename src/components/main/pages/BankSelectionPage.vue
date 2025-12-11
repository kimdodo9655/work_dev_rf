<template>
  <div class="bank-selection-page">
    <h1>금융기관 선택</h1>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading">
      <p>금융기관 목록을 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="isError" class="error">
      <p>{{ errorMessage }}</p>
      <button @click="refetch">다시 시도</button>
    </div>

    <!-- 금융기관 목록 -->
    <div v-else-if="banks && banks.length > 0" class="bank-content">
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
    </div>

    <!-- 목록이 비어있을 때 -->
    <div v-else class="empty">
      <p>선택 가능한 금융기관이 없습니다.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { banksAPI } from '@/api/banks'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useAuthStore } from '@/stores/auth'
import type { Bank } from '@/types'
import { logger } from '@/utils/logger'

const router = useRouter()
const authStore = useAuthStore()
const { getErrorMessage } = useErrorHandler()

// ============================================================================
// 금융기관 목록 조회
// ============================================================================
const {
  data: bankResponse,
  isLoading,
  isError,
  error,
  refetch
} = useQuery({
  queryKey: ['banks', 'list'],
  queryFn: () => banksAPI.getList()
})

// 금융기관 목록
const banks = computed(() => bankResponse.value?.data || [])

// 에러 메시지
const errorMessage = computed(() => {
  if (error.value) {
    return getErrorMessage(error.value)
  }
  return '금융기관 목록을 불러올 수 없습니다.'
})

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

<style lang="scss" scoped>
.bank-selection-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    margin-bottom: 30px;
  }
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 40px;
}

.error {
  color: red;

  button {
    margin-top: 20px;
    padding: 10px 20px;
    cursor: pointer;
  }
}

.bank-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.bank-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.bank-item {
  position: relative;
  border: 2px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover:not(.disabled) {
    border-color: #2196f3;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.selected {
    border-color: #4caf50;
    background-color: #e8f5e9;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
  }

  .bank-info {
    flex: 1;

    h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
    }

    p {
      margin: 5px 0;
      font-size: 14px;
      color: #666;
    }

    .inactive-badge {
      display: inline-block;
      background-color: #f44336;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-top: 5px;
    }
  }

  .check-icon {
    font-size: 32px;
    color: #4caf50;
    font-weight: bold;
    margin-left: 10px;
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  padding: 20px 0;

  .confirm-btn {
    padding: 15px 40px;
    font-size: 18px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background-color: #4caf50;
    color: white;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: #45a049;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }
  }
}
</style>
