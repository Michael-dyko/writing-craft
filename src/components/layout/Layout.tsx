import { useLayoutEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigationType } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import styles from './Layout.module.css'

function ResetScroll() {
  const { pathname } = useLocation()
  const action = useNavigationType()

  useLayoutEffect(() => {
    if (action === 'POP') return
    window.scrollTo(0, 0)
  }, [pathname, action])

  return null
}

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
      <ResetScroll />
      <ScrollRestoration />
    </div>
  )
}
