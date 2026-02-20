// --------------------------------------------------
// [R02R] 지급계좌
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  DeleteReceiptParams,
  DeleteReceiptResponse,
  DownloadReceiptParams,
  DownloadReceiptResponse,
  GetLoanPaymentAccountListParams,
  GetLoanPaymentAccountListResponse,
  GetLoanPaymentAccountsParams,
  GetLoanPaymentAccountsResponse,
  SaveLoanPaymentAccountsParams,
  SaveLoanPaymentAccountsRequest,
  SaveLoanPaymentAccountsResponse,
  UploadReceiptParams,
  UploadReceiptRequest,
  UploadReceiptResponse
} from '@/types'

export const registryLoanAccountAPI = {
  async getDetail(params: GetLoanPaymentAccountsParams) {
    // --------------------------------------------------
    // [R02R-01][GET - /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/detail] 대출금 지급계좌 조회
    // --------------------------------------------------
    return apiHelpers.get<GetLoanPaymentAccountsResponse>(
      API.REGISTRY_LOAN_ACCOUNT.DETAIL(params.registryManagementNumber)
    )
  },

  async getList(params: GetLoanPaymentAccountListParams) {
    // --------------------------------------------------
    // [R02R-02][GET - /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/list] 대출금 지급계좌 등록 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetLoanPaymentAccountListResponse>(
      API.REGISTRY_LOAN_ACCOUNT.LIST(params.registryManagementNumber)
    )
  },

  async save(params: SaveLoanPaymentAccountsParams, data: SaveLoanPaymentAccountsRequest) {
    // --------------------------------------------------
    // [R02R-03][PUT - /api/registry/progress/{registryManagementNumber}/loan-payment-accounts] 대출금 지급계좌 일괄 저장
    // --------------------------------------------------
    return apiHelpers.put<SaveLoanPaymentAccountsResponse>(
      API.REGISTRY_LOAN_ACCOUNT.SAVE(params.registryManagementNumber),
      data
    )
  },

  async upload(params: UploadReceiptParams, data: UploadReceiptRequest) {
    // --------------------------------------------------
    // [R02R-04][POST - /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/{loanPaymentAccountId}/receipt] 상환영수증 업로드
    // --------------------------------------------------
    return apiHelpers.post<UploadReceiptResponse>(
      API.REGISTRY_LOAN_ACCOUNT.UPLOAD(
        params.registryManagementNumber,
        params.loanPaymentAccountId
      ),
      data
    )
  },

  async delete(params: DeleteReceiptParams) {
    // --------------------------------------------------
    // [R02R-05][DELETE - /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/{loanPaymentAccountId}/receipt] 상환영수증 삭제
    // --------------------------------------------------
    return apiHelpers.delete<DeleteReceiptResponse>(
      API.REGISTRY_LOAN_ACCOUNT.DELETE(params.registryManagementNumber, params.loanPaymentAccountId)
    )
  },

  async download(params: DownloadReceiptParams) {
    // --------------------------------------------------
    // [R02R-06][GET - /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/{loanPaymentAccountId}/receipt] 상환영수증 다운로드
    // --------------------------------------------------
    return apiHelpers.get<DownloadReceiptResponse>(
      API.REGISTRY_LOAN_ACCOUNT.DOWNLOAD(
        params.registryManagementNumber,
        params.loanPaymentAccountId
      )
    )
  }
}
