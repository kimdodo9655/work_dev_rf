<template>
  <ul class="sub-list">
    <li class="sub-item">[내부] 전자서명 진행</li>
    <li class="sub-item">세금신고 대행</li>
    <li class="sub-item">국민주택채권 매입</li>
    <li class="sub-item">대출금 지급계좌 등록</li>
    <li class="sub-item">이전/말소 등기권리증 등록</li>
    <li class="sub-item">등기 신청사건 조회</li>
    <li class="sub-item">소유권이전 신청서 작성 정보</li>
    <li class="sub-item">등기접수 정보 등록</li>
    <li class="sub-item">등기접수 정보 등록 - 사건 위임 요청</li>
    <li class="sub-item">[외부] 전자서명 진행상태 관리</li>
    <li class="sub-item">[외부] 전자서명 진행상태 관리 - 사건 위임 완료</li>
    <li class="sub-item">등기 영수증 작성</li>
    <li class="sub-item">등기 완료 문서 등록</li>
    <li class="sub-item">등기 완료 문서 제출 안내 (소유권이전)</li>
    <li class="sub-item">등기 완료 문서 제출 안내 (근저당권설정)</li>
    <li class="sub-item">등기 완료 문서 제출 안내 (근저당권설정, 소유권이전)</li>
  </ul>
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
    console.log('등기 진행 정보 등록 API 호출', props.registryManagementNumber)
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
  background: #fafafa;
  font-size: 13px;
  color: #111827;
}
</style>
