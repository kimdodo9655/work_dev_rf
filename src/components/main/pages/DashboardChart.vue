<script setup lang="ts">
import {
  Chart,
  type ChartData,
  type ChartDataset,
  type ChartOptions,
  registerables
} from 'chart.js'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

Chart.register(...registerables)

interface RawData {
  date: string
  value: number
  line1: number
  line2: number
}

const DAYS_PER_PAGE = 7
const SWIPE_THRESHOLD = 30 // ✅ 이 px 이상 움직이면 전환

const chartRef = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart<'bar', (number | null)[], string> | null>(null)

const startIndex = ref(0)

const allChartData = ref<RawData[]>([
  { date: '1/6', value: 5, line1: 3, line2: 2 },
  { date: '1/7', value: 5, line1: 2, line2: 3 },
  { date: '1/8', value: 5, line1: 4, line2: 1 },
  { date: '1/9', value: 5, line1: 3, line2: 2 },
  { date: '1/10', value: 6, line1: 2, line2: 4 },
  { date: '1/11', value: 5, line1: 3, line2: 2 },
  { date: '1/12', value: 7, line1: 4, line2: 3 },
  { date: '1/13', value: 4, line1: 2, line2: 2 },
  { date: '1/14', value: 7, line1: 3, line2: 4 },
  { date: '1/15', value: 5, line1: 4, line2: 1 },
  { date: '1/16', value: 5, line1: 2, line2: 3 },
  { date: '1/17', value: 5, line1: 3, line2: 2 },
  { date: '1/18', value: 8, line1: 4, line2: 4 },
  { date: '1/19', value: 4, line1: 3, line2: 1 },
  { date: '1/20', value: 5, line1: 2, line2: 3 },
  { date: '1/21', value: 5, line1: 3, line2: 2 },
  { date: '1/22', value: 8, line1: 4, line2: 4 },
  { date: '1/23', value: 3, line1: 2, line2: 1 },
  { date: '1/24', value: 6, line1: 3, line2: 3 },
  { date: '1/25', value: 6, line1: 4, line2: 2 },
  { date: '1/26', value: 7, line1: 3, line2: 4 },
  { date: '1/27', value: 3, line1: 2, line2: 1 },
  { date: '1/28', value: 7, line1: 4, line2: 3 },
  { date: '1/29', value: 5, line1: 3, line2: 2 },
  { date: '1/30', value: 6, line1: 2, line2: 4 },
  { date: '1/31', value: 5, line1: 4, line2: 1 },
  { date: '2/1', value: 6, line1: 3, line2: 3 },
  { date: '2/2', value: 4, line1: 2, line2: 2 },
  { date: '2/3', value: 8, line1: 4, line2: 4 },
  { date: '2/4', value: 4, line1: 3, line2: 1 }
])

const maxIndex = computed(() => Math.max(0, allChartData.value.length - DAYS_PER_PAGE))
const canGoPrev = computed(() => startIndex.value > 0)
const canGoNext = computed(() => startIndex.value < maxIndex.value)

const getSliceFixed = () => {
  const page = allChartData.value.slice(startIndex.value, startIndex.value + DAYS_PER_PAGE)

  const labels = Array.from({ length: DAYS_PER_PAGE }, (_, i) => page[i]?.date ?? '')
  const barData = Array.from({ length: DAYS_PER_PAGE }, (_, i) => page[i]?.value ?? null)
  const line1Data = Array.from({ length: DAYS_PER_PAGE }, (_, i) => page[i]?.line1 ?? null)
  const line2Data = Array.from({ length: DAYS_PER_PAGE }, (_, i) => page[i]?.line2 ?? null)

  return { labels, barData, line1Data, line2Data }
}

const destroyChart = () => {
  chartInstance.value?.destroy()
  chartInstance.value = null
}

type MixedDataset = ChartDataset<'bar', (number | null)[]> | ChartDataset<'line', (number | null)[]>

