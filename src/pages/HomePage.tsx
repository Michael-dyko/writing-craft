import { Link } from 'react-router-dom'
import { EntryList } from '@/components/content/EntryList'
import {
  countByCollection,
  getCollections,
  getFeatured,
} from '@/lib/content'
import { ruCount } from '@/lib/pluralize'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import styles from './HomePage.module.css'

export function HomePage() {
  useDocumentTitle()
  const counts = countByCollection()
  const featured = getFeatured(3)

  return (
    <div className="page">
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Рабочая тетрадь автора</p>
        <h1 className={styles.title}>Писать — ремесло.</h1>
        <p className={styles.lead}>
          Приёмы, упражнения и словарь, к которым можно возвращаться посреди черновика.
          База знаний живёт рядом с кодом: пока без сервера и без CMS, но уже с понятным
          контрактом на заметку.
        </p>
      </section>

      <ul className={styles.collections}>
        {getCollections().map((collection) => (
          <li key={collection.id}>
            <Link to={collection.path} className={styles.card}>
              <span className={styles.count}>
                {ruCount(counts[collection.id], ['запись', 'записи', 'записей'])}
              </span>
              <span className={styles.cardTitle}>{collection.title}</span>
              <span className={styles.cardText}>{collection.description}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section>
        <h2 className={styles.sectionTitle}>С чего начать</h2>
        <p className={styles.sectionLead}>
          Три опорных приёма. Когда появится ваша папка с материалами, этот список
          заполнится уже настоящей базой.
        </p>
        <EntryList entries={featured} />
      </section>
    </div>
  )
}
