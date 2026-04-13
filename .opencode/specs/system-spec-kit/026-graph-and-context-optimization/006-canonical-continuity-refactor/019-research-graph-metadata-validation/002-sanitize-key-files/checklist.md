---
title: "Sanitize Key Files in Graph Metadata - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [ ] `mcp_server/lib/graph/graph-metadata-parser.ts:318-334,463-470` uses the frozen wave-3 predicate and filter placement from `../research/research.md:241-270`.
- [ ] Canonical packet docs still survive the filter because `docs.map((doc) => doc.relativePath)` is appended after filtering.
- [ ] Integration tests prove command tokens, version literals, MIME-like values, and bare non-canonical filenames are rejected.
## P1 (Should Fix)
- [ ] Verification notes use the current `1498 / 2207` corpus figure rather than the older `1489 / 2195` headline.
- [ ] The phase does not introduce new path-resolution behavior or cleanup logic for already-persisted data.
- [ ] The `normalizeUnique(...).slice(0, 20)` tail stays intact after the new predicate runs.
## P2 (Advisory)
- [ ] Corpus/backfill verification records which miss classes were removed by regex vs structural filtering.
- [ ] A follow-on note captures whether any rare non-canonical references deserve a future migration rather than a runtime predicate exception.
