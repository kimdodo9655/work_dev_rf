<!-- 문서 경로: `@/src/features/registration/pages/CaseStatusContainer.vue`
문서 제목: 기능 페이지/컴포넌트: case-status-container -->

<template>
  <section class="registry-progress">
    <div class="Search-panel">
      <form @submit.prevent="handleSearch(true)">
        <div class="input-area">
          <SearchSelect
            v-model="filters.workType"
            label="업무구분"
            :options="workTypeOptions"
            :disabled="codesLoading"
          />
          <SearchSelect
            v-model="filters.assignedWork"
            label="배정업무"
            :options="assignedWorkOptions"
            :disabled="codesLoading"
          />
          <SearchSelect
            v-model="filters.registryMethod"
            label="등기방식"
            :options="registryMethodOptions"
            :disabled="codesLoading"
          />
          <SearchSelect
            v-model="filters.managerUserId"
            label="업무담당자"
            :options="managerOptions"
            :disabled="assignableLoading"
          />
          <SearchDateRangePicker v-model="requestDateRange" label="등기의뢰일자 선택" />
          <SearchDateRangePicker v-model="receiptDateRange" label="등기접수일자 선택" />
          <SearchSelect
            v-model="filters.progressStatus"
            label="진행상태"
            :options="progressStatusOptions"
            :disabled="codesLoading"
          />
          <SearchInput
            v-model="filters.keyword"
            label="통합검색"
            placeholder="부동산 주소 또는 신청번호"
            :disabled="loading"
          />
        </div>
        <input type="submit" value="검색" :disabled="loading" />
      </form>
      <div v-if="codesError || assignableError" class="inline-error">
        {{ codesError || assignableError }}
      </div>
    </div>

    <div v-if="errorMessage" class="inline-error">{{ errorMessage }}</div>

    <div class="table-wrap">
      <table class="data-table">
        <colgroup>
          <col style="width: 5%" />
          <col style="width: 12%" />
          <col style="width: 8%" />
          <col style="width: 8%" />
          <col style="width: 8%" />
          <col />
          <col style="width: 7%" />
          <col style="width: 7%" />
          <col style="width: 8%" />
          <col style="width: 10%" />
          <col style="width: 4%" />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th>등기신청번호</th>
            <th>업무구분</th>
            <th>배정업무</th>
            <th>등기방식</th>
            <th>부동산주소</th>
            <th>의뢰일자</th>
            <th>접수일자</th>
            <th>담당자</th>
            <th>진행상태</th>
            <th>상세</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="info-text">
            <td colspan="11">불러오는 중...</td>
          </tr>
          <tr v-else-if="rows.length === 0" class="info-text">
            <td colspan="11">조회 결과가 없습니다.</td>
          </tr>
          <tr v-for="r in rows" v-else :key="r.registryManagementNumber" class="row">
            <td>{{ r.rowNum }}</td>
            <td>{{ r.registryRequestNumber }}</td>
            <td class="cell-wrap">{{ formatCodeLabel(r.workType, 'workTypes') }}</td>
            <td class="cell-wrap">{{ displayAssignedWork(r.assignedWork) }}</td>
            <td class="cell-wrap">{{ formatCodeLabel(r.registryMethod, 'registryMethods') }}</td>
            <td class="address-cell">{{ displayAddress(r.propertyAddress) }}</td>
            <td>{{ r.registryRequestDate }}</td>
            <td>{{ r.registryReceiptDate }}</td>
            <td>
              <template v-if="isAssigneeRole && isUnassigned(r.managerUserName)">
                <button
                  type="button"
                  class="assign-btn"
                  :disabled="assigningSet.has(r.registryManagementNumber) || !userId"
                  @click.stop="handleAssignMyself(r.registryManagementNumber)"
                >
                  {{ assigningSet.has(r.registryManagementNumber) ? '처리중...' : '배정받기' }}
                </button>
              </template>
              <template v-else-if="isManagerRole">
                <select
                  class="inline-select"
                  :value="rowSelectedManager.get(r.registryManagementNumber) ?? ''"
                  :disabled="assigningSet.has(r.registryManagementNumber) || assignableLoading"
                  @click.stop
                  @change.stop="(e) => onAdminSelectChange(r.registryManagementNumber, e)"
                >
                  <option value="" disabled>미배정</option>
                  <option
                    v-for="u in getRowAssignableUsers(r.assignedWork)"
                    :key="u.userId"
                    :value="String(u.userId)"
                  >
                    {{ u.userName }}
                  </option>
                </select>
              </template>
              <template v-else>
                {{ r.managerUserName }}
              </template>
            </td>
            <td class="cell-wrap">{{ formatCodeLabel(r.progressStatus, 'progressStatuses') }}</td>
            <td>
              <button
                class="detail-btn"
                type="button"
                @click="goDetail(r.registryManagementNumber)"
              >
                <i class="fi fi-sr-angle-circle-right"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-meta">
      <p>총 {{ totalElements }}건</p>
      <label class="page-size">
        <span>페이지당</span>
        <select v-model.number="size" @change="onChangePageSize" :disabled="loading">
          <option :value="10">10</option>
          <option v-if="MAX_PAGE_SIZE >= 20" :value="20">20</option>
          <option v-if="MAX_PAGE_SIZE >= 50" :value="50">50</option>
        </select>
      </label>
    </div>
    <Pagination
      v-model:current-page="currentPage"
      :total-items="totalElements"
      :items-per-page="size"
    />
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import SearchDateRangePicker from '@/components/template/input/SearchDateRangePicker.vue'
import SearchInput from '@/components/template/input/SearchInput.vue'
import SearchSelect from '@/components/template/input/SearchSelect.vue'
import Pagination from '@/components/template/PaginationItem.vue'
import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { useCaseStatusList } from '@/features/registration/composables/useCaseStatusList'
import { getAssignableUsers, toAssignedWorkDescription } from '@/utils/assignable-user'

