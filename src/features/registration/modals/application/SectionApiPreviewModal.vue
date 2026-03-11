<!-- 문서 경로: `@/src/features/registration/modals/application/SectionApiPreviewModal.vue`
문서 제목: 기능 페이지/컴포넌트: section-api-preview-modal -->

<template>
  <section class="api-preview">
    <div class="meta-row">
      <span class="meta-label">섹션 코드</span>
      <span class="meta-value">{{ sectionCode || '-' }}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">연결 API</span>
      <span class="meta-value">{{ apiLabel }}</span>
    </div>

    <div v-if="loading" class="muted">불러오는 중…</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <pre v-else class="json-view">{{ jsonText }}</pre>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import {
  registryAttachmentAPI,
  registryCancellationAPI,
  registryChangeAPI,
  registryContractAPI,
  registryCorrectionAPI,
  registryDebtTaxAPI,
  registryPropertyAPI,
  registryTaxAPI,
  registryTypeAPI
} from '@/api/services/registry'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import { extractPrimaryPayload } from '@/utils/apiPayload'

interface Props {
  applicationId: number
  sectionCode?: string
}

const props = defineProps<Props>()
const { getErrorMessage } = useErrorHandler()

const loading = ref(false)
const errorMessage = ref('')
const payload = ref<unknown>(null)
const apiLabel = ref('-')

function getPreviewPayload(res: unknown): unknown {
  return extractPrimaryPayload(res)
}

function normalizeCode(code?: string): string {
  return (code ?? '').toUpperCase()
}

async function fetchSectionData() {
  if (!props.applicationId) {
    payload.value = null
    errorMessage.value = '신청서 ID가 없습니다.'
    return
  }

  const code = normalizeCode(props.sectionCode)
  loading.value = true
  errorMessage.value = ''

  try {
    let res: unknown

    if (code.includes('CONTRACT')) {
      apiLabel.value = 'R02E-01 /contracts/parties'
      res = await registryContractAPI.getDetail({ applicationId: props.applicationId })
    } else if (code.includes('PROPERTY')) {
      apiLabel.value = 'R02F-01 /properties'
      res = await registryPropertyAPI.getDetail({ applicationId: props.applicationId })
    } else if (code.includes('BOND')) {
      apiLabel.value = 'R02H-01 /mortgage/financial'
      res = await registryDebtTaxAPI.getDetail({ applicationId: props.applicationId })
    } else if (code.includes('TAX')) {
      apiLabel.value = 'R02I-01 /ownership/tax/detail'
      res = await registryTaxAPI.getDetail({ applicationId: props.applicationId })
    } else if (code.includes('ATTACH')) {
      apiLabel.value = 'R02J-01 /attachments'
      res = await registryAttachmentAPI.getDetail({ applicationId: props.applicationId })
    } else if (code.includes('CHANGE')) {
      apiLabel.value = 'R02K-01 /changes'
      res = await registryChangeAPI.getDetail({ applicationId: props.applicationId })
    } else if (code.includes('CORRECTION')) {
      apiLabel.value = 'R02L-01 /correction'
      res = await registryCorrectionAPI.getDetail({ applicationId: props.applicationId })
    } else if (code.includes('CANCELLATION')) {
      apiLabel.value = 'R02M-01 /cancellations'
      res = await registryCancellationAPI.getDetail({ applicationId: props.applicationId })
    } else {
      apiLabel.value = 'R02D-10 /forms/unified (fallback)'
      res = await registryTypeAPI.unifiedForm({ applicationId: props.applicationId })
    }

    payload.value = getPreviewPayload(res)
  } catch (error) {
    payload.value = null
    errorMessage.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

const jsonText = computed(() => JSON.stringify(payload.value ?? {}, null, 2))

watch(
  () => [props.applicationId, props.sectionCode],
  () => {
    void fetchSectionData()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.api-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meta-row {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
}

.meta-label {
  color: #6b7280;
  min-width: 70px;
}

.meta-value {
  color: #111827;
  font-weight: 600;
}

.muted {
  color: #6b7280;
  text-align: center;
  padding: 12px 0;
}

.error {
  padding: 12px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  font-size: 13px;
}

.json-view {
  margin: 0;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  padding: 12px;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
