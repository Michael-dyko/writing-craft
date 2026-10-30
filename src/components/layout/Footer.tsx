import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.inner}`}>
        <p>Ремесло — рабочая база, а не курс. Возвращайтесь к теме, когда текст застрял.</p>
        <p>Темы, упражнения и оси тегов живут в markdown и собираются вместе с сайтом.</p>
      </div>
    </footer>
  )
}
