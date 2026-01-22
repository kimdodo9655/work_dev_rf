/**
 * @file useBranch.ts
 * @description 지점-기본 관련 Mutation Composable
 * @domain [P02A] 지점-기본
 */

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useBranch() {
  const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================

  // TODO: [P02A-03] 지점 수정 : useMutation
  /**
   * 지점 수정 Mutation
   * API: PATCH /api/branches/:branchId
   */
  const updateBranchMutation = useMutation({
    mutationFn: async (/* params */) => {
      // TODO: branchAPI.update() 호출
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
    }
  })

  // TODO: [P02A-04] 지점 등록 : useMutation
  /**
   * 지점 등록 Mutation
   * API: POST /api/branches
   */
  const createBranchMutation = useMutation({
    mutationFn: async (/* params */) => {
      // TODO: branchAPI.create() 호출
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
    }
  })

  // ============================================================================
  // Helper Functions
  // ============================================================================

  // TODO: [P02A-03] 지점 수정 : 헬퍼 함수
  const updateBranch = async (/* params */) => {
    // TODO: updateBranchMutation.mutateAsync() 호출
    throw new Error('Not implemented')
  }

  // TODO: [P02A-04] 지점 등록 : 헬퍼 함수
  const createBranch = async (/* params */) => {
    // TODO: createBranchMutation.mutateAsync() 호출
    throw new Error('Not implemented')
  }

  // ============================================================================
  // Computed States
  // ============================================================================

  const isLoading = computed(
    () => updateBranchMutation.isPending.value || createBranchMutation.isPending.value
  )

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // Mutations
    updateBranchMutation,
    createBranchMutation,

    // Helper Functions
    updateBranch,
    createBranch,

    // Computed States
    isLoading
  }
}
