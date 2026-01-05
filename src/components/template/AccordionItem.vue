// components/AccordionItem.vue
<template>
  <li :class="{ active: computedIsOpen }">
    <h1 @click="handleToggle">
      <slot name="title"></slot>
      <i class="fi fi-rr-caret-down"></i>
    </h1>
    <div
      class="accordion-content-wrapper"
      :style="{ maxHeight: computedIsOpen ? contentHeight + 'px' : '0px' }"
    >
      <div class="accordion-content" ref="contentRef">
        <slot name="content"></slot>
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, ref } from 'vue'

interface Props {
  index: number
}

const props = defineProps<Props>()

const contentRef = ref<HTMLElement | null>(null)
const contentHeight = ref<number>(0)

const isOpenFn = inject<(index: number) => boolean>('isOpen', () => false)
const toggleItemFn = inject<(index: number) => void>('toggleItem', () => {})

const computedIsOpen = computed(() => isOpenFn(props.index))

const handleToggle = () => {
  toggleItemFn(props.index)
}

const updateHeight = () => {
  if (contentRef.value) {
    contentHeight.value = contentRef.value.scrollHeight
  }
}

onMounted(() => {
  updateHeight()
})

defineExpose({
  updateHeight
})
</script>

<style lang="scss" scoped>
li {
  display: flex;
  flex-direction: column;

  h1 {
    padding: 20px;
    font-size: 21px;
    display: flex;
    justify-content: space-between;
    border-radius: 10px;
    border: 1px solid #33cccc;
    color: #33cccc;
    cursor: pointer;
    transition: all 0.3s ease;

    i {
      color: #21adad;
      transition: transform 0.3s ease;
    }
  }

  .accordion-content-wrapper {
    overflow: hidden;
    transition:
      max-height 0.4s ease,
      margin-top 0.4s ease;
  }

  &.active {
    h1 {
      border: 1px solid #21adad;
      color: #21adad;
      background-color: #ebf7f8;

      i {
        transform: rotate(180deg);
      }
    }

    .accordion-content-wrapper {
      margin-top: 40px;
    }
  }
}
</style>
<!--
Props:
- index: number (필수)
  - 아이템의 고유 인덱스

Slots:
- title: 아코디언 헤더 영역
- content: 아코디언 콘텐츠 영역

Methods (exposed):
- updateHeight(): 콘텐츠 높이 재계산 (동적 콘텐츠 변경 시 사용)
-->
