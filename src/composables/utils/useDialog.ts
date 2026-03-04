/**
 * 문서 경로: `@/src/composables/utils/useDialog.ts`
 * 문서 제목: 컴포저블 유틸: use-dialog
 */

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

const normalizeAlertOptions = (options: AlertOptions): AlertOptions => {
  const message = options.message ?? options.content ?? ''
  return {
    ...options,
    message,
    content: message
  }
}

const normalizeConfirmOptions = (options: ConfirmOptions): ConfirmOptions => {
  const message = options.message ?? options.content ?? ''
  return {
    ...options,
    message,
    content: message
  }
}

function scheduleCleanup(expectedResolve?: DialogState['resolve']) {
  setTimeout(() => {
    // 이전 다이얼로그의 지연 cleanup이 새 다이얼로그 상태를 덮어쓰지 않도록 보호
    if (state.resolve !== expectedResolve || state.isOpen) return
    state.type = null
    state.options = null
    state.resolve = undefined
  }, 200)
}

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
      state.options = normalizeAlertOptions(options)
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
      state.options = normalizeConfirmOptions(options)
      state.resolve = resolve
    })
  }

  /**
   * 다이얼로그 닫기
   */
  const close = () => {
    const currentResolve = state.resolve
    state.isOpen = false
    if (state.resolve) {
      state.resolve(false)
    }
    scheduleCleanup(currentResolve)
  }

  /**
   * 확인 버튼 핸들러
   */
  const handleConfirm = async () => {
    const currentResolve = state.resolve
    const options = state.options as AlertOptions | ConfirmOptions

    if (options?.onConfirm) {
      await options.onConfirm()
    }

    if (state.resolve) {
      state.resolve(true)
    }

    state.isOpen = false
    scheduleCleanup(currentResolve)
  }

  /**
   * 취소 버튼 핸들러
   */
  const handleCancel = async () => {
    const currentResolve = state.resolve
    const options = state.options as ConfirmOptions

    if (options?.onCancel) {
      await options.onCancel()
    }

    if (state.resolve) {
      state.resolve(false)
    }

    state.isOpen = false
    scheduleCleanup(currentResolve)
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
