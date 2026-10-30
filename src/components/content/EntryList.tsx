import { Link } from 'react-router-dom'
import { entryPath, type ContentEntry } from '@/lib/content'
import { EntryMeta } from './EntryMeta'
import styles from './EntryList.module.css'

type Props = {
  entries: ContentEntry[]
  empty?: string
}

export function EntryList({ entries, empty = 'Пока здесь пусто.' }: Props) {
  if (entries.length === 0) {
    return <p className={styles.empty}>{empty}</p>
  }

  return (
    <ul className={styles.list}>
      {entries.map((entry) => (
        <li key={entry.id} className={styles.item}>
          <Link to={entryPath(entry)} className={styles.link}>
            <h2 className={styles.title}>{entry.title}</h2>
            <p className={styles.summary}>{entry.summary}</p>
            <EntryMeta entry={entry} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
