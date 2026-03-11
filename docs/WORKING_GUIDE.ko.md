# 작업 가이드

목적:
- 자주 수정하는 흐름 빠르게 파악
- 책임 경계 혼선 방지
- 수정 후 확인 포인트 고정

## 인증 흐름

핵심 파일:
- `src/composables/api/useAuth.ts`
- `src/stores/auth.ts`
- `src/composables/utils/useAuthInitializer.ts`
- `src/utils/authPayload.ts`
- `src/utils/authSessionFlags.ts`

읽기 순서:
1. `useAuth.ts`
2. `auth.ts`
3. `useAuthInitializer.ts`
4. `refresh.ts`
5. `responseInterceptor.ts`

## 인터셉터 / 세션 만료

핵심 파일:
- `src/api/interceptors/refresh.ts`
- `src/utils/responseInterceptor.ts`
- `src/api/interceptors/response.ts`

원칙:
- refresh: 1회 실행
- 동시 실패 요청: queue 대기 후 재시도
- auth 페이지: 세션 만료 리다이렉트 제외

## API 응답 파싱

핵심 파일:
- `src/utils/apiPayload.ts`
- `src/utils/apiError.ts`

기준:
- 응답 래핑 차이: `apiPayload.ts`에서 흡수
- 화면별 분기 남발: 금지
- 새 API 연결 전 확인: `data`, `result`, `items`, `content`

## 라우팅 규칙

핵심 위치:
- `src/router/routes`

규칙:
- 내부 이동: `path`보다 `name`
- 외부 이동 / 전체 새로고침 필요: `browserLocation.assign()`
- 메뉴 활성 상태 판단: 필요 시 `path` 병행

## API 성공 / 실패 후 특수 동작 위치

### 1. `service`

위치:
- `src/api/services/*.ts`

역할:
- endpoint 호출
- params / body 전달
- response 타입 연결

넣지 않을 것:
- 페이지 이동
- 토스트 / 모달
- 화면 전용 분기
- 도메인 상태 변경

### 2. `composable`

역할:
- 도메인 후처리
- 공통 상태 갱신
- query invalidation
- payload 정규화
- 여러 화면에서 재사용되는 성공 / 실패 처리

예:
- auth store 갱신
- 목록 재조회
- 선택 상태 초기화

### 3. `page` / `component`

역할:
- 화면 UX 결정
- 성공 후 이동
- 실패 문구 / 모달 / 토스트
- 로딩 / 빈 상태 / 버튼 상태

예:
- 저장 성공 후 상세 페이지 이동
- 실패 시 alert 표시
- 성공 시 모달 닫기

### 4. `interceptor`

역할:
- 전역 정책

예:
- 401 재시도
- 세션 만료
- 공통 code / message 치환

넣지 않을 것:
- 특정 화면 전용 UX
- 특정 도메인 전용 후처리

## 어디에 둘지 판단 기준

- 여러 화면에서 반복되는 후처리
  - `composable`

- 현재 화면에서만 필요한 UX
  - `page`

- 모든 API에 공통 적용
  - `interceptor`

- 단순 호출
  - `service`

## 도메인 후처리 + UX/이동이 둘 다 필요한 경우

권장 분리:
1. `composable`
   - API 호출
   - 도메인 후처리
   - 결과 반환
2. `page`
   - 반환값 해석
   - 이동 / 토스트 / 모달 결정

예시 구조:

`composable`
- `saveSomething()`
- store 갱신
- cache invalidation
- 정규화된 결과 반환

`page`
- `await saveSomething()`
- 성공 시 `router.push(...)`
- 실패 시 `alert(...)`

한 줄 기준:
- "저장 후 상태 정리": `composable`
- "저장 후 어디로 갈지": `page`

예외:
- 로그인처럼 공통 흐름이 매우 강한 경우
  - `composable`에서 기본 이동 옵션 허용 가능
  - 최종 목적지는 `RouteLocationRaw` 등으로 화면에서 override 가능하게 유지

## 수정 시 먼저 볼 파일

인증 응답 shape 변경:
- `authPayload.ts`
- `useAuth.ts`
- `useAuthInitializer.ts`
- `refresh.ts`

API 응답 래핑 변경:
- `apiPayload.ts`
- 해당 composable / page
- `tests/api-payload.test.ts`

401 처리 정책 변경:
- `responseInterceptor.ts`
- `authInterceptorRules.ts`
- `tests/response-interceptor.test.ts`

## 최소 검증

1. `npx vue-tsc -b`
2. `npx eslint src --ext .ts,.vue`
3. `npm run test`

필수 범위:
- 인증 수정
- 인터셉터 수정
- 라우팅 수정
