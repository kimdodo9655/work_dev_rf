/**
 * @file useMessage.ts
 * @description 메시지 관리 Composable (유틸리티)
 */

import { ref } from 'vue'

// ============================================================================
// State
// ============================================================================

const message = ref<string>('')
const type = ref<'success' | 'error' | 'info' | 'warning'>('info')
const isVisible = ref(false)

// ============================================================================
// Composable
// ============================================================================

export function useMessage() {
  // ============================================================================
  // Message Functions
  // ============================================================================

  /**
   * 성공 메시지 표시
   */
  const showSuccess = (msg: string) => {
    message.value = msg
    type.value = 'success'
    isVisible.value = true
  }

  /**
   * 에러 메시지 표시
   */
  const showError = (msg: string) => {
    message.value = msg
    type.value = 'error'
    isVisible.value = true
  }

  /**
   * 정보 메시지 표시
   */
  const showInfo = (msg: string) => {
    message.value = msg
    type.value = 'info'
    isVisible.value = true
  }

  /**
   * 메시지 숨김
   */
  const hide = () => {
    isVisible.value = false
  }

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State
    message,
    type,
    isVisible,

    // Message Functions
    showSuccess,
    showError,
    showInfo,
    hide
  }
}
