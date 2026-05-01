---
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
title: "Implementation Summary: 005 Resource Leaks And Silent Errors Remediation [template:level_2/implementation-summary.md]"
description: "Closed 5 findings F-003-A3-01..03 and F-004-A4-01, F-004-A4-04 with 5 surgical edits across watcher.ts, file-watcher.ts, projection.ts, and types.ts. Plugged three resource leaks and surfaced two silent error paths with operator-visible diagnostics. Watcher API preserved for sub-phase 006's pending refactor."
trigger_phrases:
  - "F-003-A3 closed"
  - "F-004-A4 closed"
  - "005 resource leaks closed"
  - "watcher resource leaks remediation"
  - "advisor projection fallback diagnostic"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/005-resource-leaks-silent-errors"
    last_updated_at: "2026-04-30T09:48:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Implementation complete; 5 findings closed; 11 vitests added; stress baseline preserved"
    next_safe_action: "Commit and push"
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
| **Spec Folder** | 005-resource-leaks-silent-errors |
| **Completed** | 2026-04-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill-graph daemon and the file-system watcher each had quiet bleed-points that only surfaced after long uptime: deleted skills kept their watch handles forever, the diagnostics array grew without bound, and a burst of file events could leak Promises that never settled on shutdown. On the silent-error side, a corrupt SQLite advisor database was indistinguishable from a clean first-run filesystem read, and a typo in a single `graph-metadata.json` file silently dropped every derived key-file watch target with no operator signal. Five surgical edits close all five findings while preserving the watcher API for sub-phase 006's pending refactor.

### Watcher target-refresh now unwatches removed paths (F-003-A3-01)

`refreshTargets()` in the skill-graph watcher used to add new chokidar watch paths but never remove paths that disappeared. Deleted skills leaked their `SKILL.md` and `graph-metadata.json` listeners plus per-path file-hash cache entries for the daemon's lifetime. The fix computes both additions and removals on each refresh, calls `watcher.unwatch()` for the removed set, prunes the corresponding `fileHashes` entries, and drops pending reindex requests for skills that no longer have any watch points. The new `unwatch?` capability on `SkillGraphFsWatcher` is OPTIONAL — legacy harnesses without it still function.

### Diagnostics array now bounded with aggregate counters (F-003-A3-02)

The watcher's `diagnostics: string[]` grew one entry per event for the entire daemon lifetime — a long-running daemon that survived a storm of WATCHER_ERROR or REINDEX_FAILED events leaked memory steadily. The fix introduces a 100-entry FIFO ring buffer (`DIAGNOSTICS_RING_BUFFER_CAP`) and routes every push site through a `pushDiagnostic` helper. Aggregate counters (one per diagnostic prefix: WATCHER_ERROR, REINDEX_FAILED, REINDEX_STORM_CIRCUIT_OPEN, QUARANTINED, MALFORMED_GRAPH_METADATA) survive ring rotation and surface as a single `COUNTERS:<key>=<count>,...` synthetic line at the head of `status().diagnostics`. The public return type stays `readonly string[]` — operators see "we hit 4,200 WATCHER_ERROR events" even though only the last 100 strings are retained.

### File-watcher reindex queue is bounded and drains on close (F-003-A3-03)

`startFileWatcher()`'s bounded-concurrency primitive caps active reindex tasks at 2 but let the pending-slot queue grow unbounded during burst events. Worse, `close()` never rejected those queued waiters, so a watcher shutdown leaked Promises that never settled. The fix caps `pendingReindexSlots` at 1000 entries (oldest evicted with `QUEUE_OVERFLOW_REASON` on overflow) and adds `abortPendingReindexQueue()` which `close()` calls before awaiting in-flight tasks. Both sentinel reasons (`QUEUE_OVERFLOW_REASON`, `QUEUE_CLOSED_REASON`) are routed to `console.error` instead of the existing `console.warn` path so they don't drown legitimate task warnings — they're expected outcomes of the bounded-queue policy, not failures.

### Advisor projection fallback now distinguishes DB-missing from DB-corrupt (F-004-A4-01)

`loadAdvisorProjection()` had a bare `catch {}` that swallowed every SQLite read error and silently returned the filesystem projection. Operators saw no signal that the database was corrupt or schema-drifted — clean first-run and degraded-fallback both produced `source: 'filesystem'`. The fix distinguishes three cases. (1) SQLite read succeeds → `source: 'sqlite'`. (2) SQLite DB doesn't exist → `source: 'filesystem'` (legitimate first run). (3) SQLite read throws → `source: 'filesystem-fallback'` with `fallbackReason` populated AND a `console.warn` emitted. The enum extension is additive; existing consumers continue to match `'filesystem'` for the clean-first-run path.

### Malformed graph-metadata.json now records a diagnostic (F-004-A4-04)

