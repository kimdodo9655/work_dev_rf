/**
 * 문서 경로: `@/src/features/registration/composables/applicationSection.types.ts`
 * 문서 제목: application Section.types 구현 파일
 */

export interface RegistryApplicationForm {
  applicationId?: number
  registryManagementNumber?: string
  dataSource?: 'REQUEST' | 'MANUAL'
  registryType?: string
  registryTypeLabel?: string
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
