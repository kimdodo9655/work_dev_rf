# Types 폴더 - 최종 완성 버전 ✅

## 📅 최종 수정일

2025-01-26 - API 엔드포인트 195개 반영, R02W 영수증 타입 추가

## 📊 API 통계

- **전체 엔드포인트:** 195개 (188 → 195, +7개)
- **전체 카테고리:** 43개 (42 → 43, +1개)
- **삭제 예정 제외:** 3개 (R02D-05, R02D-06, R02D-07)

## 🆕 최신 변경사항 (2025-01-26)

### 1. 엔티티 수정
- **RegistryRequestEstimate** (견적 정보)
  - `estimatorUserId` 필드 추가 (견적서 작성자 사용자 ID)
  - `registryMethod` 타입 변경: `string` → `'ELECTRONIC' | 'E_FORM' | 'PAPER'`

### 2. API 추가 (R02W 영수증)
- [R02W-01] 등기 영수증 목록 조회
- [R02W-02] 등기 영수증 상세 조회
- [R02W-03] 등기 영수증 전자문서 생성
- [R02W-04] 등기 영수증 전자문서 삭제
- [R02W-05] 등기 영수증 전자문서 조회

### 3. API 수정
- **[R01-03] 견적서 상세 조회**
  - `LegalAgentInfo.qualifiedName` → `estimatorName`
  - `LegalAgentInfo.branchPhone` → `branchAddress`
  
- **[R01-04] 견적서 제출**
  - `agreed` 필드 삭제 (프론트엔드에서만 체크)

- **R02D → R02B 이동 (삭제 예정)**
  - [R02D-05] → [R02B-05] 소유권이전 조회
  - [R02D-06] → [R02B-06] 근저당권 조회
  - [R02D-07] → [R02B-07] 법무대리인 조회

### 4. 공통코드 추가
- **[P06-23]** 등기 진행 유형 목록 (`progressTypes`)

## 📦 포함 내용

**총 26개 타입 파일 (API 코드 주석 포함)**

```
types/
├── api.ts                    # 공통 API 타입
├── common.ts                 # 공통 유틸리티 타입
├── dialog.ts                 # 다이얼로그 타입
├── env.d.ts                  # 환경변수 타입
├── error.ts                  # 에러 타입
├── index.ts                  # 통합 export
└── domains/
    ├── address.ts            # 주소 관련 타입 (API 코드 포함)
    ├── auth.ts               # 인증 관련 타입 (API 코드 포함)
    ├── bank.ts               # 금융기관 타입 (API 코드 포함)
    ├── branch.ts             # 지점 타입 (API 코드 포함)
    ├── code.ts               # 공통코드 타입 (API 코드 포함)
    ├── notification.ts       # 알림 타입 (API 코드 포함)
    ├── organization.ts       # 기관 타입 (API 코드 포함)
    ├── user.ts               # 사용자 타입 (API 코드 포함)
    └── registry/             # 등기 관련 타입 (모두 API 코드 포함)
        ├── admin-info.ts
        ├── application.ts
        ├── attachment.ts
        ├── certificate.ts
        ├── contract.ts
        ├── estimate.ts
        ├── index.ts
        ├── progress.ts
        ├── property-tax.ts
        ├── receipt.ts
        └── rpa.ts
```

## 🔍 API 코드 찾기

각 타입의 주석에서 해당 API 코드를 확인할 수 있습니다:

```typescript
// 예시 1
/**
 * Schema: UserDetailResponse
 * API: [P03-01] GET /api/users/profile
 * API: [P03-03] GET /api/users/{userId}
 */

// 예시 2
/**
 * Schema: RegistryApplicationFormResponse
 * API: [R02D-08] GET /api/registry/applications/tabs
 */
```
