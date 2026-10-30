import {
  COLLECTION_IDS,
  isCollectionId,
  isDifficulty,
  makeEntryId,
  type CollectionId,
  type ContentEntry,
} from './schema'
import {
  asBoolean,
  asNumber,
  asString,
  asStringArray,
  parseMarkdown,
} from './parse'

const sources = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export class ContentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentError'
  }
}

function parseSourcePath(filePath: string): { collection: CollectionId; fileSlug: string } {
  const match = filePath.match(/\/content\/([^/]+)\/([^/]+)\.md$/)
  if (!match) {
    throw new ContentError(`Некорректный путь заметки: ${filePath}`)
  }

  const [, folder, fileSlug] = match
  if (!isCollectionId(folder)) {
    throw new ContentError(
      `Неизвестная коллекция «${folder}» в ${filePath}. Ожидаются: ${COLLECTION_IDS.join(', ')}`,
    )
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

  if (data.difficulty !== undefined && !isDifficulty(data.difficulty)) {
    throw new ContentError(
      `${filePath}: difficulty должен быть beginner | intermediate | advanced`,
    )
  }

  const slug = asString(data.slug) ?? fileSlug
  const category = asString(data.category)

  return {
    id: makeEntryId(collection, slug),
    slug,
    collection,
    title,
    summary,
    tags: asStringArray(data.tags),
    category,
    difficulty: isDifficulty(data.difficulty) ? data.difficulty : undefined,
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
    const key = entry.id
    const previous = slugs.get(key)
    if (previous) {
      throw new ContentError(`Дублируется id ${key}: ${previous} и ${entry.sourcePath}`)
    }
    slugs.set(key, entry.sourcePath)
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
