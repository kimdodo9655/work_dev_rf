<!-- 문서 경로: `@/src/features/registration/pages/sections/ApplicationSection.vue`
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
          <span class="tab-label">{{ displayRegistryType(tab.registryType) || '등기신청서' }}</span>
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
            <div class="sections-buttons">
              <button
                v-for="section in document.sections"
                :key="section.code"
                class="section-btn"
                @click="handleSectionClick(section)"
              >
                {{ formatTextLabel(section.title) }}
              </button>
            </div>
          </div>

          <ApplicationPaperPreview
            v-if="activeApplicationId"
            :application-id="activeApplicationId"
            :document="document"
          />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <div class="muted">등록된 등기신청서가 없습니다.</div>
    <button class="add-first-btn" @click="handleAddTab">첫 등기신청서 추가</button>
  </div>

  <Transition name="toast">
    <div v-if="successToastMessage" class="success-toast">
      {{ successToastMessage }}
    </div>
  </Transition>

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

  <CaseTypeAddModal
    v-if="showAddModal"
    :registry-management-number="registryManagementNumber"
    :existing-forms="tabs"
    :progress-type="progressType"
    @close="closeAddModal"
    @saved="handleAddSaved"
  />

  <CaseTypeAddModal
    v-if="showEditModal && activeApplicationId && document"
    mode="edit"
    :application-id="activeApplicationId"
    :registry-management-number="registryManagementNumber"
    :existing-forms="tabs"
    :progress-type="progressType"
    :initial-values="{
      registryType: document.registryType,
      registryCause: document.registryCause,
      registryMethod: document.registryMethod,
      adminInfoLinkTime: document.adminInfoLinkTime
    }"
    @close="closeEditModal"
    @saved="handleEditSaved"
  />
</template>

<script setup lang="ts">
import { toRef } from 'vue'

import ApplicationPaperPreview from '@/features/registration/components/ApplicationPaperPreview.vue'
import { useApplicationSection } from '@/features/registration/composables/useApplicationSection'
import CaseCertInfoRegModal from '@/features/registration/modals/application/CaseCertInfoRegModal.vue'
import CaseTypeAddModal from '@/features/registration/modals/application/CaseTypeAddModal.vue'
import SectionApiPreviewModal from '@/features/registration/modals/application/SectionApiPreviewModal.vue'

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
  closeAddModal,
  closeCertModal,
  closeEditModal,
  closeSectionModal,
  displayAdminInfoLinkTime,
  displayRegistryCause,
  displayRegistryMethod,
  displayRegistryType,
  formatTextLabel,
  activeApplicationId,
  document,
  documentErrorMessage,
  documentLoading,
  handleAddTab,
  handleAddSaved,
  handleDeleteTab,
  handleEditSaved,
  handleEditRegistryMethod,
  handleSectionClick,
  isDeletingTab,
  progressType,
  selectTab,
  showAddModal,
  showCertModal,
  showEditModal,
  showSectionModal,
  successToastMessage,
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
  gap: 14px;
}

.tabs-container {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
  overflow-x: auto;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  white-space: nowrap;
}

.tab-item.active {
  border-color: #0284c7;
  background: #e0f2fe;
  color: #0f172a;
}

.tab-label {
  font-size: 14px;
  font-weight: 700;
}

.tab-close-btn,
.tab-add-btn,
.edit-btn,
.add-first-btn {
  border: 0;
  cursor: pointer;
}

.tab-close-btn {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 14px;
  line-height: 1;
}

.tab-close-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-add-btn,
.add-first-btn {
  padding: 10px 16px;
  border-radius: 999px;
  background: #0ea5e9;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.tab-content {
  padding: 18px;
}

.info-table-wrapper {
  overflow-x: auto;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table th,
.info-table td {
  padding: 14px 12px;
  border: 1px solid #e5e7eb;
  text-align: left;
  font-size: 14px;
}

.info-table th {
  background: #f8fafc;
  color: #374151;
}

.editable-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.edit-btn {
  padding: 6px 10px;
  border-radius: 6px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
}

.sections-container {
  margin-top: 18px;
}

.sections-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.section-btn {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #fff;
}

.muted {
  color: #6b7280;
}

.error {
  color: #b91c1c;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 24, 39, 0.45);
}

.modal-container {
  width: min(1000px, calc(100vw - 32px));
  max-height: calc(100vh - 40px);
  overflow: auto;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.modal-close {
  border: 0;
  background: transparent;
  font-size: 34px;
  color: #9ca3af;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.success-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1300;
  padding: 14px 18px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.92);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.2);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 768px) {
  .tabs-header {
    padding: 10px;
  }

  .tab-content {
    padding: 14px;
  }

  .editable-cell {
    flex-direction: column;
    align-items: flex-start;
  }

  .success-toast {
    right: 16px;
    left: 16px;
    bottom: 16px;
  }
}
</style>
