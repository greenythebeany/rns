import { summarize } from '../shared/progress.js'
import { topics, byTopic, questions } from './data.js'
import { ProgressBar } from './parts.jsx'

function Counts({ s }) {
  return (
    <p className="counts-line small">
      <span><i className="dot known" aria-hidden="true" />Viem {s.known}</span>
      <span><i className="dot learning" aria-hidden="true" />Učím sa {s.learning}</span>
      <span><i className="dot new" aria-hidden="true" />Nové {s.new}</span>
    </p>
  )
}

export default function ProgressView({ progress, onReset }) {
  const all = summarize(progress, questions)
  const pct = Math.round((all.known / all.total) * 100)

  function reset() {
    if (window.confirm('Naozaj vymazať všetok pokrok? Toto sa nedá vrátiť.')) onReset()
  }

  return (
    <div className="narrow centered progress-view">
      <section className="card overall" aria-labelledby="h-overall">
        <h2 id="h-overall">Celkový pokrok</h2>
        <p className="overall-big"><strong>{all.known}</strong> z {all.total} otázok viem ({pct} %)</p>
        <ProgressBar summary={all} />
        <Counts s={all} />
        <p className="muted small">Otázka je „viem“, keď ju dvakrát po sebe označíš ako známu. „Neviem“ ju vráti medzi učené.</p>
      </section>

      <section aria-labelledby="h-topics">
        <h2 id="h-topics" className="section-title">Podľa tém</h2>
        <ul className="topic-progress">
          {topics.map((t) => {
            const s = summarize(progress, byTopic[t.id])
            return (
              <li key={t.id}>
                <div className="tp-head"><h3>{t.name}</h3><span className="muted small">{s.known}/{s.total}</span></div>
                <ProgressBar summary={s} />
                <Counts s={s} />
              </li>
            )
          })}
        </ul>
      </section>

      <section className="reset" aria-labelledby="h-reset">
        <h2 id="h-reset" className="section-title">Začať odznova</h2>
        <p className="muted small">Vymaže stav všetkých otázok v tomto prehliadači.</p>
        <button type="button" className="btn btn-bad" onClick={reset} disabled={all.new === all.total}>Vymazať pokrok</button>
      </section>
    </div>
  )
}
