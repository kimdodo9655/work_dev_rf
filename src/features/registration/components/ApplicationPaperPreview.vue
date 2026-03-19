<template>
  <section class="paper-preview">
    <div v-if="loading" class="paper-state muted">신청서 정보를 불러오는 중…</div>
    <div v-else-if="errorMessage" class="paper-state error">{{ errorMessage }}</div>
    <div v-else-if="!formData" class="paper-state muted">표시할 신청서 정보가 없습니다.</div>
    <div v-else class="paper-scroll">
      <div class="paper-stage">
        <div v-for="(pageRows, pageIndex) in pages" :key="`page-${pageIndex}`" class="paper-shell">
          <article class="paper-sheet">
            <header class="paper-header">
              <div>
                <p class="paper-kicker">등기신청서 미리보기</p>
                <h3 class="paper-title">
                  {{ displayRegistryType(document?.registryType) || '등기신청서' }}
                </h3>
              </div>
              <div class="paper-header-meta">
                <span>신청서 ID {{ applicationId }}</span>
                <span>{{ pageIndex + 1 }} / {{ pages.length }}</span>
              </div>
            </header>

            <div class="row-list">
              <div v-for="row in pageRows" :key="row.key" class="row-item">
                <div class="row-label">{{ row.label }}</div>
                <div class="row-value">
                  <p
                    v-for="(line, lineIndex) in row.lines"
                    :key="`${row.key}-${lineIndex}`"
                    :class="['row-line', { 'is-blank': line === '' }]"
                  >
                    <template v-if="hasKeyValueLine(line)">
                      <strong class="value-key">{{ getLineKey(line) }} :</strong>
                      <template v-if="getLineValue(line)">
                        <span>&nbsp;</span>
                        <template
                          v-for="(segment, segmentIndex) in colorizeLine(getLineValue(line))"
                          :key="segmentIndex"
                        >
                          <span :class="{ literal: segment.literal }">
                            {{ segment.text || '\u00A0' }}
                          </span>
                        </template>
                      </template>
                    </template>
                    <template v-else>
                      <template
                        v-for="(segment, segmentIndex) in colorizeLine(line)"
                        :key="segmentIndex"
                      >
                        <span
                          :class="{
                            literal: segment.literal,
                            'array-marker': isArrayMarkerLine(line)
                          }"
                        >
                          {{ segment.text || '\u00A0' }}
                        </span>
                      </template>
                    </template>
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { registryTypeAPI } from '@/api/services/registry'
import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import type {
  RegistryApplicationDocumentResponse,
  UnifiedApplicationFormResponse
} from '@/types/api/registry-type.types'
import { extractPrimaryPayload } from '@/utils/apiPayload'
import { formatCurrency, formatDate } from '@/utils/format'

interface Props {
  applicationId?: number
  document?: RegistryApplicationDocumentResponse | null
}

interface DisplayRow {
  key: string
  label: string
  lines: string[]
}

const props = defineProps<Props>()

const ROWS_PER_PAGE = 8

const { getErrorMessage } = useErrorHandler()
const { formatCodeLabel } = useCodeReplacer()

const loading = ref(false)
const errorMessage = ref('')
const formData = ref<UnifiedApplicationFormResponse | null>(null)

