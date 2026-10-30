import { Link } from 'react-router-dom'
import { EntryList } from '@/components/content/EntryList'
import { countByCollection, getCollections, getFeatured, getModules } from '@/lib/content'
import { ruCount } from '@/lib/pluralize'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import styles from './HomePage.module.css'

export function HomePage() {
  useDocumentTitle()
  const counts = countByCollection()
  const featured = getFeatured(5)
  const modules = getModules()

  return (
    <div className="page">
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Рабочая тетрадь автора</p>
        <h1 className={styles.title}>Писать — ремесло.</h1>
        <p className={styles.lead}>
          Темы по модулям, с осями жанра, задачи и этапа работы. Упражнения живут
          отдельно, но остаются внутри теории.
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

      <section className={styles.moduleSection}>
        <h2 className={styles.sectionTitle}>Модули</h2>
        <p className={styles.sectionLead}>Главная полка базы — от языка до миростроения.</p>
        <ul className={styles.modules}>
          {modules.map((module) => (
            <li key={module.name}>
              <Link
                className={styles.module}
                to={`/notes?module=${encodeURIComponent(module.name)}`}
              >
                <span className={styles.moduleName}>{module.name}</span>
                <span className={styles.moduleCount}>
                  {ruCount(module.count, ['тема', 'темы', 'тем'])}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>С чего начать</h2>
        <p className={styles.sectionLead}>Первые темы по рабочему порядку из исходной базы.</p>
        <EntryList entries={featured} />
      </section>
    </div>
  )
}
