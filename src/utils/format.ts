/**
 * 문서 경로: `@/src/utils/format.ts`
 * 문서 제목: 유틸리티 모듈: format
 */

type MessageParams = Record<string, string | number>

/**
 * 메시지 템플릿에 변수 치환
 * @param template - 메시지 템플릿 (예: "전체 {count}건")
 * @param params - 치환할 변수들 (예: { count: 150 })
 * @returns 치환된 메시지
 */
export const formatMessage = (template: string, params?: MessageParams): string => {
  if (!params) return template

  return template.replace(/{(\w+)}/g, (match, key) => {
    const value = params[key]
    return value !== undefined ? String(value) : match
  })
}

/**
 * 숫자를 천 단위 콤마로 포맷
 * @param num - 숫자
 * @returns 포맷된 문자열 (예: "1,234,567")
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR')
}

/**
 * 금액을 원화로 포맷
 * @param amount - 금액
 * @returns 포맷된 문자열 (예: "1,234,567원")
 */
export const formatCurrency = (amount: number): string => {
  return `${formatNumber(amount)}원`
}

/**
 * 날짜를 한국어 형식으로 포맷
 * @param date - Date 객체
 * @param format - 'short' | 'long' | 'time'
 * @returns 포맷된 날짜 문자열
 */
export const formatDate = (date: Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  switch (format) {
    case 'short':
      // 2024.12.23
      return date
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        .replace(/\. /g, '.')
        .replace(/\.$/, '')

    case 'long':
      // 2024년 12월 23일 (월)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      })

    case 'time':
      // 2024.12.23 14:30
      return `${formatDate(date, 'short')} ${date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })}`

    default:
      return date.toLocaleDateString('ko-KR')
  }
}

/**
 * 전화번호 포맷 (010-1234-5678)
 * @param phone - 전화번호 (숫자만)
 * @returns 포맷된 전화번호
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (cleaned.startsWith('02') && cleaned.length === 10) {
    return cleaned.replace(/(02)(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (cleaned.startsWith('02') && cleaned.length === 9) {
    return cleaned.replace(/(02)(\d{3})(\d{4})/, '$1-$2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  } else if (cleaned.length === 9) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return phone
}

function formatByGroups(value: string | number, groups: number[]): string {
  const cleaned = String(value).replace(/\D/g, '')
  const totalLength = groups.reduce((sum, group) => sum + group, 0)

  if (!cleaned || cleaned.length !== totalLength) {
    return String(value)
  }

  let cursor = 0
  return groups
    .map((group) => {
      const chunk = cleaned.slice(cursor, cursor + group)
      cursor += group
      return chunk
    })
    .join('-')
}

export const formatTaxNumber = (value?: string | null): string => {
  if (!value) return '-'
  return formatByGroups(value, [3, 1, 2, 6, 6, 1, 3, 6, 1])
}

export const formatElectronicPaymentNumber = (value?: string | null): string => {
  if (!value) return '-'
  return formatByGroups(value, [5, 1, 2, 2, 1, 7, 1])
}

export const formatHousingBondNumber = (value?: string | null): string => {
  if (!value) return '-'
  return formatByGroups(value, [4, 2, 4, 4])
}

export const formatPropertyUniqueNumber = (value?: string | null): string => {
  if (!value) return '-'
  return formatByGroups(value, [4, 4, 6])
}

export const formatWonAmount = (value?: string | number | null): string => {
  if (value === null || value === undefined || value === '') return '-'

  const numeric = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.-]/g, ''))

  if (!Number.isFinite(numeric)) {
    return String(value)
  }

  return `${numeric.toLocaleString('ko-KR')}원`
}

/**
 * 파일 크기 포맷 (1024 -> "1KB")
 * @param bytes - 바이트 크기
 * @returns 포맷된 크기
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * 퍼센트 포맷 (0.5 -> "50%")
 * @param value - 0~1 사이 값
 * @param decimals - 소수점 자리수
 * @returns 포맷된 퍼센트
 */
export const formatPercent = (value: number, decimals: number = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * ISO 날짜/시간 문자열을 YYYY-MM-DD HH:mm:ss 형식으로 포맷
 * @param value - ISO 날짜/시간 문자열
 * @returns 포맷된 문자열 또는 원본 값
 */
export const formatDateTimeSeconds = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return value

  const match = trimmed.match(
    /^(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2}:\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/
  )

  if (match) {
    return `${match[1]} ${match[2]}`
  }

  return value
}
