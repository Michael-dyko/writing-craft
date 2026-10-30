import { Link } from 'react-router-dom'
import { COLLECTIONS, TAG_AXES, axisValues, type ContentEntry } from '@/lib/content'
import styles from './EntryMeta.module.css'

export function EntryAxes({ entry }: { entry: ContentEntry }) {
  const base = COLLECTIONS[entry.collection].path

  return (
    <div className={styles.meta}>
      {TAG_AXES.map((axis) =>
        axisValues(entry, axis.id).map((value) => (
          <Link
            key={`${axis.id}-${value}`}
            className={`${styles.item} ${axis.id === 'module' ? styles.accent : ''}`}
            to={`${base}?${axis.param}=${encodeURIComponent(value)}`}
          >
            {value}
          </Link>
        )),
      )}
    </div>
  )
}
