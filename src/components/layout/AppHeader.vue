<template>
  <div class="fixed-area">
    <div class="fixed-inner">
      <header ref="headerRef" class="main-header">
        <nav>
          <router-link to="/" v-if="currentAuthState === 'auth'">
            <img class="logo" src="@/assets/images/logo/test_bank_logo.png" alt="logo" />
          </router-link>

          <img
            v-if="currentAuthState === 'onboarding'"
            class="logo"
            src="@/assets/images/logo/bankclear_logo_bk.png"
            alt="logo"
          />

          <ul class="navigation-menu" v-if="navigationMenuItems.length > 0">
            <li
              v-for="(item, index) in navigationMenuItems"
              :key="index"
              :class="{ active: isActiveMenu(item.path) }"
            >
              <router-link :to="item.path">{{ item.label }}</router-link>
            </li>
          </ul>

          <ul class="user-actions">
            <li class="bell" v-if="currentAuthState === 'auth'">
              <i class="fi fi-ss-bell"></i>
            </li>
            <li class="user" v-if="currentAuthState === 'auth'">
              <i class="fi fi-ss-user-gear"></i>

              <!-- <div class="my-menu-area">
                <div class="triangle-up"></div>
                <nav>
                  <ul>
                    <li v-if="currentLevelState === '300' || currentLevelState === '200'">
                      <router-link to="/my/organization">
                        <i class="fi fi-ss-apartment"></i>
                        {{ locale.myMenu.nav01 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </router-link>
                    </li>
                    <li v-if="currentLevelState === '300' || currentLevelState === '200'">
                      <router-link to="/my/users">
                        <i class="fi fi-ss-users-alt"></i>
                        {{ locale.myMenu.nav02 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </router-link>
                    </li>
                    <li v-if="currentLevelState === '100'">
                      <router-link to="/my/profile">
                        <i class="fi fi-ss-user"></i>
                        {{ locale.myMenu.nav03 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/bank-select">
                        <i class="fi fi-ss-bank"></i>
                        {{ locale.myMenu.nav04 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/">
                        <i class="fi fi-ss-exclamation"></i>
                        {{ locale.myMenu.nav05 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </router-link>
                    </li>
                    <li class="logout">
                      <router-link to="/">
                        <i class="fi fi-ss-leave"></i>
                        {{ locale.myMenu.nav06 }}
                        <i class="fi fi-rs-angle-circle-right"></i>
                      </router-link>
                    </li>
                  </ul>
                </nav>
              </div> -->
            </li>
            <li class="session-timer">
              <i class="fi fi-ss-clock-three"></i>
              <p>00:00</p>
              <button>{{ locale.header.extend }}</button>
            </li>
            <li v-if="currentAuthState === 'onboarding'">
              <button>{{ locale.myMenu.nav06 }}</button>
            </li>
          </ul>
        </nav>
      </header>

      <div ref="breadcrumbsRef" class="breadcrumbs" v-if="currentAuthState === 'auth'">
        <i class="fi fi-ss-home"></i>
        <p>{{ locale.common.home }}</p>
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
          <i class="fi fi-rs-angle-small-right"></i>
          <p>{{ crumb }}</p>
        </template>
      </div>

      <!-- <h1 class="page-title">{{ pageTitle }}</h1> -->
    </div>
  </div>
  <h1 class="page-title">{{ pageTitle }}</h1>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useDevOptions } from '@/composables/useDevOptions'
import locale from '@/locales/ko.json'

// 전역 상태
const { currentAuthState, currentLevelState } = useDevOptions()
const route = useRoute()

// Refs
const breadcrumbsRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)

// Constants
const SCROLL_THRESHOLD = 1

// 네비게이션 메뉴 아이템
const navigationMenuItems = computed(() => {
  if (currentAuthState.value === 'auth') {
    return [
      { path: '/estimate', label: locale.pageTitle.estimate.list },
      { path: '/registration', label: locale.pageTitle.registration.caseStatus },
      { path: '/registration/schedule', label: locale.pageTitle.registration.schedule }
    ]
  }

  if (currentAuthState.value === 'onboarding') {
    const isManager = currentLevelState.value === '300' || currentLevelState.value === '200'

    if (isManager) {
      return [
        { path: '/bank-select', label: locale.pageTitle.main.bankSelect },
        { path: '/my/organization', label: locale.myMenu.nav01 },
        { path: '/my/users', label: locale.myMenu.nav02 }
      ]
    }

    return [
      { path: '/bank-select', label: locale.pageTitle.main.bankSelect },
      { path: '/my/profile', label: locale.myMenu.nav03 }
    ]
  }

  return []
})

// 브레드크럼 생성
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
    // 온보딩 상태면 '금융기관 선택', auth 상태면 '금융기관 변경'
    if (currentAuthState.value === 'onboarding') {
      pathArray.push(locale.pageTitle.main.bankSelect)
    } else {
      pathArray.push(locale.myMenu.nav04)
    }
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

// 페이지 타이틀
const pageTitle = computed(() => {
  // /bank-select 페이지는 상태에 따라 다른 타이틀
  if (route.path === '/bank-select') {
    return currentAuthState.value === 'onboarding'
      ? locale.pageTitle.main.bankSelect
      : locale.myMenu.nav04
  }

  return route.meta.title || breadcrumbs.value[breadcrumbs.value.length - 1] || ''
})

// 메뉴 활성화 체크
const isActiveMenu = (menuPath: string) => {
  const currentPath = route.path

  // 정확히 일치하는 경우
  if (currentPath === menuPath) {
    return true
  }

  // '/registration/schedule'과 '/registration'을 구분하기 위한 특별 처리
  if (menuPath === '/registration' && currentPath.startsWith('/registration/schedule')) {
    return false
  }

  // 하위 경로인 경우 (단, '/'는 제외)
  if (menuPath !== '/' && currentPath.startsWith(menuPath + '/')) {
    return true
  }

  return false
}

// 스크롤 핸들러
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

// Lifecycle
onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
