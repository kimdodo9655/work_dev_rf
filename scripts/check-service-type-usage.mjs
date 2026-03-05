#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SERVICES_DIR = path.join(ROOT, 'src/api/services')

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (entry.isFile() && full.endsWith('.ts')) out.push(full)
  }
  return out
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split('\n').length
}

function checkFile(filePath) {
  const rel = path.relative(ROOT, filePath)
  const text = fs.readFileSync(filePath, 'utf8')
  const issues = []

  // Rule 1: service layer should not use `any`
  const anyRegex = /\bas any\b|:\s*any\b|<\s*any\s*>|Record<string,\s*any>/g
  let match
  while ((match = anyRegex.exec(text)) !== null) {
    issues.push({
      file: rel,
      line: lineNumberAt(text, match.index),
      rule: 'no-any-in-services',
      detail: match[0]
    })
  }

  // Rule 2: every apiHelpers call should provide generic response type
  const helperCallRegex = /apiHelpers\.(get|post|put|patch|delete)\s*\(/g
  while ((match = helperCallRegex.exec(text)) !== null) {
    issues.push({
      file: rel,
      line: lineNumberAt(text, match.index),
      rule: 'missing-generic-on-apiHelpers',
      detail: match[0]
    })
  }

  return issues
}

function main() {
  if (!fs.existsSync(SERVICES_DIR)) {
    console.error(`Services directory not found: ${SERVICES_DIR}`)
    process.exit(1)
  }

  const files = walk(SERVICES_DIR)
  const issues = files.flatMap(checkFile)

  if (!issues.length) {
    console.log(`Service type usage check passed (${files.length} files)`)
    return
  }

  console.error(`Service type usage check failed: ${issues.length} issue(s)`)
  for (const issue of issues) {
    console.error(`- ${issue.file}:${issue.line} [${issue.rule}] ${issue.detail}`)
  }
  process.exit(1)
}

main()
