import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/atkinson-hyperlegible-next/400.css'
import '@fontsource/atkinson-hyperlegible-next/600.css'
import '@fontsource/atkinson-hyperlegible-next/700.css'
import './base.css'
import { getTheme, setTheme } from './theme.js'

const BASE = import.meta.env.BASE_URL

const NAV = [
  { id: 'zapocet', href: `${BASE}zapocet/`, label: 'Zápočet' },
  { id: 'prednasky', href: `${BASE}prednasky/`, label: 'Prednášky' },
]

function ThemeToggle() {
  const [theme, setState] = useState(getTheme)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => setState(getTheme())
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const next = theme === 'dark' ? 'light' : 'dark'
  const label = next === 'dark' ? 'Zapnúť tmavý režim' : 'Zapnúť svetlý režim'
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      title={label}
      onClick={() => { setTheme(next); setState(next) }}
    >
      {theme === 'dark' ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      )}
    </button>
  )
}

function Header({ active }) {
  return (
    <header className="site-header">
      <a className="logo" href={BASE} aria-current={active === 'home' ? 'page' : undefined}>RNS</a>
      <nav className="site-nav" aria-label="Hlavná navigácia">
        {NAV.map((n) => (
          <a key={n.id} href={n.href} aria-current={active === n.id ? 'page' : undefined}>{n.label}</a>
        ))}
      </nav>
      <ThemeToggle />
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>Riadenie nelineárnych systémov, STU FEI. Pokrok sa ukladá iba v tomto prehliadači.</p>
    </footer>
  )
}

/** Renders a page with the shared header and footer, and registers the service worker. */
export function mount(Page, active) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <a className="skip-link" href="#main">Preskočiť na obsah</a>
      <Header active={active} />
      <main id="main" className="page" tabIndex={-1}>
        <Page />
      </main>
      <Footer />
    </StrictMode>,
  )

  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${BASE}sw.js`, { scope: BASE }).catch(() => {})
    })
  }
}
