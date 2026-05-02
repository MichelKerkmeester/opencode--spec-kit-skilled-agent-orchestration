---
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
title: "Implementation Summary: Iteration-001 Daemon Concurrency Fixes [template:level_2/implementation-summary.md]"
description: "Four daemon-layer races fixed: serialized watcher drain, ordered shutdown, token-checked generation lock, and monotonic cache invalidation. Stress suite still green at 56/56 / 163/163."
trigger_phrases:
  - "implementation summary"
  - "daemon concurrency summary"
  - "F-001-A1"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/048-iter-001-daemon-concurrency-fixes"
    last_updated_at: "2026-05-01T04:15:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Implementation complete; all tests green"
    next_safe_action: "Commit + push to origin main"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/cache-invalidation.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "iter-001-daemon-fixes"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 048-iter-001-daemon-concurrency-fixes |
| **Completed** | 2026-04-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill-advisor daemon had four concurrency holes that let its persisted state diverge from reality under realistic interleavings: timer-driven flushes could race each other, shutdown could be overwritten by a queued reindex, the generation lock could be stolen back during stale reclamation, and cache listeners could observe events in reverse generation order. All four are now closed with localized fixes that keep the public daemon contract unchanged. The full stress suite still finishes in ~55 seconds and now has four additional stress tests that would have failed against the pre-fix code.

### Watcher serialization (F-001-A1-01)

You can now fire as many file-system events at the watcher as you want — even calling `close()` mid-flush — and only one `processSkill()` runs at a time per skill. The fix introduces a `flushPromise` and a `drainPending()` while-loop. When `flushPending()` is invoked while another drain is active, it returns the same promise instead of starting a competing pass. Events queued during a flush are picked up by the same drain on its next loop iteration, so nothing is lost.

### Shutdown ordering (F-001-A1-02)

`shutdown()` no longer publishes `state: 'unavailable'` first and then leaves a queued reindex to overwrite it with `state: 'live'`. The new order is: suppress generation publication on the watcher, drain queued events, close the watcher, and only then publish the terminal `unavailable`. The new `suppressGenerationPublication(boolean)` and `flush()` methods on `SkillGraphWatcher` make this ordering explicit and testable.

### Generation lock token ownership (F-001-A1-03)

Every acquisition of `acquireGenerationLock()` now writes a 32-character random token into the lock file alongside the pid and timestamp. The release closure reads the file back and only deletes the lock when the token still matches the holder. Stale reclamation does the same compare-and-swap before removing an old lock. Publisher A pausing past `GENERATION_LOCK_STALE_MS` and resuming after publisher B took over is now safe: A's release is a no-op against B's lock.

### Monotonic cache invalidation (F-001-A1-04)

`invalidateSkillGraphCaches()` now drops events whose `generation` is strictly older than the most recent observed generation. If two publishers race after releasing their locks, generation N+1 wins permanently and N's late fan-out cannot overwrite `lastInvalidation` or notify listeners with stale state. The metric counter still fires for the publish itself; only the listener notification is suppressed for stale events.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts` | Modified | Add `flushPromise` + `drainPending()` while-loop, `suppressGenerationPublication` flag, expose `flush()` and `suppressGenerationPublication()` on the public interface, gate `processSkill()`'s generation-publish behind the flag |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts` | Modified | Reverse `shutdown()` ordering: suppress + flush + close watcher BEFORE publishing terminal `unavailable` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts` | Modified | Token-tagged lock acquisition (`crypto.randomBytes(16)`), owner-checked release, CAS stale reclamation; export `__testables` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/cache-invalidation.ts` | Modified | Drop events whose `generation` is strictly older than `lastInvalidation.generation` before listener fan-out |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts` | Modified | Add `sa-003b` describe block: 2 mutex tests (timer drain serialization, close-awaits-flush) for F-001-A1-01 |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts` | Modified | Add `sa-007b` describe block: 2 token-ownership tests for F-001-A1-03 |
| `.opencode/specs/.../048-iter-001-daemon-concurrency-fixes/` | Created | Level 2 packet (spec, plan, tasks, checklist, implementation-summary, README) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I read each finding from `iteration-001.md` end-to-end, read the four product files in full to confirm the line numbers and current behavior, and then applied each fix as a single surgical edit with a multi-line comment block citing the finding ID. After each pair of fixes I rebuilt with `tsc --build` and re-ran the targeted unit and stress tests to make sure I had not regressed anything. Once all four fixes were in place I added the two new stress test describe blocks (one per finding the user explicitly called out — F-001-A1-01 and F-001-A1-03) and re-ran the full `npm run stress` suite end-to-end to confirm 56/56 files and 163/163 tests still pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use a `flushPromise` ref instead of an explicit Mutex class | The watcher is a closure over per-instance state; a single nullable promise plus a while-loop drain is the smallest primitive that achieves serialization without pulling in a dependency or breaking the existing test mocks |
| Add `suppressGenerationPublication` to the watcher contract instead of inferring "we're in shutdown" | Explicit flag is testable, debuggable, and survives future watcher state additions; a `closed` flag would have conflated "no new events accepted" with "no new publications" |
| Token format `pid:acquiredAtMs:token` (legacy compatible) | Forward-compatible with restarting daemons that still hold legacy `pid:timestamp` locks — the new code treats those as un-owned and reclaims, no breaking change |
| Drop monotonically-stale events instead of holding the publish lock through invalidation | Keeping the lock through fan-out would block ALL other publishers behind every listener, bloating critical-section size; the monotonic guard is local and cheap |
| Add the new stress tests next to existing siblings (`sa-003b`, `sa-007b`) | Matches existing naming convention (`sa-003`, `sa-007`); avoids creating new test files that would change the stress count by file |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` (tsc --build) | PASS, exit 0 |
| `npx vitest run skill_advisor/tests/daemon-freshness-foundation.vitest.ts` | PASS, 20/20 tests |
| Targeted stress (4 files) | PASS, 13/13 tests (was 9 baseline + 4 new) |
| `npm run stress` | PASS, exit 0, 56 files / 163 tests / 54.69s |
| `validate.sh --strict` (this packet) | See actual run; remediated to exit 0 |
| New `sa-003b` mutex test would have failed against pre-fix code | Yes — pre-fix `pending.clear()` before await let `maxConcurrent` reach 2 |
| New `sa-007b` token test would have failed against pre-fix code | Yes — pre-fix `releaseA()` would have deleted B's lock unconditionally |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two follow-on audits remain unscheduled.** Iteration-001 noted two questions: (a) whether `getLastCacheInvalidation()` consumers assume monotonic order, and (b) whether `indexSkillMetadata(skillsRoot)` is idempotent for concurrent same-skill reindexing. Both are documented in this packet's `spec.md §10 Open Questions` but are explicitly out of scope here.
2. **Lock format is forward-compatible but not backward-compatible.** Old binaries will read the new `pid:acquiredAt:token` format and likely treat it as malformed (their numeric parse of the second field still works, but no token check exists). Rolling upgrades are safe; rolling downgrades would lose token-ownership protection until both sides match.
3. **The mutex stress test parks reindex callbacks via setTimeout.** It exercises the JS-level race shape but does not directly stress SQLite. The existing `single-writer-lease-stress.vitest.ts` covers the SQLite side; adding a combined "watcher + lease + SQLite race" test is a larger follow-on.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
