/**
 * NOTIFICATION API Types
 * @generated 2025-01-27
 */

import type { ApiResultVoid } from './common.types'

/**
 * P07-01
 * GET /api/notifications
 */
export type GetNotificationsResponse = NotificationResponse

/**
 * P07-02
 * POST /api/notifications
 */
export type CreateNotificationRequest = NotificationCreateRequest

export type CreateNotificationResponse = NotificationDetailResponse

/**
 * P07-03
 * PATCH /api/notifications/{id}/read
 */
export interface PatchNotificationsParams {
  /** 알림 ID */
  id: number
}

export type PatchNotificationsResponse = ApiResultVoid

/**
 * P07-04
 * DELETE /api/notifications/clear-all
 */
export type DeleteNotificationsRequest = NotificationDeleteRequest

export type DeleteNotificationsResponse = ApiResultVoid

// ==================== Schemas ====================

export interface NotificationCreateRequest {
  /** 알림 메시지 내용 */
  message: string
  /** 알림유형 */
  notificationType: string
  /** 등기신청번호 */
  registryRequestNumber: string
}

export interface NotificationDeleteRequest {
  /** 화면에 표시된 최신 알림 ID */
  id: number
  /** 조회구분 */
  searchType: 'ALL' | 'ESTIMATE' | 'PROGRESS'
  /** 기간구분 */
  periodType: 'TODAY' | 'PREVIOUS'
}

/** 알림 상세 항목 */
export interface NotificationDetailResponse {
  /** 알림ID */
  notificationId?: number
  /** 수신 사용자 ID */
  loginId?: string
  /** 알림유형 */
  notificationType?: '등기견적' | '등기진행' | '등기완료' | '등기반려'
  /** 등기신청번호 */
  registryRequestNumber?: string
  /** 알림메세지 내용 */
  message?: string
  /** 발생일시 (yyyy-MM-dd HH:mm:ss) */
  occurredAt?: string
  /** 읽음여부 (Y: 읽음, N: 읽지않음) */
  isRead?: 'Y' | 'N'
}

/** 알림 응답 */
export interface NotificationResponse {
  /** 총 건수 */
  totalCount?: number
  /** 전체 알림 리스트 */
  notificationList?: NotificationDetailResponse[]
}
