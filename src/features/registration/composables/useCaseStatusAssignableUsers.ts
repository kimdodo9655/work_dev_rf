/**
 * 문서 경로: `@/src/features/registration/composables/useCaseStatusAssignableUsers.ts`
 * 문서 제목: 기능 모듈: use-case-status-assignable-users
 */

import { type ComputedRef, ref, watch } from 'vue'

import { userAPI } from '@/api/services/user'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import type { GetAssignableUsersQuery } from '@/types'
import { UserRoleLevel } from '@/types/store'
import { toAssignedWorkDescription } from '@/utils/assignable-user'

import { type AssignableUser, type CaseStatusFilters } from './caseStatus.types'

export function useCaseStatusAssignableUsers({
  filters,
  isAssigneeRole,
  roleLevelValue
}: {
  filters: CaseStatusFilters
  isAssigneeRole: ComputedRef<boolean>
  roleLevelValue: ComputedRef<number>
}) {
  const { getErrorMessage } = useErrorHandler()
  const assignableUsers = ref<AssignableUser[]>([])
  const assignableLoading = ref(false)
  const assignableError = ref('')

  function isUnassigned(name: string) {
    // 목록 응답과 셀 표시값에서 "미배정"을 동일한 빈 선택 상태로 취급한다.
    return name === '미배정' || !name
  }

  function findUserIdByName(name: string): string {
    if (isUnassigned(name)) return ''
    const hit = assignableUsers.value.find((user) => user.userName === name)
    return hit ? String(hit.userId) : ''
  }

  function ensureUserDefaultManager(users: AssignableUser[]) {
    if (!isAssigneeRole.value || !Array.isArray(users)) return
    const [firstUser] = users
    if (!firstUser) return

    const firstId = String(firstUser.userId)
    // 담당자 권한 사용자는 사실상 자기 자신만 선택 가능하므로 기본값을 첫 사용자로 고정한다.
    if (
      !filters.managerUserId ||
      filters.managerUserId === 'ALL' ||
      filters.managerUserId === '-1'
    ) {
      filters.managerUserId = firstId
    }
  }

  async function loadAssignableUsers() {
    assignableLoading.value = true
    assignableError.value = ''
    try {
      const query: GetAssignableUsersQuery = {}
      const assignedWork = toAssignedWorkDescription(filters.assignedWork)
      // 담당업무 필터는 화면 코드값이 아니라 백엔드 설명값 기준으로 조회한다.
      if (assignedWork && assignedWork !== 'ALL') {
        query.assignedWork = assignedWork
      }

      // 서비스에서 바로 화면용 최소 모델을 반환받아 composable은 필터/기본값 처리만 담당한다.
      const users = await userAPI.getAssignableUsers(query)
      assignableUsers.value = users
      ensureUserDefaultManager(users)
    } catch (error) {
      assignableError.value = getErrorMessage(error)
      assignableUsers.value = []
    } finally {
      assignableLoading.value = false
    }
  }

  watch(
    () => filters.assignedWork,
    async () => {
      // 담당업무가 바뀌면 담당자 선택값도 다시 정렬해야 하므로 기본값부터 초기화한다.
      filters.managerUserId = isAssigneeRole.value ? '' : 'ALL'
      await loadAssignableUsers()
    }
  )

  watch(
    () => roleLevelValue.value,
    async (level) => {
      if (level === UserRoleLevel.USER) {
        // 권한이 일반 담당자로 내려오면 "내 업무만" 보는 기본 조건을 즉시 맞춘다.
        if (!assignableUsers.value.length) {
          await loadAssignableUsers()
        } else {
          ensureUserDefaultManager(assignableUsers.value)
        }
      }
    },
    { immediate: true }
  )

  return {
    assignableUsers,
    assignableLoading,
    assignableError,
    loadAssignableUsers,
    isUnassigned,
    findUserIdByName
  }
}
