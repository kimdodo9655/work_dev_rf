import { ref } from 'vue'

/**
 * API 연속 호출 방지 composable
 *
 * @param cooldown 마지막 호출 후 대기 시간 (ms)
 * @returns
 */
export function useThrottle(cooldown = 1000) {
  const isLoading = ref(false)
  const lastCallTime = ref(0)

  /**
   * throttle된 함수 실행
   *
   * @param fn 실행할 비동기 함수
   * @returns 실행 가능 여부
   */
  async function execute<T>(fn: () => Promise<T>): Promise<T | null> {
    const now = Date.now()

    // 1. 로딩 중이면 무시
    if (isLoading.value) {
      console.log('⏳ 이미 요청 중입니다.')
      return null
    }

    // 2. 마지막 호출 후 cooldown 시간이 지나지 않았으면 무시
    if (now - lastCallTime.value < cooldown) {
      console.log(`⏱️ ${cooldown}ms 이내 중복 호출 방지`)
      return null
    }

    // 3. 실행
    isLoading.value = true
    lastCallTime.value = now

    try {
      const result = await fn()
      return result
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 강제로 실행 (throttle 무시)
   */
  async function forceExecute<T>(fn: () => Promise<T>): Promise<T> {
    isLoading.value = true
    lastCallTime.value = Date.now()

    try {
      return await fn()
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 상태 초기화
   */
  function reset() {
    isLoading.value = false
    lastCallTime.value = 0
  }

  return {
    isLoading,
    execute,
    forceExecute,
    reset
  }
}
