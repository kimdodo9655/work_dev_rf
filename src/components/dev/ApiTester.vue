<script setup lang="ts">
import axios from 'axios'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { api } from '@/api/client'
import defaultOpenApiSpec from '@/api/openapi.json'
import { useAuthStore } from '@/stores/auth'
import { storage } from '@/utils/storage'

// ============================================================================
// Props
// ============================================================================
interface Props {
  openApiSpec?: any // OpenAPI JSON 스펙 (선택, 기본값: @/api/openapi.json)
  apiSpecUrl?: string // OpenAPI JSON URL (선택)
}

const props = withDefaults(defineProps<Props>(), {
  openApiSpec: () => defaultOpenApiSpec,
  apiSpecUrl: undefined
})

// ============================================================================
// Auth Store & Storage
// ============================================================================
const authStore = useAuthStore()

// Storage 데이터 (실시간 갱신) - DevNav 방식 그대로
const storageData = ref(storage.get())
const updateCount = ref(0)

let storagePollingInterval: ReturnType<typeof setInterval> | null = null

// ============================================================================
// 타입 정의
// ============================================================================
interface Parameter {
  name: string
  in: 'query' | 'path' | 'header' | 'cookie'
  description?: string
  required: boolean
  schema: any
  example?: any
}

interface EndpointInfo {
  id: string
  path: string
  method: string
  summary: string
  description?: string
  tags: string[]
  parameters: Parameter[]
  requestBodySchema?: any
  requestBodyExample?: any
  code: string
  categoryCode: string
}

interface CategoryGroup {
  name: string
  code: string
  endpoints: EndpointInfo[]
}

// ✅ 할당된 은행 타입 정의
interface AssignedBank {
  bankCode: string
  bankName: string
  tier: number
  hasOwnershipTransfer: boolean
  hasMortgageRegistration: boolean
}

// ============================================================================
// 상태 관리
// ============================================================================
const searchQuery = ref('')
const selectedEndpoint = ref<EndpointInfo | null>(null)
const expandedCategories = ref(new Set<string>())
const pathParams = ref<Record<string, any>>({})
const queryParams = ref<Record<string, any>>({})
const requestBody = ref('')
const response = ref<any>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const statusCode = ref<number | null>(null)
const requestTime = ref<number>(0)

const categories = ref<CategoryGroup[]>([])
const isLoadingSpec = ref(false)
const specLoadError = ref<string | null>(null)
const uploadedFileName = ref<string | null>(null)
const showUploadModal = ref(false)
const showLoginModal = ref(false)
const selectedLoginUser = ref<any>(null)
const loginId = ref('')
const password = ref('P@ssw0rd1!')

// ✅ OpenAPI 스펙 전체 저장 ($ref 해석용)
// eslint-disable-next-line vue/no-dupe-keys
const openApiSpec = ref<any>(null)

// ✅ 할당된 은행 목록 및 선택된 은행 코드
const assignedBanks = ref<AssignedBank[]>([])
const selectedBankCode = ref<string>('bankclear') // 기본값 'bankclear'

// ✅ 토스트 상태 관리
const toastMessage = ref<string>('')
const showToast = ref<boolean>(false)

