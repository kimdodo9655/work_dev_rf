<!-- 문서 경로: `@/src/features/doc-templates/PdfViewer.vue`
문서 제목: 기능 페이지/컴포넌트: pdf-viewer -->

<template>
  <div class="pdf-viewer-root" :class="{ 'is-fullscreen': fullScreen }">
    <!-- 1. 인터넷창 헤더 영역 (앱 내에서 유사 헤더 구현) -->
    <header class="browser-header">
      <div class="browser-left">
        <div class="favicon" aria-hidden="true"></div>
        <div class="app-title">{{ appTitle }}</div>
      </div>
      <div class="address-bar" :title="addressPath">{{ addressPath }}</div>
      <div class="browser-right">
        <button class="icon-btn" type="button" @click="handleDownload" :disabled="!pdfReady">
          ⬇︎ <span class="btn-text">다운로드</span>
        </button>
      </div>
    </header>

    <!-- 2. 웹뷰어 상단 GNB -->
    <nav class="gnb">
      <div class="gnb-left">
        <button class="icon-btn" type="button" @click="toggleThumbs" :disabled="!pdfReady">
          {{ showThumbs ? '▦' : '▢' }} <span class="btn-text">썸네일</span>
        </button>
      </div>

      <div class="gnb-center">
        <button
          class="icon-btn"
          type="button"
          @click="goPrev"
          :disabled="!pdfReady || pageNum <= 1"
        >
          ◀ <span class="btn-text">이전</span>
        </button>

        <div class="page-indicator" v-if="pdfReady">
          <input
            class="page-input"
            type="number"
            :min="1"
            :max="numPages"
            v-model.number="pageInput"
            @keydown.enter.prevent="applyPageInput"
            @blur="applyPageInput"
          />
          <span class="page-total">/ {{ numPages }}</span>
        </div>
        <div class="page-indicator" v-else>
          <span class="page-total">로딩 중…</span>
        </div>

        <button
          class="icon-btn"
          type="button"
          @click="goNext"
          :disabled="!pdfReady || pageNum >= numPages"
        >
          <span class="btn-text">다음</span> ▶
        </button>
      </div>

      <div class="gnb-right">
        <div class="zoom-group">
          <button class="icon-btn" type="button" @click="zoomOut" :disabled="!pdfReady">－</button>
          <div class="zoom-label" :title="zoomModeLabel">{{ Math.round(zoomPct) }}%</div>
          <button class="icon-btn" type="button" @click="zoomIn" :disabled="!pdfReady">＋</button>
        </div>

        <select
          class="zoom-select"
          v-model="zoomSelect"
          :disabled="!pdfReady"
          @change="applyZoomSelect"
        >
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option value="100">100%</option>
          <option value="125">125%</option>
          <option value="150">150%</option>
          <!-- ✅ 라벨 뒤집힘 수정 -->
          <option value="fitWidth">폭맞춤</option>
          <option value="fitPage">쪽맞춤</option>
        </select>

        <button class="icon-btn" type="button" @click="rotateRight" :disabled="!pdfReady">
          ⟳ <span class="btn-text">회전</span>
        </button>

        <div class="fit-group">
          <button
            class="icon-btn"
            :class="{ active: zoomMode === 'fitWidth' }"
            @click="setFitWidth"
          >
            폭맞춤
          </button>

          <button class="icon-btn" :class="{ active: zoomMode === 'fitPage' }" @click="setFitPage">
            쪽맞춤
          </button>
        </div>
      </div>
    </nav>

    <!-- 본문 -->
    <div class="body">
      <!-- 3. 썸네일 영역 -->
      <aside v-show="showThumbs" class="thumbs">
        <div class="thumbs-inner" v-if="pdfReady">
          <button
            v-for="n in numPages"
            :key="n"
            class="thumb-item"
            :class="{ active: n === pageNum }"
            type="button"
            @click="setPage(n)"
          >
            <canvas class="thumb-canvas" :ref="(el) => setThumbCanvasRef(n, el)"></canvas>
            <div class="thumb-page">{{ n }}</div>
          </button>
        </div>
        <div class="thumbs-inner" v-else>
          <div class="thumb-loading">로딩 중…</div>
        </div>
      </aside>

      <!-- 4. 문서보기 영역 -->
      <main class="viewer" ref="viewerRef">
        <div class="viewer-inner" ref="viewerInnerRef">
          <div v-if="pdfReady" class="pages">
            <div
              v-for="n in numPages"
              :key="n"
              class="page-wrap"
              :data-page="n"
              :ref="(el) => setPageWrapRef(n, el)"
            >
              <canvas class="page-canvas" :ref="(el) => setPageCanvasRef(n, el)"></canvas>
            </div>
          </div>
          <div class="viewer-loading" v-else>PDF 로딩 중…</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
  watch
} from 'vue'

