<template>
  <section class="registry-progress">
    <!-- 검색 패널 -->
    <form class="search-panel" @submit.prevent="handleSearch(true)">
      <div class="grid">
        <label class="field">
          <span class="label">업무구분</span>
          <select v-model="filters.workType" :disabled="codesLoading">
            <option value="ALL">전체</option>
            <option v-for="c in workTypes" :key="c.code" :value="c.code">
              {{ c.description }}
            </option>
          </select>
        </label>

        <label class="field">
          <span class="label">배정업무</span>
          <select v-model="filters.assignedWork" :disabled="codesLoading">
            <option value="ALL">전체</option>
            <option v-for="c in assignmentWorks" :key="c.code" :value="c.description">
              {{ c.description }}
            </option>
          </select>
        </label>

        <label class="field">
          <span class="label">등기방식</span>
          <select v-model="filters.registryMethod" :disabled="codesLoading">
            <option value="ALL">전체</option>
            <option v-for="c in registryMethods" :key="c.code" :value="c.code">
              {{ c.description }}
            </option>
          </select>
        </label>

        <!-- ✅ 담당자: assignable API 결과로 구성 -->
        <label class="field">
          <span class="label">업무담당자</span>
          <select v-model="filters.managerUserId" :disabled="assignableLoading">
            <option v-if="roleLevelValue !== 30" value="ALL">전체</option>
            <option value="-1">미배정</option>
            <option v-for="u in assignableUsers" :key="u.userId" :value="String(u.userId)">
              {{ u.userName }}
            </option>
          </select>
          <small v-if="assignableError" class="hint error-text">{{ assignableError }}</small>
        </label>

        <div class="field">
          <span class="label">등기의뢰일자</span>
          <div class="range">
            <input type="date" v-model="filters.registryRequestStartDate" />
            <span>~</span>
            <input type="date" v-model="filters.registryRequestEndDate" />
          </div>
        </div>

        <div class="field">
          <span class="label">등기접수일자</span>
          <div class="range">
            <input type="date" v-model="filters.registryReceiptStartDate" />
            <span>~</span>
            <input type="date" v-model="filters.registryReceiptEndDate" />
          </div>
        </div>

        <label class="field">
          <span class="label">진행상태</span>
          <select v-model="filters.progressStatus" :disabled="codesLoading">
            <option value="ALL">전체</option>
            <option v-for="c in progressStatuses" :key="c.code" :value="c.code">
              {{ c.description }}
            </option>
          </select>
        </label>

        <label class="field">
          <span class="label">통합검색</span>
          <input
            v-model.trim="filters.keyword"
            placeholder="부동산 주소 또는 신청번호"
            @keydown.enter.prevent="handleSearch(true)"
          />
        </label>
      </div>

      <div class="actions">
        <button type="submit" :disabled="loading">검색</button>
        <button type="button" class="ghost" @click="handleReset" :disabled="loading">초기화</button>
      </div>

      <div v-if="codesError" class="inline-error">{{ codesError }}</div>
    </form>

    <!-- 테이블 -->
    <div class="table-wrap">
      <div v-if="errorMessage" class="inline-error">{{ errorMessage }}</div>

      <table class="table">
        <thead>
          <tr>
            <th style="width: 80px">번호</th>
            <th style="width: 200px">등기신청번호</th>
            <th style="width: 140px">업무구분</th>
            <th style="width: 160px">배정업무</th>
            <th style="width: 120px">등기방식</th>
            <th>부동산주소</th>
            <th style="width: 130px">의뢰일자</th>
            <th style="width: 130px">접수일자</th>
            <th style="width: 160px">담당자</th>
            <th style="width: 140px">진행상태</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td colspan="10" class="muted">불러오는 중…</td>
          </tr>

          <tr v-else-if="rows.length === 0">
            <td colspan="10" class="muted">조회 결과가 없습니다.</td>
          </tr>

          <tr
            v-else
            v-for="r in rows"
            :key="r.registryManagementNumber"
            class="row"
            @click="goDetail(r.registryManagementNumber)"
          >
            <td>{{ r.rowNum }}</td>
            <td>{{ r.registryRequestNumber }}</td>
            <td>{{ r.workType }}</td>
            <td>{{ r.assignedWork }}</td>
            <td>{{ r.registryMethod }}</td>
            <td class="ellipsis">{{ r.propertyAddress ?? '-' }}</td>
            <td>{{ r.registryRequestDate }}</td>
            <td>{{ r.registryReceiptDate }}</td>

            <!-- ✅ 담당자 컬럼: 권한에 따라 렌더링 -->
            <td>
              <!-- USER(30): 미배정이면 배정받기 버튼 -->
              <template v-if="isUser30 && isUnassigned(r.managerUserName)">
                <button
                  type="button"
                  class="assign-btn"
                  :disabled="assigningSet.has(r.registryManagementNumber) || !userId"
                  @click.stop="handleAssignMyself(r.registryManagementNumber)"
                >
                  {{ assigningSet.has(r.registryManagementNumber) ? '처리중…' : '배정받기' }}
                </button>
              </template>

              <!-- 관리자(30 초과): 담당자 선택 셀렉트 -->
              <template v-else-if="isAboveUser30">
                <select
                  class="inline-select"
                  :value="rowSelectedManager.get(r.registryManagementNumber) ?? ''"
                  :disabled="assigningSet.has(r.registryManagementNumber) || assignableLoading"
                  @click.stop
                  @change.stop="(e) => onAdminSelectChange(r.registryManagementNumber, e)"
                >
                  <option value="" disabled>담당자 선택</option>
                  <!-- ❌ 미배정 옵션 제거 -->
                  <option v-for="u in assignableUsers" :key="u.userId" :value="String(u.userId)">
                    {{ u.userName }}
                  </option>
                </select>
              </template>

              <!-- 그 외: 텍스트 -->
              <template v-else>
                {{ r.managerUserName }}
              </template>
            </td>

            <td>{{ r.progressStatus }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <div class="left">
        총 <b>{{ totalElements }}</b
        >건 · {{ page + 1 }} / {{ totalPages || 1 }}
      </div>
      <div class="right">
        <button type="button" @click="movePage(0)" :disabled="loading || page === 0">처음</button>
        <button type="button" @click="movePage(page - 1)" :disabled="loading || page === 0">
          이전
        </button>

        <!-- ✅ 페이지 번호 버튼들 -->
        <div class="page-buttons">
          <button
            v-for="p in pageButtons"
            :key="p.key"
            type="button"
            class="page-btn"
            :class="{ active: p.pageIndex === page }"
            :disabled="loading || p.disabled"
            @click="!p.disabled && movePage(p.pageIndex)"
          >
            {{ p.label }}
          </button>
        </div>

        <label class="page-size">
          <select v-model.number="size" @change="onChangePageSize" :disabled="loading">
            <option :value="10">10</option>
            <option v-if="MAX_PAGE_SIZE >= 20" :value="20">20</option>
            <option v-if="MAX_PAGE_SIZE >= 50" :value="50">50</option>
          </select>
        </label>

        <button
          type="button"
          @click="movePage(page + 1)"
          :disabled="loading || page >= lastPageIndex"
        >
          다음
        </button>
        <button
          type="button"
          @click="movePage(lastPageIndex)"
          :disabled="loading || totalPages === 0"
        >
          마지막
        </button>
      </div>
    </div>

    <!-- 🔧 개발용 -->
    <div class="debug-role">
      <strong>roleLevel:</strong>
      <span>{{ roleLevel }}</span>
      <span class="muted"> (roleLevelValue: {{ roleLevelValue }}, userId: {{ userId }})</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { codeAPI } from '@/api/services/code'
import { registryProgressAPI } from '@/api/services/registry'
import { userAPI } from '@/api/services/user'
import { useAuthStore } from '@/stores/auth'
import type { Code, GetAssignableUsersQuery, SearchRegistryProgresssListQuery } from '@/types'

// Auth Store
const authStore = useAuthStore()
const roleLevel = computed(() => authStore.roleLevel)
const roleLevelValue = computed(() => roleLevel.value ?? 0)
const userId = computed(() => authStore.userId)

const isUser30 = computed(() => roleLevelValue.value === 30)
const isAboveUser30 = computed(() => roleLevelValue.value > 30)

function unwrap<T>(res: any): T | undefined {
  if (!res) return undefined
  if (typeof res === 'object' && 'data' in res) {
    const d = (res as any).data
    if (d && typeof d === 'object' && 'data' in d) return (d as any).data as T
    return d as T
  }
  return res as T
}

function toApiDate(ymd: string) {
  return ymd.replace(/-/g, '')
}
function toYMD(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
function addMonths(base: Date, months: number) {
  const d = new Date(base)
  d.setMonth(d.getMonth() + months)
  return d
}
function clampRangeWithin3Months(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const maxEnd = addMonths(s, 3)
  if (e > maxEnd) return { start, end: toYMD(maxEnd) }
  return { start, end }
}

function isUnassigned(name: string) {
  return name === '미배정' || !name
}

type AssignableUser = { userId: string | number; userName: string }

const assignableUsers = ref<AssignableUser[]>([])

function findUserIdByName(name: string): string {
  if (!name || name === '미배정') return ''
  const hit = assignableUsers.value.find((u) => u.userName === name)
  return hit ? String(hit.userId) : ''
}

const router = useRouter()

/** =======================
 * 코드 옵션
 * ======================= */
const workTypes = ref<Code[]>([])
const assignmentWorks = ref<Code[]>([])
const registryMethods = ref<Code[]>([])
const progressStatuses = ref<Code[]>([])
const codesLoading = ref(false)
const codesError = ref('')

function pickCodes(payload: any): Code[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.codes)) return payload.codes
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.content)) return payload.content
  if (Array.isArray(payload?.result)) return payload.result
  if (Array.isArray(payload?.result?.codes)) return payload.result.codes
  if (Array.isArray(payload?.result?.items)) return payload.result.items
  if (Array.isArray(payload?.result?.content)) return payload.result.content
  return []
}

