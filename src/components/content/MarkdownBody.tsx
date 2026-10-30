import { marked } from 'marked'
import styles from './MarkdownBody.module.css'

marked.setOptions({ gfm: true })

export function MarkdownBody({ source }: { source: string }) {
  const html = marked.parse(source, { async: false })

  return (
    <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
