/**
 * 문서 경로: `@/src/types/api/notice.types.ts`
 * 문서 제목: 타입 정의: notice-types
 */

/**
 * NOTICE API Types
 * @generated 2025-01-27
 */

/**
 * P08-01
 * GET /api/notices
 */
export type GetNoticesResponse = NoticeResponse

/**
 * P08-02
 * GET /api/notices/search
 */
export interface SearchNoticesQuery {
  searchKyword?: string
  page: number
  size: number
}

export type SearchNoticesResponse = NoticeListResponse

/**
 * P08-03
 * GET /api/notices/{id}
 */
export interface GetNoticeDetailParams {
  id: number
}

export type GetNoticeDetailResponse = NoticeDetailResponse

// ==================== Schemas ====================

/** 공지사항 응답 */
export interface NoticeResponse {
  /** 공지사항 일련번호 */
  noticeId?: number
  bankName?: string
  category?: string
  isImportant?: boolean
  /** 공지사항 제목 */
  title?: string
  /** 공지사항 생성일자 */
  noticeDate?: string
  isNew?: boolean
}

export interface NoticeDetailResponse {
  noticeId?: number
  bankName?: string
  category?: string
  isImportant?: boolean
  isPublished?: boolean
  title?: string
  content?: string
  noticeDate?: string
  viewCount?: number
  prevNoticeId?: number | null
  nextNoticeId?: number | null
}

export interface Item {
  noticeId?: number
  bankName?: string
  category?: 'ALL' | 'SYSTEM_IMPROVEMENT' | 'SYSTEM_MAINTENANCE' | 'ETC'
  isImportant?: boolean
  title?: string
  noticeDate?: string
  isNew?: boolean
}

export interface NoticeListResponse {
  page?: number
  size?: number
  totalPages?: number
  totalCount?: number
  noticeList?: Item[]
}
