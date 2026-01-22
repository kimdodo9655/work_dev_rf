/**
 * @file useRegistryProgressDocument.ts
 * @description 등기진행-문서 관련 Mutation Composable
 * @domain [R02Y] 등기진행-문서
 */

//import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useRegistryProgressDocument() {
  //const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [R02Y-01] 문서 임시 업로드 : useMutation
  // TODO: [R02Y-03] 문서 저장 : useMutation
  // TODO: [R02Y-04] 문서 삭제 : useMutation
  // TODO: [R02Y-07] 신청번호 기준 문서 삭제 : useMutation

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
