import { useCallback, useState } from 'react'
import { Rich } from '../shared/Rich.jsx'
import { topics, pool, shuffle, plural } from './data.js'
import { QuestionCard, StudyActions, useStudyKeys } from './parts.jsx'

const COUNTS = [5, 10, 20, 30]

function Setup({ onStart }) {
  const [count, setCount] = useState(10)
  const [topic, setTopic] = useState('all')
  const available = pool(topic).length
  return (
    <form className="card test-setup" onSubmit={(e) => { e.preventDefault(); onStart(shuffle(pool(topic)).slice(0, count)) }}>
      <h2>Cvičný test</h2>
      <p className="muted">Odpovedz si v duchu, odkry správnu odpoveď a ohodnoť sa. Na konci uvidíš skóre.</p>
      <label className="lbl" htmlFor="t-topic">Téma</label>
      <select id="t-topic" className="field" value={topic} onChange={(e) => setTopic(e.target.value)}>
        <option value="all">Všetky témy</option>
        {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <fieldset className="counts">
        <legend className="lbl">Počet otázok</legend>
        {COUNTS.map((n) => (
          <label key={n} className="count-opt">
            <input type="radio" name="count" value={n} checked={count === n} onChange={() => setCount(n)} />
            <span>{n}</span>
          </label>
        ))}
      </fieldset>
      {count > available && <p className="muted small">Téma má len {plural(available, 'otázku', 'otázky', 'otázok')}, test ich bude mať toľko.</p>}
      <button type="submit" className="btn btn-primary">Začať test</button>
    </form>
  )
}

function Result({ items, answers, onAgain, onRetryWrong }) {
  const score = answers.filter(Boolean).length
  const wrong = items.filter((_, i) => !answers[i])
  const pct = Math.round((score / items.length) * 100)
  return (
    <div className="test-result">
      <div className="card score">
        <h2>Výsledok</h2>
        <p className="score-big"><strong>{score}</strong> z {items.length}</p>
        <p className="muted">{pct} % správne</p>
        <div className="score-actions">
          <button type="button" className="btn btn-primary" onClick={onAgain}>Nový test</button>
          {wrong.length > 0 && <button type="button" className="btn" onClick={() => onRetryWrong(wrong)}>Zopakovať chybné ({wrong.length})</button>}
        </div>
      </div>
      {wrong.length > 0 && (
        <section className="wrong">
          <h3>Na zopakovanie</h3>
          <ul>
            {wrong.map((q) => (
              <li key={q.id} className="card">
                <Rich as="p" className="wq" text={q.question} />
                <Rich as="p" className="wa" text={q.answer} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default function TestMode({ onGrade }) {
  const [items, setItems] = useState(null)
  const [answers, setAnswers] = useState([])
  const [revealed, setRevealed] = useState(false)

  const start = (list) => { setItems(list); setAnswers([]); setRevealed(false) }
  const index = answers.length
  const current = items?.[index]

  const reveal = useCallback(() => setRevealed(true), [])
  const grade = useCallback((knew) => {
    if (!current) return
    onGrade(current.id, knew)
    setAnswers((a) => [...a, knew])
    setRevealed(false)
  }, [current, onGrade])

  useStudyKeys({ revealed, onReveal: reveal, onGrade: grade, enabled: Boolean(current) })

  if (!items) return <div className="narrow centered"><Setup onStart={start} /></div>
  if (!current) {
    return (
      <div className="narrow centered">
        <Result items={items} answers={answers} onAgain={() => setItems(null)} onRetryWrong={(w) => start(shuffle(w))} />
      </div>
    )
  }
  return (
    <div className="narrow centered">
      <div className="study-meta">
        <span>Otázka {index + 1} z {items.length}</span>
        <button type="button" className="btn btn-quiet" onClick={() => setItems(null)}>Ukončiť test</button>
      </div>
      <div className="bar test-bar" role="progressbar" aria-label="Priebeh testu" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={index}>
        <i className="known" style={{ width: `${(index / items.length) * 100}%`, background: 'var(--accent)' }} />
      </div>
      <div key={current.id + index} className="fade-in">
        <QuestionCard q={current} revealed={revealed} />
      </div>
      <StudyActions revealed={revealed} onReveal={reveal} onGrade={grade} />
    </div>
  )
}
