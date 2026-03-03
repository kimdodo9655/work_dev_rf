/**
 * 문서 경로: `@/src/types/api/crypto.types.ts`
 * 문서 제목: crypto.types 구현 파일
 */

/**
 * CRYPTO API Types
 * @generated 2026-02-23
 */

/**
 * Z01-01
 * POST /api/admin/crypto/encrypt
 */
export type EncryptRequest = CryptoRequest

export type EncryptResponse = ApiResultCryptoResponse

/**
 * Z01-02
 * POST /api/admin/crypto/decrypt
 */
export type DecryptRequest = CryptoRequest

export type DecryptResponse = ApiResultCryptoResponse

/**
 * Z01-03
 * POST /api/admin/crypto/hash
 */
export type HashRequest = CryptoRequest

export type HashResponse = ApiResultCryptoResponse

// ==================== Schemas ====================

export interface ApiResultCryptoResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: CryptoResponse
}

export interface CryptoRequest {
  /** 암호화할 평문 */
  plainText?: string
  /** 복호화할 암호문 (Base64 인코딩) */
  cipherText?: string
}

export interface CryptoResponse {
  /** 평문 */
  plainText?: string
  /** 암호문 (Base64 인코딩) */
  cipherText?: string
  /** 사용된 암호화 알고리즘 */
  algorithm?: string
}
