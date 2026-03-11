/**
 * 문서 경로: `@/src/features/registration/composables/useApplicationSectionTabs.ts`
 * 문서 제목: 기능 모듈: use-application-section-tabs
 */

import { computed, type Ref, ref, watch } from 'vue'

import { registryTypeAPI } from '@/api/services/registry'
import { useApiAlert } from '@/composables/utils/useApiAlert'
import { useDialog } from '@/composables/utils/useDialog'
import { useThrottle } from '@/composables/utils/useThrottle'
import type { RegistryApplicationForm } from '@/features/registration/composables/applicationSection.types'
import { extractArrayByKeys } from '@/utils/apiPayload'

export function useApplicationSectionTabs({
  registryManagementNumber,
  isOpen,
  getErrorMessage,
  onActiveApplicationChanged
}: {
  registryManagementNumber: Ref<string>
  isOpen: Ref<boolean>
  getErrorMessage: (error: unknown) => string
  onActiveApplicationChanged: (applicationId?: number) => void
}) {
  const tabsLoading = ref(false)
  const tabsErrorMessage = ref('')
  const tabs = ref<RegistryApplicationForm[]>([])
  const activeTabIndex = ref(0)
  const tabsThrottle = useThrottle(1000)
  const deletingApplicationIds = ref<Set<number>>(new Set())
  const { alert, confirm } = useDialog()
  const { extractApiSuccessContent, extractApiErrorContent } = useApiAlert()

  const activeApplicationId = computed(() => {
    // 기준: 현재 탭의 applicationId
    const activeTab = tabs.value[activeTabIndex.value]
    return activeTab?.applicationId
  })

  async function fetchTabs() {
    if (!registryManagementNumber.value) {
      tabs.value = []
      tabsErrorMessage.value = '등기관리번호가 없습니다.'
      return
    }

    // 규칙: 연속 조회는 throttle로 흡수
    const result = await tabsThrottle.execute(async () => {
      tabsLoading.value = true
      tabsErrorMessage.value = ''
      try {
        const res = await registryTypeAPI.getList({
          registryManagementNumber: registryManagementNumber.value
        })
        tabs.value = extractArrayByKeys<RegistryApplicationForm>(res, ['items', 'content'])
        if (tabs.value.length > 0 && activeTabIndex.value >= tabs.value.length) {
          activeTabIndex.value = 0
        }
      } catch (e) {
        tabs.value = []
        tabsErrorMessage.value = getErrorMessage(e)
      } finally {
        tabsLoading.value = false
      }
    })

    if (result === null) return
  }

  function selectTab(index: number) {
    activeTabIndex.value = index
    onActiveApplicationChanged(activeApplicationId.value)
  }

  function handleAddTab() {
    // 상태: 미구현
  }

  function canDeleteTab(tab: RegistryApplicationForm) {
    // 규칙: MAIN 신청서는 삭제 제외
    return tab.registryRole !== 'MAIN'
  }

  function isDeletingTab(tab: RegistryApplicationForm) {
    return !!tab.applicationId && deletingApplicationIds.value.has(tab.applicationId)
  }

  function removeTabFromState(applicationId: number) {
    // 규칙: 삭제 후 active index 재정렬
    const removedIndex = tabs.value.findIndex((item) => item.applicationId === applicationId)
    if (removedIndex < 0) return

    const wasActive = activeTabIndex.value === removedIndex
    tabs.value = tabs.value.filter((item) => item.applicationId !== applicationId)

    if (tabs.value.length === 0) {
      activeTabIndex.value = 0
      onActiveApplicationChanged(undefined)
      return
    }

    if (activeTabIndex.value > removedIndex) {
      activeTabIndex.value -= 1
    }
    if (activeTabIndex.value >= tabs.value.length) {
      activeTabIndex.value = tabs.value.length - 1
    }

    if (wasActive) {
      onActiveApplicationChanged(activeApplicationId.value)
    }
  }

  async function handleDeleteTab(tab: RegistryApplicationForm) {
    if (!canDeleteTab(tab)) return
    if (!tab.applicationId) {
      await alert({
        title: '삭제 실패',
        message: '신청서 ID가 없어 삭제할 수 없습니다.'
      })
      return
    }
    if (deletingApplicationIds.value.has(tab.applicationId)) return

    const ok = await confirm({
      title: '등기신청서 삭제',
      message: '선택한 등기신청서를 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소'
    })
    if (!ok) return

    deletingApplicationIds.value.add(tab.applicationId)
    try {
      const response = await registryTypeAPI.delete({ applicationId: tab.applicationId })
      removeTabFromState(tab.applicationId)
      const dialog = extractApiSuccessContent(response, '삭제 완료', '등기신청서를 삭제했습니다.')
      await alert({
        title: dialog.title,
        message: dialog.message
      })
    } catch (e) {
      const dialog = extractApiErrorContent(e, '삭제 실패', getErrorMessage(e))
      await alert({
        title: dialog.title,
        message: dialog.message
      })
    } finally {
      deletingApplicationIds.value.delete(tab.applicationId)
    }
  }

  watch(
    () => registryManagementNumber.value,
    (newVal) => {
      if (newVal) {
        fetchTabs()
      }
    },
    { immediate: true }
  )

  watch(
    () => tabs.value.length,
    (length) => {
      // 동기화: 활성 applicationId 변경 통지
      if (length > 0) {
        onActiveApplicationChanged(activeApplicationId.value)
      } else {
        onActiveApplicationChanged(undefined)
      }
    }
  )

  watch(
    () => isOpen.value,
    (opened) => {
      if (opened && registryManagementNumber.value) {
        fetchTabs()
      }
    }
  )

  return {
    activeTabIndex,
    canDeleteTab,
    handleAddTab,
    handleDeleteTab,
    isDeletingTab,
    selectTab,
    tabs,
    tabsErrorMessage,
    tabsLoading
  }
}
