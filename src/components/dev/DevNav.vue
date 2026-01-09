<template>
  <div class="floating-navigation">
    <!-- 네비게이션 토글 버튼 -->
    <button
      class="floating-button nav-button"
      :class="{ active: isNavOpen }"
      @click="toggleNav"
      aria-label="페이지 네비게이션"
    >
      {{ isNavOpen ? '❌' : '🔍' }}
    </button>

    <!-- 프레임 토글 버튼 -->
    <button
      class="floating-button frame-button"
      :class="{ active: isFrameOpen }"
      @click="toggleFrame"
      aria-label="프레임 크기 보기"
    >
      {{ isFrameOpen ? '📱' : '🖥️' }}
    </button>

    <!-- 인증 상태 모니터 토글 버튼 -->
    <button
      class="floating-button auth-button"
      :class="{ active: isAuthMonitorOpen }"
      @click="toggleAuthMonitor"
      aria-label="인증 상태 모니터"
    >
      📊
    </button>

    <!-- 인증 상태 모니터 -->
    <transition name="slide-up">
      <div v-if="isAuthMonitorOpen" class="auth-monitor">
        <div class="auth-monitor-header">
          <h4>🔐 인증 상태 모니터</h4>
          <div class="header-actions">
            <button class="refresh-button" @click="manualRefresh" title="수동 새로고침">🔄</button>
            <button class="close-auth-monitor" @click="toggleAuthMonitor">✕</button>
          </div>
        </div>
        <div class="auth-monitor-content">
          <!-- Pinia Store 상태 (실시간 반영) -->
          <section class="monitor-section">
            <h5>📦 Pinia Store (authStore) - 실시간</h5>
            <div class="monitor-item">
              <span class="label">authState:</span>
              <span class="value" :class="`state-${authStore.authState}`">{{
                authStore.authState
              }}</span>
            </div>
            <div class="monitor-item">
              <span class="label">isLoggedIn:</span>
              <span class="value" :class="authStore.isLoggedIn ? 'true' : 'false'">{{
                authStore.isLoggedIn
              }}</span>
            </div>
            <div class="monitor-item">
              <span class="label">loginId:</span>
              <span class="value">{{ authStore.loginId || '(empty)' }}</span>
            </div>
            <div class="monitor-item">
              <span class="label">userId:</span>
              <span class="value">{{ authStore.userId || 'null' }}</span>
            </div>
            <div class="monitor-item">
              <span class="label">roleLevel:</span>
              <span class="value">{{ authStore.roleLevel || 'null' }}</span>
            </div>
            <div class="monitor-item">
              <span class="label">selectedBankCode:</span>
              <span class="value">{{ authStore.selectedBankCode || 'null' }}</span>
            </div>
            <div class="monitor-item">
              <span class="label">remainingTime:</span>
              <span
                class="value"
                :class="{
                  expiring: authStore.isExpiringSoon,
                  expired: authStore.isExpired
                }"
                >{{ authStore.formattedTime }}</span
              >
            </div>
          </section>

          <div class="section-divider"></div>

          <!-- LocalStorage 상태 (실시간 갱신) -->
          <section class="monitor-section">
            <h5>💾 LocalStorage - 실시간 ({{ updateCount }}회 갱신됨)</h5>
            <div class="monitor-item">
              <span class="label">accessToken:</span>
              <span class="value token">{{ truncateToken(storageData.accessToken) }}</span>
            </div>
            <div class="monitor-item">
              <span class="label">refreshToken:</span>
              <span class="value token">{{ truncateToken(storageData.refreshToken) }}</span>
            </div>
            <div class="monitor-item">
              <span class="label">loginId:</span>
              <span class="value">{{ storageData.loginId || '(empty)' }}</span>
            </div>
            <div class="monitor-item">
              <span class="label">userId:</span>
              <span class="value">{{ storageData.userId || 'null' }}</span>
            </div>
            <div class="monitor-item">
              <span class="label">roleLevel:</span>
              <span class="value">{{ storageData.roleLevel || 'null' }}</span>
            </div>
            <div class="monitor-item">
              <span class="label">bankCode:</span>
              <span class="value">{{ storageData.bankCode || 'null' }}</span>
            </div>
          </section>

          <div class="section-divider"></div>

          <!-- API 요청 헤더 -->
          <section class="monitor-section">
            <h5>📡 API 요청 헤더</h5>
            <div class="monitor-item">
              <span class="label">Authorization:</span>
              <div class="token-wrapper">
                <span class="value token">{{ getAuthorizationHeader() }}</span>
                <button
                  v-if="storageData.accessToken"
                  class="copy-button"
                  @click="copyToken(`${storageData.accessToken}`)"
                  title="헤더 복사"
                >
                  📋
                </button>
              </div>
            </div>
            <div class="monitor-item">
              <span class="label">X-Bank-Code:</span>
              <span class="value">{{ storageData.bankCode || '(empty)' }}</span>
            </div>
          </section>
        </div>
      </div>
    </transition>

    <!-- 프레임 오버레이 -->
    <transition name="fade">
      <div v-if="isFrameOpen" class="frame-overlay">
        <div class="frame-controls">
          <button
            v-for="size in FRAME_SIZES"
            :key="size.name"
            class="frame-size-button"
            :class="{ active: currentFrameSize?.name === size.name }"
            @click="currentFrameSize = size"
          >
            {{ size.name }}
          </button>
          <button class="frame-close-button" @click="toggleFrame">✕</button>
        </div>

        <div class="frame-container" :style="frameStyle">
          <div class="frame-info">{{ currentFrameSize.width }} × {{ currentFrameSize.height }}</div>
          <iframe
            :src="$route.fullPath"
            class="frame-content"
            :title="`${currentFrameSize.name} 프레임`"
          />
        </div>
      </div>
    </transition>

    <!-- 네비게이션 메뉴 -->
    <transition name="slide-fade">
      <nav v-if="isNavOpen" class="nav-menu">
        <div class="nav-header">
          <h3>개발용 페이지 네비게이션</h3>
        </div>

        <div class="nav-content">
          <section v-for="category in ROUTE_CATEGORIES" :key="category.name" class="nav-category">
            <h4>{{ category.name }}</h4>
            <ul>
              <li v-for="route in category.routes" :key="route.path">
                <router-link
                  :to="route.path"
                  :class="{ active: $route.path === route.path }"
                  @click="closeNav"
                >
                  <span class="route-title">{{ route.title }}</span>
                  <span class="route-path">{{ route.path }}</span>
                </router-link>
              </li>
            </ul>
          </section>
        </div>
      </nav>
    </transition>

    <!-- 오버레이 -->
    <transition name="fade">
      <button v-if="isNavOpen" class="overlay" @click="closeNav" aria-label="네비게이션 닫기" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, type Ref, ref, watch } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { storage } from '@/utils/storage'

