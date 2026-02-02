// --------------------------------------------------
// [R02C] 선순위
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { GetSeniorLoanRepaymentsParams } from '@/types'

export const registryPriorLoanAPI = {
  async seniorLoanRepayments(params: GetSeniorLoanRepaymentsParams) {
    // --------------------------------------------------
    // [R02C-01][GET - /api/registry/progress/{registryManagementNumber}/senior-loan-repayments] 선순위대출상환 정보 조회
    // --------------------------------------------------
    return apiHelpers.get(
      API.REGISTRY_PRIOR_LOAN.SENIOR_LOAN_REPAYMENTS(params.registryManagementNumber)
    )
  }
}
