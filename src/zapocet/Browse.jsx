import { useDeferredValue, useMemo, useState } from 'react'
import { Rich } from '../shared/Rich.jsx'
import { fold } from '../shared/fold.js'
import { statusOf, summarize } from '../shared/progress.js'
import { topics, byTopic, questions, plural } from './data.js'
import { ProgressBar, StatusChip } from './parts.jsx'

function Item({ q, status, open, onToggle }) {
  const panelId = `ans-${q.id}`
  return (
    <li className="bitem">
      <button type="button" className="bitem-q" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        <Rich className="bitem-text" text={q.question} />
        <StatusChip status={status} />
        <svg className="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <div id={panelId} className="bitem-a" hidden={!open}>
        {q.options.length > 0 ? (
          <ol className="opts compact">
            {q.options.map((o) => (
              <li key={o.key} className={o.key === q.correct ? 'ok' : 'dim'}>
                <b aria-hidden="true">{o.key}</b>
                <span className="visually-hidden">{o.key})</span>
                <Rich className="opt-text" text={o.text} />
                {o.key === q.correct && <span className="tag"><span aria-hidden="true">✓ </span>Správne</span>}
              </li>
            ))}
          </ol>
        ) : (
          <div className="open-answer"><span className="tag">Správna odpoveď</span><Rich as="p" text={q.answer} /></div>
        )}
        <p className="src">Zdroj: {q.source.pdf}, s. {q.source.page}</p>
      </div>
    </li>
  )
}

export default function Browse({ progress }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(() => new Set())
  const deferred = useDeferredValue(query)
  const words = useMemo(() => fold(deferred).split(/\s+/).filter(Boolean), [deferred])
  const searching = words.length > 0
  const hits = useMemo(
    () => (searching ? new Set(questions.filter((q) => words.every((w) => q.folded.includes(w))).map((q) => q.id)) : null),
    [words, searching],
  )

  const toggle = (id) => setOpen((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  return (
    <div className="browse">
      <div className="search">
        <label className="visually-hidden" htmlFor="qsearch">Hľadať v otázkach a odpovediach</label>
        <input
          id="qsearch" className="field" type="search" autoComplete="off"
          placeholder="Hľadať v otázkach a odpovediach…"
          value={query} onChange={(e) => setQuery(e.target.value)}
        />
        <p className="muted small" aria-live="polite">
          {searching ? `Nájdené: ${plural(hits.size, 'otázka', 'otázky', 'otázok')}` : `${plural(questions.length, 'otázka', 'otázky', 'otázok')} v ${topics.length} témach`}
        </p>
      </div>

      {searching && hits.size === 0 && (
        <p className="empty">Nič sa nenašlo. Skús iné slovo alebo kratší výraz.</p>
      )}

      {topics.map((t) => {
        const list = byTopic[t.id].filter((q) => !hits || hits.has(q.id))
        if (list.length === 0) return null
        const s = summarize(progress, byTopic[t.id])
        return (
          <section key={t.id} className="topic" aria-labelledby={`h-${t.id}`}>
            <div className="topic-head">
              <h2 id={`h-${t.id}`}>{t.name}</h2>
              <p className="muted small">Viem {s.known} z {s.total}</p>
              <ProgressBar summary={s} />
            </div>
            <ul className="blist">
              {list.map((q) => (
                <Item
                  key={q.id} q={q} status={statusOf(progress, q.id)}
                  open={searching || open.has(q.id)} onToggle={() => toggle(q.id)}
                />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
