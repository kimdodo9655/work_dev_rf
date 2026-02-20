import fs from 'node:fs'
import path from 'node:path'

const workspaceRoot = process.cwd()
const openApiPath = path.join(workspaceRoot, 'src/api/openapi.json')
const outputPath = path.join(workspaceRoot, 'src/api/publicApiMap.ts')

const openApi = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'))
const methods = ['get', 'post', 'put', 'patch', 'delete']

const publicOperations = []

for (const [apiPath, pathItem] of Object.entries(openApi.paths ?? {})) {
  for (const method of methods) {
    const operation = pathItem?.[method]
    if (!operation) continue

    const summary = String(operation.summary ?? '')
    if (!summary.includes('🅿️')) continue

    publicOperations.push(`${method.toUpperCase()} ${apiPath}`)
  }
}

publicOperations.sort((a, b) => a.localeCompare(b))

const header = `/**
 * Public API map generated from openapi.json.
 * Rule: operation summary contains "🅿️".
 * Do not edit manually.
 */`

const body = `${header}

export const PUBLIC_API_OPERATIONS = ${JSON.stringify(publicOperations, null, 2)} as const

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const TEMPLATE_PARAM_REGEX = /\\{[^/]+\\}/g
const ESCAPE_REGEX = /[\\\\^$.*+?()[\\]{}|]/g

function toPathname(inputUrl: string): string {
  try {
    return new URL(inputUrl).pathname
  } catch {
    const basePath = inputUrl.split('?')[0]?.split('#')[0] ?? ''
    return basePath.startsWith('/') ? basePath : \`/\${basePath}\`
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
  const escapedParts = parts.map((part) => part.replace(ESCAPE_REGEX, '\\\\$&'))
  return new RegExp(\`^\${escapedParts.join('[^/]+')}$\`)
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

  exactPublicOperations.add(\`\${method} \${pathTemplate}\`)
}

export function isPublicApiRequest(
  method: string | undefined,
  url: string | undefined
): boolean {
  if (!method || !url) return false

  const normalizedMethod = method.toUpperCase() as HttpMethod
  const normalizedPath = normalizePath(url)
  const operationKey = \`\${normalizedMethod} \${normalizedPath}\`

  if (exactPublicOperations.has(operationKey)) return true

  return templatedPublicOperations.some(
    ({ method: publicMethod, pattern }) =>
      publicMethod === normalizedMethod && pattern.test(normalizedPath)
  )
}
`

fs.writeFileSync(outputPath, body, 'utf-8')

console.log(
  `Generated ${path.relative(workspaceRoot, outputPath)} with ${publicOperations.length} public operations.`
)
