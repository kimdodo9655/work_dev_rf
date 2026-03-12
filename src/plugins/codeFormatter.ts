/**
 * 문서 경로: `@/src/plugins/codeFormatter.ts`
 * 문서 제목: 플러그인 모듈: code-formatter
 */

import type { App } from 'vue'

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

export function setupCodeFormatter(app: App) {
  initializeCodeFormatter()

  app.config.globalProperties.$codeLabel = formatCodeLabel
  app.config.globalProperties.$textLabel = formatTextLabel
  app.config.globalProperties.$replaceText = replaceText
  app.config.globalProperties.$findReplacement = findReplacement
  app.config.globalProperties.$findOriginalCode = findOriginalCode
  app.config.globalProperties.$showCodeDebug = showCodeDebug
  app.config.globalProperties.$setCodeDebugEnabled = setCodeDebugEnabled
  app.config.globalProperties.$toggleCodeDebug = toggleCodeDebug
}
