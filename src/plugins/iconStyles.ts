/**
 * 문서 경로: `@/src/plugins/iconStyles.ts`
 * 문서 제목: icon Styles 구현 파일
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
