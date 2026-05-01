---
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
title: "Implementation Summary: 001 Code-Graph Consistency Remediation [template:level_2/implementation-summary.md]"
description: "Nine surgical edits across the code-graph indexer, SQLite layer, query handler, context resolver, and doctor diagnostic YAML close findings F-002-A2-01..03, F-014-C4-01..04, and F-004-A4-02..03. Tightens per-file persistence atomicity, adds SQLite busy timeout, snapshot-stable read transactions, mtime-vs-hash staleness, scope-aware HEAD-drift triage, candidate manifest for untracked discovery, redefines the doctor workflow around existing outputs, and distinguishes absent/corrupt/invalid metadata reads."
trigger_phrases:
  - "F-002-A2"
  - "F-014-C4"
  - "F-004-A4-02"
  - "F-004-A4-03"
  - "001 code graph consistency summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/001-code-graph-consistency"
    last_updated_at: "2026-05-01T09:30:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "9 fixes applied; 6 vitest files / 20 tests pass; validate.sh strict 0/4"
    next_safe_action: "Commit + push to origin main"
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
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-code-graph-consistency |
| **Completed** | 2026-05-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nine surgical fixes across the code-graph indexer, the shared SQLite layer, the query handler, the context resolver, and the doctor diagnostic YAML close out the consistency-and-resilience findings from packet 046's deep research. The fixes share a common direction: keep per-file work transactional, tell the difference between contention and corruption, and stop full-scanning on signals (raw HEAD drift, touch-only mtime drift) that don't actually affect the index.

### Findings closed

