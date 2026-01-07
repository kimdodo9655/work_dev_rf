<template>
  <div class="test-area">
    <h2>FloatingInput 테스트</h2>

    <div class="container">
      <!-- 1. 기본 단일 input -->
      <FloatingInput label="사용자 이름" placeholder="사용자 이름을 입력하세요" field-id="username">
        <input id="username" v-model="form.username" type="text" />
      </FloatingInput>

      <!-- 2. 여러 input 직접 나열 (성, 이름) -->
      <FloatingInput label="이름" placeholder="성과 이름을 입력하세요" field-id="first-name">
        <input id="first-name" v-model="form.firstName" type="text" placeholder="성" />
        <span style="margin: 0 8px; color: #9ca3af">,</span>
        <input v-model="form.lastName" type="text" placeholder="이름" />
      </FloatingInput>

      <!-- 3. 필수 입력 마크 -->
      <FloatingInput
        label="이메일"
        placeholder="이메일을 입력하세요"
        field-id="email"
        :show-required="true"
      >
        <input id="email" v-model="form.email" type="email" />
      </FloatingInput>
    </div>

    <div class="container">
      <!-- 4. 에러 상태 (값 없음) -->
      <FloatingInput
        label="필수 입력"
        placeholder="필수 입력 항목입니다"
        field-id="required-field"
        :show-required="true"
        :show-error="emptyFieldError"
        error-message="필수 입력 항목입니다"
      >
        <input id="required-field" v-model="form.requiredField" type="text" @blur="validateEmpty" />
      </FloatingInput>

      <!-- 5. 에러 상태 (값 있음 - 형식 오류) -->
      <FloatingInput
        label="휴대폰 번호"
        placeholder="010-1234-5678"
        field-id="phone"
        :show-required="true"
        :show-error="phoneError"
        error-message="올바른 형식이 아닙니다"
      >
        <input id="phone" v-model="form.phone" type="tel" @blur="validatePhone" />
      </FloatingInput>

      <!-- 6. 에러 상태 (값 있음 - 길이 초과) -->
      <FloatingInput
        label="닉네임"
        placeholder="10자 이내로 입력하세요"
        field-id="nickname"
        :show-error="nicknameError"
        error-message="10자를 초과했습니다"
      >
        <input id="nickname" v-model="form.nickname" type="text" @input="validateNickname" />
      </FloatingInput>
    </div>

    <div class="container">
      <!-- 7. 여러 개의 input (기간 선택) -->
      <FloatingInput
        label="기간"
        placeholder="기간을 선택하세요"
        field-id="period-start"
        :show-required="true"
      >
        <div class="input-group">
          <input id="period-start" v-model="form.startDate" type="date" />
          <span style="color: #9ca3af">~</span>
          <input v-model="form.endDate" type="date" />
        </div>
      </FloatingInput>

      <!-- 8. input + 버튼 -->
      <FloatingInput
        label="인증번호"
        placeholder="인증번호를 입력하세요"
        field-id="verify-code"
        :show-required="true"
      >
        <div class="input-with-button">
          <input id="verify-code" v-model="form.verifyCode" type="text" maxlength="6" />
          <button @click="sendVerifyCode">인증번호 발송</button>
        </div>
      </FloatingInput>

      <!-- 9. input + addon 텍스트 (앞) -->
      <FloatingInput label="가격" placeholder="가격을 입력하세요" field-id="price">
        <div class="input-addon">
          <span class="addon-text">₩</span>
          <input id="price" v-model="form.price" type="number" />
        </div>
      </FloatingInput>
    </div>

    <div class="container">
      <!-- 10. input + addon 텍스트 (뒤) -->
      <FloatingInput label="무게" placeholder="무게를 입력하세요" field-id="weight">
        <div class="input-addon">
          <input id="weight" v-model="form.weight" type="number" />
          <span class="addon-text">kg</span>
        </div>
      </FloatingInput>

      <!-- 11. textarea -->
      <FloatingInput label="상세 설명" placeholder="상세 설명을 입력하세요" field-id="description">
        <textarea id="description" v-model="form.description" rows="4" />
      </FloatingInput>

      <!-- 12. select (기본) -->
      <FloatingInput label="직급" placeholder="직급을 선택하세요" field-id="position">
        <select id="position" v-model="form.position">
          <option value="">선택하세요</option>
          <option value="staff">사원</option>
          <option value="senior">대리</option>
          <option value="manager">과장</option>
          <option value="director">부장</option>
        </select>
      </FloatingInput>
    </div>

    <!-- ✨ FloatingInnerSelect (FloatingInput 내부 사용) 테스트 -->
    <div class="container">
      <!-- 13. FloatingInnerSelect - 기본 -->
      <FloatingInput
        label="학력"
        placeholder="학력을 선택하세요"
        field-id="education"
        :show-required="true"
      >
        <input id="first-name" v-model="form.firstName" type="text" placeholder="성" />
        <span style="margin: 0 8px; color: #9ca3af">,</span>
        <FloatingInnerSelect
          v-model="form.education"
          :options="educations"
          placeholder="학력을 선택하세요"
        />
      </FloatingInput>

      <!-- 14. FloatingInnerSelect - 직접입력 기능 -->
      <FloatingInput label="전공" placeholder="전공을 선택하거나 직접 입력하세요" field-id="major">
        <FloatingInnerSelect
          v-model="form.major"
          :options="majors"
          :allow-custom-input="true"
          custom-input-placeholder="전공명을 입력하세요"
          placeholder="전공을 선택하거나 직접 입력하세요"
        />
      </FloatingInput>

      <!-- 15. FloatingInnerSelect - 에러 상태 -->
      <FloatingInput
        label="경력"
        placeholder="경력을 선택하세요"
        field-id="experience"
        :show-required="true"
        :show-error="experienceError"
        error-message="경력을 선택해주세요"
      >
        <FloatingInnerSelect
          v-model="form.experience"
          :options="experiences"
          placeholder="경력을 선택하세요"
          @blur="validateExperience"
        />
      </FloatingInput>
    </div>

    <!-- ✨ FloatingCustomSelect (독립 컴포넌트) 테스트 -->
    <div class="container">
      <!-- 16. FloatingCustomSelect - 기본 -->
      <FloatingCustomSelect
        v-model="form.country"
        label="국가"
        placeholder="국가를 선택하세요"
        :options="countries"
        @change="handleCountryChange"
      />

      <!-- 17. FloatingCustomSelect - 직접입력 기능 -->
      <FloatingCustomSelect
        v-model="form.city"
        v-model:custom-text="form.cityCustomText"
        label="도시"
        placeholder="도시를 선택하거나 직접 입력하세요"
        :options="cities"
        :allow-custom-input="true"
        custom-input-value="__custom__"
        custom-input-placeholder="도시명을 입력하세요"
        :show-required="true"
      />

      <!-- 18. FloatingCustomSelect - 간단한 배열 -->
      <FloatingCustomSelect
        v-model="form.category"
        label="카테고리"
        placeholder="카테고리를 선택하세요"
        :options="categories"
      />
    </div>

    <div class="container">
      <!-- 19. FloatingCustomSelect - 에러 상태 -->
      <FloatingCustomSelect
        v-model="form.department"
        label="부서"
        placeholder="부서를 선택하세요"
        :options="departments"
        :show-required="true"
        :show-error="departmentError"
        error-message="부서를 선택해주세요"
        @blur="validateDepartment"
      />

      <!-- 20. FloatingCustomSelect - 비활성화 -->
      <FloatingCustomSelect
        v-model="form.fixedPosition"
        label="고정 직급"
        placeholder="수정 불가"
        :options="positions"
        :is-disabled="true"
      />

      <!-- 21. FloatingCustomSelect - 직접입력 + 많은 옵션 -->
      <FloatingCustomSelect
        v-model="form.employee"
        v-model:custom-text="form.employeeCustomText"
        label="직원"
        placeholder="직원을 선택하거나 직접 입력하세요"
        :options="employees"
        :allow-custom-input="true"
        custom-input-value="__custom_employee__"
        custom-input-placeholder="직원 이름을 입력하세요"
      />
    </div>

    <div class="container">
      <!-- 22. 비활성화 상태 -->
      <FloatingInput
        label="고정 값"
        placeholder="수정할 수 없습니다"
        field-id="fixed"
        :is-disabled="true"
      >
        <input id="fixed" v-model="form.fixed" type="text" disabled />
      </FloatingInput>

      <!-- 23. 비활성화 + 에러 (에러가 시각적으로만 표시) -->
      <FloatingInput
        label="비활성 필드"
        placeholder="비활성화된 필드"
        field-id="disabled-error"
        :is-disabled="true"
      >
        <input id="disabled-error" v-model="form.disabledField" type="text" disabled />
      </FloatingInput>

      <!-- 24. 읽기 전용 -->
      <FloatingInput label="읽기 전용" placeholder="읽기만 가능합니다" field-id="readonly">
        <input id="readonly" v-model="form.readonly" type="text" readonly />
      </FloatingInput>
    </div>

    <div class="container">
      <!-- 25. 여러 input 직접 나열 (전화번호) -->
      <FloatingInput
        label="전화번호"
        placeholder="전화번호를 입력하세요"
        field-id="tel1"
        :show-required="true"
        :show-error="telError"
        error-message="전화번호를 모두 입력하세요"
      >
        <input
          id="tel1"
          v-model="form.tel1"
          type="text"
          placeholder="010"
          maxlength="3"
          style="width: 60px"
          @blur="validateTel"
        />
        <span style="margin: 0 8px; color: #9ca3af">-</span>
        <input
          v-model="form.tel2"
          type="text"
          placeholder="1234"
          maxlength="4"
          style="width: 70px"
          @blur="validateTel"
        />
        <span style="margin: 0 8px; color: #9ca3af">-</span>
        <input
          v-model="form.tel3"
          type="text"
          placeholder="5678"
          maxlength="4"
          style="width: 70px"
          @blur="validateTel"
        />
      </FloatingInput>

      <!-- 26. 복잡한 구조 (주소 검색) -->
      <FloatingInput
        label="주소"
        placeholder="주소를 검색하세요"
        field-id="address"
        :show-required="true"
        :show-error="addressError"
        error-message="주소를 검색하고 상세 주소를 입력하세요"
      >
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%">
          <div class="input-with-button">
            <input
              id="address"
              v-model="form.zipCode"
              type="text"
              placeholder="우편번호"
              readonly
            />
            <button @click="searchAddress">주소 검색</button>
          </div>
          <input v-model="form.address" type="text" placeholder="기본 주소" readonly />
          <input
            v-model="form.addressDetail"
            type="text"
            placeholder="상세 주소를 입력하세요"
            @blur="validateAddress"
          />
        </div>
      </FloatingInput>
    </div>

    <!-- 폼 데이터 출력 (디버깅용) -->
    <div class="debug-section">
      <h3>폼 데이터</h3>
      <pre>{{ JSON.stringify(form, null, 2) }}</pre>
      <h3>에러 상태</h3>
      <pre>{{
        JSON.stringify(
          {
            emptyFieldError,
            phoneError,
            nicknameError,
            telError,
            addressError,
            departmentError,
            experienceError
          },
          null,
          2
        )
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import FloatingCustomSelect from '@/components/template/input/FloatingCustomSelect.vue'
import FloatingInnerSelect from '@/components/template/input/FloatingInnerSelect.vue'
import FloatingInput from '@/components/template/input/FloatingInput.vue'

const form = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  requiredField: '',
  phone: '',
  nickname: '',
  startDate: '',
  endDate: '',
  verifyCode: '',
  price: '',
  weight: '',
  description: '',
  position: '',
  fixed: '수정 불가능한 값',
  disabledField: '비활성 상태',
  readonly: '읽기 전용 값',
  tel1: '',
  tel2: '',
  tel3: '',
  zipCode: '',
  address: '',
  addressDetail: '',
  // FloatingInnerSelect 필드
  education: null as string | number | null,
  major: null as string | number | null,
  experience: null as string | number | null,
  // FloatingCustomSelect 필드
  country: null as string | number | null,
  city: null as string | number | null,
  cityCustomText: null as string | null, // ⭐ 타입 명시 추가
  category: null as string | number | null,
  department: null as string | number | null,
  fixedPosition: 'manager',
  employee: null as string | number | null,
  employeeCustomText: null as string | null // ⭐ 타입 명시 추가
})

