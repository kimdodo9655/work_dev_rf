<!-- 문서 경로: `@/src/features/registration/pages/CaseDetailPage.vue`
문서 제목: 기능 페이지/컴포넌트: case-detail-page -->

<template>
  <section class="detail-layout">
    <!-- 좌측: 업무 프로세스 아코디언 -->
    <aside class="sidebar">
      <section class="work-process">
        <h2 class="work-process-title">업무 프로세스</h2>

        <div v-if="processLoading" class="process-state">업무 프로세스를 불러오는 중입니다.</div>
        <div v-else-if="processErrorMessage" class="process-state error">
          {{ processErrorMessage }}
        </div>
        <div v-else-if="processItems.length === 0" class="process-state">
          표시할 업무 프로세스가 없습니다.
        </div>

        <ul v-else class="process-list">
          <li v-for="(item, index) in processItems" :key="item.id" class="process-item-wrap">
            <article :class="['process-item', { active: item.isCurrent }]">
              <button
                type="button"
                class="process-header-btn"
                @click="toggleProcessItem(item.id)"
                :aria-expanded="openedProcessId === item.id"
              >
                <span class="process-header-title">{{ item.title }}</span>
                <span v-if="openedProcessId !== item.id" class="process-arrow">&gt;</span>
              </button>

              <div v-if="openedProcessId === item.id" class="process-body">
                <p
                  class="process-text"
                  v-for="(line, lineIdx) in item.descriptionLines"
                  :key="lineIdx"
                >
                  {{ line }}
                </p>
                <div class="process-buttons">
                  <button
                    v-for="(btn, btnIdx) in item.buttons"
                    :key="`${item.id}-btn-${btnIdx}-${btn.action || 'ACTION'}`"
                    type="button"
                    class="process-btn"
                    :disabled="isChangingProcess"
                    @click="handleProcessActionClick(btn)"
                  >
                    {{ btn.label }}
                  </button>
                </div>
              </div>
            </article>

            <div
              v-if="index < processItems.length - 1"
              class="process-dot"
              aria-hidden="true"
            ></div>
          </li>
        </ul>
      </section>
    </aside>

    <!-- 우측: 전체 UI -->
    <main class="content">
      <div class="accordion">
        <!-- 1) 등기 의뢰 정보 -->
        <div data-scroll-id="accordion-REQ">
          <AccordionSection title="등기 의뢰 정보" :is-open="openMap.REQ" @toggle="toggle('REQ')">
            <RequestInfoSection
              :registry-management-number="registryManagementNumber"
              :is-open="openMap.REQ"
            />
          </AccordionSection>
        </div>

        <!-- 2) 등기신청서 정보 등록 -->
        <div data-scroll-id="accordion-APP">
          <AccordionSection
            title="등기신청서 정보 등록"
            :is-open="openMap.APP"
            @toggle="toggle('APP')"
          >
            <ApplicationSection
              :registry-management-number="registryManagementNumber"
              :is-open="openMap.APP"
            />
          </AccordionSection>
        </div>

        <!-- 3) 행정정보 제공 요구 동의요청 -->
        <div v-show="showAdminSection" data-scroll-id="accordion-ADMIN">
          <AccordionSection
            title="행정정보 제공 요구 동의요청"
            :is-open="openMap.ADMIN"
            @toggle="toggle('ADMIN')"
          >
            <AdminSection
              :registry-management-number="registryManagementNumber"
              :is-open="openMap.ADMIN"
              @loaded="handleAdminLoaded"
            />
          </AccordionSection>
        </div>

        <!-- 4) 등기 진행 정보 등록 -->
        <div data-scroll-id="accordion-PROG">
          <AccordionSection
            title="등기 진행 정보 등록"
            :is-open="openMap.PROG"
            @toggle="toggle('PROG')"
          >
            <ProgressSection
              :registry-management-number="registryManagementNumber"
              :is-open="openMap.PROG"
            />
          </AccordionSection>
        </div>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { registryProgressAPI } from '@/api/services/registry'
