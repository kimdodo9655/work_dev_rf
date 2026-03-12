<template>
  <li class="sub-item" data-scroll-id="progress-e-sign-status">
    <div class="sub-title">[외부] 전자서명 진행상태 관리</div>

    <section class="case-detail">
      <div v-if="loading" class="muted">불러오는 중…</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else class="table-wrapper">
        <table class="data-table-area">
          <thead>
            <tr>
              <th>구분</th>
              <th>성명(명칭)</th>
              <th>서명방식</th>
              <th>서명요청 일시</th>
              <th>서명완료 일시</th>
              <th>전자서명여부</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in list" :key="item.eSignatureId">
              <td>{{ codeLabel(item.partyRole, 'partyRoles') }}</td>
              <td>{{ item.name }}</td>
              <td>{{ codeLabel(item.signatureMethod, 'eSignatureMethods') }}</td>
              <td>{{ item.signatureRequestedAt ?? '-' }}</td>
              <td>{{ item.signatureCompletedAt ?? '-' }}</td>
              <td>
                <span :class="getSignatureStatusClass(item.signatureStatus)">
                  {{ codeLabel(item.signatureStatus, 'eSignatureStatuses') }}
                </span>
              </td>
              <td>
                <button class="detail-btn" @click="onDetail(item)">상세</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </li>
</template>

<script setup lang="ts">
interface ESignatureItem {
  eSignatureId: number
  partyRole: string
  partyRoleName: string
  name: string
  signatureMethod: string
  signatureMethodName: string
  signatureStatus: string
  signatureStatusName: string
  signatureRequestedAt: string | null
  signatureCompletedAt: string | null
  certificateExpiryDate: string | null
  verificationResult: string | null
  registryType: string
  documents: any[]
}

interface Props {
  list: ESignatureItem[]
  loading: boolean
  errorMessage: string
  codeLabel: (value?: string | null, category?: string) => string
  getSignatureStatusClass: (status: string) => string
  onDetail: (item: ESignatureItem) => void
}

defineProps<Props>()
</script>
