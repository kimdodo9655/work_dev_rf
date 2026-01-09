<template>
  <div v-if="totalPages > 0" class="pagination">
    <button
      @click="handlePageChange(currentPage - 1)"
      :disabled="currentPage === 1"
      class="page-button"
    >
      이전
    </button>

    <template v-for="(page, index) in visiblePages" :key="index">
      <!-- 말줄임표 -->
      <span v-if="typeof page === 'string'" class="ellipsis">...</span>
      <!-- 페이지 번호 -->
      <button
        v-else
        @click="handlePageChange(page)"
        :class="['page-button', { active: page === currentPage }]"
      >
        {{ page }}
      </button>
    </template>

    <button
      @click="handlePageChange(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="page-button"
    >
      다음
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 전체 아이템 개수 */
  totalItems: number
  /** 페이지당 아이템 개수 */
  itemsPerPage?: number
  /** 현재 페이지 (1부터 시작) */
  currentPage: number
}

interface Emits {
  (e: 'update:currentPage', page: number): void
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10
})

const emit = defineEmits<Emits>()

// 전체 페이지 수 계산
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

// 보이는 페이지 계산 (9개 초과일 때만 항상 9개 슬롯 유지)
const visiblePages = computed(() => {
  const current = props.currentPage
  const total = totalPages.value
  const pages: (number | string)[] = []

  if (total <= 9) {
    // 전체 페이지가 9개 이하면 모두 표시
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else if (current <= 5) {
    // 현재 페이지가 1~5: [1][2][3][4][5][6][7]...[마지막]
    for (let i = 1; i <= 7; i++) {
      pages.push(i)
    }
    pages.push('ellipsis')
    pages.push(total)
  } else if (current >= total - 4) {
    // 현재 페이지가 마지막-4 ~ 마지막: [1]...[마지막-6][마지막-5][마지막-4][마지막-3][마지막-2][마지막-1][마지막]
    pages.push(1)
    pages.push('ellipsis')
    for (let i = total - 6; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 중간 페이지: [1]...[현재-2][현재-1][현재][현재+1][현재+2]...[마지막]
    pages.push(1)
    pages.push('ellipsis')
    for (let i = current - 2; i <= current + 2; i++) {
      pages.push(i)
    }
    pages.push('ellipsis')
    pages.push(total)
  }

  return pages
})

// 페이지 변경 핸들러
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}
</script>

<style scoped>
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
  min-width: 50px;
  padding: 8px 12px;
  display: inline-block;
  text-align: center;
  color: #6c757d;
  user-select: none;
}
</style>
<!-- 
=== Pagination 컴포넌트 사용법 ===

[Template]
<Pagination
  v-model:current-page="currentPage"  // 현재 페이지 번호 (1부터 시작)
  :total-items="allData.length"       // 전체 데이터 개수
  :items-per-page="10"                // 한 페이지당 보여줄 아이템 개수 (기본값: 10)
/>

[Script]
import Pagination from '@/components/template/PaginationItem.vue'

const currentPage = ref(1)  // 현재 페이지 상태
const itemsPerPage = 10     // 페이지당 아이템 개수

// 현재 페이지에 해당하는 데이터 계산
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allData.value.slice(start, end)
})
  
=== 서버 사이드 페이지네이션 (API 재조회) ===

[Script]
import { ref, watch } from 'vue'
import Pagination from '@/components/template/PaginationItem.vue'

const currentPage = ref(1)
const itemsPerPage = 10
const data = ref([])
const totalItems = ref(0)

// API 호출 함수
const fetchData = async () => {
  const response = await api.get('/data', {
    params: {
      page: currentPage.value - 1,  // API가 0-based면 -1
      size: itemsPerPage
    }
  })
  data.value = response.data.content
  totalItems.value = response.data.totalElements
}

// 페이지 변경 시 API 재호출
watch(currentPage, () => {
  fetchData()
})

// 초기 로드
fetchData()

[Template]
<div v-for="item in data" :key="item.id">
  {{ item }}
</div>

<Pagination
  v-model:current-page="currentPage"
  :total-items="totalItems"       // API 응답의 전체 개수
  :items-per-page="itemsPerPage"
/>
-->