`parseDerivedKeyFiles()` had a bare `catch {}` for malformed `graph-metadata.json` and silently dropped every derived `key_files` watch target. A typo or schema break invisibly removed those watch points. The fix adds an optional `onMalformed(filePath, reason)` callback and records four distinct shape failures with reasons: invalid JSON, top-level not an object, derived not an object, and `key_files` not an array. The watcher wires this to push `MALFORMED_GRAPH_METADATA:<path>:<reason>` diagnostics that ride the same ring buffer + counter pipeline introduced by F-003-A3-02. The two-arg `discoverWatchTargets(workspaceRoot, skillsRoot)` signature stays backward-compatible.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/skill_advisor/lib/daemon/watcher.ts` | Modified | F-003-A3-01, F-003-A3-02, F-004-A4-04 (3 findings collapsed into one file because they all touch the watcher's lifecycle/diagnostics surface) |
| `mcp_server/lib/ops/file-watcher.ts` | Modified | F-003-A3-03 (queue cap + close drain) |
| `mcp_server/skill_advisor/lib/scorer/projection.ts` | Modified | F-004-A4-01 (fallback path distinguishes null vs throw + warns) |
| `mcp_server/skill_advisor/lib/scorer/types.ts` | Modified | F-004-A4-01 (enum extension + optional fallbackReason) |
| `mcp_server/skill_advisor/tests/daemon-watcher-resource-leaks-049-005.vitest.ts` | Created | 7 tests for F-003-A3-01, F-003-A3-02, F-004-A4-04 |
| `mcp_server/skill_advisor/tests/scorer/projection-fallback-049-005.vitest.ts` | Created | 2 tests for F-004-A4-01 |
| `mcp_server/tests/file-watcher-queue-cap-049-005.vitest.ts` | Created | 2 tests for F-003-A3-03 |
| `mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Modified | Updated 1 existing assertion for the new `'filesystem-fallback'` contract |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation followed the worked-pilot pattern from sub-phase 004 (commit `1822a1e69`). Each finding got an inline `// F-NNN-XX-NN:` marker for traceability; module structure stayed unchanged so sub-phase 006 can refactor watcher.ts freely. Verification ran in three stages: (1) targeted vitest of the 11 new tests, (2) regression vitest across the 4 closest pre-existing test files (daemon-freshness-foundation, lifecycle-derived-metadata, file-watcher, native-scorer), and (3) full `npm run stress`. The new behaviors surface through `status().diagnostics`, `console.warn`, and the typed `AdvisorProjection.source` enum so operators have observable signal without needing internal hooks.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cap diagnostics at 100, drop oldest, surface counters as a synthetic `COUNTERS:` line | The user's constraint was "don't change the return type." Counters are still observable but live as a string-prefix convention inside the existing `readonly string[]` field — no breaking change to consumers. |
| Cap pending-slot queue at 1000 with oldest-evicted on overflow | 1000 is generous for ordinary workloads (debounceTimers already coalesces by file path upstream) but bounds memory under attacker- or bug-driven floods. Newer events represent fresher state, so dropping the oldest preserves the most useful work. |
| Active reindex slots NOT aborted on close, only queued waiters | The user's constraint was "abort queued work on close." Aborting in-flight reindex tasks would require interrupting `withBusyRetry`'s SQLite operations mid-flight — outside the bounded-queue scope and risky for partial-write recovery. |
| Extend `AdvisorProjection.source` enum rather than add a new `degraded: boolean` field | Additive enum change preserves the existing `source === 'filesystem'` consumers (first-run still works), while the new `'filesystem-fallback'` value gives operators a single value to match for "DB read failed." Optional `fallbackReason` carries the underlying cause without requiring new field handling everywhere. |
| `parseDerivedKeyFiles()` callback is OPTIONAL, not required | `discoverWatchTargets` is exported and called from external test files with the two-arg signature. Adding a required parameter would break those callers. The optional third argument lets the watcher wire its diagnostic pipeline while leaving every other caller unchanged. |
| No helpers extracted from watcher.ts | Sub-phase 006 plans aggressive refactoring (split watcher from reindex/generation orchestration). Surgical edits with no structural change give 006 a clean merge surface. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS — tsc clean across all touched files |
| `npm run build` | PASS — dist artifacts refreshed without errors |
| Targeted vitests (3 new files, 11 tests) | PASS — 7/7 watcher resource-leak + 2/2 projection fallback + 2/2 file-watcher queue cap |
| Regression vitest (daemon-freshness-foundation, lifecycle-derived-metadata, file-watcher) | PASS — 57/57 |
| Native-scorer regression after assertion update | PASS — 14/14 |
| skill-projection-stress regression | PASS — 3/3 (clean filesystem path unaffected) |
| `npm run stress` | PASS — 58 files / 194 passed / 1 pre-existing env-dependent failure (gate-d-benchmark-memory-search latency) unrelated to F-003-A3-* / F-004-A4-* fixes; failure reproduces on stashed clean main |
| `validate.sh --strict` on this packet | Pending — final step before commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Active reindex tasks are not aborted on close.** `close()` drains queued waiters but still awaits in-flight reindex slots via `Promise.allSettled`. Long-running reindex calls (e.g. a hung SQLite write) can still delay close indefinitely. Aborting in-flight tasks is intentionally OUT OF SCOPE per user directive.
2. **Aggregate counters are in-process only.** The `COUNTERS:` line surfaces in `status().diagnostics` but is not exported to a structured logger or external sink. A future sub-phase could route counters through the existing `publishSkillGraphGeneration` pipeline if operators need cross-process visibility.
3. **`'filesystem-fallback'` source uses console.warn for operator signal.** A more structured approach (e.g. a dedicated diagnostics field on `AdvisorProjection`) would avoid relying on log scraping. The current design keeps the change minimal and additive; a structured field can be added later without breaking consumers.
4. **F-004-A4-04 only surfaces metadata-shape failures, not metadata-semantic failures.** A `graph-metadata.json` with valid shape but logically wrong content (e.g. `key_files: ['/nonexistent/path']`) still passes the parser silently — the existing `existsSync` filter just drops nonexistent entries. Catching semantic failures would require a separate validation pass beyond this fix's scope.
<!-- /ANCHOR:limitations -->