import { logger } from '@/utils/logger'

type PdfViewport = {
  width: number
  height: number
}

type PdfPageProxy = {
  rotate?: number
  getViewport(options: { scale: number; rotation: number }): PdfViewport
  render(options: {
    canvasContext: CanvasRenderingContext2D
    viewport: PdfViewport
    transform: [number, number, number, number, number, number]
    annotationMode?: number
  }): PdfRenderTask
}

type PdfDocumentProxy = {
  numPages: number
  getPage(pageNumber: number): Promise<PdfPageProxy>
}

type PdfRenderTask = {
  promise: Promise<void>
  cancel(): void
}

type PdfLoadingTask = {
  promise: Promise<PdfDocumentProxy>
}

type PdfJsRuntime = {
  getDocument(options: {
    url?: string
    data?: ArrayBuffer
    disableAutoFetch: boolean
    disableStream: boolean
    enableXfa: boolean
    isEvalSupported: boolean
    stopAtErrors: boolean
  }): PdfLoadingTask
  GlobalWorkerOptions: {
    workerPort: Worker | null
  }
  AnnotationMode?: {
    DISABLE?: number
  }
}

type PdfRenderError = {
  name?: string
  message?: string
}

let pdfjsLib: PdfJsRuntime | null = null
let pdfWorker: Worker | null = null
let pdfRuntimePromise: Promise<void> | null = null

async function ensurePdfRuntimeLoaded() {
  if (pdfjsLib) return
  if (!pdfRuntimePromise) {
    pdfRuntimePromise = (async () => {
      const [lib, workerModule] = await Promise.all([
        import('pdfjs-dist/build/pdf.mjs'),
        import('pdfjs-dist/build/pdf.worker.mjs?worker')
      ])
      const PdfJsWorker = workerModule.default
      pdfjsLib = lib as unknown as PdfJsRuntime
      pdfWorker = new PdfJsWorker()
      pdfjsLib.GlobalWorkerOptions.workerPort = pdfWorker
    })()
  }
  await pdfRuntimePromise
}

type ZoomMode = 'custom' | 'fitWidth' | 'fitPage'

const props = withDefaults(
  defineProps<{
    src: string | ArrayBuffer
    appTitle?: string
    addressPath?: string
    downloadName?: string
    fullScreen?: boolean
  }>(),
  {
    appTitle: 'BankClear Web Viewer',
    addressPath: '/pdf/webviewer',
    downloadName: 'document.pdf',
    fullScreen: false
  }
)

const appTitle = computed(() => props.appTitle)
const addressPath = computed(() => props.addressPath)

// ✅ pdfDoc는 Vue Proxy로 감싸지면 private field 깨짐
const pdfDoc = shallowRef<PdfDocumentProxy | null>(null)

const numPages = ref(0)
const pageNum = ref(1)
const pageInput = ref(1)

const rotation = ref(0)
const zoomPct = ref(100)
const zoomMode = ref<ZoomMode>('custom')

const pdfReady = computed(() => !!pdfDoc.value && numPages.value > 0)
const showThumbs = ref(true)

const viewerInnerRef = ref<HTMLDivElement | null>(null)
const viewerRef = ref<HTMLElement | null>(null)

const thumbCanvasMap = reactive(new Map<number, HTMLCanvasElement>())
const pageCanvasMap = reactive(new Map<number, HTMLCanvasElement>())
const pageWrapMap = reactive(new Map<number, HTMLDivElement>())

