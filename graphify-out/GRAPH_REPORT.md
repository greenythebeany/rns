# Graph Report - RNS-zapocet  (2026-10-26)

## Corpus Check
- 4 files · ~26,914 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 23 nodes · 27 edges · 5 communities (2 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- main
- ISSUES
- parse
- plain

## God Nodes (most connected - your core abstractions)
1. `main()` - 7 edges
2. `ISSUES` - 4 edges
3. `plain()` - 3 edges
4. `parse()` - 3 edges
5. `option_positions()` - 3 edges
6. `to_md()` - 2 edges
7. `slug()` - 2 edges
8. `highlights()` - 2 edges
9. `Extract zápočet questions from the RNS PDFs into src/data/questions.json.…` - 1 edges
10. `Searchable plain text (no $, no markdown).` - 1 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `plain()`  [EXTRACTED]
  scripts/extract.py → scripts/extract.py  _Bridges community 4 → community 1_
- `main()` --calls--> `parse()`  [EXTRACTED]
  scripts/extract.py → scripts/extract.py  _Bridges community 3 → community 1_

## Import Cycles
- None detected.

## Communities (5 total, 3 thin omitted)

### Community 1 - "main"
Cohesion: 0.33
Nodes (5): highlights(), main(), option_positions(), slug(), to_md()

### Community 2 - "ISSUES"
Cohesion: 0.40
Nodes (4): Answers that look doubtful (not changed), Discrepancies between the PDFs, Formatting / structure notes, ISSUES

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `main()` connect `main` to `extract.py`, `parse`, `plain`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `plain()` connect `plain` to `extract.py`, `main`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `parse()` connect `parse` to `extract.py`, `main`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._