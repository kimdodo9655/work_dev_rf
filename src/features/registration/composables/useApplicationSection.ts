/**
 * 문서 경로: `@/src/features/registration/composables/useApplicationSection.ts`
 * 문서 제목: 기능 모듈: use-application-section
 */

import { computed, defineAsyncComponent, type Ref } from 'vue'

import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import { useApplicationSectionDocument } from '@/features/registration/composables/useApplicationSectionDocument'
import { useApplicationSectionModal } from '@/features/registration/composables/useApplicationSectionModal'
import { useApplicationSectionTabs } from '@/features/registration/composables/useApplicationSectionTabs'

export function useApplicationSection({
  registryManagementNumber,
  isOpen
}: {
  registryManagementNumber: Ref<string>
  isOpen: Ref<boolean>
}) {
  const showPdfConverter = import.meta.env.DEV || import.meta.env.VITE_IS_DEV === 'true'
  const pdfConverterComponent = showPdfConverter
    ? defineAsyncComponent(() => import('@/features/doc-templates/PdfConverter.vue'))
    : null

  const { findReplacement, replaceText } = useCodeReplacer()
  const { getErrorMessage } = useErrorHandler()

  const { document, documentErrorMessage, documentLoading, handleActiveApplicationChanged } =
    useApplicationSectionDocument({ getErrorMessage })

  const {
    activeTabIndex,
    canDeleteTab,
    handleAddTab,
    handleDeleteTab,
    isDeletingTab,
    selectTab,
    tabs,
    tabsErrorMessage,
    tabsLoading
  } = useApplicationSectionTabs({
    registryManagementNumber,
    isOpen,
    getErrorMessage,
    onActiveApplicationChanged: handleActiveApplicationChanged
  })

  const activeApplicationId = computed(() => {
    const activeTab = tabs.value[activeTabIndex.value]
    return activeTab?.applicationId
  })

  const { certModalApplicationId, closeCertModal, handleSectionClick, showCertModal } =
    useApplicationSectionModal({
      activeApplicationId
    })

  function displayCode(value: string | undefined, category: string): string {
    if (!value) return '-'
    return findReplacement(value, category) ?? replaceText(value)
  }

  function displayText(value?: string): string {
    return value ? replaceText(value) : '-'
  }

  function displayRegistryType(value?: string): string {
    return displayCode(value, 'registryTypes')
  }

  function displayRegistryCause(value?: string): string {
    return displayCode(value, 'registryCauses')
  }

  function displayRegistryMethod(value?: string): string {
    return displayCode(value, 'registryMethods')
  }

  function displayAdminInfoLinkTime(value?: string): string {
    return displayCode(value, 'adminInfoLinkTime')
  }

  function handleEditRegistryMethod() {
    console.log('등기방식 수정 - 추후 구현')
  }

  return {
    activeTabIndex,
    canDeleteTab,
    certModalApplicationId,
    closeCertModal,
    displayAdminInfoLinkTime,
    displayRegistryCause,
    displayRegistryMethod,
    displayRegistryType,
    displayText,
    document,
    documentErrorMessage,
    documentLoading,
    handleAddTab,
    handleDeleteTab,
    handleEditRegistryMethod,
    handleSectionClick,
    isDeletingTab,
    pdfConverterComponent,
    selectTab,
    showCertModal,
    tabs,
    tabsErrorMessage,
    tabsLoading
  }
}
