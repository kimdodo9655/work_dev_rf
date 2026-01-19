<!-- components/layout/ConfirmDialog.vue -->
<script setup lang="ts">
import { type ConfirmOptions } from '@/types/dialog'

interface Props {
  isOpen: boolean
  options: ConfirmOptions
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = () => {
  emit('cancel')
}

const handleCancel = async () => {
  emit('cancel')
}

const handleConfirm = async () => {
  emit('confirm')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="isOpen" class="dialog-overlay" @click="handleClose">
        <div class="dialog-container" @click.stop>
          <button class="dialog-close" @click="handleClose">×</button>

          <h2 class="dialog-title">{{ options.title }}</h2>
          <p class="dialog-content">{{ options.content }}</p>

          <div class="dialog-actions">
            <button class="dialog-btn dialog-btn-secondary" @click="handleCancel">
              {{ options.cancelText || '취소' }}
            </button>
            <button class="dialog-btn dialog-btn-primary" @click="handleConfirm">
              {{ options.confirmText || '확인' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  min-width: 320px;
  max-width: 480px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dialog-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px 8px;
  line-height: 1;
}

.dialog-close:hover {
  color: #333;
}

.dialog-title {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.dialog-content {
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.5;
  white-space: pre-wrap;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.dialog-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.dialog-btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.dialog-btn-secondary:hover {
  background-color: #d1d5db;
}

.dialog-btn-primary {
  background-color: #3b82f6;
  color: white;
}

.dialog-btn-primary:hover {
  background-color: #2563eb;
}

/* 트랜지션 */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-active .dialog-container,
.dialog-leave-active .dialog-container {
  transition: transform 0.2s;
}

.dialog-enter-from .dialog-container,
.dialog-leave-to .dialog-container {
  transform: scale(0.9);
}
</style>
