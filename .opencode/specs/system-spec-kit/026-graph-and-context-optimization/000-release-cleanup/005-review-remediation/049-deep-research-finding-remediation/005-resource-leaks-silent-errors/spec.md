---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: 005 Resource Leaks And Silent Errors Remediation [template:level_2/spec.md]"
description: "Closes 5 findings F-003-A3-01..03 and F-004-A4-01, F-004-A4-04 from packet 046. Plugs three resource leaks (target-refresh path leak, unbounded diagnostics array, unbounded reindex-slot queue) and surfaces two silent error paths (SQLite projection fallback and malformed graph-metadata) so operators see degradation reasons instead of disappearing watch targets."
trigger_phrases:
  - "F-003-A3"
  - "F-004-A4-01"
  - "F-004-A4-04"
  - "resource leaks and silent errors"
  - "watcher target refresh leak"
  - "diagnostics ring buffer"
  - "file-watcher queue cap"
  - "advisor projection fallback"
  - "malformed graph metadata"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/005-resource-leaks-silent-errors"
    last_updated_at: "2026-04-30T09:45:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Spec authored from worked-pilot 004 template"
    next_safe_action: "Apply 5 surgical fixes + new vitests; validate strict; commit + push"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-005-resource-leaks-silent-errors"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 005 Resource Leaks And Silent Errors Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (3 findings) + P2 (2 findings) |
| **Status** | Complete |
| **Created** | 2026-04-30 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 10 |
| **Predecessor** | 004-validation-and-memory |
| **Successor** | 006-architecture-cleanup |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five findings from packet 046's deep research describe long-running daemon resource leaks plus two silent error paths that hide degraded behavior from operators:

- The skill-graph watcher's `refreshTargets()` adds new chokidar watch paths but never unwatches removed ones, so deleted skills leak their `SKILL.md` and `graph-metadata.json` listeners + per-path file-hash cache entries for the daemon's lifetime (F-003-A3-01).
- The watcher's `diagnostics: string[]` array grows unbounded — every WATCHER_ERROR, REINDEX_FAILED, REINDEX_STORM_CIRCUIT_OPEN, and QUARANTINED entry stays in process memory forever (F-003-A3-02).
- The file-watcher's bounded-concurrency primitive caps active reindex tasks at 2 but lets the pending-slot queue (`pendingReindexSlots`) grow without bound during burst events. Worse, `close()` never drains those queued waiters, so a watcher shutdown leaks Promises that never settle (F-003-A3-03).
- The advisor projection's `loadAdvisorProjection()` swallows every SQLite read error with a bare `catch {}` and silently degrades to the filesystem projection. Operators see no signal that the SQLite database is corrupt or schema-drifted — corrupt-DB and clean-first-run both produce `source: 'filesystem'` (F-004-A4-01).
- The watcher's `parseDerivedKeyFiles()` helper had a bare `catch {}` for malformed `graph-metadata.json` and silently dropped every derived `key_files` watch target. A typo or schema break in metadata.json invisibly removed those watch points (F-004-A4-04).

### Purpose
Plug all three leaks and surface both silent errors with surgical changes that preserve the public watcher / file-watcher / projection APIs. Sub-phase 006 will refactor watcher.ts more aggressively (split watcher from reindex/generation orchestration); these changes stay scoped to in-place fixes so 006 has freedom to refactor without merge conflicts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Five surgical product-code fixes with inline `// F-NNN-XX-NN:` markers.
- Three new vitest files covering the new behaviors (cap, unwatch, queue-close, fallback diagnostics, malformed-metadata diagnostic).
- One existing test (`native-scorer.vitest.ts:271`) updated for the new `'filesystem-fallback'` source contract.
- Strict validation pass on this packet.
- One commit pushed to `origin main`.

