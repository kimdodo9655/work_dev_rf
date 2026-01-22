/**
 * @file useOrganization.ts
 * @description 기관 관련 Mutation Composable
 * @domain [P01] 기관
 */

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useOrganization() {
  const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [P01-02] 기관 수정 : useMutation
  /**
   * 기관 수정 Mutation
   * API: PATCH /api/organizations/:organizationId
   */
  const updateOrganizationMutation = useMutation({
    mutationFn: async (/* params */) => {
      // TODO: organizationAPI.update() 호출
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      // TODO: 쿼리 무효화 처리
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    }
  })

  // ============================================================================
  // Helper Functions
  // ============================================================================

  // TODO: [P01-02] 기관 수정 : 헬퍼 함수
  const updateOrganization = async (/* params */) => {
    // TODO: updateOrganizationMutation.mutateAsync() 호출
    throw new Error('Not implemented')
  }

  // ============================================================================
  // Computed States
  // ============================================================================

  const isLoading = computed(() => updateOrganizationMutation.isPending.value)

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // Mutations
    updateOrganizationMutation,

    // Helper Functions
    updateOrganization,

    // Computed States
    isLoading
  }
}
