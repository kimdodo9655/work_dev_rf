/**
 * 문서 경로: `@/src/utils/codeFormatter.ts`
 * 문서 제목: 유틸리티 모듈: code-formatter
 */

import { ref } from 'vue'

import replacementsJson from '@/constants/code-replacements.generated.json'
import { ENV } from '@/utils/env'

type ReplacementCategoryMap = Record<string, string>
type ReplacementDocument = Record<string, ReplacementCategoryMap>

const replacements = replacementsJson as ReplacementDocument
const CODE_DEBUG_STORAGE_KEY = 'dev-code-replacement-debug-enabled'

const globalReplacementMap = new Map<string, string>()
const globalReverseReplacementMap = new Map<string, string>()
const categoryReverseMaps = new Map<string, Map<string, string>>()

export const showCodeDebug = ref(false)

let isDebugStateInitialized = false

function initializeMaps() {
  if (globalReplacementMap.size > 0) return

  for (const categoryMap of Object.values(replacements)) {
    for (const [key, value] of Object.entries(categoryMap)) {
      if (!key || !value) continue
      if (!globalReplacementMap.has(key)) {
        globalReplacementMap.set(key, value)
      }
      if (!globalReverseReplacementMap.has(value)) {
        globalReverseReplacementMap.set(value, key)
      }
    }
  }

  for (const [category, categoryMap] of Object.entries(replacements)) {
    const reverseMap = new Map<string, string>()
    for (const [key, value] of Object.entries(categoryMap)) {
      if (!key || !value) continue
      if (!reverseMap.has(value)) {
        reverseMap.set(value, key)
      }
    }
    categoryReverseMaps.set(category, reverseMap)
  }
}

export function initializeCodeFormatter() {
  initializeMaps()

  if (isDebugStateInitialized) return
  isDebugStateInitialized = true

  if (!ENV.IS_DEV || typeof window === 'undefined') return

  const saved = window.localStorage.getItem(CODE_DEBUG_STORAGE_KEY)
  showCodeDebug.value = saved === 'true'
}

function findInCategory(category: string, key: string): string | undefined {
  const categoryMap = replacements[category]
  if (!categoryMap) return undefined
  return categoryMap[key]
}

export function findReplacement(raw: unknown, category?: string): string | undefined {
  initializeCodeFormatter()

  if (typeof raw !== 'string') return undefined

  const value = raw.trim()
  if (!value) return undefined

  if (category) {
    const fromCategory = findInCategory(category, value)
    if (fromCategory) return fromCategory
  }

  return globalReplacementMap.get(value)
}

export function replaceText(raw: unknown, category?: string): string {
  if (typeof raw !== 'string') return ''
  return findReplacement(raw, category) ?? raw
}

export function formatTextLabel(raw: unknown, category?: string): string {
  if (raw == null) return '-'

  const original = String(raw)
  if (!original) return '-'

  return replaceText(original, category)
}

export function findOriginalCode(label: unknown, category?: string): string | undefined {
  initializeCodeFormatter()

  if (typeof label !== 'string') return undefined
  const value = label.trim()
  if (!value) return undefined

  if (category) {
    const reverseCategoryMap = categoryReverseMaps.get(category)
    const fromCategory = reverseCategoryMap?.get(value)
    if (fromCategory) return fromCategory
  }

  return globalReverseReplacementMap.get(value)
}

export function formatCodeLabel(raw: unknown, category?: string): string {
  initializeCodeFormatter()

  if (raw == null) return '-'

  const original = String(raw).trim()
  if (!original) return '-'

  const replaced = category ? findReplacement(original, category) : replaceText(original)
  if (replaced && replaced !== original) {
    return ENV.IS_DEV && showCodeDebug.value ? `${original} -> ${replaced}` : replaced
  }

  if (category) {
    const inferredCode = findOriginalCode(original, category)
    if (inferredCode) {
      return ENV.IS_DEV && showCodeDebug.value ? `${inferredCode} -> ${original}` : original
    }
  }

  return original
}

export function setCodeDebugEnabled(enabled: boolean) {
  initializeCodeFormatter()

  if (!ENV.IS_DEV) return

  showCodeDebug.value = enabled

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CODE_DEBUG_STORAGE_KEY, String(enabled))
  }
}

export function toggleCodeDebug() {
  setCodeDebugEnabled(!showCodeDebug.value)
}
