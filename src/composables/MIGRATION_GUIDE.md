# 마이그레이션 가이드

기존 composables 사용 코드를 새로운 구조로 마이그레이션하는 가이드입니다.

## 📌 변경 사항 요약

### 폴더 구조 변경

```diff
composables/
- ├── useAuth.ts
- ├── useAddress.ts
- ├── useCodes.ts
- ├── useDialog.ts
- ├── useErrorHandler.ts
- ├── useMessage.ts
- ├── useDeviceDetection.ts
- ├── useExternalLinks.ts
- ├── useAuthInitializer.ts
- └── mutations/
-     ├── useOrganization.ts
-     └── ...

+ ├── api/                    # 🆕 API 관련 composable
+ │   ├── useAuth.ts
+ │   ├── useAddress.ts
+ │   ├── useCodes.ts
+ │   ├── useOrganization.ts
+ │   └── ... (39개 파일)
+ └── utils/                  # 🆕 유틸리티 composable
+     ├── useDialog.ts
+     ├── useErrorHandler.ts
+     └── ... (6개 파일)
```

## 🔄 Import 경로 변경

### 1. API 관련 Composables (9개)

기존 루트에 있던 파일들이 `api/` 폴더로 이동했습니다.

#### useAuth

```diff
- import { useAuth } from '@/composables/useAuth'
+ import { useAuth } from '@/composables/api/useAuth'
```

**함수명 변경 없음** - 그대로 사용하세요:
```typescript
const { login, logout, isAuthenticated, isLoading } = useAuth()
```

#### useAddress

```diff
- import { useAddress } from '@/composables/useAddress'
+ import { useAddress } from '@/composables/api/useAddress'
```

**함수명 변경 없음** - 그대로 사용하세요:
```typescript
const { searchAddresses, addresses, isLoading } = useAddress()
```

#### useCodes

```diff
- import { useCodes } from '@/composables/useCodes'
+ import { useCodes } from '@/composables/api/useCodes'
```

**함수명 변경 없음** - 그대로 사용하세요:
```typescript
const { fetchAllCodes, getCodeLabel, getCodeOptions } = useCodes()
```

### 2. 유틸리티 Composables (6개)

기존 루트에 있던 파일들이 `utils/` 폴더로 이동했습니다.

#### useDialog

```diff
- import { useDialog } from '@/composables/useDialog'
+ import { useDialog } from '@/composables/utils/useDialog'
```

**함수명 변경 없음**

#### useErrorHandler

```diff
- import { useErrorHandler } from '@/composables/useErrorHandler'
+ import { useErrorHandler } from '@/composables/utils/useErrorHandler'
```

**함수명 변경 없음**

#### useMessage

```diff
- import { useMessage } from '@/composables/useMessage'
+ import { useMessage } from '@/composables/utils/useMessage'
```

**함수명 변경 없음**

#### useDeviceDetection

```diff
- import { useDeviceDetection } from '@/composables/useDeviceDetection'
+ import { useDeviceDetection } from '@/composables/utils/useDeviceDetection'
```

**함수명 변경 없음**

#### useExternalLinks

```diff
- import { useExternalLinks } from '@/composables/useExternalLinks'
+ import { useExternalLinks } from '@/composables/utils/useExternalLinks'
```

**함수명 변경 없음**

#### useAuthInitializer

```diff
- import { useAuthInitializer } from '@/composables/useAuthInitializer'
+ import { useAuthInitializer } from '@/composables/utils/useAuthInitializer'
```

**함수명 변경 없음**

### 3. Mutations 폴더 (36개)

`mutations/` 폴더가 제거되고 모든 파일이 `api/` 폴더로 이동했습니다.

```diff
- import { useOrganization } from '@/composables/mutations/useOrganization'
+ import { useOrganization } from '@/composables/api/useOrganization'

- import { useBranch } from '@/composables/mutations/useBranch'
+ import { useBranch } from '@/composables/api/useBranch'

- import { useUser } from '@/composables/mutations/useUser'
+ import { useUser } from '@/composables/api/useUser'
```

**모든 mutations 폴더 파일들**:
- `mutations/` → `api/`로 변경
- 파일명과 함수명은 변경 없음

## 📋 전체 변경 목록

### API Composables (api/)

