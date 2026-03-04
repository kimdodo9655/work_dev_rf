/**
 * 문서 경로: `@/src/api/services/registry/completion.ts`
 * 문서 제목: API 서비스: completion
 */

// --------------------------------------------------
// [R02X] 완료
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  DeleteDocument_2Params,
  DeleteDocument_2Query,
  DeleteDocument_2Response,
  DeletePostCetificateDocumentParams,
  DeletePostCetificateDocumentQuery,
  DeletePostCetificateDocumentResponse,
  GetCompleteDocumentsParams,
  GetCompleteDocumentsResponse,
  GetDetailedCompleteDocumentsParams,
  GetDetailedCompleteDocumentsResponse,
  UploadCompleteFullDocumentParams,
  UploadCompleteFullDocumentQuery,
  UploadCompleteFullDocumentRequest,
  UploadCompleteFullDocumentResponse,
  UploadCompletePostDocumentParams,
  UploadCompletePostDocumentQuery,
  UploadCompletePostDocumentRequest,
  UploadCompletePostDocumentResponse,
  ViewCompleteDocumentParams,
  ViewCompleteDocumentQuery,
  ViewCompleteDocumentResponse
} from '@/types'

type UploadProgressHandler = (progress: number) => void

type UploadCompleteFullDocumentInput = UploadCompleteFullDocumentParams &
  UploadCompleteFullDocumentQuery &
  Omit<UploadCompleteFullDocumentRequest, 'file'> & {
    file: File
    onProgress?: UploadProgressHandler
  }

type UploadCompletePostDocumentInput = UploadCompletePostDocumentParams &
  UploadCompletePostDocumentQuery &
  Omit<UploadCompletePostDocumentRequest, 'file'> & {
    file: File
    onProgress?: UploadProgressHandler
  }

type ViewCompleteDocumentInput = ViewCompleteDocumentParams & ViewCompleteDocumentQuery
type DeleteFullDocumentInput = DeleteDocument_2Params & DeleteDocument_2Query
type DeletePostDocumentInput = DeletePostCetificateDocumentParams &
  DeletePostCetificateDocumentQuery

export const registryCompletionAPI = {
  async getList(params: GetCompleteDocumentsParams) {
    // --------------------------------------------------
    // [R02X-01][GET - /api/registry/progress/{registryManagementNumber}/completion-documents/list] 등기완료 문서 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetCompleteDocumentsResponse>(
      API.REGISTRY_COMPLETION.LIST(params.registryManagementNumber)
    )
  },

  async getDetail(params: GetDetailedCompleteDocumentsParams) {
    // --------------------------------------------------
    // [R02X-02][GET - /api/registry/progress/{registryManagementNumber}/completion-documents/detail] 등기완료 문서 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDetailedCompleteDocumentsResponse>(
      API.REGISTRY_COMPLETION.DETAIL(params.registryManagementNumber)
    )
  },

  async upload(query: UploadCompleteFullDocumentInput) {
    // --------------------------------------------------
    // [R02X-03][POST - /api/registry/progress/{registryManagementNumber}/completion-documents/full-certificate/uploads] 등기사항전부증명서 문서 업로드
    // --------------------------------------------------
    const { registryManagementNumber, file, onProgress, ...params } = query
    return apiHelpers.uploadFile<UploadCompleteFullDocumentResponse>(
      `${API.REGISTRY_COMPLETION.UPLOAD(registryManagementNumber)}?${new URLSearchParams(params).toString()}`,
      file,
      onProgress
    )
  },

  async upload2(query: UploadCompletePostDocumentInput) {
    // --------------------------------------------------
    // [R02X-04][POST - /api/registry/progress/{registryManagementNumber}/completion-documents/post-certificate/uploads] 사후등기필정보 문서 업로드
    // --------------------------------------------------
    const { registryManagementNumber, file, onProgress, ...params } = query
    return apiHelpers.uploadFile<UploadCompletePostDocumentResponse>(
      `${API.REGISTRY_COMPLETION.UPLOAD_2(registryManagementNumber)}?${new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
          acc[key] = String(value)
          return acc
        }, {})
      ).toString()}`,
      file,
      onProgress
    )
  },

  async previewBase64(query: ViewCompleteDocumentInput) {
    // --------------------------------------------------
    // [R02X-06][GET - /api/registry/progress/{registryManagementNumber}/completion-documents/post-certificate/preview] 등기사항전부증명서/사후등기필정보 Base64 보기
    // --------------------------------------------------
    const { registryManagementNumber, ...params } = query
    return apiHelpers.get<ViewCompleteDocumentResponse>(
      API.REGISTRY_COMPLETION.PREVIEW_BASE64(registryManagementNumber),
      params
    )
  },

  async deleteFull(query: DeleteFullDocumentInput) {
    // --------------------------------------------------
    // [R02X-07][DELETE - /api/registry/progress/{registryManagementNumber}/completion-documents/full-certificate/{fileName}] 등기사항전부증명서 문서 삭제
    // --------------------------------------------------
    const { registryManagementNumber, fileName, ...params } = query
    return apiHelpers.delete<DeleteDocument_2Response>(
      `${API.REGISTRY_COMPLETION.DELETE_FULL(registryManagementNumber, fileName)}?${new URLSearchParams(
        params
      ).toString()}`
    )
  },

  async deletePost(query: DeletePostDocumentInput) {
    // --------------------------------------------------
    // [R02X-08][DELETE - /api/registry/progress/{registryManagementNumber}/completion-documents/post-certificate/{fileName}] 사후등기필정보 문서 삭제
    // --------------------------------------------------
    const { registryManagementNumber, fileName, ...params } = query
    return apiHelpers.delete<DeletePostCetificateDocumentResponse>(
      `${API.REGISTRY_COMPLETION.DELETE_POST(registryManagementNumber, fileName)}?${new URLSearchParams(
        params
      ).toString()}`
    )
  }
}
