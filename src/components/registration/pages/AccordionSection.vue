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

<style scoped lang="scss">
.acc-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.acc-header {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  background: #fff;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }
}

.acc-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.acc-icon {
  transition: transform 0.15s ease;
  color: #6b7280;
}

.acc-icon.open {
  transform: rotate(180deg);
}

.acc-body {
  border-top: 1px solid #f3f4f6;
  padding: 12px;
}
</style>
