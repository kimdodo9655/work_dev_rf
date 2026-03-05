<!-- 문서 경로: `@/src/features/registration/pages/ProgressSection.vue`
문서 제목: 기능 페이지/컴포넌트: progress-section -->

<template>
  <ul class="sub-list">
    <!-- [내부] 전자서명 진행 (근저당권) -->
    <li v-if="mortgageList.length > 0" class="sub-item" data-scroll-id="progress-e-sign">
      <div class="sub-title">[내부] 전자서명 진행</div>

      <section class="case-detail">
        <div v-if="mortgageLoading" class="muted">불러오는 중…</div>
        <div v-else-if="mortgageErrorMessage" class="error">{{ mortgageErrorMessage }}</div>

        <div v-else class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>구분</th>
                <th>성명(명칭)</th>
                <th>서명방식</th>
                <th>서명요청 일시</th>
                <th>서명완료 일시</th>
                <th>전자서명여부</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in mortgageList" :key="item.eSignatureId">
                <td>{{ displayCode(item.partyRole, 'partyRoles') }}</td>
                <td>{{ item.name }}</td>
                <td>{{ displayCode(item.signatureMethod, 'eSignatureMethods') }}</td>
                <td>{{ item.signatureRequestedAt ?? '-' }}</td>
                <td>{{ item.signatureCompletedAt ?? '-' }}</td>
                <td>
                  <span :class="getSignatureStatusClass(item.signatureStatus)">
                    {{ displayCode(item.signatureStatus, 'eSignatureStatuses') }}
                  </span>
                </td>
                <td>
                  <button class="detail-btn" @click="handleDetail(item)">상세</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <li class="sub-item" data-scroll-id="progress-tax-declaration">
      <div class="sub-title">세금신고 대행</div>

      <section class="case-detail">
        <div v-if="taxLoading" class="muted">불러오는 중…</div>
        <div v-else-if="taxErrorMessage" class="error">{{ taxErrorMessage }}</div>

        <div v-else class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>등기유형</th>
                <th>등기원인</th>
                <th>납부상태</th>
                <th>납부금액</th>
                <th>납세번호</th>
                <th>전자납부번호</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="taxRows.length === 0">
                <td colspan="6" class="empty-cell">조회된 목록이 없습니다.</td>
              </tr>
              <tr v-for="(row, idx) in taxRows" :key="`tax-${idx}-${row.applicationId ?? idx}`">
                <td>{{ displayCode(row.registryTypeName, 'registryTypes') }}</td>
                <td>{{ displayCode(row.registryCause, 'registryCauses') }}</td>
                <td>{{ row.paymentStatusName ?? '-' }}</td>
                <td>{{ formatNumber(row.paymentAmount) }}</td>
                <td>{{ row.taxNumber ?? '-' }}</td>
                <td>{{ row.electronicPaymentNumber ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <li class="sub-item" data-scroll-id="progress-housing-bond">
      <div class="sub-title">국민주택채권 매입</div>

      <section class="case-detail">
        <div v-if="housingBondLoading" class="muted">불러오는 중…</div>
        <div v-else-if="housingBondErrorMessage" class="error">{{ housingBondErrorMessage }}</div>

        <div v-else class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>등기유형</th>
                <th>매입구분</th>
                <th>매입대상금액</th>
                <th>채권매입금액</th>
                <th>채권할인금액</th>
                <th>채권번호</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="housingBondRows.length === 0">
                <td colspan="6" class="empty-cell">조회된 목록이 없습니다.</td>
              </tr>
              <tr
                v-for="(row, idx) in housingBondRows"
                :key="`bond-${idx}-${row.applicationId ?? idx}`"
              >
                <td>{{ displayCode(row.registryType, 'registryTypes') }}</td>
                <td>{{ row.purchaseType ?? '-' }}</td>
                <td>{{ formatNumber(row.purchaseTargetAmount) }}</td>
                <td>{{ formatNumber(row.bondPurchaseAmount) }}</td>
                <td>{{ row.bondDiscountAmount ?? '-' }}</td>
                <td>{{ row.housingBondNumber ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <li class="sub-item" data-scroll-id="progress-loan-account">
      <div class="sub-title">대출금 지급계좌 등록</div>

      <section class="case-detail">
        <div v-if="loanAccountLoading" class="muted">불러오는 중…</div>
        <div v-else-if="loanAccountErrorMessage" class="error">{{ loanAccountErrorMessage }}</div>

        <div v-else class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>지급구분</th>
                <th>지급주체</th>
                <th>지급금액</th>
                <th>은행</th>
                <th>계좌번호</th>
                <th>상환영수증</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loanAccountRows.length === 0">
                <td colspan="6" class="empty-cell">조회된 목록이 없습니다.</td>
              </tr>
              <tr
                v-for="(row, idx) in loanAccountRows"
                :key="`loan-${idx}-${row.loanPaymentAccountId ?? idx}`"
              >
                <td>{{ row.paymentType ?? '-' }}</td>
                <td>{{ row.paymentSubject ?? '-' }}</td>
                <td>{{ formatNumber(row.paymentAmount) }}</td>
                <td>{{ row.paymentBank ?? '-' }}</td>
                <td>{{ row.accountNumber ?? '-' }}</td>
                <td>{{ row.receiptUploaded ? '등록' : '미등록' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <li class="sub-item" data-scroll-id="progress-transfer-certificate">
      <div class="sub-title">이전/말소 등기권리증 등록</div>

      <section class="case-detail">
        <div v-if="transferCertificateLoading" class="muted">불러오는 중…</div>
        <div v-else-if="transferCertificateErrorMessage" class="error">
          {{ transferCertificateErrorMessage }}
        </div>

        <div v-else class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>등기유형</th>
                <th>부동산고유번호</th>
                <th>성명(명칭)</th>
                <th>접수일자</th>
                <th>접수번호</th>
                <th>권리증구분</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="transferCertificateRows.length === 0">
                <td colspan="6" class="empty-cell">조회된 목록이 없습니다.</td>
              </tr>
              <tr
                v-for="(row, idx) in transferCertificateRows"
                :key="`cert-${idx}-${row.propertyUniqueNumber ?? idx}`"
              >
                <td>{{ displayCode(row.registryType, 'registryTypes') }}</td>
                <td>{{ row.propertyUniqueNumber ?? '-' }}</td>
                <td>{{ row.name ?? '-' }}</td>
                <td>{{ row.receiptDate ?? '-' }}</td>
                <td>{{ row.receiptNumber ?? '-' }}</td>
                <td>{{ displayCode(row.certificateType, 'certificateTypes') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <li class="sub-item">
      <div class="sub-title">등기 신청사건 조회</div>

      <section class="case-detail">
        <div v-if="caseInquiryLoading" class="muted">불러오는 중…</div>
        <div v-else-if="caseInquiryErrorMessage" class="error">{{ caseInquiryErrorMessage }}</div>

        <div v-else class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>부동산고유번호</th>
                <th>부동산구분</th>
                <th>부동산표시</th>
                <th>등기유형목록</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="caseInquiryRows.length === 0">
                <td colspan="4" class="empty-cell">조회된 목록이 없습니다.</td>
              </tr>
              <tr
                v-for="(row, idx) in caseInquiryRows"
                :key="`case-${idx}-${row.propertyUniqueNumber ?? idx}`"
              >
                <td>{{ row.propertyUniqueNumber ?? '-' }}</td>
                <td>{{ row.propertyType ?? '-' }}</td>
                <td>{{ row.propertyAddress ?? '-' }}</td>
                <td>
                  {{
                    row.registryTypes?.length
                      ? row.registryTypes
                          .map((type) => displayCode(type, 'registryTypes'))
                          .join(', ')
                      : '-'
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <li class="sub-item">
      <div class="sub-title">소유권이전 신청서 작성 정보</div>
      <div class="caption">
        현재 페이지에는 전용 목록 조회 API가 없어 신청사건/접수/완료 문서 데이터로 확인합니다.
      </div>
    </li>

    <li class="sub-item" data-scroll-id="progress-receipt-info">
      <div class="sub-title">등기접수 정보 등록</div>

      <section class="case-detail">
        <div v-if="receiptLoading" class="muted">불러오는 중…</div>
        <div v-else-if="receiptErrorMessage" class="error">{{ receiptErrorMessage }}</div>

        <div v-else class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>등기유형</th>
                <th>등기방식</th>
                <th>접수등기소</th>
                <th>작성번호</th>
                <th>접수일자</th>
                <th>접수번호</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="receiptRows.length === 0">
                <td colspan="6" class="empty-cell">조회된 목록이 없습니다.</td>
              </tr>
              <tr
                v-for="(row, idx) in receiptRows"
                :key="`receipt-${idx}-${row.creationNumber ?? idx}`"
              >
                <td>{{ displayCode(row.registryType, 'registryTypes') }}</td>
                <td>{{ displayCode(row.registryMethod, 'registryMethods') }}</td>
                <td>{{ row.registryReceiptOffice ?? '-' }}</td>
                <td>{{ row.creationNumber ?? '-' }}</td>
                <td>{{ row.receiptDate ?? '-' }}</td>
                <td>{{ row.receiptNumber ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <li class="sub-item">
      <div class="sub-title">등기접수 정보 등록 - 사건 위임 요청</div>
      <div class="caption">사건 위임 관련 목록은 신청사건 목록 API를 함께 사용합니다.</div>
    </li>

    <!-- [외부] 전자서명 진행상태 관리 (소유권이전) -->
    <li v-if="transferList.length > 0" class="sub-item" data-scroll-id="progress-e-sign-status">
      <div class="sub-title">[외부] 전자서명 진행상태 관리</div>

      <section class="case-detail">
        <div v-if="transferLoading" class="muted">불러오는 중…</div>
        <div v-else-if="transferErrorMessage" class="error">{{ transferErrorMessage }}</div>

        <div v-else class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>구분</th>
                <th>성명(명칭)</th>
                <th>서명방식</th>
                <th>서명요청 일시</th>
                <th>서명완료 일시</th>
                <th>전자서명여부</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in transferList" :key="item.eSignatureId">
                <td>{{ displayCode(item.partyRole, 'partyRoles') }}</td>
                <td>{{ item.name }}</td>
                <td>{{ displayCode(item.signatureMethod, 'eSignatureMethods') }}</td>
                <td>{{ item.signatureRequestedAt ?? '-' }}</td>
                <td>{{ item.signatureCompletedAt ?? '-' }}</td>
                <td>
                  <span :class="getSignatureStatusClass(item.signatureStatus)">
                    {{ displayCode(item.signatureStatus, 'eSignatureStatuses') }}
                  </span>
                </td>
                <td>
                  <button class="detail-btn" @click="handleDetail(item)">상세</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <li class="sub-item" data-scroll-id="progress-case-delegation">
      <div class="sub-title">[외부] 전자서명 진행상태 관리 - 사건 위임 완료</div>
      <div class="caption">신청사건 목록 건수: {{ caseInquiryRows.length }}건</div>
    </li>

    <li class="sub-item" data-scroll-id="progress-cost-statement">
      <div class="sub-title">등기 영수증 작성</div>

      <section class="case-detail">
        <div v-if="receiptDocumentLoading" class="muted">불러오는 중…</div>
        <div v-else-if="receiptDocumentErrorMessage" class="error">
          {{ receiptDocumentErrorMessage }}
        </div>

        <div v-else class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>등기유형</th>
                <th>보수료 소계</th>
                <th>채권할인금액</th>
                <th>등기비용 합계</th>
                <th>전자문서</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="receiptDocumentRows.length === 0">
                <td colspan="5" class="empty-cell">조회된 목록이 없습니다.</td>
              </tr>
              <tr
                v-for="(row, idx) in receiptDocumentRows"
                :key="`receipt-doc-${idx}-${row.receiptDocumentId ?? idx}`"
              >
                <td>{{ row.registryTypeName ?? '-' }}</td>
                <td>{{ formatNumber(row.feeSubtotal) }}</td>
                <td>{{ formatNumber(row.bondDiscountAmount) }}</td>
                <td>{{ formatNumber(row.costTotal) }}</td>
                <td>{{ row.documentGenerated ? '생성' : '미생성' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <li class="sub-item" data-scroll-id="progress-completion-doc-register">
      <div class="sub-title">등기 완료 문서 등록</div>

      <section class="case-detail">
        <div v-if="completionListLoading" class="muted">불러오는 중…</div>
        <div v-else-if="completionListErrorMessage" class="error">
          {{ completionListErrorMessage }}
        </div>

        <div v-else class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>문서명</th>
                <th>부동산고유번호</th>
                <th>등기유형</th>
                <th>등기권리자</th>
                <th>파일경로</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="completionListRows.length === 0">
                <td colspan="5" class="empty-cell">조회된 목록이 없습니다.</td>
              </tr>
              <tr
                v-for="(row, idx) in completionListRows"
                :key="`completion-list-${idx}-${row.propertyUniqueNumber ?? idx}`"
              >
                <td>{{ row.documentName ?? '-' }}</td>
                <td>{{ row.propertyUniqueNumber ?? '-' }}</td>
                <td>{{ displayCode(row.registryType, 'registryTypes') }}</td>
                <td>{{ row.obligeeName ?? '-' }}</td>
                <td>{{ row.filePath ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <li class="sub-item" data-scroll-id="progress-completion-doc-submit">
      <div class="sub-title">등기 완료 문서 제출 안내</div>

      <section class="case-detail">
        <div v-if="completionDetailLoading" class="muted">불러오는 중…</div>
        <div v-else-if="completionDetailErrorMessage" class="error">
          {{ completionDetailErrorMessage }}
        </div>

        <template v-else>
          <div class="caption">등기사항전부증명서 {{ fullCertificateRows.length }}건</div>
          <div class="table-wrapper">
            <table class="data-table-area">
              <thead>
                <tr>
                  <th>부동산고유번호</th>
                  <th>부동산구분</th>
                  <th>관할등기소</th>
                  <th>부동산주소</th>
                  <th>업로드파일</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="fullCertificateRows.length === 0">
                  <td colspan="5" class="empty-cell">조회된 목록이 없습니다.</td>
                </tr>
                <tr
                  v-for="(row, idx) in fullCertificateRows"
                  :key="`full-cert-${idx}-${row.propertyUniqueNumber ?? idx}`"
                >
                  <td>{{ row.propertyUniqueNumber ?? '-' }}</td>
                  <td>{{ row.propertyType ?? '-' }}</td>
                  <td>{{ row.jurisdictionRegistryOffice ?? '-' }}</td>
                  <td>{{ row.propertyAddress ?? '-' }}</td>
                  <td>{{ row.fileName ?? '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="caption">사후 등기필정보 {{ postCertificateRows.length }}건</div>
          <div class="table-wrapper">
            <table class="data-table-area">
              <thead>
                <tr>
                  <th>문서명</th>
                  <th>부동산고유번호</th>
                  <th>등기유형</th>
                  <th>등기권리자</th>
                  <th>파일경로</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="postCertificateRows.length === 0">
                  <td colspan="5" class="empty-cell">조회된 목록이 없습니다.</td>
                </tr>
                <tr
                  v-for="(row, idx) in postCertificateRows"
                  :key="`post-cert-${idx}-${row.propertyUniqueNumber ?? idx}`"
                >
                  <td>{{ row.documentName ?? '-' }}</td>
                  <td>{{ row.propertyUniqueNumber ?? '-' }}</td>
                  <td>{{ displayCode(row.registryType, 'registryTypes') }}</td>
                  <td>{{ row.obligeeName ?? '-' }}</td>
                  <td>{{ row.filePath ?? '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </section>
    </li>
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
  ReceiptSummaryItem,
  Row as TaxAgencyRow
} from '@/types'

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

const props = defineProps<Props>()
const { findOriginalCode, findReplacement, replaceText } = useCodeReplacer()
const { getErrorMessage } = useErrorHandler()

function displayCode(value?: string | null, category?: string): string {
  if (!value) return '-'
  const original = String(value)
  const directReplaced = category ? findReplacement(original, category) : replaceText(original)
  if (directReplaced && directReplaced !== original) return `${original} -> ${directReplaced}`

  if (category) {
    const inferredCode = findOriginalCode(original, category)
    if (inferredCode) return `${inferredCode} -> ${original}`
  }

  return original
}

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
const taxRows = ref<TaxAgencyRow[]>([])
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

function unwrapData<T>(res: any): T {
  if (res?.data && typeof res.data === 'object' && 'data' in res.data) return res.data.data as T
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return undefined as unknown as T
}

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
  // TODO: 상세 페이지 이동 또는 모달 열기
  console.log('전자서명 상세 보기:', item)
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
      const res: any = await registrySignatureAPI.getDetail({
        registryManagementNumber: props.registryManagementNumber,
        registryType: 'MORTGAGE_REGISTRATION'
      })
      const data = unwrapData<ESignatureItem[]>(res)
      mortgageList.value = Array.isArray(data) ? data : []
    } catch (e: any) {
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
      const res: any = await registrySignatureAPI.getDetail({
        registryManagementNumber: props.registryManagementNumber,
        registryType: 'OWNERSHIP_TRANSFER'
      })
      const data = unwrapData<ESignatureItem[]>(res)
      transferList.value = Array.isArray(data) ? data : []
    } catch (e: any) {
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
      const res: any = await registryTaxReportAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<{ rows?: TaxAgencyRow[] }>(res)
      taxRows.value = Array.isArray(data?.rows) ? data.rows : []
    } catch (e: any) {
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
      const res: any = await registryHousingBondAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<{ rows?: HousingBondListRow[] }>(res)
      housingBondRows.value = Array.isArray(data?.rows) ? data.rows : []
    } catch (e: any) {
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
      const res: any = await registryLoanAccountAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<{ items?: LoanPaymentAccountListItem[] }>(res)
      loanAccountRows.value = Array.isArray(data?.items) ? data.items : []
    } catch (e: any) {
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
      const res: any = await registryTransferCertificateAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<{ certificates?: CancellationCertificateListItem[] }>(res)
      transferCertificateRows.value = Array.isArray(data?.certificates) ? data.certificates : []
    } catch (e: any) {
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
      const res: any = await registryCaseAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<{ caseInquiry?: CaseInquiryListItem[] }>(res)
      caseInquiryRows.value = Array.isArray(data?.caseInquiry) ? data.caseInquiry : []
    } catch (e: any) {
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
      const res: any = await registryReceiptAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<{ applicationReceipt?: ApplicationReceiptListItem[] }>(res)
      receiptRows.value = Array.isArray(data?.applicationReceipt) ? data.applicationReceipt : []
    } catch (e: any) {
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
      const res: any = await registryReceiptDocumentAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<{ receipts?: ReceiptSummaryItem[] }>(res)
      receiptDocumentRows.value = Array.isArray(data?.receipts) ? data.receipts : []
    } catch (e: any) {
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
      const res: any = await registryCompletionAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<{ completeDocument?: CompleteDocumentListItem[] }>(res)
      completionListRows.value = Array.isArray(data?.completeDocument) ? data.completeDocument : []
    } catch (e: any) {
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
      const res: any = await registryCompletionAPI.getDetail({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<{
        fullCertificates?: FullCertificateItem[]
        postCertificates?: PostCertificateItem[]
      }>(res)
      fullCertificateRows.value = Array.isArray(data?.fullCertificates) ? data.fullCertificates : []
      postCertificateRows.value = Array.isArray(data?.postCertificates) ? data.postCertificates : []
    } catch (e: any) {
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
  background: #eee;
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

.caption {
  font-size: 12px;
  color: #4b5563;
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

.table-wrapper {
  overflow-x: auto;
}

.data-table-area {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;

  thead {
    background: #f9fafb;

    th {
      padding: 12px 8px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f9fafb;
      }
    }

    td {
      padding: 12px 8px;
      font-size: 13px;
      color: #111827;
      white-space: nowrap;
    }
  }
}

.empty-cell {
  text-align: center;
  color: #6b7280;
}

.detail-btn {
  padding: 4px 12px;
  font-size: 12px;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }
}

// 전자서명 상태별 스타일
.status-completed {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #059669;
  background: #d1fae5;
  border-radius: 6px;
}

.status-waiting {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  background: #f3f4f6;
  border-radius: 6px;
}

.status-requested {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #f59e0b;
  background: #fef3c7;
  border-radius: 6px;
}

.status-rejected {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #dc2626;
  background: #fee2e2;
  border-radius: 6px;
}

.status-default {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  background: #f3f4f6;
  border-radius: 6px;
}
</style>
