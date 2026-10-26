# Graph Report - RNS-zapocet  (2026-10-26)

## Corpus Check
- 27 files · ~65,434 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 4, (none) 1)

## Summary
- 161 nodes · 310 edges · 12 communities (10 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `777b3a31`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- extract.py
- package.json
- ISSUES
- Layout.jsx
- Design System: RNS — Riadenie nelineárnych systémov
- prednasky.mjs
- parts.jsx
- zapocet/main.jsx
- TestMode.jsx
- scripts
- sw-template.js

## God Nodes (most connected - your core abstractions)
1. `Flashcards()` - 11 edges
2. `plural()` - 10 edges
3. `summarize()` - 10 edges
4. `react` - 9 edges
5. `Browse()` - 9 edges
6. `TestMode()` - 9 edges
7. `Zapocet()` - 9 edges
8. `scripts` - 8 edges
9. `main()` - 8 edges
10. `Rich` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Nasadenie` --references--> `main()`  [INFERRED]
  README.md → scripts/extract.py
- `Home()` --calls--> `summarize()`  [EXTRACTED]
  src/home/main.jsx → src/shared/progress.js
- `Item()` --calls--> `Rich`  [EXTRACTED]
  src/zapocet/Browse.jsx → src/shared/Rich.jsx
- `Browse()` --calls--> `fold()`  [EXTRACTED]
  src/zapocet/Browse.jsx → src/shared/fold.js
- `questions` --calls--> `fold()`  [EXTRACTED]
  src/zapocet/data.js → src/shared/fold.js

## Import Cycles
- None detected.

## Communities (12 total, 2 thin omitted)

### Community 0 - "extract.py"
Cohesion: 0.11
Nodes (12): Nasadenie, Otázky na zápočet, Pridanie prednášky, RNS, Vývoj, highlights(), main(), option_positions() (+4 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (18): dependencies, @fontsource/atkinson-hyperlegible-next, katex, react, react-dom, devDependencies, vite, @vitejs/plugin-react (+10 more)

### Community 2 - "ISSUES"
Cohesion: 0.40
Nodes (4): Answers that look doubtful (not changed), Discrepancies between the PDFs, Formatting / structure notes, ISSUES

### Community 3 - "Layout.jsx"
Cohesion: 0.16
Nodes (13): dateFmt, Prednasky(), size(), sizeFmt, fold(), Footer(), Header(), mount() (+5 more)

### Community 4 - "Design System: RNS — Riadenie nelineárnych systémov"
Cohesion: 0.22
Nodes (8): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, Dark theme ("Graphite"), Design System: RNS — Riadenie nelineárnych systémov, Light theme ("Paper")

### Community 6 - "prednasky.mjs"
Cohesion: 0.12
Nodes (11): vite, @vitejs/plugin-react, DIR, files, gitDate(), lectures, OUT, ROOT (+3 more)

### Community 7 - "parts.jsx"
Cohesion: 0.27
Nodes (13): react, statusOf(), summarize(), Browse(), Item(), byTopic, questions, topicName (+5 more)

### Community 8 - "zapocet/main.jsx"
Cohesion: 0.21
Nodes (10): Home(), plural(), grade(), loadProgress(), resetProgress(), save(), STATUS_LABEL, modeFromHash() (+2 more)

### Community 9 - "TestMode.jsx"
Cohesion: 0.31
Nodes (13): Rich, pool(), shuffle(), buildQueue(), Flashcards(), QuestionCard(), StudyActions(), TopicPicker() (+5 more)

### Community 10 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, extract, prebuild, predev, prednasky, preview

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `parts.jsx` to `zapocet/main.jsx`, `package.json`, `Layout.jsx`, `TestMode.jsx`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **Should `extract.py` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._
- **Why does `@vitejs/plugin-react` connect `prednasky.mjs` to `package.json`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `vite` connect `prednasky.mjs` to `package.json`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `prednasky.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._