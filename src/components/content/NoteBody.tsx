import { splitExerciseEmbeds } from '@/lib/content'
import { ExerciseEmbed } from './ExerciseEmbed'
import { MarkdownBody } from './MarkdownBody'

export function NoteBody({ source }: { source: string }) {
  const parts = splitExerciseEmbeds(source)

  if (parts.length === 0) {
    return <MarkdownBody source={source} />
  }

  return (
    <>
      {parts.map((part, index) =>
        part.type === 'exercise' ? (
          <ExerciseEmbed key={`${part.slug}-${index}`} slug={part.slug} />
        ) : (
          <MarkdownBody key={`md-${index}`} source={part.text} />
        ),
      )}
    </>
  )
}
