// utils/validators.ts

export interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// ============================================
// 기본 검증 함수들
// ============================================

export const required = (message = '필수 입력 항목입니다'): ValidationRule => ({
  validate: (value: any) => {
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined
  },
  message
})

export const minLength = (min: number, message?: string): ValidationRule => ({
  validate: (value: string) => value.length >= min,
  message: message || `최소 ${min}자 이상 입력해주세요`
})

export const maxLength = (max: number, message?: string): ValidationRule => ({
  validate: (value: string) => value.length <= max,
  message: message || `최대 ${max}자까지 입력 가능합니다`
})

export const email = (message = '올바른 이메일 형식이 아닙니다'): ValidationRule => ({
  validate: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },
  message
})

export const phone = (message = '올바른 전화번호 형식이 아닙니다'): ValidationRule => ({
  validate: (value: string) => {
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
    return phoneRegex.test(value.replace(/\s/g, ''))
  },
  message
})

export const number = (message = '숫자만 입력 가능합니다'): ValidationRule => ({
  validate: (value: string) => /^\d+$/.test(value),
  message
})

export const pattern = (regex: RegExp, message: string): ValidationRule => ({
  validate: (value: string) => regex.test(value),
  message
})

export const min = (minValue: number, message?: string): ValidationRule => ({
  validate: (value: number | string) => Number(value) >= minValue,
  message: message || `${minValue} 이상의 값을 입력해주세요`
})

export const max = (maxValue: number, message?: string): ValidationRule => ({
  validate: (value: number | string) => Number(value) <= maxValue,
  message: message || `${maxValue} 이하의 값을 입력해주세요`
})

export const range = (minValue: number, maxValue: number, message?: string): ValidationRule => ({
  validate: (value: number | string) => {
    const num = Number(value)
    return num >= minValue && num <= maxValue
  },
  message: message || `${minValue}~${maxValue} 사이의 값을 입력해주세요`
})

// ============================================
// 한국 특화 검증
// ============================================

export const koreanName = (message = '올바른 한글 이름을 입력해주세요'): ValidationRule => ({
  validate: (value: string) => /^[가-힣]{2,10}$/.test(value),
  message
})

export const businessNumber = (message = '올바른 사업자번호가 아닙니다'): ValidationRule => ({
  validate: (value: string) => {
    const num = value.replace(/[^0-9]/g, '')
    if (num.length !== 10) return false

    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5] as const
    let sum = 0

    for (let i = 0; i < 9; i++) {
      const weight = weights[i]
      if (weight === undefined) continue
      sum += Number(num[i]) * weight
    }

    sum += Math.floor((Number(num[8]) * 5) / 10)
    const checkDigit = (10 - (sum % 10)) % 10

    return checkDigit === Number(num[9])
  },
  message
})

export const residentNumber = (message = '올바른 주민등록번호가 아닙니다'): ValidationRule => ({
  validate: (value: string) => {
    const num = value.replace(/[^0-9]/g, '')
    if (num.length !== 13) return false

    const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5] as const
    let sum = 0

    for (let i = 0; i < 12; i++) {
      const weight = weights[i]
      if (weight === undefined) continue
      sum += Number(num[i]) * weight
    }

    const checkDigit = (11 - (sum % 11)) % 10
    return checkDigit === Number(num[12])
  },
  message
})

// ============================================
// 비밀번호 검증
// ============================================

export const password = {
  basic: (message = '8자 이상 입력해주세요'): ValidationRule => ({
    validate: (value: string) => value.length >= 8,
    message
  }),

  strong: (message = '8자 이상, 영문/숫자/특수문자 포함'): ValidationRule => ({
    validate: (value: string) => {
      const hasLength = value.length >= 8
      const hasLetter = /[a-zA-Z]/.test(value)
      const hasNumber = /\d/.test(value)
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)
      return hasLength && hasLetter && hasNumber && hasSpecial
    },
    message
  }),

  match: (target: string, message = '비밀번호가 일치하지 않습니다'): ValidationRule => ({
    validate: (value: string) => value === target,
    message
  })
}

// ============================================
// URL 검증
// ============================================

export const url = (message = '올바른 URL 형식이 아닙니다'): ValidationRule => ({
  validate: (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },
  message
})

// ============================================
// 커스텀 검증
// ============================================

export const custom = (validatorFn: (value: any) => boolean, message: string): ValidationRule => ({
  validate: validatorFn,
  message
})

// ============================================
// 검증 실행 함수
// ============================================

export const validate = (value: any, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = []

  for (const rule of rules) {
    if (!rule.validate(value)) {
      errors.push(rule.message)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateAsync = async (
  value: any,
  rules: ValidationRule[]
): Promise<ValidationResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(validate(value, rules))
    }, 0)
  })
}
