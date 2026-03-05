<!-- 문서 경로: `@/src/features/main/pages/DashboardPage.vue`
문서 제목: 기능 페이지/컴포넌트: dashboard-page -->

<template>
  <div class="dashboard-page">
    <div class="dashboard-options">
      <FormSelect
        class="dashboard-select"
        v-model="selectedCity"
        :options="cityOptions"
        placeholder="담당자"
        :disabled="assignableLoading"
        @change="handleCityChange"
      />
      <small v-if="assignableError" class="assignable-error">{{ assignableError }}</small>

      <ul class="date-tab">
        <li v-for="tab in tabs" :key="tab.value">
          <button :class="{ active: activeValue === tab.value }" @click="handleClick(tab)">
            {{ tab.label }}
          </button>
        </li>
      </ul>
    </div>

    <div class="dashboard-contents">
      <!-- line 01 -->
      <div class="dashboard-row">
        <!-- 등기 견적 관리 -->
        <div class="dashboard-card card30">
          <h4>등기 견적 관리</h4>
          <ul class="dashboard-btn-list">
            <li>
              <router-link to="/estimate">
                <p>견적 요청 건수 :</p>
                <p>
                  <span class="num">{{ estimateSummary.requestCount }}</span>
                  건
                </p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
            <li>
              <router-link to="/estimate">
                <p>견적 작성 건수 :</p>
                <p>
                  <span class="num">{{ estimateSummary.writtenCount }}</span>
                  건
                </p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
            <li>
              <router-link to="/estimate">
                <p>견적 수임 건수 :</p>
                <p>
                  <span class="num">{{ estimateSummary.awardedCount }}</span>
                  건
                </p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 나의 등기 진행 현황 -->
        <div class="dashboard-card card30">
          <h4>나의 등기 진행 현황</h4>
          <ul class="dashboard-btn-list">
            <li>
              <router-link to="/estimate">
                <p>업무 배정 건수 :</p>
                <p>
                  <span class="num">{{ progressSummary.assignedCount }}</span>
                  건
                </p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
            <li>
              <p>업무 진행 건수 :</p>
              <p>
                <span class="num">{{ progressSummary.inProgressCount }}</span>
                <span>건</span>
              </p>
            </li>
            <li>
              <p>완료·취소 건수 :</p>
              <p>
                <span class="num">{{ progressSummary.completedCount }}</span>
                <span>건</span>
              </p>
            </li>
          </ul>
        </div>

        <!-- 오늘의 접수 사건 -->
        <div class="dashboard-card card40">
          <h4>
            오늘의 접수 사건
            <router-link to="/estimate" class="more-link"
              ><i class="fi fi-br-plus-small"></i>더보기</router-link
            >
          </h4>
          <ul class="dashboard-btn-list">
            <!-- [R02A-02] 오늘의 접수사건 API 결과 렌더링 -->
            <li
              v-for="(item, index) in todayCases"
              :key="`${item.registryManagementNumber}-${index}`"
            >
              <router-link to="/estimate">
                <p>
                  [{{ item.registryReceiptDate || '-' }}]
                  {{ item.registryManagementNumber || '-' }} - {{ item.userName || '-' }}
                </p>
                <i class="fi fi-rr-angle-circle-right"></i>
                <i class="fi fi-sr-angle-circle-right"></i>
              </router-link>
            </li>
            <li v-if="loadError">
              <p>{{ loadError }}</p>
            </li>
            <li v-if="!isLoading && todayCases.length === 0">
              <p>오늘 접수된 사건이 없습니다.</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- line 02 -->
      <div class="dashboard-row" v-if="true">
        <div class="dashboard-card">
          <h4>사건 처리 현황</h4>

          <!-- TODO: 임시영역 -->
          <div class="catbox">
            <!-- <i class="fi fi-sr-cat"></i>
            <p>This area is in a Schrödinger state.</p>
            <i class="fi fi-rr-box-open"></i> -->

            <DashboardChart />
          </div>
        </div>
      </div>

      <!-- line 03 -->
      <div class="dashboard-row">
        <div class="dashboard-card card30">
          <h4>
            공지사항
            <router-link to="/notice" class="more-link"
              ><i class="fi fi-br-plus-small"></i>더보기</router-link
            >
          </h4>

          <ul class="notice-list">
            <li v-for="item in notices" :key="item.noticeId">
              <router-link
                :to="{ name: 'NoticeDetail', params: { noticeId: String(item.noticeId) } }"
              >
                <p>{{ item.title || '-' }}</p>
                <p>{{ item.noticeDate || '-' }}</p>
              </router-link>
            </li>
            <li v-if="!isLoading && notices.length === 0">
              <p>공지사항이 없습니다.</p>
            </li>
          </ul>
        </div>

        <div class="dashboard-card card30">
          <h4>서비스 이용 문의</h4>
          <ul class="help-list">
            <li class="call">
              <h4 class="multi-line"><i class="fi fi-sr-phone-call"></i>문의전화</h4>
              <p class="multi-line">070-1234-1234</p>
            </li>
            <li class="time">
              <h4 class="multi-line"><i class="fi fi-sr-user-time"></i>운영시간</h4>
              <p class="multi-line">월~금 09:00~18:00<br /><span>(공휴일 제외)</span></p>
            </li>
          </ul>
        </div>

        <div class="dashboard-card card40">
          <h4>관련 서비스</h4>

          <ul class="service-list">
            <li>
              <a href="#">
                <i class="fi fi-br-folder-download"></i>
                <p>RPA 설치</p>
              </a>
            </li>
            <li>
              <a href="#">
                <i class="fi fi-sr-file-signature"></i>
                <p>전자서명 뷰어</p>
              </a>
            </li>
            <li>
              <a href="#">
                <i class="fi fi-br-data-transfer"></i>
                <p>원격지원</p>
              </a>
            </li>
            <li>
              <a :href="links.register.iros" target="_blank" rel="noopener noreferrer">
                <i class="fi fi-ss-house-building"></i>
                <p>인터넷등기소</p>
              </a>
            </li>
            <li>
              <a :href="links.register.etax" target="_blank" rel="noopener noreferrer">
                <i class="fi fi-sr-square-e"></i>
                <p>이택스</p>
              </a>
            </li>
            <li>
              <a :href="links.register.wetax" target="_blank" rel="noopener noreferrer">
                <i class="fi fi-sr-square-w"></i>
                <p>위택스</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

