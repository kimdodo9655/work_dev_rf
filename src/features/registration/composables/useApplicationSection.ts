/**
 * 문서 경로: `@/src/features/registration/composables/useApplicationSection.ts`
 * 문서 제목: 기능 모듈: use-application-section
 */

import { computed, type Ref, ref, watch } from 'vue'

import { registryProgressAPI } from '@/api/services/registry'
import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import { useApplicationSectionDocument } from '@/features/registration/composables/useApplicationSectionDocument'
import { useApplicationSectionModal } from '@/features/registration/composables/useApplicationSectionModal'
import { useApplicationSectionTabs } from '@/features/registration/composables/useApplicationSectionTabs'
import type { ProgressType } from '@/types'
import { extractPrimaryPayload } from '@/utils/apiPayload'

export function useApplicationSection({
  registryManagementNumber,
  isOpen
}: {
  registryManagementNumber: Ref<string>
  isOpen: Ref<boolean>
}) {
  // 신청서 섹션에서 필요한 탭/문서/모달 상태를 한곳에 묶는 화면 단위 orchestrator다.
  const { formatCodeLabel, formatTextLabel } = useCodeReplacer()
  const { getErrorMessage } = useErrorHandler()
  const progressType = ref<ProgressType | undefined>()

  const {
    document,
    documentErrorMessage,
    documentLoading,
    fetchDocument,
    handleActiveApplicationChanged
  } = useApplicationSectionDocument({ getErrorMessage })

  const {
    activeTabIndex,
    canDeleteTab,
    closeAddModal,
    handleAddSaved,
    handleAddTab,
    handleDeleteTab,
    isDeletingTab,
    selectTab,
    showAddModal,
    successToastMessage,
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

  const showEditModal = ref(false)

  async function fetchBasicInfo() {
    if (!registryManagementNumber.value) {
      progressType.value = undefined
      return
    }

    try {
      const res = await registryProgressAPI.basicInfo({
        registryManagementNumber: registryManagementNumber.value
      })
      // 추가 가능한 등기유형은 사건 진행유형(progressType)에 따라 달라져 먼저 읽어 둔다.
      const data = extractPrimaryPayload<{ progressType?: ProgressType }>(res)
      progressType.value = data?.progressType
    } catch {
      progressType.value = undefined
    }
  }

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

  function closeEditModal() {
    showEditModal.value = false
  }

  function handleEditRegistryMethod() {
    // 수정 모드는 기존 신청서의 등기방식/연계시점만 바꾸므로 문서가 로드된 상태에서만 연다.
    if (!activeApplicationId.value || !document.value) return
    showEditModal.value = true
  }

  async function handleEditSaved() {
    if (!activeApplicationId.value) {
      showEditModal.value = false
      return
    }

    showEditModal.value = false
    // 수정 저장 후에는 현재 활성 신청서 문서를 다시 읽어 표와 미리보기를 함께 동기화한다.
    await fetchDocument(activeApplicationId.value)
  }

  watch(
    () => registryManagementNumber.value,
    (newValue) => {
      if (!newValue) {
        progressType.value = undefined
        return
      }

      // 사건 번호가 바뀌면 신청서 추가 가능 조건도 달라지므로 기본 정보를 재조회한다.
      void fetchBasicInfo()
    },
    { immediate: true }
  )

  watch(
    () => isOpen.value,
    (opened) => {
      if (opened && registryManagementNumber.value) {
        // 섹션이 다시 열릴 때 백엔드 진행유형이 바뀌었을 수 있어 최신값으로 맞춘다.
        void fetchBasicInfo()
      }
    }
  )

  return {
    activeTabIndex,
    canDeleteTab,
    closeAddModal,
    certModalApplicationId,
    activeSectionCode,
    sectionModalApplicationId,
    activeSectionTitle,
    closeCertModal,
    closeEditModal,
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
    handleAddSaved,
    handleDeleteTab,
    handleEditSaved,
    handleEditRegistryMethod,
    handleSectionClick,
    isDeletingTab,
    progressType,
    selectTab,
    showAddModal,
    showCertModal,
    showEditModal,
    showSectionModal,
    successToastMessage,
    tabs,
    tabsErrorMessage,
    tabsLoading
  }
}
