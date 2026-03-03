/**
 * 문서 경로: `@/src/plugins/iconStyles.ts`
 * 문서 제목: 플러그인 모듈: icon-styles
 */

let iconStylesPromise: Promise<void> | null = null

export function ensureIconStylesLoaded() {
  if (iconStylesPromise) return iconStylesPromise

  iconStylesPromise = Promise.all([
    import('@flaticon/flaticon-uicons/css/bold/rounded.css'),
    import('@flaticon/flaticon-uicons/css/regular/rounded.css'),
    import('@flaticon/flaticon-uicons/css/regular/straight.css'),
    import('@flaticon/flaticon-uicons/css/solid/rounded.css'),
    import('@flaticon/flaticon-uicons/css/solid/straight.css')
  ]).then(() => undefined)

  return iconStylesPromise
}
