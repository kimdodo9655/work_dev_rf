/**
 * 문서 경로: `@/src/composables/utils/useApiAlert.ts`
 * 문서 제목: use Api Alert 구현 파일
 */

import type { AxiosError } from 'axios'

import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { useDialog } from '@/composables/utils/useDialog'

interface ApiAlertOptions {
  title?: string
  message?: string
}

interface ApiErrorPayload {
  code?: string
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

  const extractApiErrorMessage = (error: unknown, fallback = DEFAULT_ERROR_MESSAGE) => {
    const axiosError = error as AxiosError<ApiErrorPayload>
    const payload = axiosError.response?.data
    const fromCode = findReplacement(payload?.code, 'errorCodes')
    if (fromCode) return fromCode

    const fromMessage = findReplacement(payload?.message, 'errorCodes')
    if (fromMessage) return fromMessage

    const fromTitle = findReplacement(payload?.title, 'errorCodes')
    if (fromTitle) return fromTitle

    const payloadMessage = replaceText(payload?.message)
    if (payloadMessage) return payloadMessage

    const axiosMessage = replaceText(axiosError.message)
    if (axiosMessage) return axiosMessage

    return replaceText(fallback)
  }

  return {
    showApiSuccess,
    showApiError,
    extractApiErrorMessage
  }
}
