<!-- 문서 경로: `@/src/features/dev/pages/AddrTestPanel.vue`
문서 제목: 기능 페이지/컴포넌트: addr-test-panel -->

<template>
  <div class="addr-test-section">
    <h3>주소 검색 모달 테스트</h3>

    <!-- 트리거 버튼들 -->
    <div class="button-group">
      <button type="button" class="btn btn-primary" @click="openModal('search')">주소 검색</button>
      <button type="button" class="btn btn-secondary" @click="openModal('autocomplete')">
        주소 자동완성
      </button>
      <button type="button" class="btn btn-tertiary" @click="openModal('registry')">
        등기소 조회
      </button>
    </div>

    <!-- 모달 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal-container">
            <!-- 모달 헤더 -->
            <div class="modal-header">
              <h2 class="modal-title">
                {{
                  modalMode === 'search'
                    ? '주소 검색'
                    : modalMode === 'autocomplete'
                      ? '주소 자동완성'
                      : '등기소 조회'
                }}
              </h2>
              <button type="button" class="btn-close" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>

            <!-- 모달 바디 -->
            <div class="modal-body">
              <!-- 검색 모드 -->
              <div v-if="modalMode === 'search'" class="search-mode">
                <div class="search-input-group">
                  <input
                    v-model="searchKeyword"
                    type="text"
                    class="search-input"
                    placeholder="주소를 입력하세요 (최소 2자)"
                    @keyup.enter="handleSearch"
                  />
                  <button
                    type="button"
                    class="btn btn-search"
                    :disabled="searchKeyword.length < 2 || isLoading"
                    @click="handleSearch"
                  >
                    {{ isLoading ? '검색 중...' : '검색' }}
                  </button>
                </div>

                <div class="search-results">
                  <div v-if="isLoading && addresses.length === 0" class="loading-state">
                    <div class="spinner"></div>
                    <p>검색 중입니다...</p>
                  </div>

                  <div v-else-if="addresses.length > 0" class="result-list">
                    <div
                      v-for="(address, index) in addresses"
                      :key="index"
                      class="result-item"
                      @click="selectAddress(address)"
                    >
                      <div class="address-road">
                        <span class="badge badge-road">도로명</span>
                        {{ address.roadAddress }}
                      </div>
                      <div class="address-jibun">
                        <span class="badge badge-jibun">지번</span>
                        {{ address.jibunAddress }}
                      </div>
                    </div>

                    <div v-if="hasMore" class="load-more-wrapper">
                      <button
                        type="button"
                        class="btn btn-load-more"
                        :disabled="isLoading"
                        @click="loadMore"
                      >
                        {{ isLoading ? '로딩 중...' : '더보기' }}
                      </button>
                    </div>
                  </div>

                  <div v-else class="empty-state">
                    <p>검색 결과가 없습니다.</p>
                    <p class="empty-hint">다른 키워드로 검색해보세요.</p>
                  </div>
                </div>
              </div>

              <!-- 자동완성 모드 -->
              <div v-if="modalMode === 'autocomplete'" class="autocomplete-mode">
                <div class="search-input-group">
                  <input
                    v-model="autocompleteKeyword"
                    type="text"
                    class="search-input"
                    placeholder="주소를 입력하세요"
                    @input="handleAutocomplete"
                  />
                </div>

                <div class="autocomplete-results">
                  <div v-if="suggestions.length > 0" class="suggestion-list">
                    <div
                      v-for="(suggestion, index) in suggestions"
                      :key="index"
                      class="suggestion-item"
                      @click="selectSuggestion(suggestion)"
                    >
                      <span class="suggestion-icon">📍</span>
                      {{ suggestion }}
                    </div>
                  </div>

                  <div v-else-if="autocompleteKeyword.length > 0" class="empty-state">
                    <p>자동완성 결과가 없습니다.</p>
                  </div>

                  <div v-else class="empty-state">
                    <p>주소를 입력하면 자동완성 결과가 나타납니다.</p>
                  </div>
                </div>
              </div>

              <!-- 등기소 모드 -->
              <div v-if="modalMode === 'registry'" class="registry-mode">
                <div class="search-input-group">
                  <input
                    :value="registryKeyword"
                    type="text"
                    class="search-input"
                    placeholder="등기소명 또는 관할지역 정보 입력"
                    @input="(e) => (registryKeyword = (e.target as HTMLInputElement).value)"
                  />
                </div>

                <div class="registry-results">
                  <div v-if="isLoadingRegistry" class="loading-state">
                    <div class="spinner"></div>
                    <p>등기소 목록을 불러오는 중...</p>
                  </div>

                  <div v-else-if="filteredRegistryOffices.length > 0" class="registry-list">
                    <div
                      v-for="(office, index) in filteredRegistryOffices"
                      :key="office.id || index"
                      class="registry-item"
                      @click="selectRegistryOffice(office)"
                    >
                      <div class="registry-row">
                        <span class="registry-label">등기소</span>
                        <span class="registry-name">{{ office.name }}</span>
                      </div>
                      <div class="registry-row">
                        <span class="registry-label">관할지역</span>
                        <span class="registry-jurisdiction">{{ office.jurisdictionArea }}</span>
                      </div>
                    </div>
                  </div>

                  <div v-else class="empty-state">
                    <p>검색 결과에서 적용할 관할등기소를 선택바랍니다.</p>
                    <div class="empty-hints">
                      <p class="empty-hint">※ 입력 값 또는 입력 결과 값이 존재하지 않습니다.</p>
                      <p class="empty-hint">
                        빠르고 정확한 검색을 위해 아래와 같은 조합으로 검색해보세요.
                      </p>
                      <p class="empty-hint-example">
                        * 등기소명 또는 시/도 또는 시/군/구 정보 입력
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 선택된 결과 표시 (모달 내부) -->
              <div v-if="selectedResult" class="selected-result">
                <div class="selected-header">
                  <span class="selected-label">선택된 주소</span>
                  <button type="button" class="btn-clear" @click="clearSelection">초기화</button>
                </div>
                <div class="selected-content">
                  {{ selectedResult }}
                </div>
              </div>
            </div>

            <!-- 모달 푸터 -->
            <div class="modal-footer">
              <button type="button" class="btn btn-cancel" @click="closeModal">취소</button>
              <button
                type="button"
                class="btn btn-confirm"
                :disabled="!selectedResult"
                @click="confirmSelection"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 확정된 주소 표시 (모달 밖) -->
    <div v-if="confirmedAddress" class="confirmed-address-display">
      <div class="address-display-header">
        <span class="address-display-label">선택된 주소</span>
        <button type="button" class="btn-clear-confirmed" @click="clearConfirmedAddress">
          초기화
        </button>
      </div>
      <div class="address-display-content">
        <span class="address-display-icon">📍</span>
        <span class="address-display-text">{{ confirmedAddress }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { addressAPI } from '@/api/services/address'
import { useAddress } from '@/composables/api/useAddress'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import type { AddressItem, RegistryOfficeDetailResponse } from '@/types'

/** axios 응답({data}) / DTO 응답(그 자체) 둘 다 지원 */
function unwrap<T>(res: any): T {
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return res as T
}

const {
  addresses,
  suggestions,
  isLoading,
  hasMore,
  searchAddresses,
  getAddressSuggestions,
  loadMore: loadMoreAddresses,
  reset
} = useAddress()

const { handleError } = useErrorHandler()

const isModalOpen = ref(false)
const modalMode = ref<'search' | 'autocomplete' | 'registry'>('search')
const searchKeyword = ref('')
const autocompleteKeyword = ref('')
const registryKeyword = ref('')
const selectedResult = ref('')
const confirmedAddress = ref('')

const registryOffices = ref<RegistryOfficeDetailResponse[]>([])
const isLoadingRegistry = ref(false)

let autocompleteTimer: ReturnType<typeof setTimeout> | null = null
let registrySearchTimer: ReturnType<typeof setTimeout> | null = null

const filteredRegistryOffices = computed(() => {
  return registryOffices.value
})

const openModal = async (mode: 'search' | 'autocomplete' | 'registry') => {
  modalMode.value = mode
  isModalOpen.value = true
  reset()
  searchKeyword.value = ''
  autocompleteKeyword.value = ''
  registryKeyword.value = ''
  selectedResult.value = ''
}

const closeModal = () => {
  isModalOpen.value = false
  reset()
  searchKeyword.value = ''
  autocompleteKeyword.value = ''
  registryKeyword.value = ''
  selectedResult.value = ''
}

const handleSearch = async () => {
  if (searchKeyword.value.length < 2) return
  await searchAddresses(searchKeyword.value)
}

const handleAutocomplete = () => {
  if (autocompleteTimer) clearTimeout(autocompleteTimer)

  autocompleteTimer = setTimeout(async () => {
    await getAddressSuggestions(autocompleteKeyword.value)
  }, 300)
}

const loadMore = async () => {
  await loadMoreAddresses(searchKeyword.value)
}

const selectAddress = (address: AddressItem) => {
  selectedResult.value = address.roadAddress || ''
}

const selectSuggestion = (suggestion: string) => {
  selectedResult.value = suggestion
}

const selectRegistryOffice = (office: RegistryOfficeDetailResponse) => {
  selectedResult.value = `${office.name || ''} (${office.jurisdictionArea || ''})`
}

/**
 * ✅ 등기소 조회
 * - payload 형태가 달라도 registryOffices 배열을 최대한 안전하게 추출
 */
const loadRegistryOffices = async () => {
  isLoadingRegistry.value = true
  try {
    const keyword = registryKeyword.value.trim()

    if (keyword.length < 2) {
      registryOffices.value = []
      return
    }

    const res = await addressAPI.registryOffices({
      keyword,
      size: 0
    }) // ✅ 신규 서비스 방식(권장)
    const payload = unwrap<any>(res)

    // 케이스 대응:
    // 1) payload.registryOffices
    // 2) payload.items
    // 3) payload.result.registryOffices
    // 4) payload.result.items
    const root = payload?.result ?? payload
    registryOffices.value = (root?.registryOffices ??
      root?.items ??
      []) as RegistryOfficeDetailResponse[]
  } catch (error) {
    handleError(error, 'LOAD_REGISTRY_OFFICES')
    registryOffices.value = []
  } finally {
    isLoadingRegistry.value = false
  }
}

const clearSelection = () => {
  selectedResult.value = ''
}

const confirmSelection = () => {
  if (!selectedResult.value) return
  confirmedAddress.value = selectedResult.value
  closeModal()
}

const clearConfirmedAddress = () => {
  confirmedAddress.value = ''
}

watch(isModalOpen, (newVal) => {
  if (!newVal) {
    if (autocompleteTimer) {
      clearTimeout(autocompleteTimer)
      autocompleteTimer = null
    }
    if (registrySearchTimer) {
      clearTimeout(registrySearchTimer)
      registrySearchTimer = null
    }
  }
})

watch(
  registryKeyword,
  (newValue) => {
    if (newValue.length < 2) {
      registryOffices.value = []
      if (registrySearchTimer) {
        clearTimeout(registrySearchTimer)
        registrySearchTimer = null
      }
      return
    }

    if (registrySearchTimer) clearTimeout(registrySearchTimer)

    registrySearchTimer = setTimeout(async () => {
      await loadRegistryOffices()
    }, 100)
  },
  { flush: 'sync' }
)
</script>

<style scoped lang="scss">
.addr-test-section {
  margin-bottom: 40px;
  padding: 24px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;

  h3 {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
  }
}

.button-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: #667eea;
  color: white;

  &:hover:not(:disabled) {
    background: #5568d3;
  }
}

