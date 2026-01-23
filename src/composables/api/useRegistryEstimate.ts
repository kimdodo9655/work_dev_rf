/**
 * @file useRegistryEstimate.ts
 * @description 등기견적 관련 Mutation Composable
 * @domain [R01] 등기견적
 */

// import { useMutation , useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useRegistryEstimate() {
  // TODO: 구현 시 주석 제거 - const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [R01-02] 등기견적 생성 : useMutation
  // TODO: [R01-03] 등기견적 상세 저장 : useMutation
  // TODO: [R01-04] 등기견적 삭제 : useMutation
  // TODO: [R01-05] 등기접수 : useMutation
  // TODO: [R01-06] 등기견적 복사 : useMutation

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
