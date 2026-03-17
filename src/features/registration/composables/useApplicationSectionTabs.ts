/**
 * 문서 경로: `@/src/features/registration/composables/useApplicationSectionTabs.ts`
 * 문서 제목: 기능 모듈: use-application-section-tabs
 */

import { computed, type Ref, ref, watch } from 'vue'

import { registryTypeAPI } from '@/api/services/registry'
import { useApiAlert } from '@/composables/utils/useApiAlert'
import { useDialog } from '@/composables/utils/useDialog'
import { useThrottle } from '@/composables/utils/useThrottle'
import { canDeleteApplicationTab } from '@/features/registration/composables/applicationSection.rules'
import type { RegistryApplicationForm } from '@/features/registration/composables/applicationSection.types'

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
  const showAddModal = ref(false)
  const successToastMessage = ref('')
  const tabsThrottle = useThrottle(1000)
  const deletingApplicationIds = ref<Set<number>>(new Set())
  const { alert, confirm } = useDialog()
  const { extractApiSuccessContent, extractApiErrorContent } = useApiAlert()
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  const activeApplicationId = computed(() => {
    // 기준: 현재 탭의 applicationId
    const activeTab = tabs.value[activeTabIndex.value]
    return activeTab?.applicationId
  })

  async function fetchTabs(options?: { selectLast?: boolean }) {
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
        const res = await registryTypeAPI.getTabs({
          registryManagementNumber: registryManagementNumber.value
        })
        // service가 이미 payload 정규화를 끝낸 목록만 돌려주므로 화면은 tabs 배열만 신경 쓴다.
        tabs.value = res
        if (tabs.value.length > 0) {
          // 추가 직후에는 마지막 탭으로, 일반 재조회에서는 기존 선택을 가능한 범위에서 유지한다.
          if (options?.selectLast) {
            activeTabIndex.value = tabs.value.length - 1
          } else if (activeTabIndex.value >= tabs.value.length) {
            activeTabIndex.value = 0
          }
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
    showAddModal.value = true
  }

  function closeAddModal() {
    showAddModal.value = false
  }

  async function handleAddSaved() {
    showAddModal.value = false
    await fetchTabs({ selectLast: true })
    showSuccessToast('등기유형 추가가 완료되었습니다.')
  }

  function showSuccessToast(message: string) {
    successToastMessage.value = message
    // 새 토스트가 뜨면 이전 타이머를 지워 연속 저장 시 메시지가 즉시 사라지지 않게 한다.
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      successToastMessage.value = ''
      toastTimer = null
    }, 2200)
  }

  function canDeleteTab(tab: RegistryApplicationForm) {
    // 삭제 정책은 별도 규칙 함수에 두어 화면과 모달이 같은 기준을 공유하게 한다.
    return canDeleteApplicationTab(tab.registryRole)
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

    // 앞쪽 탭이 삭제되면 실제로 같은 탭을 보고 있더라도 index는 한 칸 당겨져야 한다.
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
        // 사건 번호가 바뀌면 완전히 다른 신청서 집합이므로 탭 목록을 즉시 다시 읽어온다.
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
        // 아코디언 재오픈 시 서버 상태가 바뀌었을 수 있어 탭 목록을 다시 동기화한다.
        fetchTabs()
      }
    }
  )

  return {
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
  }
}
