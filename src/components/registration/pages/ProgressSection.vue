<template>
  <ul class="sub-list">
    <!-- [내부] 전자서명 진행 (근저당권) -->
    <li v-if="mortgageList.length > 0" class="sub-item">
      <div class="sub-title">[내부] 전자서명 진행</div>

      <section class="case-detail">
        <div v-if="mortgageLoading" class="muted">불러오는 중…</div>
        <div v-else-if="mortgageErrorMessage" class="error">{{ mortgageErrorMessage }}</div>

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
              <tr v-for="item in mortgageList" :key="item.eSignatureId">
                <td>{{ item.partyRoleName }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.signatureMethodName }}</td>
                <td>{{ item.signatureRequestedAt ?? '-' }}</td>
                <td>{{ item.signatureCompletedAt ?? '-' }}</td>
                <td>
                  <span :class="getSignatureStatusClass(item.signatureStatus)">
                    {{ item.signatureStatusName }}
                  </span>
                </td>
                <td>
                  <button class="detail-btn" @click="handleDetail(item)">상세</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <!-- 기타 섹션들 (TODO) -->
    <li class="sub-item">세금신고 대행</li>
    <li class="sub-item">국민주택채권 매입</li>
    <li class="sub-item">대출금 지급계좌 등록</li>
    <li class="sub-item">이전/말소 등기권리증 등록</li>
    <li class="sub-item">등기 신청사건 조회</li>
    <li class="sub-item">소유권이전 신청서 작성 정보</li>
    <li class="sub-item">등기접수 정보 등록</li>
    <li class="sub-item">등기접수 정보 등록 - 사건 위임 요청</li>

    <!-- [외부] 전자서명 진행상태 관리 (소유권이전) -->
    <li v-if="transferList.length > 0" class="sub-item">
      <div class="sub-title">[외부] 전자서명 진행상태 관리</div>

      <section class="case-detail">
        <div v-if="transferLoading" class="muted">불러오는 중…</div>
        <div v-else-if="transferErrorMessage" class="error">{{ transferErrorMessage }}</div>

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
              <tr v-for="item in transferList" :key="item.eSignatureId">
                <td>{{ item.partyRoleName }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.signatureMethodName }}</td>
                <td>{{ item.signatureRequestedAt ?? '-' }}</td>
                <td>{{ item.signatureCompletedAt ?? '-' }}</td>
                <td>
                  <span :class="getSignatureStatusClass(item.signatureStatus)">
                    {{ item.signatureStatusName }}
                  </span>
                </td>
                <td>
                  <button class="detail-btn" @click="handleDetail(item)">상세</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>

    <li class="sub-item">[외부] 전자서명 진행상태 관리 - 사건 위임 완료</li>
    <li class="sub-item">등기 영수증 작성</li>
    <li class="sub-item">등기 완료 문서 등록</li>
    <li class="sub-item">등기 완료 문서 제출 안내 (소유권이전)</li>
    <li class="sub-item">등기 완료 문서 제출 안내 (근저당권설정)</li>
    <li class="sub-item">등기 완료 문서 제출 안내 (근저당권설정, 소유권이전)</li>
  </ul>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { registrySignatureAPI } from '@/api/services/registry'
import { useThrottle } from '@/composables/utils/useThrottle'

interface Props {
  registryManagementNumber: string
  isOpen: boolean
}

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

const props = defineProps<Props>()

// 근저당권 전자서명 (내부)
const mortgageLoading = ref(false)
const mortgageErrorMessage = ref('')
const mortgageList = ref<ESignatureItem[]>([])
const mortgageThrottle = useThrottle(1000)

// 소유권이전 전자서명 (외부)
const transferLoading = ref(false)
const transferErrorMessage = ref('')
const transferList = ref<ESignatureItem[]>([])
const transferThrottle = useThrottle(1000)

function unwrapData<T>(res: any): T {
  if (res?.data && typeof res.data === 'object' && 'data' in res.data) return res.data.data as T
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return undefined as unknown as T
}

