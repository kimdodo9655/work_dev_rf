<template>
  <div class="placeholder muted">여기에 등기신청서 정보 등록 UI 추가</div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

import { useThrottle } from '@/composables/utils/useThrottle'

interface Props {
  registryManagementNumber: string
  isOpen: boolean
}

const props = defineProps<Props>()
const throttle = useThrottle(1000)

async function fetchData() {
  await throttle.execute(async () => {
    // TODO: API 호출
    console.log('등기신청서 정보 등록 API 호출', props.registryManagementNumber)
  })
}

// 아코디언이 열릴 때마다 데이터 로드
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      fetchData()
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.placeholder {
  padding: 10px 0;
}

.muted {
  color: #6b7280;
  text-align: center;
}
</style>
