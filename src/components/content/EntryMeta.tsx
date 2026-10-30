import { Link } from 'react-router-dom'
import { COLLECTIONS, slugify, type ContentEntry } from '@/lib/content'
import styles from './EntryMeta.module.css'

type Props = {
  entry: ContentEntry
}

export function EntryMeta({ entry }: Props) {
  const moduleHref = entry.module
    ? `${COLLECTIONS.notes.path}?module=${slugify(entry.module)}`
    : undefined

  return (
    <div className={styles.meta}>
      {entry.collection === 'exercises' ? (
        <span className={`${styles.item} ${styles.accent}`}>Упражнение</span>
      ) : null}
      {entry.module ? (
        moduleHref ? (
          <Link className={styles.item} data-axis="module" to={moduleHref}>
            {entry.module}
          </Link>
        ) : (
          <span className={styles.item} data-axis="module">
            {entry.module}
          </span>
        )
      ) : null}
    </div>
  )
}
