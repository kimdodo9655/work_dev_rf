/**
 * @file useAddress.ts
 * @description 주소/등기소 관련 Composable (조회 전용)
 * @domain [A01] 주소/등기소
 *
 * [A01-01] 주소 검색
 * [A01-02] 주소 자동 완성
 * [A01-03] 등기소 목록 조회
 */

import { ref } from 'vue'

import { addressAPI } from '@/api/services_old/address'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import type { AddressItem } from '@/types'
import { logger } from '@/utils/logger'

export function useAddress() {
  const { handleError } = useErrorHandler()

  // ============================================================================
  // State
  // ============================================================================

  const addresses = ref<AddressItem[]>([])
  const suggestions = ref<string[]>([])
  const isLoading = ref(false)
  const hasMore = ref(false)
  const nextCursorId = ref<number | null>(null)

  // ============================================================================
  // API Functions
  // ============================================================================

  /**
   * [A01-01] 주소 검색
   * API: GET /api/addresses
   *
   * @param keyword - 검색 키워드
   * @param cursorId - 커서 ID (페이지네이션용)
   */
  const searchAddresses = async (keyword: string, cursorId?: number | null) => {
    if (!keyword || keyword.length < 2) {
      logger.warn('[ADDRESS] Keyword too short', { keyword })
      return
    }

    isLoading.value = true
    try {
      const response = await addressAPI.search({
        keyword,
        cursorId,
        size: 20
      })

      // ✅ response.data.items로 접근
      logger.info('[ADDRESS] Search success', {
        keyword,
        count: response.data?.items?.length || 0
      })

      // 첫 검색이면 초기화, 아니면 추가
      if (!cursorId) {
        addresses.value = response.data?.items || []
      } else {
        addresses.value.push(...(response.data?.items || []))
      }

      hasMore.value = response.data?.scroll?.hasNext || false
      nextCursorId.value = response.data?.scroll?.nextCursorId || null
    } catch (error) {
      logger.error('[ADDRESS] Search failed', { keyword, error })
      handleError(error, 'ADDRESS_SEARCH')
      addresses.value = []
      hasMore.value = false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * [A01-02] 주소 자동완성
   * API: GET /api/addresses/suggestions
   *
   * @param keyword - 검색 키워드
   */
  const getAddressSuggestions = async (keyword: string) => {
    if (!keyword || keyword.length < 1) {
      suggestions.value = []
      return
    }

    isLoading.value = true
    try {
      const response = await addressAPI.suggestions({
        keyword,
        limit: 5
      })

      // ✅ response.data.suggestions로 접근
      logger.info('[ADDRESS] Suggestions success', {
        keyword,
        count: response.data?.suggestions?.length || 0
      })

      suggestions.value = response.data?.suggestions || []
    } catch (error) {
      logger.error('[ADDRESS] Suggestions failed', { keyword, error })
      handleError(error, 'ADDRESS_AUTOCOMPLETE')
      suggestions.value = []
    } finally {
      isLoading.value = false
    }
  }

  // ============================================================================
  // Utility Functions
  // ============================================================================

  /**
   * 더 불러오기 (무한 스크롤)
   *
   * @param keyword - 검색 키워드
   */
  const loadMore = async (keyword: string) => {
    if (!hasMore.value || isLoading.value) {
      logger.warn('[ADDRESS] Cannot load more', {
        hasMore: hasMore.value,
        isLoading: isLoading.value
      })
      return
    }
    await searchAddresses(keyword, nextCursorId.value)
  }

  /**
   * 검색 초기화
   */
  const reset = () => {
    addresses.value = []
    suggestions.value = []
    hasMore.value = false
    nextCursorId.value = null
    isLoading.value = false
    logger.info('[ADDRESS] Reset completed')
  }

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State
    addresses,
    suggestions,
    isLoading,
    hasMore,

    // API Functions
    searchAddresses,
    getAddressSuggestions,

    // Utility Functions
    loadMore,
    reset
  }
}
