/**
 * @file useRegistryBasic.ts
 * @description 등기진행-기본 관련 Mutation Composable
 * @domain [R02B] 등기진행-기본
 */

//import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useRegistryBasic() {
  //const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [R02B-02] 등기진행 상세 저장 : useMutation
  // TODO: [R02B-03] 등기진행 삭제 : useMutation
  // TODO: [R02B-04] 등기상태 변경 : useMutation
  // TODO: [R02B-05] 등기완료 : useMutation
  // TODO: [R02B-06] 등기진행 복사 : useMutation
  // TODO: [R02B-07] 신청번호 추가 : useMutation

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
