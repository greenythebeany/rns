import { useCallback, useEffect, useState } from 'react'
import { mount } from '../shared/Layout.jsx'
import { grade, loadProgress, resetProgress } from '../shared/progress.js'
import Browse from './Browse.jsx'
import Flashcards from './Flashcards.jsx'
import TestMode from './TestMode.jsx'
import ProgressView from './ProgressView.jsx'
import './zapocet.css'

// Modes live in the URL hash (#karticky) so a refresh or a shared link keeps the mode.
const MODES = [
  { id: 'prehlad', label: 'Prehľad' },
  { id: 'karticky', label: 'Kartičky' },
  { id: 'test', label: 'Test' },
  { id: 'pokrok', label: 'Pokrok' },
]

function modeFromHash() {
  const id = window.location.hash.slice(1)
  return MODES.some((m) => m.id === id) ? id : 'prehlad'
}

function Zapocet() {
  const [mode, setMode] = useState(modeFromHash)
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => {
    const onHash = () => { setMode(modeFromHash()); window.scrollTo(0, 0) }
    const onStorage = (e) => { if (e.key === null || e.key?.startsWith('rns-zapocet')) setProgress(loadProgress()) }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('storage', onStorage)
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('storage', onStorage) }
  }, [])

  const onGrade = useCallback((id, knew) => setProgress((p) => grade(p, id, knew)), [])

  return (
    <>
      <h1 className="visually-hidden">Zápočet</h1>
      <nav className="modes" aria-label="Režim">
        {MODES.map((m) => (
          <a key={m.id} href={`#${m.id}`} aria-current={mode === m.id ? 'page' : undefined}>{m.label}</a>
        ))}
      </nav>
      {mode === 'prehlad' && <Browse progress={progress} />}
      {mode === 'karticky' && <Flashcards progress={progress} onGrade={onGrade} />}
      {mode === 'test' && <TestMode onGrade={onGrade} />}
      {mode === 'pokrok' && <ProgressView progress={progress} onReset={() => setProgress(resetProgress())} />}
    </>
  )
}

mount(Zapocet, 'zapocet')