async function loadCodes() {
  codesLoading.value = true
  codesError.value = ''
  try {
    const [wtRes, awRes, rmRes, psRes] = await Promise.all([
      codeAPI.workTypes(),
      codeAPI.assignmentWorks(),
      codeAPI.registryMethods(),
      codeAPI.progressStatuses()
    ])

    workTypes.value = pickCodes(unwrap<any>(wtRes))
    assignmentWorks.value = pickCodes(unwrap<any>(awRes))
    registryMethods.value = pickCodes(unwrap<any>(rmRes))
    progressStatuses.value = pickCodes(unwrap<any>(psRes))
  } catch (e: any) {
    codesError.value = e?.message ?? '코드 목록 로딩 실패'
    workTypes.value = []
    assignmentWorks.value = []
    registryMethods.value = []
    progressStatuses.value = []
  } finally {
    codesLoading.value = false
  }
}

/** =======================
 * 담당자 옵션: /api/users/assignable
 * ======================= */
const assignableLoading = ref(false)
const assignableError = ref('')

const filters = reactive({
  workType: 'ALL',
  assignedWork: 'ALL',
  registryMethod: 'ALL',
  managerUserId: 'ALL',
  registryRequestStartDate: '',
  registryRequestEndDate: '',
  registryReceiptStartDate: '',
  registryReceiptEndDate: '',
  progressStatus: 'ALL',
  keyword: ''
})

