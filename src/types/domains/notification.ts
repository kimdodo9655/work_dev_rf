/**
 * 알림 및 공지사항 관련 타입 정의
 * @file src/types/domains/notification.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 알림 상세 정보
 * Schema: NotificationDetailResponse
 * API: [P07-02] POST /api/notifications
 */
export interface NotificationDetail {
  /** 알림 ID */
  notificationId: number
  /** 알림 유형 */
  notificationType: string
  /** 알림 메시지 내용 */
  message: string
  /** 등기신청번호 */
  registryRequestNumber: string
  /** 수신 사용자 ID */
  loginId: string
  /** 읽음 여부 (Y: 읽음, N: 읽지않음) */
  isRead: string
  /** 발생일시 (yyyy-MM-dd HH:mm:ss) */
  occurredAt: string
}

/**
 * 알림 목록 응답
 * Schema: NotificationResponse
 * API: [P07-01] GET /api/notifications
 */
export interface NotificationListResponse {
  /** 전체 알림 리스트 */
  notificationList: NotificationDetail[]
  /** 총 건수 */
  totalCount: number
}

/**
 * 알림 생성 요청
 * Schema: NotificationCreateRequest
 * API: [P07-02] POST /api/notifications
 */
export interface NotificationCreateRequest {
  /** 알림 유형 */
  notificationType: string
  /** 알림 메시지 내용 */
  message: string
  /** 등기신청번호 */
  registryRequestNumber: string
}

/**
 * 알림 읽음 처리 요청
 */
export interface NotificationReadRequest {
  /** 알림 ID */
  id: number
}

/**
 * 공지사항 정보
 * Schema: NoticeResponse
 * API: [P08-01] GET /api/notices
 */
export interface Notice {
  /** 공지사항 일련번호 */
  noticeId: number
  /** 공지사항 제목 */
  title: string
  /** 공지사항 생성일자 */
  noticeDate: string
}

/**
 * 공지사항 목록 응답
 */
export type NoticeListResponse = Notice[]
