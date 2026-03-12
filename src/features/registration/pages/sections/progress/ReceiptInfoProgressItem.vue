<template>
  <li class="sub-item" data-scroll-id="progress-receipt-info">
    <div class="sub-title">등기접수 정보 등록</div>

    <section class="case-detail">
      <div v-if="loading" class="muted">불러오는 중…</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else class="table-wrapper">
        <table class="data-table-area">
          <thead>
            <tr>
              <th>등기유형</th>
              <th>등기방식</th>
              <th>접수등기소</th>
              <th>작성번호</th>
              <th>접수일자</th>
              <th>접수번호</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rows.length === 0">
              <td colspan="6" class="empty-cell">조회된 목록이 없습니다.</td>
            </tr>
            <tr v-for="(row, idx) in rows" :key="`receipt-${idx}-${row.creationNumber ?? idx}`">
              <td>{{ codeLabel(row.registryType, 'registryTypes') }}</td>
              <td>{{ codeLabel(row.registryMethod, 'registryMethods') }}</td>
              <td>{{ row.registryReceiptOffice ?? '-' }}</td>
              <td>{{ row.creationNumber ?? '-' }}</td>
              <td>{{ row.receiptDate ?? '-' }}</td>
              <td>{{ row.receiptNumber ?? '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </li>
</template>

<script setup lang="ts">
import type { ApplicationReceiptListItem } from '@/types'

interface Props {
  rows: ApplicationReceiptListItem[]
  loading: boolean
  errorMessage: string
  codeLabel: (value?: string | null, category?: string) => string
}

defineProps<Props>()
</script>
