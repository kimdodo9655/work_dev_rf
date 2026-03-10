<template>
  <li class="sub-item" data-scroll-id="progress-loan-account">
    <div class="sub-title">대출금 지급계좌 등록</div>

    <section class="case-detail">
      <div v-if="loading" class="muted">불러오는 중…</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else class="table-wrapper">
        <table class="data-table-area">
          <thead>
            <tr>
              <th>지급구분</th>
              <th>지급주체</th>
              <th>지급금액</th>
              <th>은행</th>
              <th>계좌번호</th>
              <th>상환영수증</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rows.length === 0">
              <td colspan="6" class="empty-cell">조회된 목록이 없습니다.</td>
            </tr>
            <tr v-for="(row, idx) in rows" :key="`loan-${idx}-${row.loanPaymentAccountId ?? idx}`">
              <td>{{ row.paymentType ?? '-' }}</td>
              <td>{{ row.paymentSubject ?? '-' }}</td>
              <td>{{ formatNumber(row.paymentAmount) }}</td>
              <td>{{ row.paymentBank ?? '-' }}</td>
              <td>{{ row.accountNumber ?? '-' }}</td>
              <td>{{ row.receiptUploaded ? '등록' : '미등록' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </li>
</template>

<script setup lang="ts">
import type { LoanPaymentAccountListItem } from '@/types'

interface Props {
  rows: LoanPaymentAccountListItem[]
  loading: boolean
  errorMessage: string
  formatNumber: (value?: number | null) => string
}

defineProps<Props>()
</script>
