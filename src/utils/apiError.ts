/**
 * 문서 경로: `@/src/utils/apiError.ts`
 * 문서 제목: 유틸리티 모듈: api-error
 */

import { findApiPayload, toRecord } from './apiPayload.ts'

export interface ApiDialogContent {
  title: string
  message: string
}

type ReplaceFns = {
  findReplacement(raw: unknown, category?: string): string | undefined
  replaceText(raw: unknown, category?: string): string
}

type ApiErrorShape = {
  message?: unknown
  response?: {
    data?: unknown
  }
}

function hasDialogPayload(candidate: unknown): candidate is {
  code?: unknown
  title?: unknown
  message?: unknown
} {
  const record = toRecord(candidate)
  if (!record) return false

  return 'code' in record || 'title' in record || 'message' in record
}

function pickDialogContent(
  payload: unknown,
  category: 'successCodes' | 'errorCodes',
  fallbackTitle: string,
  fallbackMessage: string,
  replaceFns: ReplaceFns
): ApiDialogContent {
  const target = toRecord(payload)
  const codeMapped = replaceFns.findReplacement(target?.code, category)

  const title =
    codeMapped ??
    replaceFns.findReplacement(target?.title, category) ??
    (typeof target?.title === 'string' ? replaceFns.replaceText(target.title) : '') ??
    ''

  const message =
    codeMapped ??
    replaceFns.findReplacement(target?.message, category) ??
    (typeof target?.message === 'string' ? replaceFns.replaceText(target.message) : '') ??
    ''

  return {
    title: title || replaceFns.replaceText(fallbackTitle),
    message: message || replaceFns.replaceText(fallbackMessage)
  }
}

export function extractApiSuccessDialogContent(
  response: unknown,
  fallbackTitle: string,
  fallbackMessage: string,
  replaceFns: ReplaceFns
): ApiDialogContent {
  const payload = findApiPayload(response, hasDialogPayload)
  if (payload) {
    const parsed = pickDialogContent(
      payload,
      'successCodes',
      fallbackTitle,
      fallbackMessage,
      replaceFns
    )
    return {
      title: parsed.title || replaceFns.replaceText(fallbackTitle),
      message: parsed.message || replaceFns.replaceText(fallbackMessage)
    }
  }

  return {
    title: replaceFns.replaceText(fallbackTitle),
    message: replaceFns.replaceText(fallbackMessage)
  }
}

export function extractApiErrorDialogContent(
  error: unknown,
  fallbackTitle: string,
  fallbackMessage: string,
  replaceFns: ReplaceFns
): ApiDialogContent {
  const apiError = error as ApiErrorShape
  const payload = findApiPayload(apiError.response?.data, hasDialogPayload)
  const parsed = pickDialogContent(
    payload,
    'errorCodes',
    fallbackTitle,
    fallbackMessage,
    replaceFns
  )

  if (parsed.message === replaceFns.replaceText(fallbackMessage)) {
    const directMessage =
      typeof apiError.message === 'string' ? replaceFns.replaceText(apiError.message) : ''
    if (directMessage) {
      return {
        title: parsed.title,
        message: directMessage
      }
    }
  }

  return parsed
}

export function extractApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
  replaceFns: ReplaceFns
): string {
  return extractApiErrorDialogContent(error, '요청 실패', fallbackMessage, replaceFns).message
}
