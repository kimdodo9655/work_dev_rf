/**
 * 문서 경로: `@/src/composables/utils/useApiAlert.ts`
 * 문서 제목: 컴포저블 유틸: use-api-alert
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

interface ApiDialogContent {
  title: string
  message: string
}

const DEFAULT_SUCCESS_TITLE = '요청 성공'
const DEFAULT_SUCCESS_MESSAGE = '요청이 정상 처리되었습니다.'
const DEFAULT_ERROR_TITLE = '요청 실패'
const DEFAULT_ERROR_MESSAGE = '요청 처리 중 오류가 발생했습니다.'

export const useApiAlert = () => {
  const { alert } = useDialog()
  const { findReplacement, replaceText } = useCodeReplacer()

  const toRecord = (value: unknown): Record<string, unknown> | null => {
    return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
  }

  const pickDialogContent = (
    payload: unknown,
    category: 'successCodes' | 'errorCodes',
    fallbackTitle: string,
    fallbackMessage: string
  ): ApiDialogContent => {
    const target = toRecord(payload)
    const codeMapped = findReplacement(target?.code, category)

    const title =
      codeMapped ??
      findReplacement(target?.title, category) ??
      (typeof target?.title === 'string' ? replaceText(target.title) : '') ??
      ''

    const message =
      codeMapped ??
      findReplacement(target?.message, category) ??
      (typeof target?.message === 'string' ? replaceText(target.message) : '') ??
      ''

    return {
      title: title || replaceText(fallbackTitle),
      message: message || replaceText(fallbackMessage)
    }
  }

  const extractApiSuccessContent = (
    response: unknown,
    fallbackTitle = DEFAULT_SUCCESS_TITLE,
    fallbackMessage = DEFAULT_SUCCESS_MESSAGE
  ): ApiDialogContent => {
    const root = toRecord(response)
    const candidates: unknown[] = [
      response,
      root?.data,
      toRecord(root?.data)?.data,
      root?.result,
      toRecord(root?.result)?.data
    ]

    for (const candidate of candidates) {
      const parsed = pickDialogContent(candidate, 'successCodes', '', '')
      if (parsed.title || parsed.message) {
        return {
          title: parsed.title || replaceText(fallbackTitle),
          message: parsed.message || replaceText(fallbackMessage)
        }
      }
    }

    return {
      title: replaceText(fallbackTitle),
      message: replaceText(fallbackMessage)
    }
  }

  const extractApiErrorContent = (
    error: unknown,
    fallbackTitle = DEFAULT_ERROR_TITLE,
    fallbackMessage = DEFAULT_ERROR_MESSAGE
  ): ApiDialogContent => {
    const axiosError = error as AxiosError<ApiErrorPayload>
    const payload = axiosError.response?.data
    const parsed = pickDialogContent(payload, 'errorCodes', fallbackTitle, fallbackMessage)

    if (parsed.message === replaceText(fallbackMessage)) {
      const axiosMessage = replaceText(axiosError.message)
      if (axiosMessage) {
        return {
          title: parsed.title,
          message: axiosMessage
        }
      }
    }

    return parsed
  }

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
    return extractApiErrorContent(error, DEFAULT_ERROR_TITLE, fallback).message
  }

  return {
    showApiSuccess,
    showApiError,
    extractApiErrorMessage,
    extractApiSuccessContent,
    extractApiErrorContent
  }
}
