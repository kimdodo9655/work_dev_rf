<template>
  <div v-if="tabs.length > 0" class="application-container">
    <!-- 탭 메뉴 -->
    <div class="tabs-container">
      <div class="tabs-header">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.applicationId"
          :class="['tab-item', { active: activeTabIndex === index }]"
          @click="selectTab(index)"
        >
          <span class="tab-label">{{
            displayRegistryType(tab.registryTypeLabel ?? tab.registryType) || '등기신청서'
          }}</span>
          <!-- 삭제 버튼 (추후 기능 구현) -->
          <button
            v-if="canDeleteTab(tab)"
            class="tab-close-btn"
            :disabled="isDeletingTab(tab)"
            @click.stop="handleDeleteTab(tab)"
          >
            ×
          </button>
        </div>

        <!-- 탭 추가 버튼 (추후 기능 구현) -->
        <button class="tab-add-btn" @click="handleAddTab">+ 추가</button>
      </div>

      <!-- 탭 콘텐츠 -->
      <div class="tab-content">
        <div v-if="documentLoading" class="muted">불러오는 중…</div>
        <div v-else-if="documentErrorMessage" class="error">{{ documentErrorMessage }}</div>

        <div v-else-if="document" class="document-detail">
          <!-- 기본 정보 표 -->
          <div class="info-table-wrapper">
            <table class="info-table">
              <thead>
                <tr>
                  <th>등기유형</th>
                  <th>등기원인</th>
                  <th>등기방식</th>
                  <th>행정정보 연계시점</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ displayRegistryType(document.registryType) }}</td>
                  <td>{{ displayRegistryCause(document.registryCause) }}</td>
                  <td>
                    <div class="editable-cell">
                      <span>{{ displayRegistryMethod(document.registryMethod) }}</span>
                      <button class="edit-btn" @click="handleEditRegistryMethod">수정</button>
                    </div>
                  </td>
                  <td>{{ displayAdminInfoLinkTime(document.adminInfoLinkTime) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 섹션 버튼들 -->
          <div v-if="document.sections && document.sections.length > 0" class="sections-container">
            <div class="sections-title">등기신청서 섹션</div>
            <div class="sections-buttons">
              <button
                v-for="section in document.sections"
                :key="section.code"
                class="section-btn"
                @click="handleSectionClick(section)"
              >
                {{ displayText(section.title) }}
              </button>
            </div>
          </div>

          <!-- 신청서 양식 (개발 환경 전용) -->
          <component :is="pdfConverterComponent" v-if="pdfConverterComponent" />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <div class="muted">등록된 등기신청서가 없습니다.</div>
    <button class="add-first-btn" @click="handleAddTab">첫 등기신청서 추가</button>
  </div>

  <!-- 등기권리증 정보 등록 모달 -->
  <CaseCertInfoRegModal
    v-if="showCertModal && certModalApplicationId"
    :application-id="certModalApplicationId"
    @close="closeCertModal"
  />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue'

import { registryTypeAPI } from '@/api/services/registry'
import CaseCertInfoRegModal from '@/components/registration/modals/CaseCertInfoRegModal.vue'
import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { useDialog } from '@/composables/utils/useDialog'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import { useThrottle } from '@/composables/utils/useThrottle'

const showPdfConverter = import.meta.env.DEV || import.meta.env.VITE_IS_DEV === 'true'
const pdfConverterComponent = showPdfConverter
  ? defineAsyncComponent(() => import('@/components/doc-templates/PdfConverter.vue'))
  : null

interface Props {
  registryManagementNumber: string
  isOpen: boolean
}

interface RegistryApplicationForm {
  applicationId?: number
  registryManagementNumber?: string
  dataSource?: 'REQUEST' | 'MANUAL'
  registryType?: string
  registryTypeLabel?: string
  registryRole?: 'MAIN' | 'LINKED' | string
}

interface RegistryApplicationDocument {
  applicationId?: number
  registryManagementNumber?: string
  registryType?: string
  registryCause?: string
  registryMethod?: string
  adminInfoLinkTime?: string
  sections?: Array<{
    code?: string
    title?: string
  }>
}

const props = defineProps<Props>()
const { findReplacement, replaceText } = useCodeReplacer()
const { getErrorMessage } = useErrorHandler()

const tabsLoading = ref(false)
const tabsErrorMessage = ref('')
const tabs = ref<RegistryApplicationForm[]>([])
const activeTabIndex = ref(0)
const tabsThrottle = useThrottle(1000)
const deletingApplicationIds = ref<Set<number>>(new Set())
const { alert, confirm } = useDialog()

const documentLoading = ref(false)
const documentErrorMessage = ref('')
const document = ref<RegistryApplicationDocument | null>(null)
const documentThrottle = useThrottle(1000)

const activeApplicationId = computed(() => {
  const activeTab = tabs.value[activeTabIndex.value]
  return activeTab?.applicationId
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

function unwrapData<T>(res: any): T {
  if (res?.data && typeof res.data === 'object' && 'data' in res.data) return res.data.data as T
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return undefined as unknown as T
}

// 탭 목록 조회 (R02D-08)
async function fetchTabs() {
  if (!props.registryManagementNumber) {
    tabs.value = []
    tabsErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await tabsThrottle.execute(async () => {
    tabsLoading.value = true
    tabsErrorMessage.value = ''
    try {
      const res: any = await registryTypeAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<RegistryApplicationForm[]>(res)

      tabs.value = Array.isArray(data) ? data : data ? [data] : []

      // 탭이 있으면 첫 번째 탭 선택
      if (tabs.value.length > 0 && activeTabIndex.value >= tabs.value.length) {
        activeTabIndex.value = 0
      }
    } catch (e: any) {
      tabs.value = []
      tabsErrorMessage.value = getErrorMessage(e)
    } finally {
      tabsLoading.value = false
    }
  })

  if (result === null) return
}

// 전자문서 조회 (R02D-09)
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
      const res: any = await registryTypeAPI.documents({
        applicationId
      })
      const data = unwrapData<RegistryApplicationDocument>(res)

      document.value = data || null
    } catch (e: any) {
      document.value = null
      documentErrorMessage.value = getErrorMessage(e)
    } finally {
      documentLoading.value = false
    }
  })

  if (result === null) return
}

// 탭 선택
function selectTab(index: number) {
  activeTabIndex.value = index
  const appId = activeApplicationId.value
  if (appId) {
    fetchDocument(appId)
  }
}

// 탭 추가 (추후 구현)
function handleAddTab() {
  console.log('탭 추가 기능 - 추후 구현')
  // TODO: 모달 열어서 등기유형 선택 후 등기신청서 생성
}

// 탭 삭제 (R02D-03)
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
    await registryTypeAPI.delete({ applicationId: tab.applicationId })
    removeTabFromState(tab.applicationId)
    await alert({
      title: '삭제 완료',
      message: '등기신청서를 삭제했습니다.'
    })
  } catch (e: any) {
    await alert({
      title: '삭제 실패',
      message: getErrorMessage(e)
    })
  } finally {
    deletingApplicationIds.value.delete(tab.applicationId)
  }
}

