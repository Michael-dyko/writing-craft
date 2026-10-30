import { Link } from 'react-router-dom'
import { COLLECTIONS, entryPath, type ContentEntry } from '@/lib/content'
import styles from './RelatedEntries.module.css'

export function RelatedEntries({ entries }: { entries: ContentEntry[] }) {
  if (entries.length === 0) return null

  return (
    <section className={styles.section} aria-labelledby="related-heading">
      <h2 id="related-heading" className={styles.title}>
        Связанное
      </h2>
      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id}>
            <Link to={entryPath(entry)} className={styles.link}>
              <span className={styles.kind}>{COLLECTIONS[entry.collection].singular}</span>
              <span className={styles.name}>{entry.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
