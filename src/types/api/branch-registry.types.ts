/**
 * BRANCH_REGISTRY API Types
 * @generated 2025-01-27
 */

import type { ActionType, BranchRegistryCredentialResponse, QualifiedType } from './common.types'

/**
 * P02D-01
 * GET /api/branches/{branchId}/registry-credentials
 */
export interface GetRegistryCredentialsParams {
  /** 지점 ID */
  branchId: number
}

export type GetRegistryCredentialsResponse = BranchRegistryCredentialResponse

/**
 * P02D-02
 * PATCH /api/branches/{branchId}/registry-credentials
 */
export interface UpdateBranchRegistryCredentialsParams {
  /** 지점 ID */
  branchId: number
}

export type UpdateBranchRegistryCredentialsRequest = BranchRegistryCredentialItem[]

// ==================== Schemas ====================

/** 지점 인터넷등기소 아이디 항목 */
export interface BranchRegistryCredentialItem {
  action: ActionType
  /** 인터넷등기소 아이디 고유번호(MODIFY/DELETE 시 필수) */
  credentialId?: number
  qualifiedType: QualifiedType
  /** 자격자명 */
  qualifiedName: string
  /** 인터넷등기소 로그인 아이디 */
  registryLoginId: string
  /** 인터넷등기소 비밀번호 */
  registryPassword?: string
}
