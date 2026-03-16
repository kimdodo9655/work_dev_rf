<!-- 문서 경로: `@/src/features/registration/pages/sections/ProgressSection.vue`
문서 제목: 기능 페이지/컴포넌트: progress-section -->

<template>
  <ul class="sub-list">
    <InternalESignProgressItem
      v-if="mortgageList.length > 0"
      :list="mortgageList"
      :loading="mortgageLoading"
      :error-message="mortgageErrorMessage"
      :code-label="formatCodeLabel"
      :get-signature-status-class="getSignatureStatusClass"
      :on-detail="handleDetail"
    />

    <TaxDeclarationProgressItem
      :rows="taxRows"
      :loading="taxLoading"
      :error-message="taxErrorMessage"
      :code-label="formatCodeLabel"
      :format-number="formatNumber"
    />

    <HousingBondProgressItem
      :rows="housingBondRows"
      :loading="housingBondLoading"
      :error-message="housingBondErrorMessage"
      :code-label="formatCodeLabel"
      :format-number="formatNumber"
    />

    <LoanAccountProgressItem
      :rows="loanAccountRows"
      :loading="loanAccountLoading"
      :error-message="loanAccountErrorMessage"
      :format-number="formatNumber"
    />

    <TransferCertificateProgressItem
      :rows="transferCertificateRows"
      :loading="transferCertificateLoading"
      :error-message="transferCertificateErrorMessage"
      :code-label="formatCodeLabel"
    />

    <CaseInquiryProgressItem
      :rows="caseInquiryRows"
      :loading="caseInquiryLoading"
      :error-message="caseInquiryErrorMessage"
      :code-label="formatCodeLabel"
    />

    <OwnershipTransferInfoProgressItem />

    <ReceiptInfoProgressItem
      :rows="receiptRows"
      :loading="receiptLoading"
      :error-message="receiptErrorMessage"
      :code-label="formatCodeLabel"
    />

    <ReceiptDelegationRequestProgressItem />

    <ExternalESignStatusProgressItem
      v-if="transferList.length > 0"
      :list="transferList"
      :loading="transferLoading"
      :error-message="transferErrorMessage"
      :code-label="formatCodeLabel"
      :get-signature-status-class="getSignatureStatusClass"
      :on-detail="handleDetail"
    />

    <CaseDelegationCompleteProgressItem :case-count="caseInquiryRows.length" />

    <CostStatementProgressItem
      :rows="receiptDocumentRows"
      :loading="receiptDocumentLoading"
      :error-message="receiptDocumentErrorMessage"
      :format-number="formatNumber"
    />

    <CompletionDocumentRegisterProgressItem
      :rows="completionListRows"
      :loading="completionListLoading"
      :error-message="completionListErrorMessage"
      :code-label="formatCodeLabel"
    />

    <CompletionDocumentSubmitGuideProgressItem
      :full-certificate-rows="fullCertificateRows"
      :post-certificate-rows="postCertificateRows"
      :loading="completionDetailLoading"
      :error-message="completionDetailErrorMessage"
      :code-label="formatCodeLabel"
    />
  </ul>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import {
  registryCaseAPI,
  registryCompletionAPI,
  registryHousingBondAPI,
  registryLoanAccountAPI,
  registryReceiptAPI,
  registryReceiptDocumentAPI,
  registrySignatureAPI,
  registryTaxReportAPI,
  registryTransferCertificateAPI
} from '@/api/services/registry'
import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import { useThrottle } from '@/composables/utils/useThrottle'
import type {
  ApplicationReceiptListItem,
  CancellationCertificateListItem,
  CaseInquiryListItem,
  CompleteDocumentListItem,
  FullCertificateItem,
  HousingBondListRow,
  LoanPaymentAccountListItem,
  PostCertificateItem,
  ReceiptSummaryItem
} from '@/types'
import { extractArrayByKeys, extractRecordByKeys } from '@/utils/apiPayload'

