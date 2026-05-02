---
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: 005 Resource Leaks And Silent Errors Remediation [template:level_2/plan.md]"
description: "Apply 5 surgical edits across watcher.ts, file-watcher.ts, and projection.ts/types.ts. Add 3 vitest files; update 1 existing scorer test for the new filesystem-fallback contract. Preserve watcher API for sub-phase 006."
trigger_phrases:
  - "F-003-A3 plan"
  - "F-004-A4 plan"
  - "005 resource leaks plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/005-resource-leaks-silent-errors"
    last_updated_at: "2026-04-30T09:46:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Plan authored after spec"
    next_safe_action: "Edits already applied; run validate strict + commit + push"
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
# Implementation Plan: 005 Resource Leaks And Silent Errors Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five surgical edits across the daemon watcher, file watcher, and advisor projection close findings F-003-A3-01..03 and F-004-A4-01, F-004-A4-04. Three resource leaks (target-refresh path leak, unbounded diagnostics, unbounded reindex queue) and two silent error paths (SQLite fallback, malformed metadata) become observable without changing the public APIs that sub-phase 006 will refactor.

### Technical Context

The product code lives across two TypeScript modules in the MCP server tree:
- `mcp_server/skill_advisor/lib/daemon/watcher.ts` — skill-graph watcher (3 findings)
- `mcp_server/lib/ops/file-watcher.ts` — generic spec/markdown file watcher (1 finding)
- `mcp_server/skill_advisor/lib/scorer/projection.ts` + `types.ts` — advisor projection loader (1 finding)

All edits stay within existing files; one new optional parameter on `discoverWatchTargets` and one new optional method on the `SkillGraphFsWatcher` interface preserve every existing call site.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold |
|------|-----------|
| validate.sh --strict (this packet) | exit 0 (or peer-warning pattern matching 004) |
| Targeted vitest (3 new files) | 11/11 pass |
| Regression vitest (3 existing files: daemon-freshness-foundation, lifecycle-derived-metadata, file-watcher) | 57/57 still pass |
| Native-scorer regression | 14/14 pass after the corrupt-DB assertion update |
| `npm run stress` | matches pre-change baseline (1 pre-existing env-dependent latency failure unrelated to these fixes) |
| Inline finding markers | One `// F-NNN-XX-NN:` comment per finding (≥17 markers across the 4 product files) |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The fixes preserve module boundaries and public APIs:

