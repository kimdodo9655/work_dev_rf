/**
 * 등기 견적 관련 타입 정의
 * @file src/types/domains/registry/estimate.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 * 최종 수정: 2025-01-26
 */

/**
 * 등기 진행 방식
 * Schema: RegistryMethod (Enum)
 */
export type RegistryMethod = 'ELECTRONIC' | 'E_FORM' | 'PAPER'

/**
 * 채권자 정보
 * Schema: ObligeeInfo
 * API: [R01-02] GET /api/registry/estimates/requests/{registryRequestNumber}/info
 */
export interface ObligeeInfo {
  /** 채권자명 */
  name: string
  /** 주소 */
  address?: string
  /** 주민등록번호/사업자등록번호 */
  registrationNumber?: string
}

/**
 * 채무자 정보
 * Schema: ObligorInfo
 */
export interface ObligorInfo {
  /** 채무자명 */
  name: string
  /** 주소 */
  address?: string
  /** 주민등록번호/사업자등록번호 */
  registrationNumber?: string
}

/**
 * 부동산 정보
 * Schema: PropertyInfo
 */
export interface PropertyInfo {
  /** 부동산 주소 */
  address: string
  /** 필지 수 */
  plotCount: number
  /** 매매금액 */
  tradeAmount?: number
}

/**
 * 등기 정보
 * Schema: RegistryInfo
 */
export interface RegistryInfo {
  /** 등기 유형 */
  registryType: string
  /** 등기 원인 */
  registryCause?: string
  /** 등기 원인 일자 */
  causeDate?: string
}

/**
 * 법무대리인 정보
 * Schema: LegalAgentInfo
 * API: [R01-03] GET /api/registry/estimates/{estimateId}/details
 */
export interface LegalAgentInfo {
  /** 법무사명 */
  name: string
  /** 견적서 작성자 이름 (변경: qualifiedName → estimatorName) */
  estimatorName: string
  /** 사무소명 */
  officeName: string
  /** 사무소 주소 */
  officeAddress: string
  /** 법무대리인 지점 주소 (변경: branchPhone → branchAddress) */
  branchAddress: string
  /** 전화번호 */
  phone: string
  /** 등록번호 */
  registrationNumber: string
}

/**
 * 보수료 상세
 * Schema: FeeDetails
 */
export interface FeeDetails {
  /** 기본 보수 */
  baseFee: number
  /** 가산 보수 */
  additionalFee: number
  /** 부가가치세 */
  vat: number
  /** 실비변상 (교통비/숙박비/일당) */
  actualCost: number
  /** 등기원인증서 작성 비용 */
  registryCauseDocumentFee: number
  /** 확인서면 비용 */
  confirmationDocumentFee: number
  /** 제증명 비용 */
  certificateFee: number
  /** 등기신청수수료 */
  registryApplicationFee: number
  /** 공과금 신고/납부 대행 비용 */
  taxPaymentAgencyFee: number
  /** 검인/부동산거래신고 대행 비용 */
  inspectionTradeReportAgencyFee: number
  /** 국민주택채권 즉시매도 대행 비용 */
  bondSaleAgencyFee: number
  /** 기타 비용 */
  otherFee: number
  /** 보수료 합계 */
  totalFee: number
}

/**
 * 공과금 상세
 * Schema: PublicChargeDetails
 */
export interface PublicChargeDetails {
  /** 취득세 */
  acquisitionTax: number
  /** 등록면허세 */
  registrationLicenseTax: number
  /** 교육세 */
  educationTax: number
  /** 농어촌특별세 */
  ruralSpecialTax: number
  /** 인지세 */
  stampTax: number
  /** 공과금 합계 */
  totalTax: number
}

/**
 * 견적 기본 정보 응답
 * Schema: EstimateInfoResponse
 * API: [R01-02] GET /api/registry/estimates/requests/{registryRequestNumber}/info
 */
export interface EstimateInfo {
  /** 견적서 ID */
  estimateId: number
  /** 등기신청번호 */
  registryRequestNumber: string
  /** 기관 ID */
  organizationId: number
  /** 지점 ID */
  branchId: number
  /** 등기 정보 */
  registryInfo: RegistryInfo
  /** 부동산 정보 */
  propertyInfo: PropertyInfo
  /** 채권자 정보 */
  obligeeInfo: ObligeeInfo
  /** 채무자 정보 */
  obligorInfo: ObligorInfo
  /** 생성일시 */
  createdAt: string
  /** 수정일시 */
  updatedAt: string
  /** 선정 일시 */
  selectedAt?: string
}

/**
 * 견적 목록 아이템
 * Schema: EstimateListItemResponse
 * API: [R01-01] GET /api/registry/estimates
 */