const rows = computed<DisplayRow[]>(() => {
  if (!formData.value) return []

  const data = formData.value
  const partyData = data.contractParties

  return [
    createRow('registryType', '등기유형', displayRegistryType(data.registryType)),
    createRow(
      'specialLawAppliedNote',
      '특례법 적용 안내 문구',
      formatScalar(data.specialLawAppliedNote)
    ),
    createRow(
      'transferShareDescription',
      '이전할 지분 설명',
      formatScalar(data.transferShareDescription)
    ),
    createRow('shareDescription', '설정할 지분 설명', formatScalar(data.shareDescription)),
    createRow('registrationPurpose', '등기의 목적', formatScalar(data.registrationPurpose)),

    createRow(
      'agentInfo.lawFirmName',
      '대리인 법무사 명칭',
      formatScalar(data.agentInfo?.lawFirmName)
    ),
    createRow(
      'agentInfo.qualificationType',
      '대리인 자격자 구분',
      formatQualifiedType(data.agentInfo?.qualificationType)
    ),
    createRow(
      'agentInfo.qualifiedPersonName',
      '대리인 자격자 성명',
      formatScalar(data.agentInfo?.qualifiedPersonName)
    ),
    createRow(
      'agentInfo.phoneNumber',
      '대리인 전화번호',
      formatPhoneWithExtension(data.agentInfo?.phoneNumber, data.agentInfo?.extensionNumber)
    ),
    createRow('agentInfo.address', '대리인 주소', formatScalar(data.agentInfo?.address)),

    createRow(
      'contractParties.debtors',
      '채무자 목록',
      formatObjectList(partyData?.debtors, [
        ['name', '성명'],
        ['registrationNumber', '등록번호'],
        ['address', '주소'],
        ['addressDetail', '상세주소'],
        ['share', '지분']
      ])
    ),
    createRow(
      'contractParties.shareDescription',
      '계약당사자 지분 설명',
      formatScalar(partyData?.shareDescription)
    ),
    createRow(
      'contractParties.obligorsWithShare',
      '등기의무자 목록',
      formatObjectList(partyData?.obligorsWithShare, [
        ['progressPartyId', '진행당사자 ID'],
        ['name', '성명(명칭)'],
        ['registrationNumber', '등록번호'],
        ['address', '주소'],
        ['addressDetail', '상세주소'],
        ['share', '지분'],
        ['holdingShare', '보유 지분'],
        ['transferShare', '이전 지분'],
        ['section', '해당구'],
        ['rankNumber', '순위번호']
      ])
    ),
    createRow(
      'contractParties.obligeesWithShare',
      '등기권리자 목록',
      formatObjectList(partyData?.obligeesWithShare, [
        ['progressPartyId', '진행당사자 ID'],
        ['name', '성명(명칭)'],
        ['registrationNumber', '등록번호'],
        ['address', '주소'],
        ['addressDetail', '상세주소'],
        ['share', '지분'],
        ['holdingShare', '보유 지분'],
        ['transferShare', '이전 지분'],
        ['section', '해당구'],
        ['rankNumber', '순위번호']
      ])
    ),
    createRow(
      'contractParties.registryCertificates',
      '등기의무자 등기필정보 목록',
      formatObjectList(partyData?.registryCertificates, [
        ['propertyUniqueNumber', '부동산 고유번호'],
        ['ownerName', '소유자(명칭)'],
        ['certificateSerialNumber', '등기필정보 일련번호'],
        ['certificatePassword', '등기필정보 비밀번호']
      ])
    ),

    createRow(
      'ownershipContract.contractAmount',
      '소유권이전 계약 금액',
      formatAmount(data.ownershipContract?.contractAmount)
    ),
    createRow(
      'ownershipContract.contractDate',
      '소유권이전 계약 일자',
      formatDateValue(data.ownershipContract?.contractDate)
    ),
    createRow(
      'ownershipContract.registryReceiptDate',
      '소유권이전 등기 접수 일자',
      formatDateValue(data.ownershipContract?.registryReceiptDate)
    ),
    createRow(
      'ownershipContract.tradeReportManagementNumber',
      '실거래신고 관리번호',
      formatScalar(data.ownershipContract?.tradeReportManagementNumber)
    ),
    createRow(
      'ownershipContract.registrationPurpose',
      '소유권이전 등기의 목적',
      formatScalar(data.ownershipContract?.registrationPurpose)
    ),

    createRow(
      'mortgageContract',
      '근저당권설정 계약 정보',
      formatLabeledObject(data.mortgageContract, [
        ['maximumCreditAmount', '채권 최고액', 'amount'],
        ['contractDate', '계약 일자', 'date'],
        ['registryReceiptDate', '등기 접수 일자', 'date']
      ])
    ),
    createRow(
      'surfaceRightContract',
      '지상권설정 계약 정보',
      formatLabeledObject(data.surfaceRightContract, [
        ['durationPeriod', '존속 기간'],
        ['contractDate', '계약 일자', 'date'],
        ['establishmentScope', '설정 범위'],
        ['establishmentPurpose', '설정 목적']
      ])
    ),

    createRow(
      'mortgageFinancial.bondPurchaseType',
      '채권 매입 구분',
      formatBondPurchaseType(data.mortgageFinancial?.bondPurchaseType)
    ),
    createRow(
      'mortgageFinancial.bondExemptionReason',
      '채권 면제 사유',
      formatScalar(data.mortgageFinancial?.bondExemptionReason)
    ),
    createRow(
      'mortgageFinancial.maximumCreditAmount',
      '채권최고액',
      formatAmount(data.mortgageFinancial?.maximumCreditAmount)
    ),
    createRow(
      'mortgageFinancial.bondPurchaseAmount',
      '채권 매입 금액 합계',
      formatAmount(data.mortgageFinancial?.bondPurchaseAmount)
    ),
    createRow(
      'mortgageFinancial.housingBondNumber',
      '국민주택채권 번호/안내',
      formatScalar(data.mortgageFinancial?.housingBondNumber)
    ),
    createRow(
      'mortgageFinancial.registryType',
      '채권/세금 등기유형',
      displayRegistryType(data.mortgageFinancial?.registryType)
    ),
    createRow(
      'mortgageFinancial.taxExemptionReason',
      '세금 면제 사유',
      formatScalar(data.mortgageFinancial?.taxExemptionReason)
    ),
    createRow(
      'mortgageFinancial.registrationLicenseTax',
      '등록면허세',
      formatAmount(data.mortgageFinancial?.registrationLicenseTax)
    ),
    createRow(
      'mortgageFinancial.educationTax',
      '교육세',
      formatAmount(data.mortgageFinancial?.educationTax)
    ),
    createRow(
      'mortgageFinancial.ruralSpecialTax',
      '농어촌특별세',
      formatAmount(data.mortgageFinancial?.ruralSpecialTax)
    ),
    createRow(
      'mortgageFinancial.taxTotalAmount',
      '세금 합계',
      formatAmount(data.mortgageFinancial?.taxTotalAmount)
    ),
    createRow(
      'mortgageFinancial.filingFeePaymentStatus',
      '등기신청수수료 납부 여부',
      formatPaymentStatus(data.mortgageFinancial?.filingFeePaymentStatus)
    ),
    createRow(
      'mortgageFinancial.filingFeeExemptionReason',
      '등기신청수수료 면제 사유',
      formatScalar(data.mortgageFinancial?.filingFeeExemptionReason)
    ),
    createRow(
      'mortgageFinancial.filingFeeRegistryMethod',
      '등기신청수수료 등기 방식',
      formatRegistryMethod(data.mortgageFinancial?.filingFeeRegistryMethod)
    ),
    createRow(
      'mortgageFinancial.filingFeeRegistryCount',
      '등기신청수수료 건수',
      formatNumberLike(data.mortgageFinancial?.filingFeeRegistryCount)
    ),
    createRow(
      'mortgageFinancial.filingFeeAmount',
      '등기신청수수료 합계',
      formatAmount(data.mortgageFinancial?.filingFeeAmount)
    ),

    createRow(
      'taxPopup.tax',
      '세금 팝업 세금 정보',
      formatLabeledObject(data.taxPopup?.tax, [
        ['registrationLicenseTax', '등록면허세', 'amount'],
        ['educationTax', '교육세', 'amount'],
        ['ruralSpecialTax', '농어촌특별세', 'amount'],
        ['paymentAmount', '세액 합계', 'amount'],
        ['exemptionReason', '비과세/면제 사유'],
        ['bondPurchaseAmount', '국민주택채권 매입금액', 'amount']
      ])
    ),
    createRow(
      'taxPopup.applicationFee',
      '세금 팝업 수수료 정보',
      formatLabeledObject(data.taxPopup?.applicationFee, [
        ['applicationFee', '등기신청수수료', 'amount'],
        ['registryCount', '등기 건수', 'number'],
        ['batchPaymentAmount', '일괄납부 금액', 'amount'],
        ['exemptionReason', '감면 사유']
      ])
    ),

    createRow(
      'cancellation.cancellationContent',
      '말소사항',
      formatScalar(data.cancellation?.cancellationContent)
    ),
    createRow(
      'attachments',
      '첨부서면 목록',
      formatObjectList(data.attachments, [
        ['attachmentName', '문서명'],
        ['quantity', '통수']
      ])
    ),
    createRow('properties', '부동산 목록', formatProperties(data.properties)),
    createRow(
      'correction',
      '경정사항 정보',
      formatNestedObject(data.correction, [
        ['correctionContent', '경정사항'],
        ['applicant.name', '신청인 성명'],
        ['applicant.registrationNumber', '신청인 등록번호'],
        ['applicant.address', '신청인 주소']
      ])
    ),
    createRow(
      'change',
      '변경사항 정보',
      formatNestedObject(data.change, [
        ['changeContent', '변경사항'],
        ['applicant.name', '신청인 성명'],
        ['applicant.registrationNumber', '신청인 등록번호'],
        ['applicant.address', '신청인 주소']
      ])
    ),
    createRow('certificates', '등기필정보 목록', formatCertificates(data.certificates))
  ]
})

