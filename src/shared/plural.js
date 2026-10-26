/** Slovak plural: plural(3, 'otázka', 'otázky', 'otázok') -> "3 otázky" */
export function plural(n, one, few, many) {
  return `${n} ${n === 1 ? one : n >= 2 && n <= 4 ? few : many}`
}
