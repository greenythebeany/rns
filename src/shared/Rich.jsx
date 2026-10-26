import { memo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const cache = new Map()

function escape(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

// The extracted data uses a tiny Markdown subset: $inline math$ and **bold**.
// " ?" at the end (as written in the PDF) gets a non-breaking space so "?" never wraps alone.
export function toHtml(src) {
  if (cache.has(src)) return cache.get(src)
  const html = src
    .replace(/ \?$/, ' ?')
    .split(/(\$[^$]+\$)/)
    .map((part) => {
      if (part.length > 2 && part.startsWith('$') && part.endsWith('$')) {
        return katex.renderToString(part.slice(1, -1), { throwOnError: false, output: 'htmlAndMathml' })
      }
      return escape(part).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    })
    .join('')
  cache.set(src, html)
  return html
}

export const Rich = memo(function Rich({ text, as: Tag = 'span', ...rest }) {
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: toHtml(text) }} />
})
