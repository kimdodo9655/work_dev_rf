/**
 * 문서 경로: `@/src/types/vue-globals.d.ts`
 * 문서 제목: 타입 정의: vue-globals
 */

import type { Ref } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $codeLabel: (raw: unknown, category?: string) => string
    $textLabel: (raw: unknown, category?: string) => string
    $replaceText: (raw: unknown, category?: string) => string
    $findReplacement: (raw: unknown, category?: string) => string | undefined
    $findOriginalCode: (label: unknown, category?: string) => string | undefined
    $showCodeDebug: Ref<boolean>
    $setCodeDebugEnabled: (enabled: boolean) => void
    $toggleCodeDebug: () => void
  }
}

export {}
