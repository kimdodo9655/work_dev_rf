/**
 * 문서 경로: `@/src/api/services/registry/request_document.ts`
 * 문서 제목: API 서비스: request-document
 */

// --------------------------------------------------
// [R00D] 문서
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  DeleteDocument_1Params,
  DeleteDocument_1Response,
  DownloadDocument_1Params,
  DownloadDocument_1Response,
  DownloadDocumentAsBase64_1Params,
  DownloadDocumentAsBase64_1Response,
  GetDocuments_1Params,
  GetDocuments_1Response,
  UploadDocumentParams,
  UploadDocumentQuery,
  UploadDocumentRequest,
  UploadDocumentResponse
} from '@/types'

type UploadProgressHandler = (progress: number) => void
type UploadRequestDocumentInput = UploadDocumentParams &
  UploadDocumentQuery &
  Omit<UploadDocumentRequest, 'file'> & {
    file: File
    onProgress?: UploadProgressHandler
  }

export const registryRequestDocumentAPI = {
  async getList(params: GetDocuments_1Params) {
    // --------------------------------------------------
    // [R00D-01][GET - /api/registry/requests/{requestNumber}/documents] 문서 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDocuments_1Response>(
      API.REGISTRY_REQUEST_DOCUMENT.LIST(params.requestNumber)
    )
  },

  async upload(query: UploadRequestDocumentInput) {
    // --------------------------------------------------
    // [R00D-02][POST - /api/registry/requests/{requestNumber}/documents] 문서 업로드
    // --------------------------------------------------
    const { requestNumber, file, onProgress, ...params } = query
    return apiHelpers.uploadFile<UploadDocumentResponse>(
      `${API.REGISTRY_REQUEST_DOCUMENT.UPLOAD(requestNumber)}?${new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
          acc[key] = String(value)
          return acc
        }, {})
      ).toString()}`,
      file,
      onProgress
    )
  },

  async download(params: DownloadDocument_1Params) {
    // --------------------------------------------------
    // [R00D-03][GET - /api/registry/requests/{requestNumber}/documents/{fileName}] 문서 다운로드
    // --------------------------------------------------
    return apiHelpers.get<DownloadDocument_1Response>(
      API.REGISTRY_REQUEST_DOCUMENT.DOWNLOAD(params.requestNumber, params.fileName)
    )
  },

  async delete(params: DeleteDocument_1Params) {
    // --------------------------------------------------
    // [R00D-04][DELETE - /api/registry/requests/{requestNumber}/documents/{fileName}] 문서 삭제
    // --------------------------------------------------
    return apiHelpers.delete<DeleteDocument_1Response>(
      API.REGISTRY_REQUEST_DOCUMENT.DELETE(params.requestNumber, params.fileName)
    )
  },

  async downloadBase64(params: DownloadDocumentAsBase64_1Params) {
    // --------------------------------------------------
    // [R00D-05][GET - /api/registry/requests/{requestNumber}/documents/{fileName}/base64] 문서 Base64 다운로드
    // --------------------------------------------------
    return apiHelpers.get<DownloadDocumentAsBase64_1Response>(
      API.REGISTRY_REQUEST_DOCUMENT.DOWNLOAD_BASE64(params.requestNumber, params.fileName)
    )
  }
}
