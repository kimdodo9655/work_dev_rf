export type RegistryTypeForAssign = 'OWNERSHIP_TRANSFER' | 'MORTGAGE_REGISTRATION'
export type AssignedWorkCode =
  | 'ESTABLISHMENT'
  | 'CANCELLATION_ESTABLISHMENT'
  | 'TRANSFER'
  | 'CANCELLATION_TRANSFER'
  | 'ESTABLISHMENT_TRANSFER_LINKED'
  | 'TRANSFER_ESTABLISHMENT'
  | 'CANCELLATION_TRANSFER_ESTABLISHMENT'

export type AssignableUser = {
  userId: number
  userName: string
  hasOwnershipTransfer: boolean
  hasMortgageRegistration: boolean
}

const ASSIGNED_WORK_DESCRIPTION_MAP: Record<AssignedWorkCode, string> = {
  ESTABLISHMENT: '설정',
  CANCELLATION_ESTABLISHMENT: '말소,설정',
  TRANSFER: '이전',
  CANCELLATION_TRANSFER: '말소,이전',
  ESTABLISHMENT_TRANSFER_LINKED: '설정(이전연계)',
  TRANSFER_ESTABLISHMENT: '이전,설정',
  CANCELLATION_TRANSFER_ESTABLISHMENT: '말소,이전,설정'
}

const ASSIGNED_WORK_REGISTRY_TYPE_MAP: Record<AssignedWorkCode, RegistryTypeForAssign[]> = {
  ESTABLISHMENT: ['MORTGAGE_REGISTRATION'],
  CANCELLATION_ESTABLISHMENT: ['MORTGAGE_REGISTRATION'],
  TRANSFER: ['OWNERSHIP_TRANSFER'],
  CANCELLATION_TRANSFER: ['OWNERSHIP_TRANSFER'],
  ESTABLISHMENT_TRANSFER_LINKED: ['MORTGAGE_REGISTRATION'],
  TRANSFER_ESTABLISHMENT: ['OWNERSHIP_TRANSFER', 'MORTGAGE_REGISTRATION'],
  CANCELLATION_TRANSFER_ESTABLISHMENT: ['OWNERSHIP_TRANSFER', 'MORTGAGE_REGISTRATION']
}

const ASSIGNED_WORK_CODE_SET = new Set<AssignedWorkCode>(
  Object.keys(ASSIGNED_WORK_DESCRIPTION_MAP) as AssignedWorkCode[]
)

const ASSIGNED_WORK_DESCRIPTION_TO_CODE_MAP = Object.fromEntries(
  Object.entries(ASSIGNED_WORK_DESCRIPTION_MAP).map(([code, description]) => [description, code])
) as Record<string, AssignedWorkCode>

export function isAssignedWorkCode(value: string): value is AssignedWorkCode {
  return ASSIGNED_WORK_CODE_SET.has(value as AssignedWorkCode)
}

export function toAssignedWorkDescription(assignedWork?: string | null): string | null {
  if (!assignedWork || !assignedWork.trim()) return null
  if (assignedWork === 'ALL') return 'ALL'
  if (isAssignedWorkCode(assignedWork)) {
    return ASSIGNED_WORK_DESCRIPTION_MAP[assignedWork]
  }
  return assignedWork
}

export function toAssignedWorkCode(assignedWork?: string | null): AssignedWorkCode | null {
  if (!assignedWork || !assignedWork.trim() || assignedWork === 'ALL') {
    return null
  }

  if (isAssignedWorkCode(assignedWork)) {
    return assignedWork
  }

  return ASSIGNED_WORK_DESCRIPTION_TO_CODE_MAP[assignedWork] ?? null
}

function convertAssignedWorkToRegistryTypes(assignedWork?: string | null): RegistryTypeForAssign[] {
  const assignedWorkCode = toAssignedWorkCode(assignedWork)
  if (!assignedWorkCode) {
    return []
  }

  return [...ASSIGNED_WORK_REGISTRY_TYPE_MAP[assignedWorkCode]]
}

export function toAssignedWorkRegistryTypes(assignedWork?: string | null): RegistryTypeForAssign[] {
  return convertAssignedWorkToRegistryTypes(assignedWork)
}

export function getAssignedWorkDescriptionMap(): Record<AssignedWorkCode, string> {
  return { ...ASSIGNED_WORK_DESCRIPTION_MAP }
}

export function getAssignedWorkRegistryTypeMap(): Record<
  AssignedWorkCode,
  RegistryTypeForAssign[]
> {
  return Object.fromEntries(
    Object.entries(ASSIGNED_WORK_REGISTRY_TYPE_MAP).map(([code, registryTypes]) => [
      code,
      [...registryTypes]
    ])
  ) as Record<AssignedWorkCode, RegistryTypeForAssign[]>
}

export function getAssignableUsers(
  assignedWork: string | null | undefined,
  users: AssignableUser[]
): AssignableUser[] {
  const requiredTypes = convertAssignedWorkToRegistryTypes(assignedWork)

  if (requiredTypes.length === 0) {
    return users
  }

  return users.filter((user) =>
    requiredTypes.every((type) => {
      switch (type) {
        case 'OWNERSHIP_TRANSFER':
          return user.hasOwnershipTransfer
        case 'MORTGAGE_REGISTRATION':
          return user.hasMortgageRegistration
        default:
          return true
      }
    })
  )
}
