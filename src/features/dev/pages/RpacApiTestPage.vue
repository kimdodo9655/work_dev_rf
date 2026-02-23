<template>
  <section :class="['rpac-page', { embedded }]">
    <header v-if="!embedded" class="page-header card">
      <div>
        <h1>[RPAC] API 테스트 페이지</h1>
        <p>RPAC-01 ~ RPAC-13 전체 호출 + 호출에 필요한 참조 데이터 조회</p>
      </div>
      <div class="auth-actions">
        <button v-if="!authStore.isLoggedIn" type="button" @click="openLoginModal">로그인</button>
        <template v-else>
          <button type="button" @click="refreshToken">토큰 갱신</button>
          <button type="button" class="danger" @click="handleLogout">로그아웃</button>
        </template>
      </div>
    </header>

    <section v-if="!embedded && authStore.isLoggedIn" class="auth-info-section card">
      <div class="auth-info">
        <div class="auth-info-item">
          <span class="auth-info-label">Login:</span>
          <span class="auth-info-value">{{ storageData.loginId || '-' }}</span>
        </div>
        <div class="auth-info-item bank-select-item">
          <span class="auth-info-label">Bank:</span>
          <div class="bank-row">
            <select v-model="selectedBankCode" @change="onChangeBankCode" class="bank-select">
              <option v-if="assignedBanks.length === 0" value="bankclear">bankclear</option>
              <option v-for="bank in assignedBanks" :key="bank.bankCode" :value="bank.bankCode">
                {{ bank.bankName }}
              </option>
            </select>
            <span class="bank-debug">({{ assignedBanks.length }})</span>
          </div>
        </div>
        <div class="auth-info-item">
          <span class="auth-info-label">Token:</span>
          <span class="auth-info-value timer-red">{{ authStore.formattedTime }}</span>
        </div>
        <template v-if="currentUserInfo">
          <div class="auth-info-item">
            <span class="auth-info-label">기관ID:</span>
            <span class="auth-info-value">{{ currentUserInfo.기관ID }}</span>
          </div>
          <div class="auth-info-item">
            <span class="auth-info-label">사용자ID:</span>
            <span class="auth-info-value">{{ currentUserInfo.사용자ID }}</span>
          </div>
          <div class="auth-info-item">
            <span class="auth-info-label">권한값:</span>
            <span class="auth-info-value">{{ currentUserInfo.권한값 }}</span>
          </div>
          <div class="auth-info-item">
            <span class="auth-info-label">권한명:</span>
            <span class="auth-info-value">{{ currentUserInfo.권한명 }}</span>
          </div>
          <div class="auth-info-item">
            <span class="auth-info-label">기관명:</span>
            <span class="auth-info-value">{{ currentUserInfo.기관명 }}</span>
          </div>
          <div class="auth-info-item">
            <span class="auth-info-label">지점ID:</span>
            <span class="auth-info-value">{{ currentUserInfo.지점ID }}</span>
          </div>
          <div class="auth-info-item">
            <span class="auth-info-label">지점명:</span>
            <span class="auth-info-value">{{ currentUserInfo.지점명 }}</span>
          </div>
        </template>
      </div>

      <button class="user-list-btn" @click="toggleUserListDropdown">
        👥 회원정보 {{ showUserListDropdown ? '▲' : '▼' }}
      </button>

      <div v-if="showUserListDropdown" class="user-list-dropdown">
        <div class="user-list-header">
          <h3>전체 회원정보 ({{ LOGIN_USERS.length }}명)</h3>
        </div>
        <div class="user-list-content">
          <div v-for="group in groupedAndSortedUsers" :key="group.기관명" class="user-optgroup">
            <div class="user-optgroup-label">{{ group.기관명 }}</div>
            <div v-for="user in group.users" :key="user.사용자ID" class="user-list-item-compact">
              {{ user.이름 }}({{ user.사용자ID }}), {{ user.권한명 }}, {{ user.기관명 }}({{
                user.기관ID
              }}), {{ user.지점명 }}({{ user.지점ID }}), {{ user.로그인아이디 }}, 이메일인증:
              {{ user.이메일인증 }}, 상태:
              <span
                :class="{
                  'status-active': user.상태 === '사용',
                  'status-pending': user.상태 === '승인대기',
                  'status-temp': user.상태 === '임시승인'
                }"
              >
                {{ user.상태 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="reference-section card">
      <div class="reference-header">
        <h2>필요 데이터 조회</h2>
        <button
          type="button"
          class="secondary mini-btn"
          @click="isReferenceCollapsed = !isReferenceCollapsed"
        >
          {{ isReferenceCollapsed ? '펼치기' : '접기' }}
        </button>
      </div>
      <div class="reference-actions">
        <button type="button" :disabled="referenceLoading.all" @click="loadAllReferenceData">
          {{ referenceLoading.all ? '조회 중...' : '연관 데이터 일괄 조회' }}
        </button>
      </div>

      <div v-if="!isReferenceCollapsed" class="basic-info-form">
        <label>
          <span>기본정보 조회용 registryManagementNumber</span>
          <input
            v-model.trim="selectedRegistryManagementNumber"
            type="text"
            placeholder="예: RM2026020603242"
          />
        </label>
      </div>

      <div v-if="!isReferenceCollapsed" class="reference-grid">
        <article class="reference-card">
          <h3>진행현황 목록 ({{ registryRows.length }})</h3>
          <pre>{{ stringify(registryRows.slice(0, 20)) }}</pre>
        </article>
        <article class="reference-card">
          <h3>업무담당자 목록 ({{ assignableUsers.length }})</h3>
          <pre>{{ stringify(assignableUsers) }}</pre>
        </article>
        <article class="reference-card">
          <h3>기본정보 응답</h3>
          <pre>{{ stringify(basicInfo) }}</pre>
        </article>
        <article class="reference-card">
          <h3>추가 참조 데이터</h3>
          <pre>{{ stringify(referenceDetails) }}</pre>
        </article>
      </div>

      <article class="reference-card token-card">
        <h3>수집된 TaskToken ({{ taskTokens.length }})</h3>
        <pre>{{ stringify(taskTokens) }}</pre>
      </article>
    </section>

    <section class="content">
      <aside class="sidebar card">
        <div class="endpoint-list">
          <div
            v-for="ep in endpointConfigs"
            :key="ep.id"
            class="endpoint"
            :class="[ep.method.toLowerCase(), { active: selectedEndpointId === ep.id }]"
            @click="selectedEndpointId = ep.id"
          >
            <span class="endpoint-method">{{ ep.method }}</span>
            <div class="endpoint-info">
              <p class="endpoint-summary">{{ ep.title }}</p>
            </div>
          </div>
        </div>
      </aside>

      <article
        v-if="selectedEndpoint && selectedEndpoint.id === 'RPA-HTTP'"
        class="endpoint-card card"
      >
        <header class="endpoint-header">
          <h3>[RPA-HTTP] 로컬 서버 테스트</h3>
          <code>LOCAL {{ rpaHttpServerUrl }}</code>
        </header>

        <div class="required-values">
          <h4>서버 설정</h4>
          <div class="input-block">
            <label>서버 URL</label>
            <input
              v-model.trim="rpaHttpServerUrl"
              type="text"
              placeholder="http://127.0.0.1:29541"
            />
          </div>
          <div class="input-block">
            <label class="check-label">
              <input v-model="useRpaHttpMock" type="checkbox" />
              iOS/로컬 미실행 환경용 Mock 모드
            </label>
            <small v-if="useRpaHttpMock"> 로컬 EXE 없이 샘플 응답으로 테스트합니다. </small>
          </div>
        </div>

        <div class="input-grid">
          <div class="input-block">
            <label>1) GET 요청</label>
            <button type="button" :disabled="rpaHttpLoading.get" @click="rpaHttpTestGet">
              {{ rpaHttpLoading.get ? '요청 중...' : 'GET 요청 보내기' }}
            </button>
          </div>
          <div class="input-block">
            <label>3) MAC 주소 조회</label>
            <button type="button" :disabled="rpaHttpLoading.mac" @click="rpaHttpGetMacAddress">
              {{ rpaHttpLoading.mac ? '요청 중...' : 'MAC 주소 조회' }}
            </button>
          </div>
          <div class="input-block">
            <label>4) 데이터 조회</label>
            <button type="button" :disabled="rpaHttpLoading.data" @click="rpaHttpGetData">
              {{ rpaHttpLoading.data ? '요청 중...' : '샘플 데이터 조회' }}
            </button>
          </div>
          <div class="input-block">
            <label>5) RPA 실행</label>
            <div class="rpa-inline-actions">
              <button type="button" :disabled="rpaHttpLoading.execute" @click="rpaHttpExecute">
                {{ rpaHttpLoading.execute ? '실행 중...' : 'RPA 실행(자동 상태확인)' }}
              </button>
              <button type="button" class="danger" @click="rpaHttpStopPolling">
                상태 확인 중지
              </button>
            </div>
          </div>
        </div>

        <div class="body-block">
          <label>2) POST 요청 Body (JSON)</label>
          <textarea v-model="rpaHttpPostData" rows="8"></textarea>
          <button type="button" :disabled="rpaHttpLoading.post" @click="rpaHttpTestPost">
            {{ rpaHttpLoading.post ? '요청 중...' : 'POST 요청 보내기' }}
          </button>
        </div>

        <div class="response-block response">
          <div class="response-header">
            <div class="response-title">
              <h4>RPA HTTP 응답</h4>
            </div>
            <div class="response-actions">
              <button type="button" class="secondary mini-btn" @click="copyRpaHttpAllResult">
                전체 복사
              </button>
            </div>
          </div>
          <pre class="response-body">{{ stringify(rpaHttpResult) }}</pre>
        </div>
      </article>

      <article v-else-if="selectedEndpoint" class="endpoint-card card">
        <header class="endpoint-header">
          <h3>{{ selectedEndpoint.title }}</h3>
          <code>{{ selectedEndpoint.method }} {{ selectedEndpoint.path }}</code>
        </header>

        <div class="required-values">
          <h4>필요값 후보 목록</h4>
          <ul>
            <li v-for="field in selectedEndpoint.requiredFields" :key="field">
              <strong>{{ field }}</strong>
              <span>{{ candidateMap[field]?.join(', ') || '-' }}</span>
            </li>
          </ul>
          <button type="button" class="secondary" @click="applyAutoFill(selectedEndpoint.id)">
            후보값 자동 채우기
          </button>
        </div>

        <div class="input-grid">
          <div
            v-for="paramName in selectedEndpoint.pathParams"
            :key="`${selectedEndpoint.id}-${paramName}`"
            class="input-block"
          >
            <label>{{ paramName }}</label>
            <input
              :value="getPathInput(selectedEndpoint.id, paramName)"
              type="text"
              :placeholder="`${paramName} 입력`"
              @input="setPathInput(selectedEndpoint.id, paramName, $event)"
            />
          </div>
        </div>

        <div v-if="selectedEndpoint.hasBody" class="body-block">
          <label>Request Body (JSON)</label>
          <textarea v-model="bodyByEndpoint[selectedEndpoint.id]" rows="10"></textarea>
        </div>

        <div class="endpoint-actions">
          <button
            type="button"
            :disabled="isLoading[selectedEndpoint.id]"
            @click="callEndpoint(selectedEndpoint.id)"
          >
            {{ isLoading[selectedEndpoint.id] ? '호출 중...' : '호출' }}
          </button>
        </div>

        <div class="response-block response">
          <div class="response-header">
            <div class="response-title">
              <h4>응답</h4>
            </div>
            <div class="response-actions">
              <button
                type="button"
                class="secondary mini-btn"
                @click="copyAllRequestInfo(selectedEndpoint.id)"
              >
                전체 복사
              </button>
              <button
                type="button"
                class="secondary mini-btn"
                @click="copyResponseOnly(selectedEndpoint.id)"
              >
                응답 복사
              </button>
            </div>
          </div>
          <pre class="response-body">{{ stringify(responseByEndpoint[selectedEndpoint.id]) }}</pre>
        </div>

        <div v-if="rpaAutoStatus" class="response-block response">
          <div class="response-header">
            <div class="response-title">
              <h4>자동 RPA 실행 상태</h4>
            </div>
            <div class="rpa-auto-meta">
              <span class="poll-badge" :class="{ active: rpaAutoPollingActive }">
                {{ rpaAutoPollingActive ? '폴링중' : '대기/종료' }}
              </span>
              <span class="poll-count" v-if="rpaAutoNextPollIn !== null">
                다음 조회까지 <strong>{{ rpaAutoNextPollIn }}</strong
                >초
              </span>
              <span class="poll-count">주기 {{ RPA_AUTO_POLL_INTERVAL_SEC }}초</span>
              <span class="poll-count" v-if="rpaAutoLastUpdatedAt"
                >마지막 응답 {{ rpaAutoLastUpdatedAt }}</span
              >
            </div>
          </div>
          <pre class="response-body">{{ stringify(rpaAutoStatus) }}</pre>
        </div>
      </article>
    </section>

    <div v-if="!embedded && showLoginModal" class="modal-backdrop" @click="showLoginModal = false">
      <div class="login-modal" @click.stop>
        <div class="modal-header">
          <h3>🔑 로그인</h3>
          <button type="button" class="secondary" @click="showLoginModal = false">✕</button>
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
                    {{ user.로그인아이디 }} | ID: {{ user.사용자ID }} | {{ user.이름 }} |
                    {{ user.권한명 }} | {{ user.지점명 }} | 상태: {{ user.상태 }}
                  </option>
                </optgroup>
              </select>
            </div>

            <div v-if="selectedLoginUser" class="user-detail">
              <div class="detail-row">
                <span class="detail-label">기관ID:</span
                ><span class="detail-value">{{ selectedLoginUser.기관ID }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">사용자ID:</span
                ><span class="detail-value">{{ selectedLoginUser.사용자ID }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">권한값:</span
                ><span class="detail-value">{{ selectedLoginUser.권한값 }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">권한명:</span
                ><span class="detail-value">{{ selectedLoginUser.권한명 }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">기관명:</span
                ><span class="detail-value">{{ selectedLoginUser.기관명 }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">지점ID:</span
                ><span class="detail-value">{{ selectedLoginUser.지점ID }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">지점명:</span
                ><span class="detail-value">{{ selectedLoginUser.지점명 }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">이메일인증:</span
                ><span class="detail-value">{{ selectedLoginUser.이메일인증 }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">상태:</span
                ><span class="detail-value">{{ selectedLoginUser.상태 }}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">로그인 아이디 *</label>
              <input
                v-model.trim="loginId"
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
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

import { api } from '@/api/client'
import { authAPI } from '@/api/services/auth'
import { branchPrepaidAPI } from '@/api/services/branch_prepaid'
import {
  registryAdminConsentAPI,
  registryCaseAPI,
  registryCertificateAPI,
  registryCompletionAPI,
  registryHousingBondAPI,
  registryProgressAPI,
  registryPropertyAPI,
  registryTransferCertificateAPI
} from '@/api/services/registry'
import { userAPI } from '@/api/services/user'
import { DEV_LOGIN_USERS } from '@/features/dev/constants/devLoginUsers'
import { useAuthStore } from '@/stores/auth'
import { storage } from '@/utils/storage'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'HTTP'

type EndpointConfig = {
  id: string
  title: string
  method: HttpMethod
  path: string
  pathParams: string[]
  hasBody: boolean
  defaultBody: Record<string, any> | null
  requiredFields: string[]
}

type AssignedBank = {
  bankCode: string
  bankName: string
}

type RpaHttpResponse = {
  status?: string
  result?: string
  message?: string
  [key: string]: any
}

interface Props {
  embedded?: boolean
  externalBankCode?: string
}

const props = withDefaults(defineProps<Props>(), {
  embedded: false,
  externalBankCode: ''
})

const LOGIN_USERS = DEV_LOGIN_USERS

const authStore = useAuthStore()
const storageData = ref(storage.get())
const showLoginModal = ref(false)
const selectedLoginUser = ref<(typeof LOGIN_USERS)[number] | null>(null)
const showUserListDropdown = ref(false)
const loginId = ref('')
const password = ref('P@ssw0rd1!')
const assignedBanks = ref<AssignedBank[]>([])
const selectedBankCode = ref('bankclear')
const effectiveBankCode = computed(() => {
  if (props.embedded) {
    return props.externalBankCode || storage.get().bankCode || 'bankclear'
  }
  return selectedBankCode.value
})

const endpointConfigs: EndpointConfig[] = [
  {
    id: 'RPA-HTTP',
    title: '[RPA-HTTP] 로컬 HTTP 서버 테스트',
    method: 'HTTP',
    path: '/(local-rpa-http-server)',
    pathParams: [],
    hasBody: false,
    defaultBody: null,
    requiredFields: []
  },
  {
    id: 'RPAC-01',
    title: '[RPAC-01] 등기사항전부증명서 열람 작업 등록',
    method: 'POST',
    path: '/api/registry/rpa/user-tasks/{registryManagementNumber}/full-certificate-view',
    pathParams: ['registryManagementNumber'],
    hasBody: true,
    defaultBody: { propertyUniqueNumber: '', cardNumber: '' },
    requiredFields: ['registryManagementNumber', 'propertyUniqueNumber', 'cardNumber']
  },
  {
    id: 'RPAC-02',
    title: '[RPAC-02] 부동산의표시 생성 작업 등록',
    method: 'POST',
    path: '/api/registry/rpa/user-tasks/{registryManagementNumber}/property-description',
    pathParams: ['registryManagementNumber'],
    hasBody: true,
    defaultBody: { propertyUniqueNumber: '' },
    requiredFields: ['registryManagementNumber', 'propertyUniqueNumber']
  },
  {
    id: 'RPAC-03',
    title: '[RPAC-03] 등기필정보 비밀번호 조회 작업 등록',
    method: 'POST',
    path: '/api/registry/rpa/user-tasks/{registryManagementNumber}/registration-password',
    pathParams: ['registryManagementNumber'],
    hasBody: true,
    defaultBody: { propertyUniqueNumber: '', certificateSerialNumber: '' },
    requiredFields: ['registryManagementNumber', 'propertyUniqueNumber', 'certificateSerialNumber']
  },
  {
    id: 'RPAC-04',
    title: '[RPAC-04] 이택스 취득세 작업 등록',
    method: 'POST',
    path: '/api/registry/rpa/user-tasks/{registryManagementNumber}/etax-acquisition',
    pathParams: ['registryManagementNumber'],
    hasBody: true,
    defaultBody: { applicationId: 0 },
    requiredFields: ['registryManagementNumber', 'applicationId']
  },
  {
    id: 'RPAC-05',
    title: '[RPAC-05] 이택스 등록면허세 작업 등록',
    method: 'POST',
    path: '/api/registry/rpa/user-tasks/{registryManagementNumber}/etax-registration',
    pathParams: ['registryManagementNumber'],
    hasBody: true,
    defaultBody: { applicationId: 0 },
    requiredFields: ['registryManagementNumber', 'applicationId']
  },
  {
    id: 'RPAC-06',
    title: '[RPAC-06] 위택스 취득세 작업 등록',
    method: 'POST',
    path: '/api/registry/rpa/user-tasks/{registryManagementNumber}/wetax-acquisition',
    pathParams: ['registryManagementNumber'],
    hasBody: true,
    defaultBody: { applicationId: 0 },
    requiredFields: ['registryManagementNumber', 'applicationId']
  },
  {
    id: 'RPAC-07',
    title: '[RPAC-07] 위택스 등록면허세 작업 등록',
    method: 'POST',
    path: '/api/registry/rpa/user-tasks/{registryManagementNumber}/wetax-registration',
    pathParams: ['registryManagementNumber'],
    hasBody: true,
    defaultBody: { applicationId: 0 },
    requiredFields: ['registryManagementNumber', 'applicationId']
  },
  {
    id: 'RPAC-08',
    title: '[RPAC-08] 등기 신청사건 조회 작업 등록',
    method: 'POST',
    path: '/api/registry/rpa/user-tasks/{registryManagementNumber}/registration-case',
    pathParams: ['registryManagementNumber'],
    hasBody: true,
    defaultBody: { propertyUniqueNumber: '', progressPartyId: 0 },
    requiredFields: ['registryManagementNumber', 'propertyUniqueNumber', 'progressPartyId']
  },
  {
    id: 'RPAC-09',
    title: '[RPAC-09] 행정정보 동의요청 작업 등록',
    method: 'POST',
    path: '/api/registry/rpa/user-tasks/{registryManagementNumber}/admin-consent',
    pathParams: ['registryManagementNumber'],
    hasBody: true,
    defaultBody: { applicationId: 0 },
    requiredFields: ['registryManagementNumber', 'applicationId']
  },
  {
    id: 'RPAC-10',
    title: '[RPAC-10] 등기신청서 작성 작업 등록',
    method: 'POST',
    path: '/api/registry/rpa/user-tasks/{registryManagementNumber}/registration-application',
    pathParams: ['registryManagementNumber'],
    hasBody: true,
    defaultBody: { applicationId: 0, propertyId: 0 },
    requiredFields: ['registryManagementNumber', 'applicationId', 'propertyId']
  },
  {
    id: 'RPAC-11',
    title: '[RPAC-11] RPA 작업 조회',
    method: 'GET',
    path: '/api/registry/rpa/user-tasks/{taskToken}',
    pathParams: ['taskToken'],
    hasBody: false,
    defaultBody: null,
    requiredFields: ['taskToken']
  },
  {
    id: 'RPAC-12',
    title: '[RPAC-12] RPA 작업 결과 전달',
    method: 'PATCH',
    path: '/api/registry/rpa/user-tasks/{taskToken}/result',
    pathParams: ['taskToken'],
    hasBody: true,
    defaultBody: { taskStatus: 'SUCCESS', resultData: {} },
    requiredFields: ['taskToken', 'taskStatus']
  },
  {
    id: 'RPAC-13',
    title: '[RPAC-13] 등기사항전부증명서 발급 작업 등록',
    method: 'POST',
    path: '/api/registry/rpa/user-tasks/{registryManagementNumber}/full-certificate-issue',
    pathParams: ['registryManagementNumber'],
    hasBody: true,
    defaultBody: { propertyUniqueNumber: '', cardNumber: '' },
    requiredFields: ['registryManagementNumber', 'propertyUniqueNumber', 'cardNumber']
  }
]

const selectedEndpointId = ref(endpointConfigs[0]?.id ?? '')
const selectedEndpoint = computed(
  () => endpointConfigs.find((ep) => ep.id === selectedEndpointId.value) ?? endpointConfigs[0]
)

const pathInputByEndpoint = reactive<Record<string, Record<string, string>>>({})
const bodyByEndpoint = reactive<Record<string, string>>({})
const responseByEndpoint = reactive<Record<string, any>>({})
const isLoading = reactive<Record<string, boolean>>({})

for (const ep of endpointConfigs) {
  const pathState: Record<string, string> = {}
  pathInputByEndpoint[ep.id] = pathState
  for (const pathParam of ep.pathParams) {
    pathState[pathParam] = ''
  }
  bodyByEndpoint[ep.id] = ep.defaultBody ? JSON.stringify(ep.defaultBody, null, 2) : ''
  responseByEndpoint[ep.id] = null
  isLoading[ep.id] = false
}

const registryRows = ref<any[]>([])
const assignableUsers = ref<any[]>([])
const basicInfo = ref<any>(null)
const referenceDetails = ref<Record<string, any>>({})
const taskTokens = ref<string[]>([])
const selectedRegistryManagementNumber = ref('')

const referenceLoading = reactive({
  all: false,
  registryList: false,
  assignable: false,
  basicInfo: false,
  detailBundle: false
})
const isReferenceCollapsed = ref(true)

const rpaHttpServerUrl = ref('http://127.0.0.1:29541')
const rpaHttpPostData = ref(`{
  "action": "saveData",
  "userId": 1,
  "value": "테스트 데이터"
}`)
const rpaHttpResult = ref<Record<string, any>>({})
const rpaHttpLoading = reactive({
  get: false,
  post: false,
  mac: false,
  data: false,
  execute: false,
  status: false
})
let rpaHttpPollingInterval: ReturnType<typeof setInterval> | null = null
let rpaHttpPollingCount = 0
const isLikelyIosClient =
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
const useRpaHttpMock = ref(isLikelyIosClient)
let rpaHttpMockStatusCount = 0

const rpaAutoStatus = ref<Record<string, any> | null>(null)
let rpaAutoPollingInterval: ReturnType<typeof setInterval> | null = null
let rpaAutoPollingCount = 0
let rpaAutoCountdownInterval: ReturnType<typeof setInterval> | null = null
const RPA_AUTO_POLL_INTERVAL_SEC = 5
const rpaAutoNextPollIn = ref<number | null>(null)
const rpaAutoLastUpdatedAt = ref('')
const rpaAutoPollingActive = ref(false)

const RPAC_TASK_TYPE_MAP: Record<string, string> = {
  'RPAC-01': 'FULL_CERTIFICATE_VIEW',
  'RPAC-02': 'PROPERTY_DESCRIPTION',
  'RPAC-03': 'QUERY_REGISTRATION_PASSWORD',
  'RPAC-04': 'ETAX_ACQUISITION',
  'RPAC-05': 'ETAX_REGISTRATION',
  'RPAC-06': 'WETAX_ACQUISITION',
  'RPAC-07': 'WETAX_REGISTRATION',
  'RPAC-08': 'QUERY_REGISTRATION_CASE',
  'RPAC-09': 'ADMIN_CONSENT',
  'RPAC-10': 'REGISTRATION_APPLICATION',
  'RPAC-11': 'QUERY_TASK_STATUS',
  'RPAC-12': 'SUBMIT_TASK_RESULT',
  'RPAC-13': 'FULL_CERTIFICATE_ISSUE'
}

const groupedLoginUsers = computed(() => {
  const groups = new Map<string, Array<(typeof LOGIN_USERS)[number]>>()
  LOGIN_USERS.forEach((user) => {
    const key = user.기관명
    const existing = groups.get(key)
    if (existing) {
      existing.push(user)
    } else {
      groups.set(key, [user])
    }
  })

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

const groupedAndSortedUsers = computed(() => {
  const groups = new Map<string, Array<(typeof LOGIN_USERS)[number]>>()
  LOGIN_USERS.forEach((user) => {
    const key = user.기관명
    const existing = groups.get(key)
    if (existing) {
      existing.push(user)
    } else {
      groups.set(key, [user])
    }
  })

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
      users: users.sort((a, b) => Number(b.권한값) - Number(a.권한값))
    }))
})

const currentUserInfo = computed(() => {
  const currentLoginId = storageData.value.loginId
  if (!currentLoginId) return null
  return LOGIN_USERS.find((user) => user.로그인아이디 === currentLoginId) || null
})

function refreshStorageData() {
  storageData.value = storage.get()
}

function openLoginModal() {
  selectedLoginUser.value = null
  loginId.value = ''
  password.value = 'P@ssw0rd1!'
  showLoginModal.value = true
}

async function executeLogin() {
  try {
    const res: any = await authAPI.login({
      loginId: loginId.value,
      password: password.value
    } as any)
    const payload = unwrap<any>(res)
    const data = payload?.result ?? payload
    authStore.setAuth(data)

    // API Tester와 동일하게 로그인 직후 기본 bankCode 부여
    selectedBankCode.value = 'bankclear'
    authStore.setBankCode('bankclear')
    localStorage.setItem('bank_code', 'bankclear')

    await fetchAssignedBanks()
    refreshStorageData()
    showLoginModal.value = false
  } catch (error: any) {
    alert(error?.message ?? '로그인 실패')
  }
}

async function refreshToken() {
  try {
    const current = storage.get()
    if (!current.refreshToken) {
      alert('refreshToken이 없습니다.')
      return
    }
    const res: any = await authAPI.refresh({ refreshToken: current.refreshToken } as any)
    const payload = unwrap<any>(res)
    const data = payload?.result ?? payload
    authStore.updateTokens(data)
    refreshStorageData()
  } catch (error: any) {
    alert(error?.message ?? '토큰 갱신 실패')
  }
}

async function handleLogout() {
  try {
    await authAPI.logout()
  } catch {
    // 로그아웃 API 실패여도 로컬 상태는 정리
  } finally {
    authStore.clearAuth()
    assignedBanks.value = []
    selectedBankCode.value = 'bankclear'
    localStorage.removeItem('bank_code')
    refreshStorageData()
  }
}

async function fetchAssignedBanks() {
  try {
    const res: any = await api.get('/api/users/assigned-banks', {
      headers: {
        'X-Bank-Code': selectedBankCode.value
      }
    })
    const payload = unwrap<any>(res)
    const data = payload?.result ?? payload
    const banks = Array.isArray(data) ? data : []
    assignedBanks.value = banks
    if (banks.length > 0) {
      const bankclearBank = banks.find((bank) => bank.bankCode === 'bankclear')
      selectedBankCode.value = bankclearBank ? 'bankclear' : banks[0]!.bankCode
      authStore.setBankCode(selectedBankCode.value)
      localStorage.setItem('bank_code', selectedBankCode.value)
    }
  } catch {
    assignedBanks.value = []
    selectedBankCode.value = 'bankclear'
    authStore.setBankCode('bankclear')
    localStorage.setItem('bank_code', 'bankclear')
  }
}

function onChangeBankCode() {
  authStore.setBankCode(selectedBankCode.value)
  localStorage.setItem('bank_code', selectedBankCode.value)
  refreshStorageData()
}

function toggleUserListDropdown() {
  showUserListDropdown.value = !showUserListDropdown.value
}

function toApiDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function unwrap<T>(res: any): T | undefined {
  if (!res) return undefined
  if (typeof res === 'object' && 'data' in res) {
    const data = (res as any).data
    if (data && typeof data === 'object' && 'data' in data) return (data as any).data as T
    return data as T
  }
  return res as T
}

function stringify(value: any): string {
  return JSON.stringify(value, null, 2) ?? 'null'
}

function copyToClipboard(text: string) {
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.width = '2em'
    textarea.style.height = '2em'
    textarea.style.padding = '0'
    textarea.style.border = 'none'
    textarea.style.outline = 'none'
    textarea.style.boxShadow = 'none'
    textarea.style.background = 'transparent'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)

    if (success) {
      alert('복사되었습니다.')
    } else {
      alert('복사에 실패했습니다.')
    }
  } catch {
    alert('복사에 실패했습니다.')
  }
}

function buildEndpointUrl(endpointId: string): string {
  const ep = endpointConfigs.find((item) => item.id === endpointId)
  if (!ep) return ''
  let url = ep.path
  const pathState = pathInputByEndpoint[endpointId] ?? {}
  for (const pathParam of ep.pathParams) {
    const value = pathState[pathParam] ?? ''
    url = url.replace(`{${pathParam}}`, value || `:${pathParam}`)
  }
  return url
}

function copyResponseOnly(endpointId: string) {
  copyToClipboard(stringify(responseByEndpoint[endpointId]))
}

function copyAllRequestInfo(endpointId: string) {
  const ep = endpointConfigs.find((item) => item.id === endpointId)
  if (!ep) return

  const info: string[] = []
  const url = buildEndpointUrl(endpointId)
  const accessToken = storage.getAccessToken()

  info.push('═══════════════════════════════════════')
  info.push('📡 RPAC 요청/응답 정보')
  info.push('═══════════════════════════════════════')
  info.push('')
  info.push(`🔹 API: ${ep.title}`)
  info.push(`🔹 코드: ${ep.id}`)
  info.push(`🔹 메서드: ${ep.method}`)
  info.push(`🔹 URL: ${url}`)
  info.push('')

  info.push('───────────────────────────────────────')
  info.push('🧾 Headers')
  info.push('───────────────────────────────────────')
  info.push(`X-Bank-Code: ${effectiveBankCode.value}`)
  if (accessToken) {
    info.push(`Authorization: Bearer ${accessToken}`)
  }
  info.push('')

  if (ep.pathParams.length > 0) {
    info.push('───────────────────────────────────────')
    info.push('📍 Path Parameters')
    info.push('───────────────────────────────────────')
    for (const param of ep.pathParams) {
      info.push(`${param}: ${getPathInput(endpointId, param)}`)
    }
    info.push('')
  }

  if (ep.hasBody) {
    info.push('───────────────────────────────────────')
    info.push('📦 Request Body')
    info.push('───────────────────────────────────────')
    info.push(bodyByEndpoint[endpointId] || '{}')
    info.push('')
  }

  info.push('───────────────────────────────────────')
  info.push('✅ Response')
  info.push('───────────────────────────────────────')
  info.push(stringify(responseByEndpoint[endpointId]))
  info.push('')
  info.push('═══════════════════════════════════════')

  copyToClipboard(info.join('\n'))
}

function setRpaHttpResult(key: string, data: any, isError = false) {
  rpaHttpResult.value = {
    ...rpaHttpResult.value,
    [key]: {
      isError,
      data
    }
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getRpaHttpBaseUrl() {
  const raw = rpaHttpServerUrl.value.trim()
  if (!raw) return 'http://127.0.0.1:29541'
  if (raw.startsWith(':')) return `http://127.0.0.1${raw}`
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, '')
  return `http://${raw}`.replace(/\/+$/, '')
}

async function rpaHttpTestGet() {
  rpaHttpLoading.get = true
  try {
    if (useRpaHttpMock.value) {
      await wait(120)
      setRpaHttpResult('get', {
        status: 200,
        statusText: 'OK',
        response: {
          status: 'success',
          message: 'Mock RPA HTTP 서버 연결 성공',
          mock: true
        }
      })
      return
    }

    const response = await fetch(`${getRpaHttpBaseUrl()}/`, { method: 'GET' })
    const data = await response.json()
    setRpaHttpResult('get', {
      status: response.status,
      statusText: response.statusText,
      response: data
    })
  } catch (error: any) {
    setRpaHttpResult(
      'get',
      { error: error?.message ?? '요청 실패', tip: 'RPA 프로그램이 실행 중인지 확인하세요.' },
      true
    )
  } finally {
    rpaHttpLoading.get = false
  }
}

async function rpaHttpTestPost() {
  rpaHttpLoading.post = true
  try {
    const parsed = JSON.parse(rpaHttpPostData.value)
    if (useRpaHttpMock.value) {
      await wait(120)
      setRpaHttpResult('post', {
        status: 200,
        statusText: 'OK',
        sent: parsed,
        response: {
          status: 'success',
          message: 'Mock 데이터 저장 완료',
          mock: true,
          savedAt: new Date().toISOString()
        }
      })
      return
    }

    const response = await fetch(`${getRpaHttpBaseUrl()}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed)
    })
    const data = await response.json()
    setRpaHttpResult('post', {
      status: response.status,
      statusText: response.statusText,
      sent: parsed,
      response: data
    })
  } catch (error: any) {
    setRpaHttpResult(
      'post',
      { error: error?.message ?? '요청 실패', tip: 'JSON 형식 또는 RPA 서버 상태를 확인하세요.' },
      true
    )
  } finally {
    rpaHttpLoading.post = false
  }
}

async function rpaHttpGetMacAddress() {
  rpaHttpLoading.mac = true
  try {
    if (useRpaHttpMock.value) {
      await wait(120)
      setRpaHttpResult('mac', {
        status: 200,
        statusText: 'OK',
        response: {
          status: 'success',
          macAddress: 'AA:BB:CC:DD:EE:FF',
          mock: true
        }
      })
      return
    }

    const response = await fetch(`${getRpaHttpBaseUrl()}/macaddress`)
    const data = await response.json()
    setRpaHttpResult('mac', {
      status: response.status,
      statusText: response.statusText,
      response: data
    })
  } catch (error: any) {
    setRpaHttpResult(
      'mac',
      { error: error?.message ?? '요청 실패', tip: 'RPA 프로그램이 실행 중인지 확인하세요.' },
      true
    )
  } finally {
    rpaHttpLoading.mac = false
  }
}

async function rpaHttpGetData() {
  rpaHttpLoading.data = true
  try {
    if (useRpaHttpMock.value) {
      await wait(120)
      setRpaHttpResult('data', {
        status: 200,
        statusText: 'OK',
        response: {
          status: 'success',
          items: [
            { id: 1, name: 'mock-item-1' },
            { id: 2, name: 'mock-item-2' }
          ],
          mock: true
        }
      })
      return
    }

    const response = await fetch(`${getRpaHttpBaseUrl()}/data`)
    const data = await response.json()
    setRpaHttpResult('data', {
      status: response.status,
      statusText: response.statusText,
      response: data
    })
  } catch (error: any) {
    setRpaHttpResult(
      'data',
      { error: error?.message ?? '요청 실패', tip: 'RPA 프로그램이 실행 중인지 확인하세요.' },
      true
    )
  } finally {
    rpaHttpLoading.data = false
  }
}

async function rpaHttpExecute() {
  rpaHttpLoading.execute = true
  try {
    if (useRpaHttpMock.value) {
      await wait(150)
      rpaHttpMockStatusCount = 0
      const data: RpaHttpResponse = {
        status: 'success',
        result: 'N',
        message: 'Mock RPA 실행 시작',
        mock: true
      }
      setRpaHttpResult(
        'execute',
        {
          status: 200,
          statusText: 'OK',
          response: data
        },
        false
      )
      rpaHttpStartPolling()
      return
    }

    const response = await fetch(`${getRpaHttpBaseUrl()}/execute`)
    const data: RpaHttpResponse = await response.json()
    setRpaHttpResult(
      'execute',
      {
        status: response.status,
        statusText: response.statusText,
        response: data
      },
      data.status === 'error'
    )

    if (data.status === 'success') {
      rpaHttpStartPolling()
    }
  } catch (error: any) {
    setRpaHttpResult(
      'execute',
      { error: error?.message ?? '요청 실패', tip: 'RPA 프로그램이 실행 중인지 확인하세요.' },
      true
    )
  } finally {
    rpaHttpLoading.execute = false
  }
}

function rpaHttpStartPolling() {
  rpaHttpStopPolling()
  rpaHttpPollingCount = 0
  void rpaHttpCheckStatus()
  rpaHttpPollingInterval = setInterval(() => {
    void rpaHttpCheckStatus()
  }, 5000)
}

function rpaHttpStopPolling() {
  if (rpaHttpPollingInterval) {
    clearInterval(rpaHttpPollingInterval)
    rpaHttpPollingInterval = null
    setRpaHttpResult('status', { message: '상태 확인이 중지되었습니다.' })
  }
}

async function rpaHttpCheckStatus() {
  rpaHttpLoading.status = true
  rpaHttpPollingCount += 1
  try {
    if (useRpaHttpMock.value) {
      await wait(120)
      rpaHttpMockStatusCount += 1
      const result = rpaHttpMockStatusCount >= 3 ? 'Y' : 'N'
      setRpaHttpResult('status', {
        확인횟수: rpaHttpPollingCount,
        상태: result === 'Y' ? 'success' : 'processing',
        결과값: result,
        메시지: result === 'Y' ? 'Mock 작업 완료' : 'Mock 작업 진행 중',
        statusCode: 200,
        mock: true
      })
      if (result === 'Y') {
        rpaHttpStopPolling()
      }
      return
    }

    const response = await fetch(`${getRpaHttpBaseUrl()}/status`)
    const data: RpaHttpResponse = await response.json()
    setRpaHttpResult('status', {
      확인횟수: rpaHttpPollingCount,
      상태: data.status,
      결과값: data.result || 'N',
      메시지: data.message || '',
      statusCode: response.status
    })
    if (data.result === 'Y') {
      rpaHttpStopPolling()
    }
  } catch (error: any) {
    setRpaHttpResult(
      'status',
      { error: error?.message ?? '요청 실패', 확인횟수: rpaHttpPollingCount },
      true
    )
  } finally {
    rpaHttpLoading.status = false
  }
}

function copyRpaHttpAllResult() {
  const info = [
    '═══════════════════════════════════════',
    '📡 RPA HTTP 서버 테스트 결과',
    '═══════════════════════════════════════',
    `서버 URL: ${getRpaHttpBaseUrl()}`,
    '',
    stringify(rpaHttpResult.value)
  ].join('\n')
  copyToClipboard(info)
}

function stopRpaAutoPolling() {
  if (rpaAutoPollingInterval) {
    clearInterval(rpaAutoPollingInterval)
    rpaAutoPollingInterval = null
  }
  if (rpaAutoCountdownInterval) {
    clearInterval(rpaAutoCountdownInterval)
    rpaAutoCountdownInterval = null
  }
  rpaAutoNextPollIn.value = null
  rpaAutoPollingActive.value = false
}

function startRpaAutoCountdown() {
  if (rpaAutoCountdownInterval) {
    clearInterval(rpaAutoCountdownInterval)
    rpaAutoCountdownInterval = null
  }
  rpaAutoNextPollIn.value = RPA_AUTO_POLL_INTERVAL_SEC
  rpaAutoPollingActive.value = true
  rpaAutoCountdownInterval = setInterval(() => {
    if (rpaAutoNextPollIn.value === null) return
    if (rpaAutoNextPollIn.value <= 1) {
      rpaAutoNextPollIn.value = RPA_AUTO_POLL_INTERVAL_SEC
      return
    }
    rpaAutoNextPollIn.value -= 1
  }, 1000)
}

async function checkRpaAutoStatus() {
  rpaAutoPollingCount += 1
  try {
    if (useRpaHttpMock.value) {
      await wait(120)
      const result = rpaAutoPollingCount >= 3 ? 'Y' : 'N'
      rpaAutoStatus.value = {
        ...(rpaAutoStatus.value ?? {}),
        statusCheck: {
          count: rpaAutoPollingCount,
          statusCode: 200,
          status: result === 'Y' ? 'success' : 'processing',
          result,
          message: result === 'Y' ? 'Mock 자동 실행 완료' : 'Mock 자동 실행 진행 중',
          mock: true
        }
      }
      rpaAutoLastUpdatedAt.value = new Date().toLocaleTimeString()
      if (result === 'Y') {
        stopRpaAutoPolling()
      }
      return
    }

    const response = await fetch(`${getRpaHttpBaseUrl()}/status`)
    const data: RpaHttpResponse = await response.json()
    rpaAutoStatus.value = {
      ...(rpaAutoStatus.value ?? {}),
      statusCheck: {
        count: rpaAutoPollingCount,
        statusCode: response.status,
        status: data.status ?? '',
        result: data.result ?? 'N',
        message: data.message ?? ''
      }
    }
    rpaAutoLastUpdatedAt.value = new Date().toLocaleTimeString()

    if (data.result === 'Y') {
      stopRpaAutoPolling()
    }
  } catch (error: any) {
    rpaAutoStatus.value = {
      ...(rpaAutoStatus.value ?? {}),
      statusCheck: {
        count: rpaAutoPollingCount,
        error: error?.message ?? 'status 조회 실패'
      }
    }
  }
}

async function executeRpaAuto(taskToken: string, endpointId: string) {
  stopRpaAutoPolling()
  rpaAutoPollingCount = 0

  const context = {
    bankCode: effectiveBankCode.value,
    apiBaseUrl: api.defaults.baseURL,
    taskToken,
    taskType: RPAC_TASK_TYPE_MAP[endpointId] ?? endpointId
  }
  const baseUrl = getRpaHttpBaseUrl()
  const executeUrl = `${baseUrl}/execute/${encodeURIComponent(
    context.bankCode
  )}/${encodeURIComponent(context.apiBaseUrl ?? '')}/${encodeURIComponent(
    context.taskToken
  )}/${encodeURIComponent(context.taskType)}`

  rpaAutoStatus.value = {
    executeRequest: {
      ...context,
      executeUrl
    },
    executeResponse: null,
    statusCheck: null
  }

  try {
    if (useRpaHttpMock.value) {
      await wait(150)
      rpaAutoStatus.value = {
        ...(rpaAutoStatus.value ?? {}),
        executeResponse: {
          statusCode: 200,
          status: 'success',
          result: 'N',
          message: 'Mock 자동 execute 시작',
          raw: {
            status: 'success',
            result: 'N',
            mock: true
          }
        }
      }
      rpaAutoLastUpdatedAt.value = new Date().toLocaleTimeString()

      rpaAutoPollingInterval = setInterval(() => {
        void checkRpaAutoStatus()
      }, RPA_AUTO_POLL_INTERVAL_SEC * 1000)
      startRpaAutoCountdown()
      await checkRpaAutoStatus()
      return
    }

    // execute 뒤 파라미터를 붙여 호출. 구버전 서버는 /execute만 지원하므로 fallback 시도.
    let response = await fetch(executeUrl)
    if (!response.ok && (response.status === 404 || response.status === 405)) {
      response = await fetch(`${baseUrl}/execute`)
    }
    const data: RpaHttpResponse = await response.json()
    rpaAutoStatus.value = {
      ...(rpaAutoStatus.value ?? {}),
      executeResponse: {
        statusCode: response.status,
        status: data.status ?? '',
        result: data.result ?? 'N',
        message: data.message ?? '',
        raw: data
      }
    }
    rpaAutoLastUpdatedAt.value = new Date().toLocaleTimeString()

    rpaAutoPollingInterval = setInterval(() => {
      void checkRpaAutoStatus()
    }, RPA_AUTO_POLL_INTERVAL_SEC * 1000)
    startRpaAutoCountdown()
    await checkRpaAutoStatus()
  } catch (error: any) {
    rpaAutoStatus.value = {
      ...(rpaAutoStatus.value ?? {}),
      executeResponse: {
        error: error?.message ?? 'execute 실패',
        tip: 'RPA 프로그램이 실행 중인지 확인하세요.'
      }
    }
  }
}

function extractValuesFromAny(source: any, key: string, bucket: Set<string>) {
  if (source === null || source === undefined) return
  if (Array.isArray(source)) {
    for (const item of source) extractValuesFromAny(item, key, bucket)
    return
  }
  if (typeof source !== 'object') return

  for (const [currentKey, currentValue] of Object.entries(source)) {
    if (
      currentKey === key &&
      (typeof currentValue === 'string' || typeof currentValue === 'number')
    ) {
      bucket.add(String(currentValue))
    }
    extractValuesFromAny(currentValue, key, bucket)
  }
}

const candidateMap = computed<Record<string, string[]>>(() => {
  const targetKeys = [
    'registryManagementNumber',
    'taskToken',
    'applicationId',
    'propertyId',
    'propertyUniqueNumber',
    'progressPartyId',
    'certificateSerialNumber',
    'cardNumber',
    'taskStatus'
  ]
  const map: Record<string, string[]> = {}

  for (const key of targetKeys) {
    const bucket = new Set<string>()
    extractValuesFromAny(registryRows.value, key, bucket)
    extractValuesFromAny(assignableUsers.value, key, bucket)
    extractValuesFromAny(basicInfo.value, key, bucket)
    extractValuesFromAny(referenceDetails.value, key, bucket)
    extractValuesFromAny(taskTokens.value, key, bucket)
    map[key] = [...bucket]
  }

  map.taskToken = [...new Set([...(map.taskToken ?? []), ...taskTokens.value])]
  map.taskStatus = ['SUCCESS', 'FAILED', 'IN_PROGRESS', 'PENDING']

  return map
})

async function loadRegistryList() {
  referenceLoading.registryList = true
  try {
    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const oneMonthAgo = new Date(today)
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const res: any = await registryProgressAPI.getList({
      workType: 'ALL',
      assignedWork: 'ALL',
      registryMethod: 'ALL',
      managerUserId: 'ALL',
      registryRequestStartDate: toApiDate(oneMonthAgo),
      registryRequestEndDate: toApiDate(today),
      registryReceiptStartDate: toApiDate(today),
      registryReceiptEndDate: toApiDate(nextMonth),
      progressStatus: 'ALL',
      page: 1,
      size: 20
    } as any)

    const payload = unwrap<any>(res)
    const data = payload?.result ?? payload
    registryRows.value = Array.isArray(data?.content) ? data.content : []

    const firstRegistryNo = registryRows.value[0]?.registryManagementNumber
    if (firstRegistryNo && !selectedRegistryManagementNumber.value) {
      selectedRegistryManagementNumber.value = String(firstRegistryNo)
    }
  } catch (error: any) {
    responseByEndpoint['__reference_registry'] = {
      error: error?.message ?? '진행현황 목록 조회 실패'
    }
  } finally {
    referenceLoading.registryList = false
  }
}

async function loadAssignableUsers() {
  referenceLoading.assignable = true
  try {
    const res: any = await userAPI.assignable({})
    const payload = unwrap<any>(res)
    const data = payload?.result ?? payload
    assignableUsers.value = Array.isArray(data)
      ? data
      : Array.isArray(data?.content)
        ? data.content
        : []
  } catch (error: any) {
    responseByEndpoint['__reference_assignable'] = {
      error: error?.message ?? '담당자 목록 조회 실패'
    }
  } finally {
    referenceLoading.assignable = false
  }
}

async function loadBasicInfo() {
  if (!selectedRegistryManagementNumber.value) return
  referenceLoading.basicInfo = true
  try {
    const res: any = await registryProgressAPI.basicInfo({
      registryManagementNumber: selectedRegistryManagementNumber.value
    } as any)
    const payload = unwrap<any>(res)
    basicInfo.value = payload?.result ?? payload
  } catch (error: any) {
    basicInfo.value = { error: error?.message ?? '기본정보 조회 실패' }
  } finally {
    referenceLoading.basicInfo = false
  }
}

async function loadReferenceBundle(registryManagementNumber: string) {
  if (!registryManagementNumber) return
  referenceLoading.detailBundle = true
  try {
    const [
      loanInfo,
      ownershipTransfer,
      mortgage,
      caseDetail,
      adminConsentDetail,
      housingBondDetail,
      transferCertificateDetail,
      transferCertificateList,
      completionDetail
    ] = await Promise.allSettled([
      registryProgressAPI.loanInfo({ registryManagementNumber } as any),
      registryProgressAPI.ownershipTransfer({ registryManagementNumber } as any),
      registryProgressAPI.mortgage({ registryManagementNumber } as any),
      registryCaseAPI.getDetail({ registryManagementNumber } as any),
      registryAdminConsentAPI.getDetail({ registryManagementNumber } as any),
      registryHousingBondAPI.getDetail({ registryManagementNumber } as any),
      registryTransferCertificateAPI.getDetail({ registryManagementNumber } as any),
      registryTransferCertificateAPI.getList({ registryManagementNumber } as any),
      registryCompletionAPI.getDetail({ registryManagementNumber } as any)
    ])

    const parseSettled = (result: PromiseSettledResult<any>) =>
      result.status === 'fulfilled'
        ? (unwrap<any>(result.value)?.result ?? unwrap<any>(result.value))
        : { error: result.reason?.message ?? '조회 실패' }

    const baseDetails = {
      loanInfo: parseSettled(loanInfo),
      ownershipTransfer: parseSettled(ownershipTransfer),
      mortgage: parseSettled(mortgage),
      caseDetail: parseSettled(caseDetail),
      adminConsentDetail: parseSettled(adminConsentDetail),
      housingBondDetail: parseSettled(housingBondDetail),
      transferCertificateDetail: parseSettled(transferCertificateDetail),
      transferCertificateList: parseSettled(transferCertificateList),
      completionDetail: parseSettled(completionDetail)
    }

    const appIdBucket = new Set<string>()
    extractValuesFromAny(baseDetails, 'applicationId', appIdBucket)
    extractValuesFromAny(basicInfo.value, 'applicationId', appIdBucket)
    const applicationId = [...appIdBucket]
      .map((value) => Number(value))
      .find((value) => Number.isFinite(value) && value > 0)

    let certificateDetail: any = { skipped: 'applicationId 없음' }
    let propertyDetail: any = { skipped: 'applicationId 없음' }
    if (applicationId) {
      const [certificateRes, propertyRes] = await Promise.allSettled([
        registryCertificateAPI.getDetail({ applicationId } as any),
        registryPropertyAPI.getDetail({ applicationId } as any)
      ])
      certificateDetail = parseSettled(certificateRes)
      propertyDetail = parseSettled(propertyRes)
    }

    let prepaidCardList: any = { skipped: 'branchId 없음' }
    try {
      const profileRes: any = await userAPI.getProfile()
      const profile = unwrap<any>(profileRes)?.result ?? unwrap<any>(profileRes)
      const branchId = Number(profile?.branchId)
      if (Number.isFinite(branchId) && branchId > 0) {
        const prepaidRes: any = await branchPrepaidAPI.getList({ branchId } as any)
        prepaidCardList = unwrap<any>(prepaidRes)?.result ?? unwrap<any>(prepaidRes)
      }
    } catch (error: any) {
      prepaidCardList = { error: error?.message ?? '조회 실패' }
    }

    referenceDetails.value = {
      ...baseDetails,
      certificateDetail,
      propertyDetail,
      prepaidCardList
    }
  } finally {
    referenceLoading.detailBundle = false
  }
}

async function ensureReferenceValuesReady() {
  if (registryRows.value.length === 0) {
    await loadRegistryList()
  }
  if (!selectedRegistryManagementNumber.value) {
    const firstRegistryNo = registryRows.value[0]?.registryManagementNumber
    if (firstRegistryNo) {
      selectedRegistryManagementNumber.value = String(firstRegistryNo)
    }
  }

  if (selectedRegistryManagementNumber.value) {
    await Promise.all([
      loadBasicInfo(),
      loadReferenceBundle(selectedRegistryManagementNumber.value)
    ])
  }

  if (assignableUsers.value.length === 0) {
    await loadAssignableUsers()
  }
}

async function loadAllReferenceData() {
  referenceLoading.all = true
  try {
    await ensureReferenceValuesReady()
  } finally {
    referenceLoading.all = false
  }
}

async function applyAutoFill(endpointId: string) {
  const ep = endpointConfigs.find((item) => item.id === endpointId)
  if (!ep) return

  await ensureReferenceValuesReady()

  const pathState = (pathInputByEndpoint[endpointId] ??= {})
  for (const pathParam of ep.pathParams) {
    const candidate = candidateMap.value[pathParam]?.[0]
    if (candidate && !pathState[pathParam]) {
      pathState[pathParam] = candidate
    }
  }

  if (!ep.hasBody) return
  try {
    const parsed = bodyByEndpoint[endpointId] ? JSON.parse(bodyByEndpoint[endpointId]) : {}
    for (const field of ep.requiredFields) {
      if (ep.pathParams.includes(field)) continue
      const candidate = candidateMap.value[field]?.[0]
      if (!candidate) continue

      if (typeof parsed[field] === 'number') {
        parsed[field] = Number(candidate)
      } else {
        parsed[field] = candidate
      }
    }
    bodyByEndpoint[endpointId] = JSON.stringify(parsed, null, 2)
  } catch {
    // JSON parse 실패 시 자동 채우기 생략
  }
}

function normalizeAttachmentPayload(raw: any) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.attachmentItems)) return raw

  return {
    ...raw,
    attachmentItems: raw.attachmentItems.map((item: any) => {
      if (!item || typeof item !== 'object') return item
      const mapped = { ...item }
      if (mapped.fileName == null && typeof mapped.tempFileName === 'string') {
        mapped.fileName = mapped.tempFileName
      }
      delete mapped.tempFileName
      delete mapped.htmlForm
      return mapped
    })
  }
}

async function callEndpoint(endpointId: string) {
  const ep = endpointConfigs.find((item) => item.id === endpointId)
  if (!ep) return

  isLoading[endpointId] = true
  const startedAt = Date.now()
  try {
    let url = ep.path
    const pathState = (pathInputByEndpoint[endpointId] ??= {})
    for (const pathParam of ep.pathParams) {
      const value = pathState[pathParam]
      if (!value) throw new Error(`필수 path 값이 비어있습니다: ${pathParam}`)
      url = url.replace(`{${pathParam}}`, encodeURIComponent(value))
    }

    const data = ep.hasBody
      ? normalizeAttachmentPayload(JSON.parse(bodyByEndpoint[endpointId] || '{}'))
      : undefined

    if ((endpointId === 'RPAC-01' || endpointId === 'RPAC-13') && data) {
      const cardNumber = String(data.cardNumber ?? '').trim()
      if (!cardNumber) {
        throw new Error('cardNumber가 비어있습니다.')
      }
      if (/[^0-9A-Za-z\s-]/.test(cardNumber)) {
        throw new Error(
          'cardNumber 형식이 올바르지 않습니다. 영문/숫자/공백/- 만 입력하세요. (예: P6735534 7877)'
        )
      }
      data.cardNumber = cardNumber
    }

    const accessToken = storage.getAccessToken()
    const headers: Record<string, string> = {
      'X-Bank-Code': effectiveBankCode.value
    }
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    const res = await api.request({
      method: ep.method.toLowerCase() as 'get' | 'post' | 'patch',
      url,
      data,
      headers
    })

    const elapsed = Date.now() - startedAt
    responseByEndpoint[endpointId] = {
      ok: true,
      status: res.status,
      elapsedMs: elapsed,
      data: res.data
    }

    const token = res?.data?.data?.taskToken ?? res?.data?.taskToken
    if (token && !taskTokens.value.includes(token)) {
      taskTokens.value.unshift(token)
      taskTokens.value = taskTokens.value.slice(0, 20)
    }

    // RPAC 호출 직후 자동으로 로컬 RPA execute + status 폴링
    const fallbackTaskToken = pathInputByEndpoint[endpointId]?.taskToken
    const taskTokenForAuto = token || fallbackTaskToken
    if (String(endpointId).startsWith('RPAC-') && taskTokenForAuto) {
      void executeRpaAuto(String(taskTokenForAuto), endpointId)
    } else if (String(endpointId).startsWith('RPAC-')) {
      rpaAutoStatus.value = {
        executeRequest: null,
        executeResponse: {
          error: 'taskToken을 찾지 못해 자동 execute를 건너뛰었습니다.'
        },
        statusCheck: null
      }
      stopRpaAutoPolling()
    } else {
      rpaAutoStatus.value = null
      stopRpaAutoPolling()
    }
  } catch (error: any) {
    const elapsed = Date.now() - startedAt
    responseByEndpoint[endpointId] = {
      ok: false,
      elapsedMs: elapsed,
      message: error?.message ?? '요청 실패',
      response: error?.response?.data ?? null
    }
    if (String(endpointId).startsWith('RPAC-')) {
      stopRpaAutoPolling()
      rpaAutoStatus.value = {
        executeRequest: null,
        executeResponse: {
          skipped: true,
          reason: 'RPAC API 실패로 자동 execute를 실행하지 않았습니다.'
        },
        statusCheck: null
      }
    }
  } finally {
    isLoading[endpointId] = false
  }
}

function getPathInput(endpointId: string, paramName: string): string {
  return pathInputByEndpoint[endpointId]?.[paramName] ?? ''
}

function setPathInput(endpointId: string, paramName: string, event: Event) {
  const value = (event.target as HTMLInputElement | null)?.value ?? ''
  const pathState = (pathInputByEndpoint[endpointId] ??= {})
  pathState[paramName] = value
}

watch(selectedLoginUser, (user) => {
  if (!user) return
  loginId.value = user.로그인아이디
})

watch(
  () => authStore.isLoggedIn,
  async (isLoggedIn) => {
    if (props.embedded) {
      refreshStorageData()
      return
    }
    if (isLoggedIn) {
      await fetchAssignedBanks()
    }
    refreshStorageData()
  },
  { immediate: true }
)

watch(
  () => selectedEndpointId.value,
  (id) => {
    if (id !== 'RPAC-11' && id !== 'RPAC-12' && !String(id).startsWith('RPAC-')) {
      rpaAutoStatus.value = null
    }
    stopRpaAutoPolling()
    if (id !== 'RPA-HTTP') {
      rpaHttpStopPolling()
    }
  }
)

let storagePollingTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (props.embedded) {
    return
  }
  const currentBankCode = storage.get().bankCode
  if (currentBankCode) {
    selectedBankCode.value = currentBankCode
  }
  storagePollingTimer = setInterval(() => {
    refreshStorageData()
  }, 2000)
})

onBeforeUnmount(() => {
  stopRpaAutoPolling()
  rpaAutoLastUpdatedAt.value = ''
  rpaHttpStopPolling()
  if (storagePollingTimer) {
    clearInterval(storagePollingTimer)
    storagePollingTimer = null
  }
})
</script>

<style scoped lang="scss">
.rpac-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  background: #f2f6fb;
  letter-spacing: -0.01em;
  line-height: 1.45;
}

.card {
  background: #fff;
  border: 1px solid #d9e2ea;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 4px 14px rgba(13, 32, 56, 0.06);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.page-header p {
  margin: 6px 0 0;
  color: #617083;
  line-height: 1.5;
}

.auth-actions {
  display: flex;
  gap: 8px;
}

.auth-info-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-info {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.auth-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.auth-info-label {
  font-size: 12px;
  color: #6b7e93;
}

.auth-info-value {
  font-size: 13px;
  color: #1f3145;
  font-weight: 600;
}

.timer-red {
  color: #cb2b3e;
}

.bank-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bank-select {
  min-width: 150px;
}

.bank-debug {
  color: #72869c;
  font-size: 12px;
}

.user-list-btn {
  align-self: flex-start;
}

.user-list-dropdown {
  border: 1px solid #d9e3ed;
  border-radius: 10px;
  background: #f8fbff;
  overflow: hidden;
}

.user-list-header {
  padding: 10px 12px;
  border-bottom: 1px solid #d9e3ed;
}

.user-list-header h3 {
  margin: 0;
  font-size: 14px;
}

.user-list-content {
  max-height: 400px;
  overflow: auto;
  padding: 10px 12px;
}

.user-optgroup + .user-optgroup {
  margin-top: 10px;
}

.user-optgroup-label {
  font-weight: 700;
  color: #214567;
  margin-bottom: 4px;
}

.user-list-item-compact {
  font-size: 12px;
  color: #2c4054;
  padding: 5px 0;
  white-space: normal;
  word-break: break-all;
  line-height: 1.55;
}

.status-active {
  color: #0d8f4d;
}

.status-pending {
  color: #c68012;
}

.status-temp {
  color: #1c6dd0;
}

.reference-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.reference-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.basic-info-form {
  margin-top: 10px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.basic-info-form label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reference-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.token-card {
  margin-top: 10px;
}

.reference-card {
  border: 1px solid #e5ebf0;
  border-radius: 8px;
  padding: 12px;
  background: #f8fbff;
}

.reference-card h3 {
  margin: 0 0 8px;
  font-size: 14px;
}

.reference-card pre {
  margin: 0;
  max-height: 120px;
  overflow: auto;
  font-size: 12px;
  line-height: 1.5;
}

.content {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.sidebar {
  padding: 10px;
}

.reference-section h2 {
  margin: 0;
  font-size: 15px;
  color: #24384d;
}

.endpoint-list {
  max-height: 920px;
  overflow: auto;
  padding-right: 4px;
}

.endpoint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 11px 10px;
  border: 1px solid #d9e4ef;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.endpoint:hover {
  border-color: #9eb7d3;
  background: #f7fbff;
}

.endpoint.active {
  border-color: #2f7de1;
  background: #edf5ff;
}

.endpoint-method {
  min-width: 52px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: #4a5f76;
  border-radius: 12px;
  padding: 3px 8px;
}

.endpoint.post .endpoint-method {
  background: #1f9f5f;
}

.endpoint.get .endpoint-method {
  background: #2f7de1;
}

.endpoint.patch .endpoint-method {
  background: #a56f0f;
}

.endpoint.http .endpoint-method {
  background: #7c3aed;
}

.endpoint-info {
  min-width: 0;
}

.endpoint-summary {
  margin: 0;
  color: #1f2f41;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: -0.01em;
}

.endpoint-card {
  background: #fff;
  border: 1px solid #d9e2ea;
  border-radius: 12px;
  padding: 16px;
}

.endpoint-header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.endpoint-header h3 {
  margin: 0;
  font-size: 16px;
}

.endpoint-header code {
  font-size: 12px;
  color: #35526e;
}

.required-values {
  margin-top: 10px;
  border: 1px solid #e5ebf0;
  border-radius: 8px;
  padding: 10px;
  background: #f9fbfd;
}

.required-values h4 {
  margin: 0 0 8px;
}

.required-values ul {
  margin: 0 0 8px;
  padding-left: 18px;
}

.required-values li {
  margin-bottom: 7px;
  font-size: 13px;
  line-height: 1.5;
}

.required-values span {
  margin-left: 6px;
  color: #5b6c7f;
}

.input-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.input-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-block label {
  font-size: 13px;
  color: #4f5f6f;
  line-height: 1.4;
}

.rpa-inline-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

input,
textarea {
  border: 1px solid #cfd9e3;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.45;
  letter-spacing: -0.005em;
}

.body-block {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.endpoint-actions {
  margin-top: 10px;
}

.response-block {
  margin-top: 10px;
}

.response {
  border: 1px solid #d7e1eb;
  border-radius: 10px;
  overflow: hidden;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #eff4fa;
  border-bottom: 1px solid #d7e1eb;
}

.response-title h4 {
  margin: 0;
}

.response-actions {
  display: flex;
  gap: 6px;
}

.rpa-auto-meta {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  color: #5f7388;
  flex-wrap: wrap;
}

.poll-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: #e5e7eb;
  color: #374151;
}

.poll-badge.active {
  background: #dcfce7;
  color: #166534;
}

.poll-count {
  font-size: 12px;
  color: #334155;
}

.mini-btn {
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
}

.response-body {
  margin: 0;
  max-height: 360px;
  overflow: auto;
  background: #121c28;
  color: #d7e2ef;
  padding: 12px;
  font-size: 12px;
  line-height: 1.55;
}

button {
  height: 34px;
  border: 1px solid #0b5bd4;
  background: #0b5bd4;
  color: #fff;
  border-radius: 6px;
  padding: 0 12px;
  cursor: pointer;
}

button.danger {
  border-color: #be2f3f;
  background: #be2f3f;
}

button.secondary {
  border-color: #bcc9d5;
  background: #fff;
  color: #2f3e4e;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(9, 18, 27, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.login-modal {
  width: min(980px, calc(100vw - 24px));
  background: #fff;
  border-radius: 12px;
  border: 1px solid #d6dee8;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid #e5ebf0;
}

.modal-header h3 {
  margin: 0;
}

.modal-body {
  padding: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  color: #4e6175;
}

.login-select,
.login-input {
  width: 100%;
}

.login-select {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 12px;
}

.user-detail {
  border: 1px solid #dfe8f1;
  border-radius: 8px;
  background: #f8fbff;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 12px;
}

.detail-row {
  display: flex;
  gap: 6px;
  font-size: 12px;
}

.detail-label {
  color: #6f8091;
}

.detail-value {
  color: #223548;
  font-weight: 600;
}

.login-submit-btn {
  margin-top: 4px;
  width: 140px;
}

.rpac-page.embedded {
  gap: 12px;
  padding: 12px;
  background: transparent;
  letter-spacing: 0;
}

.rpac-page.embedded .card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: 8px;
  box-shadow: none;
  padding: 14px;
}

.rpac-page.embedded .reference-grid {
  gap: 10px;
  grid-template-columns: 1fr;
}

.rpac-page.embedded .reference-card {
  background: var(--bg-primary);
  border-color: var(--border-secondary);
}

.rpac-page.embedded .endpoint-card {
  background: var(--bg-secondary);
  border-color: var(--border-secondary);
  padding: 12px;
}

.rpac-page.embedded .required-values {
  background: var(--bg-primary);
  border-color: var(--border-secondary);
}

.rpac-page.embedded .response {
  border-color: var(--border-secondary);
}

.rpac-page.embedded .response-header {
  background: var(--bg-tertiary);
  border-bottom-color: var(--border-secondary);
}

.rpac-page.embedded .content {
  gap: 12px;
  grid-template-columns: 320px minmax(0, 1fr);
}

.rpac-page.embedded .endpoint {
  border-color: var(--border-secondary);
  background: var(--bg-primary);
  margin-bottom: 8px;
}

.rpac-page.embedded .endpoint-list {
  max-height: 900px;
}

.rpac-page.embedded .endpoint:hover {
  border-color: var(--border-hover);
  background: var(--bg-tertiary);
}

.rpac-page.embedded .endpoint.active {
  border-color: var(--accent-primary);
  background: color-mix(in srgb, var(--accent-primary) 14%, var(--bg-primary));
}

.rpac-page.embedded .endpoint-summary,
.rpac-page.embedded .endpoint-header h3,
.rpac-page.embedded .reference-card h3,
.rpac-page.embedded .required-values h4,
.rpac-page.embedded .input-block label,
.rpac-page.embedded .body-block label {
  color: var(--text-primary);
  line-height: 1.45;
}

.rpac-page.embedded .required-values span {
  color: var(--text-secondary);
}

.rpac-page.embedded input,
.rpac-page.embedded textarea {
  background: var(--bg-primary);
  border-color: var(--border-secondary);
  color: var(--text-primary);
}

.rpac-page.embedded input::placeholder,
.rpac-page.embedded textarea::placeholder {
  color: var(--text-tertiary);
}

.rpac-page.embedded button.secondary {
  border-color: var(--border-secondary);
  background: var(--bg-primary);
  color: var(--text-primary);
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
  }

  .endpoint-list {
    max-height: 320px;
  }

  .reference-grid,
  .input-grid {
    grid-template-columns: 1fr;
  }

  .auth-info {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-detail {
    grid-template-columns: 1fr;
  }
}
</style>
