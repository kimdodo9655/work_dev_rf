# Composables 사용 가이드

Vue3 + TypeScript + @tanstack/vue-query 환경을 위한 Composable 모음입니다.

## 📁 폴더 구조

```
composables/
├── api/                    # API 관련 Composable (39개)
│   ├── useAuth.ts         # [P04] 인증 (완성 - mutation)
│   ├── useAddress.ts      # [A01] 주소/등기소 (완성 - query)
│   ├── useCodes.ts        # [P06] 공통코드 (완성 - query)
│   ├── useOrganization.ts # [P01] 기관 (구현 필요 - mutation)
│   ├── useBranch.ts       # [P02A] 지점-기본 (구현 필요 - mutation)
│   ├── useUser.ts         # [P03] 사용자 (구현 필요 - mutation)
│   └── ... (36개 도메인별 파일)
│
└── utils/                  # 유틸리티 Composable (6개)
    ├── useDialog.ts       # 다이얼로그 관리
    ├── useErrorHandler.ts # 에러 핸들링
    ├── useMessage.ts      # 메시지 관리
    ├── useDeviceDetection.ts # 디바이스 감지
    ├── useExternalLinks.ts # 외부 링크 관리
    └── useAuthInitializer.ts # 인증 초기화
```

## 🚀 사용 방법

### API Composables

```typescript
// 인증 (완성됨)
import { useAuth } from '@/composables/api/useAuth'
const { login, logout, isAuthenticated, isLoading } = useAuth()

// 주소 검색 (완성됨)
import { useAddress } from '@/composables/api/useAddress'
const { searchAddresses, addresses, isLoading } = useAddress()

// 공통코드 (완성됨)
import { useCodes } from '@/composables/api/useCodes'
const { fetchAllCodes, getCodeLabel, getCodeOptions } = useCodes()

// 기관 (구현 필요)
import { useOrganization } from '@/composables/api/useOrganization'
const { updateOrganization, isLoading } = useOrganization()

// 지점 (구현 필요)
import { useBranch } from '@/composables/api/useBranch'
const { createBranch, updateBranch, isLoading } = useBranch()

// 사용자 (구현 필요)
import { useUser } from '@/composables/api/useUser'
const { createUser, updateUser, isLoading } = useUser()
```

### 유틸리티 Composables

```typescript
// 다이얼로그
import { useDialog } from '@/composables/utils/useDialog'
const { alert, confirm } = useDialog()

await alert({ title: '알림', message: '저장되었습니다.' })
const result = await confirm({ title: '확인', message: '삭제하시겠습니까?' })

// 에러 핸들러
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
const { handleError } = useErrorHandler()

// 메시지
import { useMessage } from '@/composables/utils/useMessage'
const { showSuccess, showError } = useMessage()
```

## 📋 완성된 Composables (3개)

### 1. useAuth.ts ✅
- **기능**: 로그인, 로그아웃
- **상태**: 완성됨
- **사용 예시**:
```typescript
import { useAuth } from '@/composables/api/useAuth'

const { login, logout, isAuthenticated, isLoading } = useAuth()

// 로그인
await login({ 
  loginId: 'admin', 
  password: 'password' 
}, {
  redirectTo: '/dashboard'
})

// 로그아웃
await logout()
```

### 2. useAddress.ts ✅
- **기능**: 주소 검색, 자동완성
- **상태**: 완성됨
- **사용 예시**:
```typescript
import { useAddress } from '@/composables/api/useAddress'

const { 
  searchAddresses, 
  getAddressSuggestions,
  addresses, 
  suggestions,
  isLoading 
} = useAddress()

// 주소 검색
await searchAddresses('서울시 강남구')

// 자동완성
await getAddressSuggestions('서울')
```

### 3. useCodes.ts ✅
- **기능**: 공통코드 조회
- **상태**: 완성됨
- **사용 예시**:
```typescript
import { useCodes } from '@/composables/api/useCodes'

const { 
  fetchAllCodes, 
  getCodeLabel, 
  getCodeOptions,
  codes 
} = useCodes()

// 전체 코드 조회
await fetchAllCodes()

// 코드 라벨 가져오기
const label = getCodeLabel('organizationStatuses', 'ACTIVE') // '사용'

// 셀렉트 옵션으로 변환
const options = getCodeOptions('organizationStatuses')
// [{ value: 'ACTIVE', label: '사용' }, ...]
```

## 🔨 구현이 필요한 Composables (36개)

나머지 36개 파일은 기본 틀만 작성되어 있으며, TODO 주석을 확인하여 구현이 필요합니다:

