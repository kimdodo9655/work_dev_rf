/**
 * 문서 경로: `@/src/features/registration/composables/useCaseDetailProcess.ts`
 * 문서 제목: 기능 모듈: use-case-detail-process
 */

import { computed, nextTick, type Ref, ref, watch } from 'vue'

import { registryProgressAPI } from '@/api/services/registry'
import type { AccordionKey } from '@/composables/utils/useAccordionState'
import { useApiAlert } from '@/composables/utils/useApiAlert'
import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { useDialog } from '@/composables/utils/useDialog'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import type {
  ChangeRegistryProgressProcessQuery,
  ProcessActionResponse,
  ProcessStepResponse,
  RegistryProgressProcessResponse
} from '@/types'
import { extractRecordByKeys } from '@/utils/apiPayload'

interface ProcessScrollTarget {
  accordion: AccordionKey
  sectionId?: string
}

interface WorkProcessActionItem {
  action?: string
  nextStatus?: string
  nextStatusDescription?: string
  label: string
}

interface WorkProcessItem {
  id: string
  title: string
  descriptionLines: string[]
  buttons: WorkProcessActionItem[]
  isCurrent: boolean
}

const PROCESS_SCROLL_TARGET_MAP: Record<string, ProcessScrollTarget> = {
  ASSIGN_MANAGER: { accordion: 'REQ' },
  INSPECT_REGISTRY_INFO: { accordion: 'REQ' },
  REQUEST_RESUBMISSION: { accordion: 'REQ' },
  REGISTER_APPLICATION_INFO: { accordion: 'APP' },
  REQUEST_ADMIN_INFO_CONSENT: { accordion: 'ADMIN' },
  OBLIGOR_E_SIGNATURE: { accordion: 'PROG', sectionId: 'progress-e-sign' },
  OBLIGEE_E_SIGNATURE: { accordion: 'PROG', sectionId: 'progress-e-sign' },
  TAX_DECLARATION_AGENCY: { accordion: 'PROG', sectionId: 'progress-tax-declaration' },
  PURCHASE_HOUSING_BOND: { accordion: 'PROG', sectionId: 'progress-housing-bond' },
  REGISTER_LOAN_ACCOUNT: { accordion: 'PROG', sectionId: 'progress-loan-account' },
  WAITING_LOAN_PAYMENT: { accordion: 'PROG', sectionId: 'progress-loan-account' },
  LOAN_PAYMENT_COMPLETED: { accordion: 'PROG', sectionId: 'progress-loan-account' },
  REGISTER_TRANSFER_CERTIFICATE: { accordion: 'PROG', sectionId: 'progress-transfer-certificate' },
  CREATE_APPLICATION: { accordion: 'PROG', sectionId: 'progress-receipt-info' },
  INTERNET_REGISTRY_E_SIGNATURE: { accordion: 'PROG', sectionId: 'progress-e-sign-status' },
  REQUEST_CASE_DELEGATION: { accordion: 'PROG', sectionId: 'progress-receipt-info' },
  WAITING_CASE_DELEGATION: { accordion: 'PROG', sectionId: 'progress-receipt-info' },
  CASE_DELEGATION_COMPLETED: { accordion: 'PROG', sectionId: 'progress-case-delegation' },
  REGISTRY_RECEIVED: { accordion: 'PROG', sectionId: 'progress-receipt-info' },
  CREATE_COST_STATEMENT: { accordion: 'PROG', sectionId: 'progress-cost-statement' },
  REGISTER_COMPLETION_DOCUMENTS: {
    accordion: 'PROG',
    sectionId: 'progress-completion-doc-register'
  },
  SUBMIT_COMPLETION_DOCUMENTS: { accordion: 'PROG', sectionId: 'progress-completion-doc-submit' },
  REGISTRY_COMPLETED: { accordion: 'REQ' },
  REGISTRY_CANCELLED: { accordion: 'REQ' }
}