const pages = computed(() => chunkRows(rows.value, ROWS_PER_PAGE))

function createRow(key: string, label: string, rawValue: string): DisplayRow {
  return {
    key,
    label,
    lines: rawValue.split('\n')
  }
}

function chunkRows(list: DisplayRow[], size: number): DisplayRow[][] {
  const chunks: DisplayRow[][] = []

  for (let index = 0; index < list.length; index += size) {
    chunks.push(list.slice(index, index + size))
  }

  return chunks
}

function colorizeLine(line: string) {
  const matches = [...line.matchAll(/\b(true|false|null)\b/g)]
  if (matches.length === 0) return [{ text: line, literal: false }]

  const segments: Array<{ text: string; literal: boolean }> = []
  let cursor = 0

  matches.forEach((match) => {
    const start = match.index ?? 0
    const text = match[0]
    if (start > cursor) {
      segments.push({ text: line.slice(cursor, start), literal: false })
    }
    segments.push({ text, literal: true })
    cursor = start + text.length
  })

  if (cursor < line.length) {
    segments.push({ text: line.slice(cursor), literal: false })
  }

  return segments
}

function hasKeyValueLine(line: string): boolean {
  return line.includes(' : ') || line.endsWith(' :')
}

function isArrayMarkerLine(line: string): boolean {
  return /^\[\d+\]$/.test(line) || line === '[---]'
}

