import { useCallback, useState } from 'react'
import { statusOf } from '../shared/progress.js'
import { pool, shuffle, plural } from './data.js'
import { QuestionCard, StatusChip, StudyActions, TopicPicker, useStudyKeys } from './parts.jsx'

// Order: cards being learned first, then new ones, known ones last (each group shuffled).
function buildQueue(topicId, progress) {
  const groups = { learning: [], new: [], known: [] }
  for (const q of pool(topicId)) groups[statusOf(progress, q.id)].push(q)
  return [...shuffle(groups.learning), ...shuffle(groups.new), ...shuffle(groups.known)]
}

// A card you didn't know comes back after this many other cards.
const RETRY_GAP = 3

export default function Flashcards({ progress, onGrade }) {
  const [topic, setTopic] = useState('all')
  const [queue, setQueue] = useState(() => buildQueue('all', progress))
  const [revealed, setRevealed] = useState(false)
  const [tally, setTally] = useState({ knew: 0, didnt: 0 })

  const restart = (t = topic) => {
    setTopic(t)
    setQueue(buildQueue(t, progress))
    setRevealed(false)
    setTally({ knew: 0, didnt: 0 })
  }

  const current = queue[0]
  const reveal = useCallback(() => setRevealed(true), [])
  const grade = useCallback((knew) => {
    if (!current) return
    onGrade(current.id, knew)
    setTally((t) => (knew ? { ...t, knew: t.knew + 1 } : { ...t, didnt: t.didnt + 1 }))
    setQueue((q) => {
      const rest = q.slice(1)
      if (knew) return rest
      const at = Math.min(RETRY_GAP, rest.length)
      return [...rest.slice(0, at), q[0], ...rest.slice(at)]
    })
    setRevealed(false)
  }, [current, onGrade])

  useStudyKeys({ revealed, onReveal: reveal, onGrade: grade, enabled: Boolean(current) })

  return (
    <div className="study">
      <TopicPicker id="fc-topic" value={topic} onChange={restart} progress={progress} />
      <div className="study-main">
        {current ? (
          <>
            <div className="study-meta">
              <span>Zostáva {plural(queue.length, 'kartička', 'kartičky', 'kartičiek')}</span>
              <StatusChip status={statusOf(progress, current.id)} />
            </div>
            <div key={current.id + tally.knew + tally.didnt} className="fade-in">
              <QuestionCard q={current} revealed={revealed} />
            </div>
            <StudyActions revealed={revealed} onReveal={reveal} onGrade={grade} />
            <p className="keys-hint hide-mobile muted small">Klávesy: medzerník ukáže odpoveď, ← neviem, → viem.</p>
          </>
        ) : (
          <div className="card done">
            <h2>Hotovo</h2>
            <p>Všetky kartičky v tejto téme sú prejdené. Viem: {tally.knew}, neviem: {tally.didnt}.</p>
            <button type="button" className="btn btn-primary" onClick={() => restart()}>Prejsť ich znova</button>
          </div>
        )}
      </div>
    </div>
  )
}
