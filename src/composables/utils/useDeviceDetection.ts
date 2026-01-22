/**
 * @file useDeviceDetection.ts
 * @description 디바이스 감지 Composable (유틸리티)
 */

import { useRouter } from 'vue-router'

export const useDeviceDetection = () => {
  const router = useRouter()

  // ============================================================================
  // Detection Functions
  // ============================================================================

  /**
   * 디바이스 종류 감지
   */
  const detectDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase()

    // 모바일 기기 감지
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    )

    // macOS 감지
    const isMacOS = /macintosh|mac os x/i.test(userAgent)

    return { isMobile, isMacOS }
  }

  /**
   * 디바이스 체크 후 리다이렉트
   */
  const checkAndRedirect = () => {
    const { isMobile, isMacOS } = detectDevice()

    if (isMobile) {
      router.push('/error/mobile')
    } else if (isMacOS) {
      router.push('/error/mac-os')
    }
  }

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // Detection Functions
    detectDevice,
    checkAndRedirect
  }
}
