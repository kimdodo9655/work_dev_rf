# register-front

전자등기 프론트엔드 프로젝트입니다.  
Vue 3 + TypeScript + Vite 기반으로 구성되어 있습니다.

## 기술 스택

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- TanStack Vue Query
- Axios
- Sass

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

환경별 `.env` 파일을 확인/수정합니다.

- `.env.development`
- `.env.local`
- `.env.prod`
- `.env.example` (참고용)

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버 모드(백엔드 연동 기준)로 실행하려면:

```bash
npm run dev:server
```

## 주요 스크립트

- `npm run dev`: 로컬 개발 모드 실행
- `npm run dev:server`: development 모드 실행
- `npm run build:dev`: 타입체크 + development 빌드
- `npm run build`: 타입체크 + prod 빌드
- `npm run preview`: 빌드 결과 미리보기
- `npm run test`: 테스트 실행
- `npm run test:watch`: 테스트 watch 모드
- `npm run lint`: ESLint 자동 수정
- `npm run format`: Prettier 포맷
- `npm run generate:public-api-map`: 공개 API 맵 생성
- `npm run generate:code-replacements`: 코드 치환 매핑 생성

## 디렉터리 구조

```text
src/
  api/                # API 클라이언트, endpoints, 서비스
    endpoints/        # 도메인별 엔드포인트 정의
    services/         # 도메인별 API 호출 함수
  assets/             # 이미지, 전역 스타일
  components/         # 재사용 UI 컴포넌트만 유지 (layout, template)
  composables/        # 공통 훅
  constants/          # 상수
  features/           # 도메인 단위 기능 모듈
    app/
    auth/
    main/
    my/
    registration/
    estimate/
    shared/
    doc-templates/
    dev/
  router/             # 라우터 및 라우트 설정
    routes/           # 라우트 정의 분리
  stores/             # Pinia 스토어
  types/              # 타입 정의
  utils/              # 유틸리티
```

## 구조 규칙

- `src/components`: 재사용 가능한 순수 UI만 둡니다.
- `src/features`: 페이지/모달/도메인 로직은 기능 단위로 둡니다.
- 루트 오케스트레이션 화면(`RootPage`)은 `src/features/app`에 둡니다.
- 라우트 컴포넌트는 기본적으로 `src/features/*` 경로를 사용합니다.
- API 엔드포인트는 `src/api/endpoints/*`로 도메인 분리합니다.
- 백엔드와 1:1 매핑을 위한 키(`*_2` 등)는 유지합니다.

## 품질 체크 권장 순서

```bash
npm run lint
npm run test
npm run build:dev
```

## 참고

- Node.js LTS 환경 사용을 권장합니다.
- Husky + lint-staged가 설정되어 있어 커밋 시 린트/포맷이 동작합니다.