import type { AccordionKey } from '@/composables/utils/useAccordionState'
import { useAccordionState } from '@/composables/utils/useAccordionState'
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

import AccordionSection from './AccordionSection.vue'
import AdminSection from './AdminSection.vue'
import ApplicationSection from './ApplicationSection.vue'
import ProgressSection from './ProgressSection.vue'
import RequestInfoSection from './RequestInfoSection.vue'

const route = useRoute()
const registryManagementNumber = computed(() => String(route.params.caseId ?? ''))
const { getErrorMessage } = useErrorHandler()
const { extractApiSuccessContent, extractApiErrorContent } = useApiAlert()
const { findReplacement } = useCodeReplacer()
const { alert, confirm } = useDialog()

// 아코디언 상태 관리
const { openMap, toggle } = useAccordionState()

// AdminSection 표시 여부 (데이터가 있을 때만 표시)
const showAdminSection = ref(false) // 초기에는 숨김 (AdminSection이 데이터 로드 후 알려줌)
const openedProcessId = ref('')
const processLoading = ref(false)
const processErrorMessage = ref('')
const processData = ref<RegistryProgressProcessResponse | null>(null)
const isChangingProcess = ref(false)

interface ProcessScrollTarget {
  accordion: AccordionKey
  sectionId?: string
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

interface WorkProcessItem {
  id: string
  title: string
  descriptionLines: string[]
  buttons: WorkProcessActionItem[]
  isCurrent: boolean
}

interface WorkProcessActionItem {
  action?: string
  nextStatus?: string
  nextStatusDescription?: string
  label: string
}

const processItems = computed<WorkProcessItem[]>(() => {
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

function handleAdminLoaded(hasData: boolean) {
  showAdminSection.value = hasData
}

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
  const replacedLabel =
    action.actionDescription ||
    findReplacement(action.action, 'processActions') ||
    action.action ||
    '상태 변경'
  const actionLabel = action.action ? `${action.action} -> ${replacedLabel}` : replacedLabel

  return {
    action: action.action,
    nextStatus: action.nextStatus,
    nextStatusDescription: action.nextStatusDescription,
    label: actionLabel
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

function unwrapProcessData(payload: unknown): RegistryProgressProcessResponse | null {
  if (!payload || typeof payload !== 'object') return null

  const withData = payload as { data?: unknown; steps?: unknown }
  if (Array.isArray(withData.steps)) {
    return payload as RegistryProgressProcessResponse
  }
  if (withData.data && typeof withData.data === 'object') {
    return withData.data as RegistryProgressProcessResponse
  }
  return null
}

function findCurrentStepId(data: RegistryProgressProcessResponse | null): string {
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
    const data = unwrapProcessData(response)
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

    const dialog = extractApiSuccessContent(response, '처리 완료', '진행상태가 업데이트되었습니다.')
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
</script>

<style scoped lang="scss">
.detail-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  background-color: #fff;
}

.sidebar {
  position: sticky;
  top: 16px;
}

.work-process {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
}

.work-process-title {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.process-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.process-state {
  font-size: 12px;
  color: #6b7280;
  padding: 6px 2px 2px;
}

.process-state.error {
  color: #b91c1c;
}

.process-item-wrap {
  display: block;
}

.process-item {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.process-item.active {
  border-color: #2563eb;
  background: #f9fafb;
}

.process-header-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  background: transparent;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
}

.process-header-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.process-arrow {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
}

.process-body {
  padding: 0 12px 10px;
}

.process-text {
  margin: 0;
  font-size: 12px;
  color: #4b5563;
  line-height: 1.45;
}

.process-buttons {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.process-btn {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: #374151;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.process-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.process-dot {
  display: none;
}

.process-item-wrap + .process-item-wrap {
  margin-top: 8px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 40px 20px 80px;
  min-width: 0;
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
