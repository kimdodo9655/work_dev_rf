<template>
  <div class="pdf-wrapper" ref="wrapperRef" :style="{ height: `${wrapperHeight}px` }">
    <div class="content" :style="{ transform: `scale(${scale})` }">
      <!-- 첫 번째 페이지 -->
      <div class="page">
        <h2>A4 비율 테스트 - 페이지 1 (210mm × 297mm)</h2>
        <p>Scale: {{ scale.toFixed(3) }} / Container Width: {{ containerWidth }}px</p>

        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>설명</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 25" :key="i">
              <td>{{ i }}</td>
              <td>항목 {{ i }}</td>
              <td>이것은 테스트 데이터입니다. A4 용지 비율을 확인하기 위한 샘플입니다.</td>
              <td>완료</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>페이지 1 하단</p>
        </div>
      </div>

      <!-- 두 번째 페이지 -->
      <div class="page">
        <h2>A4 비율 테스트 - 페이지 2 (210mm × 297mm)</h2>
        <p>두 번째 페이지입니다.</p>

        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>설명</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 25" :key="`page2-${i}`">
              <td>{{ i + 25 }}</td>
              <td>항목 {{ i + 25 }}</td>
              <td>두 번째 페이지의 테스트 데이터입니다.</td>
              <td>진행중</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>페이지 2 하단</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MM_TO_PX = 3.7795275591 // 96 DPI 기준
const PAGE_GAP_PX = 10

const wrapperRef = ref<HTMLElement>()
const containerWidth = ref(0)

const scale = computed(() => {
  if (!containerWidth.value || containerWidth.value <= 0) return 1
  return containerWidth.value / (A4_WIDTH_MM * MM_TO_PX)
})

const wrapperHeight = computed(() => {
  // 2페이지 높이 + 페이지 간격
  return (A4_HEIGHT_MM * MM_TO_PX * 2 + PAGE_GAP_PX) * scale.value
})

function updateSize() {
  if (!wrapperRef.value) return

  // wrapper의 실제 렌더링된 너비 사용
  const width = wrapperRef.value.offsetWidth

  if (width > 0) {
    containerWidth.value = width
    console.log('PdfTester containerWidth:', containerWidth.value)
  } else {
    // 렌더링이 완료되지 않았으면 재시도
    setTimeout(updateSize, 50)
  }
}

onMounted(() => {
  // 약간의 지연 후 크기 계산
  setTimeout(updateSize, 100)
})
</script>

<style lang="scss" scoped>
.pdf-wrapper {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.content {
  width: 210mm;
  box-sizing: border-box;
  transform-origin: top left;
}

.page {
  width: 210mm;
  min-height: 297mm;
  box-sizing: border-box;
  background: white;
  padding: 40px;
  font-size: 14px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }

  h2 {
    margin: 0 0 10px;
    font-size: 20px;
  }

  p {
    margin: 0 0 20px;
    color: #666;
  }
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #fafafa;
  }
}

.footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #333;
  text-align: center;

  p {
    margin: 0;
    color: #999;
  }
}
</style>
