import { mount } from '../shared/Layout.jsx'
import { loadProgress, summarize } from '../shared/progress.js'
import questionData from '../data/questions.json'
import lectures from '../data/prednasky.json'
import { plural as count } from '../shared/plural.js'
import './home.css'

const BASE = import.meta.env.BASE_URL

function Home() {
  const s = summarize(loadProgress(), questionData.questions)
  const latest = lectures[0]
  const pct = (n) => `${(n / s.total) * 100}%`
  return (
    <div className="home">
      <div className="intro">
        <h1>Riadenie nelineárnych systémov</h1>
        <p>Príprava na zápočet z RNS na STU FEI: otázky s odpoveďami na precvičovanie a prednášky na jednom mieste.</p>
      </div>
      <div className="entries">
        <a className="entry card" href={`${BASE}zapocet/`}>
          <h2>Zápočet</h2>
          <p className="muted">{count(s.total, 'otázka', 'otázky', 'otázok')} v {questionData.topics.length} témach. Prehľad, kartičky a cvičný test.</p>
          <div className="entry-progress">
            <div className="bar" role="img" aria-label={`Viem ${s.known} z ${s.total} otázok`}>
              <i className="known" style={{ width: pct(s.known) }} />
              <i className="learning" style={{ width: pct(s.learning) }} />
            </div>
            <p className="small">{s.known + s.learning === 0 ? 'Zatiaľ žiadny pokrok. Začni kartičkami alebo testom.' : `Viem ${s.known} z ${s.total}, učím sa ${s.learning}`}</p>
          </div>
          <span className="entry-go">Otvoriť zápočet</span>
        </a>
        <a className="entry card" href={`${BASE}prednasky/`}>
          <h2>Prednášky</h2>
          <p className="muted">
            {lectures.length === 0 ? 'Zatiaľ žiadne prednášky.' : `${count(lectures.length, 'prednáška', 'prednášky', 'prednášok')} v PDF.`}
          </p>
          {latest && (
            <div className="entry-latest">
              <p className="small muted">Najnovšia</p>
              <p className="latest-title">{latest.number}. {latest.title}</p>
            </div>
          )}
          <span className="entry-go">Otvoriť prednášky</span>
        </a>
      </div>
    </div>
  )
}

mount(Home, 'home')
