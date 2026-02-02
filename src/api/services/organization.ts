// --------------------------------------------------
// [P01] 기관
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  CheckRegistrationNumberQuery,
  GetOrganizationOptionsResponse,
  GetOrganizationParams
} from '@/types'

export const organizationAPI = {
  async getDetail(params: GetOrganizationParams) {
    // --------------------------------------------------
    // [P01-01][GET - /api/organizations/{organizationId}] 기관 상세 조회
    // --------------------------------------------------
    return apiHelpers.get(API.ORGANIZATION.DETAIL(params.organizationId))
  },

  async getOptions() {
    // --------------------------------------------------
    // [P01-02][GET - /api/organizations/options] 기관 옵션 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetOrganizationOptionsResponse>(API.ORGANIZATION.OPTIONS)
  },

  async checkRegistrationNumber(query: CheckRegistrationNumberQuery) {
    // --------------------------------------------------
    // [P01-03][GET - /api/organizations/check-registration-number] 법인등록번호 중복 체크
    // --------------------------------------------------
    return apiHelpers.get(API.ORGANIZATION.CHECK_REGISTRATION_NUMBER, query)
  }
}