// ============================================================================
// 로그인 사용자 목록
// ============================================================================
const LOGIN_USERS = [
  {
    기관ID: '4',
    권한값: '80',
    권한명: '기관 관리자',
    기관명: '법무법인 태평양',
    로그인아이디: 'taepyeong_manager',
    사용자ID: '3',
    상태: '사용',
    이름: '김태평',
    이메일인증: 'Y',
    지점ID: '4',
    지점명: '본점'
  },
  {
    기관ID: '3',
    권한값: '90',
    권한명: '서비스 관리자',
    기관명: '시스템관리 기관',
    로그인아이디: 'manager',
    사용자ID: '2',
    상태: '사용',
    이름: '시스템 운영자',
    이메일인증: 'Y',
    지점ID: '3',
    지점명: '시스템관리본부'
  },
  {
    기관ID: '3',
    권한값: '100',
    권한명: '시스템 관리자',
    기관명: '시스템관리 기관',
    로그인아이디: 'admin',
    사용자ID: '1',
    상태: '사용',
    이름: '시스템 관리자',
    이메일인증: 'Y',
    지점ID: '3',
    지점명: '시스템관리본부'
  },
  {
    기관ID: '4',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 태평양',
    로그인아이디: 'tae003',
    사용자ID: '36',
    상태: '사용',
    이름: '정변호사',
    이메일인증: 'Y',
    지점ID: '4',
    지점명: '본점'
  },
  {
    기관ID: '4',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 태평양',
    로그인아이디: 'test_pending',
    사용자ID: '10',
    상태: '승인대기',
    이름: '승인대기자',
    이메일인증: 'N',
    지점ID: '4',
    지점명: '본점'
  },
  {
    기관ID: '4',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 태평양',
    로그인아이디: 'taepyeong_user1',
    사용자ID: '4',
    상태: '사용',
    이름: '박변호사',
    이메일인증: 'Y',
    지점ID: '4',
    지점명: '본점'
  },
  {
    기관ID: '4',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 태평양',
    로그인아이디: 'test_temporary',
    사용자ID: '11',
    상태: '임시승인',
    이름: '임시승인자',
    이메일인증: 'Y',
    지점ID: '4',
    지점명: '본점'
  },
  {
    기관ID: '4',
    권한값: '70',
    권한명: '지점 관리자',
    기관명: '법무법인 태평양',
    로그인아이디: 'taepyeong_busan_manager',
    사용자ID: '5',
    상태: '사용',
    이름: '최부산',
    이메일인증: 'Y',
    지점ID: '5',
    지점명: '부산지점'
  },
  {
    기관ID: '4',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 태평양',
    로그인아이디: 'tae002',
    사용자ID: '35',
    상태: '사용',
    이름: '이변호사',
    이메일인증: 'Y',
    지점ID: '4',
    지점명: '본점'
  },
  {
    기관ID: '5',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 광장',
    로그인아이디: 'gwang02',
    사용자ID: '39',
    상태: '사용',
    이름: '김변호사',
    이메일인증: 'Y',
    지점ID: '6',
    지점명: '본점'
  },
  {
    기관ID: '6',
    권한값: '70',
    권한명: '지점 관리자',
    기관명: '법무법인 세종',
    로그인아이디: 'sejong02',
    사용자ID: '16',
    상태: '사용',
    이름: '이세종',
    이메일인증: 'Y',
    지점ID: '11',
    지점명: '본점'
  },
  {
    기관ID: '4',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 태평양',
    로그인아이디: 'busan02',
    사용자ID: '37',
    상태: '사용',
    이름: '한변호사',
    이메일인증: 'Y',
    지점ID: '5',
    지점명: '부산지점'
  },
  {
    기관ID: '6',
    권한값: '80',
    권한명: '기관 관리자',
    기관명: '법무법인 세종',
    로그인아이디: 'sejong01',
    사용자ID: '15',
    상태: '사용',
    이름: '박세종',
    이메일인증: 'Y',
    지점ID: '11',
    지점명: '본점'
  },
  {
    기관ID: '5',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 광장',
    로그인아이디: 'gwang03',
    사용자ID: '40',
    상태: '사용',
    이름: '이변호사',
    이메일인증: 'Y',
    지점ID: '6',
    지점명: '본점'
  },
  {
    기관ID: '5',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 광장',
    로그인아이디: 'gwangjang_user1',
    사용자ID: '7',
    상태: '승인완료',
    이름: '정변호사',
    이메일인증: 'N',
    지점ID: '6',
    지점명: '본점'
  },
  {
    기관ID: '6',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 세종',
    로그인아이디: 'sejong03',
    사용자ID: '17',
    상태: '사용',
    이름: '정변호사',
    이메일인증: 'Y',
    지점ID: '11',
    지점명: '본점'
  },
  {
    기관ID: '5',
    권한값: '80',
    권한명: '기관 관리자',
    기관명: '법무법인 광장',
    로그인아이디: 'gwangjang_manager',
    사용자ID: '6',
    상태: '사용',
    이름: '이광장',
    이메일인증: 'Y',
    지점ID: '6',
    지점명: '본점'
  },
  {
    기관ID: '4',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 태평양',
    로그인아이디: 'busan03',
    사용자ID: '38',
    상태: '사용',
    이름: '강변호사',
    이메일인증: 'Y',
    지점ID: '5',
    지점명: '부산지점'
  },
  {
    기관ID: '8',
    권한값: '70',
    권한명: '지점 관리자',
    기관명: '이순신 변호사사무소',
    로그인아이디: 'lee_sunsin',
    사용자ID: '9',
    상태: '사용',
    이름: '이순신',
    이메일인증: 'Y',
    지점ID: '8',
    지점명: '본점'
  },
  {
    기관ID: '8',
    권한값: '30',
    권한명: '사용자',
    기관명: '이순신 변호사사무소',
    로그인아이디: 'sunsin03',
    사용자ID: '44',
    상태: '사용',
    이름: '박변호사',
    이메일인증: 'Y',
    지점ID: '8',
    지점명: '본점'
  },
  {
    기관ID: '8',
    권한값: '30',
    권한명: '사용자',
    기관명: '이순신 변호사사무소',
    로그인아이디: 'sunsin02',
    사용자ID: '43',
    상태: '사용',
    이름: '김변호사',
    이메일인증: 'Y',
    지점ID: '8',
    지점명: '본점'
  },
  {
    기관ID: '7',
    권한값: '30',
    권한명: '사용자',
    기관명: '홍길동 법무사사무소',
    로그인아이디: 'hong02',
    사용자ID: '41',
    상태: '사용',
    이름: '김법무사',
    이메일인증: 'Y',
    지점ID: '7',
    지점명: '본점'
  },
  {
    기관ID: '7',
    권한값: '30',
    권한명: '사용자',
    기관명: '홍길동 법무사사무소',
    로그인아이디: 'hong03',
    사용자ID: '42',
    상태: '사용',
    이름: '이법무사',
    이메일인증: 'Y',
    지점ID: '7',
    지점명: '본점'
  },
  {
    기관ID: '7',
    권한값: '70',
    권한명: '지점 관리자',
    기관명: '홍길동 법무사사무소',
    로그인아이디: 'hong_gildong',
    사용자ID: '8',
    상태: '사용',
    이름: '홍길동',
    이메일인증: 'Y',
    지점ID: '7',
    지점명: '본점'
  },
  {
    기관ID: '9',
    권한값: '80',
    권한명: '기관 관리자',
    기관명: '서울합동법무사사무소',
    로그인아이디: 'haps01',
    사용자ID: '20',
    상태: '사용',
    이름: '김합동',
    이메일인증: 'Y',
    지점ID: '12',
    지점명: '본점'
  },
  {
    기관ID: '7',
    권한값: '30',
    권한명: '사용자',
    기관명: '홍길동 법무사사무소',
    로그인아이디: 'test_inactive',
    사용자ID: '12',
    상태: '미사용',
    이름: '비활성화자',
    이메일인증: 'N',
    지점ID: '7',
    지점명: '본점'
  },
  {
    기관ID: '9',
    권한값: '70',
    권한명: '지점 관리자',
    기관명: '서울합동법무사사무소',
    로그인아이디: 'haps02',
    사용자ID: '21',
    상태: '사용',
    이름: '이합동',
    이메일인증: 'Y',
    지점ID: '12',
    지점명: '본점'
  },
  {
    기관ID: '6',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 세종',
    로그인아이디: 'sejong04',
    사용자ID: '18',
    상태: '사용',
    이름: '김변호사',
    이메일인증: 'Y',
    지점ID: '11',
    지점명: '본점'
  },
  {
    기관ID: '6',
    권한값: '30',
    권한명: '사용자',
    기관명: '법무법인 세종',
    로그인아이디: 'sejong05',
    사용자ID: '19',
    상태: '사용',
    이름: '박법무사',
    이메일인증: 'Y',
    지점ID: '11',
    지점명: '본점'
  },
  {
    기관ID: '9',
    권한값: '30',
    권한명: '사용자',
    기관명: '서울합동법무사사무소',
    로그인아이디: 'haps04',
    사용자ID: '23',
    상태: '사용',
    이름: '정법무사',
    이메일인증: 'Y',
    지점ID: '12',
    지점명: '본점'
  },
  {
    기관ID: '10',
    권한값: '30',
    권한명: '사용자',
    기관명: '정의 법률사무소',
    로그인아이디: 'justice05',
    사용자ID: '29',
    상태: '사용',
    이름: '김변호사',
    이메일인증: 'Y',
    지점ID: '13',
    지점명: '본점'
  },
  {
    기관ID: '9',
    권한값: '30',
    권한명: '사용자',
    기관명: '서울합동법무사사무소',
    로그인아이디: 'haps03',
    사용자ID: '22',
    상태: '사용',
    이름: '최법무사',
    이메일인증: 'Y',
    지점ID: '12',
    지점명: '본점'
  },
  {
    기관ID: '11',
    권한값: '80',
    권한명: '기관 관리자',
    기관명: '전문부동산 법무지원센터',
    로그인아이디: 'estate01',
    사용자ID: '30',
    상태: '사용',
    이름: '이부동산',
    이메일인증: 'Y',
    지점ID: '14',
    지점명: '본점'
  },
  {
    기관ID: '11',
    권한값: '70',
    권한명: '지점 관리자',
    기관명: '전문부동산 법무지원센터',
    로그인아이디: 'estate02',
    사용자ID: '31',
    상태: '사용',
    이름: '정부동산',
    이메일인증: 'Y',
    지점ID: '14',
    지점명: '본점'
  },
  {
    기관ID: '9',
    권한값: '30',
    권한명: '사용자',
    기관명: '서울합동법무사사무소',
    로그인아이디: 'haps05',
    사용자ID: '24',
    상태: '사용',
    이름: '장법무사',
    이메일인증: 'Y',
    지점ID: '12',
    지점명: '본점'
  },
  {
    기관ID: '10',
    권한값: '30',
    권한명: '사용자',
    기관명: '정의 법률사무소',
    로그인아이디: 'justice03',
    사용자ID: '27',
    상태: '사용',
    이름: '최변호사',
    이메일인증: 'Y',
    지점ID: '13',
    지점명: '본점'
  },
  {
    기관ID: '10',
    권한값: '80',
    권한명: '기관 관리자',
    기관명: '정의 법률사무소',
    로그인아이디: 'justice01',
    사용자ID: '25',
    상태: '사용',
    이름: '박정의',
    이메일인증: 'Y',
    지점ID: '13',
    지점명: '본점'
  },
  {
    기관ID: '10',
    권한값: '30',
    권한명: '사용자',
    기관명: '정의 법률사무소',
    로그인아이디: 'justice04',
    사용자ID: '28',
    상태: '사용',
    이름: '정변호사',
    이메일인증: 'Y',
    지점ID: '13',
    지점명: '본점'
  },
  {
    기관ID: '10',
    권한값: '70',
    권한명: '지점 관리자',
    기관명: '정의 법률사무소',
    로그인아이디: 'justice02',
    사용자ID: '26',
    상태: '사용',
    이름: '이정의',
    이메일인증: 'Y',
    지점ID: '13',
    지점명: '본점'
  },
  {
    기관ID: '11',
    권한값: '30',
    권한명: '사용자',
    기관명: '전문부동산 법무지원센터',
    로그인아이디: 'estate05',
    사용자ID: '34',
    상태: '사용',
    이름: '김부동산',
    이메일인증: 'Y',
    지점ID: '14',
    지점명: '본점'
  },
  {
    기관ID: '13',
    권한값: '80',
    권한명: '기관 관리자',
    기관명: '테스트법무법인',
    로그인아이디: 'user123',
    사용자ID: '14',
    상태: '승인대기',
    이름: '홍길동',
    이메일인증: 'N',
    지점ID: '10',
    지점명: '강남지점'
  },
  {
    기관ID: '11',
    권한값: '30',
    권한명: '사용자',
    기관명: '전문부동산 법무지원센터',
    로그인아이디: 'estate03',
    사용자ID: '32',
    상태: '사용',
    이름: '한부동산',
    이메일인증: 'Y',
    지점ID: '14',
    지점명: '본점'
  },
  {
    기관ID: '11',
    권한값: '30',
    권한명: '사용자',
    기관명: '전문부동산 법무지원센터',
    로그인아이디: 'estate04',
    사용자ID: '33',
    상태: '사용',
    이름: '강부동산',
    이메일인증: 'Y',
    지점ID: '14',
    지점명: '본점'
  }
]

// ============================================================================
// 로그인 사용자 목록을 기관별로 그룹화
// ============================================================================
const groupedLoginUsers = computed(() => {
  const groups = new Map<string, Array<(typeof LOGIN_USERS)[number]>>()

  LOGIN_USERS.forEach((user) => {
    const key = user.기관명
    const existingGroup = groups.get(key)

    if (existingGroup) {
      existingGroup.push(user)
    } else {
      groups.set(key, [user])
    }
  })

  // 시스템관리 기관을 최우선으로, 나머지는 기관명으로 정렬
  return Array.from(groups.entries())
    .sort((a, b) => {
      const isSystemA = a[0] === '시스템관리 기관'
      const isSystemB = b[0] === '시스템관리 기관'

      if (isSystemA) return -1
      if (isSystemB) return 1

      return a[0].localeCompare(b[0])
    })
    .map(([기관명, users]) => ({
      기관명,
      users: users.sort((a, b) => a.로그인아이디.localeCompare(b.로그인아이디))
    }))
})

