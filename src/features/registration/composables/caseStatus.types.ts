/**
 * 문서 경로: `@/src/features/registration/composables/caseStatus.types.ts`
 * 문서 제목: 기능 타입: case-status
 */

export type SearchOption = {
  label: string
  value: string | number
}

export type AssignableUser = {
  userId: string | number
  userName: string
}

export type Row = {
  rowNum: number
  registryRequestNumber: string
  registryManagementNumber: string
  workType: string
  assignedWork: string
  registryMethod: string
  propertyAddress: string | null
  registryRequestDate: string
  registryReceiptDate: string
  managerUserName: string
  progressStatus: string
}

export type CaseStatusFilters = {
  workType: string
  assignedWork: string
  registryMethod: string
  managerUserId: string
  registryRequestStartDate: string
  registryRequestEndDate: string
  registryReceiptStartDate: string
  registryReceiptEndDate: string
  progressStatus: string
  keyword: string
}