.btn-secondary {
  background: #48bb78;
  color: white;

  &:hover:not(:disabled) {
    background: #38a169;
  }
}

.btn-tertiary {
  background: #ed8936;
  color: white;

  &:hover:not(:disabled) {
    background: #dd6b20;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 32px;
  color: #a0aec0;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f7fafc;
    color: #4a5568;
  }
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
}

.search-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
}

.btn-search {
  background: #667eea;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #5568d3;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.search-results,
.autocomplete-results,
.registry-results {
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
}

.result-list,
.suggestion-list,
.registry-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    background: #f7fafc;
  }
}

.address-road {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.address-jibun {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #718096;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-road {
  background: #edf2f7;
  color: #667eea;
}

.badge-jibun {
  background: #f7fafc;
  color: #718096;
}

.suggestion-item {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #2d3748;
  transition: all 0.2s;

  &:hover {
    border-color: #48bb78;
    background: #f0fff4;
  }
}

.suggestion-icon {
  font-size: 16px;
}

.registry-item {
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:hover {
    border-color: #ed8936;
    background: #fffaf0;
  }
}

.registry-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.registry-label {
  flex-shrink: 0;
  width: 70px;
  padding: 4px 8px;
  background: #fef3c7;
  color: #92400e;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  text-align: center;
}

.registry-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
  line-height: 1.6;
}

