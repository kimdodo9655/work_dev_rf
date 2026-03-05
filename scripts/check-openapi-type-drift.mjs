#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OPENAPI_PATH = path.join(ROOT, 'src/api/openapi.json')
const TYPES_DIR = path.join(ROOT, 'src/types/api')
const BASELINE_PATH = path.join(ROOT, 'scripts/openapi-type-drift-baseline.json')

const args = new Set(process.argv.slice(2))
const shouldUpdateBaseline = args.has('--update-baseline')
const shouldShowAll = args.has('--all')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function listTypeFiles(dirPath) {
  return fs
    .readdirSync(dirPath)
    .filter((name) => name.endsWith('.types.ts'))
    .sort()
}

function parseInterfaces(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const interfaces = new Map()

  const interfaceRegex = /export interface\s+(\w+)\s*\{([\s\S]*?)^\}/gm
  let match

  while ((match = interfaceRegex.exec(text)) !== null) {
    const name = match[1]
    const body = match[2]
    const properties = new Set()

    for (const line of body.split('\n')) {
      const propMatch = line.match(/^\s*(?:readonly\s+)?([A-Za-z0-9_]+)\??\s*:/)
      if (propMatch) properties.add(propMatch[1])
    }

    interfaces.set(name, properties)
  }

  return interfaces
}

function loadTypeInterfaces() {
  const files = listTypeFiles(TYPES_DIR)
  const map = new Map()

  for (const file of files) {
    const abs = path.join(TYPES_DIR, file)
    const interfaces = parseInterfaces(abs)
    for (const [name, props] of interfaces) {
      map.set(name, { file, props })
    }
  }

  return map
}

function isObjectSchema(schema) {
  return Boolean(schema && schema.type === 'object' && schema.properties)
}

function diffSchemaAndInterface(schemaProps, typeProps) {
  const missing = schemaProps.filter((prop) => !typeProps.has(prop))
  const extra = [...typeProps].filter((prop) => !schemaProps.includes(prop))
  return { missing, extra }
}

function collectMismatches() {
  const openapi = readJson(OPENAPI_PATH)
  const schemas = openapi.components?.schemas ?? {}
  const paths = openapi.paths ?? {}
  const interfaceMap = loadTypeInterfaces()
  const mismatches = {}
  let comparableCount = 0
  let objectSchemaCount = 0
  let operationCount = 0

  const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace']
  const tags = new Set()
  for (const endpoint of Object.values(paths)) {
    for (const method of methods) {
      const operation = endpoint?.[method]
      if (!operation) continue
      operationCount += 1
      for (const tag of operation.tags ?? []) tags.add(tag)
    }
  }

  for (const [schemaName, schema] of Object.entries(schemas)) {
    if (isObjectSchema(schema)) objectSchemaCount += 1
    if (!isObjectSchema(schema)) continue
    const iface = interfaceMap.get(schemaName)
    if (!iface) continue
    comparableCount += 1

    const schemaProps = Object.keys(schema.properties ?? {})
    const { missing, extra } = diffSchemaAndInterface(schemaProps, iface.props)
    if (!missing.length && !extra.length) continue

    mismatches[schemaName] = {
      file: iface.file,
      missing: missing.sort(),
      extra: extra.sort()
    }
  }

  return {
    openapiCategoryCount: tags.size,
    openapiApiCount: operationCount,
    openapiPathCount: Object.keys(paths).length,
    openapiSchemaCount: Object.keys(schemas).length,
    openapiObjectSchemaCount: objectSchemaCount,
    comparableCount,
    mismatchCount: Object.keys(mismatches).length,
    mismatches
  }
}

function normalizeBaseline(raw) {
  if (!raw || typeof raw !== 'object') return { mismatches: {} }
  if (raw.mismatches && typeof raw.mismatches === 'object') return raw
  return { mismatches: {} }
}

function hasArrayNewItems(actual = [], allowed = []) {
  const allowedSet = new Set(allowed)
  return actual.filter((item) => !allowedSet.has(item))
}

function compareWithBaseline(actual, baseline) {
  const baselineMap = baseline.mismatches ?? {}
  const newMismatches = {}

  for (const [schemaName, info] of Object.entries(actual.mismatches)) {
    const allowed = baselineMap[schemaName] ?? { missing: [], extra: [] }
    const newMissing = hasArrayNewItems(info.missing, allowed.missing)
    const newExtra = hasArrayNewItems(info.extra, allowed.extra)
    if (!newMissing.length && !newExtra.length) continue

    newMismatches[schemaName] = {
      file: info.file,
      missing: newMissing,
      extra: newExtra
    }
  }

  return newMismatches
}

function printMismatches(title, mismatches, limit = 20) {
  const entries = Object.entries(mismatches)
  if (!entries.length) {
    console.log(`${title}: none`)
    return
  }

  console.log(`${title}: ${entries.length}`)
  const sorted = entries.sort((a, b) => {
    const as = a[1].missing.length + a[1].extra.length
    const bs = b[1].missing.length + b[1].extra.length
    return bs - as
  })

  for (const [idx, [schemaName, info]] of sorted.entries()) {
    if (idx >= limit) {
      console.log(`... and ${sorted.length - limit} more`)
      break
    }
    const pieces = []
    if (info.missing.length) pieces.push(`missing: ${info.missing.join(', ')}`)
    if (info.extra.length) pieces.push(`extra: ${info.extra.join(', ')}`)
    console.log(`- ${schemaName} (${info.file})`)
    console.log(`  ${pieces.join(' | ')}`)
  }
}

function writeBaseline(actual) {
  const payload = {
    generatedAt: new Date().toISOString(),
    openapiCategoryCount: actual.openapiCategoryCount,
    openapiApiCount: actual.openapiApiCount,
    openapiPathCount: actual.openapiPathCount,
    openapiSchemaCount: actual.openapiSchemaCount,
    openapiObjectSchemaCount: actual.openapiObjectSchemaCount,
    comparableCount: actual.comparableCount,
    mismatchCount: actual.mismatchCount,
    mismatches: actual.mismatches
  }
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

function main() {
  if (!fs.existsSync(OPENAPI_PATH)) {
    console.error(`OpenAPI file not found: ${OPENAPI_PATH}`)
    process.exit(1)
  }
  if (!fs.existsSync(TYPES_DIR)) {
    console.error(`Types directory not found: ${TYPES_DIR}`)
    process.exit(1)
  }

  const actual = collectMismatches()
  const baseline = fs.existsSync(BASELINE_PATH)
    ? normalizeBaseline(readJson(BASELINE_PATH))
    : { mismatches: {} }

  if (shouldUpdateBaseline) {
    writeBaseline(actual)
    console.log(
      `Baseline updated: ${actual.mismatchCount} mismatched schemas (${actual.comparableCount} comparable)`
    )
    process.exit(0)
  }

  const newMismatches = compareWithBaseline(actual, baseline)

  console.log(
    `OpenAPI summary: categories=${actual.openapiCategoryCount}, apis=${actual.openapiApiCount}, paths=${actual.openapiPathCount}, schemas=${actual.openapiSchemaCount}`
  )
  console.log(
    `Type drift scope: objectSchemas=${actual.openapiObjectSchemaCount}, comparable=${actual.comparableCount}, current=${actual.mismatchCount}`
  )

  if (shouldShowAll) printMismatches('Current mismatches', actual.mismatches, 9999)
  printMismatches('New mismatches vs baseline', newMismatches)

  if (Object.keys(newMismatches).length > 0) {
    process.exit(1)
  }
}

main()
