<!-- 문서 경로: `@/src/features/doc-templates/PdfConverter.vue`
문서 제목: 기능 페이지/컴포넌트: pdf-converter -->

<template>
  <div class="container">
    <PdfTester />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const PdfTester = defineAsyncComponent(() => import('@/features/doc-templates/PdfTester.vue'))
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 700px;
  padding: 20px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background-color: #ddd;
}
</style>
