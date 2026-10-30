import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  TAG_AXES,
  axisFilterSearch,
  getAxisOptions,
  slugify,
  type CollectionId,
  type TagAxisParam,
} from '@/lib/content'
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
    const query = axisFilterSearch(params, param, value || null)
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
                  value={selectValue(selected, options)}
                  aria-labelledby={`filter-${axis.id}`}
                  onChange={(event) => applyFilter(axis.param, event.target.value)}
                >
                  <option value="">Все</option>
                  {options.map((option) => (
                    <option key={option} value={slugify(option)}>
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
                {options.map((option) => {
                  const optionSlug = slugify(option)
                  return (
                    <FilterChip
                      key={option}
                      to={hrefWith(base, params, axis.param, option)}
                      active={selected === optionSlug || selected === option}
                      label={option}
                    />
                  )
                })}
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

function selectValue(selected: string, options: string[]): string {
  if (!selected) return ''
  if (options.some((option) => slugify(option) === selected)) return selected
  const match = options.find((option) => option === selected)
  return match ? slugify(match) : selected
}

function hrefWith(base: string, params: URLSearchParams, key: TagAxisParam, value: string): string {
  const query = axisFilterSearch(params, key, value)
  return query ? `${base}?${query}` : base
}

function hrefWithout(base: string, params: URLSearchParams, key: TagAxisParam): string {
  const query = axisFilterSearch(params, key, null)
  return query ? `${base}?${query}` : base
}