import CaseDelegationCompleteProgressItem from './progress/CaseDelegationCompleteProgressItem.vue'
import CaseInquiryProgressItem from './progress/CaseInquiryProgressItem.vue'
import CompletionDocumentRegisterProgressItem from './progress/CompletionDocumentRegisterProgressItem.vue'
import CompletionDocumentSubmitGuideProgressItem from './progress/CompletionDocumentSubmitGuideProgressItem.vue'
import CostStatementProgressItem from './progress/CostStatementProgressItem.vue'
import ExternalESignStatusProgressItem from './progress/ExternalESignStatusProgressItem.vue'
import HousingBondProgressItem from './progress/HousingBondProgressItem.vue'
import InternalESignProgressItem from './progress/InternalESignProgressItem.vue'
import LoanAccountProgressItem from './progress/LoanAccountProgressItem.vue'
import OwnershipTransferInfoProgressItem from './progress/OwnershipTransferInfoProgressItem.vue'
import ReceiptDelegationRequestProgressItem from './progress/ReceiptDelegationRequestProgressItem.vue'
import ReceiptInfoProgressItem from './progress/ReceiptInfoProgressItem.vue'
import TaxDeclarationProgressItem from './progress/TaxDeclarationProgressItem.vue'
import TransferCertificateProgressItem from './progress/TransferCertificateProgressItem.vue'

interface Props {
  registryManagementNumber: string
  isOpen: boolean
}

interface ESignatureItem {
  eSignatureId: number
  partyRole: string
  partyRoleName: string
  name: string
  signatureMethod: string
  signatureMethodName: string
  signatureStatus: string
  signatureStatusName: string
  signatureRequestedAt: string | null
  signatureCompletedAt: string | null
  certificateExpiryDate: string | null
  verificationResult: string | null
  registryType: string
  documents: any[]
}

interface CompletionDetailPayload {
  fullCertificates?: FullCertificateItem[]
  postCertificates?: PostCertificateItem[]
}

interface TaxAgencyListRow {
  applicationId?: number
  registryType?: string
  registryTypeName?: string
  registryCause?: string
  paymentAmount?: number
  taxNumber?: string | null
  electronicPaymentNumber?: string | null
}

const props = defineProps<Props>()
const { formatCodeLabel } = useCodeReplacer()
const { getErrorMessage } = useErrorHandler()

function formatNumber(value?: number | null): string {
  if (typeof value !== 'number') return '-'
  return `${value.toLocaleString()}원`
}

// 근저당권 전자서명 (내부)
const mortgageLoading = ref(false)
const mortgageErrorMessage = ref('')
const mortgageList = ref<ESignatureItem[]>([])
const mortgageThrottle = useThrottle(1000)

// 소유권이전 전자서명 (외부)
const transferLoading = ref(false)
const transferErrorMessage = ref('')
const transferList = ref<ESignatureItem[]>([])
const transferThrottle = useThrottle(1000)

// 세금신고 대행 목록
const taxLoading = ref(false)
const taxErrorMessage = ref('')
const taxRows = ref<TaxAgencyListRow[]>([])
const taxThrottle = useThrottle(1000)

// 국민주택채권 목록
const housingBondLoading = ref(false)
const housingBondErrorMessage = ref('')
const housingBondRows = ref<HousingBondListRow[]>([])
const housingBondThrottle = useThrottle(1000)

// 대출금 지급계좌 목록
const loanAccountLoading = ref(false)
const loanAccountErrorMessage = ref('')
const loanAccountRows = ref<LoanPaymentAccountListItem[]>([])
const loanAccountThrottle = useThrottle(1000)

// 이전/말소 등기권리증 목록
const transferCertificateLoading = ref(false)
const transferCertificateErrorMessage = ref('')
const transferCertificateRows = ref<CancellationCertificateListItem[]>([])
const transferCertificateThrottle = useThrottle(1000)

// 신청사건 목록
const caseInquiryLoading = ref(false)
const caseInquiryErrorMessage = ref('')
const caseInquiryRows = ref<CaseInquiryListItem[]>([])
const caseInquiryThrottle = useThrottle(1000)

// 등기접수 목록
const receiptLoading = ref(false)
const receiptErrorMessage = ref('')
const receiptRows = ref<ApplicationReceiptListItem[]>([])
const receiptThrottle = useThrottle(1000)

// 등기 영수증 목록
const receiptDocumentLoading = ref(false)
const receiptDocumentErrorMessage = ref('')
const receiptDocumentRows = ref<ReceiptSummaryItem[]>([])
const receiptDocumentThrottle = useThrottle(1000)

// 등기 완료 문서 목록
const completionListLoading = ref(false)
const completionListErrorMessage = ref('')
const completionListRows = ref<CompleteDocumentListItem[]>([])
const completionListThrottle = useThrottle(1000)

