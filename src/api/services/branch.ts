// --------------------------------------------------
// [P02A] 지점-기본
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  CheckBusinessNumberQuery,
  CheckBusinessNumberResponse,
  CreateBranchRequest,
  CreateBranchResponse,
  GetBranchOptionsQuery,
  GetBranchOptionsResponse,
  GetBranchParams,
  GetBranchResponse,
  SearchBranchesQuery,
  SearchBranchesResponse,
  UpdateBranchParams,
  UpdateBranchRequest,
  UpdateBranchResponse
} from '@/types'

export const branchAPI = {
  async search(query: SearchBranchesQuery) {
    // --------------------------------------------------
    // [P02A-01][GET - /api/branches/search] 지점 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<SearchBranchesResponse>(API.BRANCH.SEARCH, query)
  },

  async getDetail(params: GetBranchParams) {
    // --------------------------------------------------
    // [P02A-02][GET - /api/branches/{branchId}] 지점 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetBranchResponse>(API.BRANCH.DETAIL(params.branchId))
  },

  async update(params: UpdateBranchParams, data: UpdateBranchRequest) {
    // --------------------------------------------------
    // [P02A-03][PATCH - /api/branches/{branchId}] 지점 수정
    // --------------------------------------------------
    return apiHelpers.patch<UpdateBranchResponse>(API.BRANCH.UPDATE(params.branchId), data)
  },

  async create(data: CreateBranchRequest) {
    // --------------------------------------------------
    // [P02A-04][POST - /api/branches] 지점 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateBranchResponse>(API.BRANCH.CREATE, data)
  },

  async getOptions(query: GetBranchOptionsQuery) {
    // --------------------------------------------------
    // [P02A-05][GET - /api/branches/options] 지점 옵션 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetBranchOptionsResponse>(API.BRANCH.OPTIONS, query)
  },

  async checkBusinessNumber(query: CheckBusinessNumberQuery) {
    // --------------------------------------------------
    // [P02A-06][GET - /api/branches/check-business-number] 사업자등록번호 중복 체크
    // --------------------------------------------------
    return apiHelpers.get<CheckBusinessNumberResponse>(API.BRANCH.CHECK_BUSINESS_NUMBER, query)
  }
}
