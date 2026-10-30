import { Link } from 'react-router-dom'
import { difficultyLabels, type ContentEntry } from '@/lib/content'
import styles from './EntryMeta.module.css'

type Props = {
  entry: ContentEntry
  collectionHref?: string
}

export function EntryMeta({ entry, collectionHref }: Props) {
  return (
    <div className={styles.meta}>
      {entry.difficulty ? (
        <span className={`${styles.item} ${styles.accent}`}>
          {difficultyLabels[entry.difficulty]}
        </span>
      ) : null}
      {entry.category ? <span className={styles.item}>{entry.category}</span> : null}
      {entry.tags.map((tag) => {
        const to = collectionHref
          ? `${collectionHref}?tag=${encodeURIComponent(tag)}`
          : undefined
        return to ? (
          <Link key={tag} className={styles.item} to={to}>
            {tag}
          </Link>
        ) : (
          <span key={tag} className={styles.item}>
            {tag}
          </span>
        )
      })}
    </div>
  )
}
