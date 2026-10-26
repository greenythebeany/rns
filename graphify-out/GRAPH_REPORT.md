# Graph Report - RNS-zapocet  (2026-10-26)

## Corpus Check
- 6 files · ~60,710 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 1 file(s) not represented in the graph (top: (none) 1)

## Summary
- 33 nodes · 35 edges · 6 communities (3 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c4f84d96`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main
- ISSUES
- parse
- Design System: RNS — Riadenie nelineárnych systémov

## God Nodes (most connected - your core abstractions)
1. `main()` - 7 edges
2. `Design System: RNS — Riadenie nelineárnych systémov` - 6 edges
3. `ISSUES` - 4 edges
4. `plain()` - 3 edges
5. `parse()` - 3 edges
6. `option_positions()` - 3 edges
7. `2. Color Palette & Roles` - 3 edges
8. `to_md()` - 2 edges
9. `slug()` - 2 edges
10. `highlights()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `parse()`  [EXTRACTED]
  scripts/extract.py → scripts/extract.py  _Bridges community 3 → community 1_

## Import Cycles
- None detected.

## Communities (6 total, 3 thin omitted)

### Community 1 - "main"
Cohesion: 0.25
Nodes (6): highlights(), main(), option_positions(), plain(), slug(), to_md()

### Community 2 - "ISSUES"
Cohesion: 0.40
Nodes (4): Answers that look doubtful (not changed), Discrepancies between the PDFs, Formatting / structure notes, ISSUES

### Community 4 - "Design System: RNS — Riadenie nelineárnych systémov"
Cohesion: 0.22
Nodes (8): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, Dark theme ("Graphite"), Design System: RNS — Riadenie nelineárnych systémov, Light theme ("Paper")

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `main()` connect `main` to `extract.py`, `parse`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `plain()` connect `main` to `extract.py`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._