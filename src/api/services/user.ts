// --------------------------------------------------
// [P03] 사용자
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  ApproveUserParams,
  ApproveUserResponse,
  CheckDuplicateEmailQuery,
  CheckDuplicateEmailResponse,
  CheckDuplicateLoginIdQuery,
  CheckDuplicateLoginIdResponse,
  CreateUserRequest,
  CreateUserResponse,
  GetAssignableUsersQuery,
  GetAssignableUsersResponse,
  GetProfileResponse,
  GetUserDetailParams,
  GetUserDetailResponse,
  SearchUsersQuery,
  SearchUsersResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdateUserParams,
  UpdateUserRequest,
  UpdateUserResponse,
  VerifyEmailParams,
  VerifyEmailResponse
} from '@/types'
import type { GetAssignedBanks_1Response } from '@/types/api'

export const userAPI = {
  async getProfile() {
    // --------------------------------------------------
    // [P03-01][GET - /api/users/profile] 내 정보 조회
    // --------------------------------------------------
    return apiHelpers.get<GetProfileResponse>(API.USER.PROFILE)
  },

  async search(query: SearchUsersQuery) {
    // --------------------------------------------------
    // [P03-02][GET - /api/users/search] 사용자 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<SearchUsersResponse>(API.USER.SEARCH, query)
  },

  async getDetail(params: GetUserDetailParams) {
    // --------------------------------------------------
    // [P03-03][GET - /api/users/{userId}] 사용자 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetUserDetailResponse>(API.USER.DETAIL(params.userId))
  },

  async update(params: UpdateUserParams, data: UpdateUserRequest) {
    // --------------------------------------------------
    // [P03-04][PATCH - /api/users/{userId}] 사용자 수정
    // --------------------------------------------------
    return apiHelpers.patch<UpdateUserResponse>(API.USER.UPDATE(params.userId), data)
  },

  async create(data: CreateUserRequest) {
    // --------------------------------------------------
    // [P03-05][POST - /api/users] 사용자 등록
    // --------------------------------------------------
    return apiHelpers.post<CreateUserResponse>(API.USER.CREATE, data)
  },

  async approve(params: ApproveUserParams) {
    // --------------------------------------------------
    // [P03-06][POST - /api/users/{userId}/approve] 사용자 승인
    // --------------------------------------------------
    return apiHelpers.post<ApproveUserResponse>(API.USER.APPROVE(params.userId))
  },

  async emailVerify(params: VerifyEmailParams) {
    // --------------------------------------------------
    // [P03-07][POST - /api/users/{userId}/email-verify] 이메일 인증 완료
    // --------------------------------------------------
    return apiHelpers.post<VerifyEmailResponse>(API.USER.EMAIL_VERIFY(params.userId))
  },

  async assignable(query: GetAssignableUsersQuery) {
    // --------------------------------------------------
    // [P03-08][GET - /api/users/assignable] 업무배정 가능 담당자 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetAssignableUsersResponse>(API.USER.ASSIGNABLE, query)
  },

  async assignedBanks() {
    // --------------------------------------------------
    // [P03-09][GET - /api/users/assigned-banks] 담당 금융기관 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetAssignedBanks_1Response>(API.USER.ASSIGNED_BANKS)
  },

  async checkLoginId(query: CheckDuplicateLoginIdQuery) {
    // --------------------------------------------------
    // [P03-10][GET - /api/users/check-login-id] 사용자 아이디 중복 확인
    // --------------------------------------------------
    return apiHelpers.get<CheckDuplicateLoginIdResponse>(API.USER.CHECK_LOGIN_ID, query)
  },

  async checkEmail(query: CheckDuplicateEmailQuery) {
    // --------------------------------------------------
    // [P03-11][GET - /api/users/check-email] 사용자 이메일 중복 확인
    // --------------------------------------------------
    return apiHelpers.get<CheckDuplicateEmailResponse>(API.USER.CHECK_EMAIL, query)
  },

  async updateProfile(data: UpdateProfileRequest) {
    // --------------------------------------------------
    // [P03-12][PATCH - /api/users/profile] 내 정보 수정
    // --------------------------------------------------
    return apiHelpers.patch<UpdateProfileResponse>(API.USER.UPDATE_PROFILE, data)
  }
}
