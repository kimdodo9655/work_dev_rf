<template>
  <div class="Search-panel">
    <form @submit.prevent="handleSubmit">
      <div class="input-area">
        <!-- 기관구분 선택 -->
        <SearchSelect
          v-model="searchParams.organizationType"
          :label="t('my.users.search.organizationType')"
          :options="optionOrganizationType"
        />

        <!-- 기관명칭 선택 -->
        <SearchSelect
          v-model="searchParams.organizationName"
          :label="t('my.users.search.organizationName')"
          :options="optionOrganizationName"
        />

        <!-- 지점명칭 선택 -->
        <SearchSelect
          v-model="searchParams.branchName"
          :label="t('my.users.search.branchName')"
          :options="optionBranchName"
        />

        <!-- 사용권한 선택 -->
        <SearchSelect
          v-model="searchParams.roleLevel"
          :label="t('my.users.search.permission')"
          :options="optionRoleLevel"
        />

        <!-- 이메일 인증 선택 -->
        <SearchSelect
          v-model="emailVerifiedFilter"
          :label="t('my.users.search.emailVerification')"
          :options="optionEmailVerification"
        />

        <!-- 사용유무 선택 -->
        <SearchSelect
          v-model="searchParams.userStatus"
          :label="t('my.users.search.activeStatus')"
          :options="optionUserStatus"
        />

        <!-- 통합검색 (아이디 및 사용자 이름) -->
        <SearchInput
          v-model="searchParams.keyword"
          :label="t('common.integrated')"
          :placeholder="t('my.users.search.searchPlaceholder')"
          @search="handleSearch"
        />
      </div>
      <input type="submit" value="검색" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { AxiosError } from 'axios'
import { computed, onMounted, reactive, ref } from 'vue'

import { api } from '@/api/client'
import SearchInput from '@/components/template/input/SearchInput.vue'
import SearchSelect from '@/components/template/input/SearchSelect.vue'
import { useCodes } from '@/composables/useCodes'
import { useMessage } from '@/composables/useMessage'
import type { SelectOption } from '@/types'
import { logger } from '@/utils/logger'

// ============================================================================
// 타입 정의
// ============================================================================
type UserStatusLabel = '사용' | '미사용' | '승인대기' | '삭제' | '임시승인'

interface User {
  rowNumber: number
  userId: number
  branchId: number
  organizationType: string
  organizationTypeDescription: string
  organizationTypeCustom: string | null
  organizationName: string
  branchName: string
  loginId: string
  name: string
  roleLevel: string
  roleLevelValue: number
  roleLevelName: string
  isEmailVerified: boolean
  userStatus: string
  userStatusDescription: string
}

interface ApiResponse {
  status: number
  code: string
  title: string
  message: string
  data: {
    content: User[]
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
      paged: boolean
      unpaged: boolean
    }
    last: boolean
    totalElements: number
    totalPages: number
    size: number
    number: number
    first: boolean
    numberOfElements: number
    empty: boolean
  }
}

interface SearchParams {
  organizationType?: string
  organizationName?: string
  branchName?: string
  roleLevel?: string
  isEmailVerified?: boolean
  keyword?: string
  userStatus?: string
  page: number
  size: number
}

// ============================================================================
// 상수 (설정 관리)
// ============================================================================
const USER_STATUS_CONFIG = {
  ALLOWED_LABELS: ['사용', '미사용', '승인대기', '삭제', '임시승인'] as const,
  LABEL_MAPPING: {
    임시승인: '제한사용'
  } as Partial<Record<UserStatusLabel, string>>
}

// ============================================================================
// Composables
// ============================================================================
const { t } = useMessage()
const { codes, fetchCodesByCategory } = useCodes()

// ============================================================================
// State
// ============================================================================
const users = ref<User[]>([])
const loading = ref(false)
const error = ref<{
  message: string
  details?: string
} | null>(null)

const searchParams = reactive<SearchParams>({
  organizationType: '',
  organizationName: '',
  branchName: '',
  roleLevel: '',
  keyword: '',
  userStatus: '',
  page: 1,
  size: 10
})

// 이메일 인증 필터 (string <-> boolean 변환)
const emailVerifiedFilter = ref<string>('')

const pagination = reactive({
  first: true,
  last: false,
  totalElements: 0,
  totalPages: 0,
  number: 1,
  size: 10
})

// ============================================================================
// Computed - 공통코드 옵션
// ============================================================================

// 조직 유형 옵션
const optionOrganizationType = computed<SelectOption[]>(() => {
  const options = codes.value.organizationTypes.map((type) => ({
    value: type.code,
    label: type.description
  }))

  return [{ label: '전체', value: '' }, ...options]
})

// 사용자 상태 옵션 (필터링 + 라벨 변경)
const optionUserStatus = computed<SelectOption[]>(() => {
  const filteredOptions = codes.value.userStatuses
    .filter((status) =>
      USER_STATUS_CONFIG.ALLOWED_LABELS.includes(status.description as UserStatusLabel)
    )
    .map((status) => ({
      value: status.code,
      label:
        USER_STATUS_CONFIG.LABEL_MAPPING[status.description as UserStatusLabel] ??
        status.description
    }))

  return [{ label: '전체', value: '' }, ...filteredOptions]
})

