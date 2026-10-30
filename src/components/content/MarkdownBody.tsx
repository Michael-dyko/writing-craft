import { marked } from 'marked'
import styles from './MarkdownBody.module.css'

marked.setOptions({ gfm: true })

export function MarkdownBody({ source }: { source: string }) {
  const html = String(marked.parse(source, { async: false })).replace(
    /<table[\s\S]*?<\/table>/g,
    (table) => `<div class="${styles.tableWrap}">${table}</div>`,
  )

  return (
    <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
