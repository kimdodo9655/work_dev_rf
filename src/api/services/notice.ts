// --------------------------------------------------
// [P08] 공지사항
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { GetNoticesResponse } from '@/types'

export const noticeAPI = {
  async getList() {
    // --------------------------------------------------
    // [P08-01][GET - /api/notices] 공지사항 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetNoticesResponse>(API.NOTICE.LIST)
  }
}