// ============================================================================
// Auth Monitor - Storage 실시간 갱신
// ============================================================================
const refreshStorageData = () => {
  storageData.value = storage.get()
  updateCount.value++
}

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
    refreshStorageData()
  }
}

const startStoragePolling = () => {
  if (storagePollingInterval) return
  storagePollingInterval = setInterval(() => {
    refreshStorageData()
  }, 2000)
}

const stopStoragePolling = () => {
  if (storagePollingInterval) {
    clearInterval(storagePollingInterval)
    storagePollingInterval = null
  }
}

// ============================================================================
// ⚠️ 여기서부터 라인 ~680까지의 기존 함수들 모두 삭제
// (refreshToken, handleLogin, handleLogout, executeLogin 삭제)
// ============================================================================

// authStore 변경 감지
watch(
  () => [
    authStore.loginId,
    authStore.selectedBankCode,
    authStore.accessExpires,
    authStore.roleLevel
  ],
  () => {
    refreshStorageData()
  },
  { deep: true }
)

// ✅ 로그인 상태 변경 감지 - 로그인하면 은행 목록 자동 가져오기
watch(
  () => authStore.isLoggedIn,
  async (isLoggedIn) => {
    if (isLoggedIn) {
      console.log('User logged in, fetching assigned banks...')
      await fetchAssignedBanks()
      console.log('Assigned banks loaded:', assignedBanks.value)
    } else {
      // 로그아웃 시 초기화
      assignedBanks.value = []
      selectedBankCode.value = 'bankclear'
    }
  }
)

// 드롭다운 선택 시 아이디 자동 입력
watch(selectedLoginUser, (user) => {
  if (user) {
    loginId.value = user.로그인아이디
  }
})

// ============================================================================
// BASE URL 관리
// ============================================================================
const baseUrlMode = ref<'production' | 'local'>('production')
const BASE_URLS = {
  production: '', // 기존 BASE URL (빈 문자열은 현재 도메인 사용)
  local: 'http://localhost:8100'
}

// localStorage에서 저장된 설정 불러오기
const savedBaseUrlMode = localStorage.getItem('api-tester-base-url-mode') as
  | 'production'
  | 'local'
  | null
if (savedBaseUrlMode) {
  baseUrlMode.value = savedBaseUrlMode
}

// 현재 BASE URL 계산
const currentBaseUrl = computed(() => BASE_URLS[baseUrlMode.value])

// api 클라이언트를 동적으로 생성하는 computed
const apiClient = computed(() => {
  if (currentBaseUrl.value) {
    return axios.create({
      baseURL: currentBaseUrl.value,
      headers: api.defaults.headers
    })
  }
  return api
})

// ============================================================================
// BASE URL을 고려한 authAPI 래퍼
// ============================================================================
const authAPIWithBaseUrl = computed(() => {
  const client = apiClient.value

  return {
    async login(data: { loginId: string; password: string }) {
      const response = await client.post('/api/auth/login', data)
      return response
    },

    async refresh(data: { refreshToken: string }) {
      const response = await client.post('/api/auth/refresh', data)
      return response
    },

    async logout() {
      const response = await client.post('/api/auth/logout')
      return response
    }
  }
})

// ============================================================================
// Auth 관련 함수들 (useAuth 패턴 참고)
// ============================================================================

// ✅ 할당된 은행 목록 가져오기
const fetchAssignedBanks = async () => {
  try {
    const client = apiClient.value
    // ✅ X-Bank-Code 헤더 추가
    const response = await client.get('/api/users/assigned-banks', {
      headers: {
        'X-Bank-Code': selectedBankCode.value
      }
    })

    console.log('===== Assigned Banks Response =====')
    console.log('Response:', response)
    console.log('Response data:', response.data)
    console.log('==================================')

    const banks = response.data?.data || []
    assignedBanks.value = banks

    console.log('Assigned banks count:', banks.length)
    console.log('Banks:', banks)

    // 기본값 설정: bankclear가 있으면 선택, 없으면 첫 번째 은행 선택
    if (banks.length > 0) {
      const bankclearBank = banks.find((bank: AssignedBank) => bank.bankCode === 'bankclear')
      selectedBankCode.value = bankclearBank ? 'bankclear' : banks[0].bankCode

      console.log('Selected bank code:', selectedBankCode.value)

      // ✅ authStore에 저장 (내부에서 storage 처리)
      authStore.setBankCode(selectedBankCode.value)
      refreshStorageData()
    }

    return banks
  } catch (err: any) {
    console.error('[Fetch Assigned Banks] Failed:', err)
    console.error('Error response:', err.response)
    // 에러가 나도 기본값 유지
    selectedBankCode.value = 'bankclear'
    authStore.setBankCode('bankclear')
    refreshStorageData()
    return []
  }
}

// ✅ 은행 선택 변경 핸들러
const handleBankCodeChange = () => {
  console.log('Bank code changed to:', selectedBankCode.value)

  // ✅ authStore에 저장 (내부에서 storage 처리)
  authStore.setBankCode(selectedBankCode.value)
  refreshStorageData()
}

const refreshToken = async () => {
  try {
    const currentStorage = storage.get()
    console.log('===== Refresh Token =====')
    console.log('Current storage:', currentStorage)

    const { refreshToken } = currentStorage
    if (!refreshToken) {
      alert('Refresh Token이 없습니다.')
      return
    }

    // mutationFn: API 호출
    const response = await authAPIWithBaseUrl.value.refresh({ refreshToken })

    console.log('Refresh response:', response)
    console.log('response.data:', response.data)
    console.log('response.data.data:', response.data?.data)

    // onSuccess: 성공 처리
    const newTokens = response.data.data || response.data

    console.log('New tokens:', newTokens)

    storage.updateTokens(newTokens)
    authStore.updateTokens(newTokens)
    refreshStorageData()

    console.log('After refresh, storage:', storage.get())
    console.log('========================')

    alert('토큰이 갱신되었습니다!')
  } catch (err: any) {
    // onError: 에러 처리
    console.error('[Token Refresh] Failed:', err)
    console.error('Error response:', err.response)
    alert(`토큰 갱신 실패: ${err.response?.data?.message || err.message}`)
  }
}

const handleLogin = () => {
  // 로그인 모달 열기 전 초기화
  loginId.value = ''
  password.value = 'P@ssw0rd1!'
  selectedLoginUser.value = null
  showLoginModal.value = true
}

const handleLogout = async () => {
  if (!confirm('로그아웃 하시겠습니까?')) {
    return
  }

  console.log('===== Logout Started =====')
  console.log('Before logout, storage:', storage.get())
  console.log('Before logout, authStore.isLoggedIn:', authStore.isLoggedIn)

  try {
    // mutationFn: API 호출
    await authAPIWithBaseUrl.value.logout()
    console.log('Logout API call successful')
  } catch (err: any) {
    // onError: 에러 로그
    console.error('[Logout] API call failed:', err)
  } finally {
    // onSettled: 성공/실패 무관하게 실행
    console.log('Calling authStore.clearAuth()')
    authStore.clearAuth()

    // ✅ 은행 목록 초기화
    assignedBanks.value = []
    selectedBankCode.value = 'bankclear'

    console.log('Calling refreshStorageData()')
    refreshStorageData()

    console.log('After logout, storage:', storage.get())
    console.log('After logout, authStore.isLoggedIn:', authStore.isLoggedIn)
    console.log('========================')
  }
}

const executeLogin = async () => {
  if (!loginId.value.trim()) {
    alert('로그인 아이디를 입력해주세요.')
    return
  }

  if (!password.value.trim()) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  try {
    // mutationFn: API 호출
    const response = await authAPIWithBaseUrl.value.login({
      loginId: loginId.value,
      password: password.value
    })

    // ✅ 디버깅: 응답 구조 확인
    console.log('===== Login Response =====')
    console.log('Full response:', response)
    console.log('response.data:', response.data)
    console.log('response.data.data:', response.data?.data)
    console.log('========================')

    // onSuccess: 로그인 성공 처리
    // authAPI.login의 응답 구조에 맞춰 수정
    // ApiResponse<LoginData> 구조: { data: LoginData }
    const loginData = response.data.data || response.data

    console.log('Setting auth with:', loginData)

    // 1. 스토어에 인증 정보 저장
    authStore.setAuth(loginData)

    // 2. UI 초기화
    refreshStorageData()

    // ✅ 은행 목록은 watch에서 자동으로 가져옴

    // ✅ 디버깅: 저장 후 스토리지 확인
    console.log('After setAuth, storage:', storage.get())
    console.log('After setAuth, authStore.isLoggedIn:', authStore.isLoggedIn)

    showLoginModal.value = false
    selectedLoginUser.value = null
    loginId.value = ''
    password.value = 'P@ssw0rd1!'

    alert('로그인 성공!')
  } catch (err: any) {
    // onError: 로그인 실패 처리
    console.error('[Login] Failed:', err)
    console.error('Error response:', err.response)
    alert(`로그인 실패: ${err.response?.data?.message || err.message}`)
  }
}

