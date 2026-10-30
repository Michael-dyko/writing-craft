export const COLLECTION_IDS = [
  'techniques',
  'exercises',
  'glossary',
  'articles',
] as const

export type CollectionId = (typeof COLLECTION_IDS)[number]

export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const

export type Difficulty = (typeof DIFFICULTIES)[number]

export type CollectionMeta = {
  id: CollectionId
  title: string
  singular: string
  description: string
  path: string
}

export const COLLECTIONS: Record<CollectionId, CollectionMeta> = {
  techniques: {
    id: 'techniques',
    title: 'Приёмы',
    singular: 'Приём',
    description: 'Инструменты, которые можно применить в сцене, абзаце или диалоге.',
    path: '/techniques',
  },
  exercises: {
    id: 'exercises',
    title: 'Упражнения',
    singular: 'Упражнение',
    description: 'Короткие задания, чтобы приём стал навыком, а не теорией.',
    path: '/exercises',
  },
  glossary: {
    id: 'glossary',
    title: 'Словарь',
    singular: 'Термин',
    description: 'Рабочие определения, без которых сложно говорить о тексте.',
    path: '/glossary',
  },
  articles: {
    id: 'articles',
    title: 'Статьи',
    singular: 'Статья',
    description: 'Связные разборы и заметки длиннее одного приёма.',
    path: '/articles',
  },
}

/**
 * Frontmatter-контракт заметки.
 * CMS позже должен писать тот же набор полей в markdown.
 */
export type ContentFrontmatter = {
  title: string
  slug?: string
  summary: string
  tags?: string[]
  category?: string
  difficulty?: Difficulty
  related?: string[]
  order?: number
  draft?: boolean
}

export type ContentEntry = {
  id: string
  slug: string
  collection: CollectionId
  title: string
  summary: string
  tags: string[]
  category?: string
  difficulty?: Difficulty
  related: string[]
  order: number
  draft: boolean
  body: string
  sourcePath: string
}

export function isCollectionId(value: string): value is CollectionId {
  return (COLLECTION_IDS as readonly string[]).includes(value)
}

export function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === 'string' && (DIFFICULTIES as readonly string[]).includes(value)
}

export function entryPath(entry: Pick<ContentEntry, 'collection' | 'slug'>): string {
  return `${COLLECTIONS[entry.collection].path}/${entry.slug}`
}

export function makeEntryId(collection: CollectionId, slug: string): string {
  return `${collection}/${slug}`
}
