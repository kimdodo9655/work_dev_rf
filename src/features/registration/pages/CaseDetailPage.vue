<!-- 문서 경로: `@/src/features/registration/pages/CaseDetailPage.vue`
문서 제목: 기능 페이지/컴포넌트: case-detail-page -->

<template>
  <section class="detail-layout">
    <!-- 좌측: 업무 프로세스 아코디언 -->
    <aside class="sidebar">
      <section class="work-process">
        <h2 class="work-process-title">업무 프로세스</h2>

        <div v-if="processLoading" class="process-state">업무 프로세스를 불러오는 중입니다.</div>
        <div v-else-if="processErrorMessage" class="process-state error">
          {{ processErrorMessage }}
        </div>
        <div v-else-if="processItems.length === 0" class="process-state">
          표시할 업무 프로세스가 없습니다.
        </div>

        <ul v-else class="process-list">
          <li v-for="(item, index) in processItems" :key="item.id" class="process-item-wrap">
            <article :class="['process-item', { active: item.isCurrent }]">
              <button
                type="button"
                class="process-header-btn"
                @click="toggleProcessItem(item.id)"
                :aria-expanded="openedProcessId === item.id"
              >
                <span class="process-header-title">{{ item.title }}</span>
                <span v-if="openedProcessId !== item.id" class="process-arrow">&gt;</span>
              </button>

              <div v-if="openedProcessId === item.id" class="process-body">
                <p
                  class="process-text"
                  v-for="(line, lineIdx) in item.descriptionLines"
                  :key="lineIdx"
                >
                  {{ line }}
                </p>
                <div class="process-buttons">
                  <button
                    v-for="(btn, btnIdx) in item.buttons"
                    :key="`${item.id}-btn-${btnIdx}-${btn.action || 'ACTION'}`"
                    type="button"
                    class="process-btn"
                    :disabled="isChangingProcess"
                    @click="handleProcessActionClick(btn)"
                  >
                    {{ btn.label }}
                  </button>
                </div>
              </div>
            </article>

            <div
              v-if="index < processItems.length - 1"
              class="process-dot"
              aria-hidden="true"
            ></div>
          </li>
        </ul>
      </section>
    </aside>

    <!-- 우측: 전체 UI -->
    <main class="content">
      <div class="accordion">
        <!-- 1) 등기 의뢰 정보 -->
        <div data-scroll-id="accordion-REQ">
          <AccordionSection title="등기 의뢰 정보" :is-open="openMap.REQ" @toggle="toggle('REQ')">
            <div class="request-section">
              <RequestInfoSection
                :registry-management-number="registryManagementNumber"
                :is-open="openMap.REQ"
              />
            </div>
          </AccordionSection>
        </div>

        <!-- 2) 등기신청서 정보 등록 -->
        <div data-scroll-id="accordion-APP">
          <AccordionSection
            class="detail-accordion"
            title="등기신청서 정보 등록"
            :is-open="openMap.APP"
            @toggle="toggle('APP')"
          >
            <div class="application-section">
              <ApplicationSection
                :registry-management-number="registryManagementNumber"
                :is-open="openMap.APP"
              />
            </div>
          </AccordionSection>
        </div>

        <!-- 3) 행정정보 제공 요구 동의요청 -->
        <div v-show="showAdminSection" data-scroll-id="accordion-ADMIN">
          <AccordionSection
            title="행정정보 제공 요구 동의요청"
            :is-open="openMap.ADMIN"
            @toggle="toggle('ADMIN')"
          >
            <AdminSection
              class="admin-section"
              :registry-management-number="registryManagementNumber"
              :is-open="openMap.ADMIN"
              @loaded="handleAdminLoaded"
            />
          </AccordionSection>
        </div>

        <!-- 4) 등기 진행 정보 등록 -->
        <div data-scroll-id="accordion-PROG">
          <AccordionSection
            class="detail-accordion"
            title="등기 진행 정보 등록"
            :is-open="openMap.PROG"
            @toggle="toggle('PROG')"
          >
            <div class="progress-section">
              <ProgressSection
                :registry-management-number="registryManagementNumber"
                :is-open="openMap.PROG"
              />
            </div>
          </AccordionSection>
        </div>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useAccordionState } from '@/composables/utils/useAccordionState'
import { useCaseDetailProcess } from '@/features/registration/composables/useCaseDetailProcess'

import AccordionSection from './sections/AccordionSection.vue'
import AdminSection from './sections/AdminSection.vue'
import ApplicationSection from './sections/ApplicationSection.vue'
import ProgressSection from './sections/ProgressSection.vue'
import RequestInfoSection from './sections/RequestInfoSection.vue'

const route = useRoute()
const registryManagementNumber = computed(() => String(route.params.caseId ?? ''))

// 아코디언 상태 관리
const { openMap, toggle } = useAccordionState()

// AdminSection 표시 여부 (데이터가 있을 때만 표시)
const showAdminSection = ref(false) // 초기에는 숨김 (AdminSection이 데이터 로드 후 알려줌)
const {
  openedProcessId,
  processLoading,
  processErrorMessage,
  processItems,
  isChangingProcess,
  toggleProcessItem,
  handleProcessActionClick
} = useCaseDetailProcess({
  registryManagementNumber,
  openMap,
  showAdminSection
})

function handleAdminLoaded(hasData: boolean) {
  showAdminSection.value = hasData
}
</script>

<style scoped lang="scss">
.detail-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  background-color: #fff;
}

.sidebar {
  position: sticky;
  top: 16px;
}

.work-process {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
}

