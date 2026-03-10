<template>
  <section class="panel">
    <h3>고정양식 입력</h3>

    <div class="grid two">
      <label>
        <span>문서 제목</span>
        <input
          :value="form.documentTitle"
          type="text"
          @input="updateField('documentTitle', $event)"
        />
      </label>
      <label>
        <span>문서번호</span>
        <input :value="form.documentNo" type="text" @input="updateField('documentNo', $event)" />
      </label>
      <label>
        <span>작성일</span>
        <input
          :value="form.issueDate"
          type="text"
          placeholder="2026-03-09"
          @input="updateField('issueDate', $event)"
        />
      </label>
      <label>
        <span>고객명</span>
        <input
          :value="form.customerName"
          type="text"
          @input="updateField('customerName', $event)"
        />
      </label>
      <label>
        <span>담당자</span>
        <input :value="form.managerName" type="text" @input="updateField('managerName', $event)" />
      </label>
      <label>
        <span>금액</span>
        <input :value="form.amount" type="text" @input="updateField('amount', $event)" />
      </label>
    </div>

    <label>
      <span>요약(고정 셀, 초과 시 별지)</span>
      <textarea :value="form.summary" rows="4" @input="updateField('summary', $event)" />
    </label>

    <label>
      <span>비고(고정 셀, 초과 시 별지)</span>
      <textarea :value="form.notes" rows="4" @input="updateField('notes', $event)" />
    </label>

    <div class="table-head">
      <h4>항목(고정행 초과 시 별지 테이블)</h4>
      <button type="button" class="btn" @click="$emit('add-item')">행 추가</button>
    </div>

    <table class="items">
      <thead>
        <tr>
          <th>구분</th>
          <th>내용</th>
          <th>비고</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in form.items" :key="index">
          <td>
            <input
              :value="item.category"
              type="text"
              @input="updateItemField(index, 'category', $event)"
            />
          </td>
          <td>
            <input
              :value="item.content"
              type="text"
              @input="updateItemField(index, 'content', $event)"
            />
          </td>
          <td>
            <input :value="item.note" type="text" @input="updateItemField(index, 'note', $event)" />
          </td>
          <td>
            <button type="button" class="btn danger" @click="$emit('remove-item', index)">
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <h4>API 연동</h4>
    <div class="grid two">
      <label>
        <span>API URL</span>
        <input :value="apiUrl" type="text" @input="updateString('api-url', $event)" />
      </label>
      <label>
        <span>Method</span>
        <select :value="apiMethod" @change="updateMethod($event)">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </label>
    </div>
    <label>
      <span>POST Body(JSON)</span>
      <textarea :value="apiBody" rows="4" @input="updateString('api-body', $event)" />
    </label>

    <div class="actions">
      <button type="button" class="btn" :disabled="isLoadingApi" @click="$emit('fetch-api')">
        {{ isLoadingApi ? 'API 호출 중...' : 'API 호출 후 양식 반영' }}
      </button>
      <button type="button" class="btn primary" :disabled="isGenerating" @click="$emit('generate')">
        {{ isGenerating ? 'PDF 생성 중...' : 'PDF 생성' }}
      </button>
      <button type="button" class="btn" @click="$emit('save-temp')">프론트 템프 저장</button>
      <button type="button" class="btn" @click="$emit('load-temp')">템프 불러오기</button>
      <button type="button" class="btn danger" @click="$emit('clear-temp')">템프 삭제</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FixedFormData, FixedFormLineItem } from '@/features/dev/composables/useFixedFormPdf'

defineProps<{
  form: FixedFormData
  apiUrl: string
  apiMethod: 'GET' | 'POST'
  apiBody: string
  isGenerating: boolean
  isLoadingApi: boolean
}>()

const emit = defineEmits<{
  (e: 'update-field', payload: { key: keyof Omit<FixedFormData, 'items'>; value: string }): void
  (
    e: 'update-item-field',
    payload: { index: number; key: keyof FixedFormLineItem; value: string }
  ): void
  (e: 'update:api-url', value: string): void
  (e: 'update:api-method', value: 'GET' | 'POST'): void
  (e: 'update:api-body', value: string): void
  (e: 'add-item'): void
  (e: 'remove-item', index: number): void
  (e: 'fetch-api'): void
  (e: 'generate'): void
  (e: 'save-temp'): void
  (e: 'load-temp'): void
  (e: 'clear-temp'): void
}>()

function updateField(key: keyof Omit<FixedFormData, 'items'>, event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update-field', { key, value: target.value })
}

function updateItemField(index: number, key: keyof FixedFormLineItem, event: Event) {
  const target = event.target as HTMLInputElement
  emit('update-item-field', { index, key, value: target.value })
}

function updateString(type: 'api-url' | 'api-body', event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  if (type === 'api-url') emit('update:api-url', target.value)
  if (type === 'api-body') emit('update:api-body', target.value)
}

function updateMethod(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:api-method', target.value === 'POST' ? 'POST' : 'GET')
}
</script>

<style scoped>
.panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}

.grid {
  display: grid;
  gap: 8px;
}

.grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

label {
  display: grid;
  gap: 6px;
  margin-bottom: 8px;
}

span {
  font-size: 12px;
  color: #475569;
  font-weight: 700;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 10px;
  box-sizing: border-box;
  font-size: 13px;
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.items {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 12px;
}

.items th,
.items td {
  border: 1px solid #e5e7eb;
  padding: 6px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  border: 1px solid #d1d5db;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 10px;
  font-weight: 700;
  cursor: pointer;
}

.btn.primary {
  background: #1d4ed8;
  color: #fff;
  border-color: #1d4ed8;
}

.btn.danger {
  background: #fee2e2;
  border-color: #fca5a5;
}
</style>
