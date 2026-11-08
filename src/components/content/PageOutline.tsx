import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type RefObject } from 'react'
import { slugify } from '@/lib/content'
import styles from './PageOutline.module.css'

type Item = {
  id: string
  text: string
  level: 2 | 3 | 4
}

function collect(root: HTMLElement): Item[] {
  const nodes = root.querySelectorAll('h2, h3, h4')
  const used = new Set<string>()
  const items: Item[] = []

  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue
    const card = node.closest('[data-exercise]')
    if (card && node !== card.querySelector(':scope > h2')) continue

    const text = node.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    if (!text) continue

    let id = node.id
    if (!id || used.has(id)) {
      const base = slugify(text) || 'razdel'
      id = base
      let n = 2
      while (used.has(id) || (document.getElementById(id) && document.getElementById(id) !== node)) {
        id = `${base}-${n++}`
      }
      node.id = id
    }

    used.add(id)
    const level = node.tagName === 'H4' ? 4 : node.tagName === 'H3' ? 3 : 2
    items.push({ id, text, level })
  }

  return items
}

function recenter(rail: HTMLElement) {
  const current = rail.querySelector('[aria-current="location"]')
  if (!(current instanceof HTMLElement)) return
  rail.scrollTop = Math.max(0, current.offsetTop - (rail.clientHeight - current.offsetHeight) / 2)
}

export function PageOutline({
  rootRef,
  entryId,
}: {
  rootRef: RefObject<HTMLElement | null>
  entryId: string
}) {
  const railRef = useRef<HTMLElement>(null)
  const [items, setItems] = useState<Item[]>([])
  const [active, setActive] = useState('')

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const next = collect(root)
    setItems(next)
    setActive(next[0]?.id ?? '')
  }, [rootRef, entryId])

  useEffect(() => {
    if (items.length < 2) return

    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (hash && items.some((item) => item.id === hash)) {
      document.getElementById(hash)?.scrollIntoView()
    }

    const markerOffset = () => {
      const sample = document.getElementById(items[0].id)
      const margin = sample ? Number.parseFloat(getComputedStyle(sample).scrollMarginTop) : 96
      return (Number.isFinite(margin) ? margin : 96) + 12
    }

    const onScroll = () => {
      const marker = window.scrollY + markerOffset()
      let current = items[0].id
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= marker) current = item.id
      }
      setActive((prev) => (prev === current ? prev : current))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  useEffect(() => {
    const rail = railRef.current
    if (!rail || rail.matches(':hover') || rail.matches(':focus-within')) return
    recenter(rail)
  }, [active])

  if (items.length < 2) return null

  function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
    setActive(id)
  }

  return (
    <nav
      ref={railRef}
      className={styles.rail}
      aria-label="На этой странице"
      onMouseLeave={() => {
        const rail = railRef.current
        if (rail) recenter(rail)
      }}
    >
      {items.map((item) => (
        <a
          key={item.id}
          className={styles.link}
          href={`#${item.id}`}
          data-level={item.level}
          aria-current={item.id === active ? 'location' : undefined}
          onClick={(event) => jump(event, item.id)}
        >
          <span className={styles.label}>{item.text}</span>
        </a>
      ))}
    </nav>
  )
}
