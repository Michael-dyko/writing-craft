import type { CollectionId } from './schema'

export const collectionNav: { id: CollectionId | 'home'; to: string; label: string }[] = [
  { id: 'home', to: '/', label: 'Главная' },
  { id: 'notes', to: '/notes', label: 'Темы' },
  { id: 'exercises', to: '/exercises', label: 'Упражнения' },
]
