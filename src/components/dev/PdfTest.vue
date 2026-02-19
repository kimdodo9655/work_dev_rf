<!-- <script setup lang="ts">
// 2줄 이상의 테이블

import { nextTick, onMounted, ref, watch } from 'vue'

interface Page {
  content: PageContent[]
  lines: number
  maxLines: number
}

interface PageContent {
  type: 'text' | 'table'
  data: string | TableData
}

interface TableCell {
  content?: string // skip일 때는 content가 없을 수 있음
  rowspan?: number
  skip?: boolean
}

interface TableData {
  headers: string[]
  rows: (string | TableCell)[][]
}

const text = ref(`여기에 긴 텍스트를 입력하세요.
테이블도 자동으로 페이지가 나뉩니다.`)

const tableData = ref<TableData>({
  headers: ['카테고리', 'data 01', 'data 02'],
  rows: [
    [{ content: 'data', rowspan: 10 }, '123', '456'],
    [
      { skip: true },
      '매우 긴 텍스트가 들어가면 자동으로 줄바꿈이 일어나고 행 높이가 늘어납니다. 이런 경우에도 정확히 측정되어 페이지 분할이 됩니다.매우 긴 텍스트가 들어가면 자동으로 줄바꿈이 일어나고 행 높이가 늘어납니다. 이런 경우에도 정확히 측정되어 페이지 분할이 됩니다.매우 긴 텍스트가 들어가면 자동으로 줄바꿈이 일어나고 행 높이가 늘어납니다. 이런 경우에도 정확히 측정되어 페이지 분할이 됩니다.',
      '456'
    ],
    [{ skip: true }, '123', '456'],
    [
      { skip: true },
      '123',
      '이것도 긴 텍스트입니다. 여러 줄에 걸쳐서 표시되면 행 높이가 자동으로 늘어나게 됩니다.'
    ],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456']
  ]
})

const title = ref('문서 제목')
const fontSize = ref(12)
const lineHeight = ref(1.6)
const pages = ref<Page[]>([])

// A4 용지 크기 (mm)
const A4_WIDTH = 210
const A4_HEIGHT = 297
const PADDING = 14
const CONTENT_PADDING_PX = 20
const TITLE_PADDING_BOTTOM_MM = 5

const mmToPx = (mm: number) => mm * 3.7795

const addTableRow = () => {
  const rowNum = tableData.value.rows.length + 1
  tableData.value.rows.push([{ skip: true }, `${rowNum * 123}`, `${rowNum * 456}`])
  // 첫 번째 행의 rowspan 업데이트
  const firstCell = tableData.value.rows[0]?.[0]
  if (firstCell && typeof firstCell === 'object' && firstCell.rowspan) {
    firstCell.rowspan = tableData.value.rows.length
  }
}

const getCellContent = (cell: string | TableCell): string => {
  return typeof cell === 'string' ? cell : cell.content || ''
}

const isSkipCell = (cell: string | TableCell): boolean => {
  return typeof cell === 'object' && cell.skip === true
}

const getRowspan = (cell: string | TableCell): number => {
  return typeof cell === 'object' && cell.rowspan ? cell.rowspan : 1
}

