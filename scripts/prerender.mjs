import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const rootMarker = '<div id="root"></div>'
const template = readFileSync('dist/index.html', 'utf8')

if (!template.includes(rootMarker)) {
  throw new Error('В dist/index.html нет пустого #root')
}

const entry = pathToFileURL(join(process.cwd(), 'dist-ssr/entry-server.js')).href
const { render, routesToPrerender } = await import(entry)

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

const routes = routesToPrerender()

for (const route of routes) {
  const { html, title } = await render(route)
  if (!html.includes('<h1')) {
    throw new Error(`Пустая отрисовка для ${route}`)
  }

  const page = template
    .replace(rootMarker, `<div id="root">${html}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
  const relative = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`
  const file = join('dist', relative)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, page)
}

rmSync('dist-ssr', { recursive: true, force: true })
console.log(`Отрисовано страниц: ${routes.length}`)
