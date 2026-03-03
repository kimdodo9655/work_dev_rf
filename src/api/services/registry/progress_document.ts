/**
 * 문서 경로: `@/src/api/services/registry/progress_document.ts`
 * 문서 제목: API 서비스: progress-document
 */

// --------------------------------------------------
// [R02Y] 진행문서
// --------------------------------------------------

import { api, apiHelpers } from '@/api/client' // ✅ api가 export 되어있다는 전제 (아래 참고)
import { API } from '@/api/endpoints'
import type {
  DeleteDocument_3Query,
  DeleteDocument_3Response,
  DeleteDocument_4Params,
  DeleteDocument_4Response,
  DownloadDocument_2Query,
  DownloadDocument_2Response,
  DownloadDocumentAsBase64_2Query,
  DownloadDocumentAsBase64_2Response,
  GetDocuments_2Params,
  GetDocuments_2Response,
  SaveDocument_1Params,
  SaveDocument_1Response,
  UploadToTemp_1Query
} from '@/types'

export const registryProgressDocumentAPI = {
  async tempUpload(query: UploadToTemp_1Query) {
    // --------------------------------------------------
    // [R02Y-01][POST - /api/registry/progress/{registryManagementNumber}/documents/temp] 문서 임시 업로드
    // --------------------------------------------------
    const { registryManagementNumber, file, onProgress } = query as any
    return apiHelpers.uploadFile(
      API.REGISTRY_PROGRESS_DOCUMENT.TEMP_UPLOAD(registryManagementNumber),
      file,
      onProgress
    )
  },

  async getList(params: GetDocuments_2Params) {
    // --------------------------------------------------
    // [R02Y-02][GET - /api/registry/progress/{registryManagementNumber}/documents] 문서 목록 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...query } = params as any
    return apiHelpers.get<GetDocuments_2Response>(
      API.REGISTRY_PROGRESS_DOCUMENT.LIST(registryManagementNumber),
      query
    )
  },

  async save(params: SaveDocument_1Params) {
    // --------------------------------------------------
    // [R02Y-03][POST - /api/registry/progress/{registryManagementNumber}/documents] 문서 저장
    // --------------------------------------------------
    const { registryManagementNumber, ...data } = params as any
    return apiHelpers.post<SaveDocument_1Response>(
      API.REGISTRY_PROGRESS_DOCUMENT.SAVE(registryManagementNumber),
      data
    )
  },

  async delete(query: DeleteDocument_3Query) {
    // --------------------------------------------------
    // [R02Y-04][DELETE - /api/registry/progress/{registryManagementNumber}/documents] 문서 삭제
    // --------------------------------------------------
    const { registryManagementNumber, ...data } = query as any

    // ✅ axios delete는 body를 { data }로 실어보내야 함
    const response = await api.delete<DeleteDocument_3Response>(
      API.REGISTRY_PROGRESS_DOCUMENT.DELETE(registryManagementNumber),
      { data }
    )
    return response.data
  },

  async download(query: DownloadDocument_2Query) {
    // --------------------------------------------------
    // [R02Y-05][GET - /api/registry/progress/{registryManagementNumber}/documents/download] 문서 다운로드
    // --------------------------------------------------
    const { registryManagementNumber, ...params } = query as any
    return apiHelpers.get<DownloadDocument_2Response>(
      API.REGISTRY_PROGRESS_DOCUMENT.DOWNLOAD(registryManagementNumber),
      params
    )
  },

  async downloadBase64(query: DownloadDocumentAsBase64_2Query) {
    // --------------------------------------------------
    // [R02Y-06][GET - /api/registry/progress/{registryManagementNumber}/documents/download/base64] 문서 Base64 다운로드
    // --------------------------------------------------
    const { registryManagementNumber, ...params } = query as any
    return apiHelpers.get<DownloadDocumentAsBase64_2Response>(
      API.REGISTRY_PROGRESS_DOCUMENT.DOWNLOAD_BASE64(registryManagementNumber),
      params
    )
  },

  async delete2(params: DeleteDocument_4Params) {
    // --------------------------------------------------
    // [R02Y-07][DELETE - /api/registry/progress/{registryManagementNumber}/applications/{applicationId}/documents] 신청번호 기준 문서 삭제
    // --------------------------------------------------
    return apiHelpers.delete<DeleteDocument_4Response>(
      API.REGISTRY_PROGRESS_DOCUMENT.DELETE_2(params.registryManagementNumber, params.applicationId)
    )
  }
}
