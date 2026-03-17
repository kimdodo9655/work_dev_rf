/**
 * 문서 경로: `@/src/features/registration/composables/applicationSection.rules.ts`
 * 문서 제목: 기능 규칙: application-section-rules
 *
 * 이 파일은 등기신청서 섹션에서 공통으로 사용하는 "선택 가능 규칙"을 모아둔 순수 함수 모듈입니다.
 *
 * 사용 위치:
 * - `CaseTypeAddModal.vue`
 *   : 등기유형 추가/수정 모달에서
 *     - 어떤 등기유형을 노출할지
 *     - 선택한 등기유형에 따라 어떤 등기원인을 허용할지
 *     - 선택한 등기유형/등기원인 조합에서 어떤 등기방식을 허용할지
 *     - 행정정보 연계시점이 필요한지
 *   를 판단할 때 사용합니다.
 * - `useApplicationSectionTabs.ts`
 *   : 신청서 탭 목록에서 삭제 가능한 탭인지 판단할 때 사용합니다.
 *
 * 분리 목적:
 * - 화면 컴포넌트 안에 흩어져 있던 조건문/상수 맵을 한곳으로 모아 규칙 변경 지점을 줄입니다.
 * - UI 렌더링 코드와 업무 규칙 코드를 분리해, 읽기/테스트/수정이 쉬운 구조로 유지합니다.
 * - 서버 응답이나 화면 상태와 무관하게 동일 입력에 동일 결과를 반환하는 순수 함수로 관리합니다.
 */

import type { ProgressType } from '@/types'

/** 신청서 추가/수정 모달에서 사용하는 등기유형 코드 집합. */
export type RegistryTypeValue =
  | 'OWNERSHIP_TRANSFER'
  | 'MORTGAGE'
  | 'SURFACE_RIGHT'
  | 'CHANGE'
  | 'CORRECTION'
  | 'MORTGAGE_CANCELLATION'
  | 'SURFACE_RIGHT_CANCELLATION'

/** 선택한 등기유형에 따라 노출되는 등기원인 코드 집합. */
export type RegistryCauseValue =
  | 'TRADE'
  | 'ESTABLISHMENT_CONTRACT'
  | 'ADDRESS_CHANGE'
  | 'ROAD_NAME_ADDRESS'
  | 'NAME_CHANGE'
  | 'REGISTRATION_NUMBER'
  | 'APPLICATION_ERROR'
  | 'TERMINATION'

/** 신청서 모달에서 사용하는 등기방식 코드 집합. */
export type RegistryMethodValue = 'ELECTRONIC' | 'E_FORM' | 'PAPER' | 'BANK_REQUEST'
export type AdminInfoLinkTimeValue = 'BEFORE_SUBMISSION' | 'AFTER_SUBMISSION'

/**
 * 진행유형 필터를 적용하기 전, 화면에서 허용하는 전체 등기유형 목록.
 */
export const ALLOWED_REGISTRY_TYPES: RegistryTypeValue[] = [
  'OWNERSHIP_TRANSFER',
  'MORTGAGE',
  'SURFACE_RIGHT',
  'CHANGE',
  'CORRECTION',
  'MORTGAGE_CANCELLATION',
  'SURFACE_RIGHT_CANCELLATION'
]

/**
 * 사건 진행유형별로 허용하는 등기유형 목록.
 */
const PROGRESS_TYPE_REGISTRY_TYPES: Record<ProgressType, RegistryTypeValue[]> = {
  TYPE_01: ['MORTGAGE', 'SURFACE_RIGHT', 'CHANGE', 'CORRECTION'],
  TYPE_02: [
    'MORTGAGE',
    'SURFACE_RIGHT',
    'CHANGE',
    'CORRECTION',
    'MORTGAGE_CANCELLATION',
    'SURFACE_RIGHT_CANCELLATION'
  ],
  TYPE_04: [
    'OWNERSHIP_TRANSFER',
    'CHANGE',
    'CORRECTION',
    'MORTGAGE_CANCELLATION',
    'SURFACE_RIGHT_CANCELLATION'
  ],
  TYPE_05: ['MORTGAGE', 'SURFACE_RIGHT', 'CHANGE', 'CORRECTION'],
  TYPE_07: [
    'OWNERSHIP_TRANSFER',
    'MORTGAGE',
    'SURFACE_RIGHT',
    'CHANGE',
    'CORRECTION',
    'MORTGAGE_CANCELLATION',
    'SURFACE_RIGHT_CANCELLATION'
  ]
}

/**
 * 등기유형별 허용 등기원인 조합.
 */
