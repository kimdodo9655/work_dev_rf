<template>
  <li class="sub-item" data-scroll-id="progress-case-delegation">
    <div class="sub-title">[외부] 전자서명 진행상태 관리 - 사건 위임 완료</div>
    <div class="caption">신청사건 목록 건수: {{ caseCount }}건</div>
  </li>
</template>

<script setup lang="ts">
interface Props {
  caseCount: number
}

defineProps<Props>()
</script>
