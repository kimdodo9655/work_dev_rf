/**
 * 문서 경로: `@/src/api/endpoints/registry.ts`
 * 문서 제목: API 엔드포인트: registry
 */

export const REGISTRY_TEST = {
  CREATE_REQUEST: '/api/registry/test-data/requests',
  CREATE_PROGRESS: '/api/registry/test-data/progress',
  GENERATE: '/api/registry/test-data/scheduler/generate',
  GENERATE_MISSING_PROGRESS: '/api/registry/test-data/scheduler/generate-missing-progress',
  ASSIGN_MANAGERS: '/api/registry/test-data/scheduler/assign-managers',
  CREATE_COMBINE: '/api/registry/test-data/combine'
} as const

export const REGISTRY_REQUEST_DOCUMENT = {
  LIST: (requestNumber: string | number) => `/api/registry/requests/${requestNumber}/documents`,
  UPLOAD: (requestNumber: string | number) => `/api/registry/requests/${requestNumber}/documents`,
  DOWNLOAD: (requestNumber: string | number, fileName: string | number) =>
    `/api/registry/requests/${requestNumber}/documents/${fileName}`,
  DELETE: (requestNumber: string | number, fileName: string | number) =>
    `/api/registry/requests/${requestNumber}/documents/${fileName}`,
  DOWNLOAD_BASE64: (requestNumber: string | number, fileName: string | number) =>
    `/api/registry/requests/${requestNumber}/documents/${fileName}/base64`
} as const

export const REGISTRY_QUOTE = {
  LIST: '/api/registry/estimates',
  DETAIL: (registryRequestNumber: string | number) =>
    `/api/registry/estimates/requests/${registryRequestNumber}/info`,
  ACCEPT: (estimateId: string | number) => `/api/registry/estimates/${estimateId}/details`,
  REJECT: (registryRequestNumber: string | number) =>
    `/api/registry/estimates/requests/${registryRequestNumber}/submit`,
  ESTIMATES: (estimateId: string | number) => `/api/registry/estimates/${estimateId}`
} as const

export const REGISTRY_DASHBOARD = {
  SUMMARY: '/api/registry/progress/summary',
  TODAY: '/api/registry/progress/today',
  SUMMARY_2: '/api/registry/progress/estimates/summary',
  CASE_PROCESSING_STATUS: '/api/registry/progress/case-processing-status'
} as const

export const REGISTRY_PROGRESS = {
  LIST: '/api/registry/progress',
  BASIC_INFO: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/basic-info`,
  ASSIGN_MANAGER: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/assign-manager`,
  LOAN_INFO: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/loan-info`,
  OWNERSHIP_TRANSFER: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/ownership-transfer`,
  MORTGAGE: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/mortgage`,
  LEGAL_AGENT: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/legal-agent`,
  PROCESS: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/process`,
  CHANGE_PROCESS: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/process/change`
} as const

export const REGISTRY_PRIOR_LOAN = {
  SENIOR_LOAN_REPAYMENTS: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/senior-loan-repayments`
} as const

export const REGISTRY_TYPE = {
  APPLICATIONS: '/api/registry/applications',
  DELETE: (applicationId: string | number) => `/api/registry/applications/${applicationId}`,
  UPDATE: (applicationId: string | number) => `/api/registry/applications/${applicationId}`,
  LIST: '/api/registry/applications/tabs',
  DOCUMENTS: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/documents`,
  UNIFIED_FORM: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/forms/unified`
} as const

export const REGISTRY_CONTRACT = {
  DETAIL: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/contracts/parties`,
  SAVE: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/contracts/parties`,
  OWNERSHIP: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/contracts/ownership`,
  SAVE_2: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/contracts/ownership`,
  MORTGAGE: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/contracts/mortgage`,
  SAVE_3: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/contracts/mortgage`,
  SURFACE_RIGHT: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/contracts/surface-right`,
  SAVE_4: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/contracts/surface-right`
} as const

export const REGISTRY_PROPERTY = {
  DETAIL: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/properties`,
  REPLACE: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/properties`
} as const

export const REGISTRY_CERTIFICATE = {
  DETAIL: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/certificates`,
  REPLACE: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/certificates`
} as const

export const REGISTRY_DEBT_TAX = {
  DETAIL: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/mortgage/financial`,
  REPLACE: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/mortgage/financial`
} as const

export const REGISTRY_TAX = {
  DETAIL: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/ownership/tax/detail`,
  UPDATE: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/ownership/tax`
} as const

export const REGISTRY_ATTACHMENT = {
  DETAIL: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/attachments`,
  SAVE: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/attachments`,
  DOWNLOAD: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/attachments/download`,
  PREVIEW: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/attachments/preview`,
  DOC_INFO: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/attachments/docInfo`
} as const

export const REGISTRY_CHANGE = {
  DETAIL: (applicationId: string | number) => `/api/registry/applications/${applicationId}/changes`,
  REPLACE: (applicationId: string | number) => `/api/registry/applications/${applicationId}/changes`
} as const

