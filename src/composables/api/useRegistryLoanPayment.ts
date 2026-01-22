/**
 * @file useRegistryLoanPayment.ts
 * @description 등기진행-대출금 지급계좌 관련 Mutation Composable
 * @domain [R02R] 등기진행-대출금 지급계좌
 */

//import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useRegistryLoanPayment() {
  //const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [R02R-03] 대출금 지급계좌 일괄 저장 : useMutation
  // TODO: [R02R-04] 상환영수증 업로드 : useMutation
  // TODO: [R02R-05] 상환영수증 삭제 : useMutation

  // ============================================================================
  // Helper Functions
  // ============================================================================

  // TODO: 헬퍼 함수 구현

  // ============================================================================
  // Computed States
  // ============================================================================

  const isLoading = computed(() => false) // TODO: mutation pending 상태 추가

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // Mutations
    // TODO: mutation 객체 반환

    // Helper Functions
    // TODO: 헬퍼 함수 반환

    // Computed States
    isLoading
  }
}
