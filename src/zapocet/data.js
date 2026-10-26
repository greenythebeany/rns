import data from '../data/questions.json'
import { fold } from '../shared/fold.js'

export const topics = data.topics
export const questions = data.questions.map((q) => ({
  ...q,
  folded: fold(`${q.topic} ${q.searchText}`),
}))
export const byTopic = Object.fromEntries(topics.map((t) => [t.id, questions.filter((q) => q.topicId === t.id)]))
export const topicName = Object.fromEntries(topics.map((t) => [t.id, t.name]))

export function pool(topicId) {
  return topicId === 'all' ? questions : byTopic[topicId] || []
}

export function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export { plural } from '../shared/plural.js'
