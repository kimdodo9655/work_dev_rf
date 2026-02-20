// --------------------------------------------------
// [R02G] 권리증
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetDetailedPropertyOwnerCertificateParams,
  GetDetailedPropertyOwnerCertificateResponse,
  ReplaceApplicationPropertyOwnerCertificateParams,
  ReplaceApplicationPropertyOwnerCertificateRequest,
  ReplaceApplicationPropertyOwnerCertificateResponse
} from '@/types'

export const registryCertificateAPI = {
  async getDetail(params: GetDetailedPropertyOwnerCertificateParams) {
    // --------------------------------------------------
    // [R02G-01][GET - /api/registry/applications/{applicationId}/certificates] 등기권리증 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDetailedPropertyOwnerCertificateResponse>(
      API.REGISTRY_CERTIFICATE.DETAIL(params.applicationId)
    )
  },

  async replace(
    params: ReplaceApplicationPropertyOwnerCertificateParams,
    data: ReplaceApplicationPropertyOwnerCertificateRequest
  ) {
    // --------------------------------------------------
    // [R02G-02][PUT - /api/registry/applications/{applicationId}/certificates] 등기권리증 대체
    // --------------------------------------------------
    return apiHelpers.put<ReplaceApplicationPropertyOwnerCertificateResponse>(
      API.REGISTRY_CERTIFICATE.REPLACE(params.applicationId),
      data
    )
  }
}
