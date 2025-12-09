<template>
  <div class="demo-container">
    <h1>🎯 Floating Input 테스트</h1>

    <section class="form-section">
      <h2>회원 정보</h2>

      <div class="floating-wrapper">
        <input
          type="text"
          id="name"
          v-model="formData.name"
          :class="{ 'has-value': formData.name }"
          placeholder="이름을 입력해주세요."
        />
        <label for="name" class="floating-label">이름</label>
        <div class="fake-overlay"></div>
      </div>

      <div class="floating-wrapper">
        <input
          type="email"
          id="email"
          v-model="formData.email"
          :class="{ 'has-value': formData.email }"
          placeholder=" "
        />
        <label for="email" class="floating-label">이메일</label>
        <div class="fake-overlay"></div>
      </div>

      <div class="floating-wrapper">
        <input
          type="password"
          id="password"
          v-model="formData.password"
          :class="{ 'has-value': formData.password }"
          placeholder=" "
        />
        <label for="password" class="floating-label">비밀번호</label>
        <div class="fake-overlay"></div>
      </div>

      <div class="floating-wrapper">
        <input
          type="tel"
          id="phone"
          v-model="formData.phone"
          :class="{ 'has-value': formData.phone }"
          placeholder=" "
        />
        <label for="phone" class="floating-label">전화번호</label>
        <div class="fake-overlay"></div>
      </div>

      <div class="floating-wrapper">
        <input
          type="date"
          id="birthday"
          v-model="formData.birthday"
          :class="{ 'has-value': formData.birthday }"
        />
        <label for="birthday" class="floating-label">생년월일</label>
        <div class="fake-overlay"></div>
      </div>

      <div class="floating-wrapper">
        <input
          type="time"
          id="time"
          v-model="formData.time"
          :class="{ 'has-value': formData.time }"
        />
        <label for="time" class="floating-label">시간</label>
        <div class="fake-overlay"></div>
      </div>

      <div class="floating-wrapper">
        <select
          id="gender"
          v-model="formData.gender"
          :class="{ 'has-value': formData.gender }"
          @change="blurSelect($event)"
        >
          <option value=""></option>
          <option value="male">남성</option>
          <option value="female">여성</option>
          <option value="other">기타</option>
        </select>
        <label for="gender" class="floating-label">성별</label>
        <div class="fake-overlay"></div>
      </div>

      <div class="floating-wrapper">
        <select
          id="country"
          v-model="formData.country"
          :class="{ 'has-value': formData.country }"
          @change="blurSelect($event)"
        >
          <option value=""></option>
          <option value="kr">🇰🇷 대한민국</option>
          <option value="us">🇺🇸 미국</option>
          <option value="jp">🇯🇵 일본</option>
          <option value="cn">🇨🇳 중국</option>
        </select>
        <label for="country" class="floating-label">국가</label>
        <div class="fake-overlay"></div>
      </div>

      <div class="floating-wrapper">
        <textarea
          id="bio"
          v-model="formData.bio"
          :class="{ 'has-value': formData.bio }"
          placeholder=" "
        ></textarea>
        <label for="bio" class="floating-label">자기소개</label>
        <div class="fake-overlay"></div>
      </div>

      <div class="floating-wrapper">
        <input
          type="file"
          id="file"
          @change="handleFileChange"
          :class="{ 'has-value': fileName }"
        />
        <label for="file" class="floating-label">문서 첨부</label>
        <div class="fake-overlay"></div>
      </div>

      <div class="button-group">
        <button type="button" class="btn-primary" @click="handleSubmit">제출하기</button>
        <button type="button" class="btn-secondary" @click="handleReset">초기화</button>
      </div>
    </section>

    <section class="result-section">
      <h2>📊 입력된 데이터</h2>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      <p v-if="fileName" class="file-info">📎 선택된 파일: {{ fileName }}</p>
    </section>
  </div>

  <InputTest2 />
</template>

<script setup>
import { ref } from 'vue'

