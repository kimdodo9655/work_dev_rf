<!-- 문서 경로: `@/src/features/dev/pages/PdfTestPanel.vue`
문서 제목: 기능 페이지/컴포넌트: pdf-test-panel -->

<template>
  <div class="pdf-panel">
    <div class="tabs">
      <button class="tab" :class="{ active: mode === 'capture' }" @click="mode = 'capture'">
        UI 캡처 → PDF
      </button>
      <button class="tab" :class="{ active: mode === 'text' }" @click="mode = 'text'">
        텍스트 페이징
      </button>
      <button class="tab" :class="{ active: mode === 'mixed' }" @click="mode = 'mixed'">
        텍스트+테이블 페이징
      </button>
    </div>

    <section v-if="mode === 'capture'" class="mode-wrap">
      <div style="width: 100%; height: 700px">
        <PdfViewer
          :src="previewUrl"
          app-title="BankClear Web Viewer"
          address-path="/viewer/pdf?id=123"
          download-name="statement.pdf"
        />
      </div>

      <div class="pdf-maker">
        <section class="panel">
          <h3 class="title">PDF 생성 & 첨부 업로드</h3>

          <div class="actions">
            <button class="btn primary" @click="makePdf">A4 PDF 생성</button>
            <button class="btn" @click="putIntoInput" :disabled="!latestBlob">
              파일 인풋에 담기
            </button>
            <button class="btn dark" @click="downloadPdf" :disabled="!latestBlob">
              PDF 다운로드
            </button>
            <button class="btn warning" @click="uploadToRegisterApi" :disabled="!hasSelectedFile">
              첨부 파일 업로드
            </button>
          </div>

          <div class="field">
            <label class="label">파일 인풋 (여기에 담긴 파일이 업로드됩니다)</label>
            <input ref="fileInputEl" type="file" accept="application/pdf" @change="onFileChange" />
          </div>

          <div class="field">
            <label class="label">Base64 (선택)</label>
            <textarea v-model="base64" placeholder="PDF 생성 후 Base64가 표시됩니다." />
            <p class="hint">미리보기는 Blob URL을 사용합니다.</p>
          </div>

          <div v-if="status.msg" class="status" :class="status.type">
            {{ status.msg }}
          </div>

          <details class="debug">
            <summary>디버그</summary>
            <div class="debugRow">
              <div><b>선택 파일:</b> {{ selectedFile?.name || '-' }}</div>
              <div>
                <b>크기:</b> {{ selectedFile ? selectedFile.size.toLocaleString() : '-' }} bytes
              </div>
            </div>
            <div class="debugRow">
              <div><b>Preview URL:</b> {{ previewUrl ? '생성됨' : '없음' }}</div>
              <div><b>Base64 길이:</b> {{ base64 ? base64.length.toLocaleString() : 0 }}</div>
            </div>
          </details>
        </section>

        <section class="panel">
          <h3 class="title">PDF 미리보기</h3>
          <div class="preview">
            <iframe :src="previewUrl" title="pdf-preview" />
          </div>

          <h3 class="title mt">A4 캡처 대상(고정)</h3>
          <div class="stage">
            <div ref="paperEl" class="paper">
              <h2 class="paperTitle">정산 내역서</h2>
              <p class="meta">문서번호: DOC-2026-0206 · 작성일: 2026-02-06 · 작성자: 홍길동</p>

              <table class="report">
                <thead>
                  <tr>
                    <th class="col1">항목</th>
                    <th>내용</th>
                    <th class="col3">비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>프로젝트</td>
                    <td>Vue3 SFC에서 HTML → PDF 생성 후 업로드</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>설명</td>
                    <td>
                      A4 크기로 고정된 테이블을 화면에 렌더링한 그대로 캡처하여 PDF로 저장합니다.
                      생성된 PDF를 파일 인풋에 담아 register-api로 multipart 업로드합니다.
                    </td>
                    <td>캡처</td>
                  </tr>
                  <tr>
                    <td>금액</td>
                    <td>₩ 1,234,567</td>
                    <td>VAT 별도</td>
                  </tr>
                  <tr>
                    <td>메모</td>
                    <td>
                      업로드 시 Authorization(Bearer), X-Bank-Code, Accept 헤더가 붙습니다.
                      Content-Type은 브라우저가 boundary 포함해 자동 설정하므로 직접 넣지 않습니다.
                    </td>
                    <td>헤더</td>
                  </tr>
                </tbody>
              </table>

              <div class="footer">본 문서는 자동 생성되었습니다.</div>
            </div>
          </div>
        </section>
      </div>
    </section>

    <section v-else-if="mode === 'text'" class="mode-wrap">
      <div class="pager-layout">
        <aside class="controls">
          <div class="control-group">
            <label>문서 제목</label>
            <input v-model="textState.title" type="text" />
          </div>
          <div class="control-group">
            <label>폰트 크기: {{ textState.fontSize }}px</label>
            <input v-model.number="textState.fontSize" type="range" min="8" max="24" step="1" />
          </div>
          <div class="control-group">
            <label>줄 간격: {{ textState.lineHeight }}</label>
            <input
              v-model.number="textState.lineHeight"
              type="range"
              min="1"
              max="2.5"
              step="0.1"
            />
          </div>
          <div class="control-group">
            <label>텍스트</label>
            <textarea v-model="textState.text" rows="12" />
          </div>
          <button class="btn primary" @click="calculateTextPages">다시 계산</button>
          <div class="info">총 페이지: {{ textPages.length }}</div>
        </aside>

        <div class="pages-wrapper">
          <div v-for="(page, index) in textPages" :key="`text-${index}`" class="paper-page">
            <div v-if="index === 0" class="page-header">
              <h1 class="doc-title" :style="textStyle">{{ textState.title }}</h1>
            </div>
            <div class="page-number">Page {{ index + 1 }} / {{ textPages.length }}</div>
            <div class="content" :style="textStyle">{{ page.text }}</div>
          </div>
          <div v-if="textPages.length === 0" class="empty-state">
            텍스트를 입력하면 페이지가 생성됩니다.
          </div>
        </div>
      </div>
    </section>

    <section v-else class="mode-wrap">
      <div class="pager-layout">
        <aside class="controls">
          <div class="control-group">
            <label>문서 제목</label>
            <input v-model="mixedState.title" type="text" />
          </div>
          <div class="control-group">
            <label>폰트 크기: {{ mixedState.fontSize }}px</label>
            <input v-model.number="mixedState.fontSize" type="range" min="8" max="24" step="1" />
          </div>
          <div class="control-group">
            <label>줄 간격: {{ mixedState.lineHeight }}</label>
            <input
              v-model.number="mixedState.lineHeight"
              type="range"
              min="1"
              max="2.5"
              step="0.1"
            />
          </div>
          <div class="control-group">
            <label>텍스트</label>
            <textarea v-model="mixedState.text" rows="8" />
          </div>
          <div class="control-group">
            <label>테이블 행</label>
            <button class="btn" @click="addMixedTableRow">행 추가</button>
          </div>
          <button class="btn primary" @click="calculateMixedPages">다시 계산</button>
          <div class="info">총 페이지: {{ mixedPages.length }}</div>
        </aside>

        <div class="pages-wrapper">
          <div v-for="(page, index) in mixedPages" :key="`mix-${index}`" class="paper-page">
            <div v-if="index === 0" class="page-header">
              <h1 class="doc-title" :style="mixedTextStyle">{{ mixedState.title }}</h1>
            </div>
            <div class="page-number">Page {{ index + 1 }} / {{ mixedPages.length }}</div>
            <div class="content" :style="mixedTextStyle">
              <template v-for="(item, idx) in page.content" :key="idx">
                <div v-if="item.type === 'text'" class="text-content">{{ item.data }}</div>
                <table v-else class="table-content">
                  <thead>
                    <tr>
                      <th v-for="(header, hIdx) in mixedState.table.headers" :key="hIdx">
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rIdx) in getTableRows(item.data)" :key="rIdx">
                      <template v-for="(cell, cIdx) in row" :key="cIdx">
                        <td v-if="!isSkipCell(cell)" :rowspan="getRowspan(cell)">
                          {{ getCellContent(cell) }}
                        </td>
                      </template>
                    </tr>
                  </tbody>
                </table>
              </template>
            </div>
          </div>
          <div v-if="mixedPages.length === 0" class="empty-state">
            텍스트/테이블을 입력하면 페이지가 생성됩니다.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'

