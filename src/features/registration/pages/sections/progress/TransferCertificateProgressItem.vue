<template>
  <li class="sub-item" data-scroll-id="progress-transfer-certificate">
    <div class="sub-title">이전/말소 등기권리증 등록</div>

    <section class="case-detail">
      <div v-if="loading" class="muted">불러오는 중…</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else class="table-wrapper">
        <table class="data-table-area">
          <thead>
            <tr>
              <th>등기유형</th>
              <th>부동산고유번호</th>
              <th>성명(명칭)</th>
              <th>접수일자</th>
              <th>접수번호</th>
              <th>권리증구분</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rows.length === 0">
              <td colspan="6" class="empty-cell">조회된 목록이 없습니다.</td>
            </tr>
            <tr v-for="(row, idx) in rows" :key="`cert-${idx}-${row.propertyUniqueNumber ?? idx}`">
              <td>{{ displayCode(row.registryType, 'registryTypes') }}</td>
              <td>{{ row.propertyUniqueNumber ?? '-' }}</td>
              <td>{{ row.name ?? '-' }}</td>
              <td>{{ row.receiptDate ?? '-' }}</td>
              <td>{{ row.receiptNumber ?? '-' }}</td>
              <td>{{ displayCode(row.certificateType, 'certificateTypes') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </li>
</template>

<script setup lang="ts">
import type { CancellationCertificateListItem } from '@/types'

interface Props {
  rows: CancellationCertificateListItem[]
  loading: boolean
  errorMessage: string
  displayCode: (value?: string | null, category?: string) => string
}

defineProps<Props>()
</script>
