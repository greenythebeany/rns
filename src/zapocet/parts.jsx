import { useEffect, useRef } from 'react'
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

const LETTERS = 'ABCDEFGH'

/**
 * Question with its options. `options` may be shuffled, so letters follow the shown order.
 * With `onPick` the options are buttons; after reveal the correct one and a wrong pick are marked
 * by colour, icon and text.
 */
export function QuestionCard({ q, options = q.options, revealed, picked, onPick }) {
  const correctAt = options.findIndex((o) => o.key === q.correct)
  return (
    <article className="card qcard">
      <Rich as="h2" className="q" text={q.question} />
      {options.length > 0 ? (
        <ol className="opts">
          {options.map((o, i) => {
            const ok = revealed && o.key === q.correct
            const bad = revealed && o.key === picked && !ok
            const body = (
              <>
                <b aria-hidden="true">{LETTERS[i]}</b>
                <span className="visually-hidden">{LETTERS[i]})</span>
                <Rich className="opt-text" text={o.text} />
                {ok && <span className="tag"><span aria-hidden="true">✓ </span>Správne</span>}
                {bad && <span className="tag tag-bad"><span aria-hidden="true">✗ </span>Tvoja odpoveď</span>}
              </>
            )
            if (onPick && !revealed) {
              return (
                <li key={o.key} className="pick">
                  <button type="button" className="opt-btn" onClick={() => onPick(o.key)}>{body}</button>
                </li>
              )
            }
            return <li key={o.key} className={revealed ? (ok ? 'ok' : bad ? 'bad' : 'dim') : undefined}>{body}</li>
          })}
        </ol>
      ) : revealed ? (
        <div className="open-answer"><span className="tag">Správna odpoveď</span><Rich as="p" text={q.answer} /></div>
      ) : (
        <p className="muted open-hint">Otázka bez možností. Odpovedz si v duchu a potom odkry odpoveď.</p>
      )}
      {revealed && picked != null && options.length > 0 && (
        <p className={`verdict ${picked === q.correct ? 'is-ok' : 'is-bad'}`} role="status">
          {picked === q.correct ? 'Správne.' : `${picked ? 'Nesprávne.' : 'Bez odpovede.'} Správna je ${LETTERS[correctAt]}.`}
        </p>
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

/**
 * 1–4 or A–D pick an option, space reveals, ← / → self-grade, after a pick space / → / Enter go on.
 * Ignored while typing in a field.
 */
export function useStudyKeys({ revealed, picked, options = [], onPick, onReveal, onGrade, onNext, enabled = true }) {
  useEffect(() => {
    if (!enabled) return
    function onKey(e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (!revealed && onPick && e.key.length === 1) {
        const k = e.key.toUpperCase()
        const i = '1234'.includes(k) ? Number(k) - 1 : LETTERS.indexOf(k)
        if (i >= 0 && i < options.length) { e.preventDefault(); onPick(options[i].key); return }
      }
      if (revealed && picked != null) {
        if (e.key === 'Enter' && tag === 'BUTTON') return
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); onNext() }
        return
      }
      if (e.key === ' ' && !revealed) { e.preventDefault(); onReveal() }
      else if (e.key === 'ArrowLeft' && revealed) { e.preventDefault(); onGrade(false) }
      else if (e.key === 'ArrowRight' && revealed) { e.preventDefault(); onGrade(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealed, picked, options, onPick, onReveal, onGrade, onNext, enabled])
}

/** Reveal button, then Neviem / Viem, or Ďalej after a picked option. Fixed to the bottom on phones. */
export function StudyActions({ revealed, picked, onReveal, onGrade, onNext, revealLabel = 'Ukázať odpoveď' }) {
  const nextRef = useRef(null)
  const showNext = revealed && picked != null
  useEffect(() => { if (showNext) nextRef.current?.focus({ preventScroll: true }) }, [showNext])
  return (
    <div className="study-actions">
      {showNext ? (
        <button ref={nextRef} type="button" className="btn btn-primary wide" onClick={onNext}>
          Ďalej<kbd className="hide-mobile" aria-hidden="true">→</kbd>
        </button>
      ) : revealed ? (
        <>
          <button type="button" className="btn btn-bad" onClick={() => onGrade(false)}>
            Neviem<kbd className="hide-mobile" aria-hidden="true">←</kbd>
          </button>
          <button type="button" className="btn btn-ok" onClick={() => onGrade(true)}>
            Viem<kbd className="hide-mobile" aria-hidden="true">→</kbd>
          </button>
        </>
      ) : (
        <button type="button" className="btn wide" onClick={onReveal}>
          {revealLabel}<kbd className="hide-mobile" aria-hidden="true">medzerník</kbd>
        </button>
      )}
    </div>
  )
}

export { statusOf }
