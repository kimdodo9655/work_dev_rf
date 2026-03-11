/**
 * 문서 경로: `@/src/features/registration/composables/useCaseStatusAssignableUsers.ts`
 * 문서 제목: 기능 모듈: use-case-status-assignable-users
 */

import { type ComputedRef, ref, watch } from 'vue'

import { userAPI } from '@/api/services/user'
import type { GetAssignableUsersQuery } from '@/types'
import type { UserAssignableResponse } from '@/types/api/user.types'
import { UserRoleLevel } from '@/types/store'

import { type AssignableUser, type CaseStatusFilters } from './caseStatus.types'

function unwrap<T>(res: any): T | undefined {
  if (!res) return undefined
  if (typeof res === 'object' && 'data' in res) {
    const data = (res as any).data
    if (data && typeof data === 'object' && 'data' in data) return (data as any).data as T
    return data as T
  }
  return res as T
}

export function useCaseStatusAssignableUsers({
  filters,
  isAssigneeRole,
  roleLevelValue
}: {
  filters: CaseStatusFilters
  isAssigneeRole: ComputedRef<boolean>
  roleLevelValue: ComputedRef<number>
}) {
  const assignableUsers = ref<AssignableUser[]>([])
  const assignableLoading = ref(false)
  const assignableError = ref('')

  function isUnassigned(name: string) {
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
    if (
      !filters.managerUserId ||
      filters.managerUserId === 'ALL' ||
      filters.managerUserId === '-1'
    ) {
      filters.managerUserId = firstId
    }
  }

  function normalizeAssignableUser(user: UserAssignableResponse): AssignableUser | null {
    if (typeof user.userId !== 'number' || !user.userName) return null

    return {
      userId: user.userId,
      userName: user.userName,
      hasOwnershipTransfer: Boolean(user.hasOwnershipTransfer),
      hasMortgageRegistration: Boolean(user.hasMortgageRegistration)
    }
  }

  async function loadAssignableUsers() {
    assignableLoading.value = true
    assignableError.value = ''
    try {
      const query: GetAssignableUsersQuery = {}
      if (filters.assignedWork !== 'ALL') query.assignedWork = filters.assignedWork

      const response: any = await userAPI.assignable(query)
      const payload = unwrap<any>(response)
      const root = payload?.result ?? payload

      const rawUsers: UserAssignableResponse[] = Array.isArray(root)
        ? root
        : Array.isArray(root?.content)
          ? root.content
          : Array.isArray(root?.items)
            ? root.items
            : []

      const users = rawUsers
        .map((user) => normalizeAssignableUser(user))
        .filter((user): user is AssignableUser => user !== null)

      assignableUsers.value = users
      ensureUserDefaultManager(users)
    } catch (error: any) {
      assignableError.value = error?.message ?? '담당자 목록 로딩 실패'
      assignableUsers.value = []
    } finally {
      assignableLoading.value = false
    }
  }

  watch(
    () => filters.assignedWork,
    async () => {
      filters.managerUserId = isAssigneeRole.value ? '' : 'ALL'
      await loadAssignableUsers()
    }
  )

  watch(
    () => roleLevelValue.value,
    async (level) => {
      if (level === UserRoleLevel.USER) {
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
