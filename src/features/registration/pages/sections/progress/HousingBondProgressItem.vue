<template>
  <li class="sub-item" data-scroll-id="progress-housing-bond">
    <div class="sub-title">국민주택채권 매입</div>

    <section class="case-detail">
      <div v-if="loading" class="muted">불러오는 중…</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else class="table-wrapper">
        <table class="data-table-area">
          <thead>
            <tr>
              <th>등기유형</th>
              <th>매입구분</th>
              <th>매입대상금액</th>
              <th>채권매입금액</th>
              <th>채권할인금액</th>
              <th>채권번호</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rows.length === 0">
              <td colspan="6" class="empty-cell">조회된 목록이 없습니다.</td>
            </tr>
            <tr v-for="(row, idx) in rows" :key="`bond-${idx}-${row.registryType ?? 'unknown'}`">
              <td>{{ codeLabel(row.registryType, 'registryTypes') }}</td>
              <td>{{ codeLabel(row.purchaseType, 'bondPurchaseTypes') }}</td>
              <td>{{ formatNumber(row.purchaseTargetAmount) }}</td>
              <td>{{ formatNumber(row.bondPurchaseAmount) }}</td>
              <td>{{ formatWonAmount(row.bondDiscountAmount) }}</td>
              <td>{{ formatHousingBondNumber(row.housingBondNumber) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </li>
</template>

<script setup lang="ts">
import type { RegistryProgressHousingBondRow } from '@/types'
import { formatHousingBondNumber, formatWonAmount } from '@/utils/format'

interface Props {
  rows: RegistryProgressHousingBondRow[]
  loading: boolean
  errorMessage: string
  codeLabel: (value?: string | null, category?: string) => string
  formatNumber: (value?: number | null) => string
}

defineProps<Props>()
</script>
