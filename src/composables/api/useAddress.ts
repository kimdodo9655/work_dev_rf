/**
 * @file useAddress.ts
 * @description 주소/등기소 관련 Composable (조회 전용)
 * @domain [A01] 주소/등기소
 */

import { ref } from 'vue'

import { addressAPI } from '@/api/services/address'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import type { AddressItem } from '@/types'

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

  // [A01-01] 주소 검색 : useQuery 패턴
  /**
   * 주소 검색
   * API: GET /api/addresses
   */
  const searchAddresses = async (keyword: string, cursorId?: number | null) => {
    if (!keyword || keyword.length < 2) {
      return
    }

    isLoading.value = true
    try {
      const response = await addressAPI.search({
        keyword,
        cursorId,
        size: 20
      })

      // 첫 검색이면 초기화, 아니면 추가
      if (!cursorId) {
        addresses.value = response.data.items
      } else {
        addresses.value.push(...response.data.items)
      }

      hasMore.value = response.data.scroll.hasNext
      nextCursorId.value = response.data.scroll.nextCursorId
    } catch (error) {
      handleError(error, 'ADDRESS_SEARCH')
    } finally {
      isLoading.value = false
    }
  }

  // [A01-02] 주소 자동완성 : useQuery 패턴
  /**
   * 주소 자동완성
   * API: GET /api/addresses/suggestions
   */
  const getAddressSuggestions = async (keyword: string) => {
    if (!keyword || keyword.length < 1) {
      suggestions.value = []
      return
    }

    try {
      const response = await addressAPI.suggestions({
        keyword,
        limit: 5
      })
      suggestions.value = response.data.suggestions
    } catch (error) {
      handleError(error, 'ADDRESS_AUTOCOMPLETE')
    }
  }

  // ============================================================================
  // Utility Functions
  // ============================================================================

  /**
   * 더 불러오기 (무한 스크롤)
   */
  const loadMore = async (keyword: string) => {
    if (!hasMore.value || isLoading.value) return
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
