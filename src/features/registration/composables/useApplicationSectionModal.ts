import { computed, type Ref, ref } from 'vue'

export function useApplicationSectionModal({
  activeApplicationId
}: {
  activeApplicationId: Ref<number | undefined>
}) {
  const showCertModal = ref(false)
  const certModalApplicationId = ref<number | null>(null)

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

  function handleSectionClick(section: { code?: string; title?: string }) {
    console.log('섹션 클릭:', section)
    if (section.code === 'OWNER_CERT_INFO') {
      openCertModal()
    }
  }

  return {
    certModalApplicationId: computed(() => certModalApplicationId.value),
    closeCertModal,
    handleSectionClick,
    showCertModal: computed(() => showCertModal.value)
  }
}
