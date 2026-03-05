<!-- 문서 경로: `@/src/features/shared/pages/NoticeDetailPage.vue`
문서 제목: 기능 페이지/컴포넌트: notice-detail-page -->

<template>
  <section class="notice-detail-page">
    <div v-if="detail">
      <h3>{{ detail.title || '-' }}</h3>
      <p class="meta">{{ detail.noticeDate || '-' }}</p>
      <article class="content" v-html="detail.content || ''"></article>
      <div class="nav-buttons">
        <button type="button" :disabled="!detail.prevNoticeId" @click="moveTo(detail.prevNoticeId)">
          이전글
        </button>
        <button type="button" :disabled="!detail.nextNoticeId" @click="moveTo(detail.nextNoticeId)">
          다음글
        </button>
      </div>
    </div>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <p v-else-if="isLoading">불러오는 중...</p>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

import { noticeAPI } from '@/api/services/notice'
import type { NoticeDetailResponse } from '@/types'

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)
const errorMessage = ref('')
const detail = ref<NoticeDetailResponse | null>(null)

const noticeId = computed(() => {
  const raw = String(route.params.noticeId ?? '')
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : 0
})

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return (payload as { data: T }).data
  }
  return payload as T
}

async function fetchNoticeDetail() {
  if (!noticeId.value) {
    detail.value = null
    errorMessage.value = '잘못된 공지사항 ID입니다.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await noticeAPI.getDetail({ id: noticeId.value })
    detail.value = unwrap<NoticeDetailResponse>(response)
  } catch (error) {
    console.error('[NOTICE] Failed to fetch notice detail', error)
    detail.value = null
    errorMessage.value = '공지사항 상세를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

function moveTo(id: number | null | undefined) {
  if (!id) return
  router.push({ name: 'NoticeDetail', params: { noticeId: String(id) } })
}

onMounted(() => {
  fetchNoticeDetail()
})

watch(
  () => route.params.noticeId,
  () => {
    fetchNoticeDetail()
  }
)
</script>

<style lang="scss" scoped>
.notice-detail-page {
  h3 {
    font-size: 24px;
    margin-bottom: 12px;
  }

  .meta {
    color: #888;
    margin-bottom: 24px;
  }

  .content {
    min-height: 240px;
    white-space: pre-wrap;
    line-height: 1.7;
  }

  .nav-buttons {
    margin-top: 20px;
    display: flex;
    gap: 8px;
  }

  .nav-buttons button {
    min-width: 86px;
    height: 34px;
    border: 1px solid #d0d0d0;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
  }

  .nav-buttons button:disabled {
    opacity: 0.45;
    cursor: default;
  }
}
</style>
