import { Link, useParams, useSearchParams } from 'react-router-dom'
import { EntryList } from '@/components/content/EntryList'
import {
  getCollection,
  getEntries,
  getTags,
  isCollectionId,
} from '@/lib/content'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { NotFoundPage } from './NotFoundPage'
import styles from './CollectionPage.module.css'

export function CollectionPage() {
  const { collectionId = '' } = useParams()
  const [params] = useSearchParams()
  const tag = params.get('tag')
  const valid = isCollectionId(collectionId)
  const collection = valid ? getCollection(collectionId) : undefined

  useDocumentTitle(valid ? collection?.title : 'Страница не найдена')

  if (!collection || !valid) {
    return <NotFoundPage />
  }

  const tags = getTags(collection.id)
  const entries = getEntries(collection.id).filter((entry) =>
    tag ? entry.tags.includes(tag) : true,
  )

  return (
    <div className="page">
      <header className={styles.header}>
        <p className={styles.kicker}>Раздел</p>
        <h1 className={styles.title}>{collection.title}</h1>
        <p className={styles.description}>{collection.description}</p>
      </header>

      {tags.length > 0 ? (
        <div className={styles.filters} aria-label="Фильтр по тегам">
          <Link
            className={`${styles.filter} ${tag ? '' : styles.active}`}
            to={collection.path}
          >
            Все
          </Link>
          {tags.map((item) => (
            <Link
              key={item}
              className={`${styles.filter} ${tag === item ? styles.active : ''}`}
              to={`${collection.path}?tag=${encodeURIComponent(item)}`}
            >
              {item}
            </Link>
          ))}
        </div>
      ) : null}

      <EntryList
        entries={entries}
        empty={tag ? `Нет записей с тегом «${tag}».` : 'В этом разделе пока нет записей.'}
      />
    </div>
  )
}
