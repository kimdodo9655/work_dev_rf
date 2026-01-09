<template>
  <div>
    <h1>
      [공용] 견적서 작성/제출 or 확인/철회 상세
      <br />
      EstimateDetailPage &#128187;
    </h1>
    <button @click="goBack">
      <span>← 이전</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  // 히스토리가 있으면 뒤로가기, 없으면 홈으로
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
