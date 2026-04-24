---
title: "...-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files/checklist]"
description: 'title: "Sanitize Key Files in Graph Metadata - Checklist"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "checklist"
  - "002"
  - "sanitize"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
status: complete
---
# Verification Checklist
## P0 (Blocking)
- [x] `mcp_server/lib/graph/graph-metadata-parser.ts:318-334,463-470` uses the frozen wave-3 predicate and filter placement from `../research/research.md:241-270`. Evidence: `KEY_FILE_NOISE_RE`, `BARE_FILE_RE`, and `keepKeyFile()` now filter both referenced and fallback refs before merge.
- [x] Canonical packet docs still survive the filter because `docs.map((doc) => doc.relativePath)` is appended after filtering. Evidence: `deriveKeyFiles()` appends canonical doc paths after the filtered reference lists.
- [x] Integration tests prove command tokens, version literals, MIME-like values, and bare non-canonical filenames are rejected. Evidence: `graph-metadata-schema.vitest.ts` and `graph-metadata-integration.vitest.ts` cover those rejected candidate classes.
## P1 (Should Fix)
- [x] Verification notes now use the final post-remediation corpus result instead of the older intermediate headline. Evidence: the final backfill completed on `541` spec folders and the follow-up key-file scan returned `command-shaped key_files = 0`.
- [x] The phase does not introduce new path-resolution behavior or cleanup logic for already-persisted data. Evidence: the change is limited to candidate filtering inside the parser and backfill inputs remain unchanged.
- [x] The `normalizeUnique(...).slice(0, 20)` tail stays intact after the new predicate runs. Evidence: `deriveKeyFiles()` still ends with `normalizeUnique(...).slice(0, 20)`.
## P2 (Advisory)
- [x] Corpus/backfill verification records the remaining miss-class outcome. Evidence: the final key-file scan returned `0` command-shaped entries after the added backtick, pipe-chain, flag-heavy, shell-start, and shell-operator guards landed.
- [x] No predicate exceptions were needed for rare non-canonical references in this pass. Evidence: the post-backfill scan reached `0` command-shaped key-file outliers without adding runtime allowlist exceptions.