import { logger } from '@/utils/logger'

const PdfViewer = defineAsyncComponent(() => import('@/features/doc-templates/PdfViewer.vue'))

type Mode = 'capture' | 'text' | 'mixed'
const mode = ref<Mode>('capture')

type StatusType = 'info' | 'ok' | 'err'

interface TextPage {
  text: string
  lines: number
  maxLines: number
}

interface TableCell {
  content?: string
  rowspan?: number
  skip?: boolean
}

interface TableData {
  headers: string[]
  rows: (string | TableCell)[][]
}

interface MixedPageContent {
  type: 'text' | 'table'
  data: string | TableData
}

interface MixedPage {
  content: MixedPageContent[]
  lines: number
  maxLines: number
}

const A4_WIDTH = 210
const A4_HEIGHT = 297
const PADDING = 14
const CONTENT_PADDING_PX = 20
const TITLE_PADDING_BOTTOM_MM = 5
const mmToPx = (mm: number) => mm * 3.7795

// capture mode
const status = reactive<{ type: StatusType; msg: string }>({ type: 'info', msg: '' })
const paperEl = ref<HTMLElement | null>(null)
const fileInputEl = ref<HTMLInputElement | null>(null)
const latestBlob = ref<Blob | null>(null)
const latestName = ref('')
const previewUrl = ref('')
const base64 = ref('')
const selectedFile = ref<File | null>(null)
const hasSelectedFile = computed(() => !!selectedFile.value)

