<template>
  <section class="panel">
    <h3>PDF 결과</h3>

    <div class="actions">
      <button type="button" class="btn" :disabled="!hasPdf" @click="$emit('download')">
        다운로드
      </button>
      <button type="button" class="btn" @click="emitAttach">파일 인풋에 첨부</button>
    </div>

    <div class="meta">
      <div><b>파일명:</b> {{ fileName || '-' }}</div>
      <div><b>Base64 길이:</b> {{ base64Length.toLocaleString() }}</div>
    </div>

    <div class="viewer-wrap">
      <PdfViewer
        :src="previewUrl"
        app-title="BankClear Web Viewer"
        address-path="/viewer/pdf?id=fixed-form"
        download-name="fixed-form.pdf"
      />
    </div>

    <div class="file-input">
      <label>첨부 파일 인풋</label>
      <input ref="localInputEl" type="file" accept="application/pdf" @change="onInputChange" />
    </div>

    <p class="status" :class="statusType">{{ statusMessage }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import PdfViewer from '@/features/doc-templates/PdfViewer.vue'

defineProps<{
  previewUrl: string
  fileName: string
  base64Length: number
  hasPdf: boolean
  statusType: 'info' | 'ok' | 'err'
  statusMessage: string
}>()

const emit = defineEmits<{
  (e: 'download'): void
  (e: 'attach', inputEl: HTMLInputElement | null): void
}>()

const localInputEl = ref<HTMLInputElement | null>(null)

function onInputChange() {
  emit('attach', localInputEl.value)
}

function emitAttach() {
  emit('attach', localInputEl.value)
}
</script>

<style scoped>
.panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.btn {
  border: 1px solid #d1d5db;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 10px;
  font-weight: 700;
  cursor: pointer;
}

.meta {
  font-size: 12px;
  color: #475569;
  display: grid;
  gap: 4px;
  margin-bottom: 10px;
}

.file-input {
  margin-top: 10px;
  display: grid;
  gap: 6px;
  font-size: 12px;
}

.status {
  margin-top: 10px;
  font-size: 12px;
}

.status.ok {
  color: #166534;
}

.status.err {
  color: #991b1b;
}

.status.info {
  color: #1e3a8a;
}
</style>