import { noticeAPI } from '@/api/services/notice'
import { registryDashboardAPI } from '@/api/services/registry/dashboard'
import { userAPI } from '@/api/services/user'
import FormSelect, { type SelectOption } from '@/components/template/input/UserSelect.vue'
import { useExternalLinks } from '@/composables/utils/useExternalLinks'
import type {
  NoticeResponse,
  RegistryEstimateSummaryResponse,
  RegistryProgressSummaryResponse,
  RegistryProgressTodayResponse,
  SearchEstimateSummaryQuery,
  SearchRegistryProgressSummaryQuery,
  SearchRegistryProgressTodayQuery,
  UserAssignableResponse
} from '@/types'

import DashboardChart from './DashboardChart.vue'

const { links } = useExternalLinks()

// ============================================================================
// 대시보드 필터 상태
// ============================================================================

// 담당자 필터 옵션 (/api/users/assignable 기반)
const cityOptions = ref<SelectOption[]>([{ label: '전체', value: 'ALL' }])

// 선택된 담당자 (기본: 전체)
const selectedCity = ref<string | number | null>('ALL')
const assignableLoading = ref(false)
const assignableError = ref('')

// 담당자 변경 이벤트 (v-model 동기화 이후 watch에서 API 재조회)
const handleCityChange = (value: string | number) => {
  selectedCity.value = value
}

// 조회 기간 탭 타입
type DateTab = {
  label: string
  value: string
}