// ✅ 🚨 중요: renderTask는 절대 reactive Map에 넣지 말 것 (cancel이 깨짐)
const pageRenderTaskMap = new Map<number, PdfRenderTask>() // non-reactive
const pageIntersectRatioMap = reactive(new Map<number, number>())
// ✅ 이미 렌더된 조건 캐시(스케일/회전/dpr)
const pageRenderKeyMap = new Map<number, string>()

const zoomSelect = ref<string>('100')
const zoomModeLabel = computed(() => {
  if (zoomMode.value === 'fitWidth') return '폭맞춤'
  if (zoomMode.value === 'fitPage') return '쪽맞춤'
  return '사용자 지정'
})

let resizeObserver: ResizeObserver | null = null
let pageObserver: IntersectionObserver | null = null

let thumbsRendering = false
let thumbsRenderToken = 0

let syncingZoom = false

// ✅ rerender 직렬화: "최신 작업만 실행" 토큰
let rerenderToken = 0

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
function normalizeRotate(deg: number) {
  return ((deg % 360) + 360) % 360
}
function combinedRotation(page: PdfPageProxy) {
  const base = typeof page?.rotate === 'number' ? page.rotate : 0
  return normalizeRotate(base + rotation.value)
}

function px(v: string) {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

function getViewerSize() {
  const viewer = viewerRef.value
  const inner = viewerInnerRef.value
  if (!viewer) return { w: 0, h: 0 }

  let w = (viewer as HTMLElement).clientWidth
  let h = (viewer as HTMLElement).clientHeight

  if (inner) {
    const s = getComputedStyle(inner)
    w -= px(s.paddingLeft) + px(s.paddingRight)
    h -= px(s.paddingTop) + px(s.paddingBottom)
  }

  const wrap = pageWrapMap.get(pageNum.value)
  if (wrap) {
    const ws = getComputedStyle(wrap)
    w -= px(ws.paddingLeft) + px(ws.paddingRight)
    h -= px(ws.paddingTop) + px(ws.paddingBottom)
    w -= px(ws.borderLeftWidth) + px(ws.borderRightWidth)
    h -= px(ws.borderTopWidth) + px(ws.borderBottomWidth)
  }

  // 여유(스크롤바/반올림)
  w -= 8
  h -= 8
  return { w: Math.max(0, w), h: Math.max(0, h) }
}

async function computeScaleForMode(page: PdfPageProxy) {
  const baseViewport = page.getViewport({ scale: 1, rotation: combinedRotation(page) })
  const { w, h } = getViewerSize()
  if (w <= 0 || h <= 0) return zoomPct.value / 100

  const fitPageScale = Math.min(w / baseViewport.width, h / baseViewport.height)

  if (zoomMode.value === 'fitWidth') return w / baseViewport.width
  if (zoomMode.value === 'fitPage') return fitPageScale

  // 100% 기준을 "쪽맞춤"으로 통일
  return fitPageScale * (zoomPct.value / 100)
}

async function syncZoomPctForFit() {
  if (!pdfReady.value) return
  if (zoomMode.value === 'custom') return

  if (zoomMode.value === 'fitPage') {
    syncingZoom = true
    zoomPct.value = 100
    zoomSelect.value = 'fitPage'
    syncingZoom = false
    return
  }

  const page = await getPage(pageNum.value)
  if (!page) return

  const scale = await computeScaleForMode(page)
  const newPct = Math.round(scale * 100)

  syncingZoom = true
  zoomPct.value = newPct
  zoomSelect.value = zoomMode.value === 'fitWidth' ? 'fitWidth' : 'fitPage'
  syncingZoom = false
}

function cancelAllRenderTasks() {
  for (const [, task] of pageRenderTaskMap) {
    try {
      task.cancel()
    } catch (e) {
      logger.warn('[PDF_VIEWER] Render task cancel failed', { error: e })
    }
  }
  pageRenderTaskMap.clear()
}

function cleanupPageObserver() {
  if (pageObserver) {
    pageObserver.disconnect()
    pageObserver = null
  }
  pageIntersectRatioMap.clear()
}

async function loadPdf() {
  try {
    cleanupPageObserver()

    pageCanvasMap.clear()
    pageWrapMap.clear()
    thumbCanvasMap.clear()

    cancelAllRenderTasks()
    pageRenderKeyMap.clear()

    const hasUrl = typeof props.src === 'string' && props.src.trim().length > 0
    const hasData = props.src instanceof ArrayBuffer && props.src.byteLength > 0

    if (!hasUrl && !hasData) {
      pdfDoc.value = null
      numPages.value = 0
      return
    }

    await ensurePdfRuntimeLoaded()

    if (!pdfjsLib) {
      throw new Error('PDF runtime not loaded')
    }

    const task = pdfjsLib.getDocument({
      url: hasUrl ? props.src : undefined,
      data: hasData ? props.src : undefined,
      disableAutoFetch: true,
      disableStream: true,
      enableXfa: false,
      isEvalSupported: false,
      stopAtErrors: true
    })

    const doc = await task.promise
    pdfDoc.value = markRaw(doc)

    numPages.value = doc.numPages
    pageNum.value = 1
    pageInput.value = 1

    zoomMode.value = 'custom'
    zoomPct.value = clamp(zoomPct.value, 10, 400)
    zoomSelect.value = String(Math.round(zoomPct.value))

    await nextTick()
    setupPageObserver()

    // ✅ 초기에는 1페이지 기준으로 근처 렌더
    await nextTick()
    await renderNearPages(pageNum.value, { force: true })

    await nextTick()
    await renderAllThumbs({ force: true })
  } catch (e) {
    logger.error('[PDF_VIEWER] PDF load failed', { error: e })
    pdfDoc.value = null
    numPages.value = 0
  }
}

async function getPage(n: number) {
  if (!pdfDoc.value) return null
  return await pdfDoc.value.getPage(n)
}

// ✅ ref 콜백은 null이 들어올 수 있음: 반드시 delete 처리
function setThumbCanvasRef(page: number, el: unknown) {
  if (el instanceof HTMLCanvasElement) thumbCanvasMap.set(page, el)
  else thumbCanvasMap.delete(page)
}
function setPageCanvasRef(page: number, el: unknown) {
  if (el instanceof HTMLCanvasElement) pageCanvasMap.set(page, el)
  else pageCanvasMap.delete(page)
}
function setPageWrapRef(page: number, el: unknown) {
  if (el instanceof HTMLDivElement) pageWrapMap.set(page, el)
  else pageWrapMap.delete(page)
}

async function waitForAllPageCanvases() {
  for (let i = 0; i < 40; i++) {
    if (pageCanvasMap.size >= numPages.value) return true
    await nextTick()
  }
  logger.warn('[PDF_VIEWER] pageCanvasMap not ready', {
    canvasCount: pageCanvasMap.size,
    numPages: numPages.value
  })
  return false
}

type RenderOpts = { force?: boolean }

async function renderPage(pageNumber: number, opts: RenderOpts = {}) {
  const canvas = pageCanvasMap.get(pageNumber)
  if (!canvas) return

  const page = await getPage(pageNumber)
  if (!page) return

  const dpr = window.devicePixelRatio || 1
  const rot = combinedRotation(page)
  const scale = await computeScaleForMode(page)

  const key = `${scale.toFixed(4)}|${rot}|${dpr}`

  // ✅ 동일 조건이면 재렌더 스킵 (반짝임 제거 핵심)
  if (
    !opts.force &&
    pageRenderKeyMap.get(pageNumber) === key &&
    !pageRenderTaskMap.get(pageNumber)
  ) {
    return
  }

  // 같은 페이지 이전 render task 취소
  const prevTask = pageRenderTaskMap.get(pageNumber)
  if (prevTask) {
    try {
      prevTask.cancel()
    } catch (e) {
      logger.debug('[PDF_VIEWER] Previous render cancel failed', { error: e })
    }
    pageRenderTaskMap.delete(pageNumber)
  }

  const viewport = page.getViewport({ scale, rotation: rot })
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = Math.floor(viewport.width * dpr)
  canvas.height = Math.floor(viewport.height * dpr)
  canvas.style.width = `${Math.floor(viewport.width)}px`
  canvas.style.height = `${Math.floor(viewport.height)}px`

  // ✅ clear는 어쩔 수 없지만, "필요할 때만" render되도록 위에서 막음
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const renderTask = page.render({
    canvasContext: ctx,
    viewport,
    transform: [dpr, 0, 0, dpr, 0, 0],
    annotationMode: pdfjsLib?.AnnotationMode?.DISABLE
  })

  pageRenderTaskMap.set(pageNumber, renderTask)

  try {
    await renderTask.promise
    pageRenderKeyMap.set(pageNumber, key)
  } catch (e: unknown) {
    const renderError = e as PdfRenderError
    const name = renderError?.name || ''
    const msg = String(renderError?.message || '')
    if (name === 'RenderingCancelledException' || msg.includes('Rendering cancelled')) return
    logger.error('[PDF_VIEWER] Page render failed', { error: e, pageNumber })
  } finally {
    if (pageRenderTaskMap.get(pageNumber) === renderTask) {
      pageRenderTaskMap.delete(pageNumber)
    }
  }
}

async function renderNearPages(center: number, opts: RenderOpts = {}) {
  if (!pdfReady.value) return
  if (pageCanvasMap.size === 0) await waitForAllPageCanvases()

  const from = clamp(center - 2, 1, numPages.value)
  const to = clamp(center + 2, 1, numPages.value)

  for (let n = from; n <= to; n++) {
    await renderPage(n, opts)
  }

  await syncZoomPctForFit()
}

async function renderAllPages(opts: RenderOpts = {}) {
  if (!pdfReady.value) return

  cancelAllRenderTasks()

  await nextTick()
  await nextTick()
  const ok = await waitForAllPageCanvases()
  if (!ok) return

  for (let n = 1; n <= numPages.value; n++) {
    await renderPage(n, { force: opts.force ?? true })
  }

  await syncZoomPctForFit()
}

async function renderThumb(pageNumber: number, opts: RenderOpts = {}) {
  const canvas = thumbCanvasMap.get(pageNumber)
  if (!canvas) return

  const page = await getPage(pageNumber)
  if (!page) return

  const dpr = window.devicePixelRatio || 1
  const rot = combinedRotation(page)

  // ✅ 썸네일은 고정 스케일(폭 160) — 스크롤 때마다 다시 그릴 필요 없음
  const targetWidth = 160
  const viewport0 = page.getViewport({ scale: 1, rotation: rot })
  const scale = targetWidth / viewport0.width
  const key = `thumb|${scale.toFixed(4)}|${rot}|${dpr}`

  // ✅ 썸네일도 동일조건이면 스킵
  if (!opts.force && pageRenderKeyMap.get(-pageNumber) === key) return

  const viewport = page.getViewport({ scale, rotation: rot })
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = Math.floor(viewport.width * dpr)
  canvas.height = Math.floor(viewport.height * dpr)
  canvas.style.width = `${Math.floor(viewport.width)}px`
  canvas.style.height = `${Math.floor(viewport.height)}px`

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const task = page.render({
    canvasContext: ctx,
    viewport,
    transform: [dpr, 0, 0, dpr, 0, 0],
    annotationMode: pdfjsLib?.AnnotationMode?.DISABLE
  })

  try {
    await task.promise
    // ✅ 썸네일 키는 -pageNumber로 저장(본문 키와 충돌 방지)
    pageRenderKeyMap.set(-pageNumber, key)
  } catch (e: unknown) {
    const renderError = e as PdfRenderError
    const name = renderError?.name || ''
    const msg = String(renderError?.message || '')
    if (name === 'RenderingCancelledException' || msg.includes('Rendering cancelled')) return
    logger.error('[PDF_VIEWER] Thumbnail render failed', { error: e, pageNumber })
  }
}

async function renderAllThumbs(opts: RenderOpts = {}) {
  if (!pdfReady.value) return
  if (thumbsRendering) return

  thumbsRendering = true
  const token = ++thumbsRenderToken

  try {
    for (let n = 1; n <= numPages.value; n++) {
      if (token !== thumbsRenderToken) return
      if (thumbCanvasMap.get(n)) await renderThumb(n, opts)
    }
  } finally {
    if (token === thumbsRenderToken) thumbsRendering = false
  }
}

function setupPageObserver() {
  cleanupPageObserver()

  const rootEl = viewerRef.value
  if (!rootEl) return

  pageObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const target = e.target as HTMLElement
        const pageStr = target.dataset.page
        const p = pageStr ? Number(pageStr) : NaN
        if (Number.isNaN(p)) continue
        pageIntersectRatioMap.set(p, e.isIntersecting ? e.intersectionRatio : 0)
      }

      let bestPage = pageNum.value
      let bestRatio = -1

      for (const [p, r] of pageIntersectRatioMap) {
        if (r > bestRatio) {
          bestRatio = r
          bestPage = p
        }
      }

      // ✅ 스크롤로 현재페이지 바뀔 때는 "렌더" 하지 않음 (반짝임 방지)
      if (bestRatio >= 0.12 && bestPage !== pageNum.value) {
        pageNum.value = bestPage
        pageInput.value = bestPage

        // 주변 페이지가 아직 한 번도 안 그려진 경우만 최소 렌더(첫 진입)
        queueRerender(
          async () => {
            await renderNearPages(bestPage, { force: false })
          },
          { renderThumbs: false }
        )
      }
    },
    {
      root: rootEl,
      threshold: [0.05, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8],
      rootMargin: '-25% 0px -55% 0px'
    }
  )

  nextTick(() => {
    for (let n = 1; n <= numPages.value; n++) {
      const el = pageWrapMap.get(n)
      if (el) pageObserver?.observe(el)
    }
  })
}

