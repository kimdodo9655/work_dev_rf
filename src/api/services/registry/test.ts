// --------------------------------------------------
// [R00] 테스트
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  CreateRegistryProgressTestDataQuery,
  CreateRegistryProgressTestDataResponse,
  CreateRegistryRequestTestDataQuery,
  CreateRegistryRequestTestDataResponse,
  CreateRegistryTypeComboTestDataQuery,
  CreateRegistryTypeComboTestDataResponse,
  RunGenerateMissingRegistryProgressDataSchedulerResponse,
  RunRegistryManagerAssignmentSchedulerResponse,
  RunRegistryTestDataSchedulersResponse
} from '@/types'

export const registryTestAPI = {
  async createRequest(_query: CreateRegistryRequestTestDataQuery) {
    // --------------------------------------------------
    // [R00-01][POST - /api/registry/test-data/requests] 등기의뢰 테스트 데이터 생성
    // --------------------------------------------------
    return apiHelpers.post<CreateRegistryRequestTestDataResponse>(API.REGISTRY_TEST.CREATE_REQUEST)
  },

  async createProgress(_query: CreateRegistryProgressTestDataQuery) {
    // --------------------------------------------------
    // [R00-02][POST - /api/registry/test-data/progress] 등기진행 테스트 데이터 생성
    // --------------------------------------------------
    return apiHelpers.post<CreateRegistryProgressTestDataResponse>(
      API.REGISTRY_TEST.CREATE_PROGRESS
    )
  },

  async generate() {
    // --------------------------------------------------
    // [R00-03][POST - /api/registry/test-data/scheduler/generate] 등기 테스트 데이터 스케쥴러 수동 실행
    // --------------------------------------------------
    return apiHelpers.post<RunRegistryTestDataSchedulersResponse>(API.REGISTRY_TEST.GENERATE)
  },

  async generateMissingProgress() {
    // --------------------------------------------------
    // [R00-04][POST - /api/registry/test-data/scheduler/generate-missing-progress] 누락된 등기 진행 데이터 생성 스케쥴러 수동 실행
    // --------------------------------------------------
    return apiHelpers.post<RunGenerateMissingRegistryProgressDataSchedulerResponse>(
      API.REGISTRY_TEST.GENERATE_MISSING_PROGRESS
    )
  },

  async assignManagers() {
    // --------------------------------------------------
    // [R00-05][POST - /api/registry/test-data/scheduler/assign-managers] 등기 담당자 배정 스케쥴러 수동 실행
    // --------------------------------------------------
    return apiHelpers.post<RunRegistryManagerAssignmentSchedulerResponse>(
      API.REGISTRY_TEST.ASSIGN_MANAGERS
    )
  },

  async createCombine(query: CreateRegistryTypeComboTestDataQuery) {
    // --------------------------------------------------
    // [R00-06][POST - /api/registry/test-data/combine] 진행 유형별 등기 의뢰+진행 테스트 데이터 생성
    // --------------------------------------------------
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, String(value))
    })
    return apiHelpers.post<CreateRegistryTypeComboTestDataResponse>(
      `${API.REGISTRY_TEST.CREATE_COMBINE}?${params.toString()}`
    )
  }
}
