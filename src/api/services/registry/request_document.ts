// --------------------------------------------------
// [R00D] 문서
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  DeleteDocument_1Params,
  DownloadDocument_1Params,
  DownloadDocumentAsBase64_1Params,
  GetDocuments_1Params,
  UploadDocumentQuery
} from '@/types'

export const registryRequestDocumentAPI = {
  async getList(params: GetDocuments_1Params) {
    // --------------------------------------------------
    // [R00D-01][GET - /api/registry/requests/{requestNumber}/documents] 문서 목록 조회
    // --------------------------------------------------
    const { requestNumber, ...query } = params as any
    return apiHelpers.get(API.REGISTRY_REQUEST_DOCUMENT.LIST(requestNumber), query)
  },

  async upload(query: UploadDocumentQuery) {
    // --------------------------------------------------
    // [R00D-02][POST - /api/registry/requests/{requestNumber}/documents] 문서 업로드
    // --------------------------------------------------
    const { requestNumber, file, onProgress } = query as any
    return apiHelpers.uploadFile(
      API.REGISTRY_REQUEST_DOCUMENT.UPLOAD(requestNumber),
      file,
      onProgress
    )
  },

  async download(params: DownloadDocument_1Params) {
    // --------------------------------------------------
    // [R00D-03][GET - /api/registry/requests/{requestNumber}/documents/{fileName}] 문서 다운로드
    // --------------------------------------------------
    return apiHelpers.get(
      API.REGISTRY_REQUEST_DOCUMENT.DOWNLOAD(params.requestNumber, params.fileName)
    )
  },

  async delete(params: DeleteDocument_1Params) {
    // --------------------------------------------------
    // [R00D-04][DELETE - /api/registry/requests/{requestNumber}/documents/{fileName}] 문서 삭제
    // --------------------------------------------------
    return apiHelpers.delete(
      API.REGISTRY_REQUEST_DOCUMENT.DELETE(params.requestNumber, params.fileName)
    )
  },

  async downloadBase64(params: DownloadDocumentAsBase64_1Params) {
    // --------------------------------------------------
    // [R00D-05][GET - /api/registry/requests/{requestNumber}/documents/{fileName}/base64] 문서 Base64 다운로드
    // --------------------------------------------------
    return apiHelpers.get(
      API.REGISTRY_REQUEST_DOCUMENT.DOWNLOAD_BASE64(params.requestNumber, params.fileName)
    )
  }
}