.registry-jurisdiction {
  flex: 1;
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
  word-break: keep-all;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #718096;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
  color: #4a5568;

  p {
    margin: 0;
    font-size: 14px;

    &:first-child {
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 20px;
    }
  }
}

.empty-hints {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-hint {
  font-size: 13px;
  color: #718096;
  line-height: 1.6;
}

.empty-hint-example {
  font-size: 13px;
  color: #3b82f6;
  line-height: 1.6;
  padding-left: 8px;
}

.load-more-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.btn-load-more {
  background: #f7fafc;
  color: #667eea;
  border: 2px solid #e2e8f0;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #667eea;
    background: #edf2f7;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.selected-result {
  margin-top: 20px;
  padding: 16px;
  background: #f0fff4;
  border: 2px solid #48bb78;
  border-radius: 8px;
}

.selected-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.selected-label {
  font-size: 13px;
  font-weight: 600;
  color: #38a169;
}

.btn-clear {
  background: none;
  border: none;
  color: #718096;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #e6fffa;
    color: #38a169;
  }
}

.selected-content {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  line-height: 1.6;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
}

.btn-confirm {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #5568d3;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.confirmed-address-display {
  margin-top: 24px;
  padding: 20px;
  background: #f0fdf4;
  border: 2px solid #86efac;
  border-radius: 12px;
}

.address-display-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.address-display-label {
  font-size: 14px;
  font-weight: 600;
  color: #22c55e;
}

.btn-clear-confirmed {
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid #86efac;
  color: #16a34a;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dcfce7;
    border-color: #4ade80;
  }
}

.address-display-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
}

.address-display-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.address-display-text {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.6;
  word-break: keep-all;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

.search-results::-webkit-scrollbar,
.autocomplete-results::-webkit-scrollbar,
.registry-results::-webkit-scrollbar {
  width: 8px;
}

.search-results::-webkit-scrollbar-track,
.autocomplete-results::-webkit-scrollbar-track,
.registry-results::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 4px;
}

.search-results::-webkit-scrollbar-thumb,
.autocomplete-results::-webkit-scrollbar-thumb,
.registry-results::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;

  &:hover {
    background: #a0aec0;
  }
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }

  .address-display-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
