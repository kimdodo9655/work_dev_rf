<template>
  <div class="data-table-wrapper">
    <!-- 테이블 상단 영역 -->
    <div v-if="$slots.header" class="table-header">
      <slot name="header"></slot>
    </div>

    <!-- 테이블 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :style="{ width: column.width, minWidth: column.minWidth }"
              :class="{
                sortable: column.sortable,
                'text-center': column.align === 'center',
                'text-right': column.align === 'right'
              }"
              @click="column.sortable && handleSort(column.key)"
            >
              <div class="th-content">
                <span>{{ column.label }}</span>
                <span v-if="column.sortable && sortKey === column.key" class="sort-icon">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in sortedData"
            :key="getRowKey(row, rowIndex)"
            :class="{ 'row-hover': hoverable }"
            @click="handleRowClick(row, rowIndex)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="{
                'text-center': column.align === 'center',
                'text-right': column.align === 'right'
              }"
            >
              <!-- 슬롯으로 커스텀 렌더링 -->
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="row[column.key]"
                :index="rowIndex"
                :column="column"
                :updateValue="(newValue: any) => updateCellValue(rowIndex, column.key, newValue)"
              >
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="sortedData.length === 0">
            <td :colspan="columns.length" class="empty-row">
              <slot name="empty">
                {{ emptyText }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 테이블 하단 영역 (페이지네이션 등) -->
    <div v-if="$slots.footer" class="table-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface Column {
  key: string
  label: string
  width?: string
  minWidth?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

interface Props {
  columns: Column[]
  data: any[]
  rowKey?: string
  hoverable?: boolean
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  hoverable: true,
  emptyText: '데이터가 없습니다.'
})

const emit = defineEmits<{
  'update:data': [data: any[]]
  'cell-change': [rowIndex: number, key: string, value: any]
  'row-click': [row: any, index: number]
}>()

// 정렬 상태
const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

// 정렬된 데이터
const sortedData = computed(() => {
  if (!sortKey.value) return props.data

  return [...props.data].sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]

    // null/undefined 처리
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1

    // 숫자 비교
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
    }

    // 문자열 비교
    const comparison = String(aVal).localeCompare(String(bVal))
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

// 정렬 핸들러
const handleSort = (key: string): void => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// 행 키 가져오기
const getRowKey = (row: any, index: number): string | number => {
  return row[props.rowKey] ?? index
}

// 셀 값 업데이트
const updateCellValue = (rowIndex: number, key: string, newValue: any): void => {
  const newData = [...props.data]
  newData[rowIndex] = { ...newData[rowIndex], [key]: newValue }
  emit('update:data', newData)
  emit('cell-change', rowIndex, key, newValue)
}

// 행 클릭
const handleRowClick = (row: any, index: number): void => {
  emit('row-click', row, index)
}
</script>

<style scoped>
.data-table-wrapper {
  width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header,
.table-footer {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.table-footer {
  border-bottom: none;
  border-top: 1px solid #e5e7eb;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
}

.data-table th {
  background-color: #c1e0ff;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  white-space: nowrap;
  border-bottom: 2px solid #e5e7eb;
}

.data-table tr {
  height: 60px;
}

.data-table td {
  height: 60px;
  border-bottom: 1px solid #f3f4f6;
  color: #111827;
  font-size: 14px;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.sortable:hover {
  background-color: #f3f4f6;
}

.sort-icon {
  font-size: 12px;
  color: #6b7280;
}

.row-hover:hover {
  outline: 5px solid #a2d2ff;
  background-color: #f9fafb;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.empty-row {
  text-align: center;
  color: #9ca3af;
  padding: 48px 16px !important;
  font-size: 14px;
}
</style>