const router = useRouter()
const { formatCodeLabel } = useCodeReplacer()
const {
  userId,
  isAssigneeRole,
  isManagerRole,
  filters,
  requestDateRange,
  receiptDateRange,
  workTypeOptions,
  assignedWorkOptions,
  registryMethodOptions,
  managerOptions,
  progressStatusOptions,
  codesLoading,
  assignableLoading,
  loading,
  codesError,
  assignableError,
  errorMessage,
  rows,
  totalElements,
  size,
  currentPage,
  MAX_PAGE_SIZE,
  assignableUsers,
  assigningSet,
  rowSelectedManager,
  handleSearch,
  onChangePageSize,
  onAdminSelectChange,
  handleAssignMyself,
  isUnassigned,
  displayAddress
} = useCaseStatusList()

function getRowAssignableUsers(assignedWork: string) {
  return getAssignableUsers(assignedWork, assignableUsers.value)
}

function displayAssignedWork(assignedWork: string) {
  return toAssignedWorkDescription(assignedWork) ?? formatCodeLabel(assignedWork, 'assignedWorks')
}

function goDetail(registryManagementNumber: string) {
  router.push({ name: 'RegistrationDetail', params: { caseId: registryManagementNumber } })
}
</script>

<style scoped lang="scss">
.registry-progress {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-wrap {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.row {
  cursor: default;
}

.address-cell {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pagination-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: -4px;
  color: #4f5f6f;
  font-size: 14px;
}

.page-size {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size select {
  height: 32px;
  min-width: 64px;
  border-radius: 6px;
  border: 1px solid #ccd6dd;
  padding: 0 8px;
  background: #fff;
}

.inline-error {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  font-size: 12px;
}

.assign-btn {
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #111827;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
}
.assign-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.inline-select {
  height: 28px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 12px;
}
</style>