.work-process-title {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.process-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.process-state {
  font-size: 12px;
  color: #6b7280;
  padding: 6px 2px 2px;
}

.process-state.error {
  color: #b91c1c;
}

.process-item-wrap {
  display: block;
}

.process-item {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.process-item.active {
  border-color: #2563eb;
  background: #f9fafb;
}

.process-header-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  background: transparent;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
}

.process-header-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.process-arrow {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
}

.process-body {
  padding: 0 12px 10px;
}

.process-text {
  margin: 0;
  font-size: 12px;
  color: #4b5563;
  line-height: 1.45;
}

.process-buttons {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.process-btn {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: #374151;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.process-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.process-dot {
  display: none;
}

.process-item-wrap + .process-item-wrap {
  margin-top: 8px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 40px 20px 80px;
  min-width: 0;
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

:deep(.accordion .acc-section) {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

:deep(.accordion .acc-header) {
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
    background: #eee;
  }
}

:deep(.accordion .acc-title) {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

:deep(.accordion .acc-icon) {
  transition: transform 0.15s ease;
  color: #6b7280;
}

:deep(.accordion .acc-icon.open) {
  transform: rotate(180deg);
}

:deep(.accordion .acc-body) {
  border-top: 1px solid #ddd;
  padding: 12px;
}

:deep(.application-section .application-container) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(.application-section .tabs-container) {
  display: flex;
  flex-direction: column;
}

:deep(.application-section .tabs-header) {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid #e5e7eb;
  background: #fafafa;
  padding: 8px 8px 0 8px;
  border-radius: 10px 10px 0 0;
}

:deep(.application-section .tab-item) {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }

  &.active {
    color: #3b82f6;
    background: #fff;
    border-bottom: 2px solid #3b82f6;
    font-weight: 600;
  }
}

:deep(.application-section .tab-label) {
  flex: 1;
}

:deep(.application-section .tab-close-btn) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 18px;
  line-height: 1;
  color: #9ca3af;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

:deep(.application-section .tab-add-btn) {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }
}

:deep(.application-section .tab-content) {
  padding: 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 10px 10px;
  min-height: 200px;
}

:deep(.application-section .document-detail) {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

:deep(.application-section .info-table-wrapper) {
  overflow-x: auto;
}

:deep(.application-section .info-table) {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;

  thead {
    background: #f9fafb;

    th {
      padding: 12px 16px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
    }
  }

  tbody {
    td {
      padding: 12px 16px;
      font-size: 13px;
      color: #111827;
      border-bottom: 1px solid #f3f4f6;
    }
  }
}

:deep(.application-section .editable-cell) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

:deep(.application-section .sections-container) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.application-section .sections-title) {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

:deep(.application-section .sections-buttons) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.application-section .section-btn) {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #3b82f6;
  }
}

:deep(.application-section .empty-state) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
}

:deep(.application-section .modal-overlay) {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}

:deep(.application-section .modal-container) {
  width: min(960px, calc(100vw - 32px));
  max-height: calc(100vh - 40px);
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

:deep(.application-section .modal-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.application-section .modal-title) {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

:deep(.application-section .modal-close) {
  border: 0;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
}

:deep(.application-section .modal-body) {
  padding: 16px;
}

:deep(.request-section .sub-list),
:deep(.admin-section .sub-list),
:deep(.progress-section .sub-list) {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.request-section .sub-item),
:deep(.admin-section .sub-item),
:deep(.progress-section .sub-item) {
  padding: 10px 12px;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  background: #eee;
  font-size: 13px;
  color: #111827;
}

:deep(.request-section .sub-title),
:deep(.admin-section .sub-title),
:deep(.progress-section .sub-title) {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #111827;
}

:deep(.request-section .case-detail),
:deep(.admin-section .case-detail),
:deep(.progress-section .case-detail) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.progress-section .caption) {
  font-size: 12px;
  color: #4b5563;
}

:deep(.application-section .muted),
:deep(.request-section .muted),
:deep(.admin-section .muted),
:deep(.progress-section .muted) {
  color: #6b7280;
  text-align: center;
  padding: 10px 0;
}

:deep(.application-section .error),
:deep(.request-section .error),
:deep(.admin-section .error),
:deep(.progress-section .error) {
  padding: 12px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  font-size: 13px;
}

:deep(.admin-section .table-wrapper),
:deep(.progress-section .table-wrapper) {
  overflow-x: auto;
}

:deep(.admin-section .data-table-area),
:deep(.progress-section .data-table-area) {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;

  thead {
    background: #f9fafb;

    th {
      padding: 12px 8px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f9fafb;
      }
    }

    td {
      padding: 12px 8px;
      font-size: 13px;
      color: #111827;
      white-space: nowrap;
    }
  }
}

:deep(.progress-section .empty-cell) {
  text-align: center;
  color: #6b7280;
}

:deep(.application-section .edit-btn),
:deep(.request-section .detail-btn),
:deep(.admin-section .detail-btn),
:deep(.progress-section .detail-btn) {
  padding: 4px 12px;
  font-size: 12px;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }
}

:deep(.application-section .add-first-btn) {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
  }
}

:deep(.request-section .card) {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
}

:deep(.request-section .row) {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

:deep(.request-section .label) {
  width: 140px;
  font-size: 12px;
  color: #6b7280;
}

:deep(.request-section .value) {
  font-size: 13px;
  color: #111827;
}

:deep(.progress-section .status-completed) {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #059669;
  background: #d1fae5;
  border-radius: 6px;
}

:deep(.progress-section .status-waiting) {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  background: #f3f4f6;
  border-radius: 6px;
}

:deep(.progress-section .status-requested) {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #f59e0b;
  background: #fef3c7;
  border-radius: 6px;
}

:deep(.progress-section .status-rejected) {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #dc2626;
  background: #fee2e2;
  border-radius: 6px;
}

:deep(.progress-section .status-default) {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  background: #f3f4f6;
  border-radius: 6px;
}
</style>
