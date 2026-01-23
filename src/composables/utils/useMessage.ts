/**
 * @file useMessage.ts
 * @description 메시지 및 포맷 유틸리티 Composable (유틸리티)
 */

import { ref } from 'vue'

import { MESSAGES } from '@/constants/messages'
import {
  formatCurrency,
  formatDate,
  formatFileSize,
  formatMessage,
  formatNumber,
  formatPercent,
  formatPhone
} from '@/utils/format'

type MessageParams = Record<string, string | number>

// ============================================================================
// State
// ============================================================================

const message = ref<string>('')
const type = ref<'success' | 'error' | 'info' | 'warning'>('info')
const isVisible = ref(false)

// ============================================================================
// Composable
// ============================================================================

/**
 * 메시지 및 포맷 유틸 Composable
 */
export function useMessage() {
  // ============================================================================
  // Message Functions
  // ============================================================================

  /**
   * 중첩 키로 메시지 가져오기
   * @param key - 점으로 구분된 키 (예: 'common.home')
   * @param params - 치환할 변수들
   * @returns 메시지 문자열
   *
   * @example
   * t('common.home') // '홈'
   * t('stats.total', { count: 150 }) // '전체 150건'
   */
  const t = (key: string, params?: MessageParams): string => {
    const keys = key.split('.')
    let value: any = MESSAGES

    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        console.warn(`[useMessage] 메시지를 찾을 수 없습니다: ${key}`)
        return key
      }
    }

    return formatMessage(value, params)
  }

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

    // 원본 메시지 객체 (직접 접근용)
    messages: MESSAGES,

    // Message Functions
    t,
    showSuccess,
    showError,
    showInfo,
    hide,

    // 포맷 함수들
    formatMessage,
    formatNumber,
    formatCurrency,
    formatDate,
    formatPhone,
    formatFileSize,
    formatPercent
  }
}
