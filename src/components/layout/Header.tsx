import { type FormEvent, useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { collectionNav } from '@/lib/content'
import styles from './Header.module.css'

export function Header() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = query.trim()
    navigate(next ? `/search?q=${encodeURIComponent(next)}` : '/search')
  }

  return (
    <header className={styles.header}>
      <div className={`page ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.wordmark}>Ремесло</span>
          <span className={styles.tagline}>писательское мастерство</span>
        </Link>

        <nav className={styles.nav} aria-label="Разделы">
          {collectionNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form className={styles.search} onSubmit={onSearch} role="search">
          <input
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Искать в базе"
            aria-label="Поиск по базе знаний"
          />
          <button className={styles.submit} type="submit">
            Найти
          </button>
        </form>
      </div>
    </header>
  )
}
