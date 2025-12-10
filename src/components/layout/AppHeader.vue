<template>
  <div class="fixed-area">
    <div class="fixed-inner">
      <header ref="headerRef" class="main-header">
        <nav>
          <!-- 로고 -->
          <router-link v-if="authStore.authState === 'auth'" to="/">
            <img class="logo" src="@/assets/images/logo/test_bank_logo.png" alt="logo" />
          </router-link>

          <img
            v-if="authStore.authState === 'onboarding'"
            class="logo"
            src="@/assets/images/logo/bankclear_logo_bk.png"
            alt="logo"
          />

          <!-- 메인 네비게이션 -->
          <ul class="navigation-menu" v-if="navigationMenuItems.length > 0">
            <li
              v-for="(item, index) in navigationMenuItems"
              :key="index"
              :class="{ active: isActiveMenu(item.path) }"
            >
              <router-link :to="item.path">{{ item.label }}</router-link>
            </li>
          </ul>

          <!-- 사용자 액션 -->
          <ul class="user-actions">
            <!-- 알림 (auth 상태만) -->
            <li class="bell" v-if="authStore.authState === 'auth'">
              <i class="fi fi-ss-bell"></i>
            </li>

            <!-- 마이 메뉴 (auth 상태만) -->
            <li class="user" v-if="authStore.authState === 'auth'" @click="toggleMyMenu">
              <i class="fi fi-ss-user-gear"></i>

              <!-- 마이 메뉴 드롭다운 -->
              <div v-if="isMyMenuOpen" class="my-menu-area">
                <div class="triangle-up"></div>
                <nav>
                  <ul>
                    <li v-if="canAccessOrgMgmt">
                      <router-link to="/my/organization" @click="closeMyMenu">
                        <i class="fi fi-ss-apartment"></i>
                        {{ locale.myMenu.nav01 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </router-link>
                    </li>
                    <li v-if="canAccessOrgMgmt">
                      <router-link to="/my/users" @click="closeMyMenu">
                        <i class="fi fi-ss-users-alt"></i>
                        {{ locale.myMenu.nav02 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </router-link>
                    </li>
                    <li v-if="!canAccessOrgMgmt">
                      <router-link to="/my/profile" @click="closeMyMenu">
                        <i class="fi fi-ss-user"></i>
                        {{ locale.myMenu.nav03 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/bank-select" @click="closeMyMenu">
                        <i class="fi fi-ss-bank"></i>
                        {{ locale.myMenu.nav04 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/" @click="closeMyMenu">
                        <i class="fi fi-ss-exclamation"></i>
                        {{ locale.myMenu.nav05 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </router-link>
                    </li>
                    <li class="logout">
                      <a @click="handleLogout">
                        <i class="fi fi-ss-leave"></i>
                        {{ locale.myMenu.nav06 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </li>

            <!-- 세션 타이머 (auth 상태만) 👈 추가 -->
            <li
              v-if="authStore.authState === 'auth'"
              class="session-timer"
              :class="{ expired: authStore.isExpired, expiring: authStore.isExpiringSoon }"
            >
              <i class="fi fi-ss-clock-three"></i>
              <p>{{ authStore.formattedTime }}</p>
              <button @click="handleExtendSession">{{ locale.header.extend }}</button>
            </li>

            <!-- 로그아웃 버튼 (onboarding 상태) 👈 추가 -->
            <li v-if="authStore.authState === 'onboarding'">
              <button class="logout-btn" @click="handleLogout">
                {{ locale.myMenu.nav06 }}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <!-- Breadcrumbs (auth 상태만) -->
      <div v-if="authStore.authState === 'auth'" ref="breadcrumbsRef" class="breadcrumbs">
        <i class="fi fi-ss-home"></i>
        <p>{{ locale.common.home }}</p>
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
          <i class="fi fi-rs-angle-small-right"></i>
          <p>{{ crumb }}</p>
        </template>
      </div>
    </div>
  </div>

  <!-- Page Title -->
  <h1 class="page-title">{{ pageTitle }}</h1>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { authAPI } from '@/api/auth'
import locale from '@/locales/ko.json'
import { useAuthStore } from '@/stores/auth'
import { RoleLevel } from '@/types'
import { storage } from '@/utils/storage'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// Refs
const breadcrumbsRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const isMyMenuOpen = ref(false)

// Constants
const SCROLL_THRESHOLD = 1

// ============================================================================
// Computed - 권한
// ============================================================================

const canAccessOrgMgmt = computed(() => {
  return (
    authStore.roleLevel === RoleLevel.ORGANIZATION_ADMIN ||
    authStore.roleLevel === RoleLevel.BRANCH_ADMIN ||
    authStore.isAdmin
  )
})

// ============================================================================
// Computed - 네비게이션 메뉴
// ============================================================================

const navigationMenuItems = computed(() => {
  if (authStore.authState === 'auth') {
    return [
      { path: '/estimate', label: locale.pageTitle.estimate.list },
      { path: '/registration', label: locale.pageTitle.registration.caseStatus },
      { path: '/registration/schedule', label: locale.pageTitle.registration.schedule }
    ]
  }

  if (authStore.authState === 'onboarding') {
    const items = [{ path: '/bank-select', label: locale.pageTitle.main.bankSelect }]

    if (canAccessOrgMgmt.value) {
      items.push({ path: '/my/organization', label: locale.myMenu.nav01 })
      items.push({ path: '/my/users', label: locale.myMenu.nav02 })
    } else {
      items.push({ path: '/my/profile', label: locale.myMenu.nav03 })
    }

    return items
  }

  return []
})

// ============================================================================
// Computed - Breadcrumbs & Page Title
// ============================================================================

const breadcrumbs = computed(() => {
  const pathArray: string[] = []
  const path = route.path

  if (path === '/dashboard' || path === '/') {
    return pathArray
  }

  if (path.startsWith('/my/')) {
    pathArray.push(locale.common.my)
    if (path.includes('organization') && path.split('/').length > 3) {
      pathArray.push(locale.pageTitle.my.organization)
      pathArray.push(locale.pageTitle.my.organizationDetail)
    } else if (path.includes('organization')) {
      pathArray.push(locale.pageTitle.my.organization)
    } else if (path.includes('users') && path.split('/').length > 3) {
      pathArray.push(locale.pageTitle.my.users)
      pathArray.push(locale.pageTitle.my.userDetail)
    } else if (path.includes('users')) {
      pathArray.push(locale.pageTitle.my.users)
    } else if (path.includes('profile')) {
      pathArray.push(locale.pageTitle.my.profile)
    }
  } else if (path === '/bank-select') {
    pathArray.push(locale.common.my)
    pathArray.push(
      authStore.authState === 'onboarding' ? locale.pageTitle.main.bankSelect : locale.myMenu.nav04
    )
  } else if (path.startsWith('/estimate')) {
    pathArray.push(locale.pageTitle.estimate.list)
    if (path.includes('create')) {
      pathArray.push(locale.pageTitle.estimate.createDetail)
    } else if (path.includes('detail')) {
      pathArray.push(locale.pageTitle.estimate.confirmDetail)
    }
  } else if (path.startsWith('/registration')) {
    if (path.includes('schedule')) {
      pathArray.push(locale.pageTitle.registration.schedule)
    } else if (path.split('/').length > 2 && route.params.caseId) {
      pathArray.push(locale.pageTitle.registration.caseStatus)
      pathArray.push(locale.pageTitle.registration.caseDetail)
    } else {
      pathArray.push(locale.pageTitle.registration.caseStatus)
    }
  }

  return pathArray
})

const pageTitle = computed(() => {
  if (route.path === '/bank-select') {
    return authStore.authState === 'onboarding'
      ? locale.pageTitle.main.bankSelect
      : locale.myMenu.nav04
  }

  return route.meta.title || breadcrumbs.value[breadcrumbs.value.length - 1] || ''
})

// ============================================================================
// Methods - 메뉴
// ============================================================================

const isActiveMenu = (menuPath: string) => {
  const currentPath = route.path

  if (currentPath === menuPath) {
    return true
  }

  if (menuPath === '/registration' && currentPath.startsWith('/registration/schedule')) {
    return false
  }

  if (menuPath !== '/' && currentPath.startsWith(menuPath + '/')) {
    return true
  }

  return false
}

const toggleMyMenu = () => {
  isMyMenuOpen.value = !isMyMenuOpen.value
}

const closeMyMenu = () => {
  isMyMenuOpen.value = false
}

// ============================================================================
// Methods - 인증
// ============================================================================

const handleLogout = async () => {
  if (!confirm('로그아웃 하시겠습니까?')) {
    return
  }

  try {
    await authAPI.logout()
  } catch (error) {
    console.error('로그아웃 오류:', error)
  } finally {
    authStore.clearAuth()
    router.push('/auth/login')
  }
}

const handleExtendSession = async () => {
  try {
    const { refreshToken } = storage.get() // ✅ storage에서 가져오기
    if (!refreshToken) throw new Error('No refresh token')

    const response = await authAPI.refresh({ refreshToken })
    authStore.updateTokens(response.data)

    alert('세션이 연장되었습니다.')
  } catch (error) {
    console.error('세션 연장 오류:', error)
    alert('세션 연장에 실패했습니다.')
  }
}

// ============================================================================
// Methods - 스크롤
// ============================================================================

function updateScrollState(isScrolled: boolean) {
  if (breadcrumbsRef.value) {
    breadcrumbsRef.value.classList.toggle('collapsed', isScrolled)
  }
  if (headerRef.value) {
    headerRef.value.classList.toggle('collapsed', isScrolled)
  }
}

function handleScroll() {
  const isScrolled = window.scrollY > SCROLL_THRESHOLD
  updateScrollState(isScrolled)
}

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 외부 클릭 시 마이 메뉴 닫기
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user') && !target.closest('.my-menu-area')) {
      closeMyMenu()
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 기존 스타일 유지 + 추가 스타일 */
.logout-btn {
  padding: 8px 16px;
  background-color: #ff4f4f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background-color: #e63946;
  transform: translateY(-2px);
}

.session-timer.expiring {
  background-color: #f59e0b !important;
}

.session-timer.expiring button {
  border-color: #f59e0b !important;
  color: #f59e0b !important;
}
</style>
