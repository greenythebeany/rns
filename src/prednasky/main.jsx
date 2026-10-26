import { useDeferredValue, useMemo, useState } from 'react'
import { mount } from '../shared/Layout.jsx'
import { fold } from '../shared/fold.js'
import lectures from '../data/prednasky.json'
import './prednasky.css'

const BASE = import.meta.env.BASE_URL
const sizeFmt = new Intl.NumberFormat('sk-SK', { maximumFractionDigits: 1 })
const dateFmt = new Intl.DateTimeFormat('sk-SK', { day: 'numeric', month: 'numeric', year: 'numeric' })

function size(bytes) {
  return bytes >= 1e6 ? `${sizeFmt.format(bytes / 1e6)} MB` : `${Math.max(1, Math.round(bytes / 1e3))} kB`
}

function Prednasky() {
  const [query, setQuery] = useState('')
  const q = fold(useDeferredValue(query).trim())
  const shown = useMemo(() => lectures.filter((l) => fold(`${l.number} ${l.title}`).includes(q)), [q])

  return (
    <div className="narrow lectures">
      <h1>Prednášky</h1>
      {lectures.length === 0 ? (
        <p className="empty">Zatiaľ tu nie sú žiadne prednášky. Pribudnú postupne počas semestra.</p>
      ) : (
        <>
          <label className="visually-hidden" htmlFor="lsearch">Hľadať prednášku</label>
          <input
            id="lsearch" className="field" type="search" placeholder="Hľadať podľa názvu"
            value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off"
          />
          <p className="muted small" aria-live="polite">
            {q ? `Nájdené: ${shown.length} z ${lectures.length}` : `${lectures.length} ${lectures.length === 1 ? 'prednáška' : lectures.length < 5 ? 'prednášky' : 'prednášok'}, najnovšia hore`}
          </p>
          {shown.length === 0 ? (
            <p className="empty">Žiadna prednáška nezodpovedá „{query}“.</p>
          ) : (
            <ul className="lecture-list">
              {shown.map((l) => {
                const href = `${BASE}prednasky/${encodeURIComponent(l.file)}`
                return (
                  <li key={l.file} className="card lecture">
                    <span className="num" aria-hidden="true">{l.number}</span>
                    <div className="info">
                      <h2><span className="visually-hidden">Prednáška {l.number}: </span>{l.title}</h2>
                      <p className="muted small">PDF, {size(l.size)}, pridané {dateFmt.format(new Date(l.date))}</p>
                    </div>
                    <div className="actions">
                      <a className="btn btn-primary" href={href} target="_blank" rel="noopener">
                        Otvoriť<span className="visually-hidden"> {l.title} (nová karta)</span>
                      </a>
                      <a className="btn" href={href} download={l.file}>
                        Stiahnuť<span className="visually-hidden"> {l.title}</span>
                      </a>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

mount(Prednasky, 'prednasky')
