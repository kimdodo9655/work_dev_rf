<template>
  <li class="sub-item" data-scroll-id="progress-completion-doc-register">
    <div class="sub-title">등기 완료 문서 등록</div>

    <section class="case-detail">
      <div v-if="loading" class="muted">불러오는 중…</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else class="table-wrapper">
        <table class="data-table-area">
          <thead>
            <tr>
              <th>문서명</th>
              <th>부동산고유번호</th>
              <th>등기유형</th>
              <th>등기권리자</th>
              <th>파일경로</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rows.length === 0">
              <td colspan="5" class="empty-cell">조회된 목록이 없습니다.</td>
            </tr>
            <tr
              v-for="(row, idx) in rows"
              :key="`completion-list-${idx}-${row.propertyUniqueNumber ?? idx}`"
            >
              <td>{{ row.documentName ?? '-' }}</td>
              <td>{{ row.propertyUniqueNumber ?? '-' }}</td>
              <td>{{ displayCode(row.registryType, 'registryTypes') }}</td>
              <td>{{ row.obligeeName ?? '-' }}</td>
              <td>{{ row.filePath ?? '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </li>
</template>

<script setup lang="ts">
import type { CompleteDocumentListItem } from '@/types'

interface Props {
  rows: CompleteDocumentListItem[]
  loading: boolean
  errorMessage: string
  displayCode: (value?: string | null, category?: string) => string
}

defineProps<Props>()
</script>
