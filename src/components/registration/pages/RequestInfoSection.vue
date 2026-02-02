<template>
  <ul class="sub-list">
    <!-- 대출 금융기관 정보 -->
    <li class="sub-item">
      <div class="sub-title">대출 금융기관 정보</div>

      <section class="case-detail">
        <div v-if="loanLoading" class="muted">불러오는 중…</div>
        <div v-else-if="loanErrorMessage" class="error">{{ loanErrorMessage }}</div>

        <div v-else class="card">
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
            <span class="label">담당자명</span>
            <span class="value">{{ loanInfo?.managerName ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">직급</span>
            <span class="value">{{ loanInfo?.managerPosition ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">연락처</span>
            <span class="value">{{ loanInfo?.managerPhone ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">등록일시</span>
            <span class="value">{{ loanInfo?.createdAt ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">메시지</span>
            <span class="value">{{ loanInfo?.managerMessage ?? '-' }}</span>
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

        <div v-else class="card">
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
            <span class="value">{{ basicInfo?.progressStatus ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">배정업무</span>
            <span class="value">{{ basicInfo?.assignedWork ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">업무구분</span>
            <span class="value">{{ basicInfo?.workType ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">진행타입</span>
            <span class="value">{{ basicInfo?.progressType ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">첨부 개수</span>
            <span class="value">{{ basicInfo?.attachmentCnt ?? 0 }}</span>
          </div>
          <div class="row">
            <span class="label">상환말소대상</span>
            <span class="value">{{ basicInfo?.repaymentCancellationSubject ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">상환말소대상 개수</span>
            <span class="value">{{ basicInfo?.repaymentCancellationSubjectCnt ?? 0 }}</span>
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

        <div v-else-if="mortgageInfo" class="card">
          <div class="row">
            <span class="label">등기 유형</span>
            <span class="value">{{ mortgageInfo.registryTypeName ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">등기 원인</span>
            <span class="value">{{ mortgageInfo.registryCauseName ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">채권최고액</span>
            <span class="value"
              >{{ mortgageInfo.maximumCreditAmount?.toLocaleString() ?? '-' }}원</span
            >
          </div>
          <div class="row">
            <span class="label">등기 방식</span>
            <span class="value">{{ mortgageInfo.registryMethodName ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">지상권 여부</span>
            <span class="value">{{ mortgageInfo.surfaceRightYn ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">지상권 존속기간</span>
            <span class="value">{{ mortgageInfo.durationPeriod ?? '-' }}</span>
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

        <div v-else-if="transferInfo" class="card">
          <div class="row">
            <span class="label">등기유형</span>
            <span class="value">{{ transferInfo.registryType ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">등기원인</span>
            <span class="value">{{ transferInfo.registryCause ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">매매가액</span>
            <span class="value">{{ transferInfo.tradeAmount?.toLocaleString() ?? '-' }}원</span>
          </div>
          <div class="row">
            <span class="label">등기방식</span>
            <span class="value">{{ transferInfo.registryMethod ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">견적서 작성자</span>
            <span class="value">{{ transferInfo.estimateWriter ?? '-' }}</span>
          </div>
          <div class="row">
            <span class="label">견적서 선정일시</span>
            <span class="value">{{ transferInfo.selectedAt ?? '-' }}</span>
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
            <span class="label">담당자 직통번호</span>
            <span class="value">{{ mortgageLegalInfo.directPhoneNumber ?? '-' }}</span>
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
            <span class="label">담당자 직통번호</span>
            <span class="value">{{ transferLegalInfo.directPhoneNumber ?? '-' }}</span>
          </div>
        </div>
      </section>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { registryProgressAPI } from '@/api/services/registry'
import { useThrottle } from '@/composables/utils/useThrottle'
import type {
  RegistryProgressBasicResponse,
  RegistryProgressLegalAgentResponse,
  RegistryProgressLoanResponse,
  RegistryProgressMortgageResponse,
  RegistryProgressOwnershipTransferResponse
} from '@/types'

interface Props {
  registryManagementNumber: string
  isOpen: boolean
}

const props = defineProps<Props>()

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
  return type === 'TYPE_01' || type === 'TYPE_02' || type === 'TYPE_05' || type === 'TYPE_07'
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

function unwrapData<T>(res: any): T {
  if (res?.data && typeof res.data === 'object' && 'data' in res.data) return res.data.data as T
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return undefined as unknown as T
}

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
      const res: any = await registryProgressAPI.loanInfo({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<RegistryProgressLoanResponse>(res)

      loanInfo.value = data ?? null
      if (!loanInfo.value) loanErrorMessage.value = '대출 금융기관 정보를 불러오지 못했습니다.'
    } catch (e: any) {
      loanInfo.value = null
      loanErrorMessage.value = e?.message ?? '대출 금융기관 정보 조회 실패'
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
      const res: any = await registryProgressAPI.basicInfo({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<RegistryProgressBasicResponse>(res)

      basicInfo.value = data ?? null
      if (!basicInfo.value) basicErrorMessage.value = '상세 정보를 불러오지 못했습니다.'
    } catch (e: any) {
      basicInfo.value = null
      basicErrorMessage.value = e?.message ?? '업무 기본 정보 조회 실패'
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
      const res: any = await registryProgressAPI.mortgage({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<RegistryProgressMortgageResponse>(res)

      mortgageInfo.value = data ?? null
      if (!mortgageInfo.value)
        mortgageErrorMessage.value = '근저당권설정 정보를 불러오지 못했습니다.'
    } catch (e: any) {
      mortgageInfo.value = null
      mortgageErrorMessage.value = e?.message ?? '근저당권설정 정보 조회 실패'
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
      const res: any = await registryProgressAPI.ownershipTransfer({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<RegistryProgressOwnershipTransferResponse>(res)

      transferInfo.value = data ?? null
      if (!transferInfo.value) transferErrorMessage.value = '소유권이전 정보를 불러오지 못했습니다.'
    } catch (e: any) {
      transferInfo.value = null
      transferErrorMessage.value = e?.message ?? '소유권이전 정보 조회 실패'
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
      const res: any = await registryProgressAPI.legalAgent({
        registryManagementNumber: props.registryManagementNumber,
        registryType: 'MORTGAGE'
      } as any)
      const data = unwrapData<RegistryProgressLegalAgentResponse>(res)

      mortgageLegalInfo.value = data ?? null
      if (!mortgageLegalInfo.value)
        mortgageLegalErrorMessage.value = '근저당권설정 법무대리인 정보를 불러오지 못했습니다.'
    } catch (e: any) {
      mortgageLegalInfo.value = null
      mortgageLegalErrorMessage.value = e?.message ?? '근저당권설정 법무대리인 정보 조회 실패'
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
      const res: any = await registryProgressAPI.legalAgent({
        registryManagementNumber: props.registryManagementNumber,
        registryType: 'OWNERSHIP_TRANSFER'
      } as any)
      const data = unwrapData<RegistryProgressLegalAgentResponse>(res)

      transferLegalInfo.value = data ?? null
      if (!transferLegalInfo.value)
        transferLegalErrorMessage.value = '소유권이전 법무대리인 정보를 불러오지 못했습니다.'
    } catch (e: any) {
      transferLegalInfo.value = null
      transferLegalErrorMessage.value = e?.message ?? '소유권이전 법무대리인 정보 조회 실패'
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

// basicInfo가 로드되면 진행타입에 따라 추가 API 호출
watch(
  () => basicInfo.value?.progressType,
  (progressType) => {
    if (!progressType || !props.isOpen) return

    // 근저당권설정 정보: TYPE_01, TYPE_02, TYPE_05, TYPE_07
    if (
      progressType === 'TYPE_01' ||
      progressType === 'TYPE_02' ||
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
  }
)

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

<style scoped lang="scss">
.sub-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-item {
  padding: 10px 12px;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  background: #fafafa;
  font-size: 13px;
  color: #111827;
}

.sub-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #111827;
}

.case-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.muted {
  color: #6b7280;
  text-align: center;
  padding: 10px 0;
}

.error {
  padding: 12px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  font-size: 13px;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
}

.row {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

.label {
  width: 140px;
  font-size: 12px;
  color: #6b7280;
}

.value {
  font-size: 13px;
  color: #111827;
}
</style>
