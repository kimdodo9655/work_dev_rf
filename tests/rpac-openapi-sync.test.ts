import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

type EndpointConfig = {
  id: string
  method: string
  path: string
  pathParams: string[]
  defaultBody: Record<string, unknown> | null
  requiredFields: string[]
}

function loadEndpointConfigs() {
  const filePath =
    '/Users/dodolee/dodo_works/dev_works/register-front/src/features/dev/pages/RpacApiTestPage.vue'
  const source = fs.readFileSync(filePath, 'utf8')
  const match = source.match(/const endpointConfigs: EndpointConfig\[] = \[(.*?)\n\]/s)

  assert.ok(match, 'RpacApiTestPage endpointConfigs를 찾지 못했습니다.')

  return vm.runInNewContext(`([${match[1]}])`) as EndpointConfig[]
}

test('RPA 테스트 엔드포인트 메타는 OpenAPI request schema와 동기화되어 있다', () => {
  const endpointConfigs = loadEndpointConfigs()
  const openapi = JSON.parse(
    fs.readFileSync(
      '/Users/dodolee/dodo_works/dev_works/register-front/src/api/openapi.json',
      'utf8'
    )
  )

  const drift: Array<{
    id: string
    missingDefault: string[]
    extraDefault: string[]
    missingRequired: string[]
    extraRequired: string[]
  }> = []

  for (const endpoint of endpointConfigs) {
    const operation = openapi.paths?.[endpoint.path]?.[endpoint.method.toLowerCase()]
    if (!operation) continue

    const schemaRef = operation.requestBody?.content?.['application/json']?.schema?.$ref
    if (!schemaRef) continue

    const schemaName = schemaRef.split('/').pop()
    const schema = openapi.components?.schemas?.[schemaName]
    const schemaProps = Object.keys(schema?.properties ?? {})
    const requiredProps = schema?.required ?? []
    const defaultProps = Object.keys(endpoint.defaultBody ?? {})
    const requiredFields = endpoint.requiredFields.filter(
      (field) => !endpoint.pathParams.includes(field)
    )

    const missingDefault = schemaProps.filter((field) => !defaultProps.includes(field))
    const extraDefault = defaultProps.filter((field) => !schemaProps.includes(field))
    const missingRequired = requiredProps.filter((field) => !requiredFields.includes(field))
    const extraRequired = requiredFields.filter((field) => !requiredProps.includes(field))

    if (
      missingDefault.length > 0 ||
      extraDefault.length > 0 ||
      missingRequired.length > 0 ||
      extraRequired.length > 0
    ) {
      drift.push({
        id: endpoint.id,
        missingDefault,
        extraDefault,
        missingRequired,
        extraRequired
      })
    }
  }

  assert.deepEqual(drift, [])
})
