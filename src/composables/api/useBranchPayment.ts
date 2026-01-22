/**
 * @file useBranchPayment.ts
 * @description 지점-지급계좌 관련 Mutation Composable
 * @domain [P02C] 지점-지급계좌
 */

// import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useBranchPayment() {
  // const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [P02C-02] 지급계좌 수정 : useMutation

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
