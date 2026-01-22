/**
 * @file useExternalLinks.ts
 * @description 외부 링크 관리 Composable (유틸리티)
 */

import { EXTERNAL_LINKS } from '@/constants/externalLinks'

export const useExternalLinks = () => {
  // ============================================================================
  // Link Functions
  // ============================================================================

  /**
   * 외부 링크 열기
   */
  const openLink = (url: string, newTab = true) => {
    if (newTab) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = url
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
