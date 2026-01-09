<template>
  <div class="rpa-test-container">
    <div class="container">
      <h1>🚀 RPA HTTP 서버 테스트</h1>

      <!-- 서버 설정 -->
      <section class="test-section">
        <h2>서버 설정</h2>
        <label>서버 URL:</label>
        <input v-model="serverUrl" type="text" placeholder="http://localhost:29541" />
      </section>

      <!-- GET 요청 테스트 -->
      <section class="test-section">
        <h2>1️⃣ GET 요청 테스트</h2>
        <button @click="testGet">GET 요청 보내기</button>
        <div v-if="getResult" :class="['result', { error: getResult.isError }]">
          {{ formatResult(getResult.data) }}
        </div>
      </section>

      <!-- POST 요청 테스트 -->
      <section class="test-section">
        <h2>2️⃣ POST 요청 테스트 (saveData)</h2>
        <label>JSON 데이터:</label>
        <textarea v-model="postData"></textarea>
        <button @click="testPost">POST 요청 보내기</button>
        <div v-if="postResult" :class="['result', { error: postResult.isError }]">
          {{ formatResult(postResult.data) }}
        </div>
      </section>

      <!-- MAC 주소 조회 -->
      <section class="test-section">
        <h2>3️⃣ MAC 주소 가져오기</h2>
        <button @click="getMacAddress">MAC 주소 조회</button>
        <div v-if="macResult" :class="['result', { error: macResult.isError }]">
          {{ formatResult(macResult.data) }}
        </div>
      </section>

      <!-- 데이터 조회 -->
      <section class="test-section">
        <h2>4️⃣ 데이터 조회</h2>
        <button @click="getData">샘플 데이터 조회</button>
        <div v-if="dataResult" :class="['result', { error: dataResult.isError }]">
          {{ formatResult(dataResult.data) }}
        </div>
      </section>

      <!-- RPA 실행 -->
      <section class="test-section">
        <h2>5️⃣ RPA 프로그램 실행</h2>
        <button @click="executeRPA">RPA 실행 (자동 상태 확인)</button>
        <button @click="stopPolling" class="stop-button">상태 확인 중지</button>
        <div v-if="rpaResult" :class="['result', { error: rpaResult.isError }]">
          {{ formatResult(rpaResult.data) }}
        </div>
        <div v-if="statusResult" :class="['result', 'status-result']">
          {{ formatResult(statusResult.data) }}
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

// 타입 정의
interface TestResult {
  data: any
  isError: boolean
}

interface RPAResponse {
  status: string
  result?: string
  message?: string
  [key: string]: any
}

interface PostData {
  action: string
  userId: number
  value: string
}

// 상태 관리
const serverUrl = ref('http://localhost:29541')
const getResult = ref<TestResult | null>(null)
const postResult = ref<TestResult | null>(null)
const macResult = ref<TestResult | null>(null)
const dataResult = ref<TestResult | null>(null)
const rpaResult = ref<TestResult | null>(null)
const statusResult = ref<TestResult | null>(null)

const postData = ref(`{
  "action": "saveData",
  "userId": 1,
  "value": "테스트 데이터"
}`)

// 폴링 관련
let pollingInterval: number | null = null
let pollingCount = 0

// 유틸리티 함수
const formatResult = (data: any): string => {
  return JSON.stringify(data, null, 2)
}

// API 호출 함수들
const testGet = async () => {
  try {
    getResult.value = { data: '요청 중...', isError: false }

    const response = await fetch(`${serverUrl.value}/`, {
      method: 'GET'
    })

    const data = await response.json()

    getResult.value = {
      data: {
        status: response.status,
        statusText: response.statusText,
        response: data
      },
      isError: false
    }
  } catch (error) {
    getResult.value = {
      data: {
        error: (error as Error).message,
        tip: 'RPA 프로그램이 실행 중인지 확인하세요.'
      },
      isError: true
    }
  }
}

