// --------------------------------------------------
// [R02W] 영수증
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  DeleteReceiptDocumentParams,
  DownloadReceiptDocumentQuery,
  GenerateReceiptDocumentParams,
  GetReceiptDocumentDetailsParams,
  GetReceiptDocumentFormQuery,
  GetReceiptDocumentsParams,
  SaveReceiptDocumentsParams
} from '@/types'

export const registryReceiptDocumentAPI = {
  async getList(params: GetReceiptDocumentsParams) {
    // --------------------------------------------------
    // [R02W-01][GET - /api/registry/progress/{registryManagementNumber}/receipt-documents/list] 등기 영수증 목록 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...query } = params as any
    return apiHelpers.get(API.REGISTRY_RECEIPT_DOCUMENT.LIST(registryManagementNumber), query)
  },

  async getDetail(params: GetReceiptDocumentDetailsParams) {
    // --------------------------------------------------
    // [R02W-02][GET - /api/registry/progress/{registryManagementNumber}/receipt-documents/detail] 등기 영수증 상세 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...query } = params as any
    return apiHelpers.get(API.REGISTRY_RECEIPT_DOCUMENT.DETAIL(registryManagementNumber), query)
  },

  async create(params: GenerateReceiptDocumentParams) {
    // --------------------------------------------------
    // [R02W-03][POST - /api/registry/progress/{registryManagementNumber}/receipt-documents/{receiptDocumentId}/document] 등기 영수증 전자문서 생성
    // --------------------------------------------------
    const { registryManagementNumber, receiptDocumentId, ...data } = params as any
    return apiHelpers.post(
      API.REGISTRY_RECEIPT_DOCUMENT.CREATE(registryManagementNumber, receiptDocumentId),
      data
    )
  },

  async delete(params: DeleteReceiptDocumentParams) {
    // --------------------------------------------------
    // [R02W-04][DELETE - /api/registry/progress/{registryManagementNumber}/receipt-documents/{receiptDocumentId}/document] 등기 영수증 전자문서 삭제
    // --------------------------------------------------
    return apiHelpers.delete(
      API.REGISTRY_RECEIPT_DOCUMENT.DELETE(
        params.registryManagementNumber,
        params.receiptDocumentId
      )
    )
  },

  async document(query: DownloadReceiptDocumentQuery) {
    // --------------------------------------------------
    // [R02W-05][GET - /api/registry/progress/{registryManagementNumber}/receipt-documents/{receiptDocumentId}/document] 등기 영수증 전자문서 조회
    // --------------------------------------------------
    const { registryManagementNumber, receiptDocumentId, ...params } = query as any
    return apiHelpers.get(
      API.REGISTRY_RECEIPT_DOCUMENT.DOCUMENT(registryManagementNumber, receiptDocumentId),
      params
    )
  },

  async form(query: GetReceiptDocumentFormQuery) {
    // --------------------------------------------------
    // [R02W-06][GET - /api/registry/progress/{registryManagementNumber}/receipt-documents/detail/form] 등기 영수증 폼 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...params } = query as any
    return apiHelpers.get(API.REGISTRY_RECEIPT_DOCUMENT.FORM(registryManagementNumber), params)
  },

  async save(params: SaveReceiptDocumentsParams) {
    // --------------------------------------------------
    // [R02W-07][PUT - /api/registry/progress/{registryManagementNumber}/receipt-documents] 등기 영수증 저장
    // --------------------------------------------------
    const { registryManagementNumber, ...data } = params as any
    return apiHelpers.put(API.REGISTRY_RECEIPT_DOCUMENT.SAVE(registryManagementNumber), data)
  }
}
