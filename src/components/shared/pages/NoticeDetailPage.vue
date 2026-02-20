<template>
  <div>공지 디테일 (ID: {{ noticeId }})</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const noticeId = computed(() => String(route.params.noticeId ?? ''))
</script>

<style lang="scss" scoped></style>
