/**
 * 문서 경로: `@/src/api/endpoints/rpa.ts`
 * 문서 제목: API 엔드포인트: rpa
 */

export const RPA = {
  CREATE: (registryManagementNumber: string | number) =>
    `/api/registry/rpa/user-tasks/${registryManagementNumber}/full-certificate-view`,
  CREATE_2: (registryManagementNumber: string | number) =>
    `/api/registry/rpa/user-tasks/${registryManagementNumber}/property-description`,
  CREATE_3: (registryManagementNumber: string | number) =>
    `/api/registry/rpa/user-tasks/${registryManagementNumber}/registration-password`,
  CREATE_4: (registryManagementNumber: string | number) =>
    `/api/registry/rpa/user-tasks/${registryManagementNumber}/etax-acquisition`,
  CREATE_5: (registryManagementNumber: string | number) =>
    `/api/registry/rpa/user-tasks/${registryManagementNumber}/etax-registration`,
  CREATE_6: (registryManagementNumber: string | number) =>
    `/api/registry/rpa/user-tasks/${registryManagementNumber}/wetax-acquisition`,
  CREATE_7: (registryManagementNumber: string | number) =>
    `/api/registry/rpa/user-tasks/${registryManagementNumber}/wetax-registration`,
  CREATE_8: (registryManagementNumber: string | number) =>
    `/api/registry/rpa/user-tasks/${registryManagementNumber}/registration-case`,
  CREATE_9: (registryManagementNumber: string | number) =>
    `/api/registry/rpa/user-tasks/${registryManagementNumber}/admin-consent`,
  CREATE_10: (registryManagementNumber: string | number) =>
    `/api/registry/rpa/user-tasks/${registryManagementNumber}/registration-application`,
  USER_TASKS: (taskToken: string | number) => `/api/registry/rpa/user-tasks/${taskToken}`,
  RESULT: (taskToken: string | number) => `/api/registry/rpa/user-tasks/${taskToken}/result`,
  CREATE_FULL_CERTIFICATE_ISSUE: (registryManagementNumber: string | number) =>
    `/api/registry/rpa/user-tasks/${registryManagementNumber}/full-certificate-issue`
} as const
