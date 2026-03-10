/**
 * 문서 경로: `@/src/features/registration/composables/applicationSection.types.ts`
 * 문서 제목: 기능 모듈: application-section-types
 */

export interface RegistryApplicationForm {
  applicationId?: number
  registryManagementNumber?: string
  dataSource?: 'REQUEST' | 'MANUAL'
  registryType?: string
  registryRole?: 'MAIN' | 'LINKED' | string
}

export interface RegistryApplicationDocument {
  applicationId?: number
  registryManagementNumber?: string
  registryType?: string
  registryCause?: string
  registryMethod?: string
  adminInfoLinkTime?: string
  sections?: Array<{
    code?: string
    title?: string
  }>
}