const emptyFieldError = ref(false)
const phoneError = ref(false)
const nicknameError = ref(false)
const telError = ref(false)
const addressError = ref(false)
const departmentError = ref(false)
const experienceError = ref(false)

// FloatingInnerSelect 옵션 데이터
const educations = [
  { label: '고등학교 졸업', value: 'high_school' },
  { label: '전문대 졸업', value: 'associate' },
  { label: '대학교 졸업', value: 'bachelor' },
  { label: '석사', value: 'master' },
  { label: '박사', value: 'phd' }
]

const majors = [
  '컴퓨터공학',
  '전자공학',
  '기계공학',
  '경영학',
  '경제학',
  '디자인학',
  '심리학',
  '수학',
  '물리학',
  '화학'
]

const experiences = [
  { label: '신입', value: 'junior' },
  { label: '1~3년', value: '1-3' },
  { label: '3~5년', value: '3-5' },
  { label: '5~10년', value: '5-10' },
  { label: '10년 이상', value: '10+' }
]

// FloatingCustomSelect 옵션 데이터
const countries = [
  { label: '대한민국', value: 'kr' },
  { label: '미국', value: 'us' },
  { label: '일본', value: 'jp' },
  { label: '중국', value: 'cn' },
  { label: '영국', value: 'uk' },
  { label: '독일', value: 'de' },
  { label: '프랑스', value: 'fr' },
  { label: '캐나다', value: 'ca' },
  { label: '호주', value: 'au' }
]

