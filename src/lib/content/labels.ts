import type { CollectionId, Difficulty } from './schema'

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: 'Новичок',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
}

export const collectionNav: { id: CollectionId | 'home'; to: string; label: string }[] = [
  { id: 'home', to: '/', label: 'Главная' },
  { id: 'techniques', to: '/techniques', label: 'Приёмы' },
  { id: 'exercises', to: '/exercises', label: 'Упражнения' },
  { id: 'glossary', to: '/glossary', label: 'Словарь' },
  { id: 'articles', to: '/articles', label: 'Статьи' },
]