export const REGISTRY_CORRECTION = {
  DETAIL: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/correction`,
  REPLACE: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/correction`
} as const

export const REGISTRY_CANCELLATION = {
  DETAIL: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/cancellations`,
  REPLACE: (applicationId: string | number) =>
    `/api/registry/applications/${applicationId}/cancellations`
} as const

export const REGISTRY_ADMIN_CONSENT = {
  LIST: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/admin-info-requests/list`,
  UPDATE: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/admin-info-requests`,
  DETAIL: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/admin-info-requests/detail`
} as const

export const REGISTRY_SIGNATURE = {
  DETAIL: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/e-signatures/detail`,
  REQUEST: (registryManagementNumber: string | number, eSignatureId: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/e-signatures/${eSignatureId}/request`,
  COMPLETE: (registryManagementNumber: string | number, eSignatureId: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/e-signatures/${eSignatureId}/complete`,
  RE_REQUEST: (registryManagementNumber: string | number, eSignatureId: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/e-signatures/${eSignatureId}/re-request`,
  LIST: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/e-signatures/list`
} as const

export const REGISTRY_TAX_REPORT = {
  DETAIL: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/tax-agencies/detail`,
  LIST: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/tax-agencies/list`,
  LIST_2: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/tax-agencies`
} as const

export const REGISTRY_HOUSING_BOND = {
  DETAIL: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/housing-bonds/detail`,
  DETAIL_2: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/housing-bonds`,
  LIST: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/housing-bonds/list`
} as const

export const REGISTRY_LOAN_ACCOUNT = {
  DETAIL: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts/detail`,
  LIST: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts/list`,
  SAVE: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts`,
  UPLOAD: (registryManagementNumber: string | number, loanPaymentAccountId: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts/${loanPaymentAccountId}/receipt`,
  DELETE: (registryManagementNumber: string | number, loanPaymentAccountId: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts/${loanPaymentAccountId}/receipt`,
  DOWNLOAD: (registryManagementNumber: string | number, loanPaymentAccountId: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts/${loanPaymentAccountId}/receipt`
} as const

export const REGISTRY_TRANSFER_CERTIFICATE = {
  LIST: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/transfer-cancellation-certificates`,
  REPLACE: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/transfer-cancellation-certificates`,
  DETAIL: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/transfer-cancellation-certificates/detail`
} as const

export const REGISTRY_CASE = {
  LIST: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/case-inquiries/list`,
  UPDATE: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/case-inquiries`,
  DETAIL: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/case-inquiries/detail`
} as const

export const REGISTRY_RECEIPT = {
  LIST: (registryManagementNumber: string | number) =>
    `/api/registry/applications/${registryManagementNumber}/receipts/list`,
  UPDATE: (registryManagementNumber: string | number) =>
    `/api/registry/applications/${registryManagementNumber}/receipts`,
  DETAIL: (registryManagementNumber: string | number) =>
    `/api/registry/applications/${registryManagementNumber}/receipts/detail`
} as const

export const REGISTRY_RECEIPT_DOCUMENT = {
  LIST: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/receipt-documents/list`,
  DETAIL: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/receipt-documents/detail`,
  CREATE: (registryManagementNumber: string | number, receiptDocumentId: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/receipt-documents/${receiptDocumentId}/document`,
  DELETE: (registryManagementNumber: string | number, receiptDocumentId: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/receipt-documents/${receiptDocumentId}/document`,
  DOCUMENT: (registryManagementNumber: string | number, receiptDocumentId: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/receipt-documents/${receiptDocumentId}/document`,
  FORM: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/receipt-documents/detail/form`,
  SAVE: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/receipt-documents`
} as const

export const REGISTRY_COMPLETION = {
  LIST: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/completion-documents/list`,
  DETAIL: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/completion-documents/detail`,
  UPLOAD: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/completion-documents/full-certificate/uploads`,
  UPLOAD_2: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/completion-documents/post-certificate/uploads`,
  PREVIEW_BASE64: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/completion-documents/post-certificate/preview`,
  DELETE_FULL: (registryManagementNumber: string | number, fileName: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/completion-documents/full-certificate/${fileName}`,
  DELETE_POST: (registryManagementNumber: string | number, fileName: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/completion-documents/post-certificate/${fileName}`
} as const

export const REGISTRY_PROGRESS_DOCUMENT = {
  TEMP_UPLOAD: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/documents/temp`,
  LIST: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/documents`,
  SAVE: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/documents`,
  DELETE: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/documents`,
  DOWNLOAD: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/documents/download`,
  DOWNLOAD_BASE64: (registryManagementNumber: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/documents/download/base64`,
  DELETE_2: (registryManagementNumber: string | number, applicationId: string | number) =>
    `/api/registry/progress/${registryManagementNumber}/applications/${applicationId}/documents`
} as const

export const REGISTRY_SCHEDULE = {
  LIST: '/api/registry/progress/schedules'
} as const
