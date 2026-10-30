import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  useDocumentTitle('Страница не найдена')

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Этой страницы нет.</h1>
      <p className={styles.text}>
        Либо адрес опечатан, либо заметка ещё не попала в базу. Вернитесь на главную
        и выберите раздел.
      </p>
      <Link className={styles.link} to="/">
        На главную
      </Link>
    </div>
  )
}
