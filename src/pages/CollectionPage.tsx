import { useLayoutEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AxisFilters } from '@/components/content/AxisFilters'
import { EntryList } from '@/components/content/EntryList'
import {
  axisFiltersFromSearch,
  canonicalizeAxisSearch,
  filterEntries,
  getCollection,
  isCollectionId,
} from '@/lib/content'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { NotFoundPage } from './NotFoundPage'
import styles from './CollectionPage.module.css'

export function CollectionPage() {
  const { collectionId = '' } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const valid = isCollectionId(collectionId)
  const collection = valid ? getCollection(collectionId) : undefined
  const filters = axisFiltersFromSearch(params)
  const currentSearch = params.toString()
  const canonicalSearch = canonicalizeAxisSearch(params)

  useLayoutEffect(() => {
    if (canonicalSearch === currentSearch) return
    navigate({ search: canonicalSearch }, { replace: true, preventScrollReset: true })
  }, [canonicalSearch, currentSearch, navigate])

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
