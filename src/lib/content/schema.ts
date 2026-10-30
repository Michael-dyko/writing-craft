import { slugify } from './slug'

export const COLLECTION_IDS = ['notes', 'exercises'] as const

export type CollectionId = (typeof COLLECTION_IDS)[number]

export type CollectionMeta = {
  id: CollectionId
  title: string
  singular: string
  description: string
  path: string
}

export const COLLECTIONS: Record<CollectionId, CollectionMeta> = {
  notes: {
    id: 'notes',
    title: 'Темы',
    singular: 'Тема',
    description: 'Теория и приёмы. Внутри темы упражнения вставлены ссылками — их же можно открыть отдельно.',
    path: '/notes',
  },
  exercises: {
    id: 'exercises',
    title: 'Упражнения',
    singular: 'Упражнение',
    description: 'Задания из тем, собранные в отдельный список. Каждое упражнение знает свою тему.',
    path: '/exercises',
  },
}

export const TAG_AXES = [
  { id: 'module', param: 'module', label: 'Модуль' },
  { id: 'tasks', param: 'task', label: 'Задача' },
  { id: 'genres', param: 'genre', label: 'Жанр' },
  { id: 'stages', param: 'stage', label: 'Этап' },
  { id: 'areas', param: 'area', label: 'Область' },
] as const

export type TagAxisId = (typeof TAG_AXES)[number]['id']
export type TagAxisParam = (typeof TAG_AXES)[number]['param']

export type ContentFrontmatter = {
  title: string
  slug?: string
  summary: string
  module?: string
  areas?: string[]
  tasks?: string[]
  genres?: string[]
  stages?: string[]
  parent?: string
  related?: string[]
  order?: number
  draft?: boolean
}

export type ContentEntry = {
  id: string
  slug: string
  urlSlug: string
  collection: CollectionId
  title: string
  summary: string
  module?: string
  areas: string[]
  tasks: string[]
  genres: string[]
  stages: string[]
  parent?: string
  related: string[]
  order: number
  draft: boolean
  body: string
  sourcePath: string
}

export function isCollectionId(value: string): value is CollectionId {
  return (COLLECTION_IDS as readonly string[]).includes(value)
}

export function entryPath(entry: Pick<ContentEntry, 'collection' | 'urlSlug'>): string {
  return `${COLLECTIONS[entry.collection].path}/${entry.urlSlug}`
}

export function makeEntryId(collection: CollectionId, slug: string): string {
  return `${collection}/${slug}`
}

export function axisValues(entry: ContentEntry, axis: TagAxisId): string[] {
  if (axis === 'module') return entry.module ? [entry.module] : []
  return entry[axis]
}

export function matchesAxis(
  entry: ContentEntry,
  axis: TagAxisId,
  value: string | null,
): boolean {
  if (!value) return true
  return axisValues(entry, axis).some((item) => item === value || slugify(item) === value)
}