function scrollToPage(n: number) {
  const page = clamp(n, 1, numPages.value || 1)
  const el = pageWrapMap.get(page)
  if (!el) return

  pageNum.value = page
  pageInput.value = page

  el.scrollIntoView({ block: 'start' })

  // 클릭/입력 이동은 "근처만" 렌더(이미 그려진건 키로 스킵)
  queueRerender(
    async () => {
      await renderNearPages(page, { force: false })
    },
    { renderThumbs: false }
  )
}

function setPage(n: number) {
  scrollToPage(n)
}
function goPrev() {
  if (pageNum.value > 1) scrollToPage(pageNum.value - 1)
}
function goNext() {
  if (pageNum.value < numPages.value) scrollToPage(pageNum.value + 1)
}
function applyPageInput() {
  scrollToPage(pageInput.value)
}

function toggleThumbs() {
  showThumbs.value = !showThumbs.value
  // 패널 토글은 레이아웃 폭이 바뀌므로 fit 모드면 전체 재렌더 필요
  if (zoomMode.value === 'fitWidth' || zoomMode.value === 'fitPage') {
    queueRerender(async () => {
      pageRenderKeyMap.clear()
      await renderAllPages({ force: true })
      // 썸네일은 스케일 고정이라 굳이 전체 강제 필요 X
    })
  }
}

