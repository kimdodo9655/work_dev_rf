// --------------------------------------------------
// [P02F] 지점-문서
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  DeleteDocumentParams,
  DeleteDocumentQuery,
  DeleteDocumentResponse,
  DownloadDocumentAsBase64Params,
  DownloadDocumentAsBase64Query,
  DownloadDocumentAsBase64Response,
  DownloadDocumentParams,
  DownloadDocumentQuery,
  DownloadDocumentResponse,
  GetDocumentsParams,
  GetDocumentsResponse,
  SaveDocumentParams,
  SaveDocumentRequest,
  SaveDocumentResponse,
  UploadToTempParams,
  UploadToTempQuery,
  UploadToTempRequest,
  UploadToTempResponse
} from '@/types'

export const branchDocumentAPI = {
  async tempUpload(
    params: UploadToTempParams,
    query: UploadToTempQuery,
    data: UploadToTempRequest
  ) {
    // --------------------------------------------------
    // [P02F-01][POST - /api/organizations/{organizationId}/branches/{branchId}/documents/temp] 문서 임시 업로드
    // --------------------------------------------------
    return apiHelpers.post<UploadToTempResponse>(
      `${API.BRANCH_DOCUMENT.TEMP_UPLOAD(params.organizationId, params.branchId)}?documentType=${query.documentType}`,
      data
    )
  },

  async getList(params: GetDocumentsParams) {
    // --------------------------------------------------
    // [P02F-02][GET - /api/organizations/{organizationId}/branches/{branchId}/documents] 문서 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDocumentsResponse>(
      API.BRANCH_DOCUMENT.LIST(params.organizationId, params.branchId)
    )
  },

  async save(params: SaveDocumentParams, data: SaveDocumentRequest) {
    // --------------------------------------------------
    // [P02F-03][POST - /api/organizations/{organizationId}/branches/{branchId}/documents] 문서 저장
    // --------------------------------------------------
    return apiHelpers.post<SaveDocumentResponse>(
      API.BRANCH_DOCUMENT.SAVE(params.organizationId, params.branchId),
      data
    )
  },

  async delete(params: DeleteDocumentParams, query: DeleteDocumentQuery) {
    // --------------------------------------------------
    // [P02F-04][DELETE - /api/organizations/{organizationId}/branches/{branchId}/documents] 문서 삭제
    // --------------------------------------------------
    return apiHelpers.delete<DeleteDocumentResponse>(
      `${API.BRANCH_DOCUMENT.DELETE(params.organizationId, params.branchId)}?documentId=${query.documentId}`
    )
  },

  async download(params: DownloadDocumentParams, query: DownloadDocumentQuery) {
    // --------------------------------------------------
    // [P02F-05][GET - /api/organizations/{organizationId}/branches/{branchId}/documents/download] 문서 다운로드
    // --------------------------------------------------
    return apiHelpers.get<DownloadDocumentResponse>(
      API.BRANCH_DOCUMENT.DOWNLOAD(params.organizationId, params.branchId),
      query
    )
  },

  async downloadBase64(
    params: DownloadDocumentAsBase64Params,
    query: DownloadDocumentAsBase64Query
  ) {
    // --------------------------------------------------
    // [P02F-06][GET - /api/organizations/{organizationId}/branches/{branchId}/documents/download/base64] 문서 Base64 다운로드
    // --------------------------------------------------
    return apiHelpers.get<DownloadDocumentAsBase64Response>(
      API.BRANCH_DOCUMENT.DOWNLOAD_BASE64(params.organizationId, params.branchId),
      query
    )
  }
}