// BASE URL 변경 핸들러
const handleBaseUrlChange = async (newMode: 'production' | 'local') => {
  // 이미 같은 모드면 무시
  if (baseUrlMode.value === newMode) return

  // 로그인 상태인 경우 로그아웃 확인
  if (authStore.isLoggedIn) {
    const confirmed = confirm(
      'BASE URL을 변경하면 재로그인이 필요합니다.\n현재 세션에서 로그아웃 하시겠습니까?'
    )

    if (!confirmed) {
      return
    }

    try {
      // mutationFn: 변경 전 BASE URL로 로그아웃 요청
      await authAPIWithBaseUrl.value.logout()
    } catch (err: any) {
      // onError: 에러 로그
      console.error('[Logout before BASE URL change] API call failed:', err)
    } finally {
      // onSettled: 성공/실패 무관하게 store 정리
      authStore.clearAuth()

      // ✅ 은행 목록 초기화
      assignedBanks.value = []
      selectedBankCode.value = 'bankclear'

      refreshStorageData()
    }
  }

  // BASE URL 변경 및 저장
  baseUrlMode.value = newMode
  localStorage.setItem('api-tester-base-url-mode', newMode)
}

// ============================================================================
// 파일 업로드
// ============================================================================
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  if (!file.name.endsWith('.json')) {
    specLoadError.value = 'JSON 파일만 업로드 가능합니다.'
    return
  }

  isLoadingSpec.value = true
  specLoadError.value = null

  try {
    const text = await file.text()
    const spec = JSON.parse(text)
    categories.value = parseOpenApiSpec(spec)
    uploadedFileName.value = file.name
    showUploadModal.value = false

    // 첫 번째 카테고리 자동 펼치기
    if (categories.value.length > 0 && categories.value[0]) {
      expandedCategories.value.clear()
      expandedCategories.value.add(categories.value[0].name)
    }
  } catch (err: any) {
    specLoadError.value = `파일 파싱 실패: ${err.message}`
  } finally {
    isLoadingSpec.value = false
    // input 초기화
    input.value = ''
  }
}

const resetToDefault = async () => {
  uploadedFileName.value = null
  await loadOpenApiSpec()
}

// ============================================================================
// OpenAPI JSON 로딩
// ============================================================================
const loadOpenApiSpec = async () => {
  isLoadingSpec.value = true
  specLoadError.value = null

  try {
    // Props로 직접 전달된 경우 (또는 기본값)
    if (props.openApiSpec) {
      categories.value = parseOpenApiSpec(props.openApiSpec)
      return
    }

    // URL로 전달된 경우
    if (props.apiSpecUrl) {
      const response = await fetch(props.apiSpecUrl)
      if (!response.ok) throw new Error('Failed to load OpenAPI spec')
      const spec = await response.json()
      categories.value = parseOpenApiSpec(spec)
      return
    }
  } catch (err: any) {
    specLoadError.value = err.message || 'OpenAPI 스펙을 로드하는데 실패했습니다.'
  } finally {
    isLoadingSpec.value = false
  }
}

// ============================================================================
// OpenAPI JSON 파싱
// ============================================================================
// $ref를 실제 스키마로 해석하는 헬퍼 함수
const resolveRef = (ref: string, spec: any): any => {
  if (!ref || !ref.startsWith('#/')) return null

  // "#/components/schemas/SomeName" -> ["components", "schemas", "SomeName"]
  const parts = ref.replace('#/', '').split('/')

  let result = spec
  for (const part of parts) {
    if (result && typeof result === 'object') {
      result = result[part]
    } else {
      return null
    }
  }

  return result
}

const parseOpenApiSpec = (spec: any) => {
  // ✅ OpenAPI 스펙 저장 ($ref 해석을 위해)
  openApiSpec.value = spec

  const groups = new Map<string, CategoryGroup>()

  if (!spec.paths) return []

  Object.entries(spec.paths).forEach(([path, pathItem]: [string, any]) => {
    Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
      if (typeof operation !== 'object') return

      const summary = operation.summary || ''
      const tags = operation.tags || []

      // [R01-01][GET] 형식에서 코드 추출
      const codeMatch = summary.match(/\[([^\]]+)\]/)
      const code = codeMatch ? codeMatch[1] : ''
      const categoryCode = code.split('-')[0] || ''

      // 파라미터 정보 추출
      const parameters: Parameter[] = (operation.parameters || []).map((param: any) => ({
        name: param.name,
        in: param.in,
        description: param.description,
        required: param.required || false,
        schema: param.schema || {},
        example: param.example || param.schema?.example
      }))

      // Request Body 정보 추출 (✅ $ref 해석 추가)
      let requestBodySchema: any = null
      let requestBodyExample: any = null
      if (operation.requestBody?.content?.['application/json']) {
        const content = operation.requestBody.content['application/json']
        let schema = content.schema

        // ✅ $ref가 있으면 해석
        if (schema?.$ref) {
          schema = resolveRef(schema.$ref, spec)
        }

        requestBodySchema = schema
        requestBodyExample = content.example || schema?.example
      }

      const endpoint: EndpointInfo = {
        id: `${method.toUpperCase()}_${path}`,
        path,
        method: method.toUpperCase(),
        summary,
        description: operation.description,
        tags,
        parameters,
        requestBodySchema,
        requestBodyExample,
        code,
        categoryCode
      }

      // 카테고리별로 그룹화
      const categoryName = tags[0] || categoryCode || 'Other'
      const existingCategory = groups.get(categoryName)

      if (existingCategory) {
        existingCategory.endpoints.push(endpoint)
      } else {
        groups.set(categoryName, {
          name: categoryName,
          code: categoryCode,
          endpoints: [endpoint]
        })
      }
    })
  })

  return Array.from(groups.values()).sort((a, b) => a.code.localeCompare(b.code))
}

// ============================================================================
// 테마 관리
// ============================================================================
const theme = ref<'dark' | 'light'>('light')

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('api-tester-theme', theme.value)
}

// ============================================================================
// 컴퓨티드
// ============================================================================
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories.value

  const query = searchQuery.value.toLowerCase()
  return categories.value
    .map((cat) => ({
      ...cat,
      endpoints: cat.endpoints.filter(
        (ep) =>
          ep.path.toLowerCase().includes(query) ||
          ep.summary.toLowerCase().includes(query) ||
          ep.code.toLowerCase().includes(query) ||
          cat.name.toLowerCase().includes(query)
      )
    }))
    .filter((cat) => cat.endpoints.length > 0)
})

const totalEndpointsCount = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.endpoints.length, 0)
})

const pathParameters = computed(() => {
  return selectedEndpoint.value?.parameters.filter((p) => p.in === 'path') || []
})

const queryParameters = computed(() => {
  return selectedEndpoint.value?.parameters.filter((p) => p.in === 'query') || []
})

const hasRequestBody = computed(() => {
  return selectedEndpoint.value?.requestBodySchema != null
})

// Request Body 필드 정보 추출
const requestBodyFields = computed(() => {
  const schema = selectedEndpoint.value?.requestBodySchema
  if (!schema || !schema.properties) return []

  const required = schema.required || []

  return Object.entries(schema.properties).map(([key, propSchema]: [string, any]) => {
    let typeDisplay = propSchema.type || 'string'

    // array 타입이면 items 정보도 표시
    if (propSchema.type === 'array' && propSchema.items) {
      if (propSchema.items.$ref) {
        // $ref에서 타입명 추출 (예: PartyItem)
        const refName = propSchema.items.$ref.split('/').pop()
        typeDisplay = `array<${refName}>`
      } else if (propSchema.items.type) {
        typeDisplay = `array<${propSchema.items.type}>`
      } else {
        typeDisplay = 'array'
      }
    }

    return {
      name: key,
      type: typeDisplay,
      description: propSchema.description || '',
      required: required.includes(key),
      example: propSchema.example
    }
  })
})

// buildUrl 함수 추가 - UI 표시용 (BASE URL 포함)
const buildUrl = computed((): string => {
  if (!selectedEndpoint.value) return ''

  let url = selectedEndpoint.value.path

  // Path 파라미터 치환
  pathParameters.value.forEach((param) => {
    const value = pathParams.value[param.name]
    url = url.replace(`{${param.name}}`, value || `:${param.name}`)
  })

  // BASE URL이 있으면 앞에 추가 (UI 표시용)
  if (currentBaseUrl.value) {
    url = currentBaseUrl.value + url
  }

  return url
})

// ============================================================================
// 메서드
// ============================================================================
const toggleCategory = (category: string) => {
  if (expandedCategories.value.has(category)) {
    expandedCategories.value.delete(category)
  } else {
    expandedCategories.value.add(category)
  }
}

