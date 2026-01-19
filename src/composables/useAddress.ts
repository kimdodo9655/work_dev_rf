// src/composables/useAddress.ts
import { ref } from 'vue'

import { addressAPI } from '@/api/services/address'
import { useErrorHandler } from '@/composables/useErrorHandler'
import type { AddressItem } from '@/types'

export function useAddress() {
  const { handleError } = useErrorHandler()

  const addresses = ref<AddressItem[]>([])
  const suggestions = ref<string[]>([])
  const isLoading = ref(false)
  const hasMore = ref(false)
  const nextCursorId = ref<number | null>(null)

  /**
   * 주소 검색
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

  /**
   * 주소 자동완성
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

  return {
    addresses,
    suggestions,
    isLoading,
    hasMore,
    searchAddresses,
    getAddressSuggestions,
    loadMore,
    reset
  }
}
