// composables/useDialog.ts
import { reactive } from 'vue'

import type { AlertOptions, ConfirmOptions, DialogState } from '@/types/dialog'

const state = reactive<DialogState>({
  isOpen: false,
  type: null,
  options: null,
  resolve: undefined
})

export const useDialog = () => {
  const alert = (options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      state.isOpen = true
      state.type = 'alert'
      state.options = options
      state.resolve = resolve
    })
  }

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      state.isOpen = true
      state.type = 'confirm'
      state.options = options
      state.resolve = resolve
    })
  }

  const close = () => {
    state.isOpen = false
    if (state.resolve) {
      state.resolve(false)
    }
    setTimeout(() => {
      state.type = null
      state.options = null
      state.resolve = undefined
    }, 200)
  }

  const handleConfirm = async () => {
    const options = state.options as AlertOptions | ConfirmOptions

    if (options?.onConfirm) {
      await options.onConfirm()
    }

    if (state.resolve) {
      state.resolve(true)
    }

    state.isOpen = false
    setTimeout(() => {
      state.type = null
      state.options = null
      state.resolve = undefined
    }, 200)
  }

  const handleCancel = async () => {
    const options = state.options as ConfirmOptions

    if (options?.onCancel) {
      await options.onCancel()
    }

    if (state.resolve) {
      state.resolve(false)
    }

    state.isOpen = false
    setTimeout(() => {
      state.type = null
      state.options = null
      state.resolve = undefined
    }, 200)
  }

  return {
    state,
    alert,
    confirm,
    close,
    handleConfirm,
    handleCancel
  }
}
