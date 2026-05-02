---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: 001 Code-Graph Consistency Remediation [template:level_2/spec.md]"
description: "Closes 9 findings F-002-A2-01..03, F-014-C4-01..04, and F-004-A4-02..03 from packet 046. Tightens code-graph per-file persistence atomicity, SQLite contention policy, snapshot-stable logical reads, mtime-vs-content-hash staleness, scope-aware HEAD-drift triage, untracked-file discovery, doctor index-health workflow, subject-resolution failure typing, and metadata-shape distinction. Adds vitest cases for atomic write boundaries, busy retry, candidate manifest, and snapshot-stable reads. The doctor YAML is redefined to consume existing handler outputs (status + filesystem walk) instead of misusing detect_changes."
trigger_phrases:
  - "F-002-A2"
  - "F-014-C4"
  - "F-004-A4-02"
  - "F-004-A4-03"
  - "code graph consistency"
  - "atomic per-file persistence"
  - "sqlite busy timeout"
  - "candidate manifest"
  - "doctor code graph workflow"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/001-code-graph-consistency"
    last_updated_at: "2026-05-01T09:00:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Spec authored from worked-pilot 004 template"
    next_safe_action: "Author plan/tasks/checklist; then apply 9 surgical fixes in target files"
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
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Feature Specification: 001 Code-Graph Consistency Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (4 findings) + P2 (5 findings) |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 10 |
| **Predecessor** | None |
| **Successor** | 002-deep-loop-workflow-state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nine consistency-and-resilience defects across the code-graph indexing, query, and doctor-workflow surface area leak partial-write, contention, snapshot-skew, and silent-error bugs identified by packet 046's deep research:

- Per-file structural persistence in `persistIndexedFileResult` spans three independent write phases (stage `upsertFile`, `replaceNodes`, `replaceEdges`, finalize `upsertFile`) without an enclosing transaction, so a crash between phases leaves rows half-applied (F-002-A2-01).
- The shared `code-graph.sqlite` connection has WAL but no `busy_timeout` pragma, so concurrent writers from parallel scans race on `SQLITE_BUSY` instead of waiting (F-002-A2-02).
- Logical graph queries in `handleCodeGraphQuery` read multiple SELECTs against the live DB across `ensureCodeGraphReady` boundaries, so a concurrent index pass can shift the result set mid-flight (F-002-A2-03).
- `isFileStale()` declares stale on any mtime drift before comparing the content hash, forcing reindex on touch-only changes (F-014-C4-01).
- `detectState()` triggers a full scan whenever raw Git HEAD differs, even when the diff doesn't touch index-tracked files (F-014-C4-02).
- `detectState()` only tracks files already known to `code_files`, so newly-added untracked indexable files stay invisible until something else triggers a full scan (F-014-C4-03).
- The doctor diagnostic YAML calls `detect_changes({})` expecting stale/missed file lists, but the handler's actual contract takes a unified-diff input and returns `affectedSymbols` — a contract mismatch that produces empty results in autonomous mode (F-014-C4-04).
- `resolveSubjectToRef()` swallows DB errors as "unresolved subject," making it impossible to distinguish absent rows from broken DB state (F-004-A4-02).
- `getLastDetectorProvenanceSummary()`, `getLastGraphEdgeEnrichmentSummary()`, and `getLastGoldVerification()` collapse malformed JSON to `null`, conflating absent records with corrupt-but-present records (F-004-A4-03).

### Purpose
Close all nine findings with surgical changes that keep behavior backward-compatible, preserve the 58-file / 195-test stress baseline, and emit clearer diagnostics when contention, drift, or corruption is encountered. Wrap per-file persistence in a single short transaction; add `PRAGMA busy_timeout` at connection open; wrap query reads in a generation-stable read transaction; hash on mtime drift before declaring stale; filter HEAD diffs through index scope; persist a candidate manifest for untracked discovery; redefine the doctor workflow around existing outputs; return typed `unavailable | resolved | error` metadata for subject resolution; distinguish absent / corrupt-shape / invalid-shape metadata reads.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Nine surgical product-code/YAML fixes, one per finding F-002-A2-01..03, F-014-C4-01..04, F-004-A4-02..03.
- New vitest cases under `mcp_server/code_graph/tests/` for the atomic-persistence boundary, busy-timeout retry, snapshot-stable reads, candidate manifest, and metadata-shape distinction.
- Strict validation pass on this packet (parity with sibling 004 warning pattern).
- One commit pushed to `origin main`.