export function useCaseDetailProcess({
  registryManagementNumber,
  openMap,
  showAdminSection
}: {
  registryManagementNumber: Ref<string>
  openMap: Ref<Record<AccordionKey, boolean>>
  showAdminSection: Ref<boolean>
}) {
  // 역할: 진행 프로세스 조회 / 액션 실행 / 대상 섹션 스크롤
  const { getErrorMessage } = useErrorHandler()
  const { extractApiSuccessContent, extractApiErrorContent } = useApiAlert()
  const { formatCodeLabel } = useCodeReplacer()
  const { alert, confirm } = useDialog()

  const openedProcessId = ref('')
  const processLoading = ref(false)
  const processErrorMessage = ref('')
  const processData = ref<RegistryProgressProcessResponse | null>(null)
  const isChangingProcess = ref(false)

  const processItems = computed<WorkProcessItem[]>(() => {
    // 기준: API step 목록 -> 화면 표시 모델
    const steps = processData.value?.steps ?? []
    return steps.map((step, index) => {
      const actions = step.actions ?? []
      return {
        id: step.step || `STEP_${index + 1}`,
        title: step.stepTitle || step.step || `프로세스 ${index + 1}`,
        descriptionLines: toDescriptionLines(step),
        buttons: actions.map((action) => mapAction(action)),
        isCurrent: Boolean(step.isCurrentStep) || step.step === processData.value?.currentStatus
      }
    })
  })

  function toggleProcessItem(id: string) {
    const nextOpenedId = openedProcessId.value === id ? '' : id
    openedProcessId.value = nextOpenedId
    if (!nextOpenedId) return
    void scrollToProcessTarget(nextOpenedId)
  }

  function scrollElementWithOffset(element: HTMLElement, topOffset: number) {
    const y = window.scrollY + element.getBoundingClientRect().top - topOffset
    window.scrollTo({
      top: Math.max(0, y),
      behavior: 'smooth'
    })
  }

  function getHeaderHeight(): number {
    const fixedHeader = document.querySelector<HTMLElement>('.fixed-area')
    return fixedHeader?.offsetHeight ?? 0
  }

  async function scrollToProcessTarget(statusCode: string, retry = 0): Promise<void> {
    // 규칙: 대상 accordion이 닫혀 있으면 먼저 연다.
    const target = PROCESS_SCROLL_TARGET_MAP[statusCode]
    if (!target) return

    if (target.accordion === 'ADMIN' && !showAdminSection.value) {
      if (retry < 8) {
        window.setTimeout(() => {
          void scrollToProcessTarget(statusCode, retry + 1)
        }, 120)
      }
      return
    }

    if (!openMap.value[target.accordion]) {
      openMap.value[target.accordion] = true
    }

    await nextTick()
    await nextTick()

    const selector = target.sectionId
      ? `[data-scroll-id="${target.sectionId}"]`
      : `[data-scroll-id="accordion-${target.accordion}"]`
    const element = document.querySelector<HTMLElement>(selector)
    if (!element) {
      // 규칙: 비동기 렌더링 구간 고려 / 제한 횟수 재시도
      if (retry < 8) {
        window.setTimeout(() => {
          void scrollToProcessTarget(statusCode, retry + 1)
        }, 120)
      }
      return
    }

    const headerHeight = getHeaderHeight()
    const topOffset = target.accordion === 'REQ' ? headerHeight : headerHeight + 10
    scrollElementWithOffset(element, topOffset)
  }

  function mapAction(action: ProcessActionResponse): WorkProcessActionItem {
    const actionLabel = action.actionDescription
      ? formatCodeLabel(action.actionDescription, 'processActions')
      : formatCodeLabel(action.action, 'processActions')

    return {
      action: action.action,
      nextStatus: action.nextStatus,
      nextStatusDescription: action.nextStatusDescription,
      label: actionLabel || '상태 변경'
    }
  }

  function toDescriptionLines(step: ProcessStepResponse): string[] {
    const text = step.stepDescription?.trim()
    if (!text) return ['설명 정보가 없습니다.']
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  }

  function extractProcessData(payload: unknown): RegistryProgressProcessResponse | null {
    // 기준: steps 키가 있는 payload만 유효
    return extractRecordByKeys<RegistryProgressProcessResponse>(payload, ['steps']) ?? null
  }

  function findCurrentStepId(data: RegistryProgressProcessResponse | null): string {
    // 우선순위: isCurrentStep -> currentStatus 일치 -> 첫 번째 step
    if (!data?.steps || data.steps.length === 0) return ''
    const current =
      data.steps.find((step) => step.isCurrentStep) ??
      data.steps.find((step) => step.step === data.currentStatus) ??
      data.steps[0]
    return current?.step || ''
  }

  async function fetchProcess() {
    if (!registryManagementNumber.value) {
      processData.value = null
      processErrorMessage.value = '등기관리번호가 없습니다.'
      return
    }

    processLoading.value = true
    processErrorMessage.value = ''

    try {
      const response = await registryProgressAPI.process({
        registryManagementNumber: registryManagementNumber.value
      })
      const data = extractProcessData(response)
      processData.value = data
      openedProcessId.value = findCurrentStepId(data)
    } catch (error) {
      processData.value = null
      processErrorMessage.value = extractApiErrorContent(
        error,
        '업무 프로세스 조회 실패',
        getErrorMessage(error)
      ).message
    } finally {
      processLoading.value = false
    }
  }

  async function handleProcessActionClick(item: WorkProcessActionItem) {
    // 규칙: 중복 상태 변경 요청 금지
    if (isChangingProcess.value) return

    if (!item.nextStatus) {
      await alert({
        title: '상태 변경 실패',
        message: '다음 진행 상태(nextStatus) 정보가 없어 변경할 수 없습니다.'
      })
      return
    }

    const ok = await confirm({
      title: '진행상태 업데이트',
      message: `${item.label}를 진행하시겠습니까?`,
      confirmText: '진행',
      cancelText: '취소'
    })
    if (!ok) return

    isChangingProcess.value = true
    processErrorMessage.value = ''

    try {
      const response = await registryProgressAPI.changeProcess(
        { registryManagementNumber: registryManagementNumber.value },
        { newStatus: item.nextStatus as ChangeRegistryProgressProcessQuery['newStatus'] }
      )

      const dialog = extractApiSuccessContent(
        response,
        '처리 완료',
        '진행상태가 업데이트되었습니다.'
      )
      await alert({
        title: dialog.title,
        message: dialog.message
      })

      await fetchProcess()
    } catch (error) {
      const apiError = extractApiErrorContent(error, '처리 실패', getErrorMessage(error))
      await alert({
        title: apiError.title,
        message: apiError.message
      })
    } finally {
      isChangingProcess.value = false
    }
  }

  watch(
    () => registryManagementNumber.value,
    (value) => {
      if (value) {
        void fetchProcess()
        return
      }
      processData.value = null
      openedProcessId.value = ''
    },
    { immediate: true }
  )

  return {
    openedProcessId,
    processLoading,
    processErrorMessage,
    processItems,
    isChangingProcess,
    toggleProcessItem,
    handleProcessActionClick
  }
}
