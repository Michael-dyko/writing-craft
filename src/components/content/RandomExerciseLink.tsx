import { Link, useNavigate } from 'react-router-dom'
import { entryPath, type ContentEntry } from '@/lib/content'
import styles from './RandomExerciseLink.module.css'

type Props = {
  entries?: ContentEntry[]
  exceptId?: string
  label?: string
  className?: string
}

export function RandomExerciseLink({
  entries,
  exceptId,
  label = 'Случайное упражнение',
  className,
}: Props) {
  const navigate = useNavigate()
  const classNames = [styles.link, className].filter(Boolean).join(' ')

  if (entries) {
    const pool = entries.filter((entry) => entry.id !== exceptId)
    if (pool.length === 0) return null

    return (
      <button
        type="button"
        className={classNames}
        onClick={() => {
          const pick = pool[Math.floor(Math.random() * pool.length)]
          navigate(entryPath(pick))
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <Link className={classNames} to="/random" state={exceptId ? { exceptId } : undefined}>
      {label}
    </Link>
  )
}
