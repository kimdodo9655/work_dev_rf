<template>
  <div class="fixed-form-pdf">
    <div class="right-pane">
      <section class="json-panel">
        <h3>더미 JSON 문서 생성</h3>
        <textarea v-model="dummyJsonText" rows="12" />
        <div class="json-actions">
          <button type="button" class="btn" :disabled="isGenerating" @click="applyDummyJson">
            더미 JSON 적용
          </button>
          <button
            type="button"
            class="btn primary"
            :disabled="isGenerating"
            @click="handleGenerate"
          >
            {{ isGenerating ? 'PDF 생성 중...' : '더미 JSON으로 PDF 생성' }}
          </button>
        </div>
      </section>

      <FixedFormPdfPreview
        :preview-url="previewUrl"
        :file-name="latestFileName"
        :base64-length="base64.length"
        :has-pdf="!!latestBlob"
        :status-type="status.type"
        :status-message="status.message"
        @download="downloadPdf"
        @attach="handleAttach"
      />

      <section class="sheet-wrap">
        <h3>고정 양식</h3>
        <div ref="captureRootEl" class="capture-root">
          <div class="sheet pdf-page-capture">
            <header class="sheet-header">
              <h1>{{ form.documentTitle }}</h1>
              <span>문서번호: {{ form.documentNo }}</span>
            </header>

            <table class="meta-table">
              <tbody>
                <tr>
                  <th>작성일</th>
                  <td>{{ form.issueDate }}</td>
                  <th>담당자</th>
                  <td>{{ form.managerName }}</td>
                </tr>
                <tr>
                  <th>고객명</th>
                  <td>{{ form.customerName }}</td>
                  <th>금액</th>
                  <td>{{ form.amount }}</td>
                </tr>
              </tbody>
            </table>

            <table class="content-table">
              <tbody>
                <tr>
                  <th>요약</th>
                  <td ref="summaryCellEl" class="multiline">
                    {{ hasAAnnex ? '별지처리' : mainSummaryText }}
                  </td>
                </tr>
                <tr>
                  <th>비고</th>
                  <td class="multiline">{{ notesPreview }}</td>
                </tr>
              </tbody>
            </table>

            <table class="items-table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>내용</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="hasBAnnex">
                  <td>별지처리</td>
                  <td>별지처리</td>
                  <td>별지처리</td>
                </tr>
                <tr v-for="(item, index) in visibleMainItems" :key="index">
                  <td>{{ item.category }}</td>
                  <td>{{ item.content }}</td>
                  <td>{{ item.note }}</td>
                </tr>
                <tr v-for="pad in paddedRows" :key="`pad-${pad}`">
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </table>

            <p class="annex-note" v-if="hasAnnex">
              ※ A셀 5줄 이상 또는 B테이블 4행 이상이면 별지가 생성됩니다.
            </p>
          </div>

          <div
            v-for="(page, pageIndex) in aAnnexPages"
            :key="`a-annex-${pageIndex}`"
            class="sheet pdf-page-capture"
          >
            <header class="sheet-header">
              <h1>A 별지</h1>
              <span>{{ pageIndex + 1 }} / {{ aAnnexPages.length }}</span>
            </header>
            <div class="annex-text-block">
              <div class="annex-text">{{ page }}</div>
            </div>
          </div>

          <div
            v-for="(rows, pageIndex) in itemAnnexPages"
            :key="`item-annex-${pageIndex}`"
            class="sheet pdf-page-capture"
          >
            <header class="sheet-header">
              <h1>B 별지</h1>
              <span>{{ pageIndex + 1 }} / {{ itemAnnexPages.length }}</span>
            </header>

            <table class="items-table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>내용</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, rowIndex) in rows" :key="`item-${pageIndex}-${rowIndex}`">
                  <td>{{ item.category }}</td>
                  <td>{{ item.content }}</td>
                  <td>{{ item.note }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

import type { FixedFormData } from '@/features/dev/composables/useFixedFormPdf'
import { useFixedFormPdf } from '@/features/dev/composables/useFixedFormPdf'

import FixedFormPdfPreview from './FixedFormPdfPreview.vue'

const captureRootEl = ref<HTMLElement | null>(null)
const attachInputEl = ref<HTMLInputElement | null>(null)
const summaryCellEl = ref<HTMLElement | null>(null)
const summaryCellWidthPx = ref(560)
let summaryCellObserver: ResizeObserver | null = null

const {
  form,
  status,
  previewUrl,
  latestBlob,
  latestFileName,
  base64,
  isGenerating,
  notesPreview,
  generatePdf,
  attachLatestToInput,
  downloadPdf,
  revokePreview
} = useFixedFormPdf({
  documentTitle: '고정 양식 테스트 문서',
  documentNo: 'DOC-2026-0001',
  issueDate: '2026-03-09',
  customerName: '홍길동',
  managerName: '담당자',
  amount: '₩ 1,000,000',
  summary: '고정 셀 텍스트가 길어지면 별지 페이지에 자동으로 이어서 출력됩니다.',
  notes: '비고 영역도 동일한 방식으로 별지 처리됩니다.',
  items: [
    { category: 'A', content: '기본 항목 1', note: '' },
    { category: 'B', content: '기본 항목 2', note: '' },
    { category: 'C', content: '기본 항목 3', note: '' }
  ]
})

const dummyJsonText = ref(`{
  "documentTitle": "고정 양식 테스트 문서",
  "documentNo": "DOC-2026-0001",
  "issueDate": "2026-03-09",
  "customerName": "홍길동",
  "managerName": "담당자",
  "amount": "₩ 1,000,000",
  "summary": "더미 JSON으로 채워진 요약 텍스트입니다. 길어지면 A 별지로 넘어갑니다.",
  "notes": "더미 JSON 비고",
  "items": [
    { "category": "A", "content": "항목 1", "note": "" },
    { "category": "B", "content": "항목 2", "note": "" },
    { "category": "C", "content": "항목 3", "note": "" }
  ]
}`)

const A_CELL_MAIN_LINES = 4
const A_CELL_TRIGGER_LINES = 5
const A_ANNEX_LINES_PER_PAGE = 42
const ANNEX_TEXT_WIDTH_PX = 640
const BASE_FONT_SIZE_PX = 12
const BASE_LINE_HEIGHT = 1.6
const B_TABLE_MAIN_ROWS = 3
const B_TABLE_TRIGGER_ROWS = 4
const ITEM_ANNEX_ROWS_PER_PAGE = 30

function makeTextMeasurer(widthPx: number) {
  const measurer = document.createElement('div')
  measurer.style.cssText = `
    position:absolute;visibility:hidden;left:-99999px;top:-99999px;
    width:${Math.max(1, widthPx)}px;padding:0;
    font-size:${BASE_FONT_SIZE_PX}px;line-height:${BASE_LINE_HEIGHT};
    white-space:pre-wrap;word-break:break-word;box-sizing:border-box;
  `
  document.body.appendChild(measurer)
  return measurer
}

function calculateTextPagesByMeasure(
  text: string,
  widthPx: number,
  maxLinesPerPage: number
): string[] {
  const source = text || ''
  if (!source.trim()) return []

  const measurer = makeTextMeasurer(widthPx)
  measurer.textContent = 'A'
  const singleLineHeight = Math.max(1, measurer.offsetHeight)

  const lineCount = (value: string) => {
    measurer.textContent = value || ' '
    return Math.max(1, Math.ceil(measurer.offsetHeight / singleLineHeight))
  }

  const pages: string[] = []
  const paragraphs = source.split('\n')
  let currentPageText = ''

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i] ?? ''

    if (paragraph === '') {
      const testText = `${currentPageText}\n`
      if (lineCount(testText) <= maxLinesPerPage) {
        currentPageText = testText
      } else {
        pages.push(currentPageText.trimEnd())
        currentPageText = '\n'
      }
      continue
    }

    const words = paragraph.split(' ')
    for (let j = 0; j < words.length; j++) {
      const word = words[j] ?? ''
      const separator =
        j === 0 && currentPageText && !currentPageText.endsWith('\n')
          ? ' '
          : j === 0 && currentPageText
            ? ''
            : j === 0
              ? ''
              : ' '

      const testText = currentPageText + separator + word
      if (lineCount(testText) > maxLinesPerPage) {
        if (currentPageText.trim()) pages.push(currentPageText.trimEnd())
        currentPageText = word
      } else {
        currentPageText = testText
      }
    }

    if (i < paragraphs.length - 1) currentPageText += '\n'
  }

  if (currentPageText.trim()) pages.push(currentPageText.trimEnd())

  document.body.removeChild(measurer)
  return pages
}