const cities = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
  { label: '대구', value: 'daegu' },
  { label: '인천', value: 'incheon' }
]

const categories = ['전자제품', '의류', '식품', '도서', '스포츠', '가구', '완구', '화장품']

const departments = [
  { label: '개발팀', value: 'dev' },
  { label: '디자인팀', value: 'design' },
  { label: '기획팀', value: 'planning' },
  { label: '마케팅팀', value: 'marketing' },
  { label: '인사팀', value: 'hr' },
  { label: '재무팀', value: 'finance' }
]

const positions = [
  { label: '사원', value: 'staff' },
  { label: '대리', value: 'senior' },
  { label: '과장', value: 'manager' },
  { label: '부장', value: 'director' }
]

const employees = [
  { label: '김철수 (개발팀)', value: 'emp001' },
  { label: '이영희 (디자인팀)', value: 'emp002' },
  { label: '박민수 (기획팀)', value: 'emp003' },
  { label: '정지원 (마케팅팀)', value: 'emp004' },
  { label: '최수진 (인사팀)', value: 'emp005' },
  { label: '강동현 (재무팀)', value: 'emp006' },
  { label: '윤서연 (개발팀)', value: 'emp007' },
  { label: '장민호 (디자인팀)', value: 'emp008' },
  { label: '임하늘 (기획팀)', value: 'emp009' },
  { label: '한지우 (마케팅팀)', value: 'emp010' },
  { label: '송예진 (인사팀)', value: 'emp011' },
  { label: '백승현 (재무팀)', value: 'emp012' },
  { label: '오유진 (개발팀)', value: 'emp013' },
  { label: '권태양 (디자인팀)', value: 'emp014' },
  { label: '남궁선 (기획팀)', value: 'emp015' }
]

