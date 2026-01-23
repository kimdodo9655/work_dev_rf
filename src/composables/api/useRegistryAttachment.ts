/**
 * @file useRegistryAttachment.ts
 * @description 등기진행-첨부서면 관련 Mutation Composable
 * @domain [R02J] 등기진행-첨부서면
 */

// import { useMutation , useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useRegistryAttachment() {
  // TODO: 구현 시 주석 제거 - const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [R02J-02] 첨부서면 목록 대체 : useMutation

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
