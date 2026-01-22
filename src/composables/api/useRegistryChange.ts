/**
 * @file useRegistryChange.ts
 * @description 등기진행-변경 관련 Mutation Composable
 * @domain [R02K] 등기진행-변경
 */

//import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useRegistryChange() {
  //const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [R02K-02] 변경 목록 대체 : useMutation

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