export interface EstimateListItem {
  /** 견적서 ID (작성 완료된 경우) */
  estimateId?: number
  /** 등기신청번호 */
  registryRequestNumber: string
  /** 등기 유형 */
  registryType: string
  /** 부동산 주소 */
  propertyAddress: string
  /** 필지 수 */
  plotCount: number
  /** 매매금액 */
  tradeAmount?: number
  /** 등기의뢰일자 */
  requestDate: string
  /** 등기접수일자 */
  receiptDate?: string
  /** 진행상태 */
  progressStatus: string
  /** 작성여부 */
  writingStatus: string
  /** 선정여부 */
  selectionStatus: string
  /** 생성일시 */
  createdAt: string
}

/**
 * 견적서 상세 응답
 * Schema: EstimateDetailResponse
 * API: [R01-03] GET /api/registry/estimates/{estimateId}/details
 */
export interface EstimateDetail {
  /** 견적서 ID */
  estimateId: number
  /** 등기신청번호 */
  registryRequestNumber: string
  /** 기관 ID */
  organizationId: number
  /** 지점 ID */
  branchId: number
  /** 견적서 작성자 사용자 ID */
  estimatorUserId: number
  /** 등기 진행 방식 (ELECTRONIC: 전자, E_FORM: 전자서식, PAPER: 서면) */
  registryMethod: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  /** 법무대리인 정보 */
  legalAgentInfo: LegalAgentInfo
  /** 보수료 상세 */
  feeDetails: FeeDetails
  /** 공과금 상세 */
  publicChargeDetails: PublicChargeDetails
  /** 생성일시 */
  createdAt: string
  /** 수정일시 */
  updatedAt: string
  /** 선정 일시 */
  selectedAt?: string
}

/**
 * 견적서 제출 요청
 * Schema: EstimateSubmitRequest
 * API: [R01-04] POST /api/registry/estimates/requests/{registryRequestNumber}/submit
 */
export interface EstimateSubmitRequest {
  /** 등기 진행 방식 (ELECTRONIC: 전자, E_FORM: 전자서식, PAPER: 서면) */
  registryMethod: 'ELECTRONIC' | 'E_FORM' | 'PAPER'

  // 보수료
  /** 기본 보수 */
  baseFee: number
  /** 가산 보수 */
  additionalFee: number
  /** 부가가치세 */
  vat: number
  /** 실비변상 (교통비/숙박비/일당) */
  actualCost: number
  /** 등기원인증서 작성 비용 */
  registryCauseDocumentFee: number
  /** 확인서면 비용 */
  confirmationDocumentFee: number
  /** 제증명 비용 */
  certificateFee: number
  /** 등기신청수수료 */
  registryApplicationFee: number
  /** 공과금 신고/납부 대행 비용 */
  taxPaymentAgencyFee: number
  /** 검인/부동산거래신고 대행 비용 */
  inspectionTradeReportAgencyFee: number
  /** 국민주택채권 즉시매도 대행 비용 */
  bondSaleAgencyFee: number
  /** 기타 비용 */
  otherFee: number

  // 공과금
  /** 취득세 */
  acquisitionTax: number
  /** 등록면허세 */
  registrationLicenseTax: number
  /** 교육세 */
  educationTax: number
  /** 농어촌특별세 */
  ruralSpecialTax: number
  /** 인지세 */
  stampTax: number
}

/**
 * 견적서 제출 응답
 * Schema: EstimateSubmitResponse
 * API: [R01-04] POST /api/registry/estimates/requests/{registryRequestNumber}/submit
 */
export interface EstimateSubmitResponse {
  /** 견적서 ID */
  estimateId: number
  /** 등기신청번호 */
  registryRequestNumber: string
  /** 기관 ID */
  organizationId: number
  /** 지점 ID */
  branchId: number
  /** 등기 진행 방식 */
  registryMethod: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  /** 보수료 합계 */
  totalFee: number
  /** 공과금 합계 */
  totalTax: number
  /** 생성일시 */
  createdAt: string
}

/**
 * 견적 현황 요약
 * Schema: RegistryEstimateSummaryResponse
 * API: [R02A-03] GET /api/registry/progress/estimates/summary
 */
export interface EstimateSummary {
  /** 견적 요청 건수 */
  requestCount: number
  /** 견적 작성 건수 */
  writtenCount: number
  /** 견적 수임(선정) 건수 */
  awardedCount: number
}

/**
 * 견적 목록 조회 파라미터
 */
export interface EstimateListParams {
  /** 검색 키워드 */
  keyword?: string
  /** 진행 상태 */
  progressStatus?: string
  /** 작성 여부 */
  writingStatus?: string
  /** 선정 여부 */
  selectionStatus?: string
  /** 시작 일자 (yyyy-MM-dd) */
  startDate?: string
  /** 종료 일자 (yyyy-MM-dd) */
  endDate?: string
  /** 페이지 번호 */
  page?: number
  /** 페이지 크기 */
  size?: number
  /** 정렬 기준 */
  sort?: string
}
