<template>
  <li class="sub-item">
    <div class="sub-title">등기 신청사건 조회</div>

    <section class="case-detail">
      <div v-if="loading" class="muted">불러오는 중…</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else class="table-wrapper">
        <table class="data-table-area">
          <thead>
            <tr>
              <th>부동산고유번호</th>
              <th>부동산구분</th>
              <th>부동산표시</th>
              <th>등기유형목록</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rows.length === 0">
              <td colspan="4" class="empty-cell">조회된 목록이 없습니다.</td>
            </tr>
            <tr v-for="(row, idx) in rows" :key="`case-${idx}-${row.propertyUniqueNumber ?? idx}`">
              <td>{{ row.propertyUniqueNumber ?? '-' }}</td>
              <td>{{ row.propertyType ?? '-' }}</td>
              <td>{{ row.propertyAddress ?? '-' }}</td>
              <td>
                {{
                  row.registryTypes?.length
                    ? row.registryTypes.map((type) => displayCode(type, 'registryTypes')).join(', ')
                    : '-'
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </li>
</template>

<script setup lang="ts">
import type { CaseInquiryListItem } from '@/types'

interface Props {
  rows: CaseInquiryListItem[]
  loading: boolean
  errorMessage: string
  displayCode: (value?: string | null, category?: string) => string
}

defineProps<Props>()
</script>
