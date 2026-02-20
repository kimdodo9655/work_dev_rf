// --------------------------------------------------
// [R02X] 완료
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  DeleteDocument_2Query,
  DeleteDocument_2Response,
  DeletePostCetificateDocumentQuery,
  DeletePostCetificateDocumentResponse,
  GetCompleteDocumentsParams,
  GetCompleteDocumentsResponse,
  GetDetailedCompleteDocumentsParams,
  GetDetailedCompleteDocumentsResponse,
  UploadCompleteFullDocumentQuery,
  UploadCompletePostDocumentQuery,
  ViewCompleteDocumentQuery,
  ViewCompleteDocumentResponse
} from '@/types'

export const registryCompletionAPI = {
  async getList(params: GetCompleteDocumentsParams) {
    // --------------------------------------------------
    // [R02X-01][GET - /api/registry/progress/{registryManagementNumber}/completion-documents/list] 등기완료 문서 목록 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...query } = params as any
    return apiHelpers.get<GetCompleteDocumentsResponse>(
      API.REGISTRY_COMPLETION.LIST(registryManagementNumber),
      query
    )
  },

  async getDetail(params: GetDetailedCompleteDocumentsParams) {
    // --------------------------------------------------
    // [R02X-02][GET - /api/registry/progress/{registryManagementNumber}/completion-documents/detail] 등기완료 문서 상세 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...query } = params as any
    return apiHelpers.get<GetDetailedCompleteDocumentsResponse>(
      API.REGISTRY_COMPLETION.DETAIL(registryManagementNumber),
      query
    )
  },

  async upload(query: UploadCompleteFullDocumentQuery) {
    // --------------------------------------------------
    // [R02X-03][POST - /api/registry/progress/{registryManagementNumber}/completion-documents/full-certificate/uploads] 등기사항전부증명서 문서 업로드
    // --------------------------------------------------
    const { registryManagementNumber, file, onProgress } = query as any
    return apiHelpers.uploadFile(
      API.REGISTRY_COMPLETION.UPLOAD(registryManagementNumber),
      file,
      onProgress
    )
  },

  async upload2(query: UploadCompletePostDocumentQuery) {
    // --------------------------------------------------
    // [R02X-04][POST - /api/registry/progress/{registryManagementNumber}/completion-documents/post-certificate/uploads] 사후등기필정보 문서 업로드
    // --------------------------------------------------
    const { registryManagementNumber, file, onProgress } = query as any
    return apiHelpers.uploadFile(
      API.REGISTRY_COMPLETION.UPLOAD_2(registryManagementNumber),
      file,
      onProgress
    )
  },

  async previewBase64(query: ViewCompleteDocumentQuery) {
    // --------------------------------------------------
    // [R02X-06][GET - /api/registry/progress/{registryManagementNumber}/completion-documents/post-certificate/preview] 등기사항전부증명서/사후등기필정보 Base64 보기
    // --------------------------------------------------
    const { registryManagementNumber, ...params } = query as any
    return apiHelpers.get<ViewCompleteDocumentResponse>(
      API.REGISTRY_COMPLETION.PREVIEW_BASE64(registryManagementNumber),
      params
    )
  },

  async deleteFull(query: DeleteDocument_2Query) {
    // --------------------------------------------------
    // [R02X-07][DELETE - /api/registry/progress/{registryManagementNumber}/completion-documents/full-certificate/{fileName}] 등기사항전부증명서 문서 삭제
    // --------------------------------------------------
    const { registryManagementNumber, fileName } = query as any
    return apiHelpers.delete<DeleteDocument_2Response>(
      API.REGISTRY_COMPLETION.DELETE_FULL(registryManagementNumber, fileName)
    )
  },

  async deletePost(query: DeletePostCetificateDocumentQuery) {
    // --------------------------------------------------
    // [R02X-08][DELETE - /api/registry/progress/{registryManagementNumber}/completion-documents/post-certificate/{fileName}] 사후등기필정보 문서 삭제
    // --------------------------------------------------
    const { registryManagementNumber, fileName } = query as any
    return apiHelpers.delete<DeletePostCetificateDocumentResponse>(
      API.REGISTRY_COMPLETION.DELETE_POST(registryManagementNumber, fileName)
    )
  }
}
