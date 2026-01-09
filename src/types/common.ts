/**
 * Select 옵션
 */
export interface SelectOption<T = string | number> {
  value: T
  label: string
  disabled?: boolean
}

/**
 * 테이블 컬럼
 */
export interface TableColumn {
  key: string
  label: string
  width?: string
  minWidth?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

/**
 * CustomSelect 컴포넌트 Props
 */
export interface CustomSelectProps {
  /** v-model로 바인딩될 선택된 값 */
  modelValue: string | number | null
  /** 셀렉트 옵션 배열 */
  options: SelectOption[]
  /** placeholder 텍스트 */
  placeholder?: string
  /** 셀렉트 비활성화 여부 */
  disabled?: boolean
}

/**
 * CustomSelect 컴포넌트 Emits
 */
export interface CustomSelectEmits {
  /** v-model 업데이트 이벤트 */
  (e: 'update:modelValue', value: string | number): void
  /** 값 변경 이벤트 */
  (e: 'change', value: string | number): void
}
