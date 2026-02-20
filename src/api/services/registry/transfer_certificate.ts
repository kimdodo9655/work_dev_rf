// --------------------------------------------------
// [R02S] 이전말소
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetDetailedProgressCancellationCertificatesParams,
  GetDetailedProgressCancellationCertificatesResponse,
  GetProgressCancellationCertificatesParams,
  GetProgressCancellationCertificatesResponse,
  ReplaceProgressCancellationCertificatesParams,
  ReplaceProgressCancellationCertificatesResponse
} from '@/types'

export const registryTransferCertificateAPI = {
  async getList(params: GetProgressCancellationCertificatesParams) {
    // --------------------------------------------------
    // [R02S-01][GET - /api/registry/progress/{registryManagementNumber}/transfer-cancellation-certificates] 이전/말소등기권리증 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetProgressCancellationCertificatesResponse>(
      API.REGISTRY_TRANSFER_CERTIFICATE.LIST(params.registryManagementNumber)
    )
  },

  async replace(params: ReplaceProgressCancellationCertificatesParams) {
    // --------------------------------------------------
    // [R02S-02][PUT - /api/registry/progress/{registryManagementNumber}/transfer-cancellation-certificates] 이전/말소등기권리증 대체
    // --------------------------------------------------
    return apiHelpers.put<ReplaceProgressCancellationCertificatesResponse>(
      API.REGISTRY_TRANSFER_CERTIFICATE.REPLACE(params.registryManagementNumber)
    )
  },

  async getDetail(params: GetDetailedProgressCancellationCertificatesParams) {
    // --------------------------------------------------
    // [R02S-03][GET - /api/registry/progress/{registryManagementNumber}/transfer-cancellation-certificates/detail] 이전/말소등기권리증 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDetailedProgressCancellationCertificatesResponse>(
      API.REGISTRY_TRANSFER_CERTIFICATE.DETAIL(params.registryManagementNumber)
    )
  }
}
