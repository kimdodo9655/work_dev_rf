import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getAssignableUsers,
  toAssignedWorkCode,
  toAssignedWorkDescription,
  toAssignedWorkRegistryTypes
} from '../src/utils/assignable-user.ts'

test('배정업무 코드는 설명값으로 변환된다', () => {
  assert.equal(toAssignedWorkDescription('ESTABLISHMENT'), '설정')
  assert.equal(toAssignedWorkDescription('TRANSFER_ESTABLISHMENT'), '이전,설정')
  assert.equal(toAssignedWorkDescription('ALL'), 'ALL')
})

test('배정업무 설명값은 코드로 역변환된다', () => {
  assert.equal(toAssignedWorkCode('설정'), 'ESTABLISHMENT')
  assert.equal(toAssignedWorkCode('설정(이전연계)'), 'ESTABLISHMENT_TRANSFER_LINKED')
  assert.equal(toAssignedWorkCode('ALL'), null)
})

test('배정업무는 담당 가능 등기유형으로 변환된다', () => {
  assert.deepEqual(toAssignedWorkRegistryTypes('ESTABLISHMENT'), ['MORTGAGE_REGISTRATION'])
  assert.deepEqual(toAssignedWorkRegistryTypes('이전,설정'), [
    'OWNERSHIP_TRANSFER',
    'MORTGAGE_REGISTRATION'
  ])
})

test('담당자 목록 필터는 코드와 설명값 모두 처리한다', () => {
  const users = [
    {
      userId: 1,
      userName: '소유권',
      hasOwnershipTransfer: true,
      hasMortgageRegistration: false
    },
    {
      userId: 2,
      userName: '근저당',
      hasOwnershipTransfer: false,
      hasMortgageRegistration: true
    },
    {
      userId: 3,
      userName: '둘다',
      hasOwnershipTransfer: true,
      hasMortgageRegistration: true
    }
  ]

  assert.deepEqual(
    getAssignableUsers('TRANSFER_ESTABLISHMENT', users).map((user) => user.userId),
    [3]
  )
  assert.deepEqual(
    getAssignableUsers('이전', users).map((user) => user.userId),
    [1, 3]
  )
})
