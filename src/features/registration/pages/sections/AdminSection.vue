<!-- 문서 경로: `@/src/features/registration/pages/sections/AdminSection.vue`
문서 제목: 기능 페이지/컴포넌트: admin-section -->

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
import { extractArrayByKeys } from '@/utils/apiPayload'

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
const { findOriginalCode, findReplacement, replaceText } = useCodeReplacer()
const { getErrorMessage } = useErrorHandler()

const throttle = useThrottle(1000)
const loading = ref(false)
const errorMessage = ref('')
const list = ref<AdminInfoRequest[]>([])

function getRegistryTypeName(type: string): string {
  const replaced = findReplacement(type, 'registryTypes') ?? replaceText(type)
  if (replaced !== type) return `${type} -> ${replaced}`
  const inferredCode = findOriginalCode(type, 'registryTypes')
  return inferredCode ? `${inferredCode} -> ${type}` : type
}

function getRegistryCauseName(cause: string): string {
  const replaced = findReplacement(cause, 'registryCauses') ?? replaceText(cause)
  if (replaced !== cause) return `${cause} -> ${replaced}`
  const inferredCode = findOriginalCode(cause, 'registryCauses')
  return inferredCode ? `${inferredCode} -> ${cause}` : cause
}

function getRegistryMethodName(method: string): string {
  const replaced = findReplacement(method, 'registryMethods') ?? replaceText(method)
  if (replaced !== method) return `${method} -> ${replaced}`
  const inferredCode = findOriginalCode(method, 'registryMethods')
  return inferredCode ? `${inferredCode} -> ${method}` : method
}

function handleDetail(item: AdminInfoRequest) {
  // TODO: 행정정보 요청 상세 화면 또는 상세 모달 연결
  void item
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
      const res = await registryAdminConsentAPI.getList({
        registryManagementNumber: props.registryManagementNumber
      })
      list.value = extractArrayByKeys<AdminInfoRequest>(res, [
        'applicationAdminInfoRequest',
        'items',
        'content'
      ])
      emit('loaded', list.value.length > 0)
    } catch (e: unknown) {
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
