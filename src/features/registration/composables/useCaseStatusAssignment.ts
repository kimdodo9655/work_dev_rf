/**
 * 문서 경로: `@/src/features/registration/composables/useCaseStatusAssignment.ts`
 * 문서 제목: 기능 모듈: use-case-status-assignment
 */

import { type ComputedRef, type Ref, ref, watch } from 'vue'

import { registryProgressAPI } from '@/api/services/registry'
import { useApiAlert } from '@/composables/utils/useApiAlert'
import { useDialog } from '@/composables/utils/useDialog'

import type { AssignableUser, Row } from './caseStatus.types'

export function useCaseStatusAssignment({
  rows,
  assignableUsers,
  userId,
  isAssigneeRole,
  findUserIdByName,
  refreshList
}: {
  rows: Ref<Row[]>
  assignableUsers: Ref<AssignableUser[]>
  userId: ComputedRef<string | number | null | undefined>
  isAssigneeRole: ComputedRef<boolean>
  findUserIdByName: (name: string) => string
  refreshList: () => Promise<void>
}) {
  const { alert, confirm } = useDialog()
  const { extractApiSuccessContent, extractApiErrorContent } = useApiAlert()

  const assigningSet = ref<Set<string>>(new Set())
  const rowSelectedManager = ref<Map<string, string>>(new Map())

  function addAssigning(registryManagementNumber: string) {
    const next = new Set(assigningSet.value)
    next.add(registryManagementNumber)
    assigningSet.value = next
  }

  function removeAssigning(registryManagementNumber: string) {
    const next = new Set(assigningSet.value)
    next.delete(registryManagementNumber)
    assigningSet.value = next
  }

  function hydrateRowSelectedManager() {
    const next = new Map(rowSelectedManager.value)

    for (const row of rows.value) {
      const currentSelected = findUserIdByName(row.managerUserName)
      const existing = next.get(row.registryManagementNumber)
      if (!existing) next.set(row.registryManagementNumber, currentSelected)
      else next.set(row.registryManagementNumber, existing)
    }

    rowSelectedManager.value = next
  }

  async function callAssignManager(
    registryManagementNumber: string,
    managerUserIdToAssign: number | string
  ) {
    if (assigningSet.value.has(registryManagementNumber)) return
    addAssigning(registryManagementNumber)

    try {
      const response: any = await registryProgressAPI.assignManager(
        { registryManagementNumber },
        { managerUserId: Number(managerUserIdToAssign) }
      )

      const dialog = extractApiSuccessContent(
        response,
        '배정 완료',
        '업무담당자 배정이 완료되었습니다.'
      )
      const acknowledged = await alert({
        title: dialog.title,
        message: dialog.message
      })
      if (acknowledged) {
        await refreshList()
      }
    } catch (error: any) {
      const dialog = extractApiErrorContent(error, '배정 실패', '업무담당자 배정에 실패했습니다.')
      await alert({
        title: dialog.title,
        message: dialog.message
      })
    } finally {
      removeAssigning(registryManagementNumber)
    }
  }

  async function handleAssignMyself(registryManagementNumber: string) {
    if (!isAssigneeRole.value) return
    if (!userId.value) {
      await alert({
        title: '사용자 정보 오류',
        message: '사용자 정보가 없습니다. 다시 로그인해 주세요.'
      })
      return
    }
    await callAssignManager(registryManagementNumber, userId.value)
  }

  async function handleAdminSelectChange(registryManagementNumber: string, selected: string) {
    if (!selected) return

    const userLabel =
      assignableUsers.value.find((user) => String(user.userId) === selected)?.userName ?? selected

    const ok = await confirm({
      title: '담당자 배정 확인',
      message: `담당자를 "${userLabel}"(으)로 배정하시겠습니까?`,
      confirmText: '배정',
      cancelText: '취소'
    })

    if (!ok) {
      const row = rows.value.find(
        (item) => item.registryManagementNumber === registryManagementNumber
      )
      const rollback = row ? findUserIdByName(row.managerUserName) : ''
      const next = new Map(rowSelectedManager.value)
      next.set(registryManagementNumber, rollback)
      rowSelectedManager.value = next
      return
    }

    const next = new Map(rowSelectedManager.value)
    next.set(registryManagementNumber, selected)
    rowSelectedManager.value = next

    await callAssignManager(registryManagementNumber, selected)
  }

  function onAdminSelectChange(registryManagementNumber: string, event: Event) {
    const value = (event.target as HTMLSelectElement | null)?.value ?? ''
    void handleAdminSelectChange(registryManagementNumber, value)
  }

  watch(
    rows,
    () => {
      hydrateRowSelectedManager()
    },
    { immediate: true }
  )

  return {
    assigningSet,
    rowSelectedManager,
    onAdminSelectChange,
    handleAssignMyself
  }
}
