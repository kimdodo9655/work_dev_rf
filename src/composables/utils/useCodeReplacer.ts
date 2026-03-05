/**
 * 문서 경로: `@/src/composables/utils/useCodeReplacer.ts`
 * 문서 제목: 컴포저블 유틸: use-code-replacer
 */

import replacementsJson from '@/constants/code-replacements.generated.json'

type ReplacementCategoryMap = Record<string, string>
type ReplacementDocument = Record<string, ReplacementCategoryMap>

const replacements = replacementsJson as ReplacementDocument

const globalReplacementMap = new Map<string, string>()
const globalReverseReplacementMap = new Map<string, string>()
const categoryReverseMaps = new Map<string, Map<string, string>>()

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

export const useCodeReplacer = () => {
  const findInCategory = (category: string, key: string): string | undefined => {
    const categoryMap = replacements[category]
    if (!categoryMap) return undefined
    return categoryMap[key]
  }

  const findReplacement = (raw: unknown, category?: string): string | undefined => {
    if (typeof raw !== 'string') return undefined

    const value = raw.trim()
    if (!value) return undefined

    if (category) {
      const fromCategory = findInCategory(category, value)
      if (fromCategory) return fromCategory
    }

    return globalReplacementMap.get(value)
  }

  const replaceText = (raw: unknown, category?: string): string => {
    if (typeof raw !== 'string') return ''
    return findReplacement(raw, category) ?? raw
  }

  const findOriginalCode = (label: unknown, category?: string): string | undefined => {
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

  return {
    findReplacement,
    findOriginalCode,
    replaceText
  }
}
