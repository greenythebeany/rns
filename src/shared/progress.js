// Zápočet progress in localStorage. Per question: { box, seen, last }.
//   box  0..3  Leitner box; "Viem" moves it up, "Neviem" drops it to 0
//   seen       how many times it was graded
// Status: new = never graded, known = box >= 2 (known twice in a row), else learning.
const KEY = 'rns-zapocet-progress-v1'

export function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}')
    return data && typeof data === 'object' ? data : {}
  } catch {
    return {}
  }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* storage full or blocked */ }
}

export function grade(progress, id, knew) {
  const prev = progress[id] || { box: 0, seen: 0 }
  const next = {
    ...progress,
    [id]: { box: knew ? Math.min(prev.box + 1, 3) : 0, seen: prev.seen + 1, last: Date.now() },
  }
  save(next)
  return next
}

export function resetProgress() {
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
  return {}
}

export function statusOf(progress, id) {
  const p = progress[id]
  if (!p) return 'new'
  return p.box >= 2 ? 'known' : 'learning'
}

export const STATUS_LABEL = { new: 'Nová', learning: 'Učím sa', known: 'Viem' }

export function summarize(progress, questions) {
  const s = { new: 0, learning: 0, known: 0, total: questions.length }
  for (const q of questions) s[statusOf(progress, q.id)]++
  return s
}
