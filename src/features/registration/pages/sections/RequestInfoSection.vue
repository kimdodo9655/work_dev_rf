<!-- 문서 경로: `@/src/features/registration/pages/sections/RequestInfoSection.vue`
문서 제목: 기능 페이지/컴포넌트: request-info-section -->

<template>
  <ul class="sub-list">
    <!-- 대출 금융기관 정보 -->
    <li class="sub-item">
      <div class="sub-title">대출 금융기관 정보</div>

      <section class="case-detail">
        <div v-if="loanLoading" class="muted">불러오는 중…</div>
        <div v-else-if="loanErrorMessage" class="error">{{ loanErrorMessage }}</div>

        <div v-else class="card two-column-card">
          <div class="column">
            <div class="row">
              <span class="label">은행명</span>
              <span class="value">{{ loanInfo?.bankName ?? '-' }}</span>
            </div>
            <div class="row">
              <span class="label">지점명</span>
              <span class="value">{{ loanInfo?.branchName ?? '-' }}</span>
            </div>
            <div class="row">
              <span class="label">등기의뢰번호</span>
              <span class="value">{{ loanInfo?.registryRequestNumber ?? '-' }}</span>
            </div>
            <div class="row">
              <span class="label">등록일시</span>
              <span class="value">{{ displayDateTime(loanInfo?.createdAt) }}</span>
            </div>
          </div>
          <div class="column">
            <div class="row">
              <span class="label">담당자명</span>
              <span class="value">{{ loanInfo?.managerName ?? '-' }}</span>
            </div>
            <div class="row">
              <span class="label">직급</span>
              <span class="value">{{ loanInfo?.managerPosition ?? '-' }}</span>
            </div>
            <div class="row">
              <span class="label">연락처</span>
              <span class="value">{{
                displayPhoneWithExtension(loanInfo?.managerPhone, loanInfo?.managerExtension)
              }}</span>
            </div>
            <div class="row">
              <span class="label">메시지</span>
              <span class="value">{{ formatTextLabel(loanInfo?.managerMessage) }}</span>
            </div>
          </div>
        </div>
      </section>
    </li>

    <!-- 업무 기본 정보 -->
    <li class="sub-item">
      <div class="sub-title">업무 기본 정보</div>

      <section class="case-detail">
        <div v-if="basicLoading" class="muted">불러오는 중…</div>
        <div v-else-if="basicErrorMessage" class="error">{{ basicErrorMessage }}</div>

        <div v-else class="card two-column-card">
          <div class="column">
            <div class="row">
              <span class="label">등기관리번호</span>
              <span class="value">{{ basicInfo?.registryManagementNumber ?? '-' }}</span>
            </div>
            <div class="row">
              <span class="label">등기접수일자</span>
              <span class="value">{{ basicInfo?.registryReceiptDate ?? '-' }}</span>
            </div>
            <div class="row">
              <span class="label">진행상태</span>
              <span class="value">{{
                formatCodeLabel(basicInfo?.progressStatus, 'progressStatuses')
              }}</span>
            </div>
            <div class="row">
              <span class="label">진행타입</span>
              <span class="value">{{
                formatCodeLabel(basicInfo?.progressType, 'progressTypes')
              }}</span>
            </div>
          </div>
          <div class="column">
            <div class="row">
              <span class="label">배정업무</span>
              <span class="value">{{
                formatCodeLabel(basicInfo?.assignedWork, 'assignedWorks')
              }}</span>
            </div>
            <div class="row">
              <span class="label">업무구분</span>
              <span class="value">{{ formatCodeLabel(basicInfo?.workType, 'workTypes') }}</span>
            </div>
            <div class="row">
              <span class="label">첨부 개수</span>
              <span class="value">{{ basicInfo?.attachmentCnt ?? 0 }}</span>
            </div>
            <div class="row">
              <span class="label">상환말소대상</span>
              <span class="value">{{
                formatTextLabel(basicInfo?.repaymentCancellationSubject)
              }}</span>
            </div>
            <div class="row">
              <span class="label">상환말소대상 개수</span>
              <span class="value">{{ basicInfo?.repaymentCancellationSubjectCnt ?? 0 }}</span>
            </div>
          </div>
        </div>
      </section>
    </li>

    <!-- 근저당권설정 정보 -->
    <li v-if="showMortgage" class="sub-item">
      <div class="sub-title">근저당권설정 정보</div>

      <section class="case-detail">
        <div v-if="mortgageLoading" class="muted">불러오는 중…</div>
        <div v-else-if="mortgageErrorMessage" class="error">{{ mortgageErrorMessage }}</div>

        <div v-else-if="mortgageInfo" class="card two-column-card">
          <div class="column">
            <div class="row">
              <span class="label">등기 유형</span>
              <span class="value">{{
                formatCodeLabel(
                  mortgageInfo.registryTypeName || mortgageInfo.registryType,
                  'registryTypes'
                )
              }}</span>
            </div>
            <div class="row">
              <span class="label">등기 원인</span>
              <span class="value">{{
                formatCodeLabel(
                  mortgageInfo.registryCauseName || mortgageInfo.registryCause,
                  'registryCauses'
                )
              }}</span>
            </div>
            <div class="row">
              <span class="label">등기 방식</span>
              <span class="value">{{
                formatCodeLabel(
                  mortgageInfo.registryMethodName || mortgageInfo.registryMethod,
                  'registryMethods'
                )
              }}</span>
            </div>
          </div>
          <div class="column">
            <div class="row">
              <span class="label">채권최고액</span>
              <span class="value"
                >{{ mortgageInfo.maximumCreditAmount?.toLocaleString() ?? '-' }}원</span
              >
            </div>
            <div class="row">
              <span class="label">지상권 여부</span>
              <span class="value">{{ displaySurfaceRight(mortgageInfo.surfaceRightYn) }}</span>
            </div>
            <div class="row">
              <span class="label">지상권 존속기간</span>
              <span class="value">{{ mortgageInfo.durationPeriod ?? '-' }}</span>
            </div>
          </div>
        </div>
      </section>
    </li>

    <!-- 소유권이전 정보 -->
    <li v-if="showTransfer" class="sub-item">
      <div class="sub-title">소유권이전 정보</div>

      <section class="case-detail">
        <div v-if="transferLoading" class="muted">불러오는 중…</div>
        <div v-else-if="transferErrorMessage" class="error">{{ transferErrorMessage }}</div>

        <div v-else-if="transferInfo" class="card two-column-card">
          <div class="column">
            <div class="row">
              <span class="label">등기유형</span>
              <span class="value">{{
                formatCodeLabel(transferInfo.registryType, 'registryTypes')
              }}</span>
            </div>
            <div class="row">
              <span class="label">등기원인</span>
              <span class="value">{{
                formatCodeLabel(transferInfo.registryCause, 'registryCauses')
              }}</span>
            </div>
            <div class="row">
              <span class="label">등기방식</span>
              <span class="value">{{
                formatCodeLabel(transferInfo.registryMethod, 'registryMethods')
              }}</span>
            </div>
          </div>
          <div class="column">
            <div class="row">
              <span class="label">매매가액</span>
              <span class="value">{{ transferInfo.tradeAmount?.toLocaleString() ?? '-' }}원</span>
            </div>
            <div class="row">
              <span class="label">견적서 작성자</span>
              <span class="value">{{ transferInfo.estimateWriter ?? '-' }}</span>
            </div>
            <div class="row">
              <span class="label">견적서 선정일시</span>
              <span class="value">{{ displayDateTime(transferInfo?.selectedAt) }}</span>
            </div>
          </div>
        </div>
      </section>
    </li>

    <!-- 근저당권설정 법무대리인 정보 -->
    <li v-if="showMortgageLegal" class="sub-item">
      <div class="sub-title">근저당권설정 법무대리인 정보</div>

      <section class="case-detail">
        <div v-if="mortgageLegalLoading" class="muted">불러오는 중…</div>
        <div v-else-if="mortgageLegalErrorMessage" class="error">
          {{ mortgageLegalErrorMessage }}
        </div>

        <div v-else-if="mortgageLegalInfo" class="card">
          <div class="row">
            <span class="label">법무대리인 기관명</span>
            <span class="value">{{ mortgageLegalInfo.legalAgentName ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">담당자명</span>
            <span class="value">{{ mortgageLegalInfo.managerName ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">담당자 직책</span>
            <span class="value">{{ mortgageLegalInfo.managerPosition ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">담당자 전화번호</span>
            <span class="value">{{
              displayPhoneWithExtension(
                mortgageLegalInfo.managerPhone,
                mortgageLegalInfo.managerExtension
              )
            }}</span>
          </div>
        </div>
      </section>
    </li>

    <!-- 소유권이전 법무대리인 정보 -->
    <li v-if="showTransferLegal" class="sub-item">
      <div class="sub-title">소유권이전 법무대리인 정보</div>

      <section class="case-detail">
        <div v-if="transferLegalLoading" class="muted">불러오는 중…</div>
        <div v-else-if="transferLegalErrorMessage" class="error">
          {{ transferLegalErrorMessage }}
        </div>

        <div v-else-if="transferLegalInfo" class="card">
          <div class="row">
            <span class="label">법무대리인 기관명</span>
            <span class="value">{{ transferLegalInfo.legalAgentName ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">담당자명</span>
            <span class="value">{{ transferLegalInfo.managerName ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">담당자 직책</span>
            <span class="value">{{ transferLegalInfo.managerPosition ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">담당자 전화번호</span>
            <span class="value">{{
              displayPhoneWithExtension(
                transferLegalInfo.managerPhone,
                transferLegalInfo.managerExtension
              )
            }}</span>
          </div>
        </div>
      </section>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { registryProgressAPI } from '@/api/services/registry'
import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import { useThrottle } from '@/composables/utils/useThrottle'
import type {
  RegistryProgressBasicResponse,
  RegistryProgressLegalAgentResponse,
  RegistryProgressLoanResponse,
  RegistryProgressMortgageResponse,
  RegistryProgressOwnershipTransferResponse
} from '@/types'
import { extractPrimaryPayload } from '@/utils/apiPayload'
import { formatDateTimeSeconds, formatPhone } from '@/utils/format'

interface Props {
  registryManagementNumber: string
  isOpen: boolean
}

const props = defineProps<Props>()
const { formatCodeLabel, formatTextLabel } = useCodeReplacer()
const { getErrorMessage } = useErrorHandler()

function displayDateTime(value?: string | null): string {
  return value ? formatDateTimeSeconds(value) : '-'
}

function displayPhoneWithExtension(phone?: string | null, extension?: string | null): string {
  const formattedPhone = phone ? formatPhone(phone) : ''
  const trimmedExtension = extension?.trim() ?? ''

  if (!formattedPhone) return '-'
  if (!trimmedExtension) return formattedPhone

  return `${formattedPhone} (${trimmedExtension})`
}

function displaySurfaceRight(value?: string | boolean | null): string {
  if (value == null) return '-'
  if (typeof value === 'boolean') return value ? '지상권 있음' : '지상권 없음'

  const normalized = value.trim().toUpperCase()
  if (['TRUE', 'Y', 'O'].includes(normalized)) return '지상권 있음'
  if (['FALSE', 'N', 'X'].includes(normalized)) return '지상권 없음'

  return value
}

// 대출 금융기관 정보
const loanLoading = ref(false)
const loanErrorMessage = ref('')
const loanInfo = ref<RegistryProgressLoanResponse | null>(null)
const loanThrottle = useThrottle(1000)

// 업무 기본 정보
const basicLoading = ref(false)
const basicErrorMessage = ref('')
const basicInfo = ref<RegistryProgressBasicResponse | null>(null)
const basicThrottle = useThrottle(1000)

// 근저당권설정 정보
const mortgageLoading = ref(false)
const mortgageErrorMessage = ref('')
const mortgageInfo = ref<RegistryProgressMortgageResponse | null>(null)
const mortgageThrottle = useThrottle(1000)

// 소유권이전 정보
const transferLoading = ref(false)
const transferErrorMessage = ref('')
const transferInfo = ref<RegistryProgressOwnershipTransferResponse | null>(null)
const transferThrottle = useThrottle(1000)

// 근저당권설정 법무대리인 정보
const mortgageLegalLoading = ref(false)
const mortgageLegalErrorMessage = ref('')
const mortgageLegalInfo = ref<RegistryProgressLegalAgentResponse | null>(null)
const mortgageLegalThrottle = useThrottle(1000)

// 소유권이전 법무대리인 정보
const transferLegalLoading = ref(false)
const transferLegalErrorMessage = ref('')
const transferLegalInfo = ref<RegistryProgressLegalAgentResponse | null>(null)
const transferLegalThrottle = useThrottle(1000)

// 진행타입별 섹션 표시 여부
const showMortgage = computed(() => {
  const type = basicInfo.value?.progressType
  return (
    type === 'TYPE_01' ||
    type === 'TYPE_02' ||
    type === 'TYPE_04' ||
    type === 'TYPE_05' ||
    type === 'TYPE_07'
  )
})

const showTransfer = computed(() => {
  const type = basicInfo.value?.progressType
  return type === 'TYPE_04' || type === 'TYPE_07'
})

const showMortgageLegal = computed(() => {
  const type = basicInfo.value?.progressType
  return type === 'TYPE_04'
})

const showTransferLegal = computed(() => {
  const type = basicInfo.value?.progressType
  return type === 'TYPE_05'
})

async function fetchLoanInfo() {
  if (!props.registryManagementNumber) {
    loanInfo.value = null
    loanErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await loanThrottle.execute(async () => {
    loanLoading.value = true
    loanErrorMessage.value = ''
    try {
      const res = await registryProgressAPI.loanInfo({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = extractPrimaryPayload<RegistryProgressLoanResponse>(res)

      loanInfo.value = data ?? null
      if (!loanInfo.value) loanErrorMessage.value = '대출 금융기관 정보를 불러오지 못했습니다.'
    } catch (e: unknown) {
      loanInfo.value = null
      loanErrorMessage.value = getErrorMessage(e)
    } finally {
      loanLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchBasicInfo() {
  if (!props.registryManagementNumber) {
    basicInfo.value = null
    basicErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await basicThrottle.execute(async () => {
    basicLoading.value = true
    basicErrorMessage.value = ''
    try {
      const res = await registryProgressAPI.basicInfo({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = extractPrimaryPayload<RegistryProgressBasicResponse>(res)

      basicInfo.value = data ?? null
      if (!basicInfo.value) basicErrorMessage.value = '상세 정보를 불러오지 못했습니다.'
    } catch (e: unknown) {
      basicInfo.value = null
      basicErrorMessage.value = getErrorMessage(e)
    } finally {
      basicLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchMortgageInfo() {
  if (!props.registryManagementNumber) {
    mortgageInfo.value = null
    mortgageErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await mortgageThrottle.execute(async () => {
    mortgageLoading.value = true
    mortgageErrorMessage.value = ''
    try {
      const res = await registryProgressAPI.mortgage({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = extractPrimaryPayload<RegistryProgressMortgageResponse>(res)

      mortgageInfo.value = data ?? null
      if (!mortgageInfo.value)
        mortgageErrorMessage.value = '근저당권설정 정보를 불러오지 못했습니다.'
    } catch (e: unknown) {
      mortgageInfo.value = null
      mortgageErrorMessage.value = getErrorMessage(e)
    } finally {
      mortgageLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchTransferInfo() {
  if (!props.registryManagementNumber) {
    transferInfo.value = null
    transferErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await transferThrottle.execute(async () => {
    transferLoading.value = true
    transferErrorMessage.value = ''
    try {
      const res = await registryProgressAPI.ownershipTransfer({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = extractPrimaryPayload<RegistryProgressOwnershipTransferResponse>(res)

      transferInfo.value = data ?? null
      if (!transferInfo.value) transferErrorMessage.value = '소유권이전 정보를 불러오지 못했습니다.'
    } catch (e: unknown) {
      transferInfo.value = null
      transferErrorMessage.value = getErrorMessage(e)
    } finally {
      transferLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchMortgageLegalInfo() {
  if (!props.registryManagementNumber) {
    mortgageLegalInfo.value = null
    mortgageLegalErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await mortgageLegalThrottle.execute(async () => {
    mortgageLegalLoading.value = true
    mortgageLegalErrorMessage.value = ''
    try {
      const res = await registryProgressAPI.legalAgent({
        registryManagementNumber: props.registryManagementNumber,
        registryType: 'MORTGAGE'
      })
      const data = extractPrimaryPayload<RegistryProgressLegalAgentResponse>(res)

      mortgageLegalInfo.value = data ?? null
      if (!mortgageLegalInfo.value)
        mortgageLegalErrorMessage.value = '근저당권설정 법무대리인 정보를 불러오지 못했습니다.'
    } catch (e: unknown) {
      mortgageLegalInfo.value = null
      mortgageLegalErrorMessage.value = getErrorMessage(e)
    } finally {
      mortgageLegalLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchTransferLegalInfo() {
  if (!props.registryManagementNumber) {
    transferLegalInfo.value = null
    transferLegalErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await transferLegalThrottle.execute(async () => {
    transferLegalLoading.value = true
    transferLegalErrorMessage.value = ''
    try {
      const res = await registryProgressAPI.legalAgent({
        registryManagementNumber: props.registryManagementNumber,
        registryType: 'OWNERSHIP_TRANSFER'
      })
      const data = extractPrimaryPayload<RegistryProgressLegalAgentResponse>(res)

      transferLegalInfo.value = data ?? null
      if (!transferLegalInfo.value)
        transferLegalErrorMessage.value = '소유권이전 법무대리인 정보를 불러오지 못했습니다.'
    } catch (e: unknown) {
      transferLegalInfo.value = null
      transferLegalErrorMessage.value = getErrorMessage(e)
    } finally {
      transferLegalLoading.value = false
    }
  })

  if (result === null) return
}

// 아코디언이 열릴 때마다 데이터 로드
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      // 공통: 항상 호출
      fetchLoanInfo()
      fetchBasicInfo()
    }
  },
  { immediate: true }
)

// basicInfo 또는 아코디언 오픈 상태가 바뀌면 진행타입에 따라 추가 API 호출
watch([() => basicInfo.value?.progressType, () => props.isOpen], ([progressType, isOpen]) => {
  if (!progressType || !isOpen) return

  // 근저당권설정 정보: TYPE_01, TYPE_02, TYPE_04, TYPE_05, TYPE_07
  if (
    progressType === 'TYPE_01' ||
    progressType === 'TYPE_02' ||
    progressType === 'TYPE_04' ||
    progressType === 'TYPE_05' ||
    progressType === 'TYPE_07'
  ) {
    fetchMortgageInfo()
  }

  // 소유권이전 정보: TYPE_04, TYPE_07
  if (progressType === 'TYPE_04' || progressType === 'TYPE_07') {
    fetchTransferInfo()
  }

  // 근저당권설정 법무대리인 정보: TYPE_04
  if (progressType === 'TYPE_04') {
    fetchMortgageLegalInfo()
  }

  // 소유권이전 법무대리인 정보: TYPE_05
  if (progressType === 'TYPE_05') {
    fetchTransferLegalInfo()
  }
})

// 등기관리번호가 변경되면 즉시 재로드 (열려있는 경우에만)
watch(
  () => props.registryManagementNumber,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal && props.isOpen) {
      // 공통: 항상 호출
      fetchLoanInfo()
      fetchBasicInfo()
      // 진행타입에 따른 추가 API는 basicInfo watch에서 자동 처리됨
    }
  }
)
</script>
