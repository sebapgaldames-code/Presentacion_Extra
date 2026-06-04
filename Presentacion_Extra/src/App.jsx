import { useEffect, useMemo, useState } from 'react'
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
    if (listType === 'ul') result.push('</ul>')
    if (listType === 'ol') result.push('</ol>')
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
  const getTheme = (slide) => {
    const name = (slide?.fileName || slide?.title || '').toLowerCase()
    const t = (k, accent, weak, bg, border) => ({ key: k, accent, weak, bg, border })

    if (!name) return t('default', '#60a5fa', 'rgba(96,165,250,0.08)', 'linear-gradient(180deg,#0b1220,#071029)', 'rgba(96,165,250,0.2)')

    if (name.includes('resumen')) return t('resumen', '#60a5fa', 'rgba(96,165,250,0.08)', 'linear-gradient(180deg,#021428,#07203a)', 'rgba(96,165,250,0.2)')
    if (name.includes('marco')) return t('marco', '#7c3aed', 'rgba(124,58,237,0.08)', 'linear-gradient(180deg,#130627,#2b0b3a)', 'rgba(124,58,237,0.2)')
    if (name.includes('delitos')) return t('delitos', '#ef4444', 'rgba(239,68,68,0.08)', 'linear-gradient(180deg,#2a0b0b,#210808)', 'rgba(239,68,68,0.2)')
    if (name.includes('compar') || name.includes('comparasion')) return t('comparacion', '#8b5cf6', 'rgba(139,92,246,0.08)', 'linear-gradient(180deg,#0f0226,#21063a)', 'rgba(139,92,246,0.2)')
    if (name.includes('respons') || name.includes('responsabilidades')) return t('responsabilidades', '#06b6d4', 'rgba(6,182,212,0.08)', 'linear-gradient(180deg,#022626,#032a2d)', 'rgba(6,182,212,0.2)')
    if (name.includes('datos')) return t('datos', '#10b981', 'rgba(16,185,129,0.08)', 'linear-gradient(180deg,#062617,#072b1f)', 'rgba(16,185,129,0.2)')
    if (name.includes('conclusion') || name.includes('conclusiones')) return t('conclusiones', '#f59e0b', 'rgba(245,158,11,0.08)', 'linear-gradient(180deg,#2a1a00,#211400)', 'rgba(245,158,11,0.2)')
    if (name.includes('prompt') || name.includes('prompts')) return t('prompts', '#6366f1', 'rgba(99,102,241,0.08)', 'linear-gradient(180deg,#07102a,#0b1238)', 'rgba(99,102,241,0.2)')

    return t('default', '#60a5fa', 'rgba(96,165,250,0.08)', 'linear-gradient(180deg,#011627,#04264a)', 'rgba(96,165,250,0.2)')
  }

  const theme = getTheme(active)
  const html = useMemo(() => (active ? parseMarkdown(active.content) : ''), [active])

  const goPrev = () => setCurrent((index) => Math.max(0, index - 1))
  const goNext = () => setCurrent((index) => Math.min(slides.length - 1, index + 1))

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') goNext()
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') goPrev()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [slides.length])

  return (
    <main className="presentation">
      <section
        className="slide"
        style={{
          ['--accent']: theme.accent,
          ['--accent-weak']: theme.weak,
          ['--slide-bg']: theme.bg,
          ['--accent-border']: theme.border,
        }}
      >
        <header className="slide__header">
          <div>
            <span className="slide__meta">Presentación</span>
            <strong className="slide__count">Diapositiva {current + 1} / {slides.length}</strong>
          </div>
          <div className="slide__actions">
            <button onClick={() => setCurrent(0)} disabled={current === 0}>Primera</button>
            <button onClick={goPrev} disabled={current === 0}>Anterior</button>
            <button onClick={goNext} disabled={current === slides.length - 1}>Siguiente</button>
            <button onClick={() => setCurrent(slides.length - 1)} disabled={current === slides.length - 1}>Última</button>
          </div>
        </header>

        <article className="slide__body">
          <h1 className="slide__title">{active?.title ?? 'Sin contenido'}</h1>
          <div className="slide__content" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </section>
    </main>
  )
}

export default App
