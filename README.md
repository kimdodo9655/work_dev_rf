# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

```
register-front
├─ .editorconfig
├─ .env.development
├─ .env.example
├─ .env.local
├─ .env.prod
├─ .husky
│  ├─ _
│  │  ├─ applypatch-msg
│  │  ├─ commit-msg
│  │  ├─ h
│  │  ├─ husky.sh
│  │  ├─ post-applypatch
│  │  ├─ post-checkout
│  │  ├─ post-commit
│  │  ├─ post-merge
│  │  ├─ post-rewrite
│  │  ├─ pre-applypatch
│  │  ├─ pre-auto-gc
│  │  ├─ pre-commit
│  │  ├─ pre-merge-commit
│  │  ├─ pre-push
│  │  ├─ pre-rebase
│  │  └─ prepare-commit-msg
│  └─ pre-commit
├─ .prettierrc
├─ README.md
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.ico
│  ├─ fonts
│  │  ├─ Roboto_Mono
│  │  │  ├─ OFL.txt
│  │  │  ├─ README.txt
│  │  │  └─ RobotoMono-SemiBold.ttf
│  │  └─ pretendard
│  │     ├─ LICENSE.txt
│  │     ├─ woff
│  │     │  ├─ Pretendard-ExtraBold.woff
│  │     │  ├─ Pretendard-Light.woff
│  │     │  ├─ Pretendard-Regular.woff
│  │     │  └─ Pretendard-SemiBold.woff
│  │     └─ woff2
│  │        ├─ Pretendard-ExtraBold.woff2
│  │        ├─ Pretendard-Light.woff2
│  │        ├─ Pretendard-Regular.woff2
│  │        └─ Pretendard-SemiBold.woff2
│  ├─ pdf
│  │  └─ pdf.pdf
│  └─ vite.svg
├─ src
│  ├─ App.vue
│  ├─ api
│  │  ├─ client.ts
│  │  ├─ endpoints.ts
│  │  ├─ openapi.json
│  │  ├─ services
│  │  │  ├─ address.ts
│  │  │  ├─ auth.ts
│  │  │  ├─ bank.ts
│  │  │  ├─ branch.ts
│  │  │  ├─ branch_bank.ts
│  │  │  ├─ branch_document.ts
│  │  │  ├─ branch_payment.ts
│  │  │  ├─ branch_prepaid.ts
│  │  │  ├─ branch_registry.ts
│  │  │  ├─ code.ts
│  │  │  ├─ notice.ts
│  │  │  ├─ notification.ts
│  │  │  ├─ organization.ts
│  │  │  ├─ registry
│  │  │  │  ├─ admin_consent.ts
│  │  │  │  ├─ attachment.ts
│  │  │  │  ├─ cancellation.ts
│  │  │  │  ├─ case.ts
│  │  │  │  ├─ certificate.ts
│  │  │  │  ├─ change.ts
│  │  │  │  ├─ completion.ts
│  │  │  │  ├─ contract.ts
│  │  │  │  ├─ correction.ts
│  │  │  │  ├─ dashboard.ts
│  │  │  │  ├─ debt_tax.ts
│  │  │  │  ├─ housing_bond.ts
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ loan_account.ts
│  │  │  │  ├─ prior_loan.ts
│  │  │  │  ├─ progress.ts
│  │  │  │  ├─ progress_document.ts
│  │  │  │  ├─ property.ts
│  │  │  │  ├─ quote.ts
│  │  │  │  ├─ receipt.ts
│  │  │  │  ├─ receipt_document.ts
│  │  │  │  ├─ request_document.ts
│  │  │  │  ├─ schedule.ts
│  │  │  │  ├─ signature.ts
│  │  │  │  ├─ tax.ts
│  │  │  │  ├─ tax_report.ts
│  │  │  │  ├─ test.ts
│  │  │  │  ├─ transfer_certificate.ts
│  │  │  │  └─ type.ts
│  │  │  ├─ rpa.ts
│  │  │  └─ user.ts
│  │  └─ services_old
│  │     ├─ address.ts
│  │     ├─ auth.ts
│  │     ├─ bank.ts
│  │     └─ code.ts
│  ├─ assets
│  │  ├─ images
│  │  │  ├─ error
│  │  │  │  ├─ computer-error.svg
│  │  │  │  ├─ error-404.svg
│  │  │  │  └─ mobile-phone.svg
│  │  │  └─ logo
│  │  │     ├─ bankclear_logo.png
│  │  │     ├─ bankclear_logo_bk.png
│  │  │     ├─ bankclear_logo_gray.png
│  │  │     ├─ etax_color.png
│  │  │     ├─ iros.png
│  │  │     ├─ iros_color.png
│  │  │     ├─ test_bank_logo.png
│  │  │     ├─ wetax.png
│  │  │     └─ wetax_color.png
│  │  └─ styles
│  │     ├─ _dev.scss
│  │     ├─ _rayout.scss
│  │     ├─ _reset.scss
│  │     ├─ _template.scss
│  │     ├─ _typography.scss
│  │     ├─ _variables.scss
│  │     ├─ global.scss
│  │     └─ pages
│  │        ├─ auth.scss
│  │        └─ error.scss
│  ├─ components
│  │  ├─ auth
│  │  │  ├─ modals
│  │  │  │  ├─ SignupAssignBankModal.vue
│  │  │  │  ├─ SignupBranchBizModal.vue
│  │  │  │  ├─ SignupOrgAdminDataModal.vue
│  │  │  │  ├─ SignupOrgBasicInfoModal.vue
│  │  │  │  └─ SignupResponsibleBankModal.vue
│  │  │  └─ pages
│  │  │     ├─ AccessBlockEmailPage.vue
│  │  │     ├─ AccessBlockMacPage.vue
│  │  │     ├─ AccessBlockUserPage.vue
│  │  │     ├─ AutoLogoutPage.vue
│  │  │     ├─ LoginPage.vue
│  │  │     ├─ PasswordSetupPage.vue
│  │  │     ├─ ProgramInstallPage.vue
│  │  │     └─ SignupPage.vue
│  │  ├─ dev
│  │  │  ├─ AddrTest.vue
│  │  │  ├─ ApiTester.vue
│  │  │  ├─ DevNav.vue
│  │  │  ├─ DevTestView.vue
│  │  │  ├─ PdfTest.vue
│  │  │  ├─ RPATest.vue
│  │  │  └─ TEMP
│  │  │     ├─ TempInput.vue
│  │  │     └─ TempPdf.vue
│  │  ├─ estimate
│  │  │  └─ pages
│  │  │     ├─ EstimateDetailPage.vue
│  │  │     └─ EstimateMgmtPage.vue
│  │  ├─ main
│  │  │  └─ pages
│  │  │     ├─ BankSelectionPage.vue
│  │  │     ├─ DashboardChart.vue
│  │  │     └─ DashboardPage.vue
│  │  ├─ my
│  │  │  ├─ modals
│  │  │  │  ├─ MyProfileUpdateModal.vue
│  │  │  │  ├─ OrgAssignedBankModal.vue
│  │  │  │  ├─ OrgBranchBizModal.vue
│  │  │  │  ├─ OrgBranchCreateContainer.vue
│  │  │  │  ├─ OrgBranchCreateInfoTab.vue
│  │  │  │  ├─ OrgBranchCreateUserTab.vue
│  │  │  │  ├─ OrgPayAccountModal.vue
│  │  │  │  ├─ OrgPrepaidPayModal.vue
│  │  │  │  ├─ OrgRegistryIdModal.vue
│  │  │  │  └─ UserFormModal.vue
│  │  │  └─ pages
│  │  │     ├─ MyProfilePage.vue
│  │  │     ├─ OrgDetailPage.vue
│  │  │     ├─ OrgMgmtPage.vue
│  │  │     ├─ UserDetailPage.vue
│  │  │     └─ UserMgmtPage.vue
│  │  ├─ registration
│  │  │  ├─ modals
│  │  │  │  ├─ AdminInfoConsentModal.vue
│  │  │  │  ├─ AttachDocListCreateModal.vue
│  │  │  │  ├─ BondTaxInfoRegModal.vue
│  │  │  │  ├─ CancellationInfoRegModal.vue
│  │  │  │  ├─ CaseAppSearchModal.vue
│  │  │  │  ├─ CaseCertInfoRegModal.vue
│  │  │  │  ├─ CaseCompleteDocRegModal.vue
│  │  │  │  ├─ CaseReceiptCreateModal.vue
│  │  │  │  ├─ CaseReceiptInfoRegModal.vue
│  │  │  │  ├─ CaseTypeAddModal.vue
│  │  │  │  ├─ ChangeInfoRegModal.vue
│  │  │  │  ├─ ContractInfoRegModal.vue
│  │  │  │  ├─ CorrectionInfoRegModal.vue
│  │  │  │  ├─ ESignStatusMgmtModal.vue
│  │  │  │  ├─ ESignatureProceedModal.vue
│  │  │  │  ├─ HousingBondPurchaseModal.vue
│  │  │  │  ├─ LoanPayAccountRegModal.vue
│  │  │  │  ├─ PriorLoanRepaymentInfoModal.vue
│  │  │  │  ├─ PropertyInfoRegModal.vue
│  │  │  │  ├─ ReRequestReasonInputModal.vue
│  │  │  │  ├─ TaxInfoRegModal.vue
│  │  │  │  ├─ TaxReportProxyModal.vue
│  │  │  │  └─ TransCancelCertInfoRegModal.vue
│  │  │  └─ pages
│  │  │     ├─ AccordionSection.vue
│  │  │     ├─ AdminSection.vue
│  │  │     ├─ ApplicationSection.vue
│  │  │     ├─ CaseDetailPage.vue
│  │  │     ├─ CaseScheduleMgmtPage.vue
│  │  │     ├─ CaseStatusContainer.vue
│  │  │     ├─ ProgressSection.vue
│  │  │     ├─ RequestInfoSection.vue
│  │  │     └─ progress
│  │  ├─ shared
│  │  │  ├─ modals
│  │  │  │  ├─ AddressInputTab.vue
│  │  │  │  ├─ AddressSearchContainer.vue
│  │  │  │  ├─ AddressSearchTab.vue
│  │  │  │  ├─ AutoLogoutNoticeModal.vue
│  │  │  │  └─ RegistrySearchModal.vue
│  │  │  └─ pages
│  │  │     ├─ AccessErrorMacPage.vue
│  │  │     ├─ AccessErrorMobilePage.vue
│  │  │     ├─ DeviceInfoPage.vue
│  │  │     ├─ NotFoundPage.vue
│  │  │     ├─ NoticeDetailPage.vue
│  │  │     ├─ NoticePage.vue
│  │  │     ├─ RootPage.vue
│  │  │     └─ WebViewerPage.vue
│  │  └─ template
│  │     ├─ AccordionGroup.vue
│  │     ├─ AccordionItem.vue
│  │     ├─ PaginationItem.vue
│  │     └─ input
│  │        ├─ FloatingCustomSelect.vue
│  │        ├─ FloatingInnerSelect.vue
│  │        ├─ FloatingInput.vue
│  │        ├─ SearchDateRangePicker.vue
│  │        ├─ SearchInput.vue
│  │        ├─ SearchSelect.vue
│  │        └─ UserSelect.vue
│  ├─ composables
│  │  ├─ README.md
│  │  ├─ api
│  │  │  ├─ useAddress.ts
│  │  │  ├─ useAuth.ts
│  │  │  ├─ useBranch.ts
│  │  │  ├─ useBranchBank.ts
│  │  │  └─ useCodes.ts
│  │  ├─ utils
│  │  │  ├─ useAccordionState.ts
│  │  │  ├─ useAuthInitializer.ts
│  │  │  ├─ useDeviceDetection.ts
│  │  │  ├─ useDialog.ts
│  │  │  ├─ useErrorHandler.ts
│  │  │  ├─ useExternalLinks.ts
│  │  │  ├─ useMessage.ts
│  │  │  └─ useThrottle.ts
│  │  └─ viewer.html
│  ├─ constants
│  │  ├─ apiMessages.ts
│  │  ├─ externalLinks.ts
│  │  └─ messages.ts
│  ├─ locales
│  │  └─ ko.json
│  ├─ main.ts
│  ├─ plugins
│  │  └─ vueQuery.ts
│  ├─ router
│  │  └─ index.ts
│  ├─ stores
│  │  ├─ auth.ts
│  │  └─ index.ts
│  ├─ types
│  │  ├─ api
│  │  │  ├─ address.types.ts
│  │  │  ├─ auth.types.ts
│  │  │  ├─ bank.types.ts
│  │  │  ├─ branch-bank.types.ts
│  │  │  ├─ branch-document.types.ts
│  │  │  ├─ branch-payment.types.ts
│  │  │  ├─ branch-prepaid.types.ts
│  │  │  ├─ branch-registry.types.ts
│  │  │  ├─ branch.types.ts
│  │  │  ├─ code.types.ts
│  │  │  ├─ common.types.ts
│  │  │  ├─ index.ts
│  │  │  ├─ notice.types.ts
│  │  │  ├─ notification.types.ts
│  │  │  ├─ organization.types.ts
│  │  │  ├─ registry-admin-consent.types.ts
│  │  │  ├─ registry-attachment.types.ts
│  │  │  ├─ registry-cancellation.types.ts
│  │  │  ├─ registry-case.types.ts
│  │  │  ├─ registry-certificate.types.ts
│  │  │  ├─ registry-change.types.ts
│  │  │  ├─ registry-completion.types.ts
│  │  │  ├─ registry-contract.types.ts
│  │  │  ├─ registry-correction.types.ts
│  │  │  ├─ registry-dashboard.types.ts
│  │  │  ├─ registry-debt-tax.types.ts
│  │  │  ├─ registry-housing-bond.types.ts
│  │  │  ├─ registry-loan-account.types.ts
│  │  │  ├─ registry-prior-loan.types.ts
│  │  │  ├─ registry-progress-document.types.ts
│  │  │  ├─ registry-progress.types.ts
│  │  │  ├─ registry-property.types.ts
│  │  │  ├─ registry-quote.types.ts
│  │  │  ├─ registry-receipt-document.types.ts
│  │  │  ├─ registry-receipt.types.ts
│  │  │  ├─ registry-request-document.types.ts
│  │  │  ├─ registry-schedule.types.ts
│  │  │  ├─ registry-signature.types.ts
│  │  │  ├─ registry-tax-report.types.ts
│  │  │  ├─ registry-tax.types.ts
│  │  │  ├─ registry-test.types.ts
│  │  │  ├─ registry-transfer-certificate.types.ts
│  │  │  ├─ registry-type.types.ts
│  │  │  ├─ rpa.types.ts
│  │  │  └─ user.types.ts
│  │  ├─ common.ts
│  │  ├─ dialog.ts
│  │  ├─ env.d.ts
│  │  ├─ error.ts
│  │  ├─ index.ts
│  │  └─ store.ts
│  └─ utils
│     ├─ authValidator.ts
│     ├─ env.ts
│     ├─ format.ts
│     ├─ logger.ts
│     ├─ storage.ts
│     └─ validators.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ vitest.shims.d.ts

```