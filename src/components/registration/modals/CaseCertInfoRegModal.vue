<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <!-- 헤더 -->
      <div class="modal-header">
        <div class="header-content">
          <h2 class="modal-title">등기권리증 정보 등록</h2>
          <p class="modal-subtitle">등기권리증 정보</p>
        </div>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <!-- 컨텐츠 -->
      <div class="modal-body">
        <div v-if="loading" class="loading">불러오는 중…</div>
        <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

        <div v-else class="content-wrapper">
          <!-- 아이템 카드 리스트 -->
          <div class="items-section">
            <div class="items-list">
              <div
                v-for="(item, index) in items"
                :key="index"
                :class="['item-card', { active: selectedIndex === index }]"
                @click="selectItem(index)"
              >
                <button class="item-delete-btn" @click.stop="deleteItem(index)">삭제</button>
                <div class="item-summary">
                  <div class="item-number">{{ item.propertyUniqueNumber || '부동산 미선택' }}</div>
                  <div class="item-details">
                    <div>• 등기의무자 {{ getOwnerName(item.ownerId) || '-' }}</div>
                    <div>
                      • 보유지분 {{ item.holdingShareNumerator || 0 }} 분의
                      {{ item.holdingShareDenominator || 0 }}
                    </div>
                    <div>
                      • 접수정보 {{ getSectionName(item.section) || '-' }}
                      {{ item.rankNumber || '-' }}번
                    </div>
                    <div>• 등기권리증 {{ getCertificateTypeName(item.certificateType) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 추가 버튼 (하단 고정) -->
            <button class="add-item-btn" @click="addItem">추가</button>
          </div>

          <!-- 입력 폼 -->
          <div v-if="selectedItem" class="form-section">
            <div class="form-grid">
              <!-- 부동산 고유번호 -->
              <div class="form-field">
                <label class="form-label">부동산 고유번호 선택</label>
                <select v-model="selectedItem.propertyUniqueNumber" class="form-select">
                  <option value="">선택하세요</option>
                  <option
                    v-for="option in options.propertyUniqueNumberOptions"
                    :key="option.propertyUniqueNumber"
                    :value="option.propertyUniqueNumber"
                  >
                    {{ option.propertyUniqueNumber }}
                  </option>
                </select>
              </div>

              <!-- 성명(명칭) -->
              <div class="form-field">
                <label class="form-label">성명(명칭)</label>
                <select v-model="selectedItem.ownerId" class="form-select">
                  <option :value="undefined">선택하세요</option>
                  <option
                    v-for="option in options.ownerOptions"
                    :key="option.partyId"
                    :value="option.progressPartyId"
                  >
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <!-- 보유지분 -->
              <div class="form-field">
                <label class="form-label">보유지분 입력</label>
                <div class="fraction-input">
                  <input
                    v-model.number="selectedItem.holdingShareNumerator"
                    type="number"
                    class="form-input"
                    placeholder="분자"
                  />
                  <span class="fraction-divider">분의</span>
                  <input
                    v-model.number="selectedItem.holdingShareDenominator"
                    type="number"
                    class="form-input"
                    placeholder="분모"
                  />
                </div>
              </div>

              <!-- 이전지분 -->
              <div class="form-field">
                <label class="form-label">이전지분 입력</label>
                <div class="fraction-input">
                  <input
                    v-model.number="selectedItem.transferShareNumerator"
                    type="number"
                    class="form-input"
                    placeholder="분자"
                  />
                  <span class="fraction-divider">분의</span>
                  <input
                    v-model.number="selectedItem.transferShareDenominator"
                    type="number"
                    class="form-input"
                    placeholder="분모"
                  />
                </div>
              </div>

              <!-- 해당구 -->
              <div class="form-field">
                <label class="form-label">해당구 선택</label>
                <select v-model="selectedItem.section" class="form-select">
                  <option value="">선택하세요</option>
                  <option v-for="option in options.sectionOptions" :key="option" :value="option">
                    {{ getSectionName(option) }}
                  </option>
                </select>
              </div>

              <!-- 순위번호 -->
              <div class="form-field">
                <label class="form-label">순위번호 입력</label>
                <input v-model="selectedItem.rankNumber" type="text" class="form-input" />
              </div>

              <!-- 접수일자 -->
              <div class="form-field">
                <label class="form-label">접수일자 검색</label>
                <input v-model="selectedItem.receiptDate" type="date" class="form-input" />
              </div>

              <!-- 접수번호 -->
              <div class="form-field">
                <label class="form-label">접수번호 입력</label>
                <input v-model="selectedItem.receiptNumber" type="text" class="form-input" />
              </div>

              <!-- 등기권리증 구분 -->
              <div class="form-field">
                <label class="form-label">등기권리증 구분 선택</label>
                <select v-model="selectedItem.certificateType" class="form-select">
                  <option value="">선택하세요</option>
                  <option
                    v-for="option in options.certificateTypeOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ getCertificateTypeName(option) }}
                  </option>
                </select>
              </div>

              <!-- 일련번호 -->
              <div class="form-field">
                <label class="form-label">일련번호 입력</label>
                <input
                  v-model="selectedItem.certificateSerialNumber"
                  type="text"
                  class="form-input"
                />
              </div>

              <!-- 비밀번호 -->
              <div class="form-field">
                <label class="form-label">비밀번호 입력</label>
                <input v-model="selectedItem.certificatePassword" type="text" class="form-input" />
              </div>

              <!-- 비밀번호 사용여부 조회 버튼 -->
              <div class="form-field full-width">
                <button class="check-password-btn" @click="handleCheckPassword">
                  비밀번호 사용여부 조회
                </button>
              </div>
            </div>
          </div>

          <div v-else class="empty-form">
            <p class="muted">아이템을 선택하거나 추가해주세요</p>
          </div>
        </div>
      </div>

      <!-- 푸터 -->
      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose">취소</button>
        <button class="save-btn" @click="handleSave">저장</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { registryCertificateAPI } from '@/api/services/registry'

interface Props {
  applicationId: number
}

interface CertificateItem {
  propertyUniqueNumber: string
  ownerId: number
  holdingShareDenominator: number
  holdingShareNumerator: number
  transferShareDenominator: number
  transferShareNumerator: number
  section: 'GAP' | 'EUL' | ''
  rankNumber: string
  receiptDate: string
  receiptNumber: string
  certificateType: string
  certificateSerialNumber?: string
  certificatePasswordSequence?: string
  certificatePassword?: string
}

interface Options {
  propertyUniqueNumberOptions: Array<{ applicationId?: number; propertyUniqueNumber?: string }>
  ownerOptions: Array<{ partyId?: number; progressPartyId?: number; name?: string }>
  sectionOptions: string[]
  certificateTypeOptions: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const loading = ref(false)
const errorMessage = ref('')
const items = ref<CertificateItem[]>([])
const selectedIndex = ref<number | null>(null)
const options = ref<Options>({
  propertyUniqueNumberOptions: [],
  ownerOptions: [],
  sectionOptions: [],
  certificateTypeOptions: []
})

const selectedItem = computed(() => {
  if (selectedIndex.value === null) return null
  return items.value[selectedIndex.value]
})

function unwrapData<T>(res: any): T {
  if (res?.data && typeof res.data === 'object' && 'data' in res.data) return res.data.data as T
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return undefined as unknown as T
}

// 등기권리증 구분 이름 변환
function getCertificateTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    REGISTRY_CERT_INFO: '등기필정보',
    REGISTRY_CERTIFICATE: '등기필증',
    CONFIRMATION_DOCUMENT: '확인문서',
    PRIOR_REGISTRY_LINK: '이전등기연계'
  }
  return typeMap[type] || type
}

// 해당구 한글 변환
function getSectionName(section: string): string {
  const sectionMap: Record<string, string> = {
    GAP: '갑구',
    EUL: '을구'
  }
  return sectionMap[section] || section
}

// 소유자 이름 조회
function getOwnerName(ownerId?: number): string {
  if (!ownerId) return '-'
  // ownerId는 실제로 progressPartyId 값임
  const owner = options.value.ownerOptions.find((o) => o.progressPartyId === ownerId)
  return owner?.name || '-'
}

// 데이터 조회
async function fetchData() {
  loading.value = true
  errorMessage.value = ''
  try {
    const res: any = await registryCertificateAPI.getDetail({
      applicationId: props.applicationId
    })
    const data = unwrapData<any>(res)

    // 기존 아이템 로드
    items.value = (data.items || []).map((item: any) => ({
      propertyUniqueNumber: item.propertyUniqueNumber || '',
      ownerId: item.progressPartyId || 0,
      holdingShareDenominator: item.holdingShareDenominator || 1,
      holdingShareNumerator: item.holdingShareNumerator || 1,
      transferShareDenominator: item.transferShareDenominator || 1,
      transferShareNumerator: item.transferShareNumerator || 1,
      section: item.section || '',
      rankNumber: item.rankNumber || '',
      receiptDate: item.receiptDate || '',
      receiptNumber: item.receiptNumber || '',
      certificateType: item.certificateType || '',
      certificateSerialNumber: item.certificateSerialNumber || '',
      certificatePassword: item.certificatePassword || ''
    }))

    // 옵션 로드
    options.value = {
      propertyUniqueNumberOptions: data.propertyUniqueNumberOptions || [],
      ownerOptions: data.ownerOptions || [],
      sectionOptions: data.sectionOptions || [],
      certificateTypeOptions: data.certificateTypeOptions || []
    }

    // 아이템이 있으면 첫 번째 선택
    if (items.value.length > 0) {
      selectedIndex.value = 0
    }
  } catch (e: any) {
    errorMessage.value = e?.message || '등기권리증 정보 조회 실패'
  } finally {
    loading.value = false
  }
}

// 아이템 선택
function selectItem(index: number) {
  selectedIndex.value = index
}

// 아이템 추가
function addItem() {
  const newItem: CertificateItem = {
    propertyUniqueNumber: '',
    ownerId: 0, // select에서 partyId를 선택하면 여기에 저장됨
    holdingShareDenominator: 1,
    holdingShareNumerator: 1,
    transferShareDenominator: 1,
    transferShareNumerator: 1,
    section: '',
    rankNumber: '',
    receiptDate: '',
    receiptNumber: '',
    certificateType: '',
    certificateSerialNumber: '',
    certificatePassword: ''
  }
  items.value.push(newItem)
  selectedIndex.value = items.value.length - 1
}

// 아이템 삭제
function deleteItem(index: number) {
  items.value.splice(index, 1)
  if (selectedIndex.value === index) {
    selectedIndex.value = items.value.length > 0 ? 0 : null
  } else if (selectedIndex.value !== null && selectedIndex.value > index) {
    selectedIndex.value--
  }
}

// 비밀번호 사용여부 조회 (추후 구현)
function handleCheckPassword() {
  console.log('비밀번호 사용여부 조회 - 추후 구현')
  // TODO: API 호출
}

// 저장
async function handleSave() {
  loading.value = true
  errorMessage.value = ''
  try {
    // 필수 값 검증
    const invalidItems = items.value.filter(
      (item) =>
        !item.propertyUniqueNumber || !item.ownerId || !item.section || !item.certificateType
    )
    if (invalidItems.length > 0) {
      errorMessage.value =
        '부동산 고유번호, 성명(명칭), 해당구, 등기권리증 구분은 필수 입력 항목입니다.'
      return
    }

    // items를 API 요청 형태로 변환
    const certificateItems = items.value.map((item) => {
      // ownerId는 이미 progressPartyId 값임 (select에서 progressPartyId를 바인딩)
      return {
        propertyUniqueNumber: item.propertyUniqueNumber,
        progressPartyId: item.ownerId, // ownerId에 이미 progressPartyId가 저장되어 있음
        holdingShareDenominator: item.holdingShareDenominator,
        holdingShareNumerator: item.holdingShareNumerator,
        transferShareDenominator: item.transferShareDenominator,
        transferShareNumerator: item.transferShareNumerator,
        section: item.section as 'GAP' | 'EUL',
        rankNumber: item.rankNumber,
        receiptDate: item.receiptDate,
        receiptNumber: item.receiptNumber,
        certificateType: item.certificateType as
          | 'REGISTRY_CERT_INFO'
          | 'REGISTRY_CERTIFICATE'
          | 'CONFIRMATION_DOCUMENT'
          | 'PRIOR_REGISTRY_LINK',
        certificateSerialNumber: item.certificateSerialNumber,
        certificatePasswordSequence: item.certificatePasswordSequence,
        certificatePassword: item.certificatePassword
      }
    })

    // API 호출 - R02G-02 등기권리증 대체
    await registryCertificateAPI.replace(
      { applicationId: props.applicationId },
      { certificateItems } as any // 타입 불일치로 as any 필요
    )

    alert('저장되었습니다')
    emit('close')
  } catch (e: any) {
    errorMessage.value = e?.message || '저장 실패'
  } finally {
    loading.value = false
  }
}

// 닫기
function handleClose() {
  emit('close')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
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
  z-index: 1000;
}

.modal-container {
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  flex: 1;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
}

.modal-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #9ca3af;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.error {
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 13px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  height: 600px;
}

