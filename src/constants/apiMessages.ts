// src/constants/apiMessages.ts

// HTTP 상태 코드 메시지
export const HTTP_STATUS_MESSAGES = {
  // 2xx Success
  200: '요청이 성공했습니다.',
  201: '리소스가 생성되었습니다.',
  204: '요청이 성공했습니다.',

  // 4xx Client Error
  400: '잘못된 요청입니다.',
  401: '인증이 필요합니다.',
  403: '접근 권한이 없습니다.',
  404: '요청한 리소스를 찾을 수 없습니다.',
  409: '요청이 충돌되었습니다.',
  422: '입력 데이터가 유효하지 않습니다.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',

  // 5xx Server Error
  500: '서버 오류가 발생했습니다.',
  502: '게이트웨이 오류가 발생했습니다.',
  503: '서비스를 일시적으로 사용할 수 없습니다.',
  504: '게이트웨이 시간 초과입니다.'
} as const

// 커스텀 API 에러 코드 메시지 (기획서 기준 Alert Text)
export const API_ERROR_MESSAGES = {
  // 인증 관련
  AUTH_001: '로그인이 필요합니다.',
  AUTH_002: '세션이 만료되었습니다. 다시 로그인해주세요.',
  AUTH_003: '아이디 또는 비밀번호가 일치하지 않습니다.',
  AUTH_004: '이미 로그인된 사용자입니다.',
  AUTH_005: '비밀번호 설정이 필요합니다.',
  AUTH_006: '접근이 차단된 사용자입니다.',

  // 회원가입 관련
  SIGNUP_001: '이미 가입된 이메일입니다.',
  SIGNUP_002: '사업자등록번호가 유효하지 않습니다.',
  SIGNUP_003: '필수 정보를 모두 입력해주세요.',

  // 등기 관련
  REG_001: '등기 신청서 작성이 완료되지 않았습니다.',
  REG_002: '첨부서류가 누락되었습니다.',
  REG_003: '세금 정보를 확인할 수 없습니다.',
  REG_004: '전자서명이 필요합니다.',

  // 조직/사용자 관련
  ORG_001: '조직 정보를 찾을 수 없습니다.',
  ORG_002: '사용자 권한이 없습니다.',
  ORG_003: '지점 정보가 유효하지 않습니다.',

  // 견적 관련
  EST_001: '견적서를 찾을 수 없습니다.',
  EST_002: '견적서 작성 권한이 없습니다.',
  EST_003: '이미 승인된 견적서입니다.',

  // 은행 관련
  BANK_001: '배정된 은행 정보가 없습니다.',
  BANK_002: '은행 연동에 실패했습니다.',

  // 시스템
  SYS_001: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  SYS_002: '네트워크 연결을 확인해주세요.',
  SYS_003: '서버 점검 중입니다.'
} as const

// 성공 메시지
export const API_SUCCESS_MESSAGES = {
  // 인증
  LOGIN_SUCCESS: '로그인되었습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.',
  SIGNUP_SUCCESS: '회원가입이 완료되었습니다.',
  PASSWORD_CHANGE_SUCCESS: '비밀번호가 변경되었습니다.',

  // 등기
  REG_SUBMIT_SUCCESS: '등기 신청이 완료되었습니다.',
  REG_UPDATE_SUCCESS: '등기 정보가 수정되었습니다.',
  REG_CANCEL_SUCCESS: '등기 신청이 취소되었습니다.',

  // 견적
  EST_CREATE_SUCCESS: '견적서가 작성되었습니다.',
  EST_UPDATE_SUCCESS: '견적서가 수정되었습니다.',
  EST_ACCEPT_SUCCESS: '견적서가 승인되었습니다.',

  // 조직/사용자
  ORG_CREATE_SUCCESS: '조직이 생성되었습니다.',
  ORG_UPDATE_SUCCESS: '조직 정보가 수정되었습니다.',
  USER_CREATE_SUCCESS: '사용자가 등록되었습니다.',
  USER_UPDATE_SUCCESS: '사용자 정보가 수정되었습니다.',
  USER_DELETE_SUCCESS: '사용자가 삭제되었습니다.',

  // 기타
  SAVE_SUCCESS: '저장되었습니다.',
  DELETE_SUCCESS: '삭제되었습니다.',
  UPDATE_SUCCESS: '수정되었습니다.'
} as const

// 타입 정의
export type HttpStatusCode = keyof typeof HTTP_STATUS_MESSAGES
export type ApiErrorCode = keyof typeof API_ERROR_MESSAGES
export type ApiSuccessCode = keyof typeof API_SUCCESS_MESSAGES