function setZoomCustom(pct: number) {
  zoomMode.value = 'custom'
  zoomPct.value = clamp(pct, 10, 400)
  zoomSelect.value = String(Math.round(zoomPct.value))
}

async function setZoomFromFitPagePercent(targetPct: number) {
  setZoomCustom(targetPct)
}

async function zoomIn() {
  if (zoomMode.value === 'fitPage') {
    await setZoomFromFitPagePercent(110)
    return
  }
  setZoomCustom(zoomPct.value + 10)
}
async function zoomOut() {
  if (zoomMode.value === 'fitPage') {
    await setZoomFromFitPagePercent(90)
    return
  }
  setZoomCustom(zoomPct.value - 10)
}

async function applyZoomSelect() {
  const v = zoomSelect.value
  if (v === 'fitWidth') {
    zoomMode.value = 'fitWidth'
    zoomSelect.value = 'fitWidth'
  } else if (v === 'fitPage') {
    zoomMode.value = 'fitPage'
    zoomSelect.value = 'fitPage'
  } else {
    const pct = Number(v)
    if (!Number.isNaN(pct)) {
      if (zoomMode.value === 'fitPage') {
        await setZoomFromFitPagePercent(pct)
      } else {
        setZoomCustom(pct)
      }
    }
  }
}

