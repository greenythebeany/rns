import { useEffect } from 'react'
import { Rich } from '../shared/Rich.jsx'
import { STATUS_LABEL, statusOf, summarize } from '../shared/progress.js'
import { topics, pool } from './data.js'

export function ProgressBar({ summary, label }) {
  const pct = (n) => (summary.total ? (n / summary.total) * 100 : 0)
  return (
    <div
      className="bar" role="img"
      aria-label={label ?? `Viem ${summary.known}, učím sa ${summary.learning}, nové ${summary.new} z ${summary.total}`}
    >
      <i className="known" style={{ width: `${pct(summary.known)}%` }} />
      <i className="learning" style={{ width: `${pct(summary.learning)}%` }} />
    </div>
  )
}

export function StatusChip({ status }) {
  return <span className={`chip chip-${status}`}>{STATUS_LABEL[status]}</span>
}

/** Question with its options. After reveal the correct option is marked by colour, icon and text. */
export function QuestionCard({ q, revealed, headingLevel = 2 }) {
  const H = `h${headingLevel}`
  return (
    <article className="card qcard">
      <Rich as={H} className="q" text={q.question} />
      {q.options.length > 0 ? (
        <ol className="opts">
          {q.options.map((o) => {
            const ok = revealed && o.key === q.correct
            return (
              <li key={o.key} className={revealed ? (ok ? 'ok' : 'dim') : undefined}>
                <b aria-hidden="true">{o.key}</b>
                <span className="visually-hidden">{o.key})</span>
                <Rich className="opt-text" text={o.text} />
                {ok && <span className="tag"><span aria-hidden="true">✓ </span>Správne</span>}
              </li>
            )
          })}
        </ol>
      ) : revealed ? (
        <div className="open-answer"><span className="tag">Správna odpoveď</span><Rich as="p" text={q.answer} /></div>
      ) : (
        <p className="muted open-hint">Otázka bez možností. Odpovedz si v duchu a potom odkry odpoveď.</p>
      )}
      {revealed && <p className="src">Zdroj: {q.source.pdf}, s. {q.source.page}</p>}
    </article>
  )
}

/** Topic picker: buttons with progress on desktop, a select on phones. */
export function TopicPicker({ value, onChange, progress, id }) {
  const all = summarize(progress, pool('all'))
  const options = [{ id: 'all', name: 'Všetky témy', s: all }, ...topics.map((t) => ({ ...t, s: summarize(progress, pool(t.id)) }))]
  const current = options.find((o) => o.id === value)
  return (
    <div className="topic-picker">
      <aside className="topic-rail" aria-label="Témy">
        <h2 className="rail-title">Témy</h2>
        <ul>
          {options.map((o) => (
            <li key={o.id}>
              <button type="button" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
                <span>{o.name}</span>
                <span className="rail-count">{o.s.known}/{o.s.total}</span>
                <ProgressBar summary={o.s} />
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="topic-select">
        <label className="visually-hidden" htmlFor={id}>Téma</label>
        <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <div className="topic-select-meta muted small">
          <span>Viem {current.s.known} z {current.s.total}</span>
        </div>
        <ProgressBar summary={current.s} />
      </div>
    </div>
  )
}

/** Space reveals, ← / → grade. Ignored while typing in a field. */
export function useStudyKeys({ revealed, onReveal, onGrade, enabled = true }) {
  useEffect(() => {
    if (!enabled) return
    function onKey(e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (e.key === ' ' && !revealed) { e.preventDefault(); onReveal() }
      else if (e.key === 'ArrowLeft' && revealed) { e.preventDefault(); onGrade(false) }
      else if (e.key === 'ArrowRight' && revealed) { e.preventDefault(); onGrade(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealed, onReveal, onGrade, enabled])
}

/** Reveal button, then Neviem / Viem. Fixed to the bottom on phones. */
export function StudyActions({ revealed, onReveal, onGrade }) {
  return (
    <div className="study-actions">
      {revealed ? (
        <>
          <button type="button" className="btn btn-bad" onClick={() => onGrade(false)}>
            Neviem<kbd className="hide-mobile" aria-hidden="true">←</kbd>
          </button>
          <button type="button" className="btn btn-ok" onClick={() => onGrade(true)}>
            Viem<kbd className="hide-mobile" aria-hidden="true">→</kbd>
          </button>
        </>
      ) : (
        <button type="button" className="btn btn-primary wide" onClick={onReveal}>
          Ukázať odpoveď<kbd className="hide-mobile" aria-hidden="true">medzerník</kbd>
        </button>
      )}
    </div>
  )
}

export { statusOf }