interface FrameSize {
  name: string
  width: number
  height: number
}

// Auth Store
const authStore = useAuthStore()

// Storage 데이터 (실시간 갱신)
const storageData = ref(storage.get())
const updateCount = ref(0)

// Constants
const FRAME_SIZES: FrameSize[] = [
  { name: '1920×1200', width: 1920, height: 1200 },
  { name: '1280×1024', width: 1280, height: 1024 }
]

const ROUTE_CATEGORIES = [
  {
    name: '테스트',
    routes: [{ path: '/test', title: '테스트' }]
  },
  {
    name: '인증',
    routes: [
      { path: '/auth/login', title: '로그인' },
      { path: '/auth/signup', title: '회원가입' },
      { path: '/auth/install', title: '프로그램 설치' },
      { path: '/auth/auto-logout', title: '자동 로그아웃' },
      { path: '/auth/password-setup', title: '비밀번호 설정' },
      { path: '/auth/blocked/mac', title: '접속 차단 (Mac)' },
      { path: '/auth/blocked/email', title: '접속 차단 (이메일)' },
      { path: '/auth/blocked/user', title: '접속 차단 (사용자)' }
    ]
  },
  {
    name: '메인',
    routes: [
      { path: '/', title: '홈' },
      { path: '/dashboard', title: '나의 사건 정보' },
      { path: '/bank-select', title: '금융기관 선택' }
    ]
  },
  {
    name: '내 정보',
    routes: [
      { path: '/my/profile', title: '내 정보 관리' },
      { path: '/my/organization', title: '기관/지점 정보 관리' },
      { path: '/my/organization/ORG-001', title: '기관/지점 등록 정보 (샘플)' },
      { path: '/my/users', title: '사용자 정보 관리' },
      { path: '/my/users/USER-001', title: '사용자 등록 정보 (샘플)' }
    ]
  },
  {
    name: '견적',
    routes: [
      { path: '/estimate', title: '등기 견적 관리' },
      { path: '/estimate/create/REG-2024-001', title: '견적서 작성/제출 상세 (샘플)' },
      { path: '/estimate/detail/REG-2024-002', title: '견적서 확인/철회 상세 (샘플)' }
    ]
  },
  {
    name: '등기',
    routes: [
      { path: '/registration', title: '등기 진행 현황' },
      { path: '/registration/CASE-001', title: '등기 진행 상세 (샘플)' },
      { path: '/registration/schedule', title: '등기 일정 관리' }
    ]
  },
  {
    name: '공통',
    routes: [
      { path: '/viewer', title: '웹뷰어' },
      { path: '/device-info', title: '등록 단말기 정보' }
    ]
  },
  {
    name: '에러',
    routes: [
      { path: '/error/404', title: '404 페이지' },
      { path: '/error/mac-os', title: '접속 오류 (Mac OS)' },
      { path: '/error/mobile', title: '접속 오류 (모바일)' }
    ]
  }
]

