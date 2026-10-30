import { Link } from 'react-router-dom'
import { entryPath, getEntry } from '@/lib/content'
import { MarkdownBody } from './MarkdownBody'
import styles from './ExerciseEmbed.module.css'

export function ExerciseEmbed({ slug }: { slug: string }) {
  const exercise = getEntry('exercises', slug)
  if (!exercise) return null

  return (
    <section className={styles.card} aria-label={`Упражнение: ${exercise.title}`}>
      <p className={styles.kicker}>Упражнение</p>
      <h2 className={styles.title}>{exercise.title}</h2>
      <MarkdownBody source={stripLeadingHeading(exercise.body)} />
      <Link className={styles.link} to={entryPath(exercise)}>
        Открыть отдельно
      </Link>
    </section>
  )
}

function stripLeadingHeading(source: string): string {
  return source.replace(/^#{1,6}\s+.*\n+/, '')
}