function getLineKey(line: string): string {
  if (line.includes(' : ')) {
    return line.split(' : ')[0] ?? line
  }
  if (line.endsWith(' :')) {
    return line.slice(0, -2)
  }
  return line
}

function getLineValue(line: string): string {
  if (!line.includes(' : ')) return ''
  return line.split(' : ').slice(1).join(' : ')
}

function displayRegistryType(value?: string): string {
  return formatCodeLabel(value, 'registryTypes')
}

function formatQualifiedType(value?: string): string {
  return formatCodeLabel(value, 'qualifiedTypes')
}

function formatBondPurchaseType(value?: string): string {
  return formatCodeLabel(value, 'bondPurchaseTypes')
}

function formatPaymentStatus(value?: string): string {
  return formatCodeLabel(value, 'paymentStatuses')
}

function formatRegistryMethod(value?: string): string {
  return formatCodeLabel(value, 'registryMethods')
}

function formatSection(value: unknown): string {
  if (value === 'GAP') return '갑구'
  if (value === 'EUL') return '을구'
  return formatScalar(value)
}

function formatScalar(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'string') return value.trim() || 'null'
  return String(value)
}

function formatNumberLike(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'null'
  return String(value)
}

function formatAmount(value?: number | null): string {
  if (value === null || value === undefined) return 'null'
  return formatCurrency(value)
}

