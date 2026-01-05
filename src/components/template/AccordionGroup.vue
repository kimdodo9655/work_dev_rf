<template>
  <slot></slot>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue'

interface Props {
  mode?: 'single' | 'multiple'
  defaultOpen?: number[]
  allowEmpty?: boolean // true: 전부 닫기 가능, false: 최소 하나는 열려있어야 함
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'multiple',
  defaultOpen: () => [],
  allowEmpty: true
})

const openItem = ref<number | null>(props.mode === 'single' ? (props.defaultOpen[0] ?? null) : null)
const openItems = ref<number[]>(props.defaultOpen)

const toggleItem = (index: number) => {
  if (props.mode === 'single') {
    // single 모드
    if (props.allowEmpty) {
      // 전부 닫기 가능
      openItem.value = openItem.value === index ? null : index
    } else {
      // 무조건 하나는 열려있어야 함
      if (openItem.value !== index) {
        openItem.value = index
      }
    }
  } else {
    // multiple 모드
    const idx = openItems.value.indexOf(index)
    if (idx > -1) {
      // 닫으려고 할 때
      if (props.allowEmpty || openItems.value.length > 1) {
        // 전부 닫기 가능하거나, 2개 이상 열려있을 때만 닫기
        openItems.value.splice(idx, 1)
      }
    } else {
      // 열기
      openItems.value.push(index)
    }
  }
}

const isOpen = (index: number): boolean => {
  if (props.mode === 'single') {
    return openItem.value === index
  }
  return openItems.value.includes(index)
}

provide('isOpen', isOpen)
provide('toggleItem', toggleItem)
</script>
<!--
사용 예시:
<AccordionGroup mode="single" :default-open="[0]" :allow-empty="true">
  <ul>
    <AccordionItem :index="0">
      <template #title>제목</template>
      <template #content>내용</template>
    </AccordionItem>
  </ul>
</AccordionGroup>

Props:
- mode: 'single' | 'multiple' (기본: 'multiple') - 한 개만 열림 | 여러 개 열림
- defaultOpen: number[] (기본: []) - 초기 열림 인덱스
- allowEmpty: boolean (기본: true) - 전부 닫기 가능 여부
-->