const selectEndpoint = (endpoint: EndpointInfo) => {
  selectedEndpoint.value = endpoint
  response.value = null
  error.value = null
  statusCode.value = null

  // Path 파라미터 초기화
  pathParams.value = {}
  pathParameters.value.forEach((param) => {
    pathParams.value[param.name] = param.example || getDefaultValue(param.schema)
  })

  // Query 파라미터 초기화
  queryParams.value = {}
  queryParameters.value.forEach((param) => {
    if (param.required) {
      queryParams.value[param.name] = param.example || getDefaultValue(param.schema)
    }
  })

  // Request Body 초기화
  if (endpoint.requestBodyExample) {
    requestBody.value = JSON.stringify(endpoint.requestBodyExample, null, 2)
  } else if (endpoint.requestBodySchema) {
    requestBody.value = generateExampleFromSchema(endpoint.requestBodySchema)
  } else {
    requestBody.value = '{\n  \n}'
  }
}

// 스키마에서 기본값 생성 (재귀적으로 처리)
const getDefaultValue = (schema: any): any => {
  if (schema.example !== undefined) return schema.example
  if (schema.default !== undefined) return schema.default

  switch (schema.type) {
    case 'string':
      if (schema.format === 'date') return '2024-01-01'
      if (schema.format === 'date-time') return '2024-01-01T00:00:00Z'
      if (schema.format === 'email') return 'example@example.com'
      // enum이 있으면 첫 번째 값 사용
      if (schema.enum && schema.enum.length > 0) return schema.enum[0]
      return 'string'
    case 'integer':
    case 'number':
      return schema.minimum !== undefined ? schema.minimum : 0
    case 'boolean':
      return false
    case 'array':
      // ✅ array의 items 처리
      if (schema.items) {
        let itemSchema = schema.items

        // items에 $ref가 있으면 해석
        if (itemSchema.$ref && openApiSpec.value) {
          itemSchema = resolveRef(itemSchema.$ref, openApiSpec.value)
        }

        // itemSchema로 예시 객체 생성
        if (itemSchema) {
          const exampleItem = generateExampleFromSchemaRecursive(itemSchema)
          return [exampleItem]
        }
      }
      return []
    case 'object':
      // ✅ 중첩 객체 처리
      if (schema.properties) {
        return generateExampleFromSchemaRecursive(schema)
      }
      return {}
    default:
      return ''
  }
}

// 재귀적으로 스키마에서 예시 객체 생성
const generateExampleFromSchemaRecursive = (schema: any): any => {
  if (schema.example !== undefined) return schema.example

  if (schema.type === 'object' && schema.properties) {
    const obj: any = {}
    Object.entries(schema.properties).forEach(([key, propSchema]: [string, any]) => {
      // $ref 해석
      let resolvedSchema = propSchema
      if (propSchema.$ref && openApiSpec.value) {
        resolvedSchema = resolveRef(propSchema.$ref, openApiSpec.value)
      }

      obj[key] = getDefaultValue(resolvedSchema)
    })
    return obj
  }

  return getDefaultValue(schema)
}

// 스키마에서 예시 JSON 생성
const generateExampleFromSchema = (schema: any): string => {
  if (schema.example) {
    return JSON.stringify(schema.example, null, 2)
  }

  if (schema.type === 'object' && schema.properties) {
    const obj = generateExampleFromSchemaRecursive(schema)
    return JSON.stringify(obj, null, 2)
  }

  return '{\n  \n}'
}

