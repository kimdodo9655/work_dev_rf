import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export type AccordionKey = 'REQ' | 'APP' | 'ADMIN' | 'PROG'

/**
 * 아코디언 상태 관리 composable
 *
 * @example
 * // 목록 페이지에서 넘어올 때:
 * // /case/123?section=APP 이면 APP 아코디언만 열림
 * // query parameter가 없으면 REQ가 기본으로 열림
 */
export function useAccordionState() {
  const route = useRoute()

  // query parameter에서 초기 열림 상태 결정
  const initialSection = computed(() => {
    const section = route.query.section as AccordionKey | undefined
    const validSections: AccordionKey[] = ['REQ', 'APP', 'ADMIN', 'PROG']

    if (section && validSections.includes(section)) {
      return section
    }

    return 'REQ' // 기본값
  })

  // 아코디언 열림/닫힘 상태
  const openMap = ref<Record<AccordionKey, boolean>>({
    REQ: initialSection.value === 'REQ',
    APP: initialSection.value === 'APP',
    ADMIN: initialSection.value === 'ADMIN',
    PROG: initialSection.value === 'PROG'
  })

  // 토글 함수
  function toggle(key: AccordionKey) {
    openMap.value[key] = !openMap.value[key]
  }

  return {
    openMap,
    toggle
  }
}