// State
const isNavOpen = ref(false)
const isFrameOpen = ref(false)
const isAuthMonitorOpen = ref(false)
const currentFrameSize = ref<FrameSize>(FRAME_SIZES[0]!) as Ref<FrameSize>

// Polling interval
let storagePollingInterval: ReturnType<typeof setInterval> | null = null

// ============================================================================
// 실시간 Storage 갱신
// ============================================================================

/**
 * Storage 데이터 갱신 (실시간)
 */
const refreshStorageData = () => {
  storageData.value = storage.get()
  updateCount.value++
}

/**
 * Storage 변경 감지 (다른 탭)
 */
const handleStorageChange = (event: StorageEvent) => {
  const authKeys = [
    'access_token',
    'refresh_token',
    'access_expires',
    'refresh_expires',
    'login_id',
    'user_id',
    'role_level',
    'bank_code'
  ]

  if (event.key && authKeys.includes(event.key)) {
    console.log('[DevNav] Storage changed:', event.key)
    refreshStorageData()
  }
}

/**
 * 주기적 Storage 갱신 (2초마다)
 */
const startStoragePolling = () => {
  if (storagePollingInterval) return

  storagePollingInterval = setInterval(() => {
    if (isAuthMonitorOpen.value) {
      refreshStorageData()
    }
  }, 2000) // 2초마다 갱신
}

const stopStoragePolling = () => {
  if (storagePollingInterval) {
    clearInterval(storagePollingInterval)
    storagePollingInterval = null
  }
}

/**
 * 수동 새로고침
 */
const manualRefresh = () => {
  refreshStorageData()
  // 새로고침 피드백
  const button = document.querySelector('.refresh-button') as HTMLElement
  if (button) {
    button.style.transform = 'rotate(360deg)'
    setTimeout(() => {
      button.style.transform = ''
    }, 300)
  }
}

// ============================================================================
// Watch - authStore 변경 감지 (실시간)
// ============================================================================

/**
 * authStore의 주요 값 변경 시 Storage도 갱신
 * (authStore 변경 → Storage 변경 → DevNav 갱신)
 */