const executeRequest = async () => {
  if (!selectedEndpoint.value) return

  isLoading.value = true
  error.value = null
  response.value = null
  statusCode.value = null

  const startTime = Date.now()

  try {
    // Path 파라미터가 치환된 URL (BASE URL 제외 - apiClient에서 처리)
    let url = selectedEndpoint.value.path
    pathParameters.value.forEach((param) => {
      const value = pathParams.value[param.name]
      url = url.replace(`{${param.name}}`, value || `:${param.name}`)
    })

    const method = selectedEndpoint.value.method.toLowerCase()

    // Query params (값이 있는 것만)
    const params = Object.fromEntries(
      Object.entries(queryParams.value).filter(
        ([_, v]) => v !== '' && v !== null && v !== undefined
      )
    )

    // ✅ 요청 config에 X-Bank-Code 헤더 추가
    const config = {
      params,
      headers: {
        'X-Bank-Code': selectedBankCode.value
      }
    }

    let result: any
    const client = apiClient.value // 동적 클라이언트 사용

    if (method === 'get') {
      result = await client.get(url, config)
    } else if (method === 'post') {
      const data = requestBody.value.trim() ? JSON.parse(requestBody.value) : undefined
      result = await client.post(url, data, config)
    } else if (method === 'put') {
      const data = requestBody.value.trim() ? JSON.parse(requestBody.value) : undefined
      result = await client.put(url, data, config)
    } else if (method === 'patch') {
      const data = requestBody.value.trim() ? JSON.parse(requestBody.value) : undefined
      result = await client.patch(url, data, config)
    } else if (method === 'delete') {
      result = await client.delete(url, config)
    }

    requestTime.value = Date.now() - startTime
    statusCode.value = result?.status || 200
    response.value = result?.data || result
  } catch (err: any) {
    requestTime.value = Date.now() - startTime
    statusCode.value = err.response?.status || 500
    error.value = err.response?.data?.message || err.message || '요청 실패'
    response.value = err.response?.data
  } finally {
    isLoading.value = false
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  showToastMessage('복사되었습니다! 📋')
}

const showToastMessage = (message: string) => {
  toastMessage.value = message
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const formatJson = () => {
  try {
    const parsed = JSON.parse(requestBody.value)
    requestBody.value = JSON.stringify(parsed, null, 2)
  } catch {
    // Invalid JSON
  }
}

// ============================================================================
// 라이프사이클
// ============================================================================
onMounted(async () => {
  // 저장된 테마 불러오기
  const savedTheme = localStorage.getItem('api-tester-theme') as 'dark' | 'light' | null
  if (savedTheme) {
    theme.value = savedTheme
  }

  await loadOpenApiSpec()
  if (categories.value.length > 0 && categories.value[0]) {
    expandedCategories.value.add(categories.value[0].name)
  }

  // 초기 데이터 로드
  refreshStorageData()

  // ✅ storage에서 현재 bank_code 읽어오기
  const currentBankCode = storage.get().bankCode
  if (currentBankCode) {
    selectedBankCode.value = currentBankCode
  }

  // ✅ 이미 로그인된 상태라면 은행 목록 가져오기
  if (authStore.isLoggedIn) {
    console.log('Already logged in, fetching assigned banks...')
    await fetchAssignedBanks()
  }

  // Storage 이벤트 리스너 등록
  window.addEventListener('storage', handleStorageChange)

  // 실시간 폴링 시작
  startStoragePolling()
})

onBeforeUnmount(() => {
  // Storage 이벤트 리스너 제거
  window.removeEventListener('storage', handleStorageChange)

  // 폴링 정지
  stopStoragePolling()
})

// Props 변경 감지
watch(
  () => [props.openApiSpec, props.apiSpecUrl],
  async () => {
    await loadOpenApiSpec()
  },
  { deep: true }
)
</script>

<template>
  <div class="api-tester" :class="theme">
    <!-- 토스트 메시지 -->
    <transition name="toast">
      <div v-if="showToast" class="toast">
        {{ toastMessage }}
      </div>
    </transition>

    <!-- 헤더 -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="title">
            <span class="icon">⚡</span>
            전자등기 API Tester
          </h1>
          <div class="stats">
            <span class="stat">{{ categories.length }} 카테고리</span>
            <span class="stat-divider">•</span>
            <span class="stat">{{ totalEndpointsCount }} 엔드포인트</span>
          </div>
        </div>

        <!-- ✅ 로그인 상태일 때만 auth-info 표시 -->
        <div v-if="authStore.isLoggedIn" class="header-center">
          <div class="auth-info">
            <div class="auth-info-item">
              <span class="auth-info-label">Login</span>
              <span class="auth-info-value">{{ storageData.loginId || '-' }}</span>
            </div>
            <div class="auth-info-item">
              <span class="auth-info-label">User</span>
              <span class="auth-info-value">{{ storageData.userId || '-' }}</span>
            </div>
            <div class="auth-info-item">
              <span class="auth-info-label">Role</span>
              <span class="auth-info-value">{{ storageData.roleLevel || '-' }}</span>
            </div>

            <!-- ✅ 은행 선택 select -->
            <div class="auth-info-item bank-select-item">
              <span class="auth-info-label">Bank</span>
              <div style="display: flex; align-items: center; gap: 0.25rem">
                <select
                  v-model="selectedBankCode"
                  @change="handleBankCodeChange"
                  class="bank-select"
                >
                  <option v-if="assignedBanks.length === 0" value="bankclear">bankclear</option>
                  <option v-for="bank in assignedBanks" :key="bank.bankCode" :value="bank.bankCode">
                    {{ bank.bankName }}
                  </option>
                </select>
                <span class="bank-debug"> ({{ assignedBanks.length }}) </span>
              </div>
            </div>

            <div class="auth-info-item">
              <span class="auth-info-label">Token</span>
              <span
                class="auth-info-value"
                :class="{
                  expiring: authStore.isExpiringSoon,
                  expired: authStore.isExpired
                }"
              >
                {{ authStore.formattedTime }}
              </span>
            </div>
          </div>
        </div>

        <div class="header-right">
          <!-- 현재 BASE URL 표시 -->
          <div class="current-base-url" :title="currentBaseUrl || '현재 도메인 사용'">
            <span class="base-url-label">BASE:</span>
            <span class="base-url-value">{{ currentBaseUrl || '(current)' }}</span>
          </div>

          <!-- BASE URL 전환 버튼 - handleBaseUrlChange 사용 -->
          <div class="base-url-toggle">
            <button
              class="base-url-btn"
              :class="{ active: baseUrlMode === 'production' }"
              @click="handleBaseUrlChange('production')"
              title="개발 환경"
            >
              🌐 DEV
            </button>
            <button
              class="base-url-btn"
              :class="{ active: baseUrlMode === 'local' }"
              @click="handleBaseUrlChange('local')"
              title="로컬 환경 (localhost:8100)"
            >
              💻 LOCAL
            </button>
          </div>

          <!-- 나머지 버튼들... -->
          <button
            class="theme-toggle-btn"
            @click="toggleTheme"
            :title="`${theme === 'dark' ? '라이트' : '다크'} 모드로 전환`"
          >
            {{ theme === 'dark' ? '☀️' : '🌙' }}
          </button>

          <button
            v-if="authStore.isLoggedIn"
            class="token-refresh-btn"
            @click="refreshToken"
            title="토큰 갱신"
          >
            🔄 연장
          </button>
          <button
            v-if="authStore.isLoggedIn"
            class="logout-btn"
            @click="handleLogout"
            title="로그아웃"
          >
            🚪 로그아웃
          </button>
          <button v-else class="login-btn" @click="handleLogin" title="로그인">🔑 로그인</button>

          <div v-if="uploadedFileName" class="uploaded-info">
            <span class="uploaded-label">📄 {{ uploadedFileName }}</span>
            <button class="reset-btn" @click="resetToDefault" title="기본 JSON으로 되돌리기">
              ↻
            </button>
          </div>
          <button class="upload-btn" @click="showUploadModal = true">📤 JSON 업로드</button>
        </div>
      </div>

      <!-- 파일 업로드 모달 추가 -->
      <div v-if="showUploadModal" class="modal-backdrop" @click="showUploadModal = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h2>OpenAPI JSON 업로드</h2>
            <button class="modal-close" @click="showUploadModal = false">✕</button>
          </div>
          <div class="modal-body">
            <p class="modal-description">OpenAPI JSON 파일을 업로드하면 현재 스펙을 대체합니다.</p>
            <label class="file-input-label">
              <input type="file" accept=".json" class="file-input" @change="handleFileUpload" />
              <span class="file-input-text">
                <span class="file-input-icon">📁</span>
                파일 선택 (.json)
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- 로그인 모달 -->
      <div v-if="showLoginModal" class="modal-backdrop" @click="showLoginModal = false">
        <div class="login-modal" @click.stop>
          <div class="modal-header">
            <h2>🔑 로그인</h2>
            <button class="modal-close" @click="showLoginModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="login-form">
              <div class="form-group">
                <label class="form-label">사용자 선택 (선택사항)</label>
                <select v-model="selectedLoginUser" class="login-select">
                  <option :value="null">직접 입력 또는 목록에서 선택</option>
                  <optgroup
                    v-for="group in groupedLoginUsers"
                    :key="group.기관명"
                    :label="group.기관명"
                  >
                    <option v-for="user in group.users" :key="user.로그인아이디" :value="user">
                      {{ user.로그인아이디 }} | {{ user.이름 }} | {{ user.권한명 }} |
                      {{ user.지점명 }} | 상태: {{ user.상태 }}
                    </option>
                  </optgroup>
                </select>
              </div>

              <div v-if="selectedLoginUser" class="user-detail">
                <div class="detail-row">
                  <span class="detail-label">기관ID:</span>
                  <span class="detail-value">{{ selectedLoginUser.기관ID }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">사용자ID:</span>
                  <span class="detail-value">{{ selectedLoginUser.사용자ID }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">권한값:</span>
                  <span class="detail-value">{{ selectedLoginUser.권한값 }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">권한명:</span>
                  <span class="detail-value">{{ selectedLoginUser.권한명 }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">기관명:</span>
                  <span class="detail-value">{{ selectedLoginUser.기관명 }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">지점ID:</span>
                  <span class="detail-value">{{ selectedLoginUser.지점ID }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">지점명:</span>
                  <span class="detail-value">{{ selectedLoginUser.지점명 }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">이메일인증:</span>
                  <span class="detail-value">{{ selectedLoginUser.이메일인증 }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">상태:</span>
                  <span class="detail-value" :class="{ active: selectedLoginUser.상태 === '사용' }">
                    {{ selectedLoginUser.상태 }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">로그인 아이디 *</label>
                <input
                  v-model="loginId"
                  type="text"
                  class="login-input editable"
                  placeholder="아이디를 입력하거나 위에서 선택하세요"
                />
              </div>

              <div class="form-group">
                <label class="form-label">비밀번호 *</label>
                <input
                  v-model="password"
                  type="text"
                  class="login-input editable"
                  placeholder="비밀번호 입력"
                />
              </div>

              <button
                class="login-submit-btn"
                :disabled="!loginId || !password"
                @click="executeLogin"
              >
                🔐 로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="content">
      <!-- 로딩 상태 -->
      <div v-if="isLoadingSpec" class="loading-state">
        <div class="loading-spinner">⏳</div>
        <p>OpenAPI 스펙을 로드하는 중...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="specLoadError" class="error-state">
        <div class="error-icon">❌</div>
        <h2>로드 실패</h2>
        <p>{{ specLoadError }}</p>
      </div>

      <!-- 정상 상태 -->
      <template v-else>
        <!-- 사이드바 -->
        <aside class="sidebar">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="🔍 API 검색..."
              class="search-input"
            />
          </div>

          <div class="endpoint-list">
            <div v-for="category in filteredCategories" :key="category.name" class="category">
              <button class="category-header" @click="toggleCategory(category.name)">
                <span class="category-icon">
                  {{ expandedCategories.has(category.name) ? '▼' : '▶' }}
                </span>
                <div class="category-info">
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-code">{{ category.code }}</span>
                </div>
                <span class="category-count">{{ category.endpoints.length }}</span>
              </button>

              <div v-if="expandedCategories.has(category.name)" class="endpoints">
                <button
                  v-for="endpoint in category.endpoints"
                  :key="endpoint.id"
                  class="endpoint"
                  :class="{
                    active: selectedEndpoint?.id === endpoint.id,
                    [endpoint.method.toLowerCase()]: true
                  }"
                  @click="selectEndpoint(endpoint)"
                >
                  <span class="endpoint-method">{{ endpoint.method }}</span>
                  <div class="endpoint-info">
                    <span class="endpoint-summary">{{
                      endpoint.summary.replace(/\[.*?\]\[.*?\]\s*/, '')
                    }}</span>
                    <span class="endpoint-code">{{ endpoint.code }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- 메인 콘텐츠 -->
        <main class="main">
          <div v-if="!selectedEndpoint" class="empty">
            <div class="empty-icon">🎯</div>
            <h2>엔드포인트를 선택하세요</h2>
            <p>좌측 목록에서 테스트할 API를 선택하세요</p>
          </div>

          <div v-else class="detail">
            <!-- 헤더 -->
            <div class="detail-header">
              <div class="detail-title-row">
                <span class="method-badge" :class="selectedEndpoint.method.toLowerCase()">
                  {{ selectedEndpoint.method }}
                </span>
                <code class="detail-path">{{ buildUrl }}</code>
                <button class="icon-btn" @click="copyToClipboard(buildUrl)" title="URL 복사">
                  📋
                </button>
              </div>
              <div class="detail-meta">
                <span class="detail-code">[{{ selectedEndpoint.code }}]</span>
                <span class="detail-summary">{{
                  selectedEndpoint.summary.replace(/\[.*?\]\[.*?\]\s*/, '')
                }}</span>
              </div>
              <p v-if="selectedEndpoint.description" class="detail-description">
                {{ selectedEndpoint.description }}
              </p>
            </div>

            <!-- 파라미터 섹션 -->
            <div class="params">
              <!-- Path Parameters -->
              <div v-if="pathParameters.length > 0" class="param-section">
                <h3 class="param-title">
                  <span class="param-title-icon">📍</span>
                  Path Parameters
                  <span class="param-hint">※ 모든 필드 필수</span>
                </h3>
                <div class="param-grid">
                  <div v-for="param in pathParameters" :key="param.name" class="param-row">
                    <label class="param-label">
                      <span class="param-name">{{ param.name }}</span>
                      <span v-if="param.required" class="required">*</span>
                      <span v-if="param.description" class="param-desc">{{
                        param.description
                      }}</span>
                    </label>
                    <input
                      v-model="pathParams[param.name]"
                      type="text"
                      :placeholder="param.example || `Enter ${param.name}`"
                      class="param-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Query Parameters -->
              <div v-if="queryParameters.length > 0" class="param-section">
                <h3 class="param-title">
                  <span class="param-title-icon">🔗</span>
                  Query Parameters
                </h3>
                <div class="param-grid">
                  <div v-for="param in queryParameters" :key="param.name" class="param-row">
                    <label class="param-label">
                      <span class="param-name">{{ param.name }}</span>
                      <span v-if="param.required" class="required">*</span>
                      <span v-if="param.description" class="param-desc">{{
                        param.description
                      }}</span>
                    </label>
                    <input
                      v-model="queryParams[param.name]"
                      :type="
                        param.schema.type === 'integer' || param.schema.type === 'number'
                          ? 'number'
                          : 'text'
                      "
                      :placeholder="param.example || `Enter ${param.name}`"
                      :required="param.required"
                      class="param-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Request Body -->
              <div v-if="hasRequestBody" class="param-section">
                <div class="param-header">
                  <h3 class="param-title">
                    <span class="param-title-icon">📦</span>
                    Request Body (JSON)
                  </h3>
                  <button class="format-btn" @click="formatJson">{ } Format</button>
                </div>

                <!-- 필드 정보 표시 -->
                <div v-if="requestBodyFields.length > 0" class="body-fields-info">
                  <div class="body-fields-header">필드 정보</div>
                  <div class="body-fields-list">
                    <div
                      v-for="field in requestBodyFields"
                      :key="field.name"
                      class="body-field-item"
                    >
                      <span class="body-field-name">{{ field.name }}</span>
                      <span v-if="field.required" class="required">*</span>
                      <span class="body-field-type">({{ field.type }})</span>
                      <span v-if="field.description" class="body-field-desc"
                        >: {{ field.description }}</span
                      >
                    </div>
                  </div>
                </div>

                <textarea v-model="requestBody" class="body-textarea" />
              </div>
            </div>

            <!-- 실행 버튼 -->
            <div class="actions">
              <button
                class="execute-btn"
                :class="{ loading: isLoading }"
                :disabled="isLoading"
                @click="executeRequest"
              >
                <span v-if="isLoading">⏳ 실행 중...</span>
                <span v-else>▶ 실행</span>
              </button>
            </div>

            <!-- 응답 섹션 -->
            <div v-if="response || error" class="response">
              <div class="response-header">
                <div class="response-title">
                  <h3>Response</h3>
                  <div class="response-meta">
                    <span
                      v-if="statusCode"
                      class="status-badge"
                      :class="statusCode < 300 ? 'success' : 'error'"
                    >
                      {{ statusCode }}
                    </span>
                    <span class="time">{{ requestTime }}ms</span>
                  </div>
                </div>
                <button
                  v-if="response"
                  class="icon-btn"
                  @click="copyToClipboard(JSON.stringify(response, null, 2))"
                >
                  📋 복사
                </button>
              </div>

              <div v-if="error" class="error-box">
                <div class="error-icon">❌</div>
                <div class="error-content">
                  <div class="error-message">{{ error }}</div>
                </div>
              </div>

              <pre v-if="response" class="response-body">{{
                JSON.stringify(response, null, 2)
              }}</pre>
            </div>
          </div>
        </main>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* 기본 다크 테마 변수 */
.api-tester {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-tertiary: #21262d;
  --border-primary: #21262d;
  --border-secondary: #30363d;
  --border-hover: #484f58;
  --text-primary: #c9d1d9;
  --text-secondary: #8b949e;
  --text-tertiary: #6e7681;
  --accent-primary: #58a6ff;
  --accent-hover: #1a5dd9;
  --success: #238636;
  --success-light: #3fb950;
  --success-hover: #2ea043;
  --error: #f85149;
  --error-light: #ff7b72;
  --error-bg: rgba(248, 81, 73, 0.05);
  --warning: #f0883e;
  --shadow: rgba(0, 0, 0, 0.5);
  --scrollbar-track: transparent;
  --scrollbar-thumb: #30363d;
}

/* 라이트 테마 변수 */
.api-tester.light {
  --bg-primary: #ffffff;
  --bg-secondary: #f6f8fa;
  --bg-tertiary: #eaeef2;
  --border-primary: #d0d7de;
  --border-secondary: #d0d7de;
  --border-hover: #afb8c1;
  --text-primary: #24292f;
  --text-secondary: #57606a;
  --text-tertiary: #6e7781;
  --accent-primary: #0969da;
  --accent-hover: #0550ae;
  --success: #1a7f37;
  --success-light: #1a7f37;
  --success-hover: #2da44e;
  --error: #cf222e;
  --error-light: #cf222e;
  --error-bg: rgba(207, 34, 46, 0.05);
  --warning: #9a6700;
  --shadow: rgba(0, 0, 0, 0.1);
  --scrollbar-track: #f6f8fa;
  --scrollbar-thumb: #d0d7de;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.api-tester {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  transition:
    background-color 0.2s,
    color 0.2s;
}

/* Header */
.header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  padding: 0.875rem 1.5rem;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
  min-width: 0;
}

.header-center {
  flex: 0 1 auto;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-primary);
  white-space: nowrap;
}

.icon {
  font-size: 1.5rem;
}

.stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.stat {
  font-weight: 500;
}

.stat-divider {
  color: var(--border-secondary);
}

/* Auth Info */
.auth-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
}

.auth-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  align-items: center;
  min-width: 60px;
}

.auth-info-label {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.auth-info-value {
  font-size: 0.8125rem;
  color: var(--text-primary);
  font-weight: 600;
  font-family: 'SF Mono', Monaco, monospace;
  white-space: nowrap;
}

.auth-info-value.expired {
  color: var(--error);
  font-weight: 700;
}

.auth-info-value.expiring {
  color: var(--warning);
  font-weight: 700;
}

/* 은행 선택 select */
.bank-select-item {
  min-width: 140px;
}

.bank-select {
  font-size: 0.8125rem;
  color: var(--text-primary);
  font-weight: 600;
  font-family: 'SF Mono', Monaco, monospace;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 0.125rem 0.25rem;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.bank-select:hover {
  border-color: var(--border-secondary);
  background: var(--bg-tertiary);
}

.bank-select:focus {
  outline: none;
  border-color: var(--accent-primary);
  background: var(--bg-secondary);
  box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.1);
}

.bank-debug {
  font-size: 0.65rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

/* 테마 토글 버튼 */
.theme-toggle-btn {
  padding: 0.5rem 0.875rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-btn:hover {
  background: var(--border-secondary);
  border-color: var(--border-hover);
  transform: translateY(-1px);
}

.token-refresh-btn {
  padding: 0.5rem 0.875rem;
  background: var(--success);
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.token-refresh-btn:hover {
  background: var(--success-hover);
  transform: translateY(-1px);
}

.login-btn,
.logout-btn {
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.login-btn {
  background: var(--accent-primary);
}

.login-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.logout-btn {
  background: var(--error);
}

.logout-btn:hover {
  background: var(--error-light);
  transform: translateY(-1px);
}

.uploaded-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
}

.uploaded-label {
  font-size: 0.75rem;
  color: var(--accent-primary);
  font-weight: 600;
  white-space: nowrap;
}

.reset-btn {
  padding: 0.25rem 0.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
}

.reset-btn:hover {
  background: var(--border-secondary);
  color: var(--text-primary);
}

.upload-btn {
  padding: 0.5rem 0.875rem;
  background: var(--accent-primary);
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.upload-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

/* Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 16px 48px var(--shadow);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-primary);
}

.modal-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  padding: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  transition: color 0.15s;
  line-height: 1;
}

.modal-close:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

.modal-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.file-input-label {
  display: block;
  cursor: pointer;
}

.file-input {
  display: none;
}

.file-input-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: var(--bg-primary);
  border: 2px dashed var(--border-secondary);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.15s;
}

.file-input-text:hover {
  border-color: var(--accent-primary);
  background: var(--bg-secondary);
}

.file-input-icon {
  font-size: 1.5rem;
}

/* Login Modal */
.login-modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  box-shadow: 0 16px 48px var(--shadow);
  animation: slideUp 0.2s ease;
  max-height: 90vh;
  overflow-y: auto;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.login-select {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: 'SF Mono', Monaco, monospace;
  cursor: pointer;
  transition: all 0.15s;
}

.login-select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
}

.login-select option {
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 0.5rem;
}

.login-select optgroup {
  background: var(--bg-secondary);
  color: var(--accent-primary);
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.5rem 0;
}

.user-detail {
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  min-width: 80px;
}

.detail-value {
  font-size: 0.8125rem;
  color: var(--text-primary);
  font-family: 'SF Mono', Monaco, monospace;
}

.detail-value.active {
  color: var(--success-light);
  font-weight: 600;
}

.login-input {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: 'SF Mono', Monaco, monospace;
  transition: all 0.15s;
}

.login-input.editable {
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: text;
}

.login-input.editable:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
}

.login-input::placeholder {
  color: var(--text-tertiary);
}

.login-submit-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-hover) 100%);
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 4px 12px rgba(31, 111, 235, 0.2);
}

.login-submit-btn:hover:not(:disabled) {
  background: linear-gradient(180deg, var(--accent-hover) 0%, #1551c4 100%);
  box-shadow: 0 6px 16px rgba(31, 111, 235, 0.3);
  transform: translateY(-1px);
}

.login-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--border-secondary);
}

/* Content */
.content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Loading & Error States */
.loading-state,
.error-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.error-state .error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.error-state h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--error-light);
}

.error-state p,
.loading-state p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Sidebar */
.sidebar {
  width: 380px;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.search-box {
  padding: 1rem;
  border-bottom: 1px solid var(--border-primary);
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.endpoint-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.endpoint-list::-webkit-scrollbar {
  width: 6px;
}

.endpoint-list::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.endpoint-list::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 3px;
}

/* Category */
.category {
  margin-bottom: 0.25rem;
}

.category-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
}

.category-header:hover {
  background: var(--bg-secondary);
}

.category-icon {
  font-size: 0.625rem;
  color: var(--text-secondary);
  width: 12px;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  align-items: flex-start;
}

.category-name {
  font-weight: 600;
  color: var(--text-primary);
}

.category-code {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  font-family: 'SF Mono', Monaco, monospace;
}

.category-count {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  background: var(--bg-tertiary);
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-weight: 600;
}

/* Endpoints */
.endpoints {
  padding-left: 0.5rem;
}

.endpoint {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-left: 7px solid transparent;
  border-radius: 7px 0 0 7px;
  color: var(--text-primary);
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.endpoint:hover {
  background: var(--bg-secondary);
  border-left-color: var(--border-secondary);
}

.endpoint.active {
  background: var(--bg-secondary);
  border-left-color: var(--accent-primary);
  border-top: 1px solid var(--accent-primary);
  border-bottom: 1px solid var(--accent-primary);
}

.endpoint-method {
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  flex-shrink: 0;
  font-family: 'SF Mono', Monaco, monospace;
}

.endpoint.get .endpoint-method {
  background: #1f6feb;
  color: #ffffff;
}

.endpoint.post .endpoint-method {
  background: #238636;
  color: #ffffff;
}

.endpoint.put .endpoint-method {
  background: #da3633;
  color: #ffffff;
}

.endpoint.patch .endpoint-method {
  background: #a371f7;
  color: #ffffff;
}

.endpoint.delete .endpoint-method {
  background: #f85149;
  color: #ffffff;
}

.endpoint-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.endpoint-summary {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.endpoint-code {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  font-family: 'SF Mono', Monaco, monospace;
}

/* Main */
.main {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-primary);
}

.main::-webkit-scrollbar {
  width: 8px;
}

.main::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.main::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

/* Empty State */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.empty p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Detail */
.detail {
  padding: 2rem;
}

.detail-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-primary);
}

.detail-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.method-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  text-transform: uppercase;
  flex-shrink: 0;
}

.method-badge.get {
  background: #1f6feb;
  color: #ffffff;
}

.method-badge.post {
  background: #238636;
  color: #ffffff;
}

.method-badge.put {
  background: #da3633;
  color: #ffffff;
}

.method-badge.patch {
  background: #a371f7;
  color: #ffffff;
}

.method-badge.delete {
  background: #f85149;
  color: #ffffff;
}

.detail-path {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--accent-primary);
  background: var(--bg-secondary);
  padding: 0.625rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-secondary);
  overflow-x: auto;
  white-space: nowrap;
  font-family: 'SF Mono', Monaco, monospace;
}