const REGISTRY_CAUSE_MAP: Record<RegistryTypeValue, RegistryCauseValue[]> = {
  OWNERSHIP_TRANSFER: ['TRADE'],
  MORTGAGE: ['ESTABLISHMENT_CONTRACT'],
  SURFACE_RIGHT: ['ESTABLISHMENT_CONTRACT'],
  CHANGE: ['ADDRESS_CHANGE', 'ROAD_NAME_ADDRESS', 'NAME_CHANGE', 'REGISTRATION_NUMBER'],
  CORRECTION: ['APPLICATION_ERROR'],
  MORTGAGE_CANCELLATION: ['TERMINATION'],
  SURFACE_RIGHT_CANCELLATION: ['TERMINATION']
}

/**
 * 별도 예외가 없을 때 기본으로 허용하는 등기방식 목록.
 */
const DEFAULT_REGISTRY_METHODS: RegistryMethodValue[] = ['ELECTRONIC', 'E_FORM', 'PAPER']

/**
 * 방식 확장 여지가 있는 말소 계열 등기유형 목록.
 */
const EXTRA_METHOD_REGISTRY_TYPES: RegistryTypeValue[] = [
  'MORTGAGE_CANCELLATION',
  'SURFACE_RIGHT_CANCELLATION'
]

/** 진행유형에 맞는 등기유형 목록을 반환한다. */
export function getAllowedRegistryTypes(progressType?: ProgressType): RegistryTypeValue[] {
  // progressType이 없으면 전체 허용 목록을 노출하고, 있으면 사건 유형에 맞는 부분집합만 보여준다.
  return progressType ? (PROGRESS_TYPE_REGISTRY_TYPES[progressType] ?? []) : ALLOWED_REGISTRY_TYPES
}

/** 선택한 등기유형에 맞는 등기원인 목록을 반환한다. */
export function getAllowedRegistryCauses(registryType?: string): RegistryCauseValue[] {
  if (!registryType) return []
  return REGISTRY_CAUSE_MAP[registryType as RegistryTypeValue] ?? []
}

/** 선택한 등기유형/원인 조합에 맞는 등기방식 목록을 반환한다. */
export function getAllowedRegistryMethods(options: {
  registryType?: string
  registryCause?: string
}): RegistryMethodValue[] {
  const { registryType, registryCause } = options
  if (!registryType) return []

  const allowsExtraMethod = EXTRA_METHOD_REGISTRY_TYPES.includes(registryType as RegistryTypeValue)
  let methods = [...DEFAULT_REGISTRY_METHODS]

  // 말소 계열은 상환 은행 의뢰 방식을 추가로 허용한다.
  if (allowsExtraMethod) {
    methods = [...methods, 'BANK_REQUEST']
  }

  // 성명/등록번호 변경은 전자등기 불가.
  if (registryCause === 'NAME_CHANGE' || registryCause === 'REGISTRATION_NUMBER') {
    methods = methods.filter((method) => method !== 'ELECTRONIC')
  }

  return methods
}

/** 전자등기일 때만 행정정보 연계시점 입력이 필요하다. */
export function shouldRequireAdminInfoLinkTime(registryMethod?: string): boolean {
  // 행정정보 연계시점은 전자등기에서만 의미가 있다.
  return registryMethod === 'ELECTRONIC'
}

const FIXED_AFTER_SUBMISSION_REGISTRY_TYPES: RegistryTypeValue[] = [
  'OWNERSHIP_TRANSFER',
  'CHANGE',
  'CORRECTION'
]

/**
 * Type 04 / Type 07의 일부 등기는 행정정보 연계시점을 신청서 작성 이후로 고정한다.
 */
export function getFixedAdminInfoLinkTime(options: {
  progressType?: ProgressType
  registryType?: string
  registryMethod?: string
}): AdminInfoLinkTimeValue | null {
  const { progressType, registryType, registryMethod } = options

  if (!shouldRequireAdminInfoLinkTime(registryMethod)) return null
  if (progressType !== 'TYPE_04' && progressType !== 'TYPE_07') return null
  if (!FIXED_AFTER_SUBMISSION_REGISTRY_TYPES.includes(registryType as RegistryTypeValue))
    return null

  return 'AFTER_SUBMISSION'
}

/** 메인 신청서(MAIN)를 제외한 탭만 삭제 가능하다. */
export function canDeleteApplicationTab(registryRole?: string): boolean {
  // 주신청서(MAIN)는 화면/기획상 삭제 대상이 아니다.
  return registryRole !== 'MAIN'
}
