// --------------------------------------------------
// [P07] 알림
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  CreateNotificationRequest,
  CreateNotificationResponse,
  DeleteNotificationsResponse,
  GetNotificationsResponse,
  PatchNotificationsParams,
  PatchNotificationsResponse
} from '@/types'

export const notificationAPI = {
  async getList() {
    // --------------------------------------------------
    // [P07-01][GET - /api/notifications] 알림 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetNotificationsResponse>(API.NOTIFICATION.LIST)
  },

  async create(data: CreateNotificationRequest) {
    // --------------------------------------------------
    // [P07-02][POST - /api/notifications] 알림 생성
    // --------------------------------------------------
    return apiHelpers.post<CreateNotificationResponse>(API.NOTIFICATION.CREATE, data)
  },

  async read(params: PatchNotificationsParams) {
    // --------------------------------------------------
    // [P07-03][PATCH - /api/notifications/{id}/read] 알림 읽음 처리
    // --------------------------------------------------
    return apiHelpers.patch<PatchNotificationsResponse>(API.NOTIFICATION.READ(params.id))
  },

  async clearAll() {
    // --------------------------------------------------
    // [P07-04][DELETE - /api/notifications/clear-all] 알림 전체 삭제
    // --------------------------------------------------
    return apiHelpers.delete<DeleteNotificationsResponse>(API.NOTIFICATION.CLEAR_ALL)
  }
}
