# Types 폴더 - 최종 완성 버전 ✅

## 📅 최종 수정일

2025-01-22 - API 코드 주석 업데이트 (구분값 중복 해결)

## 📊 API 통계

- **전체 엔드포인트:** 188개 (180 → 188, +8)
- **전체 카테고리:** 42개 (39 → 42, +3)
- **전체 스키마:** 232개

## 🆕 최신 변경사항 (2025-01-22)

### API 코드 주석 추가

모든 타입 정의에 해당 API의 구분값(예: [P03-01], [R02D-08])이 주석으로 추가되었습니다.

**예시:**

```typescript
/**
 * 지점 상세 정보
 * Schema: BranchDetailResponse
 * API: [P02A-02] GET /api/branches/{branchId}
 */
export interface BranchDetailResponse { ... }
```

### API 변경사항 반영

- 등기 신청서 생성/수정 API 방식 변경 (Request Body → Query Parameter)
- RPA 사건 조회 스키마 변경
- 전자서명 타입 추가

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
