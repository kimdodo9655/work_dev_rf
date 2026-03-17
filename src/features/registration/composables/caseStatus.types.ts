/**
 * 문서 경로: `@/src/features/registration/composables/caseStatus.types.ts`
 * 문서 제목: 기능 타입: case-status
 */

export type SearchOption = {
  label: string
  value: string | number
}

// 담당자 select와 배정 API 모두에서 재사용하는 최소 사용자 모델.
export type AssignableUser = {
  userId: number
  userName: string
  hasOwnershipTransfer: boolean
  hasMortgageRegistration: boolean
}

// 목록 테이블이 기대하는 표시용 행 모델.
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

// 검색 form과 API 요청 변환 로직이 공유하는 원본 필터 상태.
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