### Out of Scope
- Refactoring watcher.ts beyond surgical fixes — sub-phase 006 covers structural cleanup (F-016-D1-06 will split watcher from reindex/generation).
- Aborting actively-running reindex tasks on close(). The fix only aborts QUEUED waiters; in-flight tasks continue to be awaited (current behavior).
- Migrating callers off the `source: 'filesystem' | 'sqlite' | 'fixture'` enum. We extend the enum to include `'filesystem-fallback'` plus optional `fallbackReason`, preserving every existing consumer.
- Replacing the diagnostics ring buffer with a structured logger or external sink — counters stay in-process and surface via `status().diagnostics`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/skill_advisor/lib/daemon/watcher.ts` | Modify | F-003-A3-01: refreshTargets() computes additions AND removals; calls watcher.unwatch() for removed paths and prunes fileHashes + pending entries. F-003-A3-02: bounded ring buffer (cap 100) + aggregate counters surfaced as a synthetic `COUNTERS:` line in status().diagnostics. F-004-A4-04: parseDerivedKeyFiles() takes an optional onMalformed callback, wired by the watcher to record `MALFORMED_GRAPH_METADATA:<path>:<reason>` diagnostics. |
| `mcp_server/lib/ops/file-watcher.ts` | Modify | F-003-A3-03: pending-slot queue capped at 1000 (oldest-evicted on overflow); close() rejects every queued waiter with a sentinel reason so dependent operations exit cleanly. The active-slot count is unchanged. |
| `mcp_server/skill_advisor/lib/scorer/projection.ts` | Modify | F-004-A4-01: distinguish "DB missing" (returns null → clean filesystem) from "DB throws" (corrupt → degraded filesystem-fallback with reason). Fail-open path now emits a console.warn and tags the projection with `source: 'filesystem-fallback'` + `fallbackReason`. |
| `mcp_server/skill_advisor/lib/scorer/types.ts` | Modify | F-004-A4-01: extend `AdvisorProjection.source` enum with `'filesystem-fallback'` and add optional `fallbackReason?: string`. Existing `'filesystem'` semantics unchanged for clean first-run path. |
| `mcp_server/skill_advisor/tests/daemon-watcher-resource-leaks-049-005.vitest.ts` | Create | 7 tests covering F-003-A3-01 (unwatch removed targets, legacy harness without unwatch), F-003-A3-02 (ring buffer cap + COUNTERS line, empty case), F-004-A4-04 (malformed JSON, malformed shape, backward-compat). |
| `mcp_server/skill_advisor/tests/scorer/projection-fallback-049-005.vitest.ts` | Create | 2 tests covering F-004-A4-01 (clean filesystem source when DB missing; filesystem-fallback + console.warn when DB corrupt). |
| `mcp_server/tests/file-watcher-queue-cap-049-005.vitest.ts` | Create | 2 tests covering F-003-A3-03 (close() returns under multiple queued waiters; queue-closed sentinel logs at error not warn). |
| `mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Modify | Update one existing assertion: corrupt-DB test now expects `'filesystem-fallback'` (not `'filesystem'`) and asserts `fallbackReason` is populated. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR-1 (F-003-A3-01): `createSkillGraphWatcher.refreshTargets()` MUST call `watcher.unwatch()` (when present) for any target path absent from the refreshed scan, MUST remove the corresponding entries from `fileHashes`, and MUST drop pending reindex requests for skills that no longer have any watch targets.
- FR-2 (F-003-A3-02): The watcher's diagnostics array MUST hold at most 100 entries; older entries MUST be evicted FIFO. `status().diagnostics` MUST prepend a synthetic `COUNTERS:<key>=<count>,...` line (sorted by key) when at least one diagnostic has been recorded; the line MUST NOT itself be stored in the buffer (no double counting).
- FR-3 (F-003-A3-03): `startFileWatcher().close()` MUST drain the pending-slot queue by rejecting every queued waiter with a `QUEUE_CLOSED_REASON` sentinel before awaiting `inFlightReindex`. Queued waiters that overflow the 1000-cap MUST be rejected with a `QUEUE_OVERFLOW_REASON` sentinel and the eviction MUST drop the OLDEST waiter (newer events represent fresher state). Overflow and close-sentinel rejections MUST log at `console.error` severity, NOT `console.warn`.
- FR-4 (F-004-A4-01): `loadAdvisorProjection()` MUST distinguish three cases. (a) SQLite read succeeds → `source: 'sqlite'`. (b) SQLite DB does not exist → `source: 'filesystem'` (legitimate first run, no warning). (c) SQLite read throws → `source: 'filesystem-fallback'` with `fallbackReason` populated AND a `console.warn` emitted that contains `"SQLite projection failed"`.
- FR-5 (F-004-A4-04): `parseDerivedKeyFiles()` MUST accept an optional `onMalformed(filePath, reason)` callback. When `JSON.parse` throws, when the parsed top-level is not an object, when `derived` is the wrong shape, or when `derived.key_files` is the wrong shape, the callback MUST be invoked with a human-readable reason. The watcher's wiring MUST push these as `MALFORMED_GRAPH_METADATA:<path>:<reason>` diagnostics. The two-arg signature `discoverWatchTargets(workspaceRoot, skillsRoot)` MUST stay backward-compatible (callback is optional).

### Non-Functional
- NFR-1: `npm run stress` exits with the SAME baseline as before the change (the only failing stress test is the pre-existing `gate-d-benchmark-memory-search.vitest.ts` p95 latency, which is environment-dependent and unrelated to these fixes).
- NFR-2: `validate.sh --strict` exits 0 (or peer-warning pattern) on this packet.
- NFR-3: All 11 new vitest cases run in <2s combined.
- NFR-4: Each edit carries an inline `// F-NNN-XX-NN:` finding marker for traceability (TS comments).
- NFR-5: The watcher.ts module structure stays UNCHANGED so sub-phase 006 can refactor freely. No helpers are extracted, no functions are reordered, no exports are added or removed beyond what the typed callback parameter requires.

