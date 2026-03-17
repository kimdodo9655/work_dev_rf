<template>
  <li class="sub-item" data-scroll-id="progress-tax-declaration">
    <div class="sub-title">세금신고 대행</div>

    <section class="case-detail">
      <div v-if="loading" class="muted">불러오는 중…</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else class="table-wrapper">
        <table class="data-table-area">
          <thead>
            <tr>
              <th>등기유형</th>
              <th>등기원인</th>
              <th>납부금액</th>
              <th>납세번호</th>
              <th>전자납부번호</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rows.length === 0">
              <td colspan="5" class="empty-cell">조회된 목록이 없습니다.</td>
            </tr>
            <tr
              v-for="(row, idx) in rows"
              :key="`tax-${idx}-${row.registryType ?? 'unknown'}-${row.registryCause ?? 'unknown'}`"
            >
              <td>{{ codeLabel(row.registryType, 'registryTypes') }}</td>
              <td>{{ codeLabel(row.registryCause, 'registryCauses') }}</td>
              <td>{{ formatNumber(row.paymentAmount) }}</td>
              <td>{{ row.taxNumber ?? '-' }}</td>
              <td>{{ row.electronicPaymentNumber ?? '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </li>
</template>

<script setup lang="ts">
import type { RegistryProgressTaxAgencyTableRow } from '@/types'

interface Props {
  rows: RegistryProgressTaxAgencyTableRow[]
  loading: boolean
  errorMessage: string
  codeLabel: (value?: string | null, category?: string) => string
  formatNumber: (value?: number | null) => string
}

defineProps<Props>()
</script>
