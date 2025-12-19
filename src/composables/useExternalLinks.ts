import { EXTERNAL_LINKS } from '@/constants/externalLinks'

export const useExternalLinks = () => {
  const openLink = (url: string, newTab = true) => {
    if (newTab) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = url
    }
  }

  return {
    links: EXTERNAL_LINKS,
    openLink
  }
}
