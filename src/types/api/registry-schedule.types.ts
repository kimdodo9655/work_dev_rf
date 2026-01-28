/**
 * REGISTRY_SCHEDULE API Types
 * @generated 2025-01-27
 */

/**
 * R03-01
 * GET /api/registry/progress/schedules
 */
export interface GetRegistryProgressSchedulesQuery {
  /** 조회할 업무담당자 사용자ID (기본값: ALL) */
  managerUserId?: string
  /** 조회 시작일(yyyyMMdd) */
  startDate: string
  /** 조회 종료일(yyyyMMdd) */
  endDate: string
}

export type GetRegistryProgressSchedulesResponse = RegistryProgressSchedulesResponse

// ==================== Schemas ====================

/** 일별 일정 */
export interface DailySchedule {
  /** 날짜 */
  date?: string
  /** 해당 날짜 일정 목록 */
  items?: ScheduleItem[]
}

/** 등기 일정 관리 */
export interface RegistryProgressSchedulesResponse {
  /** 일정 목록 (날짜별) */
  schedules?: DailySchedule[]
}

/** 일정 항목 */
export interface ScheduleItem {
  /** 등기신청번호 */
  registryRequestNumber?: string
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 배정업무 */
  assignedWork?: string
}
