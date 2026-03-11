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
  // 분기: 개발 환경에서만 PDF 변환기 노출
  const showPdfConverter = import.meta.env.DEV || import.meta.env.VITE_IS_DEV === 'true'
  const pdfConverterComponent = showPdfConverter
    ? defineAsyncComponent(() => import('@/features/doc-templates/PdfConverter.vue'))
    : null

  const { findOriginalCode, findReplacement, replaceText } = useCodeReplacer()
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
    // 기준: 현재 활성 탭의 applicationId
    const activeTab = tabs.value[activeTabIndex.value]
    return activeTab?.applicationId
  })

  const {
    activeSectionCode,
    sectionModalApplicationId,
    activeSectionTitle,
    certModalApplicationId,
    closeCertModal,
    closeSectionModal,
    handleSectionClick,
    showCertModal,
    showSectionModal
  } = useApplicationSectionModal({
    activeApplicationId
  })

  function displayCode(value: string | undefined, category: string): string {
    if (!value) return '-'
    const original = String(value)
    const replaced = findReplacement(original, category) ?? replaceText(original)
    if (replaced !== original) return `${original} -> ${replaced}`
    const inferredCode = findOriginalCode(original, category)
    return inferredCode ? `${inferredCode} -> ${original}` : original
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
    // 상태: 미구현
  }

  return {
    activeTabIndex,
    canDeleteTab,
    certModalApplicationId,
    activeSectionCode,
    sectionModalApplicationId,
    activeSectionTitle,
    closeCertModal,
    closeSectionModal,
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
    showSectionModal,
    tabs,
    tabsErrorMessage,
    tabsLoading
  }
}
