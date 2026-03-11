/**
 * 문서 경로: `@/src/composables/api/useBranch.ts`
 * 문서 제목: 컴포저블 API: use-branch
 */

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

  /**
   * 지점 수정 Mutation
   * API: PATCH /api/branches/:branchId
   */
  const updateBranchMutation = useMutation({
    mutationFn: async (/* params */) => {
      // TODO: [P02A-03] branchAPI.update() 연결
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
    }
  })

  /**
   * 지점 등록 Mutation
   * API: POST /api/branches
   */
  const createBranchMutation = useMutation({
    mutationFn: async (/* params */) => {
      // TODO: [P02A-04] branchAPI.create() 연결
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
    }
  })

  // ============================================================================
  // Helper Functions
  // ============================================================================

  const updateBranch = async (/* params */) => {
    // TODO: [P02A-03] updateBranchMutation.mutateAsync() 연결
    throw new Error('Not implemented')
  }

  const createBranch = async (/* params */) => {
    // TODO: [P02A-04] createBranchMutation.mutateAsync() 연결
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