const REGISTER_API =
  'http://register-api.dev.com/api/registry/progress/RM2026020603242/documents/temp?registryType=OT&documentType=POA&applicationId=1'
const ACCESS_TOKEN = '...생략...'
const X_BANK_CODE = 'bankclear'

// text mode
const textState = reactive({
  title: '문서 제목',
  fontSize: 12,
  lineHeight: 1.6,
  text: `여기에 긴 텍스트를 입력하세요.\n여러 줄의 텍스트가 들어가면\n자동으로 페이지가 나뉩니다.`
})
const textPages = ref<TextPage[]>([])
const textStyle = computed(() => ({
  fontSize: `${textState.fontSize}px`,
  lineHeight: String(textState.lineHeight)
}))

// mixed mode
const mixedState = reactive({
  title: '문서 제목',
  fontSize: 12,
  lineHeight: 1.6,
  text: `여기에 긴 텍스트를 입력하세요.\n테이블도 자동으로 페이지가 나뉩니다.`,
  table: {
    headers: ['카테고리', 'data 01', 'data 02'],
    rows: [
      [{ content: 'data', rowspan: 3 }, '123', '456'],
      [{ skip: true }, '123', '456'],
      [{ skip: true }, '123', '456']
    ] as (string | TableCell)[][]
  }
})
const mixedPages = ref<MixedPage[]>([])
const mixedTextStyle = computed(() => ({
  fontSize: `${mixedState.fontSize}px`,
  lineHeight: String(mixedState.lineHeight)
}))

function setStatus(type: StatusType, msg: string) {
  status.type = type
  status.msg = msg
}

function clearStatus() {
  status.msg = ''
}

function revokePreviewUrl() {
  if (!previewUrl.value) return
  URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('FileReader 결과 오류'))
        return
      }
      resolve(result.split(',')[1] ?? '')
    }
    reader.onerror = () => reject(new Error('FileReader 오류'))
    reader.readAsDataURL(blob)
  })
}

let pdfDepsPromise: Promise<{ html2canvas: any; jsPDF: any }> | null = null

function loadPdfDeps() {
  if (pdfDepsPromise) return pdfDepsPromise
  pdfDepsPromise = Promise.all([import('html2canvas'), import('jspdf')]).then(([h2c, jsp]) => ({
    html2canvas: h2c.default,
    jsPDF: jsp.jsPDF
  }))
  return pdfDepsPromise
}

