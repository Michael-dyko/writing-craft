import { Link } from 'react-router-dom'
import { COLLECTIONS, type ContentEntry } from '@/lib/content'
import styles from './EntryMeta.module.css'

type Props = {
  entry: ContentEntry
}

export function EntryMeta({ entry }: Props) {
  const moduleHref = entry.module
    ? `${COLLECTIONS.notes.path}?module=${encodeURIComponent(entry.module)}`
    : undefined

  return (
    <div className={styles.meta}>
      {entry.collection === 'exercises' ? (
        <span className={`${styles.item} ${styles.accent}`}>Упражнение</span>
      ) : null}
      {entry.module ? (
        moduleHref ? (
          <Link className={`${styles.item} ${styles.accent}`} to={moduleHref}>
            {entry.module}
          </Link>
        ) : (
          <span className={`${styles.item} ${styles.accent}`}>{entry.module}</span>
        )
      ) : null}
    </div>
  )
}
