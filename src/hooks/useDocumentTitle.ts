import { useEffect } from 'react'

const SITE = 'Ремесло'
const DEFAULT_TITLE = `${SITE} — писательское мастерство`

let pendingTitle = DEFAULT_TITLE

export function resetDocumentTitle() {
  pendingTitle = DEFAULT_TITLE
}

export function takeDocumentTitle() {
  return pendingTitle
}

export function useDocumentTitle(title?: string) {
  const next = title ? `${title} — ${SITE}` : DEFAULT_TITLE
  pendingTitle = next

  useEffect(() => {
    document.title = next
  }, [next])
}
