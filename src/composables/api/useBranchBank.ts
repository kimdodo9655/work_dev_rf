/**
 * @file useBranchBank.ts
 * @description 지점-금융기관배정 관련 Mutation Composable
 * @domain [P02B] 지점-금융기관배정
 */

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useBranchBank() {
  const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [P02B-02] 배정 금융기관 수정 : useMutation
  /**
   * 배정 금융기관 수정 Mutation
   * API: PATCH /api/branches/:branchId/assigned-banks
   */
  const updateAssignedBanksMutation = useMutation({
    mutationFn: async (/* params */) => {
      // TODO: branchBankAPI.update() 호출
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branch-banks'] })
    }
  })

  // ============================================================================
  // Helper Functions
  // ============================================================================

  // TODO: [P02B-02] 배정 금융기관 수정 : 헬퍼 함수
  const updateAssignedBanks = async (/* params */) => {
    // TODO: updateAssignedBanksMutation.mutateAsync() 호출
    throw new Error('Not implemented')
  }

  // ============================================================================
  // Computed States
  // ============================================================================

  const isLoading = computed(() => updateAssignedBanksMutation.isPending.value)

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // Mutations
    updateAssignedBanksMutation,

    // Helper Functions
    updateAssignedBanks,

    // Computed States
    isLoading
  }
}