function validateEmpty() {
  emptyFieldError.value = form.requiredField.trim() === ''
}

function validatePhone() {
  if (form.phone === '') {
    phoneError.value = false
    return
  }
  const phonePattern = /^010-\d{4}-\d{4}$/
  phoneError.value = !phonePattern.test(form.phone)
}

function validateNickname() {
  nicknameError.value = form.nickname.length > 10
}

function validateTel() {
  const allEmpty = !form.tel1 && !form.tel2 && !form.tel3
  const allFilled = form.tel1 && form.tel2 && form.tel3
  telError.value = !allEmpty && !allFilled
}

function validateAddress() {
  addressError.value = (!!form.zipCode || !!form.address) && !form.addressDetail
}

function validateDepartment() {
  departmentError.value = form.department === null
}

function validateExperience() {
  experienceError.value = form.experience === null
}

function sendVerifyCode() {
  alert('인증번호가 발송되었습니다')
}

function searchAddress() {
  form.zipCode = '12345'
  form.address = '서울시 강남구 테헤란로 123'
  addressError.value = !form.addressDetail
}

function handleCountryChange(value: string | number | null) {
  console.log('선택된 국가:', value)
}
</script>

<style scoped lang="scss">
.test-area {
  padding: 40px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

h3 {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  > * {
    flex: 1;
    min-width: 0;
  }
}

.debug-section {
  margin-top: 40px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  pre {
    background: white;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 12px;
    line-height: 1.5;
  }
}
</style>