function formatDateValue(value?: string | null): string {
  if (!value) return 'null'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : formatDate(date, 'short')
}

function formatPhoneWithExtension(phone?: string, extension?: string): string {
  if (!phone && !extension) return 'null'
  if (!extension) return formatScalar(phone)
  return `전화번호 : ${formatScalar(phone)}\n내선번호 : ${formatScalar(extension)}`
}

function formatValueByKind(value: unknown, kind?: 'amount' | 'date' | 'number'): string {
  if (kind === 'amount') return formatAmount(value as number | null | undefined)
  if (kind === 'date') return formatDateValue(value as string | null | undefined)
  if (kind === 'number') return formatNumberLike(value as number | null | undefined)
  return formatScalar(value)
}

function formatLabeledObject(
  value: Record<string, unknown> | null | undefined,
  fields: Array<[string, string, ('amount' | 'date' | 'number')?]>
): string {
  if (!value) return 'null'

  return fields
    .map(([key, label, kind]) => `${label} : ${formatValueByKind(value[key], kind)}`)
    .join('\n')
}

function getNestedValue(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as Record<string, unknown>)[key]
  }, source)
}

function formatNestedObject(
  value: Record<string, unknown> | null | undefined,
  fields: Array<[string, string, ('amount' | 'date' | 'number')?]>
): string {
  if (!value) return 'null'

  return fields
    .map(
      ([path, label, kind]) => `${label} : ${formatValueByKind(getNestedValue(value, path), kind)}`
    )
    .join('\n')
}

function formatObjectList(
  list: Array<Record<string, unknown>> | undefined,
  fields: Array<[string, string]>
): string {
  if (!list || list.length === 0) return '[---]'

  return list
    .map((item, index) => {
      const lines = [`[${index}]`]
      fields.forEach(([key, label]) => {
        const value = key === 'section' ? formatSection(item[key]) : formatScalar(item[key])
        lines.push(`${label} : ${value}`)
      })
      return lines.join('\n')
    })
    .join('\n\n')
}

function formatProperties(list: UnifiedApplicationFormResponse['properties'] | undefined): string {
  if (!list || list.length === 0) return '[---]'

  return list
    .map((item, index) => {
      const descriptions = item.propertyDescription?.join(' / ') || 'null'
      return [
        `[${index}]`,
        `부동산 표시 : ${descriptions}`,
        `접수등기소 : ${formatScalar(item.registryOffice?.acceptanceOfficeName)}`,
        `관할등기소 : ${formatScalar(item.registryOffice?.jurisdictionOfficeName)}`
      ].join('\n')
    })
    .join('\n\n')
}

