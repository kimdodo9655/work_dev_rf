<template>
  <section class="paper-section">
    <h4 class="section-title">{{ block.title }}</h4>

    <div v-if="block.type === 'info'" class="info-grid">
      <div v-for="item in infoItems" :key="item.label" :class="['info-item', { wide: item.wide }]">
        <span class="label">{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>
    </div>

    <div v-else-if="block.type === 'summary'" class="two-column-grid">
      <div v-for="item in summaryItems" :key="item.label" class="summary-item">
        <span class="label">{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>
    </div>

    <div v-else-if="block.type === 'party'" class="party-grid">
      <div v-for="section in block.sections" :key="section.title" class="party-card">
        <div class="party-title">{{ section.title }}</div>
        <ul class="party-list">
          <li v-for="party in section.items" :key="party.key" class="party-item">
            <strong>{{ party.name }}</strong>
            <span>{{ party.meta }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-else-if="block.type === 'property'" class="stack-list">
      <div v-for="item in propertyItems" :key="item.title" class="list-card">
        <div class="list-card-title">{{ item.title }}</div>
        <p v-for="(line, index) in item.lines" :key="`${item.title}-${index}`" class="body-text">
          {{ line }}
        </p>
      </div>
    </div>

    <div v-else-if="block.type === 'attachment'" class="chip-list">
      <span v-for="item in textItems" :key="item" class="chip">{{ item }}</span>
    </div>

    <div v-else-if="block.type === 'certificate'" class="stack-list">
      <div class="list-card">
        <p v-for="item in textItems" :key="item" class="body-text">{{ item }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface LabelValueItem {
  label: string
  value: string
  wide?: boolean
}

interface PartyItem {
  key: string
  name: string
  meta: string
}

interface PartySection {
  title: string
  items: PartyItem[]
}

interface TextGroupItem {
  title: string
  lines: string[]
}

interface PaperBlock {
  id: string
  title: string
  type: 'info' | 'summary' | 'party' | 'property' | 'attachment' | 'certificate'
  items: Array<LabelValueItem | string | TextGroupItem>
  sections?: PartySection[]
}

const props = defineProps<{
  block: PaperBlock
}>()

const infoItems = computed(() => props.block.items as LabelValueItem[])
const summaryItems = computed(() => props.block.items as LabelValueItem[])
const propertyItems = computed(() => props.block.items as TextGroupItem[])
const textItems = computed(() => props.block.items as string[])
</script>

<style scoped lang="scss">
.paper-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}

.info-grid,
.two-column-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.info-item,
.summary-item,
.party-card,
.list-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafafa;
}

.info-item,
.summary-item {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item.wide {
  grid-column: 1 / -1;
}

.label {
  font-size: 11px;
  color: #6b7280;
}

.info-item strong,
.summary-item strong,
.party-item strong {
  font-size: 12px;
  color: #111827;
  font-weight: 600;
}

.party-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.party-card {
  padding: 10px 12px;
}

.party-title,
.list-card-title {
  font-size: 12px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.party-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.party-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.party-item span,
.body-text {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: #374151;
}

.stack-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-card {
  padding: 10px 12px;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  border: 1px solid #dbe4f0;
  background: #f3f6fb;
  color: #1f2937;
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 11px;
}
</style>
