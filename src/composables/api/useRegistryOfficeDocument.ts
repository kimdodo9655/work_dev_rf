/**
 * @file useRegistryOfficeDocument.ts
 * @description 등기사무소-문서 관련 Mutation Composable
 * @domain [R00D] 등기사무소-문서
 */

//import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useRegistryOfficeDocument() {
  //const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [R00D-01] 문서 임시 업로드 : useMutation
  // TODO: [R00D-03] 문서 저장 : useMutation
  // TODO: [R00D-04] 문서 삭제 : useMutation

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