- **Daemon watcher (3 findings, surgical only)** — `refreshTargets()` adds removal logic alongside its existing addition logic; the diagnostics array is wrapped in a `pushDiagnostic` helper that enforces a 100-entry FIFO ring buffer plus an aggregate-counter map; `parseDerivedKeyFiles()` accepts an optional `onMalformed` callback that the watcher wires to its diagnostic pipeline. No exports added or removed; sub-phase 006's planned split keeps a clean merge point.
- **File watcher (1 finding)** — The closure-private `pendingReindexSlots` array gains a 1000-entry cap with oldest-eviction on overflow; close() now calls `abortPendingReindexQueue()` to drain the queue before awaiting in-flight tasks. Two sentinel error reasons (`QUEUE_OVERFLOW_REASON`, `QUEUE_CLOSED_REASON`) gate the noisy/severity log split.
- **Advisor projection (1 finding)** — `loadAdvisorProjection()` distinguishes "DB missing" (returns null → clean filesystem path) from "DB throws" (corrupt → degraded fallback). The fallback path emits `console.warn` and tags the projection with `source: 'filesystem-fallback'` plus `fallbackReason`. The enum extension is additive; existing consumers continue to match `'filesystem'` for the clean-first-run path.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| # | Phase | Action | File | Finding | Status |
|---|-------|--------|------|---------|--------|
| 1 | Edit | Add optional `unwatch?` to `SkillGraphFsWatcher` interface | watcher.ts | F-003-A3-01 | Complete |
| 2 | Edit | Compute additions + removals in `refreshTargets()`; call unwatch; prune fileHashes + pending | watcher.ts | F-003-A3-01 | Complete |
| 3 | Edit | Add `DIAGNOSTICS_RING_BUFFER_CAP=100` constant + `pushDiagnostic` helper + counter map; route 4 push sites through it | watcher.ts | F-003-A3-02 | Complete |
| 4 | Edit | Status() prepends synthetic `COUNTERS:<key>=<count>,...` line (sorted, only when non-empty) | watcher.ts | F-003-A3-02 | Complete |
| 5 | Edit | `parseDerivedKeyFiles()` takes `onMalformed?` callback; surfaces JSON-parse + shape errors | watcher.ts | F-004-A4-04 | Complete |
| 6 | Edit | Wire `recordMalformedMetadata` closure into watcher initialization + `refreshTargets()` | watcher.ts | F-004-A4-04 | Complete |
| 7 | Edit | Cap pendingReindexSlots at 1000; reject oldest with `QUEUE_OVERFLOW_REASON` on overflow | file-watcher.ts | F-003-A3-03 | Complete |
| 8 | Edit | `abortPendingReindexQueue()` drains queue with `QUEUE_CLOSED_REASON` on close | file-watcher.ts | F-003-A3-03 | Complete |
| 9 | Edit | Suppress queue-sentinel warnings; log them at `console.error` instead | file-watcher.ts | F-003-A3-03 | Complete |
| 10 | Edit | Extend `AdvisorProjection.source` enum with `'filesystem-fallback'`; add optional `fallbackReason?: string` | types.ts | F-004-A4-01 | Complete |
| 11 | Edit | `loadAdvisorProjection()`: distinguish null (clean filesystem) from throw (filesystem-fallback + warn + reason) | projection.ts | F-004-A4-01 | Complete |
| 12 | Test | Add 7-test watcher resource-leak vitest | tests/daemon-watcher-resource-leaks-049-005.vitest.ts | F-003-A3-01,02; F-004-A4-04 | Complete |
| 13 | Test | Add 2-test projection fallback vitest | tests/scorer/projection-fallback-049-005.vitest.ts | F-004-A4-01 | Complete |
| 14 | Test | Add 2-test file-watcher queue cap vitest | tests/file-watcher-queue-cap-049-005.vitest.ts | F-003-A3-03 | Complete |
| 15 | Test | Update existing native-scorer corrupt-DB assertion for new contract | tests/scorer/native-scorer.vitest.ts | F-004-A4-01 | Complete |
| 16 | Validate | `validate.sh --strict` on this packet | this packet | — | Pending |
| 17 | Stress | `npm run stress` | mcp_server/ | — | Complete (baseline parity) |
| 18 | Refresh | `generate-context.js` for this packet | spec docs | — | Pending |
| 19 | Ship | commit + push to origin main | repo | — | Pending |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (vitest) | New behavior per finding (3 new files, 11 tests) | vitest |
| Regression | Existing daemon-freshness, lifecycle-derived-metadata, file-watcher, native-scorer, projection-stress | vitest |
| Stress | Full `npm run stress` end-to-end (excludes our new vitest files; baseline parity) | vitest stress config |

For each new behavior in TypeScript: add a vitest in the matching `tests/` directory using existing harness patterns (`createWatchHarness` from daemon-freshness-foundation, `createWatchFactoryHarness` from file-watcher.vitest.ts). One existing test in `native-scorer.vitest.ts` is updated to reflect the new explicit-fallback contract.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §3 (resource leaks) + §4 (silent errors)
- Validate script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Stress runner: `cd mcp_server && npm run stress`
- Sub-phase 003 (commit `f5b815c7e`) had no overlapping line edits in projection.ts; F-004-A4-01's fallback fix lives below 003's derived-trigger/keyword split.
- Sub-phase 006 (architecture cleanup, NOT YET RUN) plans to refactor watcher.ts. These changes preserve the watcher API so 006 has a clean merge.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If any change breaks the existing test baseline or breaks an upstream consumer:
1. `git revert <commit-sha>` reverts all 5 fixes atomically.
2. Re-run targeted vitests + native-scorer to confirm baseline restored.
3. Identify the failing finding from inline `// F-NNN-XX-NN:` markers.
4. Reauthor the failing edit with smaller scope; re-validate.

Each edit carries a finding marker so a partial-revert (single hunk) is straightforward.
<!-- /ANCHOR:rollback -->
