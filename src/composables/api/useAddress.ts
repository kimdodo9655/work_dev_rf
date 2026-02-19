/**
 * @file useAddress.ts
 * @description 주소/등기소 관련 Composable (조회 전용)
 * @domain [A01] 주소/등기소
 */

import { ref } from 'vue'

import { addressAPI } from '@/api/services/address'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import type { AddressItem } from '@/types'
import { logger } from '@/utils/logger'

/** axios 응답({data}) / DTO 응답(그 자체) 둘 다 지원 */
function unwrap<T>(res: any): T {
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return res as T
}

export function useAddress() {
  const { handleError } = useErrorHandler()

  const addresses = ref<AddressItem[]>([])
  const suggestions = ref<string[]>([])
  const isLoading = ref(false)
  const hasMore = ref(false)
  const nextCursorId = ref<number | null>(null)

  /**
   * 응답에서 items/scroll을 최대한 유연하게 뽑아내기
   * - 생성기/서버에 따라 { items, scroll } 이거나 { result: { items, scroll } } 등 케이스가 있을 수 있어 방어
   */
  function pickItemsAndScroll(payload: any): { items: AddressItem[]; scroll?: any } {
    const root = payload?.result ?? payload
    const items = (root?.items ?? root?.addresses ?? []) as AddressItem[]
    const scroll = root?.scroll
    return { items, scroll }
  }

  function pickSuggestions(payload: any): string[] {
    const root = payload?.result ?? payload
    return (root?.suggestions ?? root?.items ?? []) as string[]
  }

  const searchAddresses = async (keyword: string, cursorId?: number | null) => {
    if (!keyword || keyword.length < 2) {
      logger.warn('[ADDRESS] Keyword too short', { keyword })
      return
    }

    isLoading.value = true
    try {
      const res = await addressAPI.search({
        keyword,
        cursorId,
        size: 20
      })

      const payload = unwrap<any>(res)
      const { items, scroll } = pickItemsAndScroll(payload)

      logger.info('[ADDRESS] Search success', {
        keyword,
        count: items.length
      })

      if (!cursorId) {
        addresses.value = items
      } else {
        addresses.value.push(...items)
      }

      hasMore.value = !!scroll?.hasNext
      nextCursorId.value = scroll?.nextCursorId ?? null
    } catch (error) {
      logger.error('[ADDRESS] Search failed', { keyword, error })
      handleError(error, 'ADDRESS_SEARCH')
      addresses.value = []
      hasMore.value = false
      nextCursorId.value = null
    } finally {
      isLoading.value = false
    }
  }

  const getAddressSuggestions = async (keyword: string) => {
    if (!keyword || keyword.length < 1) {
      suggestions.value = []
      return
    }

    isLoading.value = true
    try {
      const res = await addressAPI.suggestions({
        keyword,
        limit: 5
      })

      const payload = unwrap<any>(res)
      const list = pickSuggestions(payload)

      logger.info('[ADDRESS] Suggestions success', {
        keyword,
        count: list.length
      })

      suggestions.value = list
    } catch (error) {
      logger.error('[ADDRESS] Suggestions failed', { keyword, error })
      handleError(error, 'ADDRESS_AUTOCOMPLETE')
      suggestions.value = []
    } finally {
      isLoading.value = false
    }
  }

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

  const reset = () => {
    addresses.value = []
    suggestions.value = []
    hasMore.value = false
    nextCursorId.value = null
    isLoading.value = false
    logger.info('[ADDRESS] Reset completed')
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
