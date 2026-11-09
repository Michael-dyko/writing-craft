import { embeddedExerciseSlugs } from './parse'
import { allEntries } from './load'
import {
  COLLECTIONS,
  TAG_AXES,
  matchesAxis,
  type CollectionId,
  type CollectionMeta,
  type ContentEntry,
  type TagAxisId,
  type TagAxisParam,
} from './schema'
import { slugify, uniqueSlug } from './slug'

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
  return allEntries.find(
    (entry) =>
      entry.collection === collection && (entry.urlSlug === slug || entry.slug === slug),
  )
}

export function getEntryById(id: string): ContentEntry | undefined {
  return allEntries.find((entry) => entry.id === id)
}

export function getRelated(entry: ContentEntry): ContentEntry[] {
  const fromField = entry.related
    .map((id) => getEntryById(id) ?? allEntries.find((item) => item.slug === id))
    .filter((item): item is ContentEntry => Boolean(item && item.id !== entry.id))

  if (fromField.length > 0) return fromField

  if (entry.collection === 'exercises' && entry.parent) {
    return getExercisesForNoteId(entry.parent).filter((item) => item.id !== entry.id).slice(0, 6)
  }

  if (!entry.module) return []
  return getEntries('notes')
    .filter((item) => item.id !== entry.id && item.module === entry.module)
    .slice(0, 4)
}

export function getExercisesForNote(note: ContentEntry): ContentEntry[] {
  return getExercisesForNoteId(note.id)
}

export function getExercisesForNoteId(noteId: string): ContentEntry[] {
  return getEntries('exercises')
    .filter((entry) => entry.parent === noteId)
    .sort((a, b) => a.order - b.order)
}

export function getParentNote(entry: ContentEntry): ContentEntry | undefined {
  return entry.parent ? getEntryById(entry.parent) : undefined
}

export function getOrphanExercises(note: ContentEntry): ContentEntry[] {
  const embedded = new Set(embeddedExerciseSlugs(note.body))
  return getExercisesForNote(note).filter((item) => !embedded.has(item.slug))
}

export function getAxisOptions(collection: CollectionId, axis: TagAxisId): string[] {
  const values = getEntries(collection).flatMap((entry) => {
    if (axis === 'module') return entry.module ? [entry.module] : []
    return entry[axis]
  })
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'ru'))
}

export function filterEntries(
  collection: CollectionId,
  filters: Partial<Record<TagAxisId, string | null>>,
): ContentEntry[] {
  return getEntries(collection).filter((entry) =>
    TAG_AXES.every((axis) => matchesAxis(entry, axis.id, filters[axis.id] ?? null)),
  )
}

export function getModules(): { name: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const entry of getEntries('notes')) {
    if (!entry.module) continue
    counts.set(entry.module, (counts.get(entry.module) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
}

export type SitemapNote = {
  note: ContentEntry
  exercises: ContentEntry[]
}

export type SitemapGroup = {
  id: string
  name: string
  module: string | null
  notes: SitemapNote[]
}

export function getSitemap(): { groups: SitemapGroup[]; loose: ContentEntry[] } {
  const notes = getEntries('notes')
  const noteIds = new Set(notes.map((note) => note.id))
  const byParent = new Map<string, ContentEntry[]>()
  const loose: ContentEntry[] = []

  for (const exercise of getEntries('exercises')) {
    const parent = exercise.parent
    if (!parent || !noteIds.has(parent)) {
      loose.push(exercise)
      continue
    }
    const list = byParent.get(parent)
    if (list) list.push(exercise)
    else byParent.set(parent, [exercise])
  }

  const byModule = new Map<string, SitemapNote[]>()
  const unassigned: SitemapNote[] = []

  for (const note of notes) {
    const item = { note, exercises: byParent.get(note.id) ?? [] }
    if (!note.module) {
      unassigned.push(item)
      continue
    }
    const list = byModule.get(note.module)
    if (list) list.push(item)
    else byModule.set(note.module, [item])
  }

  const taken = new Set<string>()
  const groups: SitemapGroup[] = [...byModule.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'ru'))
    .map(([name, moduleNotes]) => ({
      id: uniqueSlug(name, taken),
      name,
      module: name,
      notes: moduleNotes,
    }))

  if (unassigned.length > 0) {
    groups.push({
      id: uniqueSlug('Без модуля', taken),
      name: 'Без модуля',
      module: null,
      notes: unassigned,
    })
  }

  return { groups, loose }
}

export function getFeatured(limit = 5): ContentEntry[] {
  return getEntries('notes').slice(0, limit)
}

export function searchEntries(query: string): ContentEntry[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  return allEntries.filter((entry) => {
    const haystack = [
      entry.title,
      entry.summary,
      entry.module ?? '',
      entry.areas.join(' '),
      entry.tasks.join(' '),
      entry.genres.join(' '),
      entry.stages.join(' '),
      entry.body,
    ]
      .join('\n')
      .toLowerCase()

    return haystack.includes(needle)
  })
}

export function countByCollection(): Record<CollectionId, number> {
  return {
    notes: getEntries('notes').length,
    exercises: getEntries('exercises').length,
  }
}

export function axisFiltersFromSearch(
  params: URLSearchParams,
): Partial<Record<TagAxisId, string | null>> {
  return Object.fromEntries(TAG_AXES.map((axis) => [axis.id, params.get(axis.param)])) as Partial<
    Record<TagAxisId, string | null>
  >
}

export function canonicalizeAxisSearch(params: URLSearchParams): string {
  const next = new URLSearchParams(params)
  for (const axis of TAG_AXES) {
    const raw = params.get(axis.param)
    if (!raw) continue
    const slug = slugify(raw)
    if (slug && slug !== raw) next.set(axis.param, slug)
  }
  return next.toString()
}

export function axisFilterSearch(
  params: URLSearchParams,
  param: TagAxisParam,
  value: string | null,
): string {
  const next = new URLSearchParams(params)
  if (value) next.set(param, slugify(value) || value)
  else next.delete(param)
  return next.toString()
}
