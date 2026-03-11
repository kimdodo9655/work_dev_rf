/**
 * 문서 경로: `@/src/utils/apiPayload.ts`
 * 문서 제목: 유틸리티 모듈: api-payload
 */

const NESTED_PAYLOAD_KEYS = ['data', 'result'] as const

// 역할: 중첩 payload 래핑 흡수
export function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

export function getApiPayloadCandidates(input: unknown): unknown[] {
  const queue: unknown[] = [input]
  const seen = new Set<unknown>()
  const candidates: unknown[] = []

  // 순서: 바깥 -> 안쪽
  while (queue.length > 0) {
    const current = queue.shift()
    if (current == null) continue

    if (typeof current === 'object') {
      if (seen.has(current)) continue
      seen.add(current)
    }

    candidates.push(current)

    const record = toRecord(current)
    if (!record) continue

    for (const key of NESTED_PAYLOAD_KEYS) {
      if (key in record) {
        queue.push(record[key])
      }
    }
  }

  return candidates
}

export function findApiPayload<T>(
  input: unknown,
  predicate: (candidate: unknown) => candidate is T
): T | undefined {
  return getApiPayloadCandidates(input).find(predicate)
}

export function extractPrimaryPayload<T = unknown>(input: unknown): T | undefined {
  const candidates = getApiPayloadCandidates(input)
  // 기준: 가장 안쪽 payload
  return candidates.at(-1) as T | undefined
}

export function extractArrayByKeys<T>(input: unknown, keys: readonly string[]): T[] {
  // 기준: 배열 직접 반환 또는 지정 키(items/content 등) 하위 배열
  const payload = findApiPayload(input, (candidate): candidate is T[] | Record<string, unknown> => {
    if (Array.isArray(candidate)) return true

    const record = toRecord(candidate)
    if (!record) return false

    return keys.some((key) => Array.isArray(record[key]))
  })

  if (Array.isArray(payload)) {
    return payload as T[]
  }

  const record = toRecord(payload)
  if (!record) return []

  for (const key of keys) {
    if (Array.isArray(record[key])) {
      return record[key] as T[]
    }
  }

  return []
}

export function extractRecordByKeys<T extends object>(
  input: unknown,
  requiredKeys: readonly string[]
): T | undefined {
  // 타입: index signature 없는 DTO 허용
  return findApiPayload(input, (candidate): candidate is T => {
    const record = toRecord(candidate)
    if (!record) return false
    return requiredKeys.every((key) => key in record)
  })
}
