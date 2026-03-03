/**
 * 문서 경로: `@/src/features/registration/composables/useApplicationSectionDocument.ts`
 * 문서 제목: 기능 모듈: use-application-section-document
 */

import { ref } from 'vue'

import { registryTypeAPI } from '@/api/services/registry'
import { useThrottle } from '@/composables/utils/useThrottle'
import type { RegistryApplicationDocument } from '@/features/registration/composables/applicationSection.types'

function unwrapData<T>(res: unknown): T {
  if (res && typeof res === 'object') {
    const withData = res as { data?: unknown }
    if (withData.data && typeof withData.data === 'object' && 'data' in withData.data) {
      return (withData.data as { data: T }).data
    }
    if ('data' in withData) {
      return withData.data as T
    }
  }
  return undefined as unknown as T
}

export function useApplicationSectionDocument({
  getErrorMessage
}: {
  getErrorMessage: (error: unknown) => string
}) {
  const documentLoading = ref(false)
  const documentErrorMessage = ref('')
  const document = ref<RegistryApplicationDocument | null>(null)
  const documentThrottle = useThrottle(1000)

  async function fetchDocument(applicationId: number) {
    if (!applicationId) {
      document.value = null
      documentErrorMessage.value = '신청서 ID가 없습니다.'
      return
    }

    const result = await documentThrottle.execute(async () => {
      documentLoading.value = true
      documentErrorMessage.value = ''
      try {
        const res = await registryTypeAPI.documents({ applicationId })
        const data = unwrapData<RegistryApplicationDocument>(res)
        document.value = data || null
      } catch (e) {
        document.value = null
        documentErrorMessage.value = getErrorMessage(e)
      } finally {
        documentLoading.value = false
      }
    })

    if (result === null) return
  }

  function handleActiveApplicationChanged(applicationId?: number) {
    if (applicationId) {
      void fetchDocument(applicationId)
      return
    }
    document.value = null
    documentErrorMessage.value = ''
  }

  return {
    document,
    documentErrorMessage,
    documentLoading,
    handleActiveApplicationChanged
  }
}