| 기존 경로 | 새 경로 |
|---------|--------|
| `@/composables/useAuth` | `@/composables/api/useAuth` |
| `@/composables/useAddress` | `@/composables/api/useAddress` |
| `@/composables/useCodes` | `@/composables/api/useCodes` |
| `@/composables/mutations/useOrganization` | `@/composables/api/useOrganization` |
| `@/composables/mutations/useBranch` | `@/composables/api/useBranch` |
| `@/composables/mutations/useBranchBank` | `@/composables/api/useBranchBank` |
| `@/composables/mutations/useBranchPayment` | `@/composables/api/useBranchPayment` |
| `@/composables/mutations/useBranchRegistry` | `@/composables/api/useBranchRegistry` |
| `@/composables/mutations/useBranchPrepaid` | `@/composables/api/useBranchPrepaid` |
| `@/composables/mutations/useBranchDocument` | `@/composables/api/useBranchDocument` |
| `@/composables/mutations/useUser` | `@/composables/api/useUser` |
| `@/composables/mutations/useNotification` | `@/composables/api/useNotification` |
| `@/composables/mutations/useAnnouncement` | `@/composables/api/useAnnouncement` |
| `@/composables/mutations/useRegistryOfficeDocument` | `@/composables/api/useRegistryOfficeDocument` |
| `@/composables/mutations/useRegistryEstimate` | `@/composables/api/useRegistryEstimate` |
| `@/composables/mutations/useRegistryDashboard` | `@/composables/api/useRegistryDashboard` |
| `@/composables/mutations/useRegistryBasic` | `@/composables/api/useRegistryBasic` |
| `@/composables/mutations/useRegistryPriorLoan` | `@/composables/api/useRegistryPriorLoan` |
| `@/composables/mutations/useRegistryType` | `@/composables/api/useRegistryType` |
| `@/composables/mutations/useRegistryContract` | `@/composables/api/useRegistryContract` |
| `@/composables/mutations/useRegistryProperty` | `@/composables/api/useRegistryProperty` |
| `@/composables/mutations/useRegistryCertificate` | `@/composables/api/useRegistryCertificate` |
| `@/composables/mutations/useRegistryDebtTax` | `@/composables/api/useRegistryDebtTax` |
| `@/composables/mutations/useRegistryTax` | `@/composables/api/useRegistryTax` |
| `@/composables/mutations/useRegistryAttachment` | `@/composables/api/useRegistryAttachment` |
| `@/composables/mutations/useRegistryChange` | `@/composables/api/useRegistryChange` |
| `@/composables/mutations/useRegistryCorrection` | `@/composables/api/useRegistryCorrection` |
| `@/composables/mutations/useRegistryCancellation` | `@/composables/api/useRegistryCancellation` |
| `@/composables/mutations/useRegistryAdminConsent` | `@/composables/api/useRegistryAdminConsent` |
| `@/composables/mutations/useRegistryElectronicSignature` | `@/composables/api/useRegistryElectronicSignature` |
| `@/composables/mutations/useRegistryTaxAgency` | `@/composables/api/useRegistryTaxAgency` |
| `@/composables/mutations/useRegistryHousingBond` | `@/composables/api/useRegistryHousingBond` |
| `@/composables/mutations/useRegistryLoanPayment` | `@/composables/api/useRegistryLoanPayment` |
| `@/composables/mutations/useRegistryTransferCertificate` | `@/composables/api/useRegistryTransferCertificate` |
| `@/composables/mutations/useRegistryCase` | `@/composables/api/useRegistryCase` |
| `@/composables/mutations/useRegistryReceipt` | `@/composables/api/useRegistryReceipt` |
| `@/composables/mutations/useRegistryCompletion` | `@/composables/api/useRegistryCompletion` |
| `@/composables/mutations/useRegistryProgressDocument` | `@/composables/api/useRegistryProgressDocument` |
| `@/composables/mutations/useRpa` | `@/composables/api/useRpa` |

### 유틸리티 Composables (utils/)

| 기존 경로 | 새 경로 |
|---------|--------|
| `@/composables/useDialog` | `@/composables/utils/useDialog` |
| `@/composables/useErrorHandler` | `@/composables/utils/useErrorHandler` |
| `@/composables/useMessage` | `@/composables/utils/useMessage` |
| `@/composables/useDeviceDetection` | `@/composables/utils/useDeviceDetection` |
| `@/composables/useExternalLinks` | `@/composables/utils/useExternalLinks` |
| `@/composables/useAuthInitializer` | `@/composables/utils/useAuthInitializer` |

## 🔍 자동 변경 방법

### VS Code에서 일괄 변경

1. **Find and Replace 열기**: `Ctrl + Shift + H` (Windows/Linux) 또는 `Cmd + Shift + H` (Mac)

