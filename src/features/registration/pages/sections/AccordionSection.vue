<!-- 문서 경로: `@/src/features/registration/pages/sections/AccordionSection.vue`
문서 제목: 기능 페이지/컴포넌트: accordion-section -->

<template>
  <section class="acc-section">
    <button type="button" class="acc-header" @click="emit('toggle')">
      <span class="acc-title">{{ title }}</span>
      <span class="acc-icon" :class="{ open: isOpen }">▾</span>
    </button>

    <div v-show="isOpen" class="acc-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: []
}>()
</script>