// 조회 기간 탭 목록
const tabs = ref<DateTab[]>([
  { label: '1일', value: '1d' },
  { label: '1주', value: '1w' },
  { label: '1개월', value: '1m' }
])

// 현재 활성 조회 기간
const activeValue = ref<string>('1d')

// 조회 기간 탭 클릭 핸들러
const handleClick = (tab: DateTab) => {
  activeValue.value = tab.value
}

// ============================================================================
// 대시보드 API 상태
// ============================================================================

// [R02A-03] 견적현황 요약 조회 결과
const estimateSummary = reactive<Required<RegistryEstimateSummaryResponse>>({
  requestCount: 0,
  writtenCount: 0,
  awardedCount: 0
})

// [R02A-01] 나의 진행현황 조회 결과
const progressSummary = reactive<Required<RegistryProgressSummaryResponse>>({
  assignedCount: 0,
  inProgressCount: 0,
  completedCount: 0
})

// [R02A-02] 오늘의 접수사건 조회 결과
const todayCases = ref<RegistryProgressTodayResponse[]>([])
const notices = ref<NoticeResponse[]>([])

// 로딩/에러 상태
const isLoading = ref(false)
const loadError = ref<string | null>(null)

// ============================================================================
// 내부 유틸
// ============================================================================

// API 응답이 { data: ... } 구조/바로 데이터 구조 모두 대응
function unwrapResponse<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return (payload as { data: T }).data
  }
  return payload as T
}

function extractApiRoot<T>(payload: unknown): T {
  let current: unknown = payload

  if (current && typeof current === 'object' && 'data' in (current as Record<string, unknown>)) {
    current = (current as { data: unknown }).data
  }
  if (current && typeof current === 'object' && 'result' in (current as Record<string, unknown>)) {
    current = (current as { result: unknown }).result
  }
  if (current && typeof current === 'object' && 'data' in (current as Record<string, unknown>)) {
    current = (current as { data: unknown }).data
  }

  return (current ?? {}) as T
}

