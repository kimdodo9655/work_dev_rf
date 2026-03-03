<!-- 문서 경로: `@/src/components/layout/DialogProvider.vue`
문서 제목: 재사용 레이아웃 컴포넌트: dialog-provider -->

<script setup lang="ts">
import AlertDialog from '@/components/layout/AlertDialog.vue'
import ConfirmDialog from '@/components/layout/ConfirmDialog.vue'
import { useDialog } from '@/composables/utils/useDialog'
import type { AlertOptions, ConfirmOptions } from '@/types/dialog'

const { state, close, handleConfirm, handleCancel } = useDialog()
</script>

<template>
  <AlertDialog
    v-if="state.type === 'alert'"
    :is-open="state.isOpen"
    :options="state.options as AlertOptions"
    @close="close"
    @confirm="handleConfirm"
  />

  <ConfirmDialog
    v-if="state.type === 'confirm'"
    :is-open="state.isOpen"
    :options="state.options as ConfirmOptions"
    @close="handleCancel"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  />
</template>
