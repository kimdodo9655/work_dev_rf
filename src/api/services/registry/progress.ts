// --------------------------------------------------
// [R02B] 진행
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  ChangeRegistryProgressProcessParams,
  ChangeRegistryProgressProcessQuery,
  ChangeRegistryProgressProcessResponse,
  GetRegistryProgressBasicInfoParams,
  GetRegistryProgressBasicInfoResponse,
  GetRegistryProgressLegalAgentQuery,
  GetRegistryProgressLegalAgentResponse,
  GetRegistryProgressLoanInfoParams,
  GetRegistryProgressLoanInfoResponse,
  GetRegistryProgressMortgageParams,
  GetRegistryProgressMortgageResponse,
  GetRegistryProgressOwnershipTransferParams,
  GetRegistryProgressOwnershipTransferResponse,
  GetRegistryProgressProcessParams,
  GetRegistryProgressProcessResponse,
  PatchRegistryProgressAssignManagerParams,
  PatchRegistryProgressAssignManagerResponse,
  SearchRegistryProgresssListQuery,
  SearchRegistryProgresssListResponse
} from '@/types'

export const registryProgressAPI = {
  async getList(query: SearchRegistryProgresssListQuery) {
    // --------------------------------------------------
    // [R02B-01][GET - /api/registry/progress] 진행현황 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<SearchRegistryProgresssListResponse>(API.REGISTRY_PROGRESS.LIST, query)
  },

  async basicInfo(params: GetRegistryProgressBasicInfoParams) {
    // --------------------------------------------------
    // [R02B-02][GET - /api/registry/progress/{registryManagementNumber}/basic-info] 업무 기본 정보 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...query } = params as any
    return apiHelpers.get<GetRegistryProgressBasicInfoResponse>(
      API.REGISTRY_PROGRESS.BASIC_INFO(registryManagementNumber),
      query
    )
  },

  async assignManager(params: PatchRegistryProgressAssignManagerParams) {
    // --------------------------------------------------
    // [R02B-03][PATCH - /api/registry/progress/{registryManagementNumber}/assign-manager] 업무담당자 배정
    // --------------------------------------------------
    const { registryManagementNumber, ...data } = params as any
    return apiHelpers.patch<PatchRegistryProgressAssignManagerResponse>(
      API.REGISTRY_PROGRESS.ASSIGN_MANAGER(registryManagementNumber),
      data
    )
  },

  async loanInfo(params: GetRegistryProgressLoanInfoParams) {
    // --------------------------------------------------
    // [R02B-04][GET - /api/registry/progress/{registryManagementNumber}/loan-info] 대출 금융기관 정보 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...query } = params as any
    return apiHelpers.get<GetRegistryProgressLoanInfoResponse>(
      API.REGISTRY_PROGRESS.LOAN_INFO(registryManagementNumber),
      query
    )
  },

  async ownershipTransfer(params: GetRegistryProgressOwnershipTransferParams) {
    // --------------------------------------------------
    // [R02B-05][GET - /api/registry/progress/{registryManagementNumber}/ownership-transfer] 소유권 이전 정보 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...query } = params as any
    return apiHelpers.get<GetRegistryProgressOwnershipTransferResponse>(
      API.REGISTRY_PROGRESS.OWNERSHIP_TRANSFER(registryManagementNumber),
      query
    )
  },

  async mortgage(params: GetRegistryProgressMortgageParams) {
    // --------------------------------------------------
    // [R02B-06][GET - /api/registry/progress/{registryManagementNumber}/mortgage] 근저당권 설정 정보 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...query } = params as any
    return apiHelpers.get<GetRegistryProgressMortgageResponse>(
      API.REGISTRY_PROGRESS.MORTGAGE(registryManagementNumber),
      query
    )
  },

  async legalAgent(query: GetRegistryProgressLegalAgentQuery) {
    // --------------------------------------------------
    // [R02B-07][GET - /api/registry/progress/{registryManagementNumber}/legal-agent] 법무대리인 정보 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...params } = query as any
    return apiHelpers.get<GetRegistryProgressLegalAgentResponse>(
      API.REGISTRY_PROGRESS.LEGAL_AGENT(registryManagementNumber),
      params
    )
  },

  async process(params: GetRegistryProgressProcessParams) {
    // --------------------------------------------------
    // [R02B-08][GET - /api/registry/progress/{registryManagementNumber}/process] 등기진행 업무 프로세스 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...query } = params as any
    return apiHelpers.get<GetRegistryProgressProcessResponse>(
      API.REGISTRY_PROGRESS.PROCESS(registryManagementNumber),
      query
    )
  },

  async changeProcess(
    params: ChangeRegistryProgressProcessParams,
    query: ChangeRegistryProgressProcessQuery
  ) {
    // --------------------------------------------------
    // [R02B-09][PATCH - /api/registry/progress/{registryManagementNumber}/process/change] 등기진행 상태 변경
    // --------------------------------------------------
    return apiHelpers.patch<ChangeRegistryProgressProcessResponse>(
      `${API.REGISTRY_PROGRESS.CHANGE_PROCESS(params.registryManagementNumber)}?newStatus=${query.newStatus}`
    )
  }
}
