import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { TAG_AXES, getAxisOptions, type CollectionId, type TagAxisParam } from '@/lib/content'
import styles from './AxisFilters.module.css'

type Props = {
  collection: CollectionId
}

export function AxisFilters({ collection }: Props) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const base = `/${collection}`
  const active = TAG_AXES.map((axis) => params.get(axis.param)).filter(Boolean)
  const [expanded, setExpanded] = useState(active.length > 0)

  function applyFilter(param: TagAxisParam, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(param, value)
    else next.delete(param)
    const query = next.toString()
    navigate({ pathname: base, search: query }, { replace: true, preventScrollReset: true })
  }

  return (
    <details
      className={styles.wrap}
      open={expanded}
      onToggle={(event) => setExpanded((event.target as HTMLDetailsElement).open)}
    >
      <summary className={styles.summary}>
        Фильтры
        {active.length > 0 ? <span className={styles.count}>{active.length}</span> : null}
      </summary>
      <div className={styles.stack}>
        {TAG_AXES.map((axis) => {
          const options = getAxisOptions(collection, axis.id)
          if (options.length === 0) return null
          const selected = params.get(axis.param) ?? ''

          return (
            <div key={axis.id} className={styles.row} data-axis={axis.id}>
              <p className={styles.label} id={`filter-${axis.id}`}>
                {axis.label}
              </p>
              <div className={styles.selectWrap}>
                <select
                  className={styles.select}
                  value={selected}
                  aria-labelledby={`filter-${axis.id}`}
                  onChange={(event) => applyFilter(axis.param, event.target.value)}
                >
                  <option value="">Все</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.chips}>
                <FilterChip
                  to={hrefWithout(base, params, axis.param)}
                  active={!selected}
                  label="Все"
                />
                {options.map((option) => (
                  <FilterChip
                    key={option}
                    to={hrefWith(base, params, axis.param, option)}
                    active={selected === option}
                    label={option}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </details>
  )
}

function FilterChip({ to, active, label }: { to: string; active: boolean; label: string }) {
  return (
    <Link className={`${styles.chip} ${active ? styles.active : ''}`} to={to}>
      {label}
    </Link>
  )
}

function hrefWith(base: string, params: URLSearchParams, key: string, value: string): string {
  const next = new URLSearchParams(params)
  next.set(key, value)
  const query = next.toString()
  return query ? `${base}?${query}` : base
}

function hrefWithout(base: string, params: URLSearchParams, key: string): string {
  const next = new URLSearchParams(params)
  next.delete(key)
  const query = next.toString()
  return query ? `${base}?${query}` : base
}
