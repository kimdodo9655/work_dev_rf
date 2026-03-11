/**
 * 문서 경로: `@/src/composables/utils/useExternalLinks.ts`
 * 문서 제목: 컴포저블 유틸: use-external-links
 */

/**
 * @file useExternalLinks.ts
 * @description 외부 링크 관리 Composable (유틸리티)
 */

import { EXTERNAL_LINKS } from '@/constants/externalLinks'
import { browserLocation, browserWindow } from '@/utils/browser'

export const useExternalLinks = () => {
  // ============================================================================
  // Link Functions
  // ============================================================================

  /**
   * 외부 링크 열기
   */
  const openLink = (url: string, newTab = true) => {
    if (newTab) {
      browserWindow.open(url, '_blank', 'noopener,noreferrer')
    } else {
      browserLocation.assign(url)
    }
  }

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // Constants
    links: EXTERNAL_LINKS,

    // Link Functions
    openLink
  }
}