function chunkBy<T>(input: T[], size: number): T[][] {
  if (size <= 0) return [input]
  const chunks: T[][] = []
  for (let i = 0; i < input.length; i += size) {
    chunks.push(input.slice(i, i + size))
  }
  return chunks
}

const summaryPagesForMainCell = computed(() =>
  calculateTextPagesByMeasure(form.summary, summaryCellWidthPx.value, A_CELL_MAIN_LINES)
)
const hasAAnnex = computed(
  () =>
    calculateTextPagesByMeasure(form.summary, summaryCellWidthPx.value, A_CELL_TRIGGER_LINES - 1)
      .length > 1
)
const mainSummaryText = computed(() => summaryPagesForMainCell.value[0] ?? '')
const aAnnexPages = computed(() =>
  hasAAnnex.value
    ? calculateTextPagesByMeasure(form.summary, ANNEX_TEXT_WIDTH_PX, A_ANNEX_LINES_PER_PAGE)
    : []
)

const hasBAnnex = computed(() => form.items.length >= B_TABLE_TRIGGER_ROWS)
const visibleMainItems = computed(() =>
  hasBAnnex.value ? [] : form.items.slice(0, B_TABLE_MAIN_ROWS)
)
const paddedRows = computed(() => {
  if (hasBAnnex.value) return Math.max(0, B_TABLE_MAIN_ROWS - 1)
  return Math.max(0, B_TABLE_MAIN_ROWS - visibleMainItems.value.length)
})
const itemAnnexPages = computed(() =>
  hasBAnnex.value ? chunkBy(form.items, ITEM_ANNEX_ROWS_PER_PAGE) : []
)
const hasAnnex = computed(() => hasAAnnex.value || hasBAnnex.value)