function ensureUserDefaultManager(users: AssignableUser[]) {
  if (!isUser30.value) return
  if (!Array.isArray(users)) return

  const [firstUser] = users
  if (!firstUser) return

  const firstId = String(firstUser.userId)

  if (!filters.managerUserId || filters.managerUserId === 'ALL' || filters.managerUserId === '-1') {
    filters.managerUserId = firstId
  }
}

async function loadAssignableUsers() {
  assignableLoading.value = true
  assignableError.value = ''
  try {
    const query: GetAssignableUsersQuery = {}
    if (filters.assignedWork !== 'ALL') query.assignedWork = filters.assignedWork

    const res: any = await userAPI.assignable(query)
    const payload = unwrap<any>(res)
    const root = payload?.result ?? payload

    const users: AssignableUser[] = Array.isArray(root)
      ? root
      : Array.isArray(root?.content)
        ? root.content
        : Array.isArray(root?.items)
          ? root.items
          : []

    assignableUsers.value = users
    ensureUserDefaultManager(users)
  } catch (e: any) {
    assignableError.value = e?.message ?? '담당자 목록 로딩 실패'
    assignableUsers.value = []
  } finally {
    assignableLoading.value = false
  }
}

/** =======================
 * 날짜 기본값
 * ======================= */
const today = new Date()
const defaultRequestStart = toYMD(addMonths(today, -1))
const defaultRequestEnd = toYMD(today)
const defaultReceiptStart = toYMD(today)
const defaultReceiptEnd = toYMD(addMonths(today, 1))

