import { createBrowserRouter } from 'react-router-dom'
import { appRoutes, routerBasename } from './routes'

export const router = createBrowserRouter(appRoutes(), {
  basename: routerBasename(),
})
