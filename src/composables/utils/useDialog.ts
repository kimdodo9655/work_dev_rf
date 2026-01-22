/**
 * @file useDialog.ts
 * @description 다이얼로그 관리 Composable (유틸리티)
 */

import { reactive } from 'vue'

import type { AlertOptions, ConfirmOptions, DialogState } from '@/types/dialog'

// ============================================================================
// Global State
// ============================================================================

const state = reactive<DialogState>({
  isOpen: false,
  type: null,
  options: null,
  resolve: undefined
})

// ============================================================================
// Composable
// ============================================================================

export const useDialog = () => {
  // ============================================================================
  // Dialog Functions
  // ============================================================================

  /**
   * Alert 다이얼로그 표시
   */
  const alert = (options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      state.isOpen = true
      state.type = 'alert'
      state.options = options
      state.resolve = resolve
    })
  }

  /**
   * Confirm 다이얼로그 표시
   */
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      state.isOpen = true
      state.type = 'confirm'
      state.options = options
      state.resolve = resolve
    })
  }

  /**
   * 다이얼로그 닫기
   */
  const close = () => {
    state.isOpen = false
    if (state.resolve) {
      state.resolve(false)
    }
    setTimeout(() => {
      state.type = null
      state.options = null
      state.resolve = undefined
    }, 200)
  }

  /**
   * 확인 버튼 핸들러
   */
  const handleConfirm = async () => {
    const options = state.options as AlertOptions | ConfirmOptions

    if (options?.onConfirm) {
      await options.onConfirm()
    }

    if (state.resolve) {
      state.resolve(true)
    }

    state.isOpen = false
    setTimeout(() => {
      state.type = null
      state.options = null
      state.resolve = undefined
    }, 200)
  }

  /**
   * 취소 버튼 핸들러
   */
  const handleCancel = async () => {
    const options = state.options as ConfirmOptions

    if (options?.onCancel) {
      await options.onCancel()
    }

    if (state.resolve) {
      state.resolve(false)
    }

    state.isOpen = false
    setTimeout(() => {
      state.type = null
      state.options = null
      state.resolve = undefined
    }, 200)
  }

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State
    state,

    // Dialog Functions
    alert,
    confirm,
    close,

    // Event Handlers
    handleConfirm,
    handleCancel
  }
}