- useOrganization.ts - [P01] 기관
- useBranch.ts - [P02A] 지점-기본
- useBranchBank.ts - [P02B] 지점-금융기관배정
- useBranchPayment.ts - [P02C] 지점-지급계좌
- useBranchRegistry.ts - [P02D] 지점-인터넷등기소
- useBranchPrepaid.ts - [P02E] 지점-선불지급수단
- useBranchDocument.ts - [P02F] 지점-문서
- useUser.ts - [P03] 사용자
- useNotification.ts - [P07] 알림
- useAnnouncement.ts - [P08] 공지사항
- useRegistry*.ts - 등기 관련 (26개 파일)
- useRpa.ts - [RPAC] RPA 작업

각 파일의 TODO 주석을 확인하여 순차적으로 구현하세요.

## 📝 구현 가이드

### 기본 패턴

```typescript
/**
 * @file useXXX.ts
 * @description XXX 관련 API Composable
 * @domain [구분값] 도메인명
 */

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useXXX() {
  const queryClient = useQueryClient()

  // ============================================================================
  // Mutations
  // ============================================================================
  
  // [구분값-번호] API 이름 : useMutation
  const xxxMutation = useMutation({
    mutationFn: async (params) => xxxAPI.method(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xxx'] })
    }
  })

  // ============================================================================
  // Queries (필요시)
  // ============================================================================
  
  // [구분값-번호] API 이름 : useQuery
  const xxxQuery = useQuery({
    queryKey: ['xxx'],
    queryFn: () => xxxAPI.get()
  })

  // ============================================================================
  // Helper Functions
  // ============================================================================
  
  const xxx = async (params) => {
    await xxxMutation.mutateAsync(params)
  }

  // ============================================================================
  // Computed States
  // ============================================================================
  
  const isLoading = computed(() => xxxMutation.isPending.value)

  // ============================================================================
  // Return
  // ============================================================================
  
  return {
    // Mutations
    xxxMutation,
    
    // Queries
    xxxQuery,
    
    // Helper Functions
    xxx,
    
    // Computed States
    isLoading
  }
}
```

### 구현 단계

1. **API Service 연결**: api/services에서 API 함수 import
2. **타입 정의**: types 폴더에서 필요한 타입 import
3. **Mutation 구현**: mutationFn에 API 함수 연결
4. **Query 구현** (필요시): queryFn에 API 함수 연결
5. **쿼리 무효화**: onSuccess에서 관련 쿼리 무효화
6. **헬퍼 함수**: 비즈니스 로직 포함한 래퍼 함수 작성
7. **상태 관리**: isLoading, isError 등 computed 상태 작성

## 🔗 관련 파일

- **API Services**: `api/services/*.ts` - 실제 API 호출 함수
- **Types**: `types/domains/*.ts` - 타입 정의
- **Endpoints**: `api/endpoints/index.ts` - API 엔드포인트 상수

## 💡 Tips

1. **Mutation vs Query**
   - Mutation: POST, PUT, PATCH, DELETE (데이터 변경)
   - Query: GET (데이터 조회)

2. **쿼리 무효화**
   ```typescript
   onSuccess: () => {
     // 단일 키
     queryClient.invalidateQueries({ queryKey: ['organizations'] })
     
     // 특정 ID 포함
     queryClient.invalidateQueries({ 
       queryKey: ['organization', organizationId] 
     })
     
     // 여러 쿼리
     queryClient.invalidateQueries({ queryKey: ['organizations'] })
     queryClient.invalidateQueries({ queryKey: ['branches'] })
   }
   ```

3. **에러 처리**
   ```typescript
   const xxx = async (params) => {
     try {
       await xxxMutation.mutateAsync(params)
       // 성공 처리
     } catch (error) {
       // 에러 처리
       throw error
     }
   }
   ```

4. **로딩 상태**
   ```typescript
   // 단일 mutation
   const isLoading = computed(() => xxxMutation.isPending.value)
   
   // 여러 mutation
   const isLoading = computed(() => 
     createMutation.isPending.value || 
     updateMutation.isPending.value
   )
   ```

## 📦 설치 방법

프로젝트의 `src/composables/` 디렉토리에 압축을 해제하세요.

```bash
cd src/composables
# 압축 파일 복사 후
unzip composables.zip
```

## 🔄 마이그레이션

기존 코드에서 사용하던 import 경로를 변경해야 합니다.
자세한 내용은 `MIGRATION_GUIDE.md`를 참고하세요.
