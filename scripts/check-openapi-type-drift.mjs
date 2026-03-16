import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process, { cwd } from 'node:process'
import ts from 'typescript'

const projectRoot = cwd()
const openApiPath = path.join(projectRoot, 'src/api/openapi.json')
const typeDir = path.join(projectRoot, 'src/types/api')
const baselinePath = path.join(projectRoot, 'scripts/openapi-type-drift-baseline.json')
const IGNORED_SCHEMA_NAMES = new Set([
  'AddressDailyChangeRequest',
  'AddressDailyChangeResponse',
  'ApiResultAddressDailyChangeResponse',
  'ApiResultCryptoResponse',
  'CodeResponse',
  'CryptoRequest',
  'CryptoResponse',
  'Record'
])

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

function walkTypeFiles(dirPath) {
  return readdirSync(dirPath)
    .filter((name) => name.endsWith('.ts'))
    .sort()
    .map((name) => path.join(dirPath, name))
}

function collectDeclarations(source) {
  const interfaces = new Map()
  const typeAliases = new Set()
  const sourceFile = ts.createSourceFile('types.ts', source, ts.ScriptTarget.Latest, true)

  for (const statement of sourceFile.statements) {
    if (
      ts.isInterfaceDeclaration(statement) &&
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const props = statement.members
        .filter((member) => ts.isPropertySignature(member) && member.name)
        .map((member) => member.name.getText(sourceFile).replace(/^['"]|['"]$/g, ''))

      interfaces.set(statement.name.text, new Set(props))
    }

    if (
      ts.isTypeAliasDeclaration(statement) &&
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      typeAliases.add(statement.name.text)
    }
  }

  return { interfaces, typeAliases }
}

function collectTypeDeclarations() {
  const interfaceMap = new Map()
  const typeAliasNames = new Set()

  for (const filePath of walkTypeFiles(typeDir)) {
    const source = readFileSync(filePath, 'utf8')
    const { interfaces, typeAliases } = collectDeclarations(source)

    for (const [name, props] of interfaces) {
      interfaceMap.set(name, {
        file: path.relative(projectRoot, filePath),
        props
      })
    }

    for (const typeName of typeAliases) {
      typeAliasNames.add(typeName)
    }
  }

  return { interfaceMap, typeAliasNames }
}

function normalizeReport(report) {
  return {
    missingTypeDeclarations: [...report.missingTypeDeclarations].sort(),
    missingProperties: [...report.missingProperties]
      .map((item) => ({
        schema: item.schema,
        file: item.file,
        properties: [...item.properties].sort()
      }))
      .sort(
        (a, b) =>
          a.schema.localeCompare(b.schema) ||
          a.file.localeCompare(b.file) ||
          a.properties.join(',').localeCompare(b.properties.join(','))
      ),
    extraProperties: [...report.extraProperties]
      .map((item) => ({
        schema: item.schema,
        file: item.file,
        properties: [...item.properties].sort()
      }))
      .sort(
        (a, b) =>
          a.schema.localeCompare(b.schema) ||
          a.file.localeCompare(b.file) ||
          a.properties.join(',').localeCompare(b.properties.join(','))
      )
  }
}

function createDriftReport() {
  const openApi = readJson(openApiPath)
  const schemas = openApi.components?.schemas ?? {}
  const { interfaceMap, typeAliasNames } = collectTypeDeclarations()

  const report = {
    missingTypeDeclarations: [],
    missingProperties: [],
    extraProperties: []
  }

  for (const [schemaName, schema] of Object.entries(schemas)) {
    if (IGNORED_SCHEMA_NAMES.has(schemaName)) continue
    if (!schema || typeof schema !== 'object' || !schema.properties) continue

    const declaration = interfaceMap.get(schemaName)
    if (!declaration) {
      if (!typeAliasNames.has(schemaName)) {
        report.missingTypeDeclarations.push(schemaName)
      }
      continue
    }

    const missingProps = Object.keys(schema.properties).filter(
      (prop) => !declaration.props.has(prop)
    )
    const extraProps = [...declaration.props].filter((prop) => !(prop in schema.properties))

    if (missingProps.length > 0) {
      report.missingProperties.push({
        schema: schemaName,
        file: declaration.file,
        properties: missingProps
      })
    }

    if (extraProps.length > 0) {
      report.extraProperties.push({
        schema: schemaName,
        file: declaration.file,
        properties: extraProps
      })
    }
  }

  return normalizeReport(report)
}

function printReport(report) {
  if (
    report.missingTypeDeclarations.length === 0 &&
    report.missingProperties.length === 0 &&
    report.extraProperties.length === 0
  ) {
    console.log('OpenAPI type drift: clean')
    return
  }

  console.error('OpenAPI type drift detected.')

  if (report.missingTypeDeclarations.length > 0) {
    console.error('\n[missing type declarations]')
    for (const name of report.missingTypeDeclarations) {
      console.error(`- ${name}`)
    }
  }

  if (report.missingProperties.length > 0) {
    console.error('\n[missing properties]')
    for (const item of report.missingProperties) {
      console.error(`- ${item.schema} (${item.file}): ${item.properties.join(', ')}`)
    }
  }

  if (report.extraProperties.length > 0) {
    console.error('\n[extra properties]')
    for (const item of report.extraProperties) {
      console.error(`- ${item.schema} (${item.file}): ${item.properties.join(', ')}`)
    }
  }
}

const baseline = normalizeReport(readJson(baselinePath))
const current = createDriftReport()

try {
  assert.deepEqual(current, baseline)
  printReport(current)
} catch {
  printReport(current)
  console.error('\n[baseline]')
  console.error(JSON.stringify(baseline, null, 2))
  console.error('\n[current]')
  console.error(JSON.stringify(current, null, 2))
  process.exitCode = 1
}