.items-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-right: 1px solid #e5e7eb;
  padding-right: 24px;
  height: 100%;
}

.items-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-right: 4px;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #9ca3af;
    }
  }
}

.item-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    border-color: #bfdbfe;
    background: #eff6ff;
  }

  &.active {
    border-color: #3b82f6;
    background: #eff6ff;
  }
}

.item-delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  font-size: 11px;
  color: #dc2626;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fecaca;
  }
}

.item-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-number {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  word-break: break-all;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.add-item-btn {
  flex-shrink: 0;
  padding: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
  background: #fff;
  border: 2px dashed #bfdbfe;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
}

.form-section {
  flex: 1;
  overflow-y: visible;
  padding-right: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.full-width {
    grid-column: 1 / -1;
  }
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-select {
  padding: 10px 12px;
  font-size: 13px;
  color: #111827;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.fraction-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fraction-divider {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.check-password-btn {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dbeafe;
  }
}

.empty-form {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  height: 100%;
}

.muted {
  color: #9ca3af;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn,
.save-btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  color: #374151;
  background: #fff;
  border: 1px solid #d1d5db;

  &:hover {
    background: #f9fafb;
  }
}

.save-btn {
  color: #fff;
  background: #3b82f6;
  border: none;

  &:hover {
    background: #2563eb;
  }
}
</style>