.detail-path::-webkit-scrollbar {
  height: 4px;
}

.detail-path::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.detail-path::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 2px;
}

.icon-btn {
  padding: 0.5rem 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.icon-btn:hover {
  background: var(--border-secondary);
  border-color: var(--border-hover);
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  margin: 1.5rem 0 1rem 0;
}

.detail-code {
  color: var(--accent-primary);
  font-family: 'SF Mono', Monaco, monospace;
  font-weight: 600;
}

.detail-summary {
  color: var(--text-primary);
  font-weight: 500;
}

.detail-description {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Parameters */
.params {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.param-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1.25rem;
}

.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.param-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.param-hint {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-left: auto;
}

.param-title-icon {
  font-size: 1rem;
}

.format-btn {
  padding: 0.375rem 0.75rem;
  background: var(--success);
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.format-btn:hover {
  background: var(--success-hover);
}

.param-grid {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.param-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.param-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
}

.param-name {
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'SF Mono', Monaco, monospace;
}

.required {
  color: var(--error);
  font-weight: 700;
  font-size: 1rem;
}

.param-desc {
  color: var(--text-secondary);
  font-weight: 400;
  font-size: 0.75rem;
}

.param-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: 'SF Mono', Monaco, monospace;
  transition: all 0.15s;
}

.param-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
}

.body-textarea {
  width: 100%;
  min-height: 250px;
  padding: 0.875rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: 'SF Mono', Monaco, monospace;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.15s;
}

.body-textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
}

