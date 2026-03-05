<!-- 문서 경로: `@/src/features/shared/pages/NoticePage.vue`
문서 제목: 기능 페이지/컴포넌트: notice-page -->

<template>
  <section class="notice-page">
    <h3>공지사항</h3>
    <p class="meta">전체 {{ totalItems }}건</p>

    <ul class="notice-list">
      <li v-for="item in notices" :key="item.noticeId">
        <router-link :to="{ name: 'NoticeDetail', params: { noticeId: String(item.noticeId) } }">
          <p :class="{ important: isImportantNotice(item) }">{{ item.title || '-' }}</p>
          <p>{{ item.noticeDate || '-' }}</p>
        </router-link>
      </li>
      <li v-if="!isLoading && notices.length === 0">
        <p>공지사항이 없습니다.</p>
      </li>
      <li v-if="errorMessage">
        <p>{{ errorMessage }}</p>
      </li>
    </ul>

    <Pagination
      v-model:current-page="currentPage"
      :total-items="totalItems"
      :items-per-page="pageSize"
    />
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

import { noticeAPI } from '@/api/services/notice'
import Pagination from '@/components/template/PaginationItem.vue'
import type { NoticeResponse } from '@/types'

const notices = ref<NoticeResponse[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const totalItems = ref(0)
const pageSize = 10

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return (payload as { data: T }).data
  }
  return payload as T
}

function normalizeNoticeList(source: unknown): NoticeResponse[] {
  if (Array.isArray(source)) return source as NoticeResponse[]
  if (source && typeof source === 'object') {
    const obj = source as Record<string, unknown>
    if (Array.isArray(obj.content)) return obj.content as NoticeResponse[]
    if (Array.isArray(obj.noticeList)) return obj.noticeList as NoticeResponse[]
    if (Array.isArray(obj.items)) return obj.items as NoticeResponse[]
    if ('noticeId' in obj || 'title' in obj) return [obj as NoticeResponse]
  }
  return []
}

function extractSearchPayload(source: unknown): {
  content: NoticeResponse[]
  totalPages: number
  totalElements: number
} {
  const empty = { content: [], totalPages: 0, totalElements: 0 }
  if (!source || typeof source !== 'object') return empty

  const obj = source as Record<string, unknown>
  const content = Array.isArray(obj.content) ? (obj.content as NoticeResponse[]) : []
  const totalPages =
    typeof obj.totalPages === 'number'
      ? obj.totalPages
      : typeof obj.totalPage === 'number'
        ? obj.totalPage
        : 0

  const totalElements =
    typeof obj.totalElements === 'number'
      ? obj.totalElements
      : typeof obj.totalCount === 'number'
        ? obj.totalCount
        : content.length

  return { content, totalPages, totalElements }
}

function isImportantNotice(item: NoticeResponse): boolean {
  if (item.isImportant === true) return true
  return (item.title ?? '').includes('[중요]')
}

async function fetchNotices() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await noticeAPI.search({
      searchKyword: '',
      page: currentPage.value,
      size: pageSize
    })
    const payload = extractSearchPayload(unwrap<unknown>(res))
    notices.value = payload.content
    totalItems.value = payload.totalElements
  } catch (error) {
    console.error('[NOTICE] Failed to fetch notice list', error)
    // 검색 API 실패 시 메인 상위 5개 API로 폴백
    try {
      const fallback = await noticeAPI.getList()
      notices.value = normalizeNoticeList(unwrap<unknown>(fallback))
      totalItems.value = notices.value.length
    } catch {
      notices.value = []
      totalItems.value = 0
    }
    errorMessage.value = '공지사항을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchNotices()
})

watch(currentPage, () => {
  fetchNotices()
})
</script>

<style lang="scss" scoped>
.notice-page {
  .meta {
    margin-bottom: 10px;
    color: #666;
  }

  h3 {
    font-size: 24px;
    margin-bottom: 16px;
  }

  .notice-list {
    border-top: 1px solid #ddd;
  }

  .notice-list li {
    border-bottom: 1px solid #eee;
  }

  .notice-list a {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 8px;
  }

  .notice-list p:first-child {
    flex: 1;
  }

  .notice-list p.important {
    color: #d62828 !important;
    font-weight: 700;
  }

  .notice-list p:last-child {
    color: #888;
    flex-shrink: 0;
  }
}
</style>
