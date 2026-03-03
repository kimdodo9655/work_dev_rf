<!-- 문서 경로: `@/src/features/registration/pages/AdminSection.vue`
문서 제목: Admin Section 구현 파일 -->

<template>
  <ul v-if="list.length > 0" class="sub-list">
    <li class="sub-item">
      <div class="sub-title">행정정보 제공 요구 동의요청 정보</div>

      <section class="case-detail">
        <div v-if="loading" class="muted">불러오는 중…</div>
        <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

        <div v-else class="table-wrapper">
          <table class="data-table-area">
            <thead>
              <tr>
                <th>등기유형</th>
                <th>등기원인</th>
                <th>등기방식</th>
                <th>접수등기소</th>
                <th>작성년도</th>
                <th>작성번호</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list" :key="item.adminInfoRequestId">
                <td>{{ getRegistryTypeName(item.registryType) }}</td>
                <td>{{ getRegistryCauseName(item.registryCause) }}</td>
                <td>{{ getRegistryMethodName(item.registryMethod) }}</td>
                <td>{{ item.establishmentJurisdictionOffice ?? '-' }}</td>
                <td>{{ item.creationYear ?? '-' }}</td>
                <td>{{ item.creationNumber ?? '-' }}</td>
                <td>
                  <button class="detail-btn" @click="handleDetail(item)">상세</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { registryAdminConsentAPI } from '@/api/services/registry'
import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import { useThrottle } from '@/composables/utils/useThrottle'

interface Props {
  registryManagementNumber: string
  isOpen: boolean
}

interface AdminInfoRequest {
  applicationId: number
  registryType: string
  registryCause: string
  registryMethod: string
  establishmentJurisdictionOffice: string | null
  creationYear: string | null
  creationNumber: string | null
  adminInfoRequestId: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  loaded: [hasData: boolean]
}>()
const { findReplacement, replaceText } = useCodeReplacer()
const { getErrorMessage } = useErrorHandler()

const throttle = useThrottle(1000)
const loading = ref(false)
const errorMessage = ref('')
const list = ref<AdminInfoRequest[]>([])

function unwrapData<T>(res: any): T {
  if (res?.data && typeof res.data === 'object' && 'data' in res.data) return res.data.data as T
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return undefined as unknown as T
}

function getRegistryTypeName(type: string): string {
  return findReplacement(type, 'registryTypes') ?? replaceText(type)
}

function getRegistryCauseName(cause: string): string {
  return findReplacement(cause, 'registryCauses') ?? replaceText(cause)
}

function getRegistryMethodName(method: string): string {
  return findReplacement(method, 'registryMethods') ?? replaceText(method)
}

function handleDetail(item: AdminInfoRequest) {
  // TODO: 상세 페이지 이동 또는 모달 열기
  console.log('상세 보기:', item)
}

async function fetchData() {
  if (!props.registryManagementNumber) {
    list.value = []
    errorMessage.value = '등기관리번호가 없습니다.'
    emit('loaded', false)
    return
  }

  const result = await throttle.execute(async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const res: any = await registryAdminConsentAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      const data = unwrapData<{ applicationAdminInfoRequest: AdminInfoRequest[] }>(res)

      list.value = data?.applicationAdminInfoRequest ?? []
      emit('loaded', list.value.length > 0)
    } catch (e: any) {
      list.value = []
      errorMessage.value = getErrorMessage(e)
      emit('loaded', false)
    } finally {
      loading.value = false
    }
  })

  if (result === null) return
}

// 마운트 시 즉시 데이터 체크 (아코디언 상태 무관)
watch(
  () => props.registryManagementNumber,
  (newVal) => {
    if (newVal) {
      fetchData()
    }
  },
  { immediate: true }
)

// 아코디언이 열릴 때도 데이터 로드 (throttle 적용)
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.registryManagementNumber) {
      fetchData()
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
</style>
