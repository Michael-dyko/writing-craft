import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './app/App'
import './styles/base.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Не найден элемент #root')
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

if (root.childElementCount > 0) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
