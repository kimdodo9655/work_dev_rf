/**
 * 문서 경로: `@/src/composables/utils/useCodeReplacer.ts`
 * 문서 제목: 컴포저블 유틸: use-code-replacer
 */

import {
  findOriginalCode,
  findReplacement,
  formatCodeLabel,
  formatTextLabel,
  initializeCodeFormatter,
  replaceText,
  setCodeDebugEnabled,
  showCodeDebug,
  toggleCodeDebug
} from '@/utils/codeFormatter'

export const useCodeReplacer = () => {
  initializeCodeFormatter()

  return {
    findReplacement,
    findOriginalCode,
    formatCodeLabel,
    formatTextLabel,
    replaceText,
    setCodeDebugEnabled,
    showCodeDebug,
    toggleCodeDebug
  }
}
