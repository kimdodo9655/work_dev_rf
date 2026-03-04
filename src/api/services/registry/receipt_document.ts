/**
 * 문서 경로: `@/src/api/services/registry/receipt_document.ts`
 * 문서 제목: API 서비스: receipt-document
 */

// --------------------------------------------------
// [R02W] 영수증
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  DeleteReceiptDocumentParams,
  DeleteReceiptDocumentResponse,
  DownloadReceiptDocumentParams,
  DownloadReceiptDocumentQuery,
  DownloadReceiptDocumentResponse,
  GenerateReceiptDocumentParams,
  GenerateReceiptDocumentResponse,
  GetReceiptDocumentDetailsParams,
  GetReceiptDocumentDetailsResponse,
  GetReceiptDocumentFormParams,
  GetReceiptDocumentFormQuery,
  GetReceiptDocumentFormResponse,
  GetReceiptDocumentsParams,
  GetReceiptDocumentsResponse,
  SaveReceiptDocumentsParams,
  SaveReceiptDocumentsRequest,
  SaveReceiptDocumentsResponse
} from '@/types'

type DownloadReceiptDocumentInput = DownloadReceiptDocumentParams & DownloadReceiptDocumentQuery
type GetReceiptDocumentFormInput = GetReceiptDocumentFormParams & GetReceiptDocumentFormQuery
type SaveReceiptDocumentsInput = SaveReceiptDocumentsParams & SaveReceiptDocumentsRequest

export const registryReceiptDocumentAPI = {
  async getList(params: GetReceiptDocumentsParams) {
    // --------------------------------------------------
    // [R02W-01][GET - /api/registry/progress/{registryManagementNumber}/receipt-documents/list] 등기 영수증 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetReceiptDocumentsResponse>(
      API.REGISTRY_RECEIPT_DOCUMENT.LIST(params.registryManagementNumber)
    )
  },

  async getDetail(params: GetReceiptDocumentDetailsParams) {
    // --------------------------------------------------
    // [R02W-02][GET - /api/registry/progress/{registryManagementNumber}/receipt-documents/detail] 등기 영수증 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetReceiptDocumentDetailsResponse>(
      API.REGISTRY_RECEIPT_DOCUMENT.DETAIL(params.registryManagementNumber)
    )
  },

  async create(params: GenerateReceiptDocumentParams) {
    // --------------------------------------------------
    // [R02W-03][POST - /api/registry/progress/{registryManagementNumber}/receipt-documents/{receiptDocumentId}/document] 등기 영수증 전자문서 생성
    // --------------------------------------------------
    return apiHelpers.post<GenerateReceiptDocumentResponse>(
      API.REGISTRY_RECEIPT_DOCUMENT.CREATE(
        params.registryManagementNumber,
        params.receiptDocumentId
      )
    )
  },

  async delete(params: DeleteReceiptDocumentParams) {
    // --------------------------------------------------
    // [R02W-04][DELETE - /api/registry/progress/{registryManagementNumber}/receipt-documents/{receiptDocumentId}/document] 등기 영수증 전자문서 삭제
    // --------------------------------------------------
    return apiHelpers.delete<DeleteReceiptDocumentResponse>(
      API.REGISTRY_RECEIPT_DOCUMENT.DELETE(
        params.registryManagementNumber,
        params.receiptDocumentId
      )
    )
  },

  async document(query: DownloadReceiptDocumentInput) {
    // --------------------------------------------------
    // [R02W-05][GET - /api/registry/progress/{registryManagementNumber}/receipt-documents/{receiptDocumentId}/document] 등기 영수증 전자문서 조회
    // --------------------------------------------------
    const { registryManagementNumber, receiptDocumentId, ...params } = query
    return apiHelpers.get<DownloadReceiptDocumentResponse>(
      API.REGISTRY_RECEIPT_DOCUMENT.DOCUMENT(registryManagementNumber, receiptDocumentId),
      params
    )
  },

  async form(query: GetReceiptDocumentFormInput) {
    // --------------------------------------------------
    // [R02W-06][GET - /api/registry/progress/{registryManagementNumber}/receipt-documents/detail/form] 등기 영수증 폼 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...params } = query
    return apiHelpers.get<GetReceiptDocumentFormResponse>(
      API.REGISTRY_RECEIPT_DOCUMENT.FORM(registryManagementNumber),
      params
    )
  },

  async save(params: SaveReceiptDocumentsInput) {
    // --------------------------------------------------
    // [R02W-07][PUT - /api/registry/progress/{registryManagementNumber}/receipt-documents] 등기 영수증 저장
    // --------------------------------------------------
    const { registryManagementNumber, ...data } = params
    return apiHelpers.put<SaveReceiptDocumentsResponse>(
      API.REGISTRY_RECEIPT_DOCUMENT.SAVE(registryManagementNumber),
      data
    )
  }
}
