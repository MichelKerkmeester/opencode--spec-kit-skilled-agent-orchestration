---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: CocoIndex over-fetch + canonical-identity dedup + path-class rerank [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec]"
description: "Remediation packet for 005/REQ-018 (mirror duplicates) + 005/REQ-019 (markdown outranks source). Excludes runtime spec mirrors from index, adds canonical identity (source_realpath + content_hash), over-fetches limit*4 candidates, dedups by canonical key, and reranks by path_class so implementation source surfaces above research markdown for code-intent queries."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
trigger_phrases:
  - "004-cocoindex-overfetch-dedup"
  - "cocoindex mirror duplicate dedup"
  - "cocoindex source_realpath canonical identity"
  - "cocoindex path_class rerank"
  - "cocoindex over-fetch limit times 4"
  - "REQ-018 REQ-019 cocoindex"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup"
    last_updated_at: "2026-04-27T09:38:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet from 007 §5 Q2/Q3 + §11 Rec #2"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 10
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: CocoIndex over-fetch + canonical-identity dedup + path-class rerank

<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: 003-memory-context-truncation-contract; SUCCESSOR: 005-code-graph-fast-fail -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Sources** | 005/REQ-018 (mirror dups), 005/REQ-019 (md vs source rank), 007/Q2 + Q3, 007/§11 Rec #2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
005/REQ-018 documented that CocoIndex returned the SAME research-06 markdown chunk 10 times under different mirror paths (`.gemini/specs/`, `.agents/specs/`, `.claude/specs/`, `.codex/specs/`, `specs/`, `.opencode/specs/`) — all with identical scores. Effective unique-result rate: 10%. 005/REQ-019 documented that for code-intent queries, markdown research notes outranked actual implementation source code (e.g., `mcp_server/handlers/code-graph/query.ts` ranked #10 behind 9 markdown duplicates). 007/Q2-Q3 isolated three independent root causes: (a) mirror folders are symlinks to `.opencode/specs` but the indexer stores the alias path as `file_path`, (b) query path returns raw nearest-neighbor rows with no dedup, (c) ranking is pure vector distance with no path-class awareness.

### Purpose
Make CocoIndex code-first by default. Exclude runtime spec mirrors at index time. Add `source_realpath` and `content_hash` canonical identity fields. Over-fetch `limit * 4` candidates, dedup by `(source_realpath, line_range)` or `(content_hash, line_range)`, prefer canonical paths in returned rows. Add `path_class` source-role and bounded reranking that surfaces `implementation` above `spec_research` for implementation-intent queries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `.cocoindex_code/settings.yml` to exclude runtime spec mirrors (`.gemini/specs`, `.codex/specs`, `.claude/specs`, `.agents/specs` — keep `.opencode/specs` only).
- Add `source_realpath` (resolved real path) and `content_hash` (sha256 of normalized chunk content) to indexer schema.
- Update query path to: (1) fetch `limit * 4` nearest neighbors, (2) group by `(source_realpath || content_hash, start_line, end_line)`, (3) prefer canonical display path within group, (4) rerank by `path_class` for implementation-intent queries, (5) return top `limit` unique results.
- Add `path_class` field with values: `implementation` | `tests` | `docs` | `spec_research` | `generated` | `vendor`.
- Surface `dedupedAliases`, `uniqueResultCount`, `rankingSignals` in query telemetry.

### Out of Scope
- Rewriting CocoIndex's core vector backend.
- Re-indexing strategy / migration scripts (separate operational task).
- Memory / code-graph / causal-graph (separate packets).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.cocoindex_code/settings.yml` | Modify | Exclude runtime spec mirrors |
| `cocoindex_code/indexer.py` | Modify | Add source_realpath + content_hash + path_class fields (~lines 180-189 per research) |
| `cocoindex_code/query.py` | Modify | Add over-fetch + dedup + rerank logic (~lines 115-145) |
| `cocoindex_code/project.py` | Modify | Pass through new fields (~lines 174-203) |
| `cocoindex_code/server.py` | Modify | Expose new telemetry fields (~lines 139-155) |
| `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md` | Create | Packet docs |
| `description.json` / `graph-metadata.json` | Create | Spec metadata |

NOTE: Per 007 §6 Runtime Limitations + §12 Open Questions, `cocoindex_code/*.py` may live in the installed package rather than a tracked repo path. Implementation MUST locate the actual source-of-truth before patching; if it's an installed package, vendor the relevant files into the repo OR fork the package locally per project conventions.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 — Mirror Dedup + Source Canonical Identity

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CocoIndex MUST NOT index runtime spec mirrors (`.gemini/specs`, `.codex/specs`, `.claude/specs`, `.agents/specs`). | After fix, `.cocoindex_code/settings.yml` excludes those paths and a reindex shows `path_aliases` count drops to ~0 for spec content. |
| REQ-002 | Indexer MUST store `source_realpath` (resolved real path) and `content_hash` (sha256 of normalized chunk content) per chunk. | After fix, sqlite query against the index shows non-null values for these fields on new chunks. |
| REQ-003 | Query path MUST over-fetch `limit * 4` nearest neighbors and dedup by `(source_realpath, start_line, end_line)` falling back to `(content_hash, start_line, end_line)`. | After fix, the 005/REQ-018 repro ("semantic search vector embedding implementation") returns ≤ 1 unique chunk per `(realpath, line_range)` group. `uniqueResultCount` field is populated. |
| REQ-004 | Indexer MUST classify each chunk's `path_class` per the 007 §5 vocabulary. | After fix, query results carry `path_class` field. Default is `implementation` when none of the other patterns match. |

### P1 — Path-Class Reranking

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | For implementation-intent queries (containing keywords like "implementation", "function", "handler", "callers"), the rerank MUST apply a bounded boost (+0.05) for `implementation` and a bounded penalty (-0.05) for `spec_research` / `docs`. | After fix, the 005/REQ-019 repro ("code graph traversal callers query") returns the actual `mcp_server/handlers/code_graph/handlers/query.ts` (or equivalent) in the top 3, not behind 9 markdown duplicates. |
| REQ-006 | Query response MUST expose `rankingSignals` listing applied boosts/penalties per result. | After fix, response includes `rankingSignals: ["implementation_boost", "spec_research_penalty"]` (or similar) per relevant row. |

### Acceptance Scenarios

**Given** a search for "semantic search vector embedding implementation", **when** the query runs, **then** the same chunk appears at most once per logical location (no mirror duplicates) and the actual implementation source surfaces in top 3.

**Given** a search for "code graph traversal callers query", **when** the query runs, **then** `mcp_server/handlers/code_graph/handlers/query.ts` (or equivalent implementation file) ranks above pure-markdown research notes.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 REQs covered by tests (Python pytest if available, or manual `ccc search` probe runs).
- **SC-002**: 005 Probe REQ-018 re-run after reindex shows ≤ 1 unique chunk per logical location.
- **SC-003**: 005 Probe REQ-019 re-run shows implementation source in top 3.
- **SC-004**: `validate.sh --strict` PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Schema migration may require full reindex. | High | Document reindex command; consider dual-read during transition. |
| Risk | path_class classifier could be wrong on edge cases. | Medium | Conservative default to `implementation`; add tests for known patterns. |
| Risk | CocoIndex source may be in an installed package, not in the repo. | High | Locate source-of-truth FIRST per 007 §12 open question. If installed, vendor or fork. |
| Dependency | Reindex requires CocoIndex daemon running. | Medium | Document daemon health check before reindex. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where is CocoIndex's source-of-truth — installed package or repo? Implementation MUST resolve this first.
- Should the boost/penalty values be tunable via env or settings? Default: hardcoded constants for v1, tunable in v2.
<!-- /ANCHOR:questions -->
