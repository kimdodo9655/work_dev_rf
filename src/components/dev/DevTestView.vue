<template>
  <div class="app-container">
    <div class="test-page">
      <h1 class="page-title">개발 테스트 페이지</h1>

      <!-- 공통코드 테스트 섹션 -->
      <section class="test-section">
        <h2>공통코드 테스트</h2>

        <div class="code-categories">
          <button
            v-for="category in codeCategories"
            :key="category.key"
            class="category-btn"
            :class="{ active: selectedCategory === category.key }"
            @click="loadCategory(category.key)"
          >
            {{ category.label }}
            <span v-if="categoryData[category.key]" class="count">
              ({{ categoryData[category.key]!.length }})
            </span>
          </button>
        </div>

        <div v-if="isLoading" class="loading">로딩 중...</div>

        <div v-if="selectedCategory && categoryData[selectedCategory]" class="code-result">
          <div class="result-header">
            <h3>
              {{ codeCategories.find((c) => c.key === selectedCategory)?.label }}
            </h3>
            <button @click="copyToClipboard" class="copy-btn">📋 JSON 복사</button>
          </div>

          <div class="code-table-wrapper">
            <table class="code-table">
              <thead>
                <tr>
                  <th>코드</th>
                  <th v-if="selectedCategory === 'userRoleLevels'">레벨</th>
                  <th>설명</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="code in categoryData[selectedCategory]" :key="code.code">
                  <td>
                    <code class="code-text">{{ code.code }}</code>
                  </td>
                  <td v-if="selectedCategory === 'userRoleLevels'">
                    <code class="code-text">{{ (code as RoleLevelCode).level }}</code>
                  </td>
                  <td>{{ code.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="json-preview">
            <h4>JSON 미리보기</h4>
            <pre>{{ JSON.stringify(categoryData[selectedCategory], null, 2) }}</pre>
          </div>
        </div>

        <div v-if="!selectedCategory && !isLoading" class="empty-state">
          <p>👆 위에서 카테고리를 선택하세요</p>
        </div>
      </section>

      <!-- 유틸리티 함수 테스트 섹션 -->
      <section v-if="selectedCategory && categoryData[selectedCategory]" class="test-section">
        <h2>유틸리티 함수 테스트</h2>

        <div class="utility-grid">
          <div class="utility-card">
            <h3>getCodeLabel</h3>
            <div class="test-case">
              <code class="code-block">
                getCodeLabel('{{ selectedCategory }}', '{{ firstCode?.code }}')
              </code>
              <div class="result">
                결과: <strong>{{ labelResult }}</strong>
              </div>
            </div>
          </div>

          <div v-if="selectedCategory === 'userRoleLevels'" class="utility-card">
            <h3>getRoleLevel</h3>
            <div class="test-case">
              <code class="code-block"> getRoleLevel('{{ firstCode?.code }}') </code>
              <div class="result">
                결과: <strong>{{ roleLevelResult }}</strong>
              </div>
            </div>
          </div>

          <div class="utility-card">
            <h3>getCodeOptions</h3>
            <div class="test-case">
              <code class="code-block">getCodeOptions('{{ selectedCategory }}')</code>
              <div class="result">
                <div v-for="option in optionsResult" :key="option.value" class="option-item">
                  { value: "{{ option.value }}", label: "{{ option.label }}" }
                </div>
              </div>
            </div>
          </div>

          <div class="utility-card">
            <h3>hasCode</h3>
            <div class="test-case">
              <code class="code-block">
                hasCode('{{ selectedCategory }}', '{{ firstCode?.code }}')
              </code>
              <div class="result">
                결과: <strong class="success">{{ hasCodeResult }}</strong>
              </div>
            </div>
            <div class="test-case">
              <code class="code-block">hasCode('{{ selectedCategory }}', 'INVALID_CODE')</code>
              <div class="result">
                결과: <strong class="error">{{ hasInvalidCodeResult }}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { codesAPI } from '@/api/codes'
import { useCodes } from '@/composables/useCodes'
import type { Code, CodeKey, RoleLevelCode } from '@/types'

// ============================================================================
// Composable
// ============================================================================

const { getCodeLabel, getRoleLevel, getCodeOptions, hasCode } = useCodes()

// ============================================================================
// State
// ============================================================================

const selectedCategory = ref<CodeKey | null>(null)
const categoryData = ref<Partial<Record<CodeKey, Code[] | RoleLevelCode[]>>>({})
const isLoading = ref(false)

const codeCategories = [
  { key: 'organizationTypes', label: '기관 유형' },
  { key: 'organizationStatuses', label: '기관 상태' },
  { key: 'qualifiedTypes', label: '자격 유형' },
  { key: 'branchStatuses', label: '지점 상태' },
  { key: 'userRoleLevels', label: '사용자 권한 레벨' },
  { key: 'registryTypes', label: '등기 유형' },
  { key: 'registryCauses', label: '등기 원인' },
  { key: 'partyTypes', label: '당사자 유형' },
  { key: 'propertyTypes', label: '부동산 유형' },
  { key: 'sections', label: '구역' },
  { key: 'registryMethods', label: '등기 방법' },
  { key: 'securedDebtScopeTypes', label: '담보채무 범위 유형' },
  { key: 'certificateTypes', label: '권리증 유형' },
  { key: 'workTypes', label: '업무 유형' },
  { key: 'paymentStatuses', label: '지급 상태' },
  { key: 'adminInfoLinkTime', label: '행정정보 연계 시간' }
] as const

// ============================================================================
// Computed
// ============================================================================

const firstCode = computed(() => {
  if (!selectedCategory.value || !categoryData.value[selectedCategory.value]) return null
  const data = categoryData.value[selectedCategory.value]
  return data && data.length > 0 ? data[0] : null
})

const labelResult = computed(() => {
  if (!selectedCategory.value || !firstCode.value) return '-'
  return getCodeLabel(selectedCategory.value, firstCode.value.code)
})

const roleLevelResult = computed(() => {
  if (!firstCode.value) return '-'
  return getRoleLevel(firstCode.value.code)
})

const optionsResult = computed(() => {
  if (!selectedCategory.value) return []
  return getCodeOptions(selectedCategory.value)
})

const hasCodeResult = computed(() => {
  if (!selectedCategory.value || !firstCode.value) return false
  return hasCode(selectedCategory.value, firstCode.value.code)
})

const hasInvalidCodeResult = computed(() => {
  if (!selectedCategory.value) return false
  return hasCode(selectedCategory.value, 'INVALID_CODE')
})

// ============================================================================
// Methods
// ============================================================================

const apiMethodMap: Record<CodeKey, () => Promise<any>> = {
  organizationTypes: codesAPI.getOrganizationTypes,
  organizationStatuses: codesAPI.getOrganizationStatuses,
  qualifiedTypes: codesAPI.getQualifiedTypes,
  branchStatuses: codesAPI.getBranchStatuses,
  userRoleLevels: codesAPI.getUserRoleLevels,
  registryTypes: codesAPI.getRegistryTypes,
  registryCauses: codesAPI.getRegistryCauses,
  partyTypes: codesAPI.getPartyTypes,
  propertyTypes: codesAPI.getPropertyTypes,
  sections: codesAPI.getSections,
  registryMethods: codesAPI.getRegistryMethods,
  securedDebtScopeTypes: codesAPI.getSecuredDebtScopeTypes,
  certificateTypes: codesAPI.getCertificateTypes,
  workTypes: codesAPI.getWorkTypes,
  paymentStatuses: codesAPI.getPaymentStatuses,
  adminInfoLinkTime: codesAPI.getAdminInfoLinkTime
}

async function loadCategory(category: CodeKey) {
  selectedCategory.value = category

  // 이미 로드된 데이터가 있으면 API 호출 생략
  if (categoryData.value[category]) {
    return
  }

  isLoading.value = true

  try {
    const response = await apiMethodMap[category]()
    categoryData.value[category] = response.data
  } catch (error) {
    console.error('Failed to load category:', error)
    alert('코드 조회에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

async function copyToClipboard() {
  if (!selectedCategory.value || !categoryData.value[selectedCategory.value]) return

  const json = JSON.stringify(categoryData.value[selectedCategory.value], null, 2)

  try {
    await navigator.clipboard.writeText(json)
    alert('클립보드에 복사되었습니다!')
  } catch (error) {
    console.error('Failed to copy:', error)
    alert('복사에 실패했습니다.')
  }
}
</script>

<style scoped lang="scss">
.test-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
  color: #1e293b;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #1e293b;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 12px;
  }
}

.code-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.category-btn {
  background: white;
  border: 2px solid #e2e8f0;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  color: #475569;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #3b82f6;
  }

  &.active {
    border-color: #3b82f6;
    background: #3b82f6;
    color: white;
  }

  .count {
    font-size: 12px;
    opacity: 0.8;
    margin-left: 4px;
  }
}

.loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 16px;
}

.code-result {
  margin-top: 24px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }
}

.copy-btn {
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    background: #eff6ff;
  }
}

.code-table-wrapper {
  overflow-x: auto;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.code-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background: #f8fafc;
    font-weight: 600;
    font-size: 14px;
    color: #475569;
  }

  td {
    font-size: 14px;
    color: #1e293b;
  }

  tbody tr:hover {
    background: #f8fafc;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}

.code-text {
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #3b82f6;
}

.json-preview {
  h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #475569;
  }

  pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.6;
    max-height: 400px;
    overflow-y: auto;
  }
}

.utility-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.utility-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #1e293b;
  }

  .test-case {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .code-block {
    display: block;
    background: white;
    padding: 10px 12px;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    margin-bottom: 10px;
    color: #3b82f6;
    border: 1px solid #e2e8f0;
    word-break: break-all;
  }

  .result {
    padding: 10px 12px;
    background: white;
    border-radius: 6px;
    font-size: 14px;
    border: 1px solid #e2e8f0;

    strong {
      color: #16a34a;

      &.success {
        color: #16a34a;
      }

      &.error {
        color: #dc2626;
      }
    }

    .option-item {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #64748b;
      margin-top: 6px;
      padding: 4px 8px;
      background: #f8fafc;
      border-radius: 4px;

      &:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>
