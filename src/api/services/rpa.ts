// --------------------------------------------------
// [RPAC] RPA
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  CreateAdminConsentTaskParams,
  CreateAdminConsentTaskRequest,
  CreateAdminConsentTaskResponse,
  CreateEtaxAcquisitionTaskParams,
  CreateEtaxAcquisitionTaskRequest,
  CreateEtaxAcquisitionTaskResponse,
  CreateEtaxRegistrationTaskParams,
  CreateEtaxRegistrationTaskRequest,
  CreateEtaxRegistrationTaskResponse,
  CreateFullCertificateIssueTaskParams,
  CreateFullCertificateIssueTaskRequest,
  CreateFullCertificateIssueTaskResponse,
  CreateFullCertificateViewTaskParams,
  CreateFullCertificateViewTaskRequest,
  CreateFullCertificateViewTaskResponse,
  CreatePropertyDescriptionTaskParams,
  CreatePropertyDescriptionTaskRequest,
  CreatePropertyDescriptionTaskResponse,
  CreateRegistrationApplicationTaskParams,
  CreateRegistrationApplicationTaskRequest,
  CreateRegistrationApplicationTaskResponse,
  CreateRegistrationCaseQueryTaskParams,
  CreateRegistrationCaseQueryTaskRequest,
  CreateRegistrationCaseQueryTaskResponse,
  CreateRegistrationPasswordTaskParams,
  CreateRegistrationPasswordTaskRequest,
  CreateRegistrationPasswordTaskResponse,
  CreateWetaxAcquisitionTaskParams,
  CreateWetaxAcquisitionTaskRequest,
  CreateWetaxAcquisitionTaskResponse,
  CreateWetaxRegistrationTaskParams,
  CreateWetaxRegistrationTaskRequest,
  CreateWetaxRegistrationTaskResponse,
  GetTaskParams,
  GetTaskResponse,
  SubmitResultParams,
  SubmitResultRequest,
  SubmitResultResponse
} from '@/types'

export const rpaAPI = {
  async create(
    params: CreateFullCertificateViewTaskParams,
    data: CreateFullCertificateViewTaskRequest
  ) {
    // --------------------------------------------------
    // [RPAC-01][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/full-certificate-view] 등기사항전부증명서 열람 작업 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateFullCertificateViewTaskResponse>(
      API.RPA.CREATE(params.registryManagementNumber),
      data
    )
  },

  async create2(
    params: CreatePropertyDescriptionTaskParams,
    data: CreatePropertyDescriptionTaskRequest
  ) {
    // --------------------------------------------------
    // [RPAC-02][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/property-description] 부동산의표시 생성 작업 등록
    // --------------------------------------------------
    return apiHelpers.post<CreatePropertyDescriptionTaskResponse>(
      API.RPA.CREATE_2(params.registryManagementNumber),
      data
    )
  },

  async create3(
    params: CreateRegistrationPasswordTaskParams,
    data: CreateRegistrationPasswordTaskRequest
  ) {
    // --------------------------------------------------
    // [RPAC-03][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-password] 등기필정보 비밀번호 조회 작업 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateRegistrationPasswordTaskResponse>(
      API.RPA.CREATE_3(params.registryManagementNumber),
      data
    )
  },

  async create4(params: CreateEtaxAcquisitionTaskParams, data: CreateEtaxAcquisitionTaskRequest) {
    // --------------------------------------------------
    // [RPAC-04][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/etax-acquisition] 이택스 취득세 작업 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateEtaxAcquisitionTaskResponse>(
      API.RPA.CREATE_4(params.registryManagementNumber),
      data
    )
  },

  async create5(params: CreateEtaxRegistrationTaskParams, data: CreateEtaxRegistrationTaskRequest) {
    // --------------------------------------------------
    // [RPAC-05][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/etax-registration] 이택스 등록면허세 작업 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateEtaxRegistrationTaskResponse>(
      API.RPA.CREATE_5(params.registryManagementNumber),
      data
    )
  },

  async create6(params: CreateWetaxAcquisitionTaskParams, data: CreateWetaxAcquisitionTaskRequest) {
    // --------------------------------------------------
    // [RPAC-06][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/wetax-acquisition] 위택스 취득세 작업 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateWetaxAcquisitionTaskResponse>(
      API.RPA.CREATE_6(params.registryManagementNumber),
      data
    )
  },

  async create7(
    params: CreateWetaxRegistrationTaskParams,
    data: CreateWetaxRegistrationTaskRequest
  ) {
    // --------------------------------------------------
    // [RPAC-07][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/wetax-registration] 위택스 등록면허세 작업 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateWetaxRegistrationTaskResponse>(
      API.RPA.CREATE_7(params.registryManagementNumber),
      data
    )
  },

  async create8(
    params: CreateRegistrationCaseQueryTaskParams,
    data: CreateRegistrationCaseQueryTaskRequest
  ) {
    // --------------------------------------------------
    // [RPAC-08][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-case] 등기 신청사건 조회 작업 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateRegistrationCaseQueryTaskResponse>(
      API.RPA.CREATE_8(params.registryManagementNumber),
      data
    )
  },

  async create9(params: CreateAdminConsentTaskParams, data: CreateAdminConsentTaskRequest) {
    // --------------------------------------------------
    // [RPAC-09][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/admin-consent] 행정정보 동의요청 작업 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateAdminConsentTaskResponse>(
      API.RPA.CREATE_9(params.registryManagementNumber),
      data
    )
  },

  async create10(
    params: CreateRegistrationApplicationTaskParams,
    data: CreateRegistrationApplicationTaskRequest
  ) {
    // --------------------------------------------------
    // [RPAC-10][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-application] 등기신청서 작성 작업 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateRegistrationApplicationTaskResponse>(
      API.RPA.CREATE_10(params.registryManagementNumber),
      data
    )
  },

  async userTasks(params: GetTaskParams) {
    // --------------------------------------------------
    // [RPAC-11][GET - /api/registry/rpa/user-tasks/{taskToken}] RPA 작업 조회
    // --------------------------------------------------
    return apiHelpers.get<GetTaskResponse>(API.RPA.USER_TASKS(params.taskToken))
  },

  async result(params: SubmitResultParams, data: SubmitResultRequest) {
    // --------------------------------------------------
    // [RPAC-12][PATCH - /api/registry/rpa/user-tasks/{taskToken}/result] RPA 작업 결과 전달
    // --------------------------------------------------
    return apiHelpers.patch<SubmitResultResponse>(API.RPA.RESULT(params.taskToken), data)
  },

  async createFullCertificateIssue(
    params: CreateFullCertificateIssueTaskParams,
    data: CreateFullCertificateIssueTaskRequest
  ) {
    // --------------------------------------------------
    // [RPAC-13][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/full-certificate-issue] 등기사항전부증명서 발급 작업 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateFullCertificateIssueTaskResponse>(
      API.RPA.CREATE_FULL_CERTIFICATE_ISSUE(params.registryManagementNumber),
      data
    )
  }
}
