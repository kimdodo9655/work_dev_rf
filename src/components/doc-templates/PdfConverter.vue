<template>
  <div class="container">
    <PdfTester />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const PdfTester = defineAsyncComponent(() => import('@/components/doc-templates/PdfTester.vue'))
</script>

<style lang="scss" scoped>
.container {
  width: 1080px;
  height: 700px;
  padding: 20px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background-color: #ddd;
}
</style>