async function makePdf() {
  try {
    clearStatus()
    setStatus('info', 'A4 캡처 및 PDF 생성 중...')

    if (!paperEl.value) throw new Error('캡처 대상 엘리먼트를 찾지 못했습니다.')

    const { html2canvas, jsPDF } = await loadPdfDeps()
    const canvas = await html2canvas(paperEl.value, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const imgW = pageW
    const imgH = (canvas.height * imgW) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, imgW, Math.min(imgH, pageH), undefined, 'FAST')

    const blob = pdf.output('blob') as Blob
    latestBlob.value = blob
    latestName.value = `a4_${Date.now()}.pdf`

    revokePreviewUrl()
    previewUrl.value = URL.createObjectURL(blob)
    base64.value = await blobToBase64(blob)

    putIntoInput()
    setStatus('ok', '완료: PDF 생성 + 미리보기 + Base64 변환 + 파일 인풋 담기')
  } catch (error) {
    setStatus('err', error instanceof Error ? error.message : '알 수 없는 오류')
  }
}

function putIntoInput() {
  try {
    if (!latestBlob.value) {
      setStatus('err', '먼저 PDF를 생성하세요.')
      return
    }
    if (!fileInputEl.value) {
      setStatus('err', '파일 인풋을 찾지 못했습니다.')
      return
    }

    const file = new File([latestBlob.value], latestName.value || `a4_${Date.now()}.pdf`, {
      type: 'application/pdf'
    })

    const dt = new DataTransfer()
    dt.items.add(file)
    fileInputEl.value.files = dt.files
    selectedFile.value = file

    setStatus('ok', '파일 인풋에 PDF를 담았습니다.')
  } catch (error) {
    setStatus('err', error instanceof Error ? error.message : '알 수 없는 오류')
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] ?? null
}

