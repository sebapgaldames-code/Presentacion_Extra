import { useMemo, useState } from 'react'
import './App.css'

const docs = import.meta.glob('../docs/*.md', { as: 'raw', eager: true })

const parseMarkdown = (markdown) => {
  const escapeHtml = (text) => text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const inline = (text) => text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')

  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const result = []
  let listType = null
  let inCode = false

  const closeList = () => {
    if (listType === 'ul') {
      result.push('</ul>')
    } else if (listType === 'ol') {
      result.push('</ol>')
    }
    listType = null
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        result.push('</code></pre>')
        inCode = false
      } else {
        closeList()
        result.push('<pre><code>')
        inCode = true
      }
      continue
    }

    if (inCode) {
      result.push(escapeHtml(line))
      continue
    }

    if (!line.trim()) {
      closeList()
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      closeList()
      const level = headingMatch[1].length
      result.push(`<h${level}>${inline(escapeHtml(headingMatch[2]))}</h${level}>`)
      continue
    }

    const ulMatch = line.match(/^(\*|\-|\+)\s+(.*)$/)
    if (ulMatch) {
      if (listType !== 'ul') {
        closeList()
        listType = 'ul'
        result.push('<ul>')
      }
      result.push(`<li>${inline(escapeHtml(ulMatch[2]))}</li>`)
      continue
    }

    const olMatch = line.match(/^(\d+)\.\s+(.*)$/)
    if (olMatch) {
      if (listType !== 'ol') {
        closeList()
        listType = 'ol'
        result.push('<ol>')
      }
      result.push(`<li>${inline(escapeHtml(olMatch[2]))}</li>`)
      continue
    }

    const blockquoteMatch = line.match(/^>\s+(.*)$/)
    if (blockquoteMatch) {
      closeList()
      result.push(`<blockquote>${inline(escapeHtml(blockquoteMatch[1]))}</blockquote>`)
      continue
    }

    result.push(`<p>${inline(escapeHtml(line))}</p>`)
  }

  closeList()
  return result.join('\n')
}

const slides = Object.entries(docs)
  .map(([path, content]) => {
    const fileName = path.split('/').pop()
    const title = content
      .split('\n')
      .find((line) => line.startsWith('# '))
      ?.replace(/^#\s*/, '')
      .trim() || fileName

    return { fileName, title, content }
  })
  .sort((a, b) => a.fileName.localeCompare(b.fileName))

function App() {
  const [current, setCurrent] = useState(0)
  const active = slides[current]
  const html = useMemo(() => (active ? parseMarkdown(active.content) : ''), [active])

  const goPrev = () => setCurrent((index) => Math.max(0, index - 1))
  const goNext = () => setCurrent((index) => Math.min(slides.length - 1, index + 1))

  return (
    <main className="presentation">
      <header className="presentation__header">
        <div>
          <strong>Presentación</strong>
          <span>Diapositiva {current + 1}/{slides.length}</span>
        </div>
        <nav className="presentation__nav">
          <button onClick={() => setCurrent(0)} disabled={current === 0}>Primera</button>
          <button onClick={goPrev} disabled={current === 0}>Anterior</button>
          <button onClick={goNext} disabled={current === slides.length - 1}>Siguiente</button>
          <button onClick={() => setCurrent(slides.length - 1)} disabled={current === slides.length - 1}>Última</button>
        </nav>
      </header>

      <section className="slide">
        <h1 className="slide__title">{active?.title ?? 'Sin contenido'}</h1>
        <div className="slide__content" dangerouslySetInnerHTML={{ __html: html }} />
      </section>

      <aside className="slide__toc">
        <h2>Diapositivas</h2>
        <ol>
          {slides.map((slide, index) => (
            <li key={slide.fileName}>
              <button
                className={index === current ? 'active' : ''}
                onClick={() => setCurrent(index)}
              >
                {slide.title}
              </button>
            </li>
          ))}
        </ol>
      </aside>
    </main>
  )
}

export default App
