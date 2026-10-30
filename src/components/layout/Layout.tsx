import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import styles from './Layout.module.css'

export function Layout() {
  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#main">
        К содержанию
      </a>
      <Header />
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
