/**
 * 문서 경로: `@/src/api/services/registry/schedule.ts`
 * 문서 제목: schedule 구현 파일
 */

// --------------------------------------------------
// [R03] 일정
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetRegistryProgressSchedulesQuery,
  GetRegistryProgressSchedulesResponse
} from '@/types'

export const registryScheduleAPI = {
  async getList(query: GetRegistryProgressSchedulesQuery) {
    // --------------------------------------------------
    // [R03-01][GET - /api/registry/progress/schedules] 등기일정 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetRegistryProgressSchedulesResponse>(API.REGISTRY_SCHEDULE.LIST, query)
  }
}
