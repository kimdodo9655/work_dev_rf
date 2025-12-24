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
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return phone
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