import InputTest2 from '@/views/TEMP/InputTest.vue'

const formData = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  birthday: '',
  time: '',
  gender: '',
  country: '',
  bio: ''
})

const fileName = ref('')

const blurSelect = (event) => {
  setTimeout(() => {
    event.target.blur()
  }, 0)
}

const handleSubmit = () => {
  console.log('제출:', formData.value)
  alert('제출 완료!\n콘솔을 확인하세요.')
}

const handleReset = () => {
  formData.value = {
    name: '',
    email: '',
    password: '',
    phone: '',
    birthday: '',
    time: '',
    gender: '',
    country: '',
    bio: ''
  }
  fileName.value = ''
  const fileInput = document.getElementById('file')
  if (fileInput) fileInput.value = ''
}

const handleFileChange = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    fileName.value = files[0].name
  } else {
    fileName.value = ''
  }
}
</script>

<style scoped lang="scss">
.floating-wrapper {
  position: relative;
  margin: 20px 0;

  input,
  select,
  textarea {
    width: 100%;
    max-width: 400px;
    padding: 20px 15px 10px 15px;
    font-size: 1em;
    border: 2px solid #ddd;
    border-radius: 8px;
    background: white;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      opacity: 1;
    }

    &:not(.has-value):not(:focus) {
      opacity: 0;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .fake-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 400px;
    height: 100%;
    border: 2px solid #ddd;
    border-radius: 8px;
    background: white;
    pointer-events: none;
    z-index: 1;
    transition: all 0.3s ease;
  }

  input:focus ~ .fake-overlay,
  input.has-value ~ .fake-overlay,
  select:focus ~ .fake-overlay,
  select.has-value ~ .fake-overlay,
  textarea:focus ~ .fake-overlay,
  textarea.has-value ~ .fake-overlay {
    opacity: 0;
  }

  label.floating-label {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1em;
    color: #999;
    pointer-events: none;
    transition: all 0.3s ease;
    background: white;
    padding: 0 5px;
    z-index: 3;
  }

  input:focus ~ label.floating-label,
  input.has-value ~ label.floating-label,
  select:focus ~ label.floating-label,
  select.has-value ~ label.floating-label,
  textarea:focus ~ label.floating-label,
  textarea.has-value ~ label.floating-label {
    top: 0;
    font-size: 0.75em;
    color: #667eea;
    font-weight: bold;
  }

  select {
    appearance: none;
    color: #333;

    &:not(.has-value) {
      color: transparent;
    }

    &.has-value,
    &:focus {
      color: #333;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 15px center;
    }
  }

  input[type='file'] {
    color: transparent;

    &::-webkit-file-upload-button {
      display: none;
    }

    &.has-value,
    &:focus {
      color: #333;
    }

    &.has-value {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='%23667eea'%3E%3Cpath d='M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 15px center;
      padding-right: 45px;
    }
  }

  input[type='color'] {
    height: 60px;
    opacity: 1;
  }

  input[type='color'] ~ label.floating-label {
    top: 0;
    font-size: 0.75em;
    color: #667eea;
    font-weight: bold;
  }
}

.demo-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  text-align: center;
  color: #667eea;
  margin-bottom: 40px;
  font-size: 2em;
}

.form-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;

  h2 {
    color: #764ba2;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #667eea;
    font-size: 1.3em;
  }
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 30px;

  button {
    flex: 1;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &.btn-primary {
      background: #667eea;
      color: white;

      &:hover {
        background: #5568d3;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
    }

    &.btn-secondary {
      background: #e0e0e0;
      color: #333;

      &:hover {
        background: #d0d0d0;
      }
    }
  }
}

.result-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #667eea;

  h2 {
    color: #667eea;
    margin-bottom: 15px;
    font-size: 1.2em;
  }

  pre {
    background: white;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.9em;
    line-height: 1.6;
    color: #333;
  }

  .file-info {
    margin-top: 10px;
    color: #667eea;
    font-weight: bold;
  }
}
</style>
