/**
 * 문서 경로: `@/src/features/registration/composables/useApplicationSection.ts`
 * 문서 제목: 기능 모듈: use-application-section
 */

import { computed, type Ref } from 'vue'

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
  const { formatCodeLabel, formatTextLabel } = useCodeReplacer()
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

  function displayRegistryType(value?: string): string {
    return formatCodeLabel(value, 'registryTypes')
  }

  function displayRegistryCause(value?: string): string {
    return formatCodeLabel(value, 'registryCauses')
  }

  function displayRegistryMethod(value?: string): string {
    return formatCodeLabel(value, 'registryMethods')
  }

  function displayAdminInfoLinkTime(value?: string): string {
    return formatCodeLabel(value, 'adminInfoLinkTime')
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
    formatTextLabel,
    activeApplicationId,
    document,
    documentErrorMessage,
    documentLoading,
    handleAddTab,
    handleDeleteTab,
    handleEditRegistryMethod,
    handleSectionClick,
    isDeletingTab,
    selectTab,
    showCertModal,
    showSectionModal,
    tabs,
    tabsErrorMessage,
    tabsLoading
  }
}
