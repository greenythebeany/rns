/** Lowercase, strip diacritics: "Učenie" -> "ucenie". */
export function fold(s) {
  return s.normalize('NFD').replace(/\p{M}+/gu, '').toLowerCase()
}
