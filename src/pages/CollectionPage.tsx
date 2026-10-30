import { useParams, useSearchParams } from 'react-router-dom'
import { AxisFilters } from '@/components/content/AxisFilters'
import { EntryList } from '@/components/content/EntryList'
import { axisFiltersFromSearch, filterEntries, getCollection, isCollectionId } from '@/lib/content'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { NotFoundPage } from './NotFoundPage'
import styles from './CollectionPage.module.css'

export function CollectionPage() {
  const { collectionId = '' } = useParams()
  const [params] = useSearchParams()
  const valid = isCollectionId(collectionId)
  const collection = valid ? getCollection(collectionId) : undefined
  const filters = axisFiltersFromSearch(params)

  useDocumentTitle(valid ? collection?.title : 'Страница не найдена')

  if (!collection || !valid) {
    return <NotFoundPage />
  }

  const entries = filterEntries(collection.id, filters)
  const hasFilter = Object.values(filters).some(Boolean)

  return (
    <div className="page">
      <header className={styles.header}>
        <p className={styles.kicker}>Раздел</p>
        <h1 className={styles.title}>{collection.title}</h1>
        <p className={styles.description}>{collection.description}</p>
      </header>

      <AxisFilters collection={collection.id} />

      <EntryList
        entries={entries}
        empty={
          hasFilter
            ? 'Нет записей по выбранным фильтрам.'
            : 'В этом разделе пока нет записей.'
        }
      />
    </div>
  )
}