// 단일 행의 높이를 측정 (헤더 없이 tbody만)
const measureSingleRow = (row: (string | TableCell)[], measurer: HTMLElement): number => {
  const table = document.createElement('table')
  table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    font-size: ${fontSize.value}px;
    line-height: ${lineHeight.value};
  `

  const tbody = document.createElement('tbody')
  const tr = document.createElement('tr')
  row.forEach((cell) => {
    const td = document.createElement('td')
    td.textContent = getCellContent(cell)
    td.style.cssText = 'border: 1px solid #e5e7eb; padding: 8px; word-break: break-word;'
    tr.appendChild(td)
  })
  tbody.appendChild(tr)
  table.appendChild(tbody)

  measurer.appendChild(table)
  const height = table.offsetHeight
  measurer.removeChild(table)

  return height
}

const measureTableHeader = (headers: string[], measurer: HTMLElement): number => {
  const table = document.createElement('table')
  table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    font-size: ${fontSize.value}px;
    line-height: ${lineHeight.value};
  `

  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  headers.forEach((h) => {
    const th = document.createElement('th')
    th.textContent = h
    th.style.cssText =
      'border: 1px solid #e5e7eb; padding: 8px; text-align: left; background: #f9fafb; font-weight: 600;'
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  measurer.appendChild(table)
  const height = table.offsetHeight
  measurer.removeChild(table)

  return height
}

const calculatePages = async () => {
  if (!text.value && tableData.value.rows.length === 0) {
    pages.value = []
    return
  }

  await nextTick()

  // 타이틀 높이 측정
  const titleMeasurer = document.createElement('div')
  titleMeasurer.style.cssText = `
    position: absolute;
    visibility: hidden;
    font-size: ${fontSize.value}px;
    line-height: ${lineHeight.value};
    font-weight: 700;
    margin: 0;
  `
  titleMeasurer.textContent = title.value
  document.body.appendChild(titleMeasurer)
  const titleHeightPx = titleMeasurer.offsetHeight
  document.body.removeChild(titleMeasurer)

  const contentWidthPx = mmToPx(A4_WIDTH - PADDING * 2) - CONTENT_PADDING_PX * 2

  // 텍스트 측정용
  const textMeasurer = document.createElement('div')
  textMeasurer.style.cssText = `
    position: absolute;
    visibility: hidden;
    width: ${contentWidthPx}px;
    padding: 0;
    font-size: ${fontSize.value}px;
    line-height: ${lineHeight.value};
    white-space: pre-wrap;
    word-break: break-word;
    box-sizing: border-box;
  `
  document.body.appendChild(textMeasurer)

  // 테이블 측정용
  const tableMeasurer = document.createElement('div')
  tableMeasurer.style.cssText = `
    position: absolute;
    visibility: hidden;
    width: ${contentWidthPx}px;
    box-sizing: border-box;
  `
  document.body.appendChild(tableMeasurer)

  textMeasurer.textContent = 'A'
  const singleLineHeight = textMeasurer.offsetHeight

  // 테이블 헤더 높이 측정
  const headerHeight = measureTableHeader(tableData.value.headers, tableMeasurer)

  const firstPageAvailableHeightPx =
    mmToPx(A4_HEIGHT - PADDING * 2) - titleHeightPx - mmToPx(TITLE_PADDING_BOTTOM_MM)
  const firstPageTextHeightPx = firstPageAvailableHeightPx - CONTENT_PADDING_PX * 2 - 2
  const firstPageMaxLines = Math.floor(firstPageTextHeightPx / singleLineHeight)

  const otherPageAvailableHeightPx = mmToPx(A4_HEIGHT - PADDING * 2)
  const otherPageTextHeightPx = otherPageAvailableHeightPx - CONTENT_PADDING_PX * 2 - 2
  const otherPageMaxLines = Math.floor(otherPageTextHeightPx / singleLineHeight)

  const pagesList: Page[] = []
  let currentPageContent: PageContent[] = []
  let currentPageHeightPx = 0
  let isFirstPage = true

  // 텍스트 처리
  if (text.value) {
    const paragraphs = text.value.split('\n')
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
      currentPageContent.push({ type: 'text', data: currentText.trim() })
      currentPageHeightPx += textMeasurer.offsetHeight
    }
  }

  // 테이블 처리 - 각 행을 단순하게 측정
  if (tableData.value.rows.length > 0) {
    let currentTableRows: (string | TableCell)[][] = []
    let isNewTable = true
    let currentGroupFirstCell = ''

    for (let i = 0; i < tableData.value.rows.length; i++) {
      const row = tableData.value.rows[i]
      if (!row) continue

      const firstCell = row[0]

      // 새로운 그룹이 시작되면 저장
      if (firstCell && !isSkipCell(firstCell)) {
        currentGroupFirstCell = getCellContent(firstCell)
      }

      // 단일 행의 높이 측정 (skip 무시하고 모든 셀 표시)
      const measureRow = row.map((cell, idx) => {
        if (idx === 0 && cell && isSkipCell(cell)) {
          return currentGroupFirstCell
        }
        return cell
      })

      const rowHeight = measureSingleRow(measureRow, tableMeasurer)
      const additionalHeight = isNewTable ? headerHeight + rowHeight : rowHeight
      const currentMaxHeightPx = isFirstPage ? firstPageTextHeightPx : otherPageTextHeightPx

      // 한 행이 페이지보다 큰 경우 처리
      if (additionalHeight > currentMaxHeightPx) {
        // 현재까지 쌓인 테이블이 있으면 먼저 저장
        if (currentTableRows.length > 0) {
          const finalRows = [...currentTableRows]
          if (finalRows[0]) {
            finalRows[0] = [...finalRows[0]]
            finalRows[0][0] = { content: currentGroupFirstCell, rowspan: finalRows.length }
          }

          currentPageContent.push({
            type: 'table',
            data: {
              headers: tableData.value.headers,
              rows: finalRows
            }
          })

          const currentMaxLines = isFirstPage ? firstPageMaxLines : otherPageMaxLines
          pagesList.push({
            content: currentPageContent,
            lines: Math.ceil(currentPageHeightPx / singleLineHeight),
            maxLines: currentMaxLines
          })

          currentPageContent = []
          currentPageHeightPx = 0
          currentTableRows = []
          isFirstPage = false
        }

        // 큰 행을 단독 페이지로
        const newPageRow = row.map((cell, idx) => {
          if (idx === 0 && cell && isSkipCell(cell)) {
            return { content: currentGroupFirstCell, rowspan: 1 }
          }
          return cell
        })

        currentPageContent.push({
          type: 'table',
          data: {
            headers: tableData.value.headers,
            rows: [newPageRow]
          }
        })

        pagesList.push({
          content: currentPageContent,
          lines: Math.ceil(additionalHeight / singleLineHeight),
          maxLines: otherPageMaxLines
        })

        currentPageContent = []
        currentPageHeightPx = 0
        currentTableRows = []
        isFirstPage = false
        isNewTable = true
        continue
      }

      // 페이지를 넘어가는지 확인
      if (
        currentPageHeightPx + additionalHeight > currentMaxHeightPx &&
        currentTableRows.length > 0
      ) {
        // 첫 행의 rowspan을 현재 행 수로 조정해서 저장
        const finalRows = [...currentTableRows]
        if (finalRows[0]) {
          finalRows[0] = [...finalRows[0]]
          finalRows[0][0] = { content: currentGroupFirstCell, rowspan: finalRows.length }
        }

        currentPageContent.push({
          type: 'table',
          data: {
            headers: tableData.value.headers,
            rows: finalRows
          }
        })

        const currentMaxLines = isFirstPage ? firstPageMaxLines : otherPageMaxLines
        pagesList.push({
          content: currentPageContent,
          lines: Math.ceil(currentPageHeightPx / singleLineHeight),
          maxLines: currentMaxLines
        })

        // 새 페이지 시작
        currentPageContent = []
        currentPageHeightPx = 0

        // 현재 행을 새 페이지 첫 행으로
        const newPageRow = row.map((cell, idx) => {
          if (idx === 0 && cell && isSkipCell(cell)) {
            return currentGroupFirstCell
          }
          return cell
        })

        currentTableRows = [newPageRow]
        currentPageHeightPx = headerHeight + rowHeight
        isFirstPage = false
        isNewTable = true
      } else {
        // 현재 페이지에 행 추가
        currentTableRows.push(row)
        currentPageHeightPx += additionalHeight
        isNewTable = false
      }
    }

    // 남은 테이블 행이 있으면 추가 (rowspan 조정)
    if (currentTableRows.length > 0) {
      const finalRows = [...currentTableRows]
      if (finalRows[0]) {
        finalRows[0] = [...finalRows[0]]
        const firstCell = finalRows[0][0]
        if (firstCell && isSkipCell(firstCell)) {
          finalRows[0][0] = { content: currentGroupFirstCell, rowspan: finalRows.length }
        } else if (firstCell) {
          finalRows[0][0] = { content: getCellContent(firstCell), rowspan: finalRows.length }
        }
      }

      currentPageContent.push({
        type: 'table',
        data: {
          headers: tableData.value.headers,
          rows: finalRows
        }
      })
    }
  }

  // 마지막 페이지
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
  pages.value = pagesList
}

watch(
  [text, tableData, fontSize, lineHeight, title],
  () => {
    calculatePages()
  },
  { deep: true }
)

onMounted(() => {
  calculatePages()
})
</script>

<template>
  <div class="container">
    <div class="controls">
      <div class="control-group">
        <label>문서 제목:</label>
        <input v-model="title" type="text" placeholder="제목을 입력하세요..." />
      </div>

      <div class="control-group">
        <label>폰트 크기: {{ fontSize }}px</label>
        <input v-model.number="fontSize" type="range" min="8" max="24" step="1" />
      </div>

      <div class="control-group">
        <label>줄 간격: {{ lineHeight }}</label>
        <input v-model.number="lineHeight" type="range" min="1" max="2.5" step="0.1" />
      </div>

      <div class="control-group">
        <label>텍스트 입력:</label>
        <textarea v-model="text" rows="5" placeholder="여기에 텍스트를 입력하세요..." />
      </div>

      <div class="control-group">
        <label>테이블 행 추가:</label>
        <button @click="addTableRow" class="btn-add">행 추가</button>
      </div>

      <button @click="calculatePages" class="btn-calculate">다시 계산</button>

      <div class="info">
        <div>총 페이지: {{ pages.length }}</div>
      </div>
    </div>

    <div class="pages-wrapper">
      <div v-for="(page, index) in pages" :key="index" class="paper">
        <div v-if="index === 0" class="page-header">
          <h1
            class="title"
            :style="{
              fontSize: fontSize + 'px',
              lineHeight: lineHeight
            }"
          >
            {{ title }}
          </h1>
        </div>

        <div class="page-number">Page {{ index + 1 }} / {{ pages.length }}</div>

        <div
          class="content"
          :style="{
            fontSize: fontSize + 'px',
            lineHeight: lineHeight
          }"
        >
          <template v-for="(item, idx) in page.content" :key="idx">
            <div v-if="item.type === 'text'" class="text-content">
              {{ item.data }}
            </div>
            <table v-else-if="item.type === 'table'" class="table-content">
              <thead>
                <tr>
                  <th v-for="(header, hIdx) in (item.data as TableData).headers" :key="hIdx">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rIdx) in (item.data as TableData).rows" :key="rIdx">
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

      <div v-if="pages.length === 0" class="empty-state">
        텍스트나 테이블을 입력하면 여기에 페이지가 표시됩니다.
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.controls {
  width: 300px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.control-group {
  margin-bottom: 20px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.control-group input[type='range'] {
  width: 100%;
}

.control-group input[type='text'] {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
}

.control-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
  resize: vertical;
}

.btn-calculate,
.btn-add {
  width: 100%;
  padding: 10px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-add {
  background: #10b981;
}

.btn-calculate:hover {
  background: #2563eb;
}

.btn-add:hover {
  background: #059669;
}

.info {
  margin-top: 15px;
  padding: 10px;
  background: #f3f4f6;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  color: #374151;
}

.pages-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.paper {
  width: 210mm;
  height: 297mm;
  padding: 14mm;
  background: #fff;
  border: 1px solid #ddd;
  color: #111827;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.page-header {
  flex-shrink: 0;
  padding-bottom: 5mm;
}

.title {
  margin: 0;
  font-weight: 700;
  color: #111827;
}

.page-number {
  position: absolute;
  top: 8mm;
  right: 14mm;
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
}

.content {
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  padding: 20px;
  border-radius: 2px;
  background: #fafafa;
  box-sizing: border-box;
  flex: 1;
}

.text-content {
  margin-bottom: 15px;
  white-space: pre-wrap;
}

.table-content {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.table-content th,
.table-content td {
  border: 1px solid #e5e7eb;
  padding: 8px;
  text-align: left;
  word-break: break-word;
}

.table-content th {
  background: #f9fafb;
  font-weight: 600;
}

.table-content tbody tr:nth-child(even) {
  background: #f9fafb;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

@media print {
  .container {
    display: block;
    padding: 0;
    background: white;
  }

  .controls {
    display: none;
  }

  .pages-wrapper {
    gap: 0;
  }

  .paper {
    box-shadow: none;
    border: none;
    margin: 0;
    page-break-after: always;
  }

  .paper:last-child {
    page-break-after: auto;
  }

  .content {
    background: white;
    border-color: #000;
  }
}
</style> -->

<!-- <script setup lang="ts">
// 병합 테이블

import { nextTick, onMounted, ref, watch } from 'vue'

interface Page {
  text: string
  lines: number
  maxLines: number
}

const testText = '테스트용 텍스트\n\t테스트용 텍스트\n테스트용 텍스트'

const text = ref(`여기에 긴 텍스트를 입력하세요.
여러 줄의 텍스트가 들어가면
자동으로 페이지가 나뉩니다.

새로운 문단도 인식됩니다.
A4 용지 크기에 맞춰서 자동으로 페이지가 추가됩니다.
이제 마지막 줄이 잘리지 않고 정확히 줄 단위로 분할됩니다.
한 문단이 길어도 페이지를 최대한 채운 후 다음 페이지로 넘어갑니다.`)

const title = ref('문서 제목')
const fontSize = ref(12)
const lineHeight = ref(1.6)
const pages = ref<Page[]>([])

// A4 용지 크기 (mm)
const A4_WIDTH = 210
const A4_HEIGHT = 297
const PADDING = 14
const CONTENT_PADDING_PX = 20 // 본문 내부 패딩 (px)
const TITLE_PADDING_BOTTOM_MM = 5 // 타이틀 하단 패딩 (mm)

// mm를 픽셀로 변환
const mmToPx = (mm: number) => mm * 3.7795

const calculatePages = async () => {
  if (!text.value) {
    pages.value = []
    return
  }

  await nextTick()

  // 타이틀의 실제 높이 측정 (px)
  const titleMeasurer = document.createElement('div')
  titleMeasurer.style.cssText = `
    position: absolute;
    visibility: hidden;
    font-size: ${fontSize.value}px;
    line-height: ${lineHeight.value};
    font-weight: 700;
    margin: 0;
  `
  titleMeasurer.textContent = title.value
  document.body.appendChild(titleMeasurer)
  const titleHeightPx = titleMeasurer.offsetHeight
  document.body.removeChild(titleMeasurer)

  // 본문 영역의 너비 계산 (content 내부 실제 텍스트 영역)
  const contentWidthPx = mmToPx(A4_WIDTH - PADDING * 2) - CONTENT_PADDING_PX * 2

  // 임시 측정용 div 생성
  const measurer = document.createElement('div')
  measurer.style.cssText = `
    position: absolute;
    visibility: hidden;
    width: ${contentWidthPx}px;
    padding: 0;
    font-size: ${fontSize.value}px;
    line-height: ${lineHeight.value};
    white-space: pre-wrap;
    word-break: break-word;
    color: #111827;
    box-sizing: border-box;
  `
  document.body.appendChild(measurer)

  // 한 줄의 높이 계산
  measurer.textContent = 'A'
  const singleLineHeight = measurer.offsetHeight

  // 첫 페이지: 전체 높이에서 paper padding, title, title padding을 뺀 후 content 영역 계산
  const firstPageAvailableHeightPx =
    mmToPx(A4_HEIGHT - PADDING * 2) - titleHeightPx - mmToPx(TITLE_PADDING_BOTTOM_MM)
  const firstPageTextHeightPx = firstPageAvailableHeightPx - CONTENT_PADDING_PX * 2 - 2
  const firstPageMaxLines = Math.floor(firstPageTextHeightPx / singleLineHeight)

  // 두 번째 페이지부터: title 없이 계산
  const otherPageAvailableHeightPx = mmToPx(A4_HEIGHT - PADDING * 2)
  const otherPageTextHeightPx = otherPageAvailableHeightPx - CONTENT_PADDING_PX * 2 - 2
  const otherPageMaxLines = Math.floor(otherPageTextHeightPx / singleLineHeight)

  const pagesList: Page[] = []
  const paragraphs = text.value.split('\n')

  let currentPageText = ''
  let isFirstPage = true

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i]

    // 빈 줄 처리
    if (paragraph === '') {
      const testText = currentPageText + '\n'
      measurer.textContent = testText
      const testLines = Math.ceil(measurer.offsetHeight / singleLineHeight)
      const currentMaxLines = isFirstPage ? firstPageMaxLines : otherPageMaxLines

      if (testLines <= currentMaxLines) {
        currentPageText = testText
      } else {
        // 페이지 저장
        measurer.textContent = currentPageText
        pagesList.push({
          text: currentPageText.trim(),
          lines: Math.ceil(measurer.offsetHeight / singleLineHeight),
          maxLines: currentMaxLines
        })
        currentPageText = '\n'
        isFirstPage = false
      }
      continue
    }

    // 문단을 단어 단위로 분할
    const words = paragraph.split(' ')

    for (let j = 0; j < words.length; j++) {
      const word = words[j]
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
        // 현재 페이지 저장
        if (currentPageText.trim()) {
          measurer.textContent = currentPageText
          pagesList.push({
            text: currentPageText.trim(),
            lines: Math.ceil(measurer.offsetHeight / singleLineHeight),
            maxLines: currentMaxLines
          })
        }

        // 새 페이지 시작
        currentPageText = word
        isFirstPage = false
      } else {
        currentPageText = testText
      }
    }

    // 문단 끝에 줄바꿈 추가 (마지막 문단이 아닌 경우)
    if (i < paragraphs.length - 1) {
      currentPageText += '\n'
    }
  }

  // 마지막 페이지 추가
  if (currentPageText.trim()) {
    measurer.textContent = currentPageText
    const currentMaxLines = isFirstPage ? firstPageMaxLines : otherPageMaxLines
    pagesList.push({
      text: currentPageText.trim(),
      lines: Math.ceil(measurer.offsetHeight / singleLineHeight),
      maxLines: currentMaxLines
    })
  }

  document.body.removeChild(measurer)
  pages.value = pagesList
}

// 텍스트나 폰트 변경 시 재계산
watch([text, fontSize, lineHeight, title], () => {
  calculatePages()
})

onMounted(() => {
  calculatePages()
})
</script>

<template>
  <div style="white-space: pre-wrap">{{ testText }}</div>
  <div class="container">
    <div class="controls">
      <div class="control-group">
        <label>문서 제목:</label>
        <input v-model="title" type="text" placeholder="제목을 입력하세요..." />
      </div>

      <div class="control-group">
        <label>폰트 크기: {{ fontSize }}px</label>
        <input v-model.number="fontSize" type="range" min="8" max="24" step="1" />
      </div>

      <div class="control-group">
        <label>줄 간격: {{ lineHeight }}</label>
        <input v-model.number="lineHeight" type="range" min="1" max="2.5" step="0.1" />
      </div>

      <div class="control-group">
        <label>텍스트 입력:</label>
        <textarea v-model="text" rows="10" placeholder="여기에 텍스트를 입력하세요..." />
      </div>

      <button @click="calculatePages" class="btn-calculate">다시 계산</button>

      <div class="info">
        <div>총 페이지: {{ pages.length }}</div>
        <div v-if="pages.length > 0" class="info-detail">
          첫 페이지: 최대 {{ pages[0]?.maxLines }}줄 (현재 {{ pages[0]?.lines }}줄)
        </div>
        <div v-if="pages.length > 1" class="info-detail">
          나머지: 최대 {{ pages[1]?.maxLines }}줄
        </div>
      </div>
    </div>

    <div class="pages-wrapper">
      <div v-for="(page, index) in pages" :key="index" class="paper">
        <div v-if="index === 0" class="page-header">
          <h1
            class="title"
            :style="{
              fontSize: fontSize + 'px',
              lineHeight: lineHeight
            }"
          >
            {{ title }}
          </h1>
        </div>

        <div class="page-number">Page {{ index + 1 }} / {{ pages.length }}</div>

        <div
          class="content"
          :style="{
            fontSize: fontSize + 'px',
            lineHeight: lineHeight
          }"
        >
          {{ page.text }}
        </div>
      </div>

      <div v-if="pages.length === 0" class="empty-state">
        텍스트를 입력하면 여기에 페이지가 표시됩니다.
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.controls {
  width: 300px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.control-group {
  margin-bottom: 20px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.control-group input[type='range'] {
  width: 100%;
}

.control-group input[type='text'] {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
}

.control-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
  resize: vertical;
}

.btn-calculate {
  width: 100%;
  padding: 10px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-calculate:hover {
  background: #2563eb;
}

.info {
  margin-top: 15px;
  padding: 10px;
  background: #f3f4f6;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  color: #374151;
}

.info-detail {
  margin-top: 5px;
  font-size: 12px;
  color: #6b7280;
}

.pages-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.paper {
  width: 210mm;
  height: 297mm;
  padding: 14mm;
  background: #fff;
  border: 1px solid #ddd;
  color: #111827;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.page-header {
  flex-shrink: 0;
  padding-bottom: 5mm;
}

.title {
  margin: 0;
  font-weight: 700;
  color: #111827;
}

.page-number {
  position: absolute;
  top: 8mm;
  right: 14mm;
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
}

.content {
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  padding: 20px;
  border-radius: 2px;
  background: #fafafa;
  box-sizing: border-box;
  flex: 1;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

/* 인쇄용 스타일 */
@media print {
  .container {
    display: block;
    padding: 0;
    background: white;
  }

  .controls {
    display: none;
  }

  .pages-wrapper {
    gap: 0;
  }

  .paper {
    box-shadow: none;
    border: none;
    margin: 0;
    page-break-after: always;
  }

  .paper:last-child {
    page-break-after: auto;
  }

  .content {
    background: white;
    border-color: #000;
  }
}
</style> -->

<!-- <script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

interface Page {
  content: PageContent[]
  lines: number
  maxLines: number
}

interface PageContent {
  type: 'text' | 'table'
  data: string | TableData
}

interface TableCell {
  content: string
  rowspan?: number
  skip?: boolean
}

interface TableData {
  headers: string[]
  rows: (string | TableCell)[][]
}

const text = ref(`여기에 긴 텍스트를 입력하세요.
테이블도 자동으로 페이지가 나뉩니다.`)

const tableData = ref<TableData>({
  headers: ['카테고리', 'data 01', 'data 02'],
  rows: [
    [{ content: 'data', rowspan: 10 }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456'],
    [{ skip: true }, '123', '456']
  ]
})

const title = ref('문서 제목')
const fontSize = ref(12)
const lineHeight = ref(1.6)
const pages = ref<Page[]>([])

// A4 용지 크기 (mm)
const A4_WIDTH = 210
const A4_HEIGHT = 297
const PADDING = 14
const CONTENT_PADDING_PX = 20
const TITLE_PADDING_BOTTOM_MM = 5

const mmToPx = (mm: number) => mm * 3.7795

const addTableRow = () => {
  const rowNum = tableData.value.rows.length + 1
  tableData.value.rows.push([{ skip: true }, `${rowNum * 123}`, `${rowNum * 456}`])
  // 첫 번째 행의 rowspan 업데이트
  const firstCell = tableData.value.rows[0][0]
  if (typeof firstCell === 'object' && firstCell.rowspan) {
    firstCell.rowspan = tableData.value.rows.length
  }
}

const getCellContent = (cell: string | TableCell): string => {
  return typeof cell === 'string' ? cell : cell.content
}

const isSkipCell = (cell: string | TableCell): boolean => {
  return typeof cell === 'object' && cell.skip === true
}

const getRowspan = (cell: string | TableCell): number => {
  return typeof cell === 'object' && cell.rowspan ? cell.rowspan : 1
}

// 단일 행의 높이를 측정 (헤더 없이 tbody만)
const measureSingleRow = (row: (string | TableCell)[], measurer: HTMLElement): number => {
  const table = document.createElement('table')
  table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    font-size: ${fontSize.value}px;
    line-height: ${lineHeight.value};
  `

  const tbody = document.createElement('tbody')
  const tr = document.createElement('tr')
  row.forEach((cell) => {
    const td = document.createElement('td')
    td.textContent = getCellContent(cell)
    td.style.cssText = 'border: 1px solid #e5e7eb; padding: 8px;'
    tr.appendChild(td)
  })
  tbody.appendChild(tr)
  table.appendChild(tbody)

  measurer.appendChild(table)
  const height = table.offsetHeight
  measurer.removeChild(table)

  return height
}

const measureTableHeader = (headers: string[], measurer: HTMLElement): number => {
  const table = document.createElement('table')
  table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    font-size: ${fontSize.value}px;
    line-height: ${lineHeight.value};
  `

  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  headers.forEach((h) => {
    const th = document.createElement('th')
    th.textContent = h
    th.style.cssText =
      'border: 1px solid #e5e7eb; padding: 8px; text-align: left; background: #f9fafb; font-weight: 600;'
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  measurer.appendChild(table)
  const height = table.offsetHeight
  measurer.removeChild(table)

  return height
}

const calculatePages = async () => {
  if (!text.value && tableData.value.rows.length === 0) {
    pages.value = []
    return
  }

  await nextTick()

  // 타이틀 높이 측정
  const titleMeasurer = document.createElement('div')
  titleMeasurer.style.cssText = `
    position: absolute;
    visibility: hidden;
    font-size: ${fontSize.value}px;
    line-height: ${lineHeight.value};
    font-weight: 700;
    margin: 0;
  `
  titleMeasurer.textContent = title.value
  document.body.appendChild(titleMeasurer)
  const titleHeightPx = titleMeasurer.offsetHeight
  document.body.removeChild(titleMeasurer)

  const contentWidthPx = mmToPx(A4_WIDTH - PADDING * 2) - CONTENT_PADDING_PX * 2

  // 텍스트 측정용
  const textMeasurer = document.createElement('div')
  textMeasurer.style.cssText = `
    position: absolute;
    visibility: hidden;
    width: ${contentWidthPx}px;
    padding: 0;
    font-size: ${fontSize.value}px;
    line-height: ${lineHeight.value};
    white-space: pre-wrap;
    word-break: break-word;
    box-sizing: border-box;
  `
  document.body.appendChild(textMeasurer)

  // 테이블 측정용
  const tableMeasurer = document.createElement('div')
  tableMeasurer.style.cssText = `
    position: absolute;
    visibility: hidden;
    width: ${contentWidthPx}px;
    box-sizing: border-box;
  `
  document.body.appendChild(tableMeasurer)

  textMeasurer.textContent = 'A'
  const singleLineHeight = textMeasurer.offsetHeight

  // 테이블 헤더 높이 측정
  const headerHeight = measureTableHeader(tableData.value.headers, tableMeasurer)

  const firstPageAvailableHeightPx =
    mmToPx(A4_HEIGHT - PADDING * 2) - titleHeightPx - mmToPx(TITLE_PADDING_BOTTOM_MM)
  const firstPageTextHeightPx = firstPageAvailableHeightPx - CONTENT_PADDING_PX * 2 - 2
  const firstPageMaxLines = Math.floor(firstPageTextHeightPx / singleLineHeight)

  const otherPageAvailableHeightPx = mmToPx(A4_HEIGHT - PADDING * 2)
  const otherPageTextHeightPx = otherPageAvailableHeightPx - CONTENT_PADDING_PX * 2 - 2
  const otherPageMaxLines = Math.floor(otherPageTextHeightPx / singleLineHeight)

  const pagesList: Page[] = []
  let currentPageContent: PageContent[] = []
  let currentPageHeightPx = 0
  let isFirstPage = true

  // 텍스트 처리
  if (text.value) {
    const paragraphs = text.value.split('\n')
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
          textMeasurer.textContent = currentText
          const textHeight = textMeasurer.offsetHeight
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

  // 테이블 처리 - 각 행을 단순하게 측정
  if (tableData.value.rows.length > 0) {
    let currentTableRows: (string | TableCell)[][] = []
    let isNewTable = true
    let currentGroupFirstCell = ''

    for (let i = 0; i < tableData.value.rows.length; i++) {
      const row = tableData.value.rows[i]
      const firstCell = row[0]

      // 새로운 그룹이 시작되면 저장
      if (!isSkipCell(firstCell)) {
        currentGroupFirstCell = getCellContent(firstCell)
      }

      // 단일 행의 높이 측정 (skip 무시하고 모든 셀 표시)
      const measureRow = row.map((cell, idx) => {
        if (idx === 0 && isSkipCell(cell)) {
          return currentGroupFirstCell
        }
        return cell
      })

      const rowHeight = measureSingleRow(measureRow, tableMeasurer)
      const additionalHeight = isNewTable ? headerHeight + rowHeight : rowHeight
      const currentMaxHeightPx = isFirstPage ? firstPageTextHeightPx : otherPageTextHeightPx

      // 페이지를 넘어가는지 확인
      if (
        currentPageHeightPx + additionalHeight > currentMaxHeightPx &&
        currentTableRows.length > 0
      ) {
        // 첫 행의 rowspan을 현재 행 수로 조정해서 저장
        const finalRows = [...currentTableRows]
        finalRows[0] = [...finalRows[0]]
        finalRows[0][0] = { content: currentGroupFirstCell, rowspan: finalRows.length }

        currentPageContent.push({
          type: 'table',
          data: {
            headers: tableData.value.headers,
            rows: finalRows
          }
        })

        const currentMaxLines = isFirstPage ? firstPageMaxLines : otherPageMaxLines
        pagesList.push({
          content: currentPageContent,
          lines: Math.ceil(currentPageHeightPx / singleLineHeight),
          maxLines: currentMaxLines
        })

        // 새 페이지 시작
        currentPageContent = []
        currentPageHeightPx = 0

        // 현재 행을 새 페이지 첫 행으로
        const newPageRow = row.map((cell, idx) => {
          if (idx === 0 && isSkipCell(cell)) {
            return currentGroupFirstCell
          }
          return cell
        })

        currentTableRows = [newPageRow]
        currentPageHeightPx = headerHeight + rowHeight
        isFirstPage = false
        isNewTable = true
      } else {
        // 현재 페이지에 행 추가
        currentTableRows.push(row)
        currentPageHeightPx += additionalHeight
        isNewTable = false
      }
    }

    // 남은 테이블 행이 있으면 추가 (rowspan 조정)
    if (currentTableRows.length > 0) {
      const finalRows = [...currentTableRows]
      finalRows[0] = [...finalRows[0]]
      if (isSkipCell(finalRows[0][0])) {
        finalRows[0][0] = { content: currentGroupFirstCell, rowspan: finalRows.length }
      } else {
        const firstCell = finalRows[0][0]
        finalRows[0][0] = { content: getCellContent(firstCell), rowspan: finalRows.length }
      }

      currentPageContent.push({
        type: 'table',
        data: {
          headers: tableData.value.headers,
          rows: finalRows
        }
      })
    }
  }

  // 마지막 페이지
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
  pages.value = pagesList
}

watch(
  [text, tableData, fontSize, lineHeight, title],
  () => {
    calculatePages()
  },
  { deep: true }
)

onMounted(() => {
  calculatePages()
})
</script>

<template>
  <div class="container">
    <div class="controls">
      <div class="control-group">
        <label>문서 제목:</label>
        <input v-model="title" type="text" placeholder="제목을 입력하세요..." />
      </div>

      <div class="control-group">
        <label>폰트 크기: {{ fontSize }}px</label>
        <input v-model.number="fontSize" type="range" min="8" max="24" step="1" />
      </div>

      <div class="control-group">
        <label>줄 간격: {{ lineHeight }}</label>
        <input v-model.number="lineHeight" type="range" min="1" max="2.5" step="0.1" />
      </div>

      <div class="control-group">
        <label>텍스트 입력:</label>
        <textarea v-model="text" rows="5" placeholder="여기에 텍스트를 입력하세요..." />
      </div>

      <div class="control-group">
        <label>테이블 행 추가:</label>
        <button @click="addTableRow" class="btn-add">행 추가</button>
      </div>

      <button @click="calculatePages" class="btn-calculate">다시 계산</button>

      <div class="info">
        <div>총 페이지: {{ pages.length }}</div>
      </div>
    </div>

    <div class="pages-wrapper">
      <div v-for="(page, index) in pages" :key="index" class="paper">
        <div v-if="index === 0" class="page-header">
          <h1
            class="title"
            :style="{
              fontSize: fontSize + 'px',
              lineHeight: lineHeight
            }"
          >
            {{ title }}
          </h1>
        </div>

        <div class="page-number">Page {{ index + 1 }} / {{ pages.length }}</div>

        <div
          class="content"
          :style="{
            fontSize: fontSize + 'px',
            lineHeight: lineHeight
          }"
        >
          <template v-for="(item, idx) in page.content" :key="idx">
            <div v-if="item.type === 'text'" class="text-content">
              {{ item.data }}
            </div>
            <table v-else-if="item.type === 'table'" class="table-content">
              <thead>
                <tr>
                  <th v-for="(header, hIdx) in (item.data as TableData).headers" :key="hIdx">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rIdx) in (item.data as TableData).rows" :key="rIdx">
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

      <div v-if="pages.length === 0" class="empty-state">
        텍스트나 테이블을 입력하면 여기에 페이지가 표시됩니다.
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.controls {
  width: 300px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.control-group {
  margin-bottom: 20px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.control-group input[type='range'] {
  width: 100%;
}

.control-group input[type='text'] {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
}

.control-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
  resize: vertical;
}

.btn-calculate,
.btn-add {
  width: 100%;
  padding: 10px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-add {
  background: #10b981;
}

.btn-calculate:hover {
  background: #2563eb;
}

.btn-add:hover {
  background: #059669;
}

.info {
  margin-top: 15px;
  padding: 10px;
  background: #f3f4f6;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  color: #374151;
}

.pages-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.paper {
  width: 210mm;
  height: 297mm;
  padding: 14mm;
  background: #fff;
  border: 1px solid #ddd;
  color: #111827;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.page-header {
  flex-shrink: 0;
  padding-bottom: 5mm;
}

.title {
  margin: 0;
  font-weight: 700;
  color: #111827;
}

.page-number {
  position: absolute;
  top: 8mm;
  right: 14mm;
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
}

.content {
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  padding: 20px;
  border-radius: 2px;
  background: #fafafa;
  box-sizing: border-box;
  flex: 1;
}

.text-content {
  margin-bottom: 15px;
  white-space: pre-wrap;
}

.table-content {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.table-content th,
.table-content td {
  border: 1px solid #e5e7eb;
  padding: 8px;
  text-align: left;
}

.table-content th {
  background: #f9fafb;
  font-weight: 600;
}

.table-content tbody tr:nth-child(even) {
  background: #f9fafb;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

@media print {
  .container {
    display: block;
    padding: 0;
    background: white;
  }

  .controls {
    display: none;
  }

  .pages-wrapper {
    gap: 0;
  }

  .paper {
    box-shadow: none;
    border: none;
    margin: 0;
    page-break-after: always;
  }

  .paper:last-child {
    page-break-after: auto;
  }

  .content {
    background: white;
    border-color: #000;
  }
}
</style> -->

<template>
  <div style="width: 1000px; height: 1000px">
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
        <button class="btn" @click="putIntoInput" :disabled="!latestBlob">파일 인풋에 담기</button>
        <button class="btn dark" @click="downloadPdf" :disabled="!latestBlob">PDF 다운로드</button>
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
                  A4 크기로 고정된 테이블을 화면에 렌더링한 그대로 캡처하여 PDF로 저장합니다. 생성된
                  PDF를 파일 인풋에 담아 register-api로 multipart 업로드합니다.
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
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'

import PdfViewer from '../doc-templates/PdfViewer.vue'

type StatusType = 'info' | 'ok' | 'err'
const status = reactive<{ type: StatusType; msg: string }>({ type: 'info', msg: '' })

const paperEl = ref<HTMLElement | null>(null)
const fileInputEl = ref<HTMLInputElement | null>(null)

const latestBlob = ref<Blob | null>(null)
const latestName = ref<string>('')
const previewUrl = ref<string>('')
const base64 = ref<string>('')

const selectedFile = ref<File | null>(null)
const hasSelectedFile = computed(() => !!selectedFile.value)

// ✅ 사용자가 준 API
const REGISTER_API =
  'http://register-api.dev.com/api/registry/progress/RM2026020603242/documents/temp?registryType=OT&documentType=POA&applicationId=1'

// ❗ 보안상 이 토큰은 실제 코드에 두면 안 됨 (기능 유지 위해 일단 그대로 둠)
const ACCESS_TOKEN = '...생략...'
const X_BANK_CODE = 'bankclear'

function setStatus(type: StatusType, msg: string) {
  status.type = type
  status.msg = msg
}
function clearStatus() {
  status.msg = ''
}

function revokePreviewUrl() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onloadend = () => {
      const out = r.result
      if (typeof out !== 'string') return reject(new Error('FileReader 결과 오류'))
      resolve(out.split(',')[1] ?? '')
    }
    r.onerror = () => reject(new Error('FileReader 오류'))
    r.readAsDataURL(blob)
  })
}

/** ✅ html2canvas/jspdf를 클릭 시점에만 로딩 + 캐시 */
let _pdfDepsPromise: Promise<{
  html2canvas: (el: HTMLElement, opts?: any) => Promise<HTMLCanvasElement>
  jsPDF: any
}> | null = null

function loadPdfDeps() {
  if (_pdfDepsPromise) return _pdfDepsPromise
  _pdfDepsPromise = Promise.all([import('html2canvas'), import('jspdf')]).then(([h2c, jsp]) => {
    return {
      html2canvas: h2c.default,
      jsPDF: jsp.jsPDF
    }
  })
  return _pdfDepsPromise
}

async function makePdf() {
  try {
    clearStatus()
    setStatus('info', 'A4 캡처 및 PDF 생성 중...')

    const el = paperEl.value
    if (!el) throw new Error('캡처 대상 엘리먼트를 찾지 못했습니다.')

    // ✅ 여기서만 로딩됨 (페이지 진입만으로는 번들 안 커짐)
    const { html2canvas, jsPDF } = await loadPdfDeps()

    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true
    })

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth() // 210
    const pageH = pdf.internal.pageSize.getHeight() // 297

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
  } catch (e) {
    setStatus('err', e instanceof Error ? e.message : '알 수 없는 오류')
  }
}

function putIntoInput() {
  try {
    if (!latestBlob.value) {
      setStatus('err', '먼저 PDF를 생성하세요.')
      return
    }
    const input = fileInputEl.value
    if (!input) {
      setStatus('err', '파일 인풋을 찾지 못했습니다.')
      return
    }

    const file = new File([latestBlob.value], latestName.value || `a4_${Date.now()}.pdf`, {
      type: 'application/pdf'
    })

    const dt = new DataTransfer()
    dt.items.add(file)
    input.files = dt.files
    selectedFile.value = file

    setStatus('ok', '파일 인풋에 PDF를 담았습니다.')
  } catch (e) {
    setStatus('err', e instanceof Error ? e.message : '알 수 없는 오류')
  }
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
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
  } catch (e) {
    setStatus('err', e instanceof Error ? e.message : '알 수 없는 오류')
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

    console.log('upload success:', body)
    setStatus('ok', '업로드 성공! (응답은 콘솔 확인)')
  } catch (e) {
    setStatus('err', e instanceof Error ? e.message : '알 수 없는 오류')
  }
}

onBeforeUnmount(() => {
  revokePreviewUrl()
})
</script>

<style lang="scss" scoped>
.pdf-maker {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 16px;
}

.panel {
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

textarea {
  width: 100%;
  min-height: 160px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fafafa;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
}

.hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.status {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  border: 1px solid transparent;

  &.info {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1e40af;
  }

  &.ok {
    background: #ecfdf5;
    border-color: #a7f3d0;
    color: #065f46;
  }

  &.err {
    background: #fef2f2;
    border-color: #fecaca;
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

/* ===== A4 고정 캡처 영역 ===== */
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
</style>