function downloadPdf() {
  try {
    if (!latestBlob.value) {
      setStatus('err', '먼저 PDF를 생성하세요.')
      return
    }
    const url = URL.createObjectURL(latestBlob.value)
    const a = document.createElement('a')
    a.href = url
    a.download = latestName.value || `a4_${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (error) {
    setStatus('err', error instanceof Error ? error.message : '알 수 없는 오류')
  }
}

async function uploadToRegisterApi() {
  try {
    clearStatus()
    if (!selectedFile.value) {
      setStatus('err', '업로드할 파일이 없습니다. 먼저 파일을 선택/생성하세요.')
      return
    }

    setStatus('info', '첨부 파일 업로드 중...')

    const form = new FormData()
    form.append('file', selectedFile.value)

    const res = await fetch(REGISTER_API, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'X-Bank-Code': X_BANK_CODE
      },
      body: form,
      mode: 'cors'
    })

    const ct = res.headers.get('content-type') || ''
    const body = ct.includes('application/json')
      ? await res.json().catch(() => null)
      : await res.text().catch(() => '')

    if (!res.ok) {
      const msg =
        (typeof body === 'object' && body && (body.message || body.error)) ||
        (typeof body === 'string' && body) ||
        `업로드 실패: ${res.status}`
      throw new Error(msg)
    }

    logger.info('[PDF_TEST_PANEL] Upload succeeded', { body })
    setStatus('ok', '업로드 성공! (응답은 콘솔 확인)')
  } catch (error) {
    setStatus('err', error instanceof Error ? error.message : '알 수 없는 오류')
  }
}

async function calculateTextPages() {
  if (!textState.text) {
    textPages.value = []
    return
  }

  await nextTick()

  const titleMeasurer = document.createElement('div')
  titleMeasurer.style.cssText = `
    position:absolute;visibility:hidden;font-size:${textState.fontSize}px;
    line-height:${textState.lineHeight};font-weight:700;margin:0;
  `
  titleMeasurer.textContent = textState.title
  document.body.appendChild(titleMeasurer)
  const titleHeightPx = titleMeasurer.offsetHeight
  document.body.removeChild(titleMeasurer)

  const contentWidthPx = mmToPx(A4_WIDTH - PADDING * 2) - CONTENT_PADDING_PX * 2

  const measurer = document.createElement('div')
  measurer.style.cssText = `
    position:absolute;visibility:hidden;width:${contentWidthPx}px;
    padding:0;font-size:${textState.fontSize}px;line-height:${textState.lineHeight};
    white-space:pre-wrap;word-break:break-word;box-sizing:border-box;
  `
  document.body.appendChild(measurer)

  measurer.textContent = 'A'
  const singleLineHeight = measurer.offsetHeight

  const firstPageAvailableHeightPx =
    mmToPx(A4_HEIGHT - PADDING * 2) - titleHeightPx - mmToPx(TITLE_PADDING_BOTTOM_MM)
  const firstPageTextHeightPx = firstPageAvailableHeightPx - CONTENT_PADDING_PX * 2 - 2
  const firstPageMaxLines = Math.floor(firstPageTextHeightPx / singleLineHeight)

  const otherPageAvailableHeightPx = mmToPx(A4_HEIGHT - PADDING * 2)
  const otherPageTextHeightPx = otherPageAvailableHeightPx - CONTENT_PADDING_PX * 2 - 2
  const otherPageMaxLines = Math.floor(otherPageTextHeightPx / singleLineHeight)

  const pages: TextPage[] = []
  const paragraphs = textState.text.split('\n')
  let currentPageText = ''
  let isFirstPage = true

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i] ?? ''

    if (paragraph === '') {
      const testText = currentPageText + '\n'
      measurer.textContent = testText
      const testLines = Math.ceil(measurer.offsetHeight / singleLineHeight)
      const currentMaxLines = isFirstPage ? firstPageMaxLines : otherPageMaxLines

      if (testLines <= currentMaxLines) {
        currentPageText = testText
      } else {
        measurer.textContent = currentPageText
        pages.push({
          text: currentPageText.trim(),
          lines: Math.ceil(measurer.offsetHeight / singleLineHeight),
          maxLines: currentMaxLines
        })
        currentPageText = '\n'
        isFirstPage = false
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
      measurer.textContent = testText

      const testLines = Math.ceil(measurer.offsetHeight / singleLineHeight)
      const currentMaxLines = isFirstPage ? firstPageMaxLines : otherPageMaxLines

      if (testLines > currentMaxLines) {
        if (currentPageText.trim()) {
          measurer.textContent = currentPageText
          pages.push({
            text: currentPageText.trim(),
            lines: Math.ceil(measurer.offsetHeight / singleLineHeight),
            maxLines: currentMaxLines
          })
        }
        currentPageText = word
        isFirstPage = false
      } else {
        currentPageText = testText
      }
    }

    if (i < paragraphs.length - 1) {
      currentPageText += '\n'
    }
  }

  if (currentPageText.trim()) {
    measurer.textContent = currentPageText
    const currentMaxLines = isFirstPage ? firstPageMaxLines : otherPageMaxLines
    pages.push({
      text: currentPageText.trim(),
      lines: Math.ceil(measurer.offsetHeight / singleLineHeight),
      maxLines: currentMaxLines
    })
  }

  document.body.removeChild(measurer)
  textPages.value = pages
}

function getCellContent(cell: string | TableCell): string {
  return typeof cell === 'string' ? cell : cell.content || ''
}

function isSkipCell(cell: string | TableCell): boolean {
  return typeof cell === 'object' && cell.skip === true
}

function getRowspan(cell: string | TableCell): number {
  return typeof cell === 'object' && cell.rowspan ? cell.rowspan : 1
}

function addMixedTableRow() {
  const rowNum = mixedState.table.rows.length + 1
  mixedState.table.rows.push([{ skip: true }, `${rowNum * 123}`, `${rowNum * 456}`])

  const firstCell = mixedState.table.rows[0]?.[0]
  if (firstCell && typeof firstCell === 'object' && firstCell.rowspan) {
    firstCell.rowspan = mixedState.table.rows.length
  }
}

function getTableRows(data: string | TableData): (string | TableCell)[][] {
  return typeof data === 'string' ? [] : data.rows
}

function measureSingleRow(
  row: (string | TableCell)[],
  measurer: HTMLElement,
  fontSize: number,
  lineHeight: number
): number {
  const table = document.createElement('table')
  table.style.cssText = `width:100%;border-collapse:collapse;font-size:${fontSize}px;line-height:${lineHeight};`

  const tbody = document.createElement('tbody')
  const tr = document.createElement('tr')

  row.forEach((cell) => {
    const td = document.createElement('td')
    td.textContent = getCellContent(cell)
    td.style.cssText = 'border:1px solid #e5e7eb;padding:8px;word-break:break-word;'
    tr.appendChild(td)
  })

  tbody.appendChild(tr)
  table.appendChild(tbody)
  measurer.appendChild(table)
  const height = table.offsetHeight
  measurer.removeChild(table)
  return height
}

function measureTableHeader(
  headers: string[],
  measurer: HTMLElement,
  fontSize: number,
  lineHeight: number
): number {
  const table = document.createElement('table')
  table.style.cssText = `width:100%;border-collapse:collapse;font-size:${fontSize}px;line-height:${lineHeight};`

  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')

  headers.forEach((h) => {
    const th = document.createElement('th')
    th.textContent = h
    th.style.cssText =
      'border:1px solid #e5e7eb;padding:8px;text-align:left;background:#f9fafb;font-weight:600;'
    headerRow.appendChild(th)
  })

  thead.appendChild(headerRow)
  table.appendChild(thead)
  measurer.appendChild(table)
  const height = table.offsetHeight
  measurer.removeChild(table)
  return height
}

async function calculateMixedPages() {
  if (!mixedState.text && mixedState.table.rows.length === 0) {
    mixedPages.value = []
    return
  }

  await nextTick()

  const titleMeasurer = document.createElement('div')
  titleMeasurer.style.cssText = `
    position:absolute;visibility:hidden;font-size:${mixedState.fontSize}px;
    line-height:${mixedState.lineHeight};font-weight:700;margin:0;
  `
  titleMeasurer.textContent = mixedState.title
  document.body.appendChild(titleMeasurer)
  const titleHeightPx = titleMeasurer.offsetHeight
  document.body.removeChild(titleMeasurer)

  const contentWidthPx = mmToPx(A4_WIDTH - PADDING * 2) - CONTENT_PADDING_PX * 2

  const textMeasurer = document.createElement('div')
  textMeasurer.style.cssText = `
    position:absolute;visibility:hidden;width:${contentWidthPx}px;padding:0;
    font-size:${mixedState.fontSize}px;line-height:${mixedState.lineHeight};
    white-space:pre-wrap;word-break:break-word;box-sizing:border-box;
  `
  document.body.appendChild(textMeasurer)

  const tableMeasurer = document.createElement('div')
  tableMeasurer.style.cssText = `position:absolute;visibility:hidden;width:${contentWidthPx}px;box-sizing:border-box;`
  document.body.appendChild(tableMeasurer)

  textMeasurer.textContent = 'A'
  const singleLineHeight = textMeasurer.offsetHeight

  const headerHeight = measureTableHeader(
    mixedState.table.headers,
    tableMeasurer,
    mixedState.fontSize,
    mixedState.lineHeight
  )

  const firstPageAvailableHeightPx =
    mmToPx(A4_HEIGHT - PADDING * 2) - titleHeightPx - mmToPx(TITLE_PADDING_BOTTOM_MM)
  const firstPageTextHeightPx = firstPageAvailableHeightPx - CONTENT_PADDING_PX * 2 - 2
  const firstPageMaxLines = Math.floor(firstPageTextHeightPx / singleLineHeight)

  const otherPageAvailableHeightPx = mmToPx(A4_HEIGHT - PADDING * 2)
  const otherPageTextHeightPx = otherPageAvailableHeightPx - CONTENT_PADDING_PX * 2 - 2
  const otherPageMaxLines = Math.floor(otherPageTextHeightPx / singleLineHeight)

  const pagesList: MixedPage[] = []
  let currentPageContent: MixedPageContent[] = []
  let currentPageHeightPx = 0
  let isFirstPage = true

  if (mixedState.text) {
    const paragraphs = mixedState.text.split('\n')
    let currentText = ''

    for (const paragraph of paragraphs) {
      const words = paragraph.split(' ')

      for (const word of words) {
        const testText =
          currentText + (currentText && !currentText.endsWith('\n') ? ' ' : '') + word
        textMeasurer.textContent = testText

        const currentMaxHeightPx = isFirstPage ? firstPageTextHeightPx : otherPageTextHeightPx

        if (
          textMeasurer.offsetHeight + currentPageHeightPx > currentMaxHeightPx &&
          currentText.trim()
        ) {
          currentPageContent.push({ type: 'text', data: currentText.trim() })
          const currentMaxLines = isFirstPage ? firstPageMaxLines : otherPageMaxLines
          pagesList.push({
            content: currentPageContent,
            lines: Math.ceil(currentPageHeightPx / singleLineHeight),
            maxLines: currentMaxLines
          })

          currentPageContent = []
          currentPageHeightPx = 0
          currentText = word
          isFirstPage = false
        } else {
          currentText = testText
        }
      }
      currentText += '\n'
    }

    if (currentText.trim()) {
      textMeasurer.textContent = currentText
      const textHeight = textMeasurer.offsetHeight
      currentPageContent.push({ type: 'text', data: currentText.trim() })
      currentPageHeightPx += textHeight
    }
  }

  if (mixedState.table.rows.length > 0) {
    let currentTableRows: (string | TableCell)[][] = []
    let isNewTable = true
    let currentGroupFirstCell = ''

    for (const row of mixedState.table.rows) {
      const firstCell = row[0] ?? ''
      if (!isSkipCell(firstCell)) {
        currentGroupFirstCell = getCellContent(firstCell)
      }

      const measureRow = row.map((cell, idx) => {
        if (idx === 0 && isSkipCell(cell)) return currentGroupFirstCell
        return cell
      })

      const rowHeight = measureSingleRow(
        measureRow,
        tableMeasurer,
        mixedState.fontSize,
        mixedState.lineHeight
      )
      const additionalHeight = isNewTable ? headerHeight + rowHeight : rowHeight
      const currentMaxHeightPx = isFirstPage ? firstPageTextHeightPx : otherPageTextHeightPx

      if (
        currentPageHeightPx + additionalHeight > currentMaxHeightPx &&
        currentTableRows.length > 0
      ) {
        const finalRows = [...currentTableRows]
        const firstRow = finalRows[0]
        if (firstRow) {
          finalRows[0] = [...firstRow]
          finalRows[0][0] = { content: currentGroupFirstCell, rowspan: finalRows.length }
        }

        currentPageContent.push({
          type: 'table',
          data: { headers: mixedState.table.headers, rows: finalRows }
        })

        const currentMaxLines = isFirstPage ? firstPageMaxLines : otherPageMaxLines
        pagesList.push({
          content: currentPageContent,
          lines: Math.ceil(currentPageHeightPx / singleLineHeight),
          maxLines: currentMaxLines
        })

        currentPageContent = []

        const newPageRow = row.map((cell, idx) => {
          if (idx === 0 && isSkipCell(cell)) return currentGroupFirstCell
          return cell
        })

        currentTableRows = [newPageRow]
        currentPageHeightPx = headerHeight + rowHeight
        isFirstPage = false
        isNewTable = true
      } else {
        currentTableRows.push(row)
        currentPageHeightPx += additionalHeight
        isNewTable = false
      }
    }

    if (currentTableRows.length > 0) {
      const finalRows = [...currentTableRows]
      const firstRow = finalRows[0]
      if (firstRow) {
        finalRows[0] = [...firstRow]

        const firstCell = finalRows[0][0] ?? ''
        if (isSkipCell(firstCell)) {
          finalRows[0][0] = { content: currentGroupFirstCell, rowspan: finalRows.length }
        } else {
          finalRows[0][0] = {
            content: getCellContent(firstCell),
            rowspan: finalRows.length
          }
        }
      }

      currentPageContent.push({
        type: 'table',
        data: { headers: mixedState.table.headers, rows: finalRows }
      })
    }
  }

  if (currentPageContent.length > 0) {
    const currentMaxLines = isFirstPage ? firstPageMaxLines : otherPageMaxLines
    pagesList.push({
      content: currentPageContent,
      lines: Math.ceil(currentPageHeightPx / singleLineHeight),
      maxLines: currentMaxLines
    })
  }

  document.body.removeChild(textMeasurer)
  document.body.removeChild(tableMeasurer)
  mixedPages.value = pagesList
}

watch(
  [
    () => textState.text,
    () => textState.fontSize,
    () => textState.lineHeight,
    () => textState.title
  ],
  () => {
    if (mode.value === 'text') void calculateTextPages()
  }
)

watch(
  [
    () => mixedState.text,
    () => mixedState.fontSize,
    () => mixedState.lineHeight,
    () => mixedState.title,
    () => mixedState.table.rows
  ],
  () => {
    if (mode.value === 'mixed') void calculateMixedPages()
  },
  { deep: true }
)

watch(mode, async (nextMode) => {
  if (nextMode === 'text') await calculateTextPages()
  if (nextMode === 'mixed') await calculateMixedPages()
})

onMounted(async () => {
  await calculateTextPages()
  await calculateMixedPages()
})

onBeforeUnmount(() => {
  revokePreviewUrl()
})
</script>

<style lang="scss" scoped>
.pdf-panel {
  padding: 16px;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tab {
  border: 1px solid #d1d5db;
  background: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;

  &.active {
    background: #111827;
    color: #fff;
    border-color: #111827;
  }
}

.mode-wrap {
  margin-top: 8px;
}

.pdf-maker {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 16px;
}

.panel,
.controls {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 800;
  color: #111827;

  &.mt {
    margin-top: 16px;
  }
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.btn {
  padding: 10px 14px;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;
  font-size: 13px;
  background: #e5e7eb;
  color: #111827;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &.primary {
    background: #2563eb;
    color: #fff;
  }

  &.dark {
    background: #111827;
    color: #fff;
  }

  &.warning {
    background: #f59e0b;
    color: #111827;
  }
}

.field {
  margin-top: 12px;
}

.label {
  display: block;
  font-size: 12px;
  color: #374151;
  margin-bottom: 6px;
}

textarea,
input[type='text'] {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fafafa;
  font-size: 12px;
  line-height: 1.4;
  box-sizing: border-box;
}

textarea {
  min-height: 120px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
}

.hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.status {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;

  &.info {
    background: #eff6ff;
    color: #1e40af;
  }

  &.ok {
    background: #ecfdf5;
    color: #065f46;
  }

  &.err {
    background: #fef2f2;
    color: #991b1b;
  }
}

.preview {
  height: 640px;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }
}

.stage {
  display: flex;
  justify-content: center;
  padding: 10px;
  background: #f6f7fb;
  border-radius: 12px;
  border: 1px dashed #e5e7eb;
}

.paper {
  width: 210mm;
  height: 297mm;
  padding: 14mm;
  background: #fff;
  border: 1px solid #ddd;
  overflow: hidden;
  color: #111827;
}

.paperTitle {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 900;
}

.meta {
  margin: 0 0 12px;
  font-size: 11px;
  color: #6b7280;
}

.report {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 12px;
  line-height: 1.4;

  th,
  td {
    border: 1px solid #ccc;
    padding: 8px;
    vertical-align: top;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  th {
    background: #f3f4f6;
    font-weight: 800;
  }
}

.col1 {
  width: 35mm;
}

.col3 {
  width: 40mm;
}

.footer {
  margin-top: 10mm;
  font-size: 10px;
  color: #6b7280;
}

.debug {
  margin-top: 12px;
  font-size: 12px;
  color: #374151;

  summary {
    cursor: pointer;
    font-weight: 800;
  }

  .debugRow {
    margin-top: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
}

.pager-layout {
  display: flex;
  gap: 20px;
  padding: 12px;
  background: #f5f5f5;
}

.controls {
  width: 300px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.control-group {
  margin-bottom: 14px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #374151;
  }

  input[type='range'] {
    width: 100%;
  }
}

.pages-wrapper {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}

.paper-page {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  border: 1px solid #ddd;
  padding: 14mm;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 8px;
}

.doc-title {
  margin: 0;
  font-weight: 700;
  white-space: pre-wrap;
}

.page-number {
  text-align: right;
  color: #666;
  font-size: 11px;
  margin-bottom: 8px;
}

.content {
  white-space: pre-wrap;
  color: #111827;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  min-height: calc(297mm - 50mm);
  box-sizing: border-box;
}

.table-content {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;

  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 8px;
    vertical-align: top;
    word-break: break-word;
  }

  th {
    background: #f8fafc;
    text-align: left;
  }
}

.text-content {
  margin-bottom: 12px;
}

.info {
  margin-top: 10px;
  font-size: 12px;
  color: #374151;
}

.empty-state {
  width: 100%;
  padding: 20px;
  text-align: center;
  color: #6b7280;
  background: #fff;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
}

@media (max-width: 1200px) {
  .pdf-maker,
  .pager-layout {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .controls {
    width: 100%;
    position: static;
  }

  .paper-page,
  .paper {
    width: 100%;
    min-height: auto;
    height: auto;
  }
}
</style>
