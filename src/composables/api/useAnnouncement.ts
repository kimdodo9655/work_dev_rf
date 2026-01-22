/**
 * @file useAnnouncement.ts
 * @description 공지사항 관련 Mutation Composable
 * @domain [P08] 공지사항
 */

// import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useAnnouncement() {
  //   const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [P08-04] 공지사항 등록 : useMutation
  // TODO: [P08-05] 공지사항 수정 : useMutation
  // TODO: [P08-06] 공지사항 삭제 : useMutation

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
