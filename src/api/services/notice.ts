/**
 * 문서 경로: `@/src/api/services/notice.ts`
 * 문서 제목: API 서비스: notice
 */

// --------------------------------------------------
// [P08] 공지사항
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetNoticeDetailParams,
  GetNoticeDetailResponse,
  GetNoticesResponse,
  SearchNoticesQuery,
  SearchNoticesResponse
} from '@/types'

export const noticeAPI = {
  async getList() {
    // --------------------------------------------------
    // [P08-01][GET - /api/notices] 공지사항 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetNoticesResponse>(API.NOTICE.LIST)
  },

  async search(query: SearchNoticesQuery) {
    // --------------------------------------------------
    // [P08-02][GET - /api/notices/search] 공지사항 검색 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<SearchNoticesResponse>(API.NOTICE.SEARCH, query)
  },

  async getDetail(params: GetNoticeDetailParams) {
    // --------------------------------------------------
    // [P08-03][GET - /api/notices/{id}] 공지사항 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetNoticeDetailResponse>(API.NOTICE.DETAIL(params.id))
  }
}
