/**
 * 문서 경로: `@/src/api/services/registry/type.ts`
 * 문서 제목: API 서비스: type
 */

// --------------------------------------------------
// [R02D] 유형
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  CreateRegistryApplicationRequest,
  CreateRegistryApplicationResponse,
  DeleteRegistryApplicationParams,
  DeleteRegistryApplicationResponse,
  GetApplicationDocumentsParams,
  GetApplicationDocumentsResponse,
  GetApplicationDocumentsResponse as RegistryApplicationDocument,
  GetRegistryApplicationFormsQuery,
  GetRegistryApplicationFormsResponse,
  GetUnifiedApplicationFormParams,
  GetUnifiedApplicationFormResponse,
  RegistryApplicationFormResponse,
  UpdateRegistryApplicationParams,
  UpdateRegistryApplicationRequest,
  UpdateRegistryApplicationResponse
} from '@/types'
import { extractArrayByKeys, extractPrimaryPayload } from '@/utils/apiPayload'

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
    return apiHelpers.delete<DeleteRegistryApplicationResponse>(
      API.REGISTRY_TYPE.DELETE(params.applicationId)
    )
  },

  async update(params: UpdateRegistryApplicationParams, data: UpdateRegistryApplicationRequest) {
    // --------------------------------------------------
    // [R02D-04][PATCH - /api/registry/applications/{applicationId}] 등기유형(등기신청서) 수정
    // --------------------------------------------------
    return apiHelpers.patch<UpdateRegistryApplicationResponse>(
      API.REGISTRY_TYPE.UPDATE(params.applicationId),
      data
    )
  },

  async getList(query: GetRegistryApplicationFormsQuery) {
    // --------------------------------------------------
    // [R02D-08][GET - /api/registry/applications/tabs] 등기신청서 양식 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetRegistryApplicationFormsResponse>(API.REGISTRY_TYPE.LIST, query)
  },

  async getTabs(
    query: GetRegistryApplicationFormsQuery
  ): Promise<RegistryApplicationFormResponse[]> {
    // 화면에서는 items/content 래핑을 몰라도 되도록 서비스에서 탭 배열만 꺼내서 넘긴다.
    const response = await this.getList(query)
    return extractArrayByKeys<RegistryApplicationFormResponse>(response, ['items', 'content'])
  },

  async documents(params: GetApplicationDocumentsParams) {
    // --------------------------------------------------
    // [R02D-09][GET - /api/registry/applications/{applicationId}/documents] 등기신청서 전자문서 조회
    // --------------------------------------------------
    return apiHelpers.get<GetApplicationDocumentsResponse>(
      API.REGISTRY_TYPE.DOCUMENTS(params.applicationId)
    )
  },

  async getDocument(
    params: GetApplicationDocumentsParams
  ): Promise<RegistryApplicationDocument | null> {
    // 단건 문서 조회는 가장 안쪽 payload만 반환해 composable이 extractPrimaryPayload를 직접 호출하지 않게 한다.
    const response = await this.documents(params)
    return extractPrimaryPayload<RegistryApplicationDocument>(response) ?? null
  },

  async unifiedForm(params: GetUnifiedApplicationFormParams) {
    // --------------------------------------------------
    // [R02D-10][GET - /api/registry/applications/{applicationId}/forms/unified] 등기신청서 통합 조회
    // --------------------------------------------------
    return apiHelpers.get<GetUnifiedApplicationFormResponse>(
      API.REGISTRY_TYPE.UNIFIED_FORM(params.applicationId)
    )
  }
}