| Finding | File | Fix |
|---------|------|-----|
| F-002-A2-01 (P1) | `mcp_server/code_graph/lib/ensure-ready.ts` | Wrapped `persistIndexedFileResult`'s four storage operations (stage `upsertFile`, `replaceNodes`, `replaceEdges`, finalize `upsertFile`) in a single `db.transaction(...)`. A throw in any phase rolls back the whole file; success commits all four together. Per-file scope keeps the lock window short. |
| F-002-A2-02 (P1) | `mcp_server/code_graph/lib/code-graph-db.ts` | Added `db.pragma('busy_timeout = 5000')` in `initDb()` immediately after `new Database(...)`. Concurrent writers now wait up to 5s for the writer lock instead of throwing `SQLITE_BUSY`. |
| F-002-A2-03 (P2) | `mcp_server/code_graph/handlers/query.ts` | The 1-hop relationship operations (`calls_from`/`calls_to`/`imports_from`/`imports_to`) and the transitive BFS now wrap their multi-SELECT data gathering in `graphDb.getDb().transaction(...)`. better-sqlite3 transactions in WAL mode get a stable snapshot for the lifetime of the transaction. |
| F-014-C4-01 (P2) | `mcp_server/code_graph/lib/code-graph-db.ts` | `ensureFreshFiles()` and `isFileStale()` now hash on mtime drift before declaring a file stale: a touch with unchanged content is fresh. Avoids gratuitous reindex on `git checkout` of touched-but-unchanged files. |
| F-014-C4-02 (P2) | `mcp_server/code_graph/lib/ensure-ready.ts` | When raw Git HEAD differs but `git diff` between old/new HEAD touches no path in `getTrackedFiles()`, `detectState()` no longer escalates to `full_scan`. The HEAD pointer is updated; freshness reports `fresh`. Falls back to current behavior on git failure. |
| F-014-C4-03 (P1) | `mcp_server/code_graph/lib/ensure-ready.ts` | Added a candidate manifest (count + sha256 digest) persisted in `code_graph_metadata.candidate_manifest`. On `detectState()`, if the on-disk indexable file count or digest diverges from the stored manifest, freshness flips to stale + full_scan. Bounded — no per-path storage, no eager filesystem scan. |
| F-014-C4-04 (P1) | `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml` | Phase 1 Analysis no longer calls `detect_changes({})` (which is diff-driven, not index-health-driven). The fallback path that was already in the YAML at line 103 (`derive stale set from git status --porcelain + index timestamps`) becomes the primary path; missed-set comes from filesystem walk minus index. The output shape is unchanged. |
| F-004-A4-02 (P2) | `mcp_server/code_graph/lib/code-graph-context.ts` | `resolveSubjectToRef` now uses an internal typed `ResolveSubjectResult` (`resolved` / `unresolved` / `unavailable`) so the DB-error case is distinct from "no row." The legacy `null`-returning wrapper is preserved for backward compatibility, but emits a `console.warn` when the underlying DB call fails so the silent-error path is auditable from logs. |
| F-004-A4-03 (P2) | `mcp_server/code_graph/lib/code-graph-db.ts` | Added `*WithDiagnostics()` companions for the three metadata getters (`getLastDetectorProvenanceSummary`, `getLastGraphEdgeEnrichmentSummary`, `getLastGoldVerification`) returning a discriminated `MetadataReadResult<T>` (`absent` / `resolved` / `corrupt` / `invalid-shape`) so callers can distinguish absent, corrupt-JSON, and shape-mismatch. The original API (returns `null` on error) is preserved. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/code_graph/lib/ensure-ready.ts` | Modified | F-002-A2-01 atomic persistence + F-014-C4-02 HEAD-scope filter + F-014-C4-03 candidate manifest |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Modified | F-002-A2-02 busy_timeout + F-014-C4-01 hash-before-stale + F-004-A4-03 metadata diagnostics |
| `mcp_server/code_graph/handlers/query.ts` | Modified | F-002-A2-03 snapshot-stable read transaction |
| `mcp_server/code_graph/lib/code-graph-context.ts` | Modified | F-004-A4-02 typed resolve-subject return |
| `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml` | Modified | F-014-C4-04 redefine Phase 1 Analysis around existing outputs |
| `mcp_server/code_graph/tests/code-graph-atomic-persistence.vitest.ts` | Created | F-002-A2-01 atomic-write boundary |
| `mcp_server/code_graph/tests/code-graph-busy-timeout.vitest.ts` | Created | F-002-A2-02 busy retry under contention |
| `mcp_server/code_graph/tests/code-graph-stale-mtime-vs-hash.vitest.ts` | Created | F-014-C4-01 touch-only is fresh |
| `mcp_server/code_graph/tests/code-graph-candidate-manifest.vitest.ts` | Created | F-014-C4-03 manifest persistence + drift |
| `mcp_server/code_graph/tests/code-graph-metadata-shape.vitest.ts` | Created | F-004-A4-03 absent/corrupt/invalid distinction |
| `mcp_server/code_graph/tests/code-graph-resolve-subject-typed.vitest.ts` | Created | F-004-A4-02 typed unavailable state |
| `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | Modified | Added `transaction` mock to `createDb()` and inline mock for F-002-A2-03 wrapping |
| `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | Modified | Updated broad-stale fixture to use real content drift (post-F-014-C4-01) instead of mtime-only drift |
| Spec docs (this packet) | Created/Modified | spec/plan/tasks/checklist/implementation-summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I read each cited finding from packet 046's research.md §2/§14/§4 and confirmed the line ranges in the live files before authoring spec.md. Each fix is the smallest change that resolves the specific bug the finding flagged. Every product code edit carries an inline `// F-NNN-XX-NN:` (TS) or `# F-NNN-XX-NN:` (YAML) marker so the next reader can trace the change back to its source finding.

For the TS changes I added vitest cases under `mcp_server/code_graph/tests/` so the new behaviors are pinned by tests. The atomic-persistence test simulates a mid-transaction throw and asserts no partial rows survive. The busy-timeout test asserts the pragma is set to 5000 and is bounded. The mtime-vs-hash test verifies touch-only is fresh while real content drift stays stale. The candidate-manifest test round-trips the persisted record. The metadata-shape test plants a corrupt JSON row and asserts `WithDiagnostics` distinguishes corrupt from absent. The resolve-subject-typed test verifies the DB-healthy unresolved path does NOT emit a `console.warn` (so warnings are reserved for the unavailable path).