// 권한 레벨 옵션
const optionRoleLevel = computed<SelectOption[]>(() => {
  const options = codes.value.userRoleLevels.map((role) => ({
    value: role.code,
    label: role.description
  }))

  return [{ label: '전체', value: '' }, ...options]
})

// 이메일 인증 옵션 (하드코딩)
const optionEmailVerification = computed<SelectOption[]>(() => [
  { label: '전체', value: '' },
  { label: '인증완료', value: 'true' },
  { label: '미인증', value: 'false' }
])

// TODO: 실제 API에서 조직명, 지점명 목록을 가져와야 함
const optionOrganizationName = computed<SelectOption[]>(() => [
  { label: '전체', value: '' }
  // 실제로는 API에서 조직 목록을 가져와야 함
])

const optionBranchName = computed<SelectOption[]>(() => [
  { label: '전체', value: '' }
  // 실제로는 API에서 지점 목록을 가져와야 함
])

// ============================================================================
// Lifecycle
// ============================================================================
onMounted(async () => {
  // 공통코드 로드
  try {
    await Promise.all([
      fetchCodesByCategory('organizationTypes'),
      fetchCodesByCategory('userStatuses'),
      fetchCodesByCategory('userRoleLevels')
    ])
    logger.info('[사용자 관리] 공통코드 로드 완료')
  } catch (err) {
    logger.error('[사용자 관리] 공통코드 로드 실패', { error: err })
  }

  // 사용자 목록 로드
  fetchUsers()
})

// ============================================================================
// Methods
// ============================================================================

// 폼 제출 핸들러
const handleSubmit = () => {
  handleSearch()
}

// API 호출
const fetchUsers = async () => {
  try {
    loading.value = true
    error.value = null

    // 쿼리 파라미터 구성 - page와 size는 필수
    const params: Record<string, string | number | boolean> = {
      page: searchParams.page,
      size: searchParams.size
    }

    // 값이 있는 필터만 추가 (빈 문자열 제외)
    if (searchParams.organizationType) {
      params.organizationType = searchParams.organizationType
    }
    if (searchParams.organizationName) {
      params.organizationName = searchParams.organizationName
    }
    if (searchParams.branchName) {
      params.branchName = searchParams.branchName
    }
    if (searchParams.roleLevel) {
      params.roleLevel = searchParams.roleLevel
    }
    if (searchParams.userStatus) {
      params.userStatus = searchParams.userStatus
    }
    if (searchParams.keyword?.trim()) {
      params.keyword = searchParams.keyword.trim()
    }
    if (emailVerifiedFilter.value) {
      params.isEmailVerified = emailVerifiedFilter.value === 'true'
    }

    logger.info('[사용자 관리] API 요청', { url: '/api/users/search', params })

    const response = await api.get<ApiResponse>('/api/users/search', { params })

    logger.info('[사용자 관리] API 응답 성공', {
      totalElements: response.data.data.totalElements,
      contentLength: response.data.data.content.length
    })

    if (response.data.status === 200) {
      users.value = response.data.data.content

      // 페이지네이션 정보 업데이트
      Object.assign(pagination, {
        first: response.data.data.first,
        last: response.data.data.last,
        totalElements: response.data.data.totalElements,
        totalPages: response.data.data.totalPages,
        number: response.data.data.number,
        size: response.data.data.size
      })
    } else {
      throw new Error(response.data.message || '알 수 없는 오류가 발생했습니다.')
    }
  } catch (err) {
    logger.error('[사용자 관리] API 요청 실패', { error: err })

    if (err instanceof AxiosError) {
      const status = err.response?.status
      const errorData = err.response?.data

      switch (status) {
        case 400:
          error.value = {
            message: '잘못된 요청입니다.',
            details:
              errorData?.data?.message ||
              errorData?.message ||
              errorData?.title ||
              '요청 파라미터를 확인해주세요.'
          }
          break
        case 401:
          error.value = {
            message: '인증이 필요합니다.',
            details: '세션이 만료되었습니다. 다시 로그인해주세요.'
          }
          break
        case 403:
          error.value = {
            message: '접근 권한이 없습니다.',
            details: '해당 기능에 대한 권한이 없습니다. 관리자에게 문의하세요.'
          }
          break
        case 500:
          error.value = {
            message: '서버 오류가 발생했습니다.',
            details:
              errorData?.message ||
              errorData?.title ||
              '서버에서 요청을 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
          }
          break
        case 502:
        case 503:
        case 504:
          error.value = {
            message: '서버에 연결할 수 없습니다.',
            details: '서버가 일시적으로 응답하지 않습니다. 잠시 후 다시 시도해주세요.'
          }
          break
        default:
          error.value = {
            message: '사용자 목록을 불러오는데 실패했습니다.',
            details: err.message || '알 수 없는 오류가 발생했습니다.'
          }
      }
    } else {
      error.value = {
        message: '알 수 없는 오류가 발생했습니다.',
        details: err instanceof Error ? err.message : String(err)
      }
    }
  } finally {
    loading.value = false
  }
}

// 검색 핸들러
const handleSearch = () => {
  searchParams.page = 1 // 검색 시 1페이지로
  fetchUsers()
}
</script>
