import { computed, reactive, ref } from 'vue'

export interface FixedFormLineItem {
  category: string
  content: string
  note?: string
}

export interface FixedFormData {
  documentTitle: string
  documentNo: string
  issueDate: string
  customerName: string
  managerName: string
  amount: string
  summary: string
  notes: string
  items: FixedFormLineItem[]
}

interface GenerateOptions {
  sourceEls: HTMLElement[]
  fileInputEl?: HTMLInputElement | null
}

type ApiMethod = 'GET' | 'POST'

const TEMP_KEY = 'fixed-form-pdf-temp-v1'
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const FIXED_ROWS_IN_MAIN = 6
const SUMMARY_MAX_LINES = 3
const NOTES_MAX_LINES = 4

function isQuotaExceededError(error: unknown): boolean {
  if (!(error instanceof DOMException)) return false
  return (
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    error.code === 22 ||
    error.code === 1014
  )
}

function splitLinesByLength(text: string, maxCharsPerLine: number): string[] {
  const lines: string[] = []
  const rawLines = (text || '').split('\n')

  rawLines.forEach((raw) => {
    let remain = raw
    if (!remain) {
      lines.push('')
      return
    }

    while (remain.length > maxCharsPerLine) {
      lines.push(remain.slice(0, maxCharsPerLine))
      remain = remain.slice(maxCharsPerLine)
    }
    lines.push(remain)
  })

  return lines
}

function clampTextByLines(text: string, maxCharsPerLine: number, maxLines: number): string {
  const lines = splitLinesByLength(text, maxCharsPerLine)
  if (lines.length <= maxLines) return lines.join('\n')

  const truncated = lines.slice(0, maxLines)
  const last = truncated[maxLines - 1] ?? ''
  truncated[maxLines - 1] = last.length >= 2 ? `${last.slice(0, -2)}..` : `${last}..`
  return truncated.join('\n')
}

function toDataUrlBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const output = reader.result
      if (typeof output !== 'string') {
        reject(new Error('base64 변환 실패'))
        return
      }
      resolve(output.split(',')[1] ?? '')
    }
    reader.onerror = () => reject(new Error('base64 변환 실패'))
    reader.readAsDataURL(blob)
  })
}

function mapApiToForm(raw: any): Partial<FixedFormData> {
  const data = raw?.data ?? raw?.result ?? raw ?? {}
  const itemsRaw = Array.isArray(data.items) ? data.items : []

  return {
    documentTitle: String(data.documentTitle ?? data.title ?? ''),
    documentNo: String(data.documentNo ?? data.document_no ?? ''),
    issueDate: String(data.issueDate ?? data.issue_date ?? ''),
    customerName: String(data.customerName ?? data.customer_name ?? ''),
    managerName: String(data.managerName ?? data.manager_name ?? ''),
    amount: String(data.amount ?? ''),
    summary: String(data.summary ?? ''),
    notes: String(data.notes ?? ''),
    items: itemsRaw.map((item: any) => ({
      category: String(item.category ?? item.type ?? ''),
      content: String(item.content ?? item.value ?? ''),
      note: String(item.note ?? '')
    }))
  }
}

