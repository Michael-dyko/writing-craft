import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { CollectionPage } from '@/pages/CollectionPage'
import { EntryPage } from '@/pages/EntryPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RandomExercisePage } from '@/pages/RandomExercisePage'
import { SearchPage } from '@/pages/SearchPage'
import { SitemapPage } from '@/pages/SitemapPage'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'search', element: <SearchPage /> },
        { path: 'map', element: <SitemapPage /> },
        { path: 'random', element: <RandomExercisePage /> },
        { path: ':collectionId', element: <CollectionPage /> },
        { path: ':collectionId/:slug', element: <EntryPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL.replace(/\/$/, '') || undefined,
  },
)