// 등기 완료 문서 상세 (제출 안내)
const completionDetailLoading = ref(false)
const completionDetailErrorMessage = ref('')
const fullCertificateRows = ref<FullCertificateItem[]>([])
const postCertificateRows = ref<PostCertificateItem[]>([])
const completionDetailThrottle = useThrottle(1000)

// 전자서명 상태에 따른 CSS 클래스
function getSignatureStatusClass(status: string): string {
  const statusMap: Record<string, string> = {
    COMPLETED: 'status-completed',
    WAITING: 'status-waiting',
    REQUESTED: 'status-requested',
    REJECTED: 'status-rejected'
  }
  return statusMap[status] || 'status-default'
}

function handleDetail(item: ESignatureItem) {
  // TODO: 전자서명 상세 조회 화면 또는 상세 모달 연결
  void item
}

async function fetchMortgageSignatures() {
  if (!props.registryManagementNumber) {
    mortgageList.value = []
    mortgageErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await mortgageThrottle.execute(async () => {
    mortgageLoading.value = true
    mortgageErrorMessage.value = ''
    try {
      const res = await registrySignatureAPI.getDetail({
        registryManagementNumber: props.registryManagementNumber,
        registryType: 'MORTGAGE_REGISTRATION'
      })
      mortgageList.value = extractArrayByKeys<ESignatureItem>(res, ['items', 'content'])
    } catch (e: unknown) {
      mortgageList.value = []
      mortgageErrorMessage.value = getErrorMessage(e)
    } finally {
      mortgageLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchTransferSignatures() {
  if (!props.registryManagementNumber) {
    transferList.value = []
    transferErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await transferThrottle.execute(async () => {
    transferLoading.value = true
    transferErrorMessage.value = ''
    try {
      const res = await registrySignatureAPI.getDetail({
        registryManagementNumber: props.registryManagementNumber,
        registryType: 'OWNERSHIP_TRANSFER'
      })
      transferList.value = extractArrayByKeys<ESignatureItem>(res, ['items', 'content'])
    } catch (e: unknown) {
      transferList.value = []
      transferErrorMessage.value = getErrorMessage(e)
    } finally {
      transferLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchTaxAgencyList() {
  if (!props.registryManagementNumber) {
    taxRows.value = []
    taxErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await taxThrottle.execute(async () => {
    taxLoading.value = true
    taxErrorMessage.value = ''
    try {
      const res = await registryTaxReportAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      taxRows.value = extractArrayByKeys<TaxAgencyListRow>(res, ['rows', 'items', 'content'])
    } catch (e: unknown) {
      taxRows.value = []
      taxErrorMessage.value = getErrorMessage(e)
    } finally {
      taxLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchHousingBondList() {
  if (!props.registryManagementNumber) {
    housingBondRows.value = []
    housingBondErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await housingBondThrottle.execute(async () => {
    housingBondLoading.value = true
    housingBondErrorMessage.value = ''
    try {
      const res = await registryHousingBondAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      housingBondRows.value = extractArrayByKeys<HousingBondListRow>(res, [
        'rows',
        'items',
        'content'
      ])
    } catch (e: unknown) {
      housingBondRows.value = []
      housingBondErrorMessage.value = getErrorMessage(e)
    } finally {
      housingBondLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchLoanAccountList() {
  if (!props.registryManagementNumber) {
    loanAccountRows.value = []
    loanAccountErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await loanAccountThrottle.execute(async () => {
    loanAccountLoading.value = true
    loanAccountErrorMessage.value = ''
    try {
      const res = await registryLoanAccountAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      loanAccountRows.value = extractArrayByKeys<LoanPaymentAccountListItem>(res, [
        'items',
        'content'
      ])
    } catch (e: unknown) {
      loanAccountRows.value = []
      loanAccountErrorMessage.value = getErrorMessage(e)
    } finally {
      loanAccountLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchTransferCertificateList() {
  if (!props.registryManagementNumber) {
    transferCertificateRows.value = []
    transferCertificateErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await transferCertificateThrottle.execute(async () => {
    transferCertificateLoading.value = true
    transferCertificateErrorMessage.value = ''
    try {
      const res = await registryTransferCertificateAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      transferCertificateRows.value = extractArrayByKeys<CancellationCertificateListItem>(res, [
        'certificates',
        'items',
        'content'
      ])
    } catch (e: unknown) {
      transferCertificateRows.value = []
      transferCertificateErrorMessage.value = getErrorMessage(e)
    } finally {
      transferCertificateLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchCaseInquiryList() {
  if (!props.registryManagementNumber) {
    caseInquiryRows.value = []
    caseInquiryErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await caseInquiryThrottle.execute(async () => {
    caseInquiryLoading.value = true
    caseInquiryErrorMessage.value = ''
    try {
      const res = await registryCaseAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      caseInquiryRows.value = extractArrayByKeys<CaseInquiryListItem>(res, [
        'caseInquiry',
        'items',
        'content'
      ])
    } catch (e: unknown) {
      caseInquiryRows.value = []
      caseInquiryErrorMessage.value = getErrorMessage(e)
    } finally {
      caseInquiryLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchReceiptList() {
  if (!props.registryManagementNumber) {
    receiptRows.value = []
    receiptErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await receiptThrottle.execute(async () => {
    receiptLoading.value = true
    receiptErrorMessage.value = ''
    try {
      const res = await registryReceiptAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      receiptRows.value = extractArrayByKeys<ApplicationReceiptListItem>(res, [
        'applicationReceipt',
        'items',
        'content'
      ])
    } catch (e: unknown) {
      receiptRows.value = []
      receiptErrorMessage.value = getErrorMessage(e)
    } finally {
      receiptLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchReceiptDocumentList() {
  if (!props.registryManagementNumber) {
    receiptDocumentRows.value = []
    receiptDocumentErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await receiptDocumentThrottle.execute(async () => {
    receiptDocumentLoading.value = true
    receiptDocumentErrorMessage.value = ''
    try {
      const res = await registryReceiptDocumentAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      receiptDocumentRows.value = extractArrayByKeys<ReceiptSummaryItem>(res, [
        'receipts',
        'items',
        'content'
      ])
    } catch (e: unknown) {
      receiptDocumentRows.value = []
      receiptDocumentErrorMessage.value = getErrorMessage(e)
    } finally {
      receiptDocumentLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchCompletionList() {
  if (!props.registryManagementNumber) {
    completionListRows.value = []
    completionListErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await completionListThrottle.execute(async () => {
    completionListLoading.value = true
    completionListErrorMessage.value = ''
    try {
      const res = await registryCompletionAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      completionListRows.value = extractArrayByKeys<CompleteDocumentListItem>(res, [
        'completeDocument',
        'items',
        'content'
      ])
    } catch (e: unknown) {
      completionListRows.value = []
      completionListErrorMessage.value = getErrorMessage(e)
    } finally {
      completionListLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchCompletionDetail() {
  if (!props.registryManagementNumber) {
    fullCertificateRows.value = []
    postCertificateRows.value = []
    completionDetailErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await completionDetailThrottle.execute(async () => {
    completionDetailLoading.value = true
    completionDetailErrorMessage.value = ''
    try {
      const res = await registryCompletionAPI.getDetail({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = extractRecordByKeys<CompletionDetailPayload>(res, [
        'fullCertificates',
        'postCertificates'
      ])
      fullCertificateRows.value = Array.isArray(data?.fullCertificates) ? data.fullCertificates : []
      postCertificateRows.value = Array.isArray(data?.postCertificates) ? data.postCertificates : []
    } catch (e: unknown) {
      fullCertificateRows.value = []
      postCertificateRows.value = []
      completionDetailErrorMessage.value = getErrorMessage(e)
    } finally {
      completionDetailLoading.value = false
    }
  })

  if (result === null) return
}

async function fetchAllProgressLists() {
  await Promise.all([
    fetchMortgageSignatures(),
    fetchTransferSignatures(),
    fetchTaxAgencyList(),
    fetchHousingBondList(),
    fetchLoanAccountList(),
    fetchTransferCertificateList(),
    fetchCaseInquiryList(),
    fetchReceiptList(),
    fetchReceiptDocumentList(),
    fetchCompletionList(),
    fetchCompletionDetail()
  ])
}

watch(
  () => props.registryManagementNumber,
  (newVal) => {
    if (newVal) {
      void fetchAllProgressLists()
    }
  },
  { immediate: true }
)

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.registryManagementNumber) {
      void fetchAllProgressLists()
    }
  }
)
</script>
