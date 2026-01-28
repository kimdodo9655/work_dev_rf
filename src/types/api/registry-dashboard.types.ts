/**
 * REGISTRY_DASHBOARD API Types
 * @generated 2025-01-27
 */

/**
 * R02A-01
 * GET /api/registry/progress/summary
 */
export interface SearchRegistryProgressSummaryQuery {
  /** 조회 대상 담당자 ID (전체 조회시 생략 또는 'ALL') */
  targetUserId?: string
  /** 시작일 */
  startDate: string
  /** 종료일 */
  endDate: string
}

export type SearchRegistryProgressSummaryResponse = RegistryProgressSummaryResponse

/**
 * R02A-02
 * GET /api/registry/progress/today
 */
export interface SearchRegistryProgressTodayQuery {
  /** 조회 대상 담당자 ID (전체 조회시 생략 또는 'ALL') */
  targetUserId?: string
  /** 시작일 */
  startDate: string
  /** 종료일 */
  endDate: string
}

export type SearchRegistryProgressTodayResponse = RegistryProgressTodayResponse

/**
 * R02A-03
 * GET /api/registry/progress/estimates/summary
 */
export interface SearchEstimateSummaryQuery {
  /** 조회 대상 담당자 ID (전체 조회시 생략 또는 'ALL') */
  targetUserId?: string
  /** 시작일 */
  startDate: string
  /** 종료일 */
  endDate: string
}

export type SearchEstimateSummaryResponse = RegistryEstimateSummaryResponse

/**
 * R02A-04
 * GET /api/registry/progress/statistics
 */
export interface SearchRegistryProgressStatisticsQuery {
  /** 조회 대상 담당자 ID (전체 조회시 생략 또는 'ALL') */
  targetUserId?: string
  /** 시작일 */
  startDate: string
  /** 종료일 */
  endDate: string
}

export type SearchRegistryProgressStatisticsResponse = RegistryProgressStatisticsResponse

// ==================== Schemas ====================

/** 진행 상태별 건수 */
export interface ProgressStatusCount {
  /** 상태 코드 */
  statusCode?: string
  /** 상태명 */
  statusName?: string
  /** 건수 */
  count?: number
}

/** 견적 현황 요약 */
export interface RegistryEstimateSummaryResponse {
  /** 견적 요청 건수 */
  requestCount?: number
  /** 견적 작성 건수 */
  writtenCount?: number
  /** 견적 수임(선정) 건수 */
  awardedCount?: number
}

/** 나의 등기 진행 현황 */
export interface RegistryProgressStatisticsResponse {
  /** 진행 상태별 통계 목록 */
  statusCounts?: ProgressStatusCount[]
}

/** 나의 등기 진행 현황 */
export interface RegistryProgressSummaryResponse {
  /** 업무 배정 건수 */
  assignedCount?: number
  /** 업무 진행 건수 */
  inProgressCount?: number
  /** 완료/취소 건수 */
  completedCount?: number
}

/** 오늘의 접수 사건 */
export interface RegistryProgressTodayResponse {
  /** 접수일자 */
  registryReceiptDate?: string
  /** 유저명 */
  userName?: string
  /** 등기관리번호 */
  registryManagementNumber?: string
}
