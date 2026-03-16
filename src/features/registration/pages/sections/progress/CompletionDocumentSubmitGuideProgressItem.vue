<template>
  <li class="sub-item" data-scroll-id="progress-completion-doc-submit">
    <div class="sub-title">등기 완료 문서 제출 안내</div>

    <section class="case-detail">
      <div v-if="loading" class="muted">불러오는 중…</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

      <template v-else>
        <div class="caption">등기사항전부증명서 {{ fullCertificateRows.length }}건</div>
        <div class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>부동산고유번호</th>
                <th>부동산구분</th>
                <th>관할등기소</th>
                <th>부동산주소</th>
                <th>업로드파일</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="fullCertificateRows.length === 0">
                <td colspan="5" class="empty-cell">조회된 목록이 없습니다.</td>
              </tr>
              <tr
                v-for="(row, idx) in fullCertificateRows"
                :key="`full-cert-${idx}-${row.propertyUniqueNumber ?? idx}`"
              >
                <td>{{ row.propertyUniqueNumber ?? '-' }}</td>
                <td>{{ codeLabel(row.propertyType, 'propertyTypes') }}</td>
                <td>{{ row.jurisdictionRegistryOffice ?? '-' }}</td>
                <td>{{ row.propertyAddress ?? '-' }}</td>
                <td>{{ row.fileName ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="caption">사후 등기필정보 {{ postCertificateRows.length }}건</div>
        <div class="table-wrapper">
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
              <tr v-if="postCertificateRows.length === 0">
                <td colspan="5" class="empty-cell">조회된 목록이 없습니다.</td>
              </tr>
              <tr
                v-for="(row, idx) in postCertificateRows"
                :key="`post-cert-${idx}-${row.propertyUniqueNumber ?? idx}`"
              >
                <td>{{ row.documentName ?? '-' }}</td>
                <td>{{ row.propertyUniqueNumber ?? '-' }}</td>
                <td>{{ codeLabel(row.registryType, 'registryTypes') }}</td>
                <td>{{ row.obligeeName ?? '-' }}</td>
                <td>{{ row.filePath ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </section>
  </li>
</template>

<script setup lang="ts">
import type { FullCertificateItem, PostCertificateItem } from '@/types'

interface Props {
  fullCertificateRows: FullCertificateItem[]
  postCertificateRows: PostCertificateItem[]
  loading: boolean
  errorMessage: string
  codeLabel: (value?: string | null, category?: string) => string
}

defineProps<Props>()
</script>
