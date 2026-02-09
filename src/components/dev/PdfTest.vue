<template>
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
