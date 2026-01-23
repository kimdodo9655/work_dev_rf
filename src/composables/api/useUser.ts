/**
 * @file useUser.ts
 * @description 사용자 관련 Mutation Composable
 * @domain [P03] 사용자
 */

// import { useMutation , useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useUser() {
  // TODO: 구현 시 주석 제거 - const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [P03-04] 사용자 등록 : useMutation
  // TODO: [P03-05] 사용자 수정 : useMutation
  // TODO: [P03-08] 사용자의 배정 금융기관 수정 : useMutation
  // TODO: [P03-09] 사용자 상태 변경 : useMutation
  // TODO: [P03-10] 사용자 비밀번호 초기화 : useMutation
  // TODO: [P03-11] 비밀번호 변경 : useMutation
  // TODO: [P03-12] 내 정보 수정 : useMutation

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
