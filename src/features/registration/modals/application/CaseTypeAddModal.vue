<!-- 문서 경로: `@/src/features/registration/modals/application/CaseTypeAddModal.vue`
문서 제목: 기능 페이지/컴포넌트: case-type-add-modal -->

<template>
  <div class="modal-overlay" @click.self="emitClose">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ isEditMode ? '등기유형 수정' : '등기유형 추가' }}</h2>
        <button type="button" class="modal-close" @click="emitClose">×</button>
      </div>

      <div class="modal-body">
        <div class="section-card">
          <div class="section-title">등기유형 정보</div>

          <div v-if="codeLoadError" class="state-text error">{{ codeLoadError }}</div>
          <div v-else class="form-grid">
            <div class="form-field">
              <label class="form-label">등기유형 <span class="required">*</span></label>
              <select
                v-model="form.registryType"
                class="form-select"
                :disabled="isSaving || isEditMode"
              >
                <option value="">선택하세요</option>
                <option
                  v-for="option in registryTypeOptions"
                  :key="String(option.value)"
                  :value="String(option.value)"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="form-field">
              <label class="form-label">등기원인 <span class="required">*</span></label>
              <select
                v-model="form.registryCause"
                class="form-select"
                :disabled="!form.registryType || isSaving || isEditMode"
              >
                <option value="">선택하세요</option>
                <option
                  v-for="option in registryCauseOptions"
                  :key="String(option.value)"
                  :value="String(option.value)"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="form-field">
              <label class="form-label">등기방식 <span class="required">*</span></label>
              <select
                v-model="form.registryMethod"
                class="form-select"
                :disabled="!form.registryCause || isSaving"
                @change="handleRegistryMethodChange"
              >
                <option value="">선택하세요</option>
                <option
                  v-for="option in registryMethodOptions"
                  :key="String(option.value)"
                  :value="String(option.value)"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="form-field">
              <label class="form-label">행정정보 연계시점 <span class="required">*</span></label>
              <select
                v-model="form.adminInfoLinkTime"
                class="form-select"
                :disabled="!isElectronicMethod || isSaving"
              >
                <option value="">선택하세요</option>
                <option
                  v-for="option in adminInfoLinkTimeOptions"
                  :key="String(option.value)"
                  :value="String(option.value)"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" :disabled="isSaving" @click="emitClose">
          취소
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="isSaveDisabled"
          @click="handleSave"
        >
          {{ isSaving ? '저장 중…' : '저장' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'

import { registryTypeAPI } from '@/api/services/registry'
import { useCodes } from '@/composables/api/useCodes'
import { useApiAlert } from '@/composables/utils/useApiAlert'
import { useDialog } from '@/composables/utils/useDialog'
import type { RegistryApplicationForm } from '@/features/registration/composables/applicationSection.types'
import type { ProgressType, RegistryApplicationCreateRequest } from '@/types'

interface Props {
  registryManagementNumber: string
  existingForms: RegistryApplicationForm[]
  progressType?: ProgressType
  mode?: 'add' | 'edit'
  applicationId?: number
  initialValues?: {
    registryType?: string
    registryCause?: string
    registryMethod?: string
    adminInfoLinkTime?: string
  }
}

interface Emits {
  (e: 'close'): void
  (e: 'saved', payload: { registryType: string }): void
}

type RegistryTypeValue =
  | 'OWNERSHIP_TRANSFER'
  | 'MORTGAGE'
  | 'SURFACE_RIGHT'
  | 'CHANGE'
  | 'CORRECTION'
  | 'MORTGAGE_CANCELLATION'
  | 'SURFACE_RIGHT_CANCELLATION'

type RegistryCauseValue =
  | 'TRADE'
  | 'ESTABLISHMENT_CONTRACT'
  | 'ADDRESS_CHANGE'
  | 'ROAD_NAME_ADDRESS'
  | 'NAME_CHANGE'
  | 'REGISTRATION_NUMBER'
  | 'APPLICATION_ERROR'
  | 'TERMINATION'

type RegistryMethodValue = 'ELECTRONIC' | 'E_FORM' | 'PAPER'
type AdminInfoLinkTimeValue = 'BEFORE_SUBMISSION' | 'AFTER_SUBMISSION'

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { fetchCodesByCategory, getCodeOptions } = useCodes()
const { alert, confirm } = useDialog()
const { extractApiErrorContent } = useApiAlert()

const isSaving = ref(false)
const codeLoadError = ref('')
const registryMethodTouched = ref(false)
const isHydrating = ref(false)
const isEditMode = computed(() => props.mode === 'edit')

const form = reactive({
  registryType: '',
  registryCause: '',
  registryMethod: '',
  adminInfoLinkTime: ''
})

// 기획에서 허용한 등기유형만 모달 선택지로 노출한다.
const ALLOWED_REGISTRY_TYPES: RegistryTypeValue[] = [
  'OWNERSHIP_TRANSFER',
  'MORTGAGE',
  'SURFACE_RIGHT',
  'CHANGE',
  'CORRECTION',
  'MORTGAGE_CANCELLATION',
  'SURFACE_RIGHT_CANCELLATION'
]

const PROGRESS_TYPE_REGISTRY_TYPES: Record<ProgressType, RegistryTypeValue[]> = {
  TYPE_01: ['MORTGAGE', 'SURFACE_RIGHT', 'CHANGE', 'CORRECTION'],
  TYPE_02: [
    'MORTGAGE',
    'SURFACE_RIGHT',
    'CHANGE',
    'CORRECTION',
    'MORTGAGE_CANCELLATION',
    'SURFACE_RIGHT_CANCELLATION'
  ],
  TYPE_04: [
    'OWNERSHIP_TRANSFER',
    'CHANGE',
    'CORRECTION',
    'MORTGAGE_CANCELLATION',
    'SURFACE_RIGHT_CANCELLATION'
  ],
  TYPE_05: ['MORTGAGE', 'SURFACE_RIGHT', 'CHANGE', 'CORRECTION'],
  TYPE_07: [
    'OWNERSHIP_TRANSFER',
    'MORTGAGE',
    'SURFACE_RIGHT',
    'CHANGE',
    'CORRECTION',
    'MORTGAGE_CANCELLATION',
    'SURFACE_RIGHT_CANCELLATION'
  ]
}

const REGISTRY_CAUSE_MAP: Record<RegistryTypeValue, RegistryCauseValue[]> = {
  OWNERSHIP_TRANSFER: ['TRADE'],
  MORTGAGE: ['ESTABLISHMENT_CONTRACT'],
  SURFACE_RIGHT: ['ESTABLISHMENT_CONTRACT'],
  CHANGE: ['ADDRESS_CHANGE', 'ROAD_NAME_ADDRESS', 'NAME_CHANGE', 'REGISTRATION_NUMBER'],
  CORRECTION: ['APPLICATION_ERROR'],
  MORTGAGE_CANCELLATION: ['TERMINATION'],
  SURFACE_RIGHT_CANCELLATION: ['TERMINATION']
}

const DEFAULT_REGISTRY_METHODS: RegistryMethodValue[] = ['ELECTRONIC', 'E_FORM', 'PAPER']
const EXTRA_METHOD_REGISTRY_TYPES: RegistryTypeValue[] = [
  'MORTGAGE_CANCELLATION',
  'SURFACE_RIGHT_CANCELLATION'
]

const isElectronicMethod = computed(() => form.registryMethod === 'ELECTRONIC')
const availableRegistryTypes = computed(
  () => props.progressType && PROGRESS_TYPE_REGISTRY_TYPES[props.progressType]
)

const registryTypeOptions = computed(() =>
  getCodeOptions('registryTypes').filter(
    (option) =>
      ALLOWED_REGISTRY_TYPES.includes(String(option.value) as RegistryTypeValue) &&
      // 진행유형별 허용 범위를 함께 적용해 사건과 무관한 등기유형은 처음부터 숨긴다.
      (!availableRegistryTypes.value ||
        availableRegistryTypes.value.includes(String(option.value) as RegistryTypeValue))
  )
)

const registryCauseOptions = computed(() => {
  if (!form.registryType) return []

  const allowedCauses =
    REGISTRY_CAUSE_MAP[form.registryType as RegistryTypeValue] ?? ([] as RegistryCauseValue[])

  return getCodeOptions('registryCauses').filter((option) =>
    allowedCauses.includes(String(option.value) as RegistryCauseValue)
  )
})

const registryMethodOptions = computed(() => {
  const allOptions = getCodeOptions('registryMethods')
  const isExtraMethodType = EXTRA_METHOD_REGISTRY_TYPES.includes(
    form.registryType as RegistryTypeValue
  )

  let filtered = allOptions.filter((option) => {
    const value = String(option.value)
    if (DEFAULT_REGISTRY_METHODS.includes(value as RegistryMethodValue)) return true
    // 말소 계열은 추가 방식 코드가 열릴 수 있어 기본 방식 외 옵션을 허용한다.
    return isExtraMethodType
  })

  if (form.registryCause === 'NAME_CHANGE' || form.registryCause === 'REGISTRATION_NUMBER') {
    // 성명/등록번호 변경은 전자등기 미지원이라 ELECTRONIC을 숨긴다.
    filtered = filtered.filter((option) => String(option.value) !== 'ELECTRONIC')
  }

  return filtered
})

const adminInfoLinkTimeOptions = computed(() => getCodeOptions('adminInfoLinkTime'))

const isSaveDisabled = computed(
  () =>
    isSaving.value ||
    !form.registryType ||
    !form.registryCause ||
    !form.registryMethod ||
    (isElectronicMethod.value && !form.adminInfoLinkTime)
)

function emitClose() {
  if (isSaving.value) return
  emit('close')
}

function applyInitialValues() {
  if (!props.initialValues) return

  // 수정 모달에서는 서버 값을 한 번에 주입하되, watch 연쇄 반응은 hydration 구간에서 막는다.
  isHydrating.value = true
  form.registryType = props.initialValues.registryType ?? ''
  form.registryCause = props.initialValues.registryCause ?? ''
  form.registryMethod = props.initialValues.registryMethod ?? ''
  form.adminInfoLinkTime = props.initialValues.adminInfoLinkTime ?? ''
  registryMethodTouched.value = !!props.initialValues.registryMethod
  isHydrating.value = false
}

function resetRegistryMethodIfInvalid() {
  const allowedMethods = registryMethodOptions.value.map((option) => String(option.value))
  if (allowedMethods.length === 0) {
    form.registryMethod = ''
    return
  }

  if (form.registryMethod && allowedMethods.includes(form.registryMethod)) {
    return
  }

  // 상위 조건(유형/원인) 변경으로 더 이상 허용되지 않는 값은 즉시 비운다.
  form.registryMethod = ''
}

function handleRegistryMethodChange() {
  registryMethodTouched.value = true
  if (!isElectronicMethod.value) {
    // 전자등기가 아니면 행정정보 연계시점은 의미가 없으므로 함께 초기화한다.
    form.adminInfoLinkTime = ''
  }
}

watch(
  () => [
    props.mode,
    props.applicationId,
    props.initialValues?.registryType,
    props.initialValues?.registryCause,
    props.initialValues?.registryMethod,
    props.initialValues?.adminInfoLinkTime
  ],
  ([, , registryType, registryCause, registryMethod, adminInfoLinkTime]) => {
    if (!props.initialValues) return

    isHydrating.value = true
    form.registryType = registryType == null ? '' : String(registryType)
    form.registryCause = registryCause == null ? '' : String(registryCause)
    form.registryMethod = registryMethod == null ? '' : String(registryMethod)
    form.adminInfoLinkTime = adminInfoLinkTime == null ? '' : String(adminInfoLinkTime)
    registryMethodTouched.value = !!registryMethod
    isHydrating.value = false
  },
  { immediate: true }
)

watch(
  () => props.initialValues,
  (newValues) => {
    if (!newValues || isHydrating.value) return
    applyInitialValues()
  },
  { deep: true }
)

watch(
  () => form.registryType,
  () => {
    if (isHydrating.value) return

    const allowedCauses = registryCauseOptions.value.map((option) => String(option.value))
    if (allowedCauses.length === 1) {
      // 등기유형에 원인이 하나뿐이면 사용자가 다시 고르지 않도록 자동 선택한다.
      form.registryCause = allowedCauses[0] ?? ''
    } else if (!allowedCauses.includes(form.registryCause)) {
      form.registryCause = ''
    }
    registryMethodTouched.value = false
    form.registryMethod = ''
    form.adminInfoLinkTime = ''
  }
)

watch(
  () => form.registryCause,
  () => {
    if (isHydrating.value) return

    // 원인이 바뀌면 가능한 등기방식도 달라질 수 있어 touched 상태와 연계시점을 모두 초기화한다.
    registryMethodTouched.value = false
    resetRegistryMethodIfInvalid()
    form.adminInfoLinkTime = ''
  }
)

watch(
  () => form.registryMethod,
  () => {
    if (isHydrating.value) return

    if (!isElectronicMethod.value) {
      form.adminInfoLinkTime = ''
    }
  }
)

async function loadCodes() {
  codeLoadError.value = ''

  try {
    // 모달 내 네 개의 select는 모두 코드표 의존성이 있어 진입 시 병렬로 미리 불러온다.
    await Promise.all([
      fetchCodesByCategory('registryTypes'),
      fetchCodesByCategory('registryCauses'),
      fetchCodesByCategory('registryMethods'),
      fetchCodesByCategory('adminInfoLinkTime')
    ])
    applyInitialValues()
  } catch {
    codeLoadError.value = '등기유형 공통코드를 불러오지 못했습니다.'
  }
}

async function validateRequiredFields() {
  if (
    !form.registryType ||
    !form.registryCause ||
    !form.registryMethod ||
    (isElectronicMethod.value && !form.adminInfoLinkTime)
  ) {
    await alert({
      title: '필수 입력값 정보 미입력',
      message: '필수 입력값 정보가 없습니다.\n필수 입력값 정보를 입력 바랍니다.'
    })
    return false
  }

  return true
}

async function confirmDuplicateRegistryTypeIfNeeded() {
  const hasSameRegistryType = props.existingForms.some(
    (item) => item.registryType && item.registryType === form.registryType
  )

  if (!hasSameRegistryType) return

  // 현재 API는 별도 복사 여부 플래그를 받지 않으므로, 기획서상의 확인 절차만 먼저 맞춘다.
  await confirm({
    title: '데이터 복사 여부',
    message: '기존에 등록된 등기유형 정보가 있습니다.\n기존 등기유형 정보를 복사하시겠습니까?',
    confirmText: '예',
    cancelText: '아니오'
  })
}

async function handleSave() {
  if (!(await validateRequiredFields())) return
  if (!isEditMode.value) {
    // 추가 모드에서만 동일 등기유형 존재 여부를 사전 확인한다.
    await confirmDuplicateRegistryTypeIfNeeded()
  }

  isSaving.value = true
  try {
    const normalizedAdminInfoLinkTime = form.adminInfoLinkTime.trim()
    const adminInfoLinkTime = normalizedAdminInfoLinkTime
      ? (normalizedAdminInfoLinkTime as AdminInfoLinkTimeValue)
      : null

    if (isEditMode.value) {
      if (!props.applicationId) {
        await alert({
          title: '등기유형 수정 실패',
          message: '신청서 ID가 없어 수정할 수 없습니다.'
        })
        return
      }

      // 수정 모드는 등기유형/원인은 고정하고 등기방식과 연계시점만 갱신한다.
      await registryTypeAPI.update(
        { applicationId: props.applicationId },
        {
          registryMethod: form.registryMethod as RegistryMethodValue,
          adminInfoLinkTime
        }
      )
    } else {
      // 추가 모드는 새 신청서 생성에 필요한 전체 조합을 전송한다.
      const payload = {
        registryManagementNumber: props.registryManagementNumber,
        registryType: form.registryType as RegistryTypeValue,
        registryCause: form.registryCause as RegistryCauseValue,
        registryMethod: form.registryMethod as RegistryMethodValue,
        adminInfoLinkTime
      } as RegistryApplicationCreateRequest

      await registryTypeAPI.applications(payload)
    }

    emit('saved', { registryType: form.registryType })
  } catch (error) {
    const dialog = extractApiErrorContent(
      error,
      isEditMode.value ? '등기유형 수정 실패' : '등기유형 추가 실패',
      isEditMode.value ? '등기유형 수정에 실패했습니다.' : '등기유형 추가에 실패했습니다.'
    )
    await alert({
      title: dialog.title,
      message: dialog.message
    })
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  void loadCodes()
})
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 24, 39, 0.45);
}

.modal-container {
  width: min(920px, calc(100vw - 32px));
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.16);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
}

.modal-close {
  border: 0;
  background: transparent;
  font-size: 32px;
  line-height: 1;
  color: #9ca3af;
  cursor: pointer;
}

.modal-body {
  padding: 20px 24px 8px;
}

.section-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  background: #fff;
}

.section-title {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  padding: 0;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
}

.required {
  color: #e11d48;
}

.form-select {
  width: 100%;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  font-size: 14px;
  color: #111827;
}

.form-select:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px 24px;
}

.btn {
  min-width: 120px;
  height: 42px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-secondary {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.btn-primary {
  background: #0ea5e9;
  color: #fff;
}

.state-text {
  padding: 16px;
  border-radius: 6px;
  font-size: 14px;
  background: #f9fafb;
  color: #4b5563;
}

.state-text.error {
  background: #fef2f2;
  color: #b91c1c;
}

@media (max-width: 960px) {
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .modal-header {
    padding: 18px 20px;
  }

  .modal-title {
    font-size: 22px;
  }

  .modal-body {
    padding: 20px 20px 10px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    padding: 16px 20px 24px;
  }

  .btn {
    flex: 1;
    min-width: 0;
    font-size: 16px;
  }
}
</style>