filters.registryRequestStartDate = defaultRequestStart
filters.registryRequestEndDate = defaultRequestEnd
filters.registryReceiptStartDate = defaultReceiptStart
filters.registryReceiptEndDate = defaultReceiptEnd

function resolveManagerUserIdForApi(v: string): string | null {
  if (!v) return null
  if (v === 'ALL') return 'ALL'
  if (v === '-1') return '-1'
  return v
}

/** =======================
 * 목록/페이지네이션
 * ======================= */
type Row = {
  rowNum: number
  registryRequestNumber: string
  registryManagementNumber: string
  workType: string
  assignedWork: string
  registryMethod: string
  propertyAddress: string | null
  registryRequestDate: string
  registryReceiptDate: string
  managerUserName: string
  progressStatus: string
}

const loading = ref(false)
const errorMessage = ref('')
const rows = ref<Row[]>([])
const totalElements = ref(0)
const totalPages = ref(0)
const page = ref(0)
const size = ref(10)

const lastPageIndex = computed(() => Math.max(0, (totalPages.value || 1) - 1))

function buildQuery(nextPage1Base: number): SearchRegistryProgresssListQuery {
  const req = clampRangeWithin3Months(
    filters.registryRequestStartDate,
    filters.registryRequestEndDate
  )
  const rcp = clampRangeWithin3Months(
    filters.registryReceiptStartDate,
    filters.registryReceiptEndDate
  )

  const managerUserId = resolveManagerUserIdForApi(filters.managerUserId)

  const query: any = {
    workType: filters.workType,
    assignedWork: filters.assignedWork,
    registryMethod: filters.registryMethod,
    progressStatus: filters.progressStatus,

    registryRequestStartDate: toApiDate(req.start),
    registryRequestEndDate: toApiDate(req.end),
    registryReceiptStartDate: toApiDate(rcp.start),
    registryReceiptEndDate: toApiDate(rcp.end),

    page: nextPage1Base,
    size: size.value
  }

  if (managerUserId !== null) query.managerUserId = managerUserId
  if (filters.keyword) query.keyword = filters.keyword

  return query as SearchRegistryProgresssListQuery
}

function calcTotalPagesSafe(totalEl: number, pageSize: number) {
  const s = Math.max(1, Number(pageSize) || 1)
  const t = Math.max(0, Number(totalEl) || 0)
  return Math.max(1, Math.ceil(t / s))
}

