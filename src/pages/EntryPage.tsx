import { useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { EntryAxes } from '@/components/content/EntryAxes'
import { MarkdownBody } from '@/components/content/MarkdownBody'
import { NoteBody } from '@/components/content/NoteBody'
import { PageOutline } from '@/components/content/PageOutline'
import { RandomExerciseLink } from '@/components/content/RandomExerciseLink'
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
  const bodyRef = useRef<HTMLDivElement>(null)
  const valid = isCollectionId(collectionId)
  const entry = valid ? getEntry(collectionId, slug) : undefined

  useDocumentTitle(entry?.title ?? 'Страница не найдена')

  if (!valid || !entry) {
    return <NotFoundPage />
  }

  if (slug !== entry.urlSlug) {
    return <Navigate to={entryPath(entry)} replace />
  }

  const collection = getCollection(collectionId)
  const parent = getParentNote(entry)
  const related = getRelated(entry)
  const orphans = entry.collection === 'notes' ? getOrphanExercises(entry) : []

  return (
    <article className={styles.page}>
      {entry.collection === 'exercises' ? (
        <div className={styles.toolbar}>
          <Link className={styles.back} to={collection.path}>
            ← {collection.title}
          </Link>
          <RandomExerciseLink exceptId={entry.id} />
        </div>
      ) : (
        <Link className={styles.back} to={collection.path}>
          ← {collection.title}
        </Link>
      )}
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
      <div ref={bodyRef}>
        {entry.collection === 'notes' ? (
          <NoteBody source={entry.body} />
        ) : (
          <MarkdownBody source={stripLeadingHeading(entry.body)} />
        )}
      </div>
      <PageOutline rootRef={bodyRef} entryId={entry.id} />
      <RelatedEntries
        entries={[...orphans, ...related.filter((item) => !orphans.some((orphan) => orphan.id === item.id))]}
      />
    </article>
  )
}
