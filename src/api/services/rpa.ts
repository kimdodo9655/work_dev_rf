// --------------------------------------------------
// [RPAC] RPA
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  CreateAdminConsentTaskParams,
  CreateEtaxAcquisitionTaskParams,
  CreateEtaxRegistrationTaskParams,
  CreateFullCertificateIssueTaskParams,
  CreateFullCertificateViewTaskParams,
  CreatePropertyDescriptionTaskParams,
  CreateRegistrationApplicationTaskParams,
  CreateRegistrationCaseQueryTaskParams,
  CreateRegistrationPasswordTaskParams,
  CreateWetaxAcquisitionTaskParams,
  CreateWetaxRegistrationTaskParams,
  GetTaskParams,
  SubmitResultParams
} from '@/types'

export const rpaAPI = {
  async create(params: CreateFullCertificateViewTaskParams) {
    // --------------------------------------------------
    // [RPAC-01][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/full-certificate-view] 등기사항전부증명서 열람 작업 등록
    // --------------------------------------------------
    return apiHelpers.post(API.RPA.CREATE(params.registryManagementNumber))
  },

  async create2(params: CreatePropertyDescriptionTaskParams) {
    // --------------------------------------------------
    // [RPAC-02][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/property-description] 부동산의표시 생성 작업 등록
    // --------------------------------------------------
    return apiHelpers.post(API.RPA.CREATE_2(params.registryManagementNumber))
  },

  async create3(params: CreateRegistrationPasswordTaskParams) {
    // --------------------------------------------------
    // [RPAC-03][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-password] 등기필정보 비밀번호 조회 작업 등록
    // --------------------------------------------------
    return apiHelpers.post(API.RPA.CREATE_3(params.registryManagementNumber))
  },

  async create4(params: CreateEtaxAcquisitionTaskParams) {
    // --------------------------------------------------
    // [RPAC-04][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/etax-acquisition] 이택스 취득세 작업 등록
    // --------------------------------------------------
    return apiHelpers.post(API.RPA.CREATE_4(params.registryManagementNumber))
  },

  async create5(params: CreateEtaxRegistrationTaskParams) {
    // --------------------------------------------------
    // [RPAC-05][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/etax-registration] 이택스 등록면허세 작업 등록
    // --------------------------------------------------
    return apiHelpers.post(API.RPA.CREATE_5(params.registryManagementNumber))
  },

  async create6(params: CreateWetaxAcquisitionTaskParams) {
    // --------------------------------------------------
    // [RPAC-06][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/wetax-acquisition] 위택스 취득세 작업 등록
    // --------------------------------------------------
    return apiHelpers.post(API.RPA.CREATE_6(params.registryManagementNumber))
  },

  async create7(params: CreateWetaxRegistrationTaskParams) {
    // --------------------------------------------------
    // [RPAC-07][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/wetax-registration] 위택스 등록면허세 작업 등록
    // --------------------------------------------------
    return apiHelpers.post(API.RPA.CREATE_7(params.registryManagementNumber))
  },

  async create8(
    params: CreateRegistrationCaseQueryTaskParams,
    _query: CreateRegistrationCaseQueryTaskParams
  ) {
    // --------------------------------------------------
    // [RPAC-08][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-case] 등기 신청사건 조회 작업 등록
    // --------------------------------------------------
    return apiHelpers.post(API.RPA.CREATE_8(params.registryManagementNumber))
  },

  async create9(params: CreateAdminConsentTaskParams) {
    // --------------------------------------------------
    // [RPAC-09][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/admin-consent] 행정정보 동의요청 작업 등록
    // --------------------------------------------------
    return apiHelpers.post(API.RPA.CREATE_9(params.registryManagementNumber))
  },

  async create10(params: CreateRegistrationApplicationTaskParams) {
    // --------------------------------------------------
    // [RPAC-10][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-application] 등기신청서 작성 작업 등록
    // --------------------------------------------------
    return apiHelpers.post(API.RPA.CREATE_10(params.registryManagementNumber))
  },

  async userTasks(params: GetTaskParams) {
    // --------------------------------------------------
    // [RPAC-11][GET - /api/registry/rpa/user-tasks/{taskToken}] RPA 작업 조회
    // --------------------------------------------------
    return apiHelpers.get(API.RPA.USER_TASKS(params.taskToken))
  },

  async result(params: SubmitResultParams) {
    // --------------------------------------------------
    // [RPAC-12][PATCH - /api/registry/rpa/user-tasks/{taskToken}/result] RPA 작업 결과 전달
    // --------------------------------------------------
    return apiHelpers.patch(API.RPA.RESULT(params.taskToken))
  },

  async createFullCertificateIssue(params: CreateFullCertificateIssueTaskParams) {
    // --------------------------------------------------
    // [RPAC-13][POST - /api/registry/rpa/user-tasks/{registryManagementNumber}/full-certificate-issue] 등기사항전부증명서 발급 작업 등록
    // --------------------------------------------------
    return apiHelpers.post(API.RPA.CREATE_FULL_CERTIFICATE_ISSUE(params.registryManagementNumber))
  }
}