2. **정규식 모드 활성화**: `.*` 아이콘 클릭

3. **다음 패턴으로 변경**:

#### API Composables
```
Find: @/composables/(useAuth|useAddress|useCodes)
Replace: @/composables/api/$1
```

#### Mutations → API
```
Find: @/composables/mutations/(use\w+)
Replace: @/composables/api/$1
```

#### Utils
```
Find: @/composables/(useDialog|useErrorHandler|useMessage|useDeviceDetection|useExternalLinks|useAuthInitializer)
Replace: @/composables/utils/$1
```

### 명령어로 일괄 변경 (Linux/Mac)

```bash
# API composables
find src -type f -name "*.vue" -o -name "*.ts" | xargs sed -i "s|@/composables/useAuth|@/composables/api/useAuth|g"
find src -type f -name "*.vue" -o -name "*.ts" | xargs sed -i "s|@/composables/useAddress|@/composables/api/useAddress|g"
find src -type f -name "*.vue" -o -name "*.ts" | xargs sed -i "s|@/composables/useCodes|@/composables/api/useCodes|g"

# Mutations → API
find src -type f -name "*.vue" -o -name "*.ts" | xargs sed -i "s|@/composables/mutations/|@/composables/api/|g"

# Utils
find src -type f -name "*.vue" -o -name "*.ts" | xargs sed -i "s|@/composables/useDialog|@/composables/utils/useDialog|g"
find src -type f -name "*.vue" -o -name "*.ts" | xargs sed -i "s|@/composables/useErrorHandler|@/composables/utils/useErrorHandler|g"
find src -type f -name "*.vue" -o -name "*.ts" | xargs sed -i "s|@/composables/useMessage|@/composables/utils/useMessage|g"
find src -type f -name "*.vue" -o -name "*.ts" | xargs sed -i "s|@/composables/useDeviceDetection|@/composables/utils/useDeviceDetection|g"
find src -type f -name "*.vue" -o -name "*.ts" | xargs sed -i "s|@/composables/useExternalLinks|@/composables/utils/useExternalLinks|g"
find src -type f -name "*.vue" -o -name "*.ts" | xargs sed -i "s|@/composables/useAuthInitializer|@/composables/utils/useAuthInitializer|g"
```

## ✅ 마이그레이션 체크리스트

- [ ] 1. 기존 `composables/` 폴더 백업
- [ ] 2. 새로운 `composables/` 폴더로 교체
- [ ] 3. API composables import 경로 변경
  - [ ] useAuth
  - [ ] useAddress
  - [ ] useCodes
  - [ ] mutations 폴더의 모든 파일들
- [ ] 4. 유틸리티 composables import 경로 변경
  - [ ] useDialog
  - [ ] useErrorHandler
  - [ ] useMessage
  - [ ] useDeviceDetection
  - [ ] useExternalLinks
  - [ ] useAuthInitializer
- [ ] 5. 빌드 에러 확인 (`npm run build` 또는 `yarn build`)
- [ ] 6. 타입 에러 확인 (`npm run type-check`)
- [ ] 7. 개발 서버 실행 및 테스트 (`npm run dev`)

## ⚠️ 주의사항

1. **함수명과 반환값은 변경 없음**
   - import 경로만 변경하면 됩니다
   - 기존 코드 로직은 수정 불필요

2. **mutations 폴더 제거**
   - 더 이상 `mutations/` 폴더를 사용하지 않습니다
   - 모든 API 관련 파일은 `api/` 폴더에 있습니다

3. **점진적 마이그레이션 가능**
   - 한 번에 모든 파일을 변경할 필요 없습니다
   - 필요한 파일부터 순차적으로 변경 가능합니다

4. **백업 권장**
   - 마이그레이션 전에 기존 코드를 백업하세요
   - Git commit 후 작업하는 것을 권장합니다

## 🆘 문제 해결

### 빌드 에러: "Cannot find module '@/composables/useXXX'"

**원인**: import 경로가 변경되지 않았습니다.

**해결**:
```typescript
// ❌ 잘못된 경로
import { useAuth } from '@/composables/useAuth'

// ✅ 올바른 경로
import { useAuth } from '@/composables/api/useAuth'
```

### 타입 에러: 함수를 찾을 수 없음

**원인**: 잘못된 경로에서 import했습니다.

**해결**: 위의 변경 목록을 참고하여 올바른 경로로 수정하세요.

## 📞 추가 지원

문제가 발생하면 README.md를 참고하거나 팀에 문의하세요.
