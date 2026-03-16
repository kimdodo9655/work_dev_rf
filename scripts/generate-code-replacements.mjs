import fs from 'node:fs'
import path from 'node:path'

const workspaceRoot = process.cwd()
const OPENAPI_PATH = path.join(workspaceRoot, 'src/api/openapi.json')
const CODE_TYPES_PATH = path.join(workspaceRoot, 'src/types/api/code.types.ts')
const CODE_ENDPOINT_KEY_OVERRIDES = {
  '/api/codes/admin-info-link-times': 'adminInfoLinkTime',
  '/api/codes/assigned-works': 'assignedWorks'
}
const CODE_ENDPOINT_ORDER = [
  'organizationTypes',
  'organizationStatuses',
  'qualifiedTypes',
  'branchStatuses',
  'userRoleLevels',
  'registryTypes',
  'registryCauses',
  'partyTypes',
  'propertyTypes',
  'sections',
  'registryMethods',
  'securedDebtScopeTypes',
  'certificateTypes',
  'workTypes',
  'paymentStatuses',
  'adminInfoLinkTime',
  'userStatuses',
  'assignedWorks',
  'progressStatuses',
  'quoteProgressStatuses',
  'estimateWritingStatuses',
  'estimateSelectionStatuses',
  'progressTypes',
  'partyRoles',
  'partyRolesForRequest',
  'registryTypesForAssign',
  'actionTypes',
  'bondPurchaseTypes',
  'correctionTypes',
  'dataSources',
  'eSignatureMethods',
  'eSignatureStatuses',
  'fileProgressDocumentTypes',
  'fileRegistryTypes',
  'fileRequestDocumentTypes',
  'ownershipTypes',
  'processActions',
  'propertyBuildTypes',
  'rpaUserTaskStatuses',
  'rpaUserTaskTypes',
  'confirmationDocumentTypes',
  'fileBranchDocumentTypes',
  'successCodes',
  'errorCodes',
  'workflowNotificationEvent',
  'noticeCategory'
]

function kebabToCamel(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

function getCodeCategoryKey(endpoint) {
  return CODE_ENDPOINT_KEY_OVERRIDES[endpoint] || kebabToCamel(endpoint.split('/').at(-1) ?? '')
}

function getCodeEndpoints() {
  const openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf-8'))
  const discovered = Object.entries(openapi.paths)
    .filter(([endpoint, methods]) => endpoint.startsWith('/api/codes/') && methods?.get)
    .map(([endpoint]) => [getCodeCategoryKey(endpoint), endpoint])

  const discoveredKeys = new Set(discovered.map(([category]) => category))
  const missingOrderKeys = discovered
    .map(([category]) => category)
    .filter((category) => !CODE_ENDPOINT_ORDER.includes(category))
  const extraOrderKeys = CODE_ENDPOINT_ORDER.filter((category) => !discoveredKeys.has(category))

  if (missingOrderKeys.length > 0 || extraOrderKeys.length > 0) {
    throw new Error(
      [
        'OpenAPI 공통코드 엔드포인트와 CODE_ENDPOINT_ORDER가 일치하지 않습니다.',
        missingOrderKeys.length > 0 ? `- missingOrderKeys: ${missingOrderKeys.join(', ')}` : '',
        extraOrderKeys.length > 0 ? `- extraOrderKeys: ${extraOrderKeys.join(', ')}` : ''
      ]
        .filter(Boolean)
        .join('\n')
    )
  }

  const endpointMap = new Map(discovered)

  return CODE_ENDPOINT_ORDER.map((category) => {
    const endpoint = endpointMap.get(category)
    if (!endpoint) {
      throw new Error(`공통코드 엔드포인트를 찾을 수 없습니다: ${category}`)
    }

    return [category, endpoint]
  })
}

function getCodeResponseKeys() {
  const source = fs.readFileSync(CODE_TYPES_PATH, 'utf-8')
  const match = source.match(/export interface CodeResponse \{([\s\S]*?)\n\}/)

  if (!match) {
    throw new Error('code.types.ts 에서 CodeResponse 인터페이스를 찾을 수 없습니다.')
  }

  return [...match[1].matchAll(/^\s*([A-Za-z0-9_]+):\s/gm)]
    .map((item) => item[1])
    .filter((key) => key !== 'code' && key !== 'description')
}

function validateCodeResponseKeys(codeEndpoints) {
  const endpointKeys = codeEndpoints.map(([category]) => category)
  const codeResponseKeys = getCodeResponseKeys()

  const missingInCodeTypes = endpointKeys.filter((key) => !codeResponseKeys.includes(key))
  const extraInCodeTypes = codeResponseKeys.filter((key) => !endpointKeys.includes(key))

  if (missingInCodeTypes.length > 0 || extraInCodeTypes.length > 0) {
    throw new Error(
      [
        'OpenAPI 공통코드 키와 CodeResponse 인터페이스가 일치하지 않습니다.',
        missingInCodeTypes.length > 0 ? `- missingInCodeTypes: ${missingInCodeTypes.join(', ')}` : '',
        extraInCodeTypes.length > 0 ? `- extraInCodeTypes: ${extraInCodeTypes.join(', ')}` : ''
      ]
        .filter(Boolean)
        .join('\n')
    )
  }
}

function parseDotEnv(content) {
  const result = {}

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eqIndex = trimmed.indexOf('=')
    if (eqIndex <= 0) continue

    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    result[key] = value
  }

  return result
}