watch(
  () => [
    authStore.loginId,
    authStore.selectedBankCode,
    authStore.accessExpires,
    authStore.roleLevel
  ],
  () => {
    // authStore가 변경되면 Storage도 변경되었을 가능성이 높음
    if (isAuthMonitorOpen.value) {
      refreshStorageData()
    }
  },
  { deep: true }
)

// Computed
const frameStyle = computed(() => {
  const size = currentFrameSize.value
  return {
    width: `${size.width}px`,
    height: `${size.height}px`,
    maxWidth: '90vw',
    maxHeight: '85vh'
  }
})

// Methods
const truncateToken = (token: string | null): string => {
  if (!token) return '(empty)'
  if (token.length <= 20) return token
  return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`
}

const getAuthorizationHeader = (): string => {
  if (!storageData.value.accessToken) return '(empty)'
  const token = storageData.value.accessToken
  if (token.length <= 30) return `Bearer ${token}`
  return `Bearer ${token.substring(0, 15)}...${token.substring(token.length - 15)}`
}

const copyToken = async (token: string | null) => {
  if (!token) return

  try {
    await navigator.clipboard.writeText(token)
    alert('토큰이 클립보드에 복사되었습니다!')
  } catch (err) {
    console.error('복사 실패:', err)
    alert('복사에 실패했습니다.')
  }
}

const toggleNav = () => {
  if (isFrameOpen.value) isFrameOpen.value = false
  if (isAuthMonitorOpen.value) isAuthMonitorOpen.value = false
  isNavOpen.value = !isNavOpen.value
  document.body.style.overflow = isNavOpen.value ? 'hidden' : ''
}

const closeNav = () => {
  isNavOpen.value = false
  document.body.style.overflow = ''
}

const toggleFrame = () => {
  if (isNavOpen.value) isNavOpen.value = false
  if (isAuthMonitorOpen.value) isAuthMonitorOpen.value = false
  isFrameOpen.value = !isFrameOpen.value
  document.body.style.overflow = isFrameOpen.value ? 'hidden' : ''
}

const toggleAuthMonitor = () => {
  if (isNavOpen.value) isNavOpen.value = false
  if (isFrameOpen.value) isFrameOpen.value = false
  isAuthMonitorOpen.value = !isAuthMonitorOpen.value

  // 모니터를 열 때 즉시 데이터 갱신 및 폴링 시작
  if (isAuthMonitorOpen.value) {
    refreshStorageData()
    startStoragePolling()
  } else {
    stopStoragePolling()
  }
}

// Lifecycle
onMounted(() => {
  // 초기 데이터 로드
  refreshStorageData()

  // Storage 이벤트 리스너 등록 (다른 탭 감지)
  window.addEventListener('storage', handleStorageChange)

  console.log('[DevNav] Mounted - Real-time monitoring enabled')
})

onBeforeUnmount(() => {
  // Storage 이벤트 리스너 제거
  window.removeEventListener('storage', handleStorageChange)

  // 폴링 정지
  stopStoragePolling()

  console.log('[DevNav] Unmounted - Monitoring stopped')
})
</script>

<style scoped>
/* 기존 스타일 동일 */
.floating-button {
  position: fixed;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #eeeeee;
  border: 2px solid #dddddd;
  font-size: 24px;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-button:hover {
  transform: scale(1.1);
}

.nav-button {
  bottom: 20px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.nav-button:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.frame-button {
  bottom: 90px;
  box-shadow: 0 4px 15px rgba(118, 75, 162, 0.4);
}

.frame-button:hover {
  box-shadow: 0 6px 20px rgba(118, 75, 162, 0.6);
}

.frame-button.active {
  background-color: #5a3780;
}

.auth-button {
  bottom: 160px;
  box-shadow: 0 4px 15px rgba(52, 211, 153, 0.4);
}

.auth-button:hover {
  box-shadow: 0 6px 20px rgba(52, 211, 153, 0.6);
}

.auth-button.active {
  background-color: #10b981;
}

.auth-monitor {
  position: fixed;
  bottom: 230px;
  right: 20px;
  width: 400px;
  max-height: 70vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.auth-monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  flex-shrink: 0;
}

.auth-monitor-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.refresh-button {
  border: none;
  background: transparent;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  width: 32px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.refresh-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-auth-monitor {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-auth-monitor:hover {
  background: rgba(255, 255, 255, 0.2);
}

.auth-monitor-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.monitor-section {
  margin-bottom: 20px;
}

.monitor-section h5 {
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

.monitor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  margin-bottom: 6px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 14px;
}

.monitor-item .label {
  color: #6b7280;
  font-weight: 600;
  font-size: 14px;
  min-width: 140px;
  flex-shrink: 0;
}

.monitor-item .value {
  color: #111827;
  font-weight: 500;
  font-size: 14px;
  word-break: break-all;
  text-align: right;
}

.monitor-item .value.token {
  font-size: 12px;
  color: #6b7280;
  font-family: 'Courier New', monospace;
}

.token-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.copy-button {
  background: #e5e7eb;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.copy-button:hover {
  background: #d1d5db;
}

.copy-button:active {
  transform: scale(0.95);
}

.monitor-item .value.state-pre-auth {
  color: #dc2626;
  font-weight: 700;
}

.monitor-item .value.state-onboarding {
  color: #d97706;
  font-weight: 700;
}

.monitor-item .value.state-auth {
  color: #059669;
  font-weight: 700;
}

.monitor-item .value.true {
  color: #059669;
  font-weight: 700;
}

.monitor-item .value.false {
  color: #dc2626;
  font-weight: 700;
}

.monitor-item .value.expiring {
  color: #d97706;
  font-weight: 700;
}

.monitor-item .value.expired {
  color: #dc2626;
  font-weight: 700;
}

.section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
  margin: 20px 0;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  cursor: pointer;
  border: none;
  padding: 0;
  width: 100%;
  height: 100%;
}

.frame-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.frame-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.frame-size-button,
.frame-close-button {
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.frame-size-button {
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
}

.frame-size-button:hover {
  background: #f0f2ff;
  transform: translateY(-2px);
}

.frame-size-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #764ba2;
}

.frame-close-button {
  border: 2px solid #e74c3c;
  background: white;
  color: #e74c3c;
  margin-left: 10px;
}

.frame-close-button:hover {
  background: #e74c3c;
  color: white;
  transform: translateY(-2px);
}

.frame-container {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.frame-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  z-index: 10;
  pointer-events: none;
}

.frame-content {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.nav-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.nav-header {
  position: sticky;
  top: 0;
  background: white;
  padding: 25px;
  border-bottom: 2px solid #f0f0f0;
  z-index: 1;
}

.nav-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.nav-content {
  flex: 1;
  padding: 20px;
}

.nav-category {
  margin-bottom: 30px;
}

.nav-category h4 {
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
  border-bottom: 2px solid #667eea;
}

.nav-category ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-category li {
  margin-bottom: 4px;
}

.nav-category a {
  display: flex;
  flex-direction: column;
  padding: 12px 15px;
  text-decoration: none;
  color: #555;
  border-radius: 8px;
  transition: all 0.2s;
  background: #f8f9fa;
}

.nav-category a:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.nav-category a.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.route-title {
  font-weight: 600;
  font-size: 14px;
}

.route-path {
  font-size: 12px;
  opacity: 0.7;
  font-family: monospace;
}

.nav-menu::-webkit-scrollbar,
.auth-monitor-content::-webkit-scrollbar {
  width: 8px;
}

.nav-menu::-webkit-scrollbar-track,
.auth-monitor-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.nav-menu::-webkit-scrollbar-thumb,
.auth-monitor-content::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.nav-menu::-webkit-scrollbar-thumb:hover,
.auth-monitor-content::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
