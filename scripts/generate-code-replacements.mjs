import fs from 'node:fs'
import path from 'node:path'

const workspaceRoot = process.cwd()

const CODE_ENDPOINTS = [
  ['organizationTypes', '/api/codes/organization-types'],
  ['organizationStatuses', '/api/codes/organization-statuses'],
  ['qualifiedTypes', '/api/codes/qualified-types'],
  ['branchStatuses', '/api/codes/branch-statuses'],
  ['userRoleLevels', '/api/codes/user-role-levels'],
  ['registryTypes', '/api/codes/registry-types'],
  ['registryCauses', '/api/codes/registry-causes'],
  ['partyTypes', '/api/codes/party-types'],
  ['propertyTypes', '/api/codes/property-types'],
  ['sections', '/api/codes/sections'],
  ['registryMethods', '/api/codes/registry-methods'],
  ['securedDebtScopeTypes', '/api/codes/secured-debt-scope-types'],
  ['certificateTypes', '/api/codes/certificate-types'],
  ['workTypes', '/api/codes/work-types'],
  ['paymentStatuses', '/api/codes/payment-statuses'],
  ['adminInfoLinkTime', '/api/codes/admin-info-link-times'],
  ['userStatuses', '/api/codes/user-statuses'],
  ['assignedWorks', '/api/codes/assigned-works'],
  ['progressStatuses', '/api/codes/progress-statuses'],
  ['quoteProgressStatuses', '/api/codes/quote-progress-statuses'],
  ['estimateWritingStatuses', '/api/codes/estimate-writing-statuses'],
  ['estimateSelectionStatuses', '/api/codes/estimate-selection-statuses'],
  ['progressTypes', '/api/codes/progress-types'],
  ['partyRoles', '/api/codes/party-roles'],
  ['partyRolesForRequest', '/api/codes/party-roles-for-request'],
  ['registryTypesForAssign', '/api/codes/registry-types-for-assign'],
  ['actionTypes', '/api/codes/action-types'],
  ['bondPurchaseTypes', '/api/codes/bond-purchase-types'],
  ['correctionTypes', '/api/codes/correction-types'],
  ['dataSources', '/api/codes/data-sources'],
  ['eSignatureMethods', '/api/codes/e-signature-methods'],
  ['eSignatureStatuses', '/api/codes/e-signature-statuses'],
  ['fileProgressDocumentTypes', '/api/codes/file-progress-document-types'],
  ['fileRegistryTypes', '/api/codes/file-registry-types'],
  ['fileRequestDocumentTypes', '/api/codes/file-request-document-types'],
  ['ownershipTypes', '/api/codes/ownership-types'],
  ['processActions', '/api/codes/process-actions'],
  ['propertyBuildTypes', '/api/codes/property-build-types'],
  ['rpaUserTaskStatuses', '/api/codes/rpa-user-task-statuses'],
  ['rpaUserTaskTypes', '/api/codes/rpa-user-task-types'],
  ['confirmationDocumentTypes', '/api/codes/confirmation-document-types'],
  ['fileBranchDocumentTypes', '/api/codes/file-branch-document-types'],
  ['successCodes', '/api/codes/success-codes'],
  ['errorCodes', '/api/codes/error-codes']
]

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
    getArg('timeout-ms') || process.env.CODE_API_TIMEOUT_MS || process.env.CODE_TIMEOUT_MS || '15000'
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
    CODE_ENDPOINTS.map(async ([category, endpoint]) => {
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
    const [category, endpoint] = CODE_ENDPOINTS[index]
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
  console.log(`- categories: ${CODE_ENDPOINTS.length}`)
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
