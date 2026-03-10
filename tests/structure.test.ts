/**
 * 문서 경로: `@/tests/structure.test.ts`
 * 문서 제목: 테스트: structure-test
 */

import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import test from 'node:test'

const projectRoot = cwd()

test('components 디렉토리는 재사용 UI 전용(layout, template)만 유지한다', () => {
  const componentsDir = path.join(projectRoot, 'src/components')
  const entries = readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  assert.deepEqual(entries, ['layout', 'template'])
})

test('root route는 app feature의 RootPage를 사용한다', () => {
  const rootRoutePath = path.join(projectRoot, 'src/router/routes/root.ts')
  const source = readFileSync(rootRoutePath, 'utf8')

  assert.match(source, /@\/features\/app\/pages\/RootPage\.vue/)
})

test('도메인 컴포넌트는 components 경로를 참조하지 않는다', () => {
  const filesToCheck = [
    'src/router/routes/auth.ts',
    'src/router/routes/onboarding.ts',
    'src/router/routes/protected.ts',
    'src/router/routes/errors.ts',
    'src/router/routes/root.ts'
  ]

  filesToCheck.forEach((relativePath) => {
    const source = readFileSync(path.join(projectRoot, relativePath), 'utf8')

    assert.equal(
      /@\/components\/(auth|main|my|registration|estimate|shared|doc-templates)\//.test(source),
      false,
      `${relativePath}에 이전 components 도메인 경로가 남아있습니다.`
    )
  })
})

test('API 엔드포인트 키는 백엔드 1:1 매핑 키(*_2 포함)를 유지한다', () => {
  const registrySource = readFileSync(
    path.join(projectRoot, 'src/api/endpoints/registry.ts'),
    'utf8'
  )
  const rpaSource = readFileSync(path.join(projectRoot, 'src/api/endpoints/rpa.ts'), 'utf8')

  assert.match(registrySource, /SAVE_2:\s*\(/)
  assert.match(registrySource, /SAVE_3:\s*\(/)
  assert.match(registrySource, /SAVE_4:\s*\(/)
  assert.match(registrySource, /LIST_2:\s*\(/)
  assert.match(registrySource, /DETAIL_2:\s*\(/)
  assert.match(rpaSource, /CREATE_10:\s*\(/)
})

test('registration application section composable은 역할별 파일로 분리되어 있다', () => {
  const files = [
    'src/features/registration/composables/useApplicationSection.ts',
    'src/features/registration/composables/useApplicationSectionTabs.ts',
    'src/features/registration/composables/useApplicationSectionDocument.ts',
    'src/features/registration/composables/useApplicationSectionModal.ts'
  ]

  files.forEach((relativePath) => {
    assert.equal(existsSync(path.join(projectRoot, relativePath)), true, `${relativePath} 누락`)
  })
})

test('registration page 오케스트레이션 composable이 존재한다', () => {
  const files = [
    'src/features/registration/composables/useCaseDetailProcess.ts',
    'src/features/registration/composables/useCaseStatusList.ts',
    'src/features/registration/composables/useCaseStatusFilters.ts',
    'src/features/registration/composables/useCaseStatusCodes.ts',
    'src/features/registration/composables/useCaseStatusAssignableUsers.ts',
    'src/features/registration/composables/useCaseStatusListData.ts',
    'src/features/registration/composables/useCaseStatusAssignment.ts'
  ]

  files.forEach((relativePath) => {
    assert.equal(existsSync(path.join(projectRoot, relativePath)), true, `${relativePath} 누락`)
  })
})

test('registration modals는 도메인 하위 폴더(application/documents/progress)로 분류한다', () => {
  const modalsDir = path.join(projectRoot, 'src/features/registration/modals')
  const rootVueFiles = readdirSync(modalsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.vue'))
    .map((entry) => entry.name)

  assert.deepEqual(rootVueFiles, [], 'modals 루트에 .vue 파일이 남아있습니다.')
  const requiredSubdirs = ['application', 'documents', 'progress']
  requiredSubdirs.forEach((subdir) => {
    const subdirPath = path.join(modalsDir, subdir)
    assert.equal(existsSync(subdirPath), true, `${subdirPath} 누락`)
  })
})

test('registration pages는 route pages와 sections를 분리한다', () => {
  const pagesDir = path.join(projectRoot, 'src/features/registration/pages')
  const rootVueFiles = readdirSync(pagesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.vue'))
    .map((entry) => entry.name)
    .sort()

  assert.deepEqual(rootVueFiles, [
    'CaseDetailPage.vue',
    'CaseScheduleMgmtPage.vue',
    'CaseStatusContainer.vue'
  ])

  const sectionsDir = path.join(pagesDir, 'sections')
  assert.equal(existsSync(sectionsDir), true, `${sectionsDir} 누락`)

  const sectionFiles = readdirSync(sectionsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.vue'))
    .map((entry) => entry.name)
    .sort()

  assert.deepEqual(sectionFiles, [
    'AccordionSection.vue',
    'AdminSection.vue',
    'ApplicationSection.vue',
    'ProgressSection.vue',
    'RequestInfoSection.vue'
  ])
})