const rebuildChart = () => {
  if (!chartRef.value) return
  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  destroyChart()

  const { labels, barData, line1Data, line2Data } = getSliceFixed()

  const datasets: MixedDataset[] = [
    {
      type: 'bar',
      label: '막대',
      data: barData,
      backgroundColor: '#3DB5C8',
      borderColor: '#3DB5C8',
      borderWidth: 1,
      barPercentage: 0.5,
      categoryPercentage: 0.7,
      order: 2
    },
    {
      type: 'line',
      label: '선 1',
      data: line1Data,
      borderColor: '#F5B342',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#F5B342',
      tension: 0,
      spanGaps: false,
      order: 1
    },
    {
      type: 'line',
      label: '선 2',
      data: line2Data,
      borderColor: '#E85D75',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#E85D75',
      tension: 0,
      spanGaps: false,
      order: 1
    }
  ]

  const data: ChartData<'bar', (number | null)[], string> = {
    labels,
    datasets: datasets as unknown as ChartData<'bar', (number | null)[], string>['datasets']
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,

    interaction: {
      mode: 'index',
      intersect: false
    },

    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        itemSort: (a, b) => {
          const order: Record<string, number> = { 막대: 0, '선 1': 1, '선 2': 2 }
          return (order[a.dataset.label ?? ''] ?? 99) - (order[b.dataset.label ?? ''] ?? 99)
        },
        filter: (ctx) => ctx.parsed?.y !== null
      }
    },

    scales: {
      x: {
        grid: { display: false },
        ticks: {
          callback: (_value, index) => (labels[index] ? labels[index] : '')
        }
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  }

  chartInstance.value = new Chart(ctx, { type: 'bar', data, options })
}

// ===== 버튼 이동 =====
const goPrev = () => {
  if (!canGoPrev.value) return
  startIndex.value -= 1
  rebuildChart()
}

const goNext = () => {
  if (!canGoNext.value) return
  startIndex.value += 1
  rebuildChart()
}

// ===== 드래그/스와이프 (✅ 여러 칸 연속 이동) =====
const isDragging = ref(false)
const dragStartX = ref(0)

const setChartEventsEnabled = (enabled: boolean) => {
  const c = chartInstance.value
  if (!c) return
  // tooltip/hover 이벤트를 잠깐 꺼서 드래그 중 말풍선이 방해 안 하게
  c.options.events = enabled ? undefined : []
  c.update('none')
}

const beginDrag = (clientX: number) => {
  isDragging.value = true
  dragStartX.value = clientX
  setChartEventsEnabled(false)
}

const moveDrag = (clientX: number) => {
  if (!isDragging.value) return

  let dx = clientX - dragStartX.value

  // ✅ 임계값을 넘긴 "횟수만큼" 연속 이동
  while (Math.abs(dx) >= SWIPE_THRESHOLD) {
    if (dx > 0) {
      // 오른쪽으로 드래그(이전)
      if (!canGoPrev.value) break
      goPrev()
      // 기준점을 임계값만큼 따라오게 갱신
      dragStartX.value += SWIPE_THRESHOLD
    } else {
      // 왼쪽으로 드래그(다음)
      if (!canGoNext.value) break
      goNext()
      dragStartX.value -= SWIPE_THRESHOLD
    }

    dx = clientX - dragStartX.value
  }
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  setChartEventsEnabled(true)
}

// Pointer Events (PC + 모바일 대부분 커버)
const onPointerDown = (e: PointerEvent) => {
  // 좌클릭/터치만
  if (e.pointerType === 'mouse' && e.button !== 0) return
  e.preventDefault()
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  beginDrag(e.clientX)
}

const onPointerMove = (e: PointerEvent) => {
  moveDrag(e.clientX)
}

const onPointerUp = () => {
  endDrag()
}

onMounted(() => {
  rebuildChart()

  // 캔버스에 직접 이벤트 바인딩
  const el = chartRef.value
  if (!el) return

  el.addEventListener('pointerdown', onPointerDown)
  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('pointerup', onPointerUp)
  el.addEventListener('pointercancel', onPointerUp)
  el.addEventListener('pointerleave', onPointerUp)
})

onBeforeUnmount(() => {
  const el = chartRef.value
  if (el) {
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerUp)
    el.removeEventListener('pointerleave', onPointerUp)
  }
  destroyChart()
})
</script>

<template>
  <div class="chart-wrapper">
    <button class="nav-btn" :disabled="!canGoPrev" @click="goPrev">◀</button>

    <div class="chart-container">
      <canvas ref="chartRef"></canvas>
    </div>

    <button class="nav-btn" :disabled="!canGoNext" @click="goNext">▶</button>
  </div>
</template>

<style scoped>
.chart-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 300px;
  width: 100%;
}

.chart-container {
  flex: 1;
  height: 100%;
  position: relative;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;

  /* ✅ 모바일에서 스와이프가 브라우저 스크롤로 먹히는 것 방지 */
  touch-action: pan-y;
  cursor: grab;
}

canvas:active {
  cursor: grabbing;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
