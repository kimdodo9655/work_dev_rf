<template>
  <li class="sub-item" data-scroll-id="progress-cost-statement">
    <div class="sub-title">등기 영수증 작성</div>

    <section class="case-detail">
      <div v-if="loading" class="muted">불러오는 중…</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else class="table-wrapper">
        <table class="data-table-area">
          <thead>
            <tr>
              <th>등기유형</th>
              <th>보수료 소계</th>
              <th>채권할인금액</th>
              <th>등기비용 합계</th>
              <th>전자문서</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rows.length === 0">
              <td colspan="5" class="empty-cell">조회된 목록이 없습니다.</td>
            </tr>
            <tr
              v-for="(row, idx) in rows"
              :key="`receipt-doc-${idx}-${row.registryType ?? 'unknown'}`"
            >
              <td>{{ formatCodeLabel(row.registryType, 'registryTypes') }}</td>
              <td>{{ formatNumber(row.feeSubtotal) }}</td>
              <td>{{ formatNumber(row.bondDiscountAmount) }}</td>
              <td>{{ formatNumber(row.costTotal) }}</td>
              <td>{{ row.documentGenerated ? '생성' : '미생성' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </li>
</template>

<script setup lang="ts">
import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import type { ReceiptSummaryItem } from '@/types'

interface Props {
  rows: ReceiptSummaryItem[]
  loading: boolean
  errorMessage: string
  formatNumber: (value?: number | null) => string
}

defineProps<Props>()
const { formatCodeLabel } = useCodeReplacer()
</script>