function rotateRight() {
  rotation.value = normalizeRotate(rotation.value + 90)
}

async function handleDownload() {
  try {
    let blob: Blob
    if (typeof props.src === 'string') {
      const res = await fetch(props.src)
      blob = await res.blob()
    } else {
      blob = new Blob([props.src], { type: 'application/pdf' })
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = props.downloadName || 'document.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (e) {
    logger.error('[PDF_VIEWER] Download failed', { error: e })
  }
}

type QueueOpts = { renderThumbs?: boolean }

// ✅ 최신 job만 실행(토큰) + 썸네일 재렌더는 기본적으로 안 함(반짝임 방지)
function queueRerender(job: () => Promise<void>, opts: QueueOpts = {}) {
  const myToken = ++rerenderToken
  const renderThumbs = opts.renderThumbs ?? false

  ;(async () => {
    await nextTick()
    if (myToken !== rerenderToken) return

    await job()
    if (myToken !== rerenderToken) return

    // ✅ 썸네일은 "줌/회전 변화"에서만 별도로 호출할 것
    if (renderThumbs) {
      await nextTick()
      await renderAllThumbs({ force: false })
    }
  })().catch((e) => logger.error('[PDF_VIEWER] Rerender queue failed', { error: e }))
}

function setFitWidth() {
  zoomMode.value = 'fitWidth'
  zoomSelect.value = 'fitWidth'
  queueRerender(
    async () => {
      // ✅ fit은 스케일이 바뀌므로 본문 전체 키 초기화 후 전체 재렌더
      pageRenderKeyMap.clear()
      await renderAllPages({ force: true })
    },
    { renderThumbs: true }
  )
}

function setFitPage() {
  zoomMode.value = 'fitPage'
  zoomSelect.value = 'fitPage'
  queueRerender(
    async () => {
      pageRenderKeyMap.clear()
      await renderAllPages({ force: true })
    },
    { renderThumbs: true }
  )
}

watch(
  () => props.src,
  async () => {
    await loadPdf()
  }
)

// custom zoom일 때만 본문 재렌더(스크롤 중 반짝임 방지)
watch(
  () => zoomPct.value,
  async () => {
    if (!pdfReady.value) return
    if (syncingZoom) return
    if (zoomMode.value !== 'custom') return

    queueRerender(
      async () => {
        pageRenderKeyMap.clear()
        cancelAllRenderTasks()
        await nextTick()
        await renderNearPages(pageNum.value, { force: true })
      },
      { renderThumbs: true }
    )
  }
)

watch([zoomMode, rotation], async () => {
  if (!pdfReady.value) return
  if (syncingZoom) return

  queueRerender(
    async () => {
      pageRenderKeyMap.clear()

      if (zoomMode.value === 'fitWidth' || zoomMode.value === 'fitPage') {
        await renderAllPages({ force: true })
      } else {
        cancelAllRenderTasks()
        await nextTick()
        await renderNearPages(pageNum.value, { force: true })
      }
    },
    { renderThumbs: true }
  )
})

onMounted(async () => {
  await loadPdf()

  if (viewerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (!pdfReady.value) return
      if (zoomMode.value === 'fitWidth' || zoomMode.value === 'fitPage') {
        queueRerender(
          async () => {
            pageRenderKeyMap.clear()
            await renderAllPages({ force: true })
          },
          { renderThumbs: false }
        )
      }
    })
    resizeObserver.observe(viewerRef.value)
  }
})

