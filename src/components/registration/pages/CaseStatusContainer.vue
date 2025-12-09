<script setup lang="ts">
import { computed, ref } from 'vue'

// 타입 정의
interface Column {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface RegistrationData {
  rowNum: number
  registryRequestNumber: string
  workType: string
  assignmentType: string
  registryMethod: string | null
  propertyAddress: string | null
  registryRequestDate: string
  registryReceiptDate: string
  managerUserId: number | null
  managerUserName: string | null
  progressStatus: string
}

interface ApiResponse {
  status: number
  code: string
  title: string
  message: string
  data: {
    content: RegistrationData[]
    pageable: {
      pageNumber: number
      pageSize: number
      sort: {
        sorted: boolean
        unsorted: boolean
        empty: boolean
      }
      offset: number
      paged: boolean
      unpaged: boolean
    }
    totalElements: number
    totalPages: number
    last: boolean
    numberOfElements: number
    first: boolean
    size: number
    number: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    empty: boolean
  }
}

// 컬럼 정의 (API 필드명에 맞춤)
const columns: Column[] = [
  { key: 'rowNum', label: '번호', width: '70px', align: 'center' },
  { key: 'registryRequestNumber', label: '등기신청번호', width: '150px' },
  { key: 'workType', label: '업무구분', width: '100px', align: 'center' },
  { key: 'assignmentType', label: '배정업무', width: '80px', align: 'center' },
  { key: 'registryMethod', label: '등기방식', width: '100px', align: 'center' },
  { key: 'propertyAddress', label: '부동산표시', width: '300px' },
  { key: 'registryRequestDate', label: '등기의뢰일자', width: '120px', align: 'center' },
  { key: 'registryReceiptDate', label: '등기접수일자', width: '120px', align: 'center' },
  { key: 'managerUserName', label: '업무담당자', width: '180px' },
  { key: 'progressStatus', label: '진행상태', width: '150px' }
]

// 담당자 목록 (실제로는 API에서 가져와야 함)
const managerOptions = ['홍길동', '김영희', '박철수', '이민수', '최지영']

// Mock API 데이터 생성 함수
const generateMockApiResponse = (count: number): ApiResponse => {
  const baseContent: RegistrationData[] = [
    {
      rowNum: 1,
      registryRequestNumber: 'BC20251203000001',
      workType: 'ESTABLISHMENT',
      assignmentType: '설정',
      registryMethod: 'ELECTRONIC',
      propertyAddress: '서울특별시 강남구 테헤란로 123, 456호',
      registryRequestDate: '2024-12-01',
      registryReceiptDate: '2024-12-02',
      managerUserId: null,
      managerUserName: null,
      progressStatus: 'ASSIGN_MANAGER'
    },
    {
      rowNum: 2,
      registryRequestNumber: 'BC20251203000002',
      workType: 'TRANSFER_ESTABLISHMENT',
      assignmentType: '이전+설정',
      registryMethod: 'PAPER',
      propertyAddress: '서울특별시 서초구 서초대로 789',
      registryRequestDate: '2024-12-01',
      registryReceiptDate: '2024-12-03',
      managerUserId: 14,
      managerUserName: '김영희',
      progressStatus: 'REGISTRY_REQUEST'
    },
    {
      rowNum: 3,
      registryRequestNumber: 'BC20251203000003',
      workType: 'ESTABLISHMENT',
      assignmentType: '설정',
      registryMethod: 'E_FORM',
      propertyAddress: '경기도 성남시 분당구 정자동 101-5',
      registryRequestDate: '2024-12-02',
      registryReceiptDate: '2024-12-04',
      managerUserId: 15,
      managerUserName: '박철수',
      progressStatus: 'CUSTOMER_E_SIGN'
    }
  ]

  if (count <= 3) {
    const content = baseContent.slice(0, count)
    return {
      status: 200,
      code: 'S_OK',
      title: '요청 성공',
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        content,
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: { sorted: true, unsorted: false, empty: false },
          offset: 0,
          paged: true,
          unpaged: false
        },
        totalElements: count,
        totalPages: Math.ceil(count / 10),
        last: true,
        numberOfElements: count,
        first: true,
        size: 10,
        number: 0,
        sort: { sorted: true, unsorted: false, empty: false },
        empty: count === 0
      }
    }
  }

  const additionalContent = Array.from({ length: count - 3 }, (_, i): RegistrationData => {
    const idx = i + 4
    return {
      rowNum: idx,
      registryRequestNumber: `BC${20251203000000 + idx}`,
      workType: 'ESTABLISHMENT',
      assignmentType: '설정',
      registryMethod: null,
      propertyAddress: null,
      registryRequestDate: '2024-12-03',
      registryReceiptDate: '2024-12-03',
      managerUserId: null,
      managerUserName: null,
      progressStatus: 'ASSIGN_MANAGER'
    }
  })

  const content = [...baseContent, ...additionalContent]

  return {
    status: 200,
    code: 'S_OK',
    title: '요청 성공',
    message: '요청이 성공적으로 처리되었습니다.',
    data: {
      content,
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: { sorted: true, unsorted: false, empty: false },
        offset: 0,
        paged: true,
        unpaged: false
      },
      totalElements: count,
      totalPages: Math.ceil(count / 10),
      last: count <= 10,
      numberOfElements: Math.min(count, 10),
      first: true,
      size: 10,
      number: 0,
      sort: { sorted: true, unsorted: false, empty: false },
      empty: count === 0
    }
  }
}

