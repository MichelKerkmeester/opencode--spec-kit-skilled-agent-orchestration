---
title: "Sanitize Key Files in Graph Metadata - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [x] `mcp_server/lib/graph/graph-metadata-parser.ts:318-334,463-470` uses the frozen wave-3 predicate and filter placement from `../research/research.md:241-270`. Evidence: `KEY_FILE_NOISE_RE`, `BARE_FILE_RE`, and `keepKeyFile()` now filter both referenced and fallback refs before merge.
- [x] Canonical packet docs still survive the filter because `docs.map((doc) => doc.relativePath)` is appended after filtering. Evidence: `deriveKeyFiles()` appends canonical doc paths after the filtered reference lists.
- [x] Integration tests prove command tokens, version literals, MIME-like values, and bare non-canonical filenames are rejected. Evidence: `graph-metadata-schema.vitest.ts` and `graph-metadata-integration.vitest.ts` cover those rejected candidate classes.
## P1 (Should Fix)
- [ ] Verification notes use the current `1498 / 2207` corpus figure rather than the older `1489 / 2195` headline.
- [x] The phase does not introduce new path-resolution behavior or cleanup logic for already-persisted data. Evidence: the change is limited to candidate filtering inside the parser and backfill inputs remain unchanged.
- [x] The `normalizeUnique(...).slice(0, 20)` tail stays intact after the new predicate runs. Evidence: `deriveKeyFiles()` still ends with `normalizeUnique(...).slice(0, 20)`.
## P2 (Advisory)
- [ ] Corpus/backfill verification records which miss classes were removed by regex vs structural filtering.
- [ ] A follow-on note captures whether any rare non-canonical references deserve a future migration rather than a runtime predicate exception.
