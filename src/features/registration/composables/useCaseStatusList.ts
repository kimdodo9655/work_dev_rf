/**
 * 문서 경로: `@/src/features/registration/composables/useCaseStatusList.ts`
 * 문서 제목: 기능 모듈: use-case-status-list
 */

import { onMounted } from 'vue'

import { useCaseStatusAssignment } from './useCaseStatusAssignment'
import { useCaseStatusFilters } from './useCaseStatusFilters'
import { useCaseStatusListData } from './useCaseStatusListData'

export function useCaseStatusList() {
  const filtersModel = useCaseStatusFilters()

  const listModel = useCaseStatusListData({
    filters: filtersModel.filters
  })

  const assignmentModel = useCaseStatusAssignment({
    rows: listModel.rows,
    assignableUsers: filtersModel.assignableUsers,
    userId: filtersModel.userId,
    isAssigneeRole: filtersModel.isAssigneeRole,
    findUserIdByName: filtersModel.findUserIdByName,
    refreshList: () => listModel.fetchList(false)
  })

  onMounted(async () => {
    await filtersModel.loadCodes()
    await filtersModel.loadAssignableUsers()
    await listModel.fetchList(true)
  })

  return {
    userId: filtersModel.userId,
    isAssigneeRole: filtersModel.isAssigneeRole,
    isManagerRole: filtersModel.isManagerRole,
    filters: filtersModel.filters,
    requestDateRange: filtersModel.requestDateRange,
    receiptDateRange: filtersModel.receiptDateRange,
    workTypeOptions: filtersModel.workTypeOptions,
    assignedWorkOptions: filtersModel.assignedWorkOptions,
    registryMethodOptions: filtersModel.registryMethodOptions,
    managerOptions: filtersModel.managerOptions,
    progressStatusOptions: filtersModel.progressStatusOptions,
    codesLoading: filtersModel.codesLoading,
    assignableLoading: filtersModel.assignableLoading,
    loading: listModel.loading,
    codesError: filtersModel.codesError,
    assignableError: filtersModel.assignableError,
    errorMessage: listModel.errorMessage,
    rows: listModel.rows,
    totalElements: listModel.totalElements,
    size: listModel.size,
    currentPage: listModel.currentPage,
    MAX_PAGE_SIZE: listModel.MAX_PAGE_SIZE,
    assignableUsers: filtersModel.assignableUsers,
    assigningSet: assignmentModel.assigningSet,
    rowSelectedManager: assignmentModel.rowSelectedManager,
    handleSearch: listModel.handleSearch,
    onChangePageSize: listModel.onChangePageSize,
    onAdminSelectChange: assignmentModel.onAdminSelectChange,
    handleAssignMyself: assignmentModel.handleAssignMyself,
    isUnassigned: filtersModel.isUnassigned,
    displayAddress: filtersModel.displayAddress
  }
}
