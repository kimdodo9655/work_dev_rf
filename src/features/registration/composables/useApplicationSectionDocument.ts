/**
 * 문서 경로: `@/src/features/registration/composables/useApplicationSectionDocument.ts`
 * 문서 제목: 기능 모듈: use-application-section-document
 */

import { ref } from 'vue'

import { registryTypeAPI } from '@/api/services/registry'
import type { RegistryApplicationDocument } from '@/features/registration/composables/applicationSection.types'
import { extractPrimaryPayload } from '@/utils/apiPayload'

export function useApplicationSectionDocument({
  getErrorMessage
}: {
  getErrorMessage: (error: unknown) => string
}) {
  const documentLoading = ref(false)
  const documentErrorMessage = ref('')
  const document = ref<RegistryApplicationDocument | null>(null)
  const lastRequestedApplicationId = ref<number | null>(null)
  const currentRequestToken = ref(0)

  async function fetchDocument(applicationId: number) {
    if (!applicationId) {
      document.value = null
      documentErrorMessage.value = '신청서 ID가 없습니다.'
      return
    }

    const requestToken = currentRequestToken.value + 1
    currentRequestToken.value = requestToken
    lastRequestedApplicationId.value = applicationId
    documentLoading.value = true
    documentErrorMessage.value = ''

    try {
      const res = await registryTypeAPI.documents({ applicationId })
      if (
        requestToken !== currentRequestToken.value ||
        lastRequestedApplicationId.value !== applicationId
      ) {
        return
      }

      const data = extractPrimaryPayload<RegistryApplicationDocument>(res)
      document.value = data || null
    } catch (e) {
      if (
        requestToken !== currentRequestToken.value ||
        lastRequestedApplicationId.value !== applicationId
      ) {
        return
      }

      document.value = null
      documentErrorMessage.value = getErrorMessage(e)
    } finally {
      if (requestToken === currentRequestToken.value) {
        documentLoading.value = false
      }
    }
  }

  function handleActiveApplicationChanged(applicationId?: number) {
    // 기준: 활성 신청서가 없으면 문서 상태 초기화
    if (applicationId) {
      void fetchDocument(applicationId)
      return
    }
    document.value = null
    documentErrorMessage.value = ''
    documentLoading.value = false
  }

  return {
    document,
    documentErrorMessage,
    documentLoading,
    fetchDocument,
    handleActiveApplicationChanged
  }
}
