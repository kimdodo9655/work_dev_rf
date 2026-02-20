/**
 * Public API map generated from openapi.json.
 * Rule: operation summary contains "🅿️".
 * Do not edit manually.
 */

export const PUBLIC_API_OPERATIONS = [
  'DELETE /api/organizations/{organizationId}/branches/{branchId}/documents',
  'GET /api/addresses',
  'GET /api/addresses/suggestions',
  'GET /api/banks',
  'GET /api/banks/{code}',
  'GET /api/branches/check-business-number',
  'GET /api/codes/action-types',
  'GET /api/codes/admin-info-link-times',
  'GET /api/codes/assigned-works',
  'GET /api/codes/bond-purchase-types',
  'GET /api/codes/branch-statuses',
  'GET /api/codes/certificate-types',
  'GET /api/codes/confirmation-document-types',
  'GET /api/codes/correction-types',
  'GET /api/codes/data-sources',
  'GET /api/codes/e-signature-methods',
  'GET /api/codes/e-signature-statuses',
  'GET /api/codes/error-codes',
  'GET /api/codes/estimate-selection-statuses',
  'GET /api/codes/estimate-writing-statuses',
  'GET /api/codes/file-branch-document-types',
  'GET /api/codes/file-progress-document-types',
  'GET /api/codes/file-registry-types',
  'GET /api/codes/file-request-document-types',
  'GET /api/codes/organization-statuses',
  'GET /api/codes/organization-types',
  'GET /api/codes/ownership-types',
  'GET /api/codes/party-roles',
  'GET /api/codes/party-roles-for-request',
  'GET /api/codes/party-types',
  'GET /api/codes/payment-statuses',
  'GET /api/codes/process-actions',
  'GET /api/codes/progress-statuses',
  'GET /api/codes/progress-types',
  'GET /api/codes/property-build-types',
  'GET /api/codes/property-types',
  'GET /api/codes/qualified-types',
  'GET /api/codes/quote-progress-statuses',
  'GET /api/codes/registry-causes',
  'GET /api/codes/registry-methods',
  'GET /api/codes/registry-types',
  'GET /api/codes/registry-types-for-assign',
  'GET /api/codes/rpa-user-task-statuses',
  'GET /api/codes/rpa-user-task-types',
  'GET /api/codes/sections',
  'GET /api/codes/secured-debt-scope-types',
  'GET /api/codes/success-codes',
  'GET /api/codes/user-role-levels',
  'GET /api/codes/user-statuses',
  'GET /api/codes/work-types',
  'GET /api/organizations/{organizationId}/branches/{branchId}/documents',
  'GET /api/organizations/{organizationId}/branches/{branchId}/documents/download',
  'GET /api/organizations/{organizationId}/branches/{branchId}/documents/download/base64',
  'GET /api/organizations/check-registration-number',
  'GET /api/registry/rpa/user-tasks/{taskToken}',
  'GET /api/users/check-email',
  'GET /api/users/check-login-id',
  'PATCH /api/registry/rpa/user-tasks/{taskToken}/result',
  'POST /api/auth/email-verify',
  'POST /api/auth/email-verify/validate',
  'POST /api/auth/login',
  'POST /api/auth/logout',
  'POST /api/auth/password',
  'POST /api/auth/refresh',
  'POST /api/auth/signup',
  'POST /api/organizations/{organizationId}/branches/{branchId}/documents',
  'POST /api/organizations/{organizationId}/branches/{branchId}/documents/temp',
  'POST /api/registry/test-data/combine',
  'POST /api/registry/test-data/progress',
  'POST /api/registry/test-data/requests',
  'POST /api/registry/test-data/scheduler/assign-managers',
  'POST /api/registry/test-data/scheduler/generate',
  'POST /api/registry/test-data/scheduler/generate-missing-progress'
] as const

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const TEMPLATE_PARAM_REGEX = /\{[^/]+\}/g
const ESCAPE_REGEX = /[\\^$.*+?()[\]{}|]/g

function toPathname(inputUrl: string): string {
  try {
    return new URL(inputUrl).pathname
  } catch {
    const basePath = inputUrl.split('?')[0]?.split('#')[0] ?? ''
    return basePath.startsWith('/') ? basePath : `/${basePath}`
  }
}

function normalizePath(inputUrl: string): string {
  const pathname = toPathname(inputUrl)
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

function compilePathTemplate(template: string): RegExp {
  const parts = template.split(TEMPLATE_PARAM_REGEX)
  const escapedParts = parts.map((part) => part.replace(ESCAPE_REGEX, '\\$&'))
  return new RegExp(`^${escapedParts.join('[^/]+')}$`)
}

const exactPublicOperations = new Set<string>()
const templatedPublicOperations: Array<{ method: HttpMethod; pattern: RegExp }> = []

for (const operation of PUBLIC_API_OPERATIONS) {
  const [method, pathTemplate] = operation.split(' ', 2) as [HttpMethod, string]

  if (pathTemplate.includes('{')) {
    templatedPublicOperations.push({
      method,
      pattern: compilePathTemplate(pathTemplate)
    })
    continue
  }

  exactPublicOperations.add(`${method} ${pathTemplate}`)
}

export function isPublicApiRequest(method: string | undefined, url: string | undefined): boolean {
  if (!method || !url) return false

  const normalizedMethod = method.toUpperCase() as HttpMethod
  const normalizedPath = normalizePath(url)
  const operationKey = `${normalizedMethod} ${normalizedPath}`

  if (exactPublicOperations.has(operationKey)) return true

  return templatedPublicOperations.some(
    ({ method: publicMethod, pattern }) =>
      publicMethod === normalizedMethod && pattern.test(normalizedPath)
  )
}
