/**
 * 문서 경로: `@/src/composables/utils/useCodeReplacer.ts`
 * 문서 제목: use Code Replacer 구현 파일
 */

import replacementsJson from '@/constants/code-replacements.generated.json'

type ReplacementCategoryMap = Record<string, string>
type ReplacementDocument = Record<string, ReplacementCategoryMap>

const replacements = replacementsJson as ReplacementDocument

const globalReplacementMap = new Map<string, string>()

for (const categoryMap of Object.values(replacements)) {
  for (const [key, value] of Object.entries(categoryMap)) {
    if (!key || !value) continue
    if (!globalReplacementMap.has(key)) {
      globalReplacementMap.set(key, value)
    }
  }
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

  return {
    findReplacement,
    replaceText
  }
}
