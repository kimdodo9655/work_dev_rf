// --------------------------------------------------
// [R02A] 대시보드
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  SearchEstimateSummaryQuery,
  SearchEstimateSummaryResponse,
  SearchRegistryProgressStatisticsQuery,
  SearchRegistryProgressStatisticsResponse,
  SearchRegistryProgressSummaryQuery,
  SearchRegistryProgressSummaryResponse,
  SearchRegistryProgressTodayQuery,
  SearchRegistryProgressTodayResponse
} from '@/types'

export const registryDashboardAPI = {
  async summary(query: SearchRegistryProgressSummaryQuery) {
    // --------------------------------------------------
    // [R02A-01][GET - /api/registry/progress/summary] 나의 진행현황 조회
    // --------------------------------------------------
    return apiHelpers.get<SearchRegistryProgressSummaryResponse>(
      API.REGISTRY_DASHBOARD.SUMMARY,
      query
    )
  },

  async today(query: SearchRegistryProgressTodayQuery) {
    // --------------------------------------------------
    // [R02A-02][GET - /api/registry/progress/today] 오늘의 접수사건 조회
    // --------------------------------------------------
    return apiHelpers.get<SearchRegistryProgressTodayResponse>(API.REGISTRY_DASHBOARD.TODAY, query)
  },

  async summary2(query: SearchEstimateSummaryQuery) {
    // --------------------------------------------------
    // [R02A-03][GET - /api/registry/progress/estimates/summary] 견적현황 요약 조회
    // --------------------------------------------------
    return apiHelpers.get<SearchEstimateSummaryResponse>(API.REGISTRY_DASHBOARD.SUMMARY_2, query)
  },

  async statistics(query: SearchRegistryProgressStatisticsQuery) {
    // --------------------------------------------------
    // [R02A-04][GET - /api/registry/progress/case-processing-status] 사건처리 현황 조회
    // --------------------------------------------------
    return apiHelpers.get<SearchRegistryProgressStatisticsResponse>(
      API.REGISTRY_DASHBOARD.CASE_PROCESSING_STATUS,
      query
    )
  }
}
