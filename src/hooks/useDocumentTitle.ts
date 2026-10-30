import { useEffect } from 'react'

const SITE = 'Ремесло'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — писательское мастерство`
  }, [title])
}
