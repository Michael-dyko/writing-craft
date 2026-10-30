import { Link, useParams } from 'react-router-dom'
import { EntryMeta } from '@/components/content/EntryMeta'
import { MarkdownBody } from '@/components/content/MarkdownBody'
import { RelatedEntries } from '@/components/content/RelatedEntries'
import {
  getCollection,
  getEntry,
  getRelated,
  isCollectionId,
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
  const related = getRelated(entry)

  return (
    <article className={styles.page}>
      <Link className={styles.back} to={collection.path}>
        ← {collection.title}
      </Link>
      <EntryMeta entry={entry} collectionHref={collection.path} />
      <h1 className={styles.title}>{entry.title}</h1>
      <p className={styles.summary}>{entry.summary}</p>
      <MarkdownBody source={entry.body} />
      <RelatedEntries entries={related} />
    </article>
  )
}
