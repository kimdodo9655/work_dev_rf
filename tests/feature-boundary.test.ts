import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import test from 'node:test'

const projectRoot = cwd()
const featuresRoot = path.join(projectRoot, 'src/features')

const disallowedTargetsBySource: Record<string, Set<string>> = {
  registration: new Set(['app', 'auth', 'main', 'my', 'estimate', 'dev']),
  auth: new Set(['app', 'main', 'my', 'estimate', 'registration', 'dev', 'doc-templates']),
  main: new Set(['app', 'auth', 'my', 'estimate', 'registration', 'dev', 'doc-templates']),
  my: new Set(['app', 'auth', 'main', 'estimate', 'registration', 'dev', 'doc-templates']),
  estimate: new Set(['app', 'auth', 'main', 'my', 'registration', 'dev', 'doc-templates']),
  shared: new Set(['app', 'auth', 'main', 'my', 'estimate', 'registration', 'dev']),
  'doc-templates': new Set(['app', 'auth', 'main', 'my', 'estimate', 'registration', 'dev']),
  dev: new Set(['app', 'auth', 'main', 'my', 'estimate', 'registration', 'shared'])
}

function walkFiles(dir: string): string[] {
  const files: string[] = []
  const entries = readdirSync(dir, { withFileTypes: true })
  entries.forEach((entry) => {
    const absolutePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath))
      return
    }
    if (!/\.(ts|vue)$/.test(entry.name)) return
    files.push(absolutePath)
  })
  return files
}

test('feature import boundary를 위반하지 않는다', () => {
  const violations: string[] = []
  const files = walkFiles(featuresRoot)

  files.forEach((absolutePath) => {
    const source = readFileSync(absolutePath, 'utf8')
    const relativePath = path.relative(projectRoot, absolutePath)
    const sourceFeature = relativePath.split(path.sep)[2]
    const disallowedTargets = disallowedTargetsBySource[sourceFeature]
    if (!disallowedTargets) return

    const matches = source.matchAll(/@\/features\/([a-z-]+)\//g)
    for (const match of matches) {
      const targetFeature = match[1]
      if (targetFeature === sourceFeature) continue
      if (!disallowedTargets.has(targetFeature)) continue
      violations.push(`${relativePath} -> ${targetFeature}`)
    }
  })

  assert.deepEqual(violations, [])
})
