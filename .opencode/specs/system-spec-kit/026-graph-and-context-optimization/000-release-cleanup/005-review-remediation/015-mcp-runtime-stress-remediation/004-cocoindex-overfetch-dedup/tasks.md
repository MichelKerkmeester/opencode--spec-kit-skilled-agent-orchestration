---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: CocoIndex over-fetch + dedup + rerank [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/tasks]"
description: "Per-REQ work units for CocoIndex mirror exclusion, canonical identity, dedup, and path-class rerank."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "cocoindex dedup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup"
    last_updated_at: "2026-04-27T09:38:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed work units"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: ["tasks.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Tasks: CocoIndex over-fetch + dedup + rerank

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Author spec.md / plan.md / tasks.md
- [ ] T002 [P] Author implementation-summary.md placeholder
- [ ] T003 [P] Generate description.json + graph-metadata.json
- [ ] T004 Locate CocoIndex source-of-truth (`python -c "import cocoindex_code; print(cocoindex_code.__file__)"`)
- [ ] T005 Pass `validate.sh --strict`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T101 Settings: edit `.cocoindex_code/settings.yml` to add exclude patterns for `.gemini/specs/**`, `.codex/specs/**`, `.claude/specs/**`, `.agents/specs/**`
- [ ] T102 Indexer: add `source_realpath` field via `os.path.realpath()` in chunk write path
- [ ] T103 Indexer: add `content_hash` field via `sha256(normalize(chunk.content))`
- [ ] T104 Add `classify_path(file_path) -> path_class` function with rules:
  - `**/test/**`, `**/tests/**`, `*_test.py`, `*.test.ts`, `*.vitest.ts` → `tests`
  - `**/specs/**/research/**` → `spec_research`
  - `*.md` (top-level docs), `**/docs/**`, `README*` → `docs`
  - `**/dist/**`, `**/build/**`, `**/.next/**` → `generated`
  - `**/node_modules/**`, `**/vendor/**` → `vendor`
  - default → `implementation`
- [ ] T105 Indexer: persist path_class column
- [ ] T106 Query: in `cocoindex_code/query.py`, change `fetch_nearest_neighbors(limit)` to `fetch_nearest_neighbors(limit * 4)`
- [ ] T107 Query: implement dedup grouping by `(source_realpath, start_line, end_line)` with fallback to `(content_hash, start_line, end_line)`
- [ ] T108 Query: implement `prefer_canonical_path(group)` choosing the non-mirror path (e.g., paths under `.opencode/specs` over `.claude/specs`)
- [ ] T109 Query: implement `rerank_by_path_class(rows, query_text)` with implementation-intent detection (keywords: implementation, function, handler, callers, query, search, etc.) applying +0.05 for implementation and -0.05 for spec_research/docs
- [ ] T110 Query: surface `dedupedAliases`, `uniqueResultCount`, `rankingSignals` in result envelope
- [ ] T111 project.py + server.py: pass-through new fields
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T201 Reindex: run `ccc reindex` (or whatever the local command is)
- [ ] T202 Run pytest if available
- [ ] T203 Manual probe: `ccc search "semantic search vector embedding implementation" --limit 10` → verify ≤ 1 unique chunk per logical location (was 10 dups before)
- [ ] T204 Manual probe: `ccc search "code graph traversal callers query" --limit 10` → verify implementation source in top 3 (was #10 before)
- [ ] T205 Verify `dedupedAliases` and `uniqueResultCount` populated in response
- [ ] T206 Verify `rankingSignals` populated for reranked rows
- [ ] T207 Update implementation-summary.md
- [ ] T208 Mark all REQ-001..006 PASSED
- [ ] T209 `validate.sh --strict` PASS
- [ ] T210 Commit + push: `fix(cocoindex): over-fetch+dedup+rerank with path_class per 007/Q2-Q3 + 005/REQ-018-019`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks `[x]`
- [ ] REQs 1-6 PASSED
- [ ] Probe outputs recorded in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: spec.md
- **Plan**: plan.md
- **Sources**: ../005-memory-search-runtime-bugs (REQ-018, REQ-019), ../002-mcp-runtime-improvement-research (Q2, Q3)
<!-- /ANCHOR:cross-refs -->