function toNumberOrZero(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function normalizeEstimateSummary(source: unknown): Required<RegistryEstimateSummaryResponse> {
  const obj = (source && typeof source === 'object' ? source : {}) as Record<string, unknown>
  return {
    requestCount: toNumberOrZero(
      obj.requestCount ?? obj.requestCnt ?? obj.estimateRequestCount ?? obj.estimateRequestCnt
    ),
    writtenCount: toNumberOrZero(
      obj.writtenCount ?? obj.writtenCnt ?? obj.estimateWrittenCount ?? obj.estimateWrittenCnt
    ),
    awardedCount: toNumberOrZero(
      obj.awardedCount ??
        obj.awardedCnt ??
        obj.acceptedCount ??
        obj.acceptedCnt ??
        obj.estimateAwardedCount
    )
  }
}

function normalizeNoticeList(source: unknown): NoticeResponse[] {
  if (Array.isArray(source)) return source as NoticeResponse[]
  if (source && typeof source === 'object') {
    const obj = source as Record<string, unknown>
    if (Array.isArray(obj.content)) return obj.content as NoticeResponse[]
    if (Array.isArray(obj.noticeList)) return obj.noticeList as NoticeResponse[]
    if (Array.isArray(obj.items)) return obj.items as NoticeResponse[]
    if ('noticeId' in obj || 'title' in obj) return [obj as NoticeResponse]
  }
  return []
}

// Date -> YYYYMMDD (R02A 대시보드 API 스펙 요구 포맷)
function formatApiDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

function getOneMonthInclusiveStart(end: Date): Date {
  const endYear = end.getFullYear()
  const endMonth = end.getMonth()
  const endDay = end.getDate()

  const prevMonthDate = new Date(endYear, endMonth - 1, 1)
  const targetYear = prevMonthDate.getFullYear()
  const targetMonth = prevMonthDate.getMonth()
  const maxDay = getDaysInMonth(targetYear, targetMonth)
  const clampedDay = Math.min(endDay, maxDay)

  const start = new Date(targetYear, targetMonth, clampedDay)
  start.setDate(start.getDate() + 1)
  return start
}

// 탭 값에 맞는 기간(시작일/종료일) 계산
function getDateRange(tabValue: string): { startDate: string; endDate: string } {
  const end = new Date()
  const start = new Date(end)

  // 1일: 오늘 하루만 조회
  if (tabValue === '1d') start.setDate(start.getDate())
  // 1주: 오늘 포함 7일 (예: 금요일이면 전주 토요일 ~ 금요일)
  if (tabValue === '1w') start.setDate(start.getDate() - 6)
  // 1개월: 오늘 포함 기준 전월 동일일 다음날부터 (예: 3/5 -> 2/6)
  if (tabValue === '1m') {
    const monthlyStart = getOneMonthInclusiveStart(end)
    start.setTime(monthlyStart.getTime())
  }

  return {
    startDate: formatApiDate(start),
    endDate: formatApiDate(end)
  }
}

// 공통 쿼리 생성
function buildBaseQuery():
  | SearchEstimateSummaryQuery
  | SearchRegistryProgressSummaryQuery
  | SearchRegistryProgressTodayQuery {
  const { startDate, endDate } = getDateRange(activeValue.value)
  const targetUserId = selectedCity.value ? String(selectedCity.value) : 'ALL'
  const query: SearchEstimateSummaryQuery = { startDate, endDate, targetUserId }

  return query
}

// 업무 담당자 목록 조회 (등기 진행 현황과 동일 API 사용)
async function loadAssignableUsers() {
  assignableLoading.value = true
  assignableError.value = ''

  try {
    const response = await userAPI.assignable({})
    const payload = unwrapResponse<unknown>(response)
    const root =
      payload && typeof payload === 'object' && 'result' in (payload as Record<string, unknown>)
        ? (payload as { result: unknown }).result
        : payload

    const users: UserAssignableResponse[] = Array.isArray(root)
      ? root
      : root && typeof root === 'object' && Array.isArray((root as { content?: unknown[] }).content)
        ? ((root as { content: UserAssignableResponse[] }).content ?? [])
        : root && typeof root === 'object' && Array.isArray((root as { items?: unknown[] }).items)
          ? ((root as { items: UserAssignableResponse[] }).items ?? [])
          : []

    cityOptions.value = [
      { label: '전체', value: 'ALL' },
      ...users
        .filter((user) => user.userId != null)
        .map((user) => ({
          label: user.userName || `담당자-${user.userId}`,
          value: String(user.userId)
        }))
    ]
  } catch (error) {
    assignableError.value = '업무 담당자 목록을 불러오지 못했습니다.'
    cityOptions.value = [{ label: '전체', value: 'ALL' }]
    console.error('[DASHBOARD] Failed to load assignable users', error)
  } finally {
    assignableLoading.value = false
  }
}

// ============================================================================
// API 조회
// ============================================================================

// 대시보드 3개 카드 API를 병렬 호출해 화면을 동기화
async function fetchDashboardData() {
  isLoading.value = true
  loadError.value = null

  try {
    const query = buildBaseQuery()

    const [estimateRes, progressRes, todayRes, noticeRes] = await Promise.allSettled([
      registryDashboardAPI.summary2(query),
      registryDashboardAPI.summary(query),
      registryDashboardAPI.today(query),
      noticeAPI.getList()
    ])

    const estimateData =
      estimateRes.status === 'fulfilled'
        ? extractApiRoot<RegistryEstimateSummaryResponse>(unwrapResponse(estimateRes.value))
        : ({} as RegistryEstimateSummaryResponse)

    const progressData =
      progressRes.status === 'fulfilled'
        ? extractApiRoot<RegistryProgressSummaryResponse>(unwrapResponse(progressRes.value))
        : ({} as RegistryProgressSummaryResponse)

    const todayRoot =
      todayRes.status === 'fulfilled'
        ? extractApiRoot<unknown>(unwrapResponse(todayRes.value))
        : null

    const normalizedEstimate = normalizeEstimateSummary(estimateData)
    estimateSummary.requestCount = normalizedEstimate.requestCount
    estimateSummary.writtenCount = normalizedEstimate.writtenCount
    estimateSummary.awardedCount = normalizedEstimate.awardedCount

    progressSummary.assignedCount = progressData?.assignedCount ?? 0
    progressSummary.inProgressCount = progressData?.inProgressCount ?? 0
    progressSummary.completedCount = progressData?.completedCount ?? 0

    // today API는 환경별로 단건/배열/content/items 포맷이 달라질 수 있어 모두 수용
    todayCases.value = Array.isArray(todayRoot)
      ? (todayRoot as RegistryProgressTodayResponse[])
      : todayRoot && typeof todayRoot === 'object' && Array.isArray((todayRoot as any).content)
        ? (((todayRoot as any).content ?? []) as RegistryProgressTodayResponse[])
        : todayRoot && typeof todayRoot === 'object' && Array.isArray((todayRoot as any).items)
          ? (((todayRoot as any).items ?? []) as RegistryProgressTodayResponse[])
          : todayRoot
            ? [todayRoot as RegistryProgressTodayResponse]
            : []

    const noticeRoot =
      noticeRes.status === 'fulfilled'
        ? extractApiRoot<unknown>(unwrapResponse(noticeRes.value))
        : null
    notices.value = normalizeNoticeList(noticeRoot).slice(0, 5)

    if (
      estimateRes.status === 'rejected' ||
      progressRes.status === 'rejected' ||
      todayRes.status === 'rejected' ||
      noticeRes.status === 'rejected'
    ) {
      loadError.value = '일부 대시보드 데이터를 불러오지 못했습니다.'
    }
  } catch (error) {
    loadError.value = '대시보드 데이터를 불러오지 못했습니다.'
    // 실패 시에도 기존 화면 구조가 깨지지 않도록 0/빈배열로 유지
    estimateSummary.requestCount = 0
    estimateSummary.writtenCount = 0
    estimateSummary.awardedCount = 0
    progressSummary.assignedCount = 0
    progressSummary.inProgressCount = 0
    progressSummary.completedCount = 0
    todayCases.value = []
    notices.value = []
    console.error('[DASHBOARD] Failed to fetch dashboard data', error)
  } finally {
    isLoading.value = false
  }
}

// ============================================================================
// Lifecycle / Watch
// ============================================================================

// 최초 진입 시 1회 조회
onMounted(async () => {
  await loadAssignableUsers()
  await fetchDashboardData()
})

// 담당자/조회 기간 변경 시 자동 재조회
watch([selectedCity, activeValue], () => {
  fetchDashboardData()
})
</script>

<style lang="scss" scoped>
.dashboard-page {
  width: 100%;
  height: auto;
  display: flex;
  position: relative;

  .dashboard-options {
    position: absolute;
    top: -70px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 40px;

    .dashboard-select {
      width: 130px;
    }

    .assignable-error {
      display: flex;
      align-items: center;
      margin-left: 8px;
      color: #d64545;
      font-size: 12px;
      white-space: nowrap;
    }

    .date-tab {
      display: flex;
      background-color: #fff;
      border-radius: 5px;
      border: 1px solid #dddddd;
      margin-left: 10px;
      overflow: hidden;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

      li {
        button {
          width: 80px;
          height: 40px;
          font-size: 16px;
          font-weight: 600;
          color: #bbbbbb;
          line-height: 42px;
          cursor: pointer;

          &.active {
            background-color: #21adad;
            color: #fff;
          }
        }

        border-right: 1px solid #eeeeee;

        &:last-of-type {
          border: 0;
        }
      }
    }
  }

  .dashboard-contents {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 40px;

    .dashboard-row {
      width: 100%;
      height: auto;

      display: flex;
      gap: 20px;

      .dashboard-card {
        width: 100%;
        padding: 25px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

        &.card30 {
          width: 30%;
        }

        &.card40 {
          width: 40%;
        }

        > h4 {
          width: 100%;
          margin-bottom: 25px;
          padding-bottom: 20px;
          font-size: 21px;
          border-bottom: 2px solid #dddddd;
          color: #21adad;

          display: flex;
          justify-content: space-between;
          align-items: center;

          .more-link {
            font-size: 14px;
            color: #999999;

            display: flex;
            align-items: center;

            i {
              margin-right: 5px;

              &::before {
                font-size: 14px;
                color: #999999;
              }
            }
          }
        }

        > .dashboard-btn-list {
          width: 100%;
          height: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;

          li {
            margin-bottom: 10px;
            width: 100%;
            min-height: 22px;
            display: flex;
            align-items: center;

            &:last-of-type {
              margin: 0;
            }

            a {
              width: 100%;
              display: flex;
              align-items: center;
            }

            p {
              font-size: 18px;
              font-weight: 600;
              width: 40%;

              display: flex;

              &:nth-of-type(2) {
                width: 35%;
                text-align: right;

                .num {
                  font-family: 'Roboto Mono';
                  font-size: 21px;
                  color: #21adad;
                  margin-right: 5px;
                  margin-left: auto;
                  line-height: 18px;
                }
              }
            }

            i {
              margin-left: auto;
              color: #999999;

              &:first-of-type {
                display: block;
              }
              &:last-of-type {
                display: none;
              }
            }

            &:hover {
              i {
                color: #33cccc;

                &:first-of-type {
                  display: none;
                }
                &:last-of-type {
                  display: block;
                }
              }
            }
          }
        }

        &.card30 {
          width: 30%;
        }

        &.card40 {
          width: 40%;

          > .dashboard-btn-list {
            p {
              width: 100%;
            }
          }
        }

        .notice-list li {
          margin-bottom: 15px;

          &:last-of-type {
            margin: 0;
          }

          a {
            display: flex;
            justify-content: space-between;

            p {
              font-size: 16px;

              &:first-of-type {
                width: 70%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                &:hover {
                  color: #21adad;
                  font-weight: 600;
                }
              }

              &:last-of-type {
                width: 30%;
                text-align: right;

                font-size: 14px;
                line-height: 16px;
                color: #999999;
              }
            }
          }
        }

        .help-list {
          width: fit-content;
          height: 140px;
          display: flex;
          flex-direction: column;
          padding-top: 15px;
          margin: auto;

          li {
            display: flex;

            h4 {
              padding-top: 1px;
              font-size: 18px;
              display: flex;
              margin-right: 20px;
              align-items: flex-start;
              color: #666666;

              i {
                padding-top: 1px;
                margin-right: 10px;
                display: flex;
                align-items: center;
                padding-top: 7px;

                &::before {
                  font-size: 16px;
                }
              }
            }

            p {
              font-weight: 600;
              span {
                font-size: 16px;
                color: #999999;
              }
            }

            &.call {
              margin-bottom: 15px;
            }
          }
        }

        .service-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;

          li {
            height: 65px;
            background-color: #eeeeee;
            border: 2px solid #eeeeee;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.3s;

            a {
              width: 100%;
              height: 100%;
              display: flex;
              gap: 7px;
              align-items: center;
              justify-content: center;

              i {
                display: flex;
                align-items: center;

                &::before {
                  font-size: 20px;
                  color: #999999;
                }
              }

              p {
                font-size: 15px;
                color: #666666;
              }
            }

            &:hover {
              background-color: #ebf7f8;
              border: 2px solid #33cccc;

              a {
                i {
                  &::before {
                    color: #33cccc;
                    transition: 0.3s;
                  }
                }

                p {
                  color: #21adad;
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
    }
  }
}

// TODO: 임시영역
.catbox {
  // background-color: #eeeeee;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;

  p {
    color: #999999;
    font-size: 28px;
    margin: 0 20px;
  }

  i::before {
    font-size: 32px;
  }
}
</style>
