/**
 * @file useRegistryDashboard.ts
 * @description 등기진행-대시보드 관련 Mutation Composable
 * @domain [R02A] 등기진행-대시보드
 */

//import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useRegistryDashboard() {
  //const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: 대시보드 관련 mutation 없음 (조회 전용)

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
