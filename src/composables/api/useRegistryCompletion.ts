/**
 * @file useRegistryCompletion.ts
 * @description 등기진행-완료문서 관련 Mutation Composable
 * @domain [R02X] 등기진행-완료문서
 */

// import { useMutation , useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useRegistryCompletion() {
  // TODO: 구현 시 주석 제거 - const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [R02X-03] 등기사항전부증명서 문서 업로드 : useMutation
  // TODO: [R02X-04] 사후등기필정보 문서 업로드 : useMutation
  // TODO: [R02X-07] 등기사항전부증명서 문서 삭제 : useMutation
  // TODO: [R02X-08] 사후등기필정보 문서 삭제 : useMutation

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
