import {
  TAG_AXES,
  axisValues,
  isCollectionId,
  makeEntryId,
  type CollectionId,
  type ContentEntry,
} from './schema'
import { slugify, uniqueSlug } from './slug'
import {
  asBoolean,
  asNumber,
  asString,
  asStringArray,
  parseMarkdown,
} from './parse'

const sources = {
  ...import.meta.glob('/content/notes/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
  ...import.meta.glob('/content/exercises/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
} as Record<string, string>

export class ContentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentError'
  }
}

function parseSourcePath(filePath: string): { collection: CollectionId; fileSlug: string } {
  const match = filePath.match(/\/content\/(notes|exercises)\/([^/]+)\.md$/)
  if (!match) {
    throw new ContentError(`Некорректный путь заметки: ${filePath}`)
  }

  const [, folder, fileSlug] = match
  if (!isCollectionId(folder)) {
    throw new ContentError(`Неизвестная коллекция «${folder}» в ${filePath}`)
  }

  return { collection: folder, fileSlug }
}

function toEntry(filePath: string, raw: string): ContentEntry {
  const { collection, fileSlug } = parseSourcePath(filePath)
  let parsed: ReturnType<typeof parseMarkdown>
  try {
    parsed = parseMarkdown(raw)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'неизвестная ошибка'
    throw new ContentError(`${filePath}: не удалось прочитать frontmatter (${message})`)
  }
  const { data, body } = parsed

  const title = asString(data.title)
  if (!title) {
    throw new ContentError(`${filePath}: нужно поле title`)
  }

  const summary = asString(data.summary)
  if (!summary) {
    throw new ContentError(`${filePath}: нужно поле summary`)
  }

  const slug = asString(data.slug) ?? fileSlug

  return {
    id: makeEntryId(collection, slug),
    slug,
    urlSlug: slugify(slug) || 'entry',
    collection,
    title,
    summary,
    module: asString(data.module),
    areas: asStringArray(data.areas),
    tasks: asStringArray(data.tasks),
    genres: asStringArray(data.genres),
    stages: asStringArray(data.stages),
    parent: asString(data.parent),
    related: asStringArray(data.related),
    order: asNumber(data.order) ?? 100,
    draft: asBoolean(data.draft) ?? false,
    body,
    sourcePath: filePath,
  }
}

function loadCatalog(): ContentEntry[] {
  const entries = Object.entries(sources).map(([filePath, raw]) => toEntry(filePath, raw))
  const slugs = new Map<string, string>()

  for (const entry of entries) {
    const previous = slugs.get(entry.id)
    if (previous) {
      throw new ContentError(`Дублируется id ${entry.id}: ${previous} и ${entry.sourcePath}`)
    }
    slugs.set(entry.id, entry.sourcePath)
  }

  const urlSlugs = new Map<CollectionId, Set<string>>()
  for (const entry of entries) {
    const taken = urlSlugs.get(entry.collection) ?? new Set<string>()
    entry.urlSlug = uniqueSlug(entry.slug, taken)
    urlSlugs.set(entry.collection, taken)
  }

  for (const axis of TAG_AXES) {
    const bySlug = new Map<string, string>()
    for (const entry of entries) {
      for (const value of axisValues(entry, axis.id)) {
        const tagSlug = slugify(value)
        const previous = bySlug.get(tagSlug)
        if (previous && previous !== value) {
          throw new ContentError(
            `Слаг «${tagSlug}» совпадает у тегов «${previous}» и «${value}» (${axis.label})`,
          )
        }
        bySlug.set(tagSlug, value)
      }
    }
  }

  return entries.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return a.title.localeCompare(b.title, 'ru')
  })
}

const catalog = loadCatalog()

export const allEntries: ContentEntry[] = import.meta.env.DEV
  ? catalog
  : catalog.filter((entry) => !entry.draft)