// 테스트용 데이터 개수 조절
const dataCount = ref(220)
const apiResponse = computed(() => generateMockApiResponse(dataCount.value))
const allData = computed(() => apiResponse.value.data.content)

// 페이지네이션 상태
const currentPage = ref(1)
const itemsPerPage = 10

// 전체 페이지 수 계산
const totalPages = computed(() => Math.ceil(allData.value.length / itemsPerPage))

// 현재 페이지 데이터
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allData.value.slice(start, end)
})

// 빈 행 개수 계산
const emptyRows = computed(() => {
  if (allData.value.length === 0) return 0
  const current = paginatedData.value.length
  return current < itemsPerPage ? itemsPerPage - current : 0
})

// 보이는 페이지 계산
const visiblePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const pages: (number | string)[] = []

  if (total <= 9) {
    // 전체 페이지가 9개 이하면 모두 표시
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else if (current <= 5) {
    // 현재 페이지가 1~5: [1][2][3][4][5][6][7]---[마지막]
    for (let i = 1; i <= 7; i++) {
      pages.push(i)
    }
    pages.push('ellipsis-end')
    pages.push(total)
  } else if (current >= total - 4) {
    // 현재 페이지가 마지막-4 ~ 마지막: [1]---[마지막-6][마지막-5][마지막-4][마지막-3][마지막-2][마지막-1][마지막]
    pages.push(1)
    pages.push('ellipsis-start')
    for (let i = total - 6; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 중간 페이지: [1]---[현재-3][현재-2][현재-1][현재][현재+1][현재+2][현재+3]---[마지막]
    pages.push(1)
    pages.push('ellipsis-start')
    for (let i = current - 3; i <= current + 3; i++) {
      pages.push(i)
    }
    pages.push('ellipsis-end')
    pages.push(total)
  }

  return pages
})

// 페이지 변경
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 업무담당자 표시 타입 결정 로직
const getManagerDisplayType = (row: RegistrationData) => {
  if (!row.managerUserName) {
    return 'button'
  }

  if (
    row.progressStatus === 'CUSTOMER_E_SIGN' ||
    row.progressStatus === 'SUBMIT_COMPLETION_DOCUMENTS'
  ) {
    return 'text'
  }

  return 'select'
}

// 행 클릭 핸들러
const handleRowClick = (row: RegistrationData) => {
  console.log('행 클릭:', row.registryRequestNumber)
  // TODO: 상세 페이지로 이동
  // router.push(`/registry/detail/${row.registryRequestNumber}`)
}

// 이벤트 핸들러
const handleAssignManager = (event: Event, row: RegistrationData) => {
  event.stopPropagation() // 행 클릭 이벤트 전파 방지
  console.log('담당자 배정 버튼 클릭:', row.registryRequestNumber)
  // TODO: 담당자 배정 모달 열기
}

const handleManagerChange = (event: Event, row: RegistrationData, newManager: string) => {
  event.stopPropagation() // 행 클릭 이벤트 전파 방지
  console.log('담당자 변경:', row.registryRequestNumber, '→', newManager)
  // TODO: API 호출하여 담당자 변경
}

// 일반 셀 값 가져오기
const getCellValue = (row: RegistrationData, key: string): string => {
  const value = row[key as keyof RegistrationData]
  if (value === null || value === undefined) return '-'
  return String(value)
}

// 데이터 개수 변경 함수
const setDataCount = (count: number) => {
  dataCount.value = count
  currentPage.value = 1
}
</script>

