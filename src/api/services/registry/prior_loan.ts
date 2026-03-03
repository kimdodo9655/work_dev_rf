/**
 * 문서 경로: `@/src/api/services/registry/prior_loan.ts`
 * 문서 제목: prior loan 구현 파일
 */

// --------------------------------------------------
// [R02C] 선순위
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { GetSeniorLoanRepaymentsParams, GetSeniorLoanRepaymentsResponse } from '@/types'

export const registryPriorLoanAPI = {
  async seniorLoanRepayments(params: GetSeniorLoanRepaymentsParams) {
    // --------------------------------------------------
    // [R02C-01][GET - /api/registry/progress/{registryManagementNumber}/senior-loan-repayments] 선순위대출상환 정보 조회
    // --------------------------------------------------
    return apiHelpers.get<GetSeniorLoanRepaymentsResponse>(
      API.REGISTRY_PRIOR_LOAN.SENIOR_LOAN_REPAYMENTS(params.registryManagementNumber)
    )
  }
}
