export type ParsedMarkdown = {
  data: Record<string, unknown>
  body: string
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

/**
 * Простой frontmatter: скаляры, inline-массивы и списки `- item`.
 * Строки с двоеточиями не нужно брать в кавычки — в отличие от YAML.
 */
export function parseMarkdown(raw: string): ParsedMarkdown {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) {
    return { data: {}, body: raw.trim() }
  }

  return { data: parseFrontmatter(match[1]), body: match[2].trim() }
}

function parseFrontmatter(block: string): Record<string, unknown> {
  const data: Record<string, unknown> = {}
  let currentKey: string | null = null

  for (const line of block.split(/\r?\n/)) {
    const listItem = line.match(/^\s+-\s+(.*)$/)
    if (listItem && currentKey) {
      const existing = data[currentKey]
      const list = Array.isArray(existing) ? existing.map((item) => String(item)) : []
      list.push(unquote(listItem[1].trim()))
      data[currentKey] = list
      continue
    }

    const field = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/)
    if (!field) continue

    currentKey = field[1]
    const rawValue = field[2].trim()
    data[currentKey] = rawValue === '' ? [] : coerce(rawValue)
  }

  return data
}

function coerce(value: string): unknown {
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === '[]') return []
  if (/^-?\d+$/.test(value)) return Number(value)
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => unquote(item.trim()))
      .filter(Boolean)
  }
  return unquote(value)
}

function unquote(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }
  return value
}

export function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export function asStringArray(value: unknown): string[] {
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
}

export const EXERCISE_EMBED_RE = /:::exercise\s+([^\s:]+):::/g

export function splitExerciseEmbeds(source: string): Array<
  { type: 'markdown'; text: string } | { type: 'exercise'; slug: string }
> {
  const parts: Array<{ type: 'markdown'; text: string } | { type: 'exercise'; slug: string }> = []
  const pattern = new RegExp(EXERCISE_EMBED_RE.source, 'g')
  let last = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(source))) {
    const before = source.slice(last, match.index).trim()
    if (before) parts.push({ type: 'markdown', text: before })
    parts.push({ type: 'exercise', slug: match[1] })
    last = match.index + match[0].length
  }
  const rest = source.slice(last).trim()
  if (rest) parts.push({ type: 'markdown', text: rest })
  return parts
}

export function embeddedExerciseSlugs(source: string): string[] {
  return [...source.matchAll(new RegExp(EXERCISE_EMBED_RE.source, 'g'))].map(
    (match) => match[1],
  )
}

export function stripLeadingHeading(source: string): string {
  return source.replace(/^#{1,6}\s+.*(?:\n+|$)/, '').trim()
}

export function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

export function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04ff]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