<template>
  <div>
    <!-- 데이터 개수 조절 패널 -->
    <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px">
      <h3 style="margin-top: 0">테스트 패널 (Mock API)</h3>
      <div style="margin-bottom: 10px">
        <label
          >데이터 개수:
          <input
            type="number"
            v-model.number="dataCount"
            min="0"
            style="width: 100px; padding: 5px"
        /></label>
        <span style="margin-left: 10px"
          >현재: <strong>{{ dataCount }}</strong
          >개</span
        >
      </div>
      <div>
        <button @click="setDataCount(0)" style="margin: 2px; padding: 5px 10px">0개</button>
        <button @click="setDataCount(3)" style="margin: 2px; padding: 5px 10px">3개</button>
        <button @click="setDataCount(5)" style="margin: 2px; padding: 5px 10px">5개</button>
        <button @click="setDataCount(10)" style="margin: 2px; padding: 5px 10px">10개</button>
        <button @click="setDataCount(15)" style="margin: 2px; padding: 5px 10px">15개</button>
        <button @click="setDataCount(50)" style="margin: 2px; padding: 5px 10px">50개</button>
        <button @click="setDataCount(100)" style="margin: 2px; padding: 5px 10px">100개</button>
        <button @click="setDataCount(220)" style="margin: 2px; padding: 5px 10px">
          220개 (22페이지)
        </button>
      </div>
      <div style="margin-top: 10px; font-size: 12px; color: #666">
        💡 1번: 버튼 / 2번: 셀렉트 / 3번: 텍스트 (완료 상태) | 행 클릭 시 상세 페이지 이동
      </div>
    </div>

    <div class="table-area">
      <!-- 총 개수 표시 -->
      <div style="text-align: right; margin-bottom: 10px">
        총 <strong>{{ apiResponse.data.totalElements }}</strong
        >건
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ width: col.width, textAlign: col.align || 'left' }"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- 데이터가 없을 때 -->
          <template v-if="allData.length === 0">
            <tr class="empty-row">
              <td
                :colspan="columns.length"
                :style="{
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  color: '#999',
                  fontSize: '16px'
                }"
              >
                <i class="fi fi-ss-problem-solving"></i>
                조회된 데이터가 없습니다.
              </td>
            </tr>
          </template>

          <!-- 데이터가 있을 때 -->
          <template v-else>
            <!-- 실제 데이터 행 -->
            <tr
              v-for="row in paginatedData"
              :key="row.rowNum"
              class="data-row"
              @click="handleRowClick(row)"
            >
              <td v-for="col in columns" :key="col.key" :style="{ textAlign: col.align || 'left' }">
                <!-- 업무담당자 컬럼 특수 처리 -->
                <template v-if="col.key === 'managerUserName'">
                  <!-- 버튼: 담당자 미배정 -->
                  <button
                    v-if="getManagerDisplayType(row) === 'button'"
                    @click="(e) => handleAssignManager(e, row)"
                    class="assign-button"
                  >
                    담당자 배정
                  </button>

                  <!-- 셀렉트: 담당자 변경 가능 -->
                  <select
                    v-else-if="getManagerDisplayType(row) === 'select'"
                    :value="row.managerUserName || ''"
                    @click.stop
                    @change="
                      (e) => handleManagerChange(e, row, (e.target as HTMLSelectElement).value)
                    "
                    class="manager-select"
                  >
                    <option v-for="manager in managerOptions" :key="manager" :value="manager">
                      {{ manager }}
                    </option>
                  </select>

                  <!-- 텍스트: 변경 불가 (완료 상태) -->
                  <span v-else>
                    {{ row.managerUserName || '-' }}
                  </span>
                </template>

                <!-- 일반 컬럼 -->
                <template v-else>
                  {{ getCellValue(row, col.key) }}
                </template>
              </td>
            </tr>

            <!-- 빈 행 (높이 유지용) -->
            <tr v-for="i in emptyRows" :key="`empty-${i}`" class="empty-data-row">
              <td v-for="col in columns" :key="col.key">&nbsp;</td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <div v-if="allData.length > 0" class="pagination">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-button"
        >
          이전
        </button>

        <template v-for="(page, index) in visiblePages" :key="index">
          <!-- 말줄임표 -->
          <span v-if="typeof page === 'string'" class="ellipsis">---</span>
          <!-- 페이지 번호 -->
          <button
            v-else
            @click="goToPage(page)"
            :class="['page-button', { active: page === currentPage }]"
          >
            {{ page }}
          </button>
        </template>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-button"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-area {
  background-color: #ffffff;
  border-radius: 10px;
  width: 100%;
  height: auto;
  overflow: hidden;
}

/* 테이블 기본 스타일 */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  font-size: 12px;
}

/* 헤더 스타일 */
.data-table thead th {
  background-color: #f8f9fa;
  padding: 12px 8px;
  border: 1px solid #dee2e6;
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
}

/* 데이터 행 스타일 */
.data-table tbody tr.data-row {
  height: 60px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.data-table tbody tr.data-row:hover {
  color: #007bff;
  background-color: #e2edff;
}

.data-table tbody td {
  padding: 8px;
  border: 1px solid #dee2e6;
  vertical-align: middle;
}

/* 빈 데이터 행 (높이 유지용) */
.data-table tbody tr.empty-data-row {
  height: 60px;
  pointer-events: none;
}

.data-table tbody tr.empty-data-row:hover {
  background-color: transparent;
  outline: none;
}

/* 빈 상태 행 */
.data-table tbody tr.empty-row {
  height: 500px;
}

/* 담당자 배정 버튼 */
.assign-button {
  padding: 6px 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.assign-button:hover {
  background-color: #218838;
}

/* 담당자 셀렉트 */
.manager-select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  background-color: white;
}

.manager-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* 페이지네이션 */
.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.page-button {
  min-width: 50px;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background-color: white;
  color: #495057;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
}

.page-button:hover:not(:disabled) {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.page-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.page-button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  font-weight: bold;
}

.ellipsis {
  padding: 0 8px;
  color: #6c757d;
  user-select: none;
}
</style>