function loadEnv() {
  const files = ['.env', '.env.local', '.env.development']
  const merged = {}

  for (const file of files) {
    const abs = path.join(workspaceRoot, file)
    if (!fs.existsSync(abs)) continue
    Object.assign(merged, parseDotEnv(fs.readFileSync(abs, 'utf-8')))
  }

  return merged
}

function getArg(name) {
  const prefix = `--${name}=`
  const item = process.argv.find((arg) => arg.startsWith(prefix))
  return item ? item.slice(prefix.length) : undefined
}

function normalizeBaseUrl(url) {
  return (url || '').replace(/\/+$/, '')
}

function extractList(payload) {
  if (Array.isArray(payload)) return payload

  if (!payload || typeof payload !== 'object') return []

  const obj = payload
  if (Array.isArray(obj.data)) return obj.data
  if (obj.data && Array.isArray(obj.data.data)) return obj.data.data
  if (Array.isArray(obj.result)) return obj.result
  if (obj.result && Array.isArray(obj.result.data)) return obj.result.data

  return []
}

function toReplacementEntry(category, item) {
  const code = typeof item?.code === 'string' ? item.code : ''
  if (!code) return null

  if (category === 'successCodes' || category === 'errorCodes') {
    const value =
      typeof item?.title === 'string'
        ? item.title
        : typeof item?.message === 'string'
          ? item.message
          : ''

    return [code, value]
  }

  const value =
    typeof item?.description === 'string'
      ? item.description
      : typeof item?.title === 'string'
        ? item.title
        : typeof item?.message === 'string'
          ? item.message
          : ''

  return [code, value]
}

function describeError(error) {
  if (!error) return 'Unknown error'
  if (typeof error === 'string') return error

  const message = typeof error.message === 'string' ? error.message : String(error)
  const cause = error.cause

  if (!cause) return message
  if (typeof cause === 'string') return `${message} (cause: ${cause})`
  if (typeof cause.message === 'string') return `${message} (cause: ${cause.message})`
  return `${message} (cause: ${String(cause)})`
}

async function fetchJson(url, headers, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal
    })

    if (!res.ok) {
      const bodyText = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${res.statusText}${bodyText ? `: ${bodyText}` : ''}`)
    }

    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  const codeEndpoints = getCodeEndpoints()
  validateCodeResponseKeys(codeEndpoints)
  const env = loadEnv()

  const baseUrl = normalizeBaseUrl(
    getArg('base-url') ||
      process.env.CODE_API_BASE_URL ||
      process.env.VITE_API_BASE_URL ||
      env.VITE_API_BASE_URL ||
      'http://localhost:8100'
  )

  const outputPath = path.resolve(
    workspaceRoot,
    getArg('out') || 'src/constants/code-replacements.generated.json'
  )

  const timeoutMs = Number(
    getArg('timeout-ms') ||
      process.env.CODE_API_TIMEOUT_MS ||
      process.env.CODE_TIMEOUT_MS ||
      '15000'
  )

  const accessToken = getArg('access-token') || process.env.CODE_API_ACCESS_TOKEN
  const bankCode = getArg('bank-code') || process.env.CODE_API_BANK_CODE

  const headers = {
    Accept: 'application/json'
  }

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`
  if (bankCode) headers['X-Bank-Code'] = bankCode

  const replacementMap = {}
  const failures = []

  const settled = await Promise.allSettled(
    codeEndpoints.map(async ([category, endpoint]) => {
      const url = `${baseUrl}${endpoint}`
      const payload = await fetchJson(url, headers, timeoutMs)
      const list = extractList(payload)

      const entries = list
        .map((item) => toReplacementEntry(category, item))
        .filter((entry) => Array.isArray(entry) && entry[0])

      replacementMap[category] = Object.fromEntries(entries)
      return { category, count: entries.length }
    })
  )

  settled.forEach((result, index) => {
    const [category, endpoint] = codeEndpoints[index]
    if (result.status === 'rejected') {
      replacementMap[category] = {}
      failures.push({ category, endpoint, reason: describeError(result.reason) })
    }
  })

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(replacementMap, null, 2)}\n`, 'utf-8')

  const successCount = settled.filter((item) => item.status === 'fulfilled').length
  const failureCount = failures.length

  console.log(`Generated ${path.relative(workspaceRoot, outputPath)}`)
  console.log(`- baseUrl: ${baseUrl}`)
  console.log(`- categories: ${codeEndpoints.length}`)
  console.log(`- success: ${successCount}`)
  console.log(`- failed: ${failureCount}`)

  if (failureCount > 0) {
    console.error('Failed categories:')
    failures.forEach((item) => {
      console.error(`- ${item.category} (${item.endpoint}) => ${item.reason}`)
    })
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
