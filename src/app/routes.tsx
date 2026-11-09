import type { RouteObject } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { CollectionPage } from '@/pages/CollectionPage'
import { EntryPage } from '@/pages/EntryPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RandomExercisePage } from '@/pages/RandomExercisePage'
import { SearchPage } from '@/pages/SearchPage'
import { SitemapPage } from '@/pages/SitemapPage'

export function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return base || undefined
}

export function appRoutes(): RouteObject[] {
  return [
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
  ]
}
