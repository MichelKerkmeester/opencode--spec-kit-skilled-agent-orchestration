---
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: 001 Code-Graph Consistency Remediation [template:level_2/plan.md]"
description: "Apply 9 surgical product-code/YAML edits and add tests for findings F-002-A2-01..03, F-014-C4-01..04, F-004-A4-02..03."
trigger_phrases:
  - "F-002-A2 plan"
  - "F-014-C4 plan"
  - "F-004-A4 plan"
  - "001 code graph consistency plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/001-code-graph-consistency"
    last_updated_at: "2026-05-01T09:05:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Plan authored after spec"
    next_safe_action: "Apply 9 surgical edits + 6 new tests, then validate strict, then commit + push"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts"
      - ".opencode/command/doctor/assets/doctor_code-graph_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-001-code-graph-consistency"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 001 Code-Graph Consistency Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Nine surgical edits across the code-graph indexing helper (`ensure-ready.ts`), the SQLite layer (`code-graph-db.ts`), the query handler (`query.ts`), the context resolver (`code-graph-context.ts`), and the doctor diagnostic YAML close findings F-002-A2-01..03, F-014-C4-01..04, and F-004-A4-02..03. Each fix tightens consistency or surfaces silent-error state without changing the public API of the touched modules.

### Technical Context

The product code lives under `mcp_server/code_graph/{lib,handlers}/` and a single YAML lives under `.opencode/command/doctor/assets/`. All TS edits stay within existing files. New vitest cases live under `mcp_server/code_graph/tests/` (alongside the existing `code-graph-*.vitest.ts` suite). No new packages are required; better-sqlite3 already supports `pragma()` and `transaction()`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold |
|------|-----------|
| validate.sh --strict (this packet) | errors=0 (warnings parity with sibling 004 acceptable) |
| New vitest tests | all pass |
| `npm run stress` | exit 0 / >=58 files / >=195 tests |
| Inline finding markers | one `// F-NNN-XX-NN:` (TS), `# F-NNN-XX-NN:` (YAML/shell), or `<!-- F-NNN-XX-NN -->` (md) marker per finding |
| Per-file write transaction wall time | <50ms per file in steady state (informally checked, not gated) |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The fixes preserve the existing module boundaries:

- **Indexing helper (`ensure-ready.ts`)** — `persistIndexedFileResult` wraps three storage operations in `getDb().transaction(() => ...)` so the stage / nodes / edges / finalize sequence is atomic per file. `detectState()` adds a `gitDiffTouchesIndex()` filter so HEAD drift on non-graph paths does not escalate to full-scan; a new `loadCandidateManifest()`/`recordCandidateManifest()` pair tracks the indexable file count + digest and triggers full-scan on divergence.
- **SQLite layer (`code-graph-db.ts`)** — `initDb()` runs `PRAGMA busy_timeout = 5000` immediately after open so concurrent writers wait instead of throwing `SQLITE_BUSY`. `isFileStale()` and `ensureFreshFiles()` short-circuit on touch-only changes by hashing before declaring stale. The three metadata getters (`getLastDetectorProvenanceSummary`, `getLastGraphEdgeEnrichmentSummary`, `getLastGoldVerification`) gain `*WithDiagnostics()` companions returning `null | { value } | { corrupt: true; raw: string }`; the existing `null`-on-error API is preserved for callers that don't care.
- **Query handler (`query.ts`)** — Multi-SELECT operations wrap their reads in a short `db.transaction(() => ...)` so outline + edges-from + edges-to all see a stable snapshot. `ensureCodeGraphReady` runs OUTSIDE the transaction (it can mutate); only the read path is transactional.
- **Context resolver (`code-graph-context.ts`)** — `resolveSubjectToRef` returns a discriminated `{ kind: 'resolved'; ref } | { kind: 'unavailable'; reason } | { kind: 'unresolved' }`. Internal callers in `code-graph-context.ts` adapt to the typed shape.
- **Doctor YAML** — Phase 1 Analysis no longer calls `detect_changes({})`. The fallback path already implemented at line 103 (`derive stale set from git status --porcelain + index timestamps`) becomes the primary path; `detect_changes` is removed from the diagnostic workflow because its contract is diff-driven (input: unified diff; output: affected symbols), not index-health-driven.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| # | Phase | Action | File | Finding | Status |
|---|-------|--------|------|---------|--------|
| 1 | Edit | PRAGMA busy_timeout at initDb | code-graph-db.ts | F-002-A2-02 | Pending |
| 2 | Edit | Wrap persistIndexedFileResult in db.transaction | ensure-ready.ts | F-002-A2-01 | Pending |
| 3 | Edit | Hash on mtime drift before declaring stale | code-graph-db.ts | F-014-C4-01 | Pending |
| 4 | Edit | Filter HEAD diffs through index scope | ensure-ready.ts | F-014-C4-02 | Pending |
| 5 | Edit | Persist + compare candidate manifest | ensure-ready.ts | F-014-C4-03 | Pending |
| 6 | Edit | Redefine doctor Phase 1 around existing outputs | doctor_code-graph_auto.yaml | F-014-C4-04 | Pending |
| 7 | Edit | Snapshot-stable read transaction in query | query.ts | F-002-A2-03 | Pending |
| 8 | Edit | Typed resolveSubjectToRef return | code-graph-context.ts | F-004-A4-02 | Pending |
| 9 | Edit | Distinguish absent / corrupt / invalid metadata reads | code-graph-db.ts | F-004-A4-03 | Pending |
| 10 | Test | Add 6 vitest files | mcp_server/code_graph/tests/ | All TS | Pending |
| 11 | Validate | validate.sh --strict on this packet | this packet | — | Pending |
| 12 | Stress | npm run stress | mcp_server/ | — | Pending |
| 13 | Refresh | generate-context.js for this packet | spec docs | — | Pending |
| 14 | Ship | commit + push to origin main | repo | — | Pending |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (vitest) | atomic-persistence, busy retry, mtime-vs-hash, candidate manifest, metadata-shape, typed resolution | vitest + better-sqlite3 in-memory or temp-file DB |
| Stress | Full `npm run stress` end-to-end | vitest stress config |

For each TS change: extend or add a vitest under `mcp_server/code_graph/tests/`. Use existing fixture patterns from `code-graph-scan.vitest.ts` (mocking via `vi.hoisted`) and `code-graph-context-handler.vitest.ts` (in-memory DB). Open a fresh better-sqlite3 in `:memory:` or a `mkdtemp` tempfile per test, run the full schema, and exercise the new behavior.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §2 (consistency), §14 (resilience), §4 (silent-error)
- Validate script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Stress runner: `cd mcp_server && npm run stress`
- Worked-pilot: sibling sub-phase `004-validation-and-memory/` (commit `1822a1e69`)
- No cross-packet dependencies; sub-phase 001 is independent within the 049 series.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If any change breaks the stress baseline:
1. `git revert <commit-sha>` reverts all 9 fixes atomically.
2. Re-run validate + stress to confirm 048 baseline restored.
3. Identify the failing finding from inline `<!-- F-NNN-XX-NN -->` / `// F-NNN-XX-NN:` / `# F-NNN-XX-NN:` markers (each fix carries its ID).
4. Reauthor the failing edit with smaller scope; re-validate.

Each edit carries a finding marker so a partial-revert (single hunk) is straightforward. The atomic-persistence transaction is the highest-risk change: a partial revert of just F-002-A2-01 leaves the other 8 fixes in place.
<!-- /ANCHOR:rollback -->
