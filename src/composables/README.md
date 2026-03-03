# Composables 가이드

`src/composables`는 화면에서 재사용하는 Composition API 유틸리티를 관리하는 디렉터리입니다.

## 디렉터리 구조

```text
src/composables/
  api/
    useAddress.ts
    useAuth.ts
    useBranch.ts
    useBranchBank.ts
    useCodes.ts
  utils/
    useAccordionState.ts
    useApiAlert.ts
    useAuthInitializer.ts
    useCodeReplacer.ts
    useDeviceDetection.ts
    useDialog.ts
    useErrorHandler.ts
    useExternalLinks.ts
    useMessage.ts
    useThrottle.ts
  viewer.html
```

## 분류 기준

- `api/*`: API 서비스 래핑 + 캐시/쿼리 로직 중심 composable
- `utils/*`: UI/상태/헬퍼 로직 중심 composable

## 사용 규칙

- Composable 파일명은 `useXxx.ts` 형식을 유지합니다.
- 도메인 화면(`src/features/*`)에서 우선 사용하고, 공통 UI(`src/components/*`)는 필요한 경우에만 사용합니다.
- API 호출은 `src/api/services/*`를 통해 수행하고, 엔드포인트는 `src/api/endpoints/*`에서 관리합니다.
- 에러/알림 처리는 `useErrorHandler`, `useApiAlert`, `useMessage` 패턴을 우선 사용합니다.

## import 예시

```ts
import { useAuth } from '@/composables/api/useAuth'
import { useCodes } from '@/composables/api/useCodes'
import { useDialog } from '@/composables/utils/useDialog'
```

## 관련 경로

- API 서비스: `src/api/services/*`
- API 엔드포인트: `src/api/endpoints/*`
- 기능 화면: `src/features/*`
- 재사용 UI: `src/components/layout`, `src/components/template`