function formatCertificates(
  list: UnifiedApplicationFormResponse['certificates'] | undefined
): string {
  if (!list || list.length === 0) return '[---]'

  return list
    .map((item, index) => {
      const shares =
        item.shares
          ?.map((share, shareIndex) =>
            [
              `[${shareIndex}]`,
              `진행당사자 ID : ${formatScalar(share.progressPartyId)}`,
              `성명(명칭) : ${formatScalar(share.name)}`,
              `보유 지분 분자 : ${formatScalar(share.holdingShareNumerator)}`,
              `보유 지분 분모 : ${formatScalar(share.holdingShareDenominator)}`,
              `이전 지분 분자 : ${formatScalar(share.transferShareNumerator)}`,
              `이전 지분 분모 : ${formatScalar(share.transferShareDenominator)}`,
              `해당구 : ${formatSection(share.section)}`,
              `순위번호 : ${formatScalar(share.rankNumber)}`
            ].join('\n')
          )
          .join('\n\n') || 'null'
      const registryCertificate =
        item.registryCertificate
          ?.map((certificate, certIndex) =>
            [
              `[${certIndex}]`,
              `부동산 고유번호 : ${formatScalar(certificate.propertyUniqueNumber)}`,
              `소유자 명칭 : ${formatScalar(certificate.ownerName)}`,
              `일련번호 : ${formatScalar(certificate.certificateSerialNumber)}`,
              `비밀번호 : ${formatScalar(certificate.certificatePassword)}`
            ].join('\n')
          )
          .join('\n\n') || 'null'

      return [
        `[${index}]`,
        '등기권리증 지분 정보 :',
        shares,
        '',
        '등기필정보 목록 :',
        registryCertificate
      ].join('\n')
    })
    .join('\n\n')
}

async function fetchFormData() {
  if (!props.applicationId) {
    formData.value = null
    errorMessage.value = '신청서 ID가 없습니다.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await registryTypeAPI.unifiedForm({ applicationId: props.applicationId })
    formData.value = extractPrimaryPayload<UnifiedApplicationFormResponse>(response) || null
  } catch (error) {
    formData.value = null
    errorMessage.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.applicationId,
  () => {
    void fetchFormData()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.paper-preview {
  width: 100%;
}

.paper-scroll {
  height: 700px;
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #dfe4ea;
}

.paper-stage {
  width: 100%;
}

.paper-shell {
  width: 100%;
  margin-bottom: 12px;
}

.paper-shell:last-child {
  margin-bottom: 0;
}

.paper-sheet {
  width: 100%;
  aspect-ratio: 210 / 297;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #d1d5db;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
  padding: 14mm 12mm;
  overflow: hidden;
}

.paper-sheet,
.paper-sheet * {
  font-size: inherit;
  line-height: inherit;
  box-sizing: border-box;
}

.paper-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 8px;
  margin-bottom: 10px;
  border-bottom: 2px solid #111827;
}

.paper-kicker {
  margin: 0 0 4px;
  font-size: 9px !important;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.paper-title {
  margin: 0;
  font-size: 17px !important;
  font-weight: 700;
  color: #111827;
}

.paper-header-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  font-size: 10px !important;
  color: #4b5563;
}

.row-list {
  display: flex;
  flex-direction: column;
}

.row-item {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  border-bottom: 1px solid #e5e7eb;
}

.row-item:first-child {
  border-top: 1px solid #e5e7eb;
}

.row-label {
  padding: 6px 8px;
  background: #f9fafb;
  font-size: 14px !important;
  font-weight: 600;
  line-height: 1.2 !important;
  white-space: nowrap;
  color: #374151;
  border-right: 1px solid #e5e7eb;
}

.row-value {
  padding: 5px 8px;
  font-size: 14px !important;
  line-height: 1.3 !important;
  font-weight: 400;
  color: #111827;
  white-space: pre-wrap;
  word-break: break-word;
}

.row-line {
  margin: 0 !important;
  font-size: 14px !important;
  line-height: 1.3 !important;
}

.row-line.is-blank {
  min-height: 1.3em;
}

.value-key {
  font-weight: 700 !important;
  font-size: 14px !important;
  color: #111827;
}

.literal {
  color: #2563eb;
  font-weight: 500 !important;
  font-size: 14px !important;
}

.array-marker {
  color: #2563eb;
  font-weight: 600 !important;
}

.paper-state {
  margin: auto 0;
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
</style>