onBeforeUnmount(() => {
  cleanupPageObserver()

  if (resizeObserver && viewerRef.value) {
    resizeObserver.unobserve(viewerRef.value)
  }
  resizeObserver = null

  cancelAllRenderTasks()
  pdfWorker?.terminate()
  pdfWorker = null
})
</script>

<style lang="scss" scoped>
.pdf-viewer-root {
  width: 100%;
  height: 100%;
  min-width: 1024px;
  min-height: 768px;
  max-width: 1400px;
  max-height: 1050px;

  margin: 0 auto;

  display: flex;
  flex-direction: column;

  border: 1px solid #ddd;
  background: #f7f7f7;
}

.pdf-viewer-root.is-fullscreen {
  min-width: 0;
  min-height: 0;
  max-width: none;
  max-height: none;
  width: 100%;
  height: 100%;
}

/* 1. 인터넷창 헤더 영역 */
.browser-header {
  height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;

  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;

  .browser-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 220px;

    .favicon {
      width: 14px;
      height: 14px;
      border-radius: 3px;
      background: #555;
    }

    .app-title {
      font-weight: 700;
      font-size: 14px;
      color: #222;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .address-bar {
    flex: 1;
    height: 28px;
    display: flex;
    align-items: center;
    padding: 0 10px;

    border: 1px solid #e1e1e1;
    border-radius: 14px;
    background: #fafafa;

    color: #444;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .browser-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

/* 2. 웹뷰어 상단 GNB */
.gnb {
  height: 48px;
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  align-items: center;

  padding: 0 10px;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;

  .gnb-left,
  .gnb-center,
  .gnb-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .gnb-center {
    justify-content: center;
    gap: 10px;
  }

  .gnb-right {
    justify-content: flex-end;
  }

  .page-indicator {
    display: flex;
    align-items: center;
    gap: 6px;

    .page-input {
      width: 64px;
      height: 30px;
      border: 1px solid #e1e1e1;
      border-radius: 6px;
      padding: 0 8px;
      font-size: 13px;
      background: #fff;
    }

    .page-total {
      font-size: 13px;
      color: #555;
    }
  }

  .zoom-group {
    display: flex;
    align-items: center;
    gap: 6px;

    .zoom-label {
      min-width: 56px;
      text-align: center;
      font-size: 13px;
      color: #333;
    }
  }

  .zoom-select {
    height: 32px;
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    padding: 0 8px;
    background: #fff;
    font-size: 13px;
  }

  .fit-group {
    display: flex;
    gap: 6px;
  }

  .icon-btn.active {
    background: #222;
    color: #fff;
    border-color: #222;
  }
}

.icon-btn {
  height: 32px;
  border: 1px solid #e1e1e1;
  background: #fff;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 13px;
  color: #222;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .btn-text {
    font-size: 12px;
    color: #333;
  }
}

/* 본문 레이아웃 */
.body {
  flex: 1;
  min-height: 0;
  display: flex;
  background: #f2f2f2;
}

/* 3. 썸네일 영역 */
.thumbs {
  width: 220px;
  border-right: 1px solid #e5e5e5;
  background: #f7f7f7;
  overflow: hidden;

  .thumbs-inner {
    height: 100%;
    overflow: auto;
    padding: 10px;
    display: grid;
    gap: 10px;
  }

  .thumb-item {
    width: 100%;
    border: 2px solid transparent;
    border-radius: 8px;
    background: #fff;
    padding: 10px;
    cursor: pointer;
    text-align: center;
    max-height: fit-content;

    transition:
      border-color 140ms ease,
      box-shadow 140ms ease,
      transform 140ms ease;

    &.active {
      border-color: #ff2d55;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
      transform: translateY(-1px);
    }

    .thumb-canvas {
      display: block;
      margin: 0 auto;
      border-radius: 6px;
      background: #fff;
    }

    .thumb-page {
      margin-top: 8px;
      font-size: 12px;
      color: #555;
    }
  }

  .thumb-loading {
    font-size: 13px;
    color: #666;
    padding: 10px;
  }
}

/* 4. 문서보기 영역 */
.viewer {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  scroll-behavior: auto; /* ✅ 혹시 전역 smooth가 있어도 여기선 즉시 */

  .viewer-inner {
    min-height: 100%;
    padding: 18px;
  }

  .pages {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  /* ✅ 각 페이지 카드: transition + 기본 border 유지 */
  .page-wrap {
    background: #fff;
    border-radius: 10px;
    // padding: 14px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);

    border: 2px solid transparent;

    transition:
      border-color 160ms ease,
      box-shadow 160ms ease,
      transform 160ms ease;
    will-change: border-color, box-shadow, transform;
  }

  .page-canvas {
    display: block;
    background: #fff;
  }

  .viewer-loading {
    font-size: 14px;
    color: #666;
  }
}

@media (prefers-reduced-motion: reduce) {
  .thumb-item,
  .viewer .page-wrap {
    transition: none !important;
  }
}
</style>
