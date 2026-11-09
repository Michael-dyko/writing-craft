import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
  type StaticHandlerContext,
} from 'react-router'
import { appRoutes, routerBasename } from '@/app/routes'
import { resetDocumentTitle, takeDocumentTitle } from '@/hooks/useDocumentTitle'
import { entryPath, getAllEntries } from '@/lib/content'

export function routesToPrerender(): string[] {
  const paths = new Set<string>(['/', '/search', '/map', '/notes', '/exercises'])
  for (const entry of getAllEntries()) paths.add(entryPath(entry))
  return [...paths]
}

function requestUrl(url: string): string {
  const basename = routerBasename() ?? ''
  const path = url === '/' ? `${basename}/` : `${basename}${url}`
  return new URL(path, 'http://localhost').href
}

export async function render(url: string): Promise<{ html: string; title: string }> {
  resetDocumentTitle()
  const basename = routerBasename()
  const handler = createStaticHandler(appRoutes(), basename ? { basename } : undefined)
  const context = await handler.query(new Request(requestUrl(url)))

  if (context instanceof Response) {
    const location = context.headers.get('Location') ?? ''
    throw new Error(`${url} ответил ${context.status} ${location}`.trim())
  }

  const router = createStaticRouter(handler.dataRoutes, context as StaticHandlerContext)
  const html = renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context as StaticHandlerContext} />
    </StrictMode>,
  )

  return { html, title: takeDocumentTitle() }
}
