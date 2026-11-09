import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { entryPath, pickRandomExercise } from '@/lib/content'
import styles from './RandomExercisePage.module.css'

function exceptIdFrom(state: unknown): string | undefined {
  if (typeof state !== 'object' || state === null || !('exceptId' in state)) return undefined
  const value = state.exceptId
  return typeof value === 'string' ? value : undefined
}

export function RandomExercisePage() {
  const { state } = useLocation()
  const [pick] = useState(() => pickRandomExercise(exceptIdFrom(state)))

  if (!pick) {
    return (
      <div className="page">
        <h1 className={styles.title}>Упражнений пока нет.</h1>
        <p className={styles.text}>Когда в базе появится задание, здесь откроется случайное.</p>
      </div>
    )
  }

  return <Navigate to={entryPath(pick)} replace />
}
