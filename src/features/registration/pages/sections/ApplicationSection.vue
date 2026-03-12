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
import CaseCertInfoRegModal from '@/features/registration/modals/application/CaseCertInfoRegModal.vue'
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
  closeCertModal,
  closeSectionModal,
  displayAdminInfoLinkTime,
  displayRegistryCause,
  displayRegistryMethod,
  displayRegistryType,
  formatTextLabel,
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
