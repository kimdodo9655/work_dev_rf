/**
 * @file useRegistryCase.ts
 * @description 등기진행-신청사건 관련 Mutation Composable
 * @domain [R02T] 등기진행-신청사건
 */

// import { useMutation , useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useRegistryCase() {
  // TODO: 구현 시 주석 제거 - const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [R02T-02] 신청사건 수정 : useMutation

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
