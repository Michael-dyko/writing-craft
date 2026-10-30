import { Link, useParams } from 'react-router-dom'
import { EntryAxes } from '@/components/content/EntryAxes'
import { MarkdownBody } from '@/components/content/MarkdownBody'
import { NoteBody } from '@/components/content/NoteBody'
import { RelatedEntries } from '@/components/content/RelatedEntries'
import {
  entryPath,
  getCollection,
  getEntry,
  getOrphanExercises,
  getParentNote,
  getRelated,
  isCollectionId,
  stripLeadingHeading,
} from '@/lib/content'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { NotFoundPage } from './NotFoundPage'
import styles from './EntryPage.module.css'

export function EntryPage() {
  const { collectionId = '', slug = '' } = useParams()
  const valid = isCollectionId(collectionId)
  const entry = valid ? getEntry(collectionId, slug) : undefined

  useDocumentTitle(entry?.title ?? 'Страница не найдена')

  if (!valid || !entry) {
    return <NotFoundPage />
  }

  const collection = getCollection(collectionId)
  const parent = getParentNote(entry)
  const related = getRelated(entry)
  const orphans = entry.collection === 'notes' ? getOrphanExercises(entry) : []

  return (
    <article className={styles.page}>
      <Link className={styles.back} to={collection.path}>
        ← {collection.title}
      </Link>
      {parent ? (
        <p className={styles.parent}>
          Из темы:{' '}
          <Link to={entryPath(parent)}>{parent.title}</Link>
        </p>
      ) : null}
      <EntryAxes entry={entry} />
      <h1 className={styles.title}>{entry.title}</h1>
      {entry.collection === 'notes' ? (
        <p className={styles.summary}>{entry.summary}</p>
      ) : null}
      {entry.collection === 'notes' ? (
        <NoteBody source={entry.body} />
      ) : (
        <MarkdownBody source={stripLeadingHeading(entry.body)} />
      )}
      <RelatedEntries
        entries={[...orphans, ...related.filter((item) => !orphans.some((orphan) => orphan.id === item.id))]}
      />
    </article>
  )
}
