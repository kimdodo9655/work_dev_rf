import assert from 'node:assert/strict'
import test from 'node:test'

import { isPublicApiRequest } from '../src/api/publicApiMap.ts'

test('openapi-marked auth APIs are treated as public', () => {
  assert.equal(isPublicApiRequest('post', '/api/auth/login'), true)
  assert.equal(isPublicApiRequest('POST', '/api/auth/refresh'), true)
})

test('non-marked APIs are treated as private', () => {
  assert.equal(isPublicApiRequest('GET', '/api/notifications'), false)
})

test('templated public paths match real ids', () => {
  assert.equal(
    isPublicApiRequest('GET', '/api/organizations/10/branches/20/documents/download'),
    true
  )
  assert.equal(isPublicApiRequest('PATCH', '/api/registry/rpa/user-tasks/abc123/result'), true)
})