const testPost = async () => {
  try {
    postResult.value = { data: '요청 중...', isError: false }

    let parsedData: PostData
    try {
      parsedData = JSON.parse(postData.value)
    } catch (e) {
      throw new Error(`JSON 형식이 올바르지 않습니다: ${(e as Error).message}`)
    }

    const response = await fetch(`${serverUrl.value}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parsedData)
    })

    const data = await response.json()

    postResult.value = {
      data: {
        status: response.status,
        statusText: response.statusText,
        sent: parsedData,
        response: data
      },
      isError: false
    }
  } catch (error) {
    postResult.value = {
      data: {
        error: (error as Error).message,
        tip: 'RPA 프로그램이 실행 중인지 확인하세요.'
      },
      isError: true
    }
  }
}

const getMacAddress = async () => {
  try {
    macResult.value = { data: '요청 중...', isError: false }

    const response = await fetch(`${serverUrl.value}/macaddress`)
    const data = await response.json()

    macResult.value = {
      data: {
        status: response.status,
        statusText: response.statusText,
        response: data
      },
      isError: false
    }
  } catch (error) {
    macResult.value = {
      data: {
        error: (error as Error).message,
        tip: 'RPA 프로그램이 실행 중인지 확인하세요.'
      },
      isError: true
    }
  }
}

const getData = async () => {
  try {
    dataResult.value = { data: '요청 중...', isError: false }

    const response = await fetch(`${serverUrl.value}/data`)
    const data = await response.json()

    dataResult.value = {
      data: {
        status: response.status,
        statusText: response.statusText,
        response: data
      },
      isError: false
    }
  } catch (error) {
    dataResult.value = {
      data: {
        error: (error as Error).message,
        tip: 'RPA 프로그램이 실행 중인지 확인하세요.'
      },
      isError: true
    }
  }
}

const executeRPA = async () => {
  try {
    rpaResult.value = { data: 'RPA 실행 중...', isError: false }

    const response = await fetch(`${serverUrl.value}/execute`)
    const data: RPAResponse = await response.json()

    rpaResult.value = {
      data: {
        status: response.status,
        statusText: response.statusText,
        response: data
      },
      isError: data.status === 'error'
    }

    // 실행 성공하면 상태 확인 시작
    if (data.status === 'success') {
      startPolling()
    }
  } catch (error) {
    rpaResult.value = {
      data: {
        error: (error as Error).message,
        tip: 'RPA 프로그램이 실행 중인지 확인하세요.'
      },
      isError: true
    }
  }
}

// 폴링 로직
const startPolling = () => {
  stopPolling() // 기존 폴링 중지
  pollingCount = 0

  statusResult.value = {
    data: '상태 확인 시작... (5초마다 확인)',
    isError: false
  }

  // 즉시 한 번 확인
  checkStatus()

  // 5초마다 확인
  pollingInterval = window.setInterval(() => {
    checkStatus()
  }, 5000)
}

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null

    if (statusResult.value) {
      statusResult.value = {
        data: '상태 확인이 중지되었습니다.',
        isError: false
      }
    }
  }
}

const checkStatus = async () => {
  pollingCount++

  try {
    statusResult.value = {
      data: `상태 확인 중... (${pollingCount}회차)`,
      isError: false
    }

    const response = await fetch(`${serverUrl.value}/status`)
    const data: RPAResponse = await response.json()

    statusResult.value = {
      data: {
        확인횟수: pollingCount,
        상태: data.status,
        결과값: data.result || 'N',
        메시지: data.message || ''
      },
      isError: false
    }

    // 응답 값이 "Y"이면 폴링 중지
    if (data.result === 'Y') {
      stopPolling()
      statusResult.value = {
        data: {
          확인횟수: pollingCount,
          상태: '완료',
          결과값: 'Y',
          메시지: data.message || '완료'
        },
        isError: false
      }
    }
  } catch (error) {
    statusResult.value = {
      data: {
        error: (error as Error).message,
        확인횟수: pollingCount,
        tip: 'RPA 프로그램이 실행 중인지 확인하세요.'
      },
      isError: true
    }
  }
}

// 컴포넌트 언마운트 시 폴링 정리
onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
h1 {
  color: #333;
  border-bottom: 3px solid #4caf50;
  padding-bottom: 10px;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 5px;
  border-left: 4px solid #4caf50;
}

button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}

button:hover {
  background: #45a049;
}

button:active {
  transform: scale(0.98);
}

.stop-button {
  background: #f44336;
  margin-left: 10px;
}

.stop-button:hover {
  background: #da190b;
}

.result {
  margin-top: 15px;
  padding: 15px;
  background: #e8f5e9;
  border-radius: 5px;
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  max-height: 300px;
  overflow-y: auto;
}

.result.error {
  background: #ffebee;
  color: #c62828;
}

.status-result {
  margin-top: 10px;
}

input[type='text'],
textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

textarea {
  font-family: 'Courier New', monospace;
  min-height: 100px;
  resize: vertical;
}

label {
  font-weight: bold;
  color: #555;
  display: block;
  margin-bottom: 5px;
}
</style>
