/**
 * NOTICE API Types
 * @generated 2025-01-27
 */

/**
 * P08-01
 * GET /api/notices
 */
export type GetNoticesResponse = NoticeResponse

// ==================== Schemas ====================

/** 공지사항 응답 */
export interface NoticeResponse {
  /** 공지사항 일련번호 */
  noticeId?: number
  /** 공지사항 제목 */
  title?: string
  /** 공지사항 생성일자 */
  noticeDate?: string
}
