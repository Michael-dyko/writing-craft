import { Link } from 'react-router-dom'
import { entryPath, getSitemap, slugify } from '@/lib/content'
import { ruCount } from '@/lib/pluralize'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import styles from './SitemapPage.module.css'

const PAGES = [
  { to: '/', label: 'Главная' },
  { to: '/notes', label: 'Темы' },
  { to: '/exercises', label: 'Упражнения' },
  { to: '/random', label: 'Случайное упражнение' },
  { to: '/search', label: 'Поиск' },
] as const

export function SitemapPage() {
  useDocumentTitle('Карта сайта')
  const { groups, loose } = getSitemap()

  return (
    <div className="page">
      <header className={styles.header}>
        <p className={styles.kicker}>База целиком</p>
        <h1 className={styles.title}>Карта сайта</h1>
        <p className={styles.description}>Темы по модулям, упражнения — внутри своей темы.</p>
      </header>

      <nav className={styles.pages} aria-label="Страницы">
        <span className={styles.pagesLabel}>Страницы</span>
        <ul>
          {PAGES.map((page) => (
            <li key={page.to}>
              <Link to={page.to}>{page.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className={styles.modules} aria-label="Модули">
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <a href={`#${group.id}`}>
                <span>{group.name}</span>
                <span className={styles.moduleCount}>{group.notes.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.tree}>
        {groups.map((group) => (
          <section key={group.id} id={group.id} className={styles.group} aria-labelledby={`${group.id}-title`}>
            <div className={styles.groupHead}>
              <h2 id={`${group.id}-title`} className={styles.groupTitle}>
                {group.module ? (
                  <Link to={`/notes?module=${slugify(group.module)}`}>{group.name}</Link>
                ) : (
                  group.name
                )}
              </h2>
              <p className={styles.groupCount}>{ruCount(group.notes.length, ['тема', 'темы', 'тем'])}</p>
            </div>
            <ul className={styles.notes}>
              {group.notes.map(({ note, exercises }) => (
                <li key={note.id} className={styles.note}>
                  <Link to={entryPath(note)}>{note.title}</Link>
                  {exercises.length > 0 ? (
                    <ul className={styles.exercises}>
                      {exercises.map((exercise) => (
                        <li key={exercise.id}>
                          <Link to={entryPath(exercise)}>{exercise.title}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {loose.length > 0 ? (
          <section className={`${styles.group} ${styles.loose}`} aria-labelledby="loose-title">
            <div className={styles.groupHead}>
              <h2 id="loose-title" className={styles.groupTitle}>
                Упражнения без темы
              </h2>
              <p className={styles.groupCount}>
                {ruCount(loose.length, ['упражнение', 'упражнения', 'упражнений'])}
              </p>
            </div>
            <ul className={styles.looseList}>
              {loose.map((exercise) => (
                <li key={exercise.id}>
                  <Link to={entryPath(exercise)}>{exercise.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  )
}
