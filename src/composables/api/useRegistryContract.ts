/**
 * @file useRegistryContract.ts
 * @description 등기진행-계약정보 관련 Mutation Composable
 * @domain [R02E] 등기진행-계약정보
 */

//import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useRegistryContract() {
  //const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [R02E-02] 계약정보 저장 : useMutation

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