### Constraints
- Stay on `main`; no feature branch.
- No new external dependencies.
- Preserve existing public APIs: `SkillGraphFsWatcher.unwatch?` is OPTIONAL (chokidar provides it; harnesses without it stay supported). `discoverWatchTargets` callback parameter is OPTIONAL (third argument).
- The diagnostics field in `SkillGraphWatcherStatus` stays typed `readonly string[]`; aggregate counters surface via a string-prefix convention (`COUNTERS:...`).
- Active reindex slots and their tasks are NOT aborted on close; only queued (waiting) slots are. This matches the user's explicit constraint and the Out-of-Scope note above.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Spec authored
- [x] All 5 product-code edits applied with finding-ID citations
- [x] All 11 new vitest cases pass (7 watcher + 2 projection + 2 file-watcher)
- [x] One existing scorer test updated for new `'filesystem-fallback'` contract; passes
- [x] Existing 57 daemon-freshness/lifecycle/file-watcher tests still pass (no regression)
- [x] `npm run stress` matches pre-change baseline (194/195 pass; the 1 failure is pre-existing env-dependent latency benchmark unrelated to these fixes)
- [x] `validate.sh --strict` exit 0 (or peer-warning pattern) for this packet
- [ ] One commit pushed to `origin main` (final step)
- [x] implementation-summary.md updated with Findings closed table (5 rows)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Adding `unwatch?` to `SkillGraphFsWatcher` interface breaks downstream consumers that implement the interface manually | Made `unwatch` OPTIONAL; existing harnesses without it work unchanged. New backward-compat test asserts a harness lacking `unwatch` still functions. |
| Ring buffer rotation drops a critical diagnostic before operator reads it | Aggregate counters survive rotation via the synthetic `COUNTERS:` line, so the long-tail aggregate is preserved even when the per-event strings roll out. |
| File-watcher queue-cap eviction policy drops the wrong entry | Policy: drop OLDEST on overflow (newer events represent fresher state). Documented in code comment. Test validates eviction returns expected sentinel. |
| Source-enum extension breaks existing `projection.source === 'filesystem'` assertions | Verified: only one existing test (`native-scorer.vitest.ts:271`) relied on corrupt-DB returning `'filesystem'`; updated for the new explicit contract. The first-run filesystem path (`projection-stress.vitest.ts:85`) is unaffected — DB-missing still returns `'filesystem'`. |
| Sub-phase 006 watcher refactor merge conflict | Changes stay surgical: no helpers extracted, no module structure changed. F-003-A3-* edits live inside existing functions and the new `pushDiagnostic` helper is local-scope only. F-004-A4-04 adds an optional callback parameter, no rename. |

Dependencies:
- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §3 (resource leaks) and §4 (silent errors)
- Validate: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Stress: `cd .opencode/skill/system-spec-kit/mcp_server && npm run stress`
- Sub-phase 003 (commit `f5b815c7e`) shifted projection.ts line numbers; F-004-A4-01 fix lives at the new `loadAdvisorProjection()` location, not the original 237-240. No conflict because 003's change touched lines 137-145 (`derivedTriggers`/`derivedKeywords` split) and the fallback catch lives below.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edges -->
## L2: EDGE CASES

| Edge | Trigger | Expected behavior |
|------|---------|-------------------|
| `watcher.unwatch` is missing on the harness | Legacy fixture without unwatch property | refreshTargets() falls through; no throw; additions still wire via `add` |
| All diagnostics empty | Watcher just started, no events fired | `status().diagnostics === []`; no synthetic COUNTERS line emitted |
| Diagnostic prefix has no colon | Bare token "REINDEX_DEBOUNCE" | Counter key falls back to the full string; counter still increments |
| Queue cap reached during ENOENT cascade | 1100 unique files arrive before debounce fires | Oldest 100 evicted with `QUEUE_OVERFLOW_REASON`; newest 1000 stay queued |
| Close mid-overflow | `close()` called while overflow eviction in progress | abortPendingReindexQueue rejects all remaining queued waiters; close drains in-flight |
| SQLite DB exists but is zero-length | better-sqlite3 throws "file is not a database" | `source: 'filesystem-fallback'`, `fallbackReason: 'file is not a database'`, `console.warn` emitted |
| graph-metadata.json is `null` | JSON.parse returns null (not an object) | onMalformed called with reason "top-level value is not an object"; key_files defaults to empty |
| graph-metadata.json has `derived: undefined` | Missing field (legitimate omission) | NO diagnostic recorded; key_files defaults to empty (this is the documented schema) |
<!-- /ANCHOR:edges -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Finding | File | Effort (minutes) |
|---------|------|-----------------:|
| F-003-A3-01 | watcher.ts refreshTargets unwatch | 30 |
| F-003-A3-02 | watcher.ts ring buffer + counters | 25 |
| F-003-A3-03 | file-watcher.ts queue cap + close drain | 35 |
| F-004-A4-01 | projection.ts + types.ts fallback | 25 |
| F-004-A4-04 | watcher.ts parseDerivedKeyFiles callback | 20 |
| Tests + harness updates | 3 new vitest files + 1 update | 60 |
| **Total** | | **~195 minutes (~3.25h)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Active-task abort-on-close is intentionally OUT OF SCOPE per user directive — the bounded-queue fix only drops queued (waiting) work; in-flight tasks continue to be awaited as before.
<!-- /ANCHOR:questions -->