function canDeleteTab(tab: RegistryApplicationForm) {
  return tab.registryRole !== 'MAIN'
}

function isDeletingTab(tab: RegistryApplicationForm) {
  return !!tab.applicationId && deletingApplicationIds.value.has(tab.applicationId)
}

function removeTabFromState(applicationId: number) {
  const removedIndex = tabs.value.findIndex((item) => item.applicationId === applicationId)
  if (removedIndex < 0) return

  const wasActive = activeTabIndex.value === removedIndex
  tabs.value = tabs.value.filter((item) => item.applicationId !== applicationId)

  if (tabs.value.length === 0) {
    activeTabIndex.value = 0
    document.value = null
    documentErrorMessage.value = ''
    return
  }

  if (activeTabIndex.value > removedIndex) {
    activeTabIndex.value -= 1
  }
  if (activeTabIndex.value >= tabs.value.length) {
    activeTabIndex.value = tabs.value.length - 1
  }

  if (wasActive) {
    const nextAppId = activeApplicationId.value
    if (nextAppId) {
      void fetchDocument(nextAppId)
    } else {
      document.value = null
      documentErrorMessage.value = ''
    }
  }
}

// 등기방식 수정 (추후 구현)
function handleEditRegistryMethod() {
  console.log('등기방식 수정 - 추후 구현')
  // TODO: 모달 열어서 등기방식 수정
}

// 섹션 버튼 클릭 (추후 구현)
function handleSectionClick(section: { code?: string; title?: string }) {
  console.log('섹션 클릭:', section)

  // 등기권리증 정보 등록 모달 열기
  if (section.code === 'OWNER_CERT_INFO') {
    openCertModal()
    return
  }

  // TODO: 다른 섹션별 상세 페이지 이동 또는 모달
}

// 등기권리증 모달
const showCertModal = ref(false)
const certModalApplicationId = ref<number | null>(null)

function openCertModal() {
  const appId = activeApplicationId.value
  if (!appId) {
    console.error('applicationId가 없습니다')
    return
  }
  certModalApplicationId.value = appId
  showCertModal.value = true
}

function closeCertModal() {
  showCertModal.value = false
  certModalApplicationId.value = null
}

// 마운트 시 탭 목록 조회
watch(
  () => props.registryManagementNumber,
  (newVal) => {
    if (newVal) {
      fetchTabs()
    }
  },
  { immediate: true }
)

// 탭 목록이 로드되면 첫 번째 탭의 문서 조회
watch(
  () => tabs.value.length,
  (length) => {
    if (length > 0) {
      const appId = activeApplicationId.value
      if (appId) {
        fetchDocument(appId)
      }
    }
  }
)

// 아코디언이 열릴 때도 탭 목록 갱신
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.registryManagementNumber) {
      fetchTabs()
    }
  }
)
</script>

<style scoped lang="scss">
.application-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tabs-container {
  display: flex;
  flex-direction: column;
}

.tabs-header {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid #e5e7eb;
  background: #fafafa;
  padding: 8px 8px 0 8px;
  border-radius: 10px 10px 0 0;
}

.tab-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }

  &.active {
    color: #3b82f6;
    background: #fff;
    border-bottom: 2px solid #3b82f6;
    font-weight: 600;
  }
}

.tab-label {
  flex: 1;
}

.tab-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 18px;
  line-height: 1;
  color: #9ca3af;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.tab-add-btn {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }
}

.tab-content {
  padding: 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 10px 10px;
  min-height: 200px;
}

.muted {
  color: #6b7280;
  text-align: center;
  padding: 20px 0;
}

.error {
  padding: 12px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  font-size: 13px;
}

.document-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-table-wrapper {
  overflow-x: auto;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;

  thead {
    background: #f9fafb;

    th {
      padding: 12px 16px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
    }
  }

  tbody {
    td {
      padding: 12px 16px;
      font-size: 13px;
      color: #111827;
      border-bottom: 1px solid #f3f4f6;
    }
  }
}

.editable-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.edit-btn {
  padding: 4px 12px;
  font-size: 12px;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }
}

.sections-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sections-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.sections-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.section-btn {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #3b82f6;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
}

.add-first-btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
  }
}
</style>