### Out of Scope
- Re-architecting the code-graph DB to per-scan generation tables (a future packet, not this one).
- Replacing better-sqlite3 with a connection-pool library — the busy-timeout fix is a single PRAGMA at connection open.
- Rewriting `detect_changes` to accept `{}` and return stale/missed sets — the contract stays diff-driven; the doctor YAML is the side that adapts.
- Doing eager filesystem scans for new untracked files on every read — the candidate manifest persists a known-set and only triggers bounded discovery when explicitly requested.
- Touching `skill_advisor/lib/daemon/watcher.ts` (sub-phase 005's scope).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/lib/ensure-ready.ts` | Modify | F-002-A2-01: wrap `persistIndexedFileResult`'s 3 write phases in `db.transaction(...)`. F-014-C4-02: filter HEAD diffs through index scope before declaring full-scan. F-014-C4-03: load candidate manifest from metadata + bounded discovery on untracked indexable files. |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Modify | F-002-A2-02: add `PRAGMA busy_timeout = 5000` at `initDb`. F-014-C4-01: in `isFileStale`/`ensureFreshFiles`, compare content hash on mtime drift before declaring stale (touch-only is fresh). F-004-A4-03: distinguish absent vs corrupt vs invalid-shape in three metadata getters via typed result. |
| `mcp_server/code_graph/handlers/query.ts` | Modify | F-002-A2-03: open a single `IMMEDIATE` read transaction around query operations, or use a generation marker so multiple SELECTs see a stable snapshot. |
| `mcp_server/code_graph/lib/code-graph-context.ts` | Modify | F-004-A4-02: change `resolveSubjectToRef` return type to `ArtifactRef \| { unavailable: true; reason: string } \| null`; surface DB error path distinctly from no-row case. |
| `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml` | Modify | F-014-C4-04: redefine Phase 1 Analysis to use `code_graph_status` + filesystem walk for stale/missed/bloat (which the YAML's existing fallback path already implements). Drop `detect_changes({})` call entirely. |
| `mcp_server/code_graph/tests/code-graph-atomic-persistence.vitest.ts` | Create | F-002-A2-01 atomic-write transactional behavior. |
| `mcp_server/code_graph/tests/code-graph-busy-timeout.vitest.ts` | Create | F-002-A2-02 busy retry under simulated lock contention. |
| `mcp_server/code_graph/tests/code-graph-stale-mtime-vs-hash.vitest.ts` | Create | F-014-C4-01 touch-only mtime drift remains fresh. |
| `mcp_server/code_graph/tests/code-graph-candidate-manifest.vitest.ts` | Create | F-014-C4-03 candidate manifest persistence + drift detection. |
| `mcp_server/code_graph/tests/code-graph-metadata-shape.vitest.ts` | Create | F-004-A4-03 absent vs corrupt-JSON vs invalid-shape distinction. |
| `mcp_server/code_graph/tests/code-graph-resolve-subject-typed.vitest.ts` | Create | F-004-A4-02 typed unavailable/error metadata for resolveSubjectToRef. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR-1 (F-002-A2-01): `persistIndexedFileResult()` MUST wrap its three storage operations (stage `upsertFile`, `replaceNodes` + `replaceEdges`, finalize `upsertFile`) in a single `db.transaction(...)`. A throw in any phase rolls all three back; a successful return commits all three together. The transaction is per-file (short) so it does not lock the DB for an entire scan.
- FR-2 (F-002-A2-02): `initDb()` MUST set `PRAGMA busy_timeout = 5000` immediately after opening the connection (before WAL/foreign_keys), so concurrent writers on the same DB wait up to 5s for the writer lock instead of throwing `SQLITE_BUSY`.
- FR-3 (F-002-A2-03): `handleCodeGraphQuery()` reads MUST happen inside a short `db.transaction(() => { ... })` block (or equivalent generation-stable read pattern) so that multi-SELECT operations (outline + edges-from + edges-to) observe a consistent snapshot.
- FR-4 (F-014-C4-01): `ensureFreshFiles()` and `isFileStale()` MUST hash on mtime drift before declaring a file stale: if the mtime differs but the content hash matches the stored hash, the file is `fresh` (touch-only).
- FR-5 (F-014-C4-02): When raw Git HEAD differs but `git diff` between old/new HEAD touches no path in the indexed-file set, `detectState()` MUST NOT escalate to `full_scan`. The HEAD pointer is updated; freshness reports `fresh`. Filtered through `getTrackedFiles()`.
- FR-6 (F-014-C4-03): A persisted candidate manifest stored under `code_graph_metadata.candidate_manifest` records the file count + content-hash digest of all known indexable file paths. On `detectState()`, if the on-disk indexable count differs from the stored manifest count by more than a small budget OR a bounded discovery surfaces a new file, `freshness=stale, action=full_scan`.
- FR-7 (F-014-C4-04): The doctor YAML autonomous workflow MUST NOT call `detect_changes({})` for stale/missed file lists. Phase 1 analysis derives stale from `code_graph_status` (freshness flag) + git status, and missed from filesystem walk minus `code_graph_status` index. The fallback path already implemented at line 103 becomes the primary path.
- FR-8 (F-004-A4-02): `resolveSubjectToRef()` MUST return a typed result distinguishing `{ kind: 'resolved'; ref: ArtifactRef }`, `{ kind: 'unavailable'; reason: string }`, and `{ kind: 'unresolved' }`. Callers must adapt (the call site is internal).
- FR-9 (F-004-A4-03): `getLastDetectorProvenanceSummary()`, `getLastGraphEdgeEnrichmentSummary()`, and `getLastGoldVerification()` MUST distinguish three states: `null` (absent), parsed-but-invalid-shape (returns `{ corrupt: true; raw: string }` discriminated marker — caller decides how to handle), and JSON parse error (also `corrupt: true`). The default external API contract on success is unchanged; new callers can opt into the typed variant via a `*WithDiagnostics()` companion.

### Non-Functional
- NFR-1: `npm run stress` exits 0 with at least 58 files / 195 tests after the change (current baseline).
- NFR-2: `validate.sh --strict` exits 0 errors on this packet (warnings parity acceptable; sibling 004 hits 0/4).
- NFR-3: All new tests run in <2s individually so the suite stays fast.
- NFR-4: Each edit carries an inline finding-ID marker (`// F-NNN-XX-NN:` for TS/JS, `# F-NNN-XX-NN:` for shell/YAML, `<!-- F-NNN-XX-NN -->` for markdown) for traceability.
- NFR-5: Per-file write transactions stay under 50ms in typical operation so they do not block concurrent readers.

### Constraints
- Stay on `main`; no feature branch.
- No new external dependencies.
- The atomic-persistence transaction MUST be per-file scope, not per-scan, so a long scan does not lock the DB for minutes.
- The candidate manifest MUST persist alongside existing `code_graph_metadata` rows (the `key` column), not in a new global location.
- The doctor YAML change is the smaller blast-radius option chosen over adding a new `index_health` MCP primitive.
- Do NOT touch `skill_advisor/lib/daemon/watcher.ts` (owned by sub-phase 005 in this remediation series).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] Spec authored
- [ ] All 9 doc/code edits applied with finding-ID citations
- [ ] All new vitest cases pass (>= 6 new files)
- [ ] `validate.sh --strict` errors=0 for this packet
- [ ] `npm run stress` exit 0 / >= 58 files / >= 195 tests
- [ ] One commit pushed to `origin main` (final step)
- [ ] implementation-summary.md updated with Findings closed table (9 rows)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Per-file transaction blocks concurrent reads on hot scans | Keep transaction scope per-file (3 statements only). Tests assert wall time stays bounded. |
| busy_timeout=5000 hides real deadlocks | If a contention bug exists, surfaces as a 5s hang instead of throw — operator sees the slowdown and investigates. Current behavior throws `SQLITE_BUSY` immediately, also opaque. The PRAGMA approach matches better-sqlite3 docs guidance. |
| Read-transaction scope around query operations regresses latency | Keep the transaction per-handler-call; only multi-SELECT operations (outline, query) get wrapped. Single-SELECT paths unchanged. |
| Hash-before-stale for touch-only adds mtime+hash work even on no-op scans | Cache the on-disk content hash in the existing `getCurrentFileContentHash` helper; the cost is one extra read on touch-only changes (rare in practice). |
| Index-scope HEAD diff requires git tooling availability | Reuse the existing `execSync('git ...')` helper; on git failure, fall back to current full-scan behavior (no regression). |
| Candidate manifest grows unbounded on monorepos | Store only the file count + a compact digest, not the full path list. Bounded discovery on demand, not prefetch. |
| Doctor YAML behavior change affects /doctor:code-graph callers | The YAML already had a fallback to git-status + index-timestamp comparison (line 103). The change makes that the primary path. Output shape unchanged. |

Dependencies:
- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §2 (consistency), §14 (resilience), §4 (silent-error)
- Validate: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Worked-pilot: sibling sub-phase `004-validation-and-memory/` (commit `1822a1e69`)
- No cross-packet dependencies.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edges -->
## L2: EDGE CASES

| Edge | Trigger | Expected behavior |
|------|---------|-------------------|
| Crash mid-persistence | Process killed between `replaceNodes` and `replaceEdges` | Transaction rolls back; file_mtime_ms stays at staged 0 so next scan retries |
| Two scans race on same DB | Two `code_graph_scan` invocations in parallel | Second waits up to 5s on `BEGIN IMMEDIATE`, succeeds; no `SQLITE_BUSY` throw |
| Touch-only file change | `touch src/foo.ts` (mtime drift, content unchanged) | `isFileStale=false`; not in stale set; freshness reports fresh |
| Git checkout of unrelated branch | HEAD changes; diff touches no indexed file | Freshness stays fresh; HEAD pointer updates; no full scan |
| New untracked indexable file added | `git add src/new.ts` (manifest count diverges) | Detection picks up the change on next `detectState`; full_scan triggered |
| Doctor invoked autonomous mode | `/doctor:code-graph:auto` | Phase 1 derives stale/missed via `code_graph_status` + filesystem walk; no `detect_changes({})` call |
| resolveSubjectToRef DB throws | Connection broken mid-query | Returns `{ kind: 'unavailable'; reason }` not silent null |
| Corrupt metadata JSON in code_graph_metadata | A row's `value` column has `not-json{` | `getLastGoldVerification()` returns `null` (existing API), but `getLastGoldVerificationWithDiagnostics()` returns `{ corrupt: true; raw: 'not-json{' }` |
<!-- /ANCHOR:edges -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Finding | File | Effort (minutes) |
|---------|------|-----------------:|
| F-002-A2-01 | ensure-ready.ts persistIndexedFileResult tx wrap | 20 |
| F-002-A2-02 | code-graph-db.ts busy_timeout PRAGMA | 5 |
| F-002-A2-03 | query.ts read tx wrap | 15 |
| F-014-C4-01 | code-graph-db.ts mtime-vs-hash | 15 |
| F-014-C4-02 | ensure-ready.ts HEAD-scope filter | 25 |
| F-014-C4-03 | ensure-ready.ts candidate manifest | 35 |
| F-014-C4-04 | doctor YAML redefinition | 15 |
| F-004-A4-02 | code-graph-context.ts typed resolution | 20 |
| F-004-A4-03 | code-graph-db.ts metadata shape distinction | 25 |
| Tests | 6 new vitest files | 50 |
| **Total** | | **~225 minutes (~3.75h)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The candidate-manifest format uses `{count, digest}` rather than a full path list to keep storage bounded; the discovery API stays bounded-budget.
- Choosing the YAML-redefinition route for F-014-C4-04 (over adding an index_health primitive) per user direction in the workflow note. Smaller blast radius.
<!-- /ANCHOR:questions -->