async function fetchList(resetPage: boolean) {
  loading.value = true
  errorMessage.value = ''
  try {
    if (resetPage) page.value = 0

    const query = buildQuery(page.value + 1)
    const res: any = await registryProgressAPI.getList(query)

    const payload = unwrap<any>(res)
    const data = payload?.result ?? payload

    rows.value = data?.content ?? []
    totalElements.value = Number(data?.totalElements ?? 0)
    totalPages.value = calcTotalPagesSafe(totalElements.value, size.value)

    if (page.value > lastPageIndex.value) {
      page.value = lastPageIndex.value
      const query2 = buildQuery(page.value + 1)
      const res2: any = await registryProgressAPI.getList(query2)
      const payload2 = unwrap<any>(res2)
      const data2 = payload2?.result ?? payload2

      rows.value = data2?.content ?? rows.value
      totalElements.value = Number(data2?.totalElements ?? totalElements.value)
      totalPages.value = calcTotalPagesSafe(totalElements.value, size.value)
    }

    hydrateRowSelectedManager()
  } catch (e: any) {
    errorMessage.value = e?.message ?? '목록 조회 실패'
    rows.value = []
    totalElements.value = 0
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

function handleSearch(reset: boolean) {
  fetchList(reset)
}

async function handleReset() {
  filters.workType = 'ALL'
  filters.assignedWork = 'ALL'
  filters.registryMethod = 'ALL'
  filters.progressStatus = 'ALL'
  filters.keyword = ''

  filters.registryRequestStartDate = defaultRequestStart
  filters.registryRequestEndDate = defaultRequestEnd
  filters.registryReceiptStartDate = defaultReceiptStart
  filters.registryReceiptEndDate = defaultReceiptEnd

  filters.managerUserId = isUser30.value ? '' : 'ALL'

  await loadAssignableUsers()
  fetchList(true)
}

function movePage(next: number) {
  const clamped = Math.min(Math.max(next, 0), lastPageIndex.value)
  if (clamped === page.value) return
  page.value = clamped
  fetchList(false)
}

function goDetail(registryManagementNumber: string) {
  router.push({ name: 'RegistrationDetail', params: { caseId: registryManagementNumber } })
}

/** =======================
 * ✅ 페이지네이션 UI
 * ======================= */
const MAX_PAGE_SIZE = 50 as const

function onChangePageSize() {
  const v = Number(size.value)
  if (!Number.isFinite(v) || v <= 0) size.value = 10
  if (size.value > MAX_PAGE_SIZE) size.value = MAX_PAGE_SIZE
  handleSearch(true)
}

type PageButton = {
  key: string
  label: string
  pageIndex: number
  disabled: boolean
}

const pageButtons = computed<PageButton[]>(() => {
  const tp = Math.max(1, totalPages.value || 1)
  const current = Math.min(Math.max(page.value, 0), tp - 1)

  const windowSize = 5
  const half = Math.floor(windowSize / 2)

  let start = Math.max(0, current - half)
  let end = Math.min(tp - 1, start + windowSize - 1)
  start = Math.max(0, end - (windowSize - 1))

  const items: PageButton[] = []

  items.push({ key: 'p-0', label: '1', pageIndex: 0, disabled: current === 0 })

  if (start > 1) {
    items.push({ key: 'ellipsis-left', label: '…', pageIndex: current, disabled: true })
  }

  for (let i = Math.max(1, start); i <= Math.min(end, tp - 2); i += 1) {
    items.push({
      key: `p-${i}`,
      label: String(i + 1),
      pageIndex: i,
      disabled: i === current
    })
  }

  if (end < tp - 2) {
    items.push({ key: 'ellipsis-right', label: '…', pageIndex: current, disabled: true })
  }

  if (tp > 1) {
    items.push({
      key: `p-${tp - 1}`,
      label: String(tp),
      pageIndex: tp - 1,
      disabled: current === tp - 1
    })
  }

  return items
})

/** =======================
 * ✅ R02B-03 배정 API 공통 호출
 * ======================= */
const assigningSet = ref<Set<string>>(new Set())

async function callAssignManager(
  registryManagementNumber: string,
  managerUserIdToAssign: number | string
) {
  if (assigningSet.value.has(registryManagementNumber)) return
  assigningSet.value.add(registryManagementNumber)

  try {
    const res: any = await registryProgressAPI.assignManager({
      registryManagementNumber,
      managerUserId: managerUserIdToAssign
    } as any)

    const payload = unwrap<any>(res)
    const msg =
      payload?.message ??
      payload?.result?.message ??
      (res as any)?.message ??
      '업무담당자 배정이 완료되었습니다.'

    window.alert(msg)
    await fetchList(false)
  } catch (e: any) {
    const msg = e?.message ?? '업무담당자 배정에 실패했습니다.'
    window.alert(msg)
  } finally {
    assigningSet.value.delete(registryManagementNumber)
  }
}

async function handleAssignMyself(registryManagementNumber: string) {
  if (!isUser30.value) return
  if (!userId.value) {
    window.alert('사용자 정보가 없습니다. 다시 로그인해 주세요.')
    return
  }
  await callAssignManager(registryManagementNumber, userId.value)
}

/** 관리자(30 초과): 셀렉트 렌더/선택 */
const rowSelectedManager = ref<Map<string, string>>(new Map())

function hydrateRowSelectedManager() {
  const m = new Map(rowSelectedManager.value)

  for (const r of rows.value) {
    const currentSelected = findUserIdByName(r.managerUserName)
    const existing = m.get(r.registryManagementNumber)
    if (!existing) m.set(r.registryManagementNumber, currentSelected)
    else m.set(r.registryManagementNumber, existing)
  }

  rowSelectedManager.value = m
}

async function handleAdminSelectChange(registryManagementNumber: string, selected: string) {
  if (!selected) return

  const userLabel =
    assignableUsers.value.find((u) => String(u.userId) === selected)?.userName ?? selected

  const ok = window.confirm(`담당자를 "${userLabel}"(으)로 배정하시겠습니까?`)
  if (!ok) {
    const r = rows.value.find((x) => x.registryManagementNumber === registryManagementNumber)
    const rollback = r ? findUserIdByName(r.managerUserName) : ''
    const m = new Map(rowSelectedManager.value)
    m.set(registryManagementNumber, rollback)
    rowSelectedManager.value = m
    return
  }

  const m = new Map(rowSelectedManager.value)
  m.set(registryManagementNumber, selected)
  rowSelectedManager.value = m

  await callAssignManager(registryManagementNumber, selected)
}

function onAdminSelectChange(registryManagementNumber: string, e: Event) {
  const value = (e.target as HTMLSelectElement | null)?.value ?? ''
  handleAdminSelectChange(registryManagementNumber, value)
}

/** ✅ 배정업무 변경 시 assignable 호출 */
watch(
  () => filters.assignedWork,
  async () => {
    filters.managerUserId = isUser30.value ? '' : 'ALL'
    await loadAssignableUsers()
  }
)

/** ✅ roleLevel이 늦게 들어오는 케이스 대비 */
watch(
  () => roleLevelValue.value,
  async (lv) => {
    if (lv === 30) {
      if (!assignableUsers.value.length) {
        await loadAssignableUsers()
      } else {
        ensureUserDefaultManager(assignableUsers.value)
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await loadCodes()
  await loadAssignableUsers()
  await fetchList(true)
})
</script>

<style scoped lang="scss">
.registry-progress {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-panel {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  background: #fff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 12px;
  color: #374151;
}

.hint {
  font-size: 11px;
  color: #6b7280;
  line-height: 1.3;
}

.error-text {
  color: #b91c1c;
}

.range {
  display: flex;
  align-items: center;
  gap: 6px;
}

input,
select {
  font-size: 14px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
}

.actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

button {
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #111827;
  color: #fff;
  cursor: pointer;
}

button.ghost {
  background: #fff;
  color: #111827;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.table-wrap {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid #f3f4f6;
  text-align: left;
  font-size: 13px;
}

thead th {
  background: #f9fafb;
  font-weight: 600;
}

.row {
  cursor: pointer;
}

.row:hover td {
  background: #f9fafb;
}

.muted {
  text-align: center;
  color: #6b7280;
}

.ellipsis {
  max-width: 360px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 2px;
}

.pagination .right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.page-size select {
  height: 34px;
}

.inline-error {
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  font-size: 12px;
}

// @media (max-width: 1100px) {
//   .grid {
//     grid-template-columns: repeat(2, minmax(0, 1fr));
//   }
// }

.debug-role {
  margin-top: 6px;
  font-size: 14px;
  color: #6b7280;
  text-align: right;
}

.assign-btn {
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #111827;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
}
.assign-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.inline-select {
  height: 28px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 12px;
}
</style>
