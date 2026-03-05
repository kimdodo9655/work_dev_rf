<!-- 문서 경로: `@/src/features/registration/pages/ApplicationSection.vue`
문서 제목: 기능 페이지/컴포넌트: application-section -->

<template>
  <div v-if="tabs.length > 0" class="application-container">
    <!-- 탭 메뉴 -->
    <div class="tabs-container">
      <div class="tabs-header">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.applicationId"
          :class="['tab-item', { active: activeTabIndex === index }]"
          @click="selectTab(index)"
        >
          <span class="tab-label">{{
            displayRegistryType(tab.registryTypeLabel ?? tab.registryType) || '등기신청서'
          }}</span>
          <!-- 삭제 버튼 (추후 기능 구현) -->
          <button
            v-if="canDeleteTab(tab)"
            class="tab-close-btn"
            :disabled="isDeletingTab(tab)"
            @click.stop="handleDeleteTab(tab)"
          >
            ×
          </button>
        </div>

        <!-- 탭 추가 버튼 (추후 기능 구현) -->
        <button class="tab-add-btn" @click="handleAddTab">+ 추가</button>
      </div>

      <!-- 탭 콘텐츠 -->
      <div class="tab-content">
        <div v-if="documentLoading" class="muted">불러오는 중…</div>
        <div v-else-if="documentErrorMessage" class="error">{{ documentErrorMessage }}</div>

        <div v-else-if="document" class="document-detail">
          <!-- 기본 정보 표 -->
          <div class="info-table-wrapper">
            <table class="info-table">
              <thead>
                <tr>
                  <th>등기유형</th>
                  <th>등기원인</th>
                  <th>등기방식</th>
                  <th>행정정보 연계시점</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ displayRegistryType(document.registryType) }}</td>
                  <td>{{ displayRegistryCause(document.registryCause) }}</td>
                  <td>
                    <div class="editable-cell">
                      <span>{{ displayRegistryMethod(document.registryMethod) }}</span>
                      <button class="edit-btn" @click="handleEditRegistryMethod">수정</button>
                    </div>
                  </td>
                  <td>{{ displayAdminInfoLinkTime(document.adminInfoLinkTime) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 섹션 버튼들 -->
          <div v-if="document.sections && document.sections.length > 0" class="sections-container">
            <div class="sections-title">등기신청서 섹션</div>
            <div class="sections-buttons">
              <button
                v-for="section in document.sections"
                :key="section.code"
                class="section-btn"
                @click="handleSectionClick(section)"
              >
                {{ displayText(section.title) }}
              </button>
            </div>
          </div>

          <!-- 신청서 양식 (개발 환경 전용) -->
          <component :is="pdfConverterComponent" v-if="pdfConverterComponent" />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <div class="muted">등록된 등기신청서가 없습니다.</div>
    <button class="add-first-btn" @click="handleAddTab">첫 등기신청서 추가</button>
  </div>

  <!-- 등기권리증 정보 등록 모달 -->
  <CaseCertInfoRegModal
    v-if="showCertModal && certModalApplicationId"
    :application-id="certModalApplicationId"
    @close="closeCertModal"
  />

  <div v-if="showSectionModal" class="modal-overlay" @click.self="closeSectionModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ activeSectionTitle || '등기신청서 섹션' }}</h2>
        <button type="button" class="modal-close" @click="closeSectionModal">×</button>
      </div>
      <div class="modal-body">
        <SectionApiPreviewModal
          v-if="sectionModalApplicationId"
          :application-id="sectionModalApplicationId"
          :section-code="activeSectionCode"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue'

import { useApplicationSection } from '@/features/registration/composables/useApplicationSection'
import CaseCertInfoRegModal from '@/features/registration/modals/CaseCertInfoRegModal.vue'
import SectionApiPreviewModal from '@/features/registration/modals/SectionApiPreviewModal.vue'

interface Props {
  registryManagementNumber: string
  isOpen: boolean
}

const props = defineProps<Props>()
const {
  activeTabIndex,
  activeSectionCode,
  sectionModalApplicationId,
  activeSectionTitle,
  canDeleteTab,
  certModalApplicationId,
  closeCertModal,
  closeSectionModal,
  displayAdminInfoLinkTime,
  displayRegistryCause,
  displayRegistryMethod,
  displayRegistryType,
  displayText,
  document,
  documentErrorMessage,
  documentLoading,
  handleAddTab,
  handleDeleteTab,
  handleEditRegistryMethod,
  handleSectionClick,
  isDeletingTab,
  pdfConverterComponent,
  selectTab,
  showCertModal,
  showSectionModal,
  tabs
} = useApplicationSection({
  registryManagementNumber: toRef(props, 'registryManagementNumber'),
  isOpen: toRef(props, 'isOpen')
})
</script>

<style scoped lang="scss">
.application-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tabs-container {
  display: flex;
  flex-direction: column;
}

.tabs-header {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid #e5e7eb;
  background: #fafafa;
  padding: 8px 8px 0 8px;
  border-radius: 10px 10px 0 0;
}

.tab-item {
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

.tab-label {
  flex: 1;
}

.tab-close-btn {
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

.tab-add-btn {
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

.tab-content {
  padding: 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 10px 10px;
  min-height: 200px;
}

.muted {
  color: #6b7280;
  text-align: center;
  padding: 20px 0;
}

.error {
  padding: 12px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  font-size: 13px;
}

.document-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-table-wrapper {
  overflow-x: auto;
}

.info-table {
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

.editable-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.edit-btn {
  padding: 4px 12px;
  font-size: 12px;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }
}

.sections-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sections-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.sections-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.section-btn {
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
}

.add-first-btn {
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}

.modal-container {
  width: min(960px, calc(100vw - 32px));
  max-height: calc(100vh - 40px);
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.modal-close {
  border: 0;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
}
</style>