/* Request Body 필드 정보 */
.body-fields-info {
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.875rem;
}

.body-fields-header {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.body-fields-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.body-field-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.body-field-name {
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'SF Mono', Monaco, monospace;
}

.body-field-type {
  color: var(--accent-primary);
  font-size: 0.75rem;
  font-family: 'SF Mono', Monaco, monospace;
}

.body-field-desc {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

/* Actions */
.actions {
  margin-bottom: 2rem;
}

.execute-btn {
  padding: 0.875rem 2rem;
  background: linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-hover) 100%);
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 4px 12px rgba(31, 111, 235, 0.2);
}

.execute-btn:hover:not(:disabled) {
  background: linear-gradient(180deg, var(--accent-hover) 0%, #1551c4 100%);
  box-shadow: 0 6px 16px rgba(31, 111, 235, 0.3);
  transform: translateY(-1px);
}

.execute-btn:active:not(:disabled) {
  transform: translateY(0);
}

.execute-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.execute-btn.loading {
  background: var(--border-secondary);
}

/* Response */
.response {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  overflow: hidden;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-primary);
  background: var(--bg-primary);
}

.response-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.response-title h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.response-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
}

.status-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-weight: 600;
  font-family: 'SF Mono', Monaco, monospace;
}

.status-badge.success {
  background: rgba(35, 134, 54, 0.15);
  color: var(--success-light);
}

.status-badge.error {
  background: var(--error-bg);
  color: var(--error-light);
}

.time {
  color: var(--text-secondary);
  font-family: 'SF Mono', Monaco, monospace;
}

.error-box {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--error-bg);
  border-left: 3px solid var(--error);
}

.error-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
}

.error-message {
  color: var(--error-light);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.6;
}

.response-body {
  padding: 1.25rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.8125rem;
  line-height: 1.6;
  font-family: 'SF Mono', Monaco, monospace;
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
}

.response-body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.response-body::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.response-body::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

/* BASE URL 토글 */
.base-url-toggle {
  display: flex;
  gap: 0;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  overflow: hidden;
}

.base-url-btn {
  padding: 0.5rem 0.875rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  position: relative;
}

.base-url-btn:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 60%;
  width: 1px;
  background: var(--border-secondary);
}

.base-url-btn:hover {
  background: var(--border-secondary);
  color: var(--text-primary);
}

.base-url-btn.active {
  background: var(--accent-primary);
  color: #ffffff;
}

.base-url-btn.active:hover {
  background: var(--accent-hover);
}

/* 현재 BASE URL 표시 */
.current-base-url {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  max-width: 250px;
  overflow: hidden;
}

.base-url-label {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  flex-shrink: 0;
}

.base-url-value {
  font-size: 0.75rem;
  color: var(--accent-primary);
  font-weight: 600;
  font-family: 'SF Mono', Monaco, monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 토스트 메시지 */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--accent-primary);
  color: #ffffff;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 토스트 애니메이션 */
.toast-enter-active {
  animation: toast-in 0.3s ease;
}

.toast-leave-active {
  animation: toast-out 0.3s ease;
}

@keyframes toast-in {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes toast-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100px);
    opacity: 0;
  }
}
</style>