function applyDummyJson(): boolean {
  try {
    const parsed = JSON.parse(dummyJsonText.value) as Partial<FixedFormData>
    form.documentTitle = String(parsed.documentTitle ?? '')
    form.documentNo = String(parsed.documentNo ?? '')
    form.issueDate = String(parsed.issueDate ?? '')
    form.customerName = String(parsed.customerName ?? '')
    form.managerName = String(parsed.managerName ?? '')
    form.amount = String(parsed.amount ?? '')
    form.summary = String(parsed.summary ?? '')
    form.notes = String(parsed.notes ?? '')
    form.items = Array.isArray(parsed.items)
      ? parsed.items.map((item) => ({
          category: String(item.category ?? ''),
          content: String(item.content ?? ''),
          note: String(item.note ?? '')
        }))
      : []

    status.type = 'ok'
    status.message = '더미 JSON을 양식에 반영했습니다.'
    return true
  } catch {
    status.type = 'err'
    status.message = '더미 JSON 파싱에 실패했습니다.'
    return false
  }
}

async function handleGenerate() {
  if (!applyDummyJson()) return
  await nextTick()

  if (!captureRootEl.value) {
    status.type = 'err'
    status.message = '양식 렌더 영역을 찾을 수 없습니다.'
    return
  }

  const sourceEls = Array.from(
    captureRootEl.value.querySelectorAll<HTMLElement>('.pdf-page-capture')
  )

  if (sourceEls.length === 0) {
    status.type = 'err'
    status.message = 'PDF 캡처 페이지를 찾을 수 없습니다.'
    return
  }

  await generatePdf({ sourceEls, fileInputEl: attachInputEl.value })
}

function handleAttach(inputEl: HTMLInputElement | null) {
  attachInputEl.value = inputEl
  if (!inputEl) return

  if (!attachLatestToInput(inputEl)) {
    status.type = 'err'
    status.message = '먼저 PDF를 생성하세요.'
  }
}

onBeforeUnmount(() => {
  if (summaryCellObserver) summaryCellObserver.disconnect()
  revokePreview()
})

onMounted(() => {
  const updateSummaryCellWidth = () => {
    summaryCellWidthPx.value = Math.max(280, Math.floor(summaryCellEl.value?.clientWidth || 560))
  }

  updateSummaryCellWidth()

  if (typeof ResizeObserver === 'undefined' || !summaryCellEl.value) return
  summaryCellObserver = new ResizeObserver(() => updateSummaryCellWidth())
  summaryCellObserver.observe(summaryCellEl.value)
})
</script>

<style scoped>
.fixed-form-pdf {
  display: block;
  margin-top: 24px;
}

.right-pane {
  display: grid;
  gap: 12px;
}

.json-panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}

.json-panel textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.json-actions {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.btn {
  border: 1px solid #d1d5db;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 10px;
  font-weight: 700;
  cursor: pointer;
}

.btn.primary {
  background: #1d4ed8;
  color: #fff;
  border-color: #1d4ed8;
}

.sheet-wrap {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}

.capture-root {
  display: grid;
  gap: 10px;
}

.sheet {
  width: 210mm;
  max-width: 100%;
  min-height: 297mm;
  margin: 0 auto;
  border: 1px solid #d1d5db;
  padding: 14mm;
  box-sizing: border-box;
  background: #fff;
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.sheet-header h1 {
  font-size: 20px;
  margin: 0;
}

.sheet-header span {
  font-size: 12px;
}

.meta-table,
.content-table,
.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.meta-table th,
.meta-table td,
.content-table th,
.content-table td,
.items-table th,
.items-table td {
  border: 1px solid #d1d5db;
  padding: 8px;
  font-size: 12px;
}

.meta-table th,
.content-table th,
.items-table th {
  background: #f8fafc;
  width: 88px;
}

.multiline {
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 48px;
}

.annex-note {
  font-size: 12px;
  color: #7c2d12;
  margin: 4px 0 0;
}

.annex-text-block {
  border: 1px solid #d1d5db;
  min-height: 230mm;
  padding: 10px;
}

.annex-line {
  margin: 0;
  line-height: 1.7;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.annex-text {
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 1200px) {
  .fixed-form-pdf {
    display: block;
  }
}
</style>
