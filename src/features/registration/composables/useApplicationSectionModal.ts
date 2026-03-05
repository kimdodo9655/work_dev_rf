/**
 * 문서 경로: `@/src/features/registration/composables/useApplicationSectionModal.ts`
 * 문서 제목: 기능 모듈: use-application-section-modal
 */

import { computed, type Ref, ref } from 'vue'

export function useApplicationSectionModal({
  activeApplicationId
}: {
  activeApplicationId: Ref<number | undefined>
}) {
  const showCertModal = ref(false)
  const certModalApplicationId = ref<number | null>(null)
  const showSectionModal = ref(false)
  const sectionModalApplicationId = ref<number | null>(null)
  const activeSectionCode = ref<string>('')
  const activeSectionTitle = ref<string>('')

  function openCertModal() {
    const appId = activeApplicationId.value
    if (!appId) {
      console.error('applicationId가 없습니다')
      return
    }
    certModalApplicationId.value = appId
    showCertModal.value = true
  }

  function closeCertModal() {
    showCertModal.value = false
    certModalApplicationId.value = null
  }

  function openSectionModal(section: { code?: string; title?: string }) {
    const appId = activeApplicationId.value
    if (!appId) {
      console.error('applicationId가 없습니다')
      return
    }
    sectionModalApplicationId.value = appId
    activeSectionCode.value = section.code ?? ''
    activeSectionTitle.value = section.title ?? '섹션 정보'
    showSectionModal.value = true
  }

  function closeSectionModal() {
    showSectionModal.value = false
    sectionModalApplicationId.value = null
    activeSectionCode.value = ''
    activeSectionTitle.value = ''
  }

  function handleSectionClick(section: { code?: string; title?: string }) {
    console.log('섹션 클릭:', section)
    if (section.code === 'OWNER_CERT_INFO') {
      openCertModal()
      return
    }
    openSectionModal(section)
  }

  return {
    activeSectionCode: computed(() => activeSectionCode.value),
    activeSectionTitle: computed(() => activeSectionTitle.value),
    sectionModalApplicationId: computed(() => sectionModalApplicationId.value),
    certModalApplicationId: computed(() => certModalApplicationId.value),
    closeCertModal,
    closeSectionModal,
    handleSectionClick,
    showSectionModal: computed(() => showSectionModal.value),
    showCertModal: computed(() => showCertModal.value)
  }
}
