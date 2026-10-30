import { useSearchParams } from 'react-router-dom'
import { EntryList } from '@/components/content/EntryList'
import { searchEntries } from '@/lib/content'
import { ruCount } from '@/lib/pluralize'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import styles from './SearchPage.module.css'

export function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const results = searchEntries(query)

  useDocumentTitle(query ? `Поиск: ${query}` : 'Поиск')

  return (
    <div className="page">
      <h1 className={styles.title}>Поиск</h1>
      <p className={styles.lead}>
        {query
          ? `По запросу «${query}» ${
              results.length
                ? `найдено ${ruCount(results.length, ['запись', 'записи', 'записей'])}`
                : 'ничего не найдено'
            }.`
          : 'Введите запрос в поле в шапке — ищем по заголовкам, тегам и тексту заметок.'}
      </p>
      <EntryList entries={results} empty="Попробуйте другое слово или откройте раздел целиком." />
    </div>
  )
}
