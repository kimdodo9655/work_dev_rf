/**
 * @file useBranchRegistry.ts
 * @description 지점-인터넷등기소 관련 Mutation Composable
 * @domain [P02D] 지점-인터넷등기소
 */

// import { useMutation , useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useBranchRegistry() {
  // TODO: 구현 시 주석 제거 - const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [P02D-02] 인터넷등기소 아이디 등록 : useMutation

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
