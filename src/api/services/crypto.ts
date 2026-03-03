/**
 * 문서 경로: `@/src/api/services/crypto.ts`
 * 문서 제목: API 서비스: crypto
 */

// --------------------------------------------------
// [Z01] 암호화/복호화
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  DecryptRequest,
  DecryptResponse,
  EncryptRequest,
  EncryptResponse,
  HashRequest,
  HashResponse
} from '@/types'

export const cryptoAPI = {
  async encrypt(data: EncryptRequest) {
    // --------------------------------------------------
    // [Z01-01][POST - /api/admin/crypto/encrypt] 평문 암호화
    // --------------------------------------------------
    return apiHelpers.post<EncryptResponse>(API.CRYPTO.ENCRYPT, data)
  },

  async decrypt(data: DecryptRequest) {
    // --------------------------------------------------
    // [Z01-02][POST - /api/admin/crypto/decrypt] 암호문 복호화
    // --------------------------------------------------
    return apiHelpers.post<DecryptResponse>(API.CRYPTO.DECRYPT, data)
  },

  async hash(data: HashRequest) {
    // --------------------------------------------------
    // [Z01-03][POST - /api/admin/crypto/hash] SHA-256 해시 생성
    // --------------------------------------------------
    return apiHelpers.post<HashResponse>(API.CRYPTO.HASH, data)
  }
}