// 전자서명 상태에 따른 CSS 클래스
function getSignatureStatusClass(status: string): string {
  const statusMap: Record<string, string> = {
    COMPLETED: 'status-completed',
    WAITING: 'status-waiting',
    REQUESTED: 'status-requested',
    REJECTED: 'status-rejected'
  }
  return statusMap[status] || 'status-default'
}

function handleDetail(item: ESignatureItem) {
  // TODO: 상세 페이지 이동 또는 모달 열기
  console.log('전자서명 상세 보기:', item)
}

// 근저당권 전자서명 정보 조회
async function fetchMortgageSignatures() {
  if (!props.registryManagementNumber) {
    mortgageList.value = []
    mortgageErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await mortgageThrottle.execute(async () => {
    mortgageLoading.value = true
    mortgageErrorMessage.value = ''
    try {
      const res: any = await registrySignatureAPI.getDetail({
        registryManagementNumber: props.registryManagementNumber,
        registryType: 'MORTGAGE_REGISTRATION'
      } as any)
      const data = unwrapData<ESignatureItem[]>(res)

      mortgageList.value = Array.isArray(data) ? data : []
    } catch (e: any) {
      mortgageList.value = []
      mortgageErrorMessage.value = e?.message ?? '근저당권 전자서명 정보 조회 실패'
    } finally {
      mortgageLoading.value = false
    }
  })

  if (result === null) return
}

// 소유권이전 전자서명 정보 조회
async function fetchTransferSignatures() {
  if (!props.registryManagementNumber) {
    transferList.value = []
    transferErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  const result = await transferThrottle.execute(async () => {
    transferLoading.value = true
    transferErrorMessage.value = ''
    try {
      const res: any = await registrySignatureAPI.getDetail({
        registryManagementNumber: props.registryManagementNumber,
        registryType: 'OWNERSHIP_TRANSFER'
      } as any)
      const data = unwrapData<ESignatureItem[]>(res)

      transferList.value = Array.isArray(data) ? data : []
    } catch (e: any) {
      transferList.value = []
      transferErrorMessage.value = e?.message ?? '소유권이전 전자서명 정보 조회 실패'
    } finally {
      transferLoading.value = false
    }
  })

  if (result === null) return
}

// 마운트 시 즉시 데이터 체크 (아코디언 상태 무관)
watch(
  () => props.registryManagementNumber,
  (newVal) => {
    if (newVal) {
      fetchMortgageSignatures()
      fetchTransferSignatures()
    }
  },
  { immediate: true }
)

// 아코디언이 열릴 때도 데이터 로드
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.registryManagementNumber) {
      fetchMortgageSignatures()
      fetchTransferSignatures()
    }
  }
)
</script>

<style scoped lang="scss">
.sub-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-item {
  padding: 10px 12px;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  background: #eee;
  font-size: 13px;
  color: #111827;
}

.sub-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #111827;
}

.case-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.muted {
  color: #6b7280;
  text-align: center;
  padding: 10px 0;
}

.error {
  padding: 12px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  font-size: 13px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table-area {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;

  thead {
    background: #f9fafb;

    th {
      padding: 12px 8px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f9fafb;
      }
    }

    td {
      padding: 12px 8px;
      font-size: 13px;
      color: #111827;
      white-space: nowrap;
    }
  }
}

.detail-btn {
  padding: 4px 12px;
  font-size: 12px;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }
}

// 전자서명 상태별 스타일
.status-completed {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #059669;
  background: #d1fae5;
  border-radius: 6px;
}

.status-waiting {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  background: #f3f4f6;
  border-radius: 6px;
}

.status-requested {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #f59e0b;
  background: #fef3c7;
  border-radius: 6px;
}

.status-rejected {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #dc2626;
  background: #fee2e2;
  border-radius: 6px;
}

.status-default {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  background: #f3f4f6;
  border-radius: 6px;
}
</style>
