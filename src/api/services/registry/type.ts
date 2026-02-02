// --------------------------------------------------
// [R02D] 유형
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  CreateRegistryApplicationRequest,
  CreateRegistryApplicationResponse,
  DeleteRegistryApplicationParams,
  GetApplicationDocumentsParams,
  GetRegistryApplicationFormsQuery,
  UpdateRegistryApplicationParams
} from '@/types'

export const registryTypeAPI = {
  async applications(data: CreateRegistryApplicationRequest) {
    // --------------------------------------------------
    // [R02D-02][POST - /api/registry/applications] 등기유형(등기신청서) 추가
    // --------------------------------------------------
    return apiHelpers.post<CreateRegistryApplicationResponse>(API.REGISTRY_TYPE.APPLICATIONS, data)
  },

  async delete(params: DeleteRegistryApplicationParams) {
    // --------------------------------------------------
    // [R02D-03][DELETE - /api/registry/applications/{applicationId}] 등기유형(등기신청서) 삭제
    // --------------------------------------------------
    return apiHelpers.delete(API.REGISTRY_TYPE.DELETE(params.applicationId))
  },

  async update(params: UpdateRegistryApplicationParams) {
    // --------------------------------------------------
    // [R02D-04][PATCH - /api/registry/applications/{applicationId}] 등기유형(등기신청서) 수정
    // --------------------------------------------------
    return apiHelpers.patch(API.REGISTRY_TYPE.UPDATE(params.applicationId))
  },

  async getList(query: GetRegistryApplicationFormsQuery) {
    // --------------------------------------------------
    // [R02D-08][GET - /api/registry/applications/tabs] 등기신청서 양식 목록 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_TYPE.LIST, query)
  },

  async documents(params: GetApplicationDocumentsParams) {
    // --------------------------------------------------
    // [R02D-09][GET - /api/registry/applications/{applicationId}/documents] 등기신청서 전자문서 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_TYPE.DOCUMENTS(params.applicationId))
  }
}
