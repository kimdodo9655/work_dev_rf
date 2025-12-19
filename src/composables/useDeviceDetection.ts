// composables/useDeviceDetection.ts
import { useRouter } from 'vue-router'

export const useDeviceDetection = () => {
  const router = useRouter()

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

  const checkAndRedirect = () => {
    const { isMobile, isMacOS } = detectDevice()

    if (isMobile) {
      router.push('/error/mobile')
    } else if (isMacOS) {
      router.push('/error/mac-os')
    }
  }

  return {
    detectDevice,
    checkAndRedirect
  }
}
