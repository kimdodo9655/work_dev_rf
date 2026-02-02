// --------------------------------------------------
// [R02J] 첨부
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  DownloadApplicationAttachmentParams,
  DownloadApplicationAttachmentQuery,
  DownloadApplicationAttachmentResponse,
  GetDetailedApplicationAttachmentParams,
  GetDetailedApplicationAttachmentResponse,
  ReplaceApplicationAttachmentsParams,
  ReplaceApplicationAttachmentsRequest,
  ReplaceApplicationAttachmentsResponse,
  ViewRegistryApplicationAttachmentParams,
  ViewRegistryApplicationAttachmentQuery,
  ViewRegistryApplicationAttachmentResponse
} from '@/types'

export const registryAttachmentAPI = {
  async getDetail(params: GetDetailedApplicationAttachmentParams) {
    // --------------------------------------------------
    // [R02J-01][GET - /api/registry/applications/{applicationId}/attachments] 첨부서면 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDetailedApplicationAttachmentResponse>(
      API.REGISTRY_ATTACHMENT.DETAIL(params.applicationId)
    )
  },

  async save(
    params: ReplaceApplicationAttachmentsParams,
    data: ReplaceApplicationAttachmentsRequest
  ) {
    // --------------------------------------------------
    // [R02J-02][PUT - /api/registry/applications/{applicationId}/attachments] 첨부서면 저장
    // --------------------------------------------------
    return apiHelpers.put<ReplaceApplicationAttachmentsResponse>(
      API.REGISTRY_ATTACHMENT.SAVE(params.applicationId),
      data
    )
  },

  async download(
    params: DownloadApplicationAttachmentParams,
    query: DownloadApplicationAttachmentQuery
  ) {
    // --------------------------------------------------
    // [R02J-03][GET - /api/registry/applications/{applicationId}/attachments/download] 첨부서면 다운로드
    // --------------------------------------------------
    return apiHelpers.get<DownloadApplicationAttachmentResponse>(
      API.REGISTRY_ATTACHMENT.DOWNLOAD(params.applicationId),
      query
    )
  },

  async preview(
    params: ViewRegistryApplicationAttachmentParams,
    query: ViewRegistryApplicationAttachmentQuery
  ) {
    // --------------------------------------------------
    // [R02J-04][GET - /api/registry/applications/{applicationId}/attachments/preview] 첨부서면 Base64 다운로드
    // --------------------------------------------------
    return apiHelpers.get<ViewRegistryApplicationAttachmentResponse>(
      API.REGISTRY_ATTACHMENT.PREVIEW(params.applicationId),
      query
    )
  }
}
