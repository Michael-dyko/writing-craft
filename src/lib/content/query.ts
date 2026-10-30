import { allEntries } from './load'
import {
  COLLECTIONS,
  type CollectionId,
  type CollectionMeta,
  type ContentEntry,
} from './schema'

export function getCollections(): CollectionMeta[] {
  return Object.values(COLLECTIONS)
}

export function getCollection(id: CollectionId): CollectionMeta {
  return COLLECTIONS[id]
}

export function getAllEntries(): ContentEntry[] {
  return allEntries
}

export function getEntries(collection: CollectionId): ContentEntry[] {
  return allEntries.filter((entry) => entry.collection === collection)
}

export function getEntry(collection: CollectionId, slug: string): ContentEntry | undefined {
  return allEntries.find((entry) => entry.collection === collection && entry.slug === slug)
}

export function getEntryById(id: string): ContentEntry | undefined {
  return allEntries.find((entry) => entry.id === id)
}

export function getRelated(entry: ContentEntry): ContentEntry[] {
  return entry.related
    .map((id) => getEntryById(id) ?? allEntries.find((item) => item.slug === id))
    .filter((item): item is ContentEntry => Boolean(item && item.id !== entry.id))
}

export function getTags(collection?: CollectionId): string[] {
  const source = collection ? getEntries(collection) : allEntries
  return [...new Set(source.flatMap((entry) => entry.tags))].sort((a, b) =>
    a.localeCompare(b, 'ru'),
  )
}

export function getFeatured(limit = 3): ContentEntry[] {
  return getEntries('techniques').slice(0, limit)
}

export function searchEntries(query: string): ContentEntry[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  return allEntries.filter((entry) => {
    const haystack = [
      entry.title,
      entry.summary,
      entry.category ?? '',
      entry.tags.join(' '),
      entry.body,
    ]
      .join('\n')
      .toLowerCase()

    return haystack.includes(needle)
  })
}

export function countByCollection(): Record<CollectionId, number> {
  return {
    techniques: getEntries('techniques').length,
    exercises: getEntries('exercises').length,
    glossary: getEntries('glossary').length,
    articles: getEntries('articles').length,
  }
}
