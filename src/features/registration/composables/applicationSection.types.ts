/**
 * 문서 경로: `@/src/features/registration/composables/applicationSection.types.ts`
 * 문서 제목: 기능 모듈: application-section-types
 */

import type { RegistryApplicationDocumentResponse, RegistryApplicationFormResponse } from '@/types'

// feature 내부에서는 API 응답 타입을 그대로 재export해 의존 경로를 한 곳으로 모은다.
export type RegistryApplicationForm = RegistryApplicationFormResponse
export type RegistryApplicationDocument = RegistryApplicationDocumentResponse
