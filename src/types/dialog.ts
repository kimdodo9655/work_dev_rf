// types/dialog.ts
export interface AlertOptions {
  title: string
  content: string
  confirmText?: string
  onConfirm?: () => void | Promise<void>
}

export interface ConfirmOptions {
  title: string
  content: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
}

export interface DialogState {
  isOpen: boolean
  type: 'alert' | 'confirm' | null
  options: AlertOptions | ConfirmOptions | null
  resolve?: (value: boolean) => void
}