export function useFixedFormPdf(initialData: FixedFormData) {
  const form = reactive<FixedFormData>({
    ...initialData,
    items: [...initialData.items]
  })

  const status = reactive<{ type: 'info' | 'ok' | 'err'; message: string }>({
    type: 'info',
    message: ''
  })

  const previewUrl = ref('')
  const latestBlob = ref<Blob | null>(null)
  const latestFileName = ref('fixed_form.pdf')
  const base64 = ref('')

  const isGenerating = ref(false)
  const isLoadingApi = ref(false)

  const extraItems = computed(() => form.items.slice(FIXED_ROWS_IN_MAIN))

  const summaryPreview = computed(() => clampTextByLines(form.summary, 36, SUMMARY_MAX_LINES))
  const notesPreview = computed(() => clampTextByLines(form.notes, 42, NOTES_MAX_LINES))

  function setStatus(type: 'info' | 'ok' | 'err', message: string) {
    status.type = type
    status.message = message
  }

  function clearStatus() {
    status.message = ''
  }

  function revokePreview() {
    if (!previewUrl.value) return
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }

  function addItem() {
    form.items.push({ category: '', content: '', note: '' })
  }

  function removeItem(index: number) {
    if (index < 0 || index >= form.items.length) return
    form.items.splice(index, 1)
  }

  function applyPartial(partial: Partial<FixedFormData>) {
    if (partial.documentTitle !== undefined) form.documentTitle = partial.documentTitle
    if (partial.documentNo !== undefined) form.documentNo = partial.documentNo
    if (partial.issueDate !== undefined) form.issueDate = partial.issueDate
    if (partial.customerName !== undefined) form.customerName = partial.customerName
    if (partial.managerName !== undefined) form.managerName = partial.managerName
    if (partial.amount !== undefined) form.amount = partial.amount
    if (partial.summary !== undefined) form.summary = partial.summary
    if (partial.notes !== undefined) form.notes = partial.notes
    if (partial.items !== undefined) form.items = [...partial.items]
  }

  async function fetchAndApplyFromApi(url: string, method: ApiMethod, bodyText: string) {
    try {
      clearStatus()
      isLoadingApi.value = true
      setStatus('info', 'API 데이터를 불러오는 중입니다...')

      const init = { method } as {
        method: ApiMethod
        headers?: Record<string, string>
        body?: string
      }
      if (method === 'POST') {
        init.headers = { 'Content-Type': 'application/json' }
        init.body = bodyText ? bodyText : '{}'
      }

      const res = await fetch(url, init)
      if (!res.ok) throw new Error(`API 호출 실패 (${res.status})`)

      const json = await res.json()
      const mapped = mapApiToForm(json)
      applyPartial(mapped)

      setStatus('ok', 'API 데이터를 양식에 반영했습니다.')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'API 호출 실패'
      setStatus('err', msg)
    } finally {
      isLoadingApi.value = false
    }
  }

  async function generatePdf(options: GenerateOptions) {
    try {
      isGenerating.value = true
      clearStatus()
      setStatus('info', 'PDF 생성 중입니다...')

      const [{ default: html2canvas }, jspModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])
      const jsPDF = jspModule.jsPDF

      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
      const pageW = A4_WIDTH_MM
      const pageH = A4_HEIGHT_MM

      for (let i = 0; i < options.sourceEls.length; i++) {
        const sourceEl = options.sourceEls[i]
        if (!sourceEl) continue

        const canvas = await html2canvas(sourceEl, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true
        })

        const imgW = pageW
        const imgH = (canvas.height * imgW) / canvas.width

        if (i > 0) pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgW, Math.min(imgH, pageH))
      }

      const blob = pdf.output('blob') as Blob
      const fileName = `fixed_form_${Date.now()}.pdf`
      const file = new File([blob], fileName, { type: 'application/pdf' })

      latestBlob.value = blob
      latestFileName.value = fileName

      revokePreview()
      previewUrl.value = URL.createObjectURL(blob)
      base64.value = await toDataUrlBase64(blob)

      if (options.fileInputEl) {
        const dt = new DataTransfer()
        dt.items.add(file)
        options.fileInputEl.files = dt.files
      }

      saveTemp({ silent: true })
      setStatus('ok', 'PDF 생성 완료 (미리보기/다운로드/파일첨부 반영)')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'PDF 생성 실패'
      setStatus('err', msg)
    } finally {
      isGenerating.value = false
    }
  }

  function downloadPdf() {
    if (!latestBlob.value) {
      setStatus('err', '다운로드할 PDF가 없습니다.')
      return
    }

    const url = URL.createObjectURL(latestBlob.value)
    const a = document.createElement('a')
    a.href = url
    a.download = latestFileName.value
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function attachLatestToInput(inputEl: HTMLInputElement | null): boolean {
    if (!inputEl || !latestBlob.value) return false

    const file = new File([latestBlob.value], latestFileName.value || 'fixed_form.pdf', {
      type: 'application/pdf'
    })
    const dt = new DataTransfer()
    dt.items.add(file)
    inputEl.files = dt.files
    return true
  }

  function saveTemp(options?: { silent?: boolean }) {
    const payload = {
      form: { ...form, items: [...form.items] },
      fileName: latestFileName.value,
      updatedAt: Date.now(),
      version: 2
    }

    try {
      localStorage.setItem(TEMP_KEY, JSON.stringify(payload))
      if (!options?.silent) {
        setStatus('ok', '임시 데이터를 저장했습니다. (PDF 파일은 저장되지 않음)')
      }
    } catch (error) {
      if (isQuotaExceededError(error)) {
        setStatus('err', '브라우저 저장공간이 부족합니다. 임시 저장 정리 후 다시 시도하세요.')
        return
      }
      setStatus('err', '임시 데이터 저장에 실패했습니다.')
    }
  }

  function loadTemp() {
    try {
      const raw = localStorage.getItem(TEMP_KEY)
      if (!raw) {
        setStatus('err', '저장된 임시 데이터가 없습니다.')
        return
      }

      const parsed = JSON.parse(raw)
      applyPartial(parsed.form)
      base64.value = parsed.base64 || ''
      latestFileName.value = parsed.fileName || latestFileName.value

      if (base64.value) {
        const blob = b64toBlob(base64.value, 'application/pdf')
        latestBlob.value = blob
        revokePreview()
        previewUrl.value = URL.createObjectURL(blob)
        setStatus('ok', '임시 데이터를 불러왔습니다.')
        return
      }

      latestBlob.value = null
      revokePreview()
      setStatus('ok', '임시 양식 데이터를 불러왔습니다. PDF는 다시 생성하세요.')
    } catch {
      setStatus('err', '임시 데이터 불러오기에 실패했습니다.')
    }
  }

  function clearTemp() {
    localStorage.removeItem(TEMP_KEY)
    setStatus('ok', '임시 데이터를 삭제했습니다.')
  }

  function b64toBlob(b64Data: string, contentType: string) {
    const byteCharacters = atob(b64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i)
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    return new Blob(byteArrays, { type: contentType })
  }

  return {
    form,
    status,
    previewUrl,
    latestBlob,
    latestFileName,
    base64,
    isGenerating,
    isLoadingApi,
    summaryPreview,
    notesPreview,
    extraItems,
    addItem,
    removeItem,
    fetchAndApplyFromApi,
    generatePdf,
    attachLatestToInput,
    downloadPdf,
    saveTemp,
    loadTemp,
    clearTemp,
    revokePreview
  }
}
