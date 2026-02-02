<template>
  <section class="detail-layout">
    <!-- ✅ 좌측: 비워두는 영역(폭 200px) -->
    <aside class="sidebar" aria-hidden="true"></aside>

    <!-- ✅ 우측: 전체 UI -->
    <main class="content">
      <!-- ✅ 대제목 아코디언 -->
      <div class="accordion">
        <!-- 1) 등기 의뢰 정보 -->
        <section class="acc-section">
          <button type="button" class="acc-header" @click="toggle('REQ')">
            <span class="acc-title">등기 의뢰 정보</span>
            <span class="acc-icon" :class="{ open: openMap.REQ }">▾</span>
          </button>

          <div v-show="openMap.REQ" class="acc-body">
            <ul class="sub-list">
              <!-- ✅ R02B-04: 대출 금융기관 정보 -->
              <li class="sub-item">
                <div class="sub-title">대출 금융기관 정보</div>

                <section class="case-detail">
                  <div v-if="loanLoading" class="muted">불러오는 중…</div>
                  <div v-else-if="loanErrorMessage" class="error">{{ loanErrorMessage }}</div>

                  <div v-else class="card">
                    <div class="row">
                      <span class="label">은행명</span>
                      <span class="value">{{ loanInfo?.bankName ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">지점명</span>
                      <span class="value">{{ loanInfo?.branchName ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">등기의뢰번호</span>
                      <span class="value">{{ loanInfo?.registryRequestNumber ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">담당자명</span>
                      <span class="value">{{ loanInfo?.managerName ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">직급</span>
                      <span class="value">{{ loanInfo?.managerPosition ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">연락처</span>
                      <span class="value">{{ loanInfo?.managerPhone ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">등록일시</span>
                      <span class="value">{{ loanInfo?.createdAt ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">메시지</span>
                      <span class="value">{{ loanInfo?.managerMessage ?? '-' }}</span>
                    </div>
                  </div>
                </section>
              </li>

              <!-- ✅ R02B-02: 업무 기본 정보 -->
              <li class="sub-item">
                <div class="sub-title">업무 기본 정보</div>

                <section class="case-detail">
                  <div v-if="loading" class="muted">불러오는 중…</div>
                  <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

                  <div v-else class="card">
                    <div class="row">
                      <span class="label">등기관리번호</span>
                      <span class="value">{{ detail?.registryManagementNumber ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">등기접수일자</span>
                      <span class="value">{{ detail?.registryReceiptDate ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">진행상태</span>
                      <span class="value">{{ detail?.progressStatus ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">배정업무</span>
                      <span class="value">{{ detail?.assignedWork ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">업무구분</span>
                      <span class="value">{{ detail?.workType ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">진행타입</span>
                      <span class="value">{{ detail?.progressType ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">첨부 개수</span>
                      <span class="value">{{ detail?.attachmentCnt ?? 0 }}</span>
                    </div>
                    <div class="row">
                      <span class="label">상환말소대상</span>
                      <span class="value">{{ detail?.repaymentCancellationSubject ?? '-' }}</span>
                    </div>
                    <div class="row">
                      <span class="label">상환말소대상 개수</span>
                      <span class="value">{{ detail?.repaymentCancellationSubjectCnt ?? 0 }}</span>
                    </div>
                  </div>
                </section>
              </li>

              <li class="sub-item">
                <div class="sub-title">근저당권설정 정보</div>

                <section class="case-detail"></section>
              </li>
              <li class="sub-item">
                <div class="sub-title">소유권이전 정보</div>

                <section class="case-detail"></section>
              </li>
              <li class="sub-item">
                <div class="sub-title">근저당권설정 법무대리인 정보</div>

                <section class="case-detail"></section>
              </li>
              <li class="sub-item">
                <div class="sub-title">소유권이전 법무대리인 정보</div>

                <section class="case-detail"></section>
              </li>
            </ul>
          </div>
        </section>

        <!-- 2) 등기신청서 정보 등록 -->
        <section class="acc-section">
          <button type="button" class="acc-header" @click="toggle('APP')">
            <span class="acc-title">등기신청서 정보 등록</span>
            <span class="acc-icon" :class="{ open: openMap.APP }">▾</span>
          </button>

          <div v-show="openMap.APP" class="acc-body">
            <div class="placeholder muted">여기에 등기신청서 정보 등록 UI 추가</div>
          </div>
        </section>

        <!-- 3) 행정정보 제공 요구 동의요청 -->
        <section class="acc-section">
          <button type="button" class="acc-header" @click="toggle('ADMIN')">
            <span class="acc-title">행정정보 제공 요구 동의요청</span>
            <span class="acc-icon" :class="{ open: openMap.ADMIN }">▾</span>
          </button>

          <div v-show="openMap.ADMIN" class="acc-body">
            <ul class="sub-list">
              <li class="sub-item">행정정보 제공 요구 동의요청 정보</li>
            </ul>
          </div>
        </section>

        <!-- 4) 등기 진행 정보 등록 -->
        <section class="acc-section">
          <button type="button" class="acc-header" @click="toggle('PROG')">
            <span class="acc-title">등기 진행 정보 등록</span>
            <span class="acc-icon" :class="{ open: openMap.PROG }">▾</span>
          </button>

          <div v-show="openMap.PROG" class="acc-body">
            <ul class="sub-list">
              <li class="sub-item">[내부] 전자서명 진행</li>
              <li class="sub-item">세금신고 대행</li>
              <li class="sub-item">국민주택채권 매입</li>
              <li class="sub-item">대출금 지급계좌 등록</li>
              <li class="sub-item">이전/말소 등기권리증 등록</li>
              <li class="sub-item">등기 신청사건 조회</li>
              <li class="sub-item">소유권이전 신청서 작성 정보</li>
              <li class="sub-item">등기접수 정보 등록</li>
              <li class="sub-item">등기접수 정보 등록 - 사건 위임 요청</li>
              <li class="sub-item">[외부] 전자서명 진행상태 관리</li>
              <li class="sub-item">[외부] 전자서명 진행상태 관리 - 사건 위임 완료</li>
              <li class="sub-item">등기 영수증 작성</li>
              <li class="sub-item">등기 완료 문서 등록</li>
              <li class="sub-item">등기 완료 문서 제출 안내 (소유권이전)</li>
              <li class="sub-item">등기 완료 문서 제출 안내 (근저당권설정)</li>
              <li class="sub-item">등기 완료 문서 제출 안내 (근저당권설정, 소유권이전)</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { registryProgressAPI } from '@/api/services/registry'

type RegistryProgressBasicInfo = {
  registryManagementNumber: string
  registryReceiptDate: string
  progressStatus: string
  assignedWork: string
  workType: string
  progressType: string
  attachmentCnt: number
  repaymentCancellationSubject: string | null
  repaymentCancellationSubjectCnt: number
}

type RegistryProgressLoanInfo = {
  bankName: string
  branchName: string
  registryRequestNumber: string
  managerName: string
  managerPosition: string
  managerPhone: string
  createdAt: string
  managerMessage: string
}

function unwrapData<T>(res: any): T {
  if (res?.data && typeof res.data === 'object' && 'data' in res.data) return res.data.data as T
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return undefined as unknown as T
}

const route = useRoute()
const registryManagementNumber = computed(() => String(route.params.caseId ?? ''))

/**
 * ✅ 아코디언: 개별 토글
 */
type AccKey = 'REQ' | 'APP' | 'ADMIN' | 'PROG'
const openMap = ref<Record<AccKey, boolean>>({
  REQ: true,
  APP: false,
  ADMIN: false,
  PROG: false
})

function toggle(key: AccKey) {
  openMap.value[key] = !openMap.value[key]
}

/** =======================
 * R02B-02: 업무 기본 정보
 * ======================= */
const loading = ref(false)
const errorMessage = ref('')
const detail = ref<RegistryProgressBasicInfo | null>(null)

async function fetchBasicInfo(rmn: string) {
  if (!rmn) {
    detail.value = null
    errorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    const res: any = await registryProgressAPI.basicInfo({ registryManagementNumber: rmn } as any)
    const data = unwrapData<RegistryProgressBasicInfo>(res)

    detail.value = data ?? null
    if (!detail.value) errorMessage.value = '상세 정보를 불러오지 못했습니다.'
  } catch (e: any) {
    detail.value = null
    errorMessage.value = e?.message ?? '업무 기본 정보 조회 실패'
  } finally {
    loading.value = false
  }
}

/** =======================
 * R02B-04: 대출 금융기관 정보
 * ======================= */
const loanLoading = ref(false)
const loanErrorMessage = ref('')
const loanInfo = ref<RegistryProgressLoanInfo | null>(null)

async function fetchLoanInfo(rmn: string) {
  if (!rmn) {
    loanInfo.value = null
    loanErrorMessage.value = '등기관리번호가 없습니다.'
    return
  }

  loanLoading.value = true
  loanErrorMessage.value = ''
  try {
    const res: any = await registryProgressAPI.loanInfo({ registryManagementNumber: rmn } as any)
    const data = unwrapData<RegistryProgressLoanInfo>(res)

    loanInfo.value = data ?? null
    if (!loanInfo.value) loanErrorMessage.value = '대출 금융기관 정보를 불러오지 못했습니다.'
  } catch (e: any) {
    loanInfo.value = null
    loanErrorMessage.value = e?.message ?? '대출 금융기관 정보 조회 실패'
  } finally {
    loanLoading.value = false
  }
}

/** 최초 진입 */
onMounted(() => {
  const rmn = registryManagementNumber.value
  fetchBasicInfo(rmn)
  fetchLoanInfo(rmn)
})

/** 같은 컴포넌트 재사용 + param만 변경되는 케이스 대비 */
watch(
  () => registryManagementNumber.value,
  (rmn, prev) => {
    if (rmn && rmn !== prev) {
      fetchBasicInfo(rmn)
      fetchLoanInfo(rmn)
    }
  }
)
</script>

<style scoped lang="scss">
.detail-layout {
  display: grid;
  grid-template-columns: 200px 1fr; /* ✅ 좌측 200px 비워둠 */
  gap: 12px;
  align-items: start;
  background-color: #fff;
}

.sidebar {
  min-height: 1px; /* 완전 빈 영역이어도 레이아웃 유지 */
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-header {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
}

.page-title {
  font-size: 18px;
  margin: 0;
}

.page-sub {
  margin-top: 6px;
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  opacity: 0.7;
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.acc-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.acc-header {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  background: #fff;
  cursor: pointer;
}

.acc-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.acc-icon {
  transition: transform 0.15s ease;
  color: #6b7280;
}
.acc-icon.open {
  transform: rotate(180deg);
}

.acc-body {
  border-top: 1px solid #f3f4f6;
  padding: 12px;
}

.sub-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-item {
  padding: 10px 12px;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  background: #fafafa;
  font-size: 13px;
  color: #111827;
}

.sub-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #111827;
}

.case-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.muted {
  color: #6b7280;
  text-align: center;
  padding: 10px 0;
}

.error {
  padding: 12px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  font-size: 13px;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
}

.row {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

.label {
  width: 140px;
  font-size: 12px;
  color: #6b7280;
}

.value {
  font-size: 13px;
  color: #111827;
}

.placeholder {
  padding: 10px 0;
}
</style>
