<!-- 문서 경로: `@/src/features/shared/pages/WebViewerPage.vue`
문서 제목: Web Viewer Page 구현 파일 -->

<template>
  <div class="web-viewer-page">
    <div class="viewer-container">
      <PdfViewer
        :src="pdfSrc"
        app-title="BankClear Web Viewer"
        :address-path="addressPath"
        :download-name="downloadName"
        full-screen
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const PdfViewer = defineAsyncComponent(() => import('@/features/doc-templates/PdfViewer.vue'))
const route = useRoute()

const pdfSrc = computed(() => {
  const src = route.query.src
  if (typeof src === 'string' && src.startsWith('/pdf/')) return src
  return '/pdf/test.pdf'
})

const downloadName = computed(() => {
  const fileName = pdfSrc.value.split('/').pop()
  return fileName && fileName.length > 0 ? fileName : 'document.pdf'
})

const addressPath = computed(() => route.fullPath)
</script>

<style lang="scss" scoped>
.web-viewer-page {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding: 0;
  background: #f1f4f9;
}

.viewer-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
}
</style>
