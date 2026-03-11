export type RegistryTypeForAssign = 'OWNERSHIP_TRANSFER' | 'MORTGAGE_REGISTRATION'

export type AssignableUser = {
  userId: number
  userName: string
  hasOwnershipTransfer: boolean
  hasMortgageRegistration: boolean
}

function convertAssignedWorkToRegistryTypes(assignedWork?: string | null): RegistryTypeForAssign[] {
  if (!assignedWork || !assignedWork.trim()) {
    return []
  }

  const works = assignedWork.split(',')
  const registryTypes: RegistryTypeForAssign[] = []

  for (const work of works) {
    const trimmedWork = work.trim()

    switch (trimmedWork) {
      case '이전': {
        if (!registryTypes.includes('OWNERSHIP_TRANSFER')) {
          registryTypes.push('OWNERSHIP_TRANSFER')
        }
        break
      }
      case '설정':
      case '설정(이전연계)': {
        if (!registryTypes.includes('MORTGAGE_REGISTRATION')) {
          registryTypes.push('MORTGAGE_REGISTRATION')
        }
        break
      }
    }
  }

  return registryTypes
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
