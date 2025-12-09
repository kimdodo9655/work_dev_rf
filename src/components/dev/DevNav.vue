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

    <!-- 인증 상태 토글 버튼 -->
    <button
      class="floating-button auth-button"
      :class="{ active: isAuthMenuOpen }"
      @click="toggleAuthMenu"
      aria-label="인증 상태 전환"
    >
      🔐
    </button>

    <!-- 인증 상태 메뉴 -->
    <transition name="slide-up">
      <div v-if="isAuthMenuOpen" class="auth-menu">
        <div class="auth-menu-header">
          <h4>인증 상태</h4>
          <button class="close-auth-menu" @click="toggleAuthMenu">✕</button>
        </div>
        <div class="auth-menu-content">
          <div class="current-state">
            현재 상태:
            <span class="state-badge" :class="currentAuthState">{{
              getStateLabel(currentAuthState)
            }}</span>
          </div>
          <div class="auth-states">
            <button
              v-for="state in AUTH_STATES"
              :key="state"
              class="auth-state-button"
              :class="{ active: currentAuthState === state }"
              @click="setAuthState(state)"
            >
              {{ getStateLabel(state) }}
            </button>
          </div>

          <div class="section-divider"></div>

          <div class="current-state">
            현재 레벨:
            <span class="level-badge" :class="`level-${currentLevelState}`">{{
              getLevelLabel(currentLevelState)
            }}</span>
          </div>
          <div class="auth-states">
            <button
              v-for="level in LEVEL_STATES"
              :key="level"
              class="level-state-button"
              :class="{ active: currentLevelState === level }"
              @click="setLevelState(level)"
            >
              {{ getLevelLabel(level) }}
            </button>
          </div>
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
import { computed, type Ref, ref } from 'vue'

import { useDevOptions } from '@/composables/useDevOptions'

interface FrameSize {
  name: string
  width: number
  height: number
}

// Dev Options
const {
  currentAuthState,
  currentLevelState,
  setAuthState,
  setLevelState,
  AUTH_STATES,
  LEVEL_STATES
} = useDevOptions()

// Constants
const FRAME_SIZES: FrameSize[] = [
  { name: '1920×1200', width: 1920, height: 1200 },
  { name: '1280×1024', width: 1280, height: 1024 }
]

const ROUTE_CATEGORIES = [
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
      { path: '/dashboard', title: '메인화면' },
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
const isAuthMenuOpen = ref(false)
const currentFrameSize = ref<FrameSize>(FRAME_SIZES[0]!) as Ref<FrameSize>

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
const getStateLabel = (state: string): string => {
  return state
}

const getLevelLabel = (level: string): string => {
  const roleLabels: Record<string, string> = {
    '100': 'Level 100 (사용자)',
    '200': 'Level 200 (지점 관리자)',
    '300': 'Level 300 (기관 관리자)'
  }
  return roleLabels[level] || `Level ${level}`
}

const toggleNav = () => {
  if (isFrameOpen.value) isFrameOpen.value = false
  if (isAuthMenuOpen.value) isAuthMenuOpen.value = false
  isNavOpen.value = !isNavOpen.value
  document.body.style.overflow = isNavOpen.value ? 'hidden' : ''
}

const closeNav = () => {
  isNavOpen.value = false
  document.body.style.overflow = ''
}

const toggleFrame = () => {
  if (isNavOpen.value) isNavOpen.value = false
  if (isAuthMenuOpen.value) isAuthMenuOpen.value = false
  isFrameOpen.value = !isFrameOpen.value
  document.body.style.overflow = isFrameOpen.value ? 'hidden' : ''
}

const toggleAuthMenu = () => {
  if (isNavOpen.value) isNavOpen.value = false
  if (isFrameOpen.value) isFrameOpen.value = false
  isAuthMenuOpen.value = !isAuthMenuOpen.value
}
</script>

<style scoped>
/* 플로팅 버튼 공통 스타일 */
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

/* 인증 상태 메뉴 */
.auth-menu {
  position: fixed;
  bottom: 230px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  overflow: hidden;
}

.auth-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.auth-menu-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.close-auth-menu {
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

.close-auth-menu:hover {
  background: rgba(255, 255, 255, 0.2);
}

.auth-menu-content {
  padding: 20px;
}

.current-state {
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.state-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  font-family: monospace;
}

.state-badge.pre-auth {
  background: #fee2e2;
  color: #991b1b;
}

.state-badge.onboarding {
  background: #fef3c7;
  color: #92400e;
}

.state-badge.auth {
  background: #d1fae5;
  color: #065f46;
}

.section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
  margin: 20px 0;
}

.level-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  font-family: monospace;
}

.level-badge.level-100 {
  background: #dbeafe;
  color: #1e40af;
}

.level-badge.level-200 {
  background: #e0e7ff;
  color: #4338ca;
}

.level-badge.level-300 {
  background: #f3e8ff;
  color: #6b21a8;
}

.auth-states {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-state-button {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  font-family: monospace;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.auth-state-button:hover {
  border-color: #10b981;
  background: #f0fdf4;
  transform: translateX(4px);
}

.auth-state-button.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-color: #059669;
}

.level-state-button {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  font-family: monospace;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.level-state-button:hover {
  border-color: #6366f1;
  background: #eef2ff;
  transform: translateX(4px);
}

.level-state-button.active {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border-color: #4f46e5;
}

/* 오버레이 */
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

.overlay:focus {
  outline: 2px solid #667eea;
  outline-offset: -2px;
}

/* 프레임 오버레이 */
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

/* 네비게이션 메뉴 */
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

/* 스크롤바 */
.nav-menu::-webkit-scrollbar {
  width: 8px;
}

.nav-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.nav-menu::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.nav-menu::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

/* 애니메이션 */
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
