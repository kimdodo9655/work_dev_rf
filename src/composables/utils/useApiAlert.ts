/**
 * 문서 경로: `@/src/composables/utils/useApiAlert.ts`
 * 문서 제목: 컴포저블 유틸: use-api-alert
 */

import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { useDialog } from '@/composables/utils/useDialog'
import {
  extractApiErrorDialogContent,
  extractApiErrorMessage,
  extractApiSuccessDialogContent
} from '@/utils/apiError'

interface ApiAlertOptions {
  title?: string
  message?: string
}

const DEFAULT_SUCCESS_TITLE = '요청 성공'
const DEFAULT_SUCCESS_MESSAGE = '요청이 정상 처리되었습니다.'
const DEFAULT_ERROR_TITLE = '요청 실패'
const DEFAULT_ERROR_MESSAGE = '요청 처리 중 오류가 발생했습니다.'

export const useApiAlert = () => {
  const { alert } = useDialog()
  const { findReplacement, replaceText } = useCodeReplacer()

  const extractApiSuccessContent = (
    response: unknown,
    fallbackTitle = DEFAULT_SUCCESS_TITLE,
    fallbackMessage = DEFAULT_SUCCESS_MESSAGE
  ) =>
    extractApiSuccessDialogContent(response, fallbackTitle, fallbackMessage, {
      findReplacement,
      replaceText
    })

  const extractApiErrorContent = (
    error: unknown,
    fallbackTitle = DEFAULT_ERROR_TITLE,
    fallbackMessage = DEFAULT_ERROR_MESSAGE
  ) =>
    extractApiErrorDialogContent(error, fallbackTitle, fallbackMessage, {
      findReplacement,
      replaceText
    })

  const showApiSuccess = (options: ApiAlertOptions = {}) => {
    return alert({
      title: replaceText(options.title ?? DEFAULT_SUCCESS_TITLE),
      message: replaceText(options.message ?? DEFAULT_SUCCESS_MESSAGE)
    })
  }

  const showApiError = (options: ApiAlertOptions = {}) => {
    return alert({
      title: replaceText(options.title ?? DEFAULT_ERROR_TITLE),
      message: replaceText(options.message ?? DEFAULT_ERROR_MESSAGE)
    })
  }

  const extractApiErrorMessageText = (error: unknown, fallback = DEFAULT_ERROR_MESSAGE) =>
    extractApiErrorMessage(error, fallback, {
      findReplacement,
      replaceText
    })

  return {
    showApiSuccess,
    showApiError,
    extractApiErrorMessage: extractApiErrorMessageText,
    extractApiSuccessContent,
    extractApiErrorContent
  }
}