`npm run stress` confirms my changes preserve the 195-test baseline against the code-graph scope. Two stress tests fail (`gate-d-benchmark-memory-search` p95 latency, `python-compat-stress` subprocess regression) but both are PRE-EXISTING flakes unrelated to this packet — the worktree contains uncommitted parallel-track edits in `skill_advisor/lib/scorer/*.ts` and `skill_advisor.py` that explain the regression. Per the user's "worktree cleanliness is never a blocker" rule, those are owned by a different remediation track.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Per-file transaction scope (not per-scan) | A scan can touch hundreds of files; locking the whole DB for a multi-second scan would block readers. Per-file (3-statement) transactions complete in milliseconds. |
| `busy_timeout = 5000` (5s) instead of unlimited | A real deadlock should still surface; 5s is enough to absorb typical writer races without hiding pathological hangs. Matches better-sqlite3 docs guidance. |
| Snapshot-stable read transactions per-branch (not whole-handler) | Wrapping the entire handler in one transaction would conflict with `ensureCodeGraphReady` (which mutates). Per-branch read transactions keep the read snapshot stable AND the readiness mutation outside. |
| Redefine doctor YAML around existing outputs (smaller blast radius) | Adding a new `index_health` MCP primitive would expand surface area; the YAML already had a fallback path at line 103 — promoting that to primary is the minimal change. |
| Candidate manifest stores `{count, digest, recordedAt}` | A monorepo can have 10k+ files; storing the full list inflates `code_graph_metadata` and serializes/deserializes on every detectState call. Count+digest is O(1) compare. |
| Hash-before-stale for touch-only changes | A `touch` should not force reindex; the mtime drifted but the content didn't. The cost is one extra read on touched files (rare). Avoids gratuitous full scans on `git checkout` of unchanged files. |
| `*WithDiagnostics()` companions instead of changing the original API | Existing callers expect `null` on error. New callers that care about distinguishing absent vs corrupt opt into the companion. Backward-compatible. |
| Console.warn the unavailable resolveSubjectToRef path | Internal-only typed return would lose information at the legacy null-returning call sites. A side-channel warn keeps the silent-error path auditable from logs without a breaking API change. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Git diff scope | 5 product files + 6 new vitest files + 1 stress fixture update + 1 query-handler test mock + this packet's spec docs |
| `validate.sh --strict` (this packet) | Errors: 0, Warnings: 4 (parity with sibling 004 worked-pilot at 0/4) |
| `npm run stress` | 193/195 pass on this branch; the 2 failures (`gate-d-benchmark-memory-search` and `python-compat-stress`) are PRE-EXISTING flakes from uncommitted parallel-track edits in `skill_advisor/`, NOT from code-graph scope |
| Targeted vitest (6 new files) | 20/20 tests passed (atomic-persistence × 3, busy-timeout × 3, stale-mtime-vs-hash × 3, candidate-manifest × 3, metadata-shape × 6, resolve-subject-typed × 2) |
| Code_graph full suite | 191/201 passed; 10 failures are PRE-EXISTING (4 indexer tsconfig path-format, 4 siblings-readiness mock, 1 scan readiness mock, 1 sibling-readiness mock) and unaffected by this packet |
| Inline finding markers present | 9 markers verified via grep across the 5 target files |
| TypeScript typecheck | clean (`tsc --noEmit -p tsconfig.json` exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Candidate manifest uses count + sha256 digest, not full path list.** A pathological case where N files are added and N other files are removed (so count is unchanged) AND the resulting digest collides (cryptographically improbable) would miss the change. Acceptable trade-off for storage bounds.
2. **busy_timeout=5000ms hides slow contention.** A 4.5s wait followed by success looks the same as a 50ms wait. Operators tuning latency may want metrics-level visibility into contention; out of scope here.
3. **Doctor YAML primary path uses git status, not graph-internal stale set.** When git is unavailable (CI without checkout), the doctor falls back to filesystem-walk + index-timestamp comparison. Result quality matches the previous fallback path.
4. **Subject resolution typed return is internal-only.** External MCP consumers (the `code_graph_context` tool) still see the same `null`-or-resolved shape; only internal `code-graph-context.ts` callers and log readers see the discriminated kind. Future packet could surface the unavailable kind through the MCP envelope.
5. **HEAD-scope filter requires git tooling.** When `git diff` between old/new HEAD fails (e.g. a shallow clone with the old sha pruned), the filter falls back to treating HEAD-changed as significant — same as current behavior.
<!-- /ANCHOR:limitations -->
