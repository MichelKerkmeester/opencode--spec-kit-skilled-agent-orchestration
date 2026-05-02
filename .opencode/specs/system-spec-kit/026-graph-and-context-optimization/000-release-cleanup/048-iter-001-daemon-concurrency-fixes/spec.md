---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: Iteration-001 Daemon Concurrency Fixes [template:level_2/spec.md]"
description: "Skill-advisor daemon races and ordering bugs found by packet 046 deep research iteration-001 leave concurrent reindex flushes, post-shutdown 'live' state, lock-token theft, and out-of-order cache invalidation. This packet hardens those four code paths."
trigger_phrases:
  - "daemon concurrency"
  - "watcher mutex"
  - "generation lock"
  - "cache invalidation order"
  - "F-001-A1-01"
  - "F-001-A1-02"
  - "F-001-A1-03"
  - "F-001-A1-04"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/048-iter-001-daemon-concurrency-fixes"
    last_updated_at: "2026-05-01T04:15:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Applied 4 fixes from packet 046 iteration-001"
    next_safe_action: "Validate strict + commit"
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
# Feature Specification: Iteration-001 Daemon Concurrency Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-30 |
| **Branch** | `main` (no feature branch; `--skip-branch` per repo policy) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 046 deep research iteration-001 identified four concurrency defects in the skill-advisor daemon and freshness layer. Three are P1 (watcher flush reentrancy, lifecycle/shutdown ordering, generation lock-token theft) and one is P2 (out-of-order cache invalidation). Each defect lets the daemon's persisted state diverge from reality under realistic timer + shutdown + GC-pause interleavings.

### Purpose
Apply localized fixes to the four code paths so that (a) the watcher serializes reindex flushes, (b) shutdown publishes the terminal `unavailable` generation last, (c) the generation lock honors token-based ownership during stale reclamation, and (d) cache invalidation listeners observe monotonic generation order.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix F-001-A1-01: serialize watcher flush via `flushPromise` + drain loop; expose `flush()` and `suppressGenerationPublication()` on the watcher contract
- Fix F-001-A1-02: lifecycle `shutdown()` stops the watcher (suppress + drain + close) BEFORE publishing terminal `unavailable`
- Fix F-001-A1-03: tag every generation lock acquisition with a random token; release only deletes when token matches; stale reclamation uses compare-and-swap on the persisted token
- Fix F-001-A1-04: `invalidateSkillGraphCaches()` ignores events whose `generation` is older than the most recent observed generation
- New stress tests: `sa-003b` (watcher mutex / drain) and `sa-007b` (lock token ownership)
- Existing unit + stress suites continue to pass (20 unit / 56 files / 163+ tests)

### Out of Scope
- Refactoring the watcher's debounce or storm-circuit logic — both unchanged
- Changing the generation file format on disk — only the `.lock` sidecar format gains a token field
- Auditing all `getLastCacheInvalidation()` consumers for monotonicity assumptions — flagged as follow-on by iteration-001
- Auditing `indexSkillMetadata` for same-skill concurrency tolerance — flagged as follow-on
- Modifying packet 046 or any in-flight deep research state

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts` | Modify | Add `flushPromise` + drain loop, `suppress` flag, `flush()`/`suppressGenerationPublication()` on the public interface |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts` | Modify | Reverse shutdown ordering: watcher.suppress + flush + close BEFORE final `unavailable` publication |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts` | Modify | Token-tagged lock acquisition, owner-checked release, CAS stale reclamation; expose `__testables` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/cache-invalidation.ts` | Modify | Drop stale events whose `generation` is older than `lastInvalidation.generation` |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts` | Modify | Add `sa-003b` describe block: 2 mutex tests for F-001-A1-01 |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts` | Modify | Add `sa-007b` describe block: 2 token-ownership tests for F-001-A1-03 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Watcher `processSkill()` for the same skill never runs concurrently across timer + close interleavings | New stress test `sa-003b` asserts `maxConcurrent === 1` across parked-reindex scenarios |
| REQ-002 | Daemon `shutdown()` leaves the on-disk generation in `state: 'unavailable'` regardless of queued watcher events | Existing test `daemon-freshness-foundation.vitest.ts` "publishes unavailable before graceful shutdown" still passes |
| REQ-003 | Generation lock release is a no-op when the on-disk token no longer matches the holder | New stress test `sa-007b` asserts publisher A's release does not delete publisher B's lock after stale reclamation |
| REQ-004 | Cache invalidation listeners never observe a `generation` that is strictly older than `lastInvalidation.generation` | `invalidateSkillGraphCaches()` early-returns the event without notifying listeners when `published.generation < lastInvalidation.generation` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Existing 20 unit tests in `daemon-freshness-foundation.vitest.ts` continue to pass | `npx vitest run skill_advisor/tests/daemon-freshness-foundation.vitest.ts` exit 0, 20/20 |
| REQ-006 | Full stress suite stays at 56 files / 159+ tests, all passing | `npm run stress` exits 0, "56 passed (56)" + "163 passed (163)" with 4 new tests added |
| REQ-007 | TypeScript build remains clean | `npm run build` exits 0 with no compiler errors |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 findings from packet 046 iteration-001 (`F-001-A1-01..04`) are fixed in product code with comments citing the finding ID
- **SC-002**: Two new stress test describe blocks (`sa-003b`, `sa-007b`) exercise the fixed behaviors and would have failed against the pre-fix code
- **SC-003**: `validate.sh --strict` for this packet exits 0 (no errors); `npm run stress` exits 0 with at least 56 files / 159 tests
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reordering shutdown could leak the watcher if drain throws | Med | Wrap `watcher.flush()` in try/catch so shutdown always reaches `watcher.close()` and the terminal publish |
| Risk | Token format change to `.lock` could trip a daemon mid-restart | Low | Acquire path treats malformed/legacy `pid:timestamp` (no token) as un-owned and reclaims; release path keys on the random token, so legacy locks never collide |
| Risk | Monotonic invalidation drops a legitimate event in test isolation | Low | Tests reset `lastInvalidation = null` via `clearCacheInvalidationListeners()` in `beforeEach`/`afterEach`; verified all 20 unit tests still pass |
| Dependency | Packet 046 deep research running in parallel | None | This packet does not modify packet 046; only reads `iteration-001.md` for findings |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Stress suite total runtime stays under 75 seconds on a baseline laptop (current: ~55 seconds)
- **NFR-P02**: New mutex stress test parks each reindex for ≤25 ms via setTimeout; total test time < 2 seconds

### Reliability
- **NFR-R01**: Generation lock token comparison is a single read + string equality — no network or DB calls in hot path
- **NFR-R02**: Watcher drain uses `while (pending.size > 0)` so events queued during a flush always get processed, no event loss
- **NFR-R03**: Lifecycle shutdown is idempotent (`if (shuttingDown) return`) — multiple SIGTERM still publish exactly one terminal `unavailable`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:acceptance-scenarios -->
## L2: ACCEPTANCE SCENARIOS

### AS-001: F-001-A1-01 — Watcher serializes flush across concurrent timer firings

- **Given** the watcher is mid-flight inside `processSkill()` for skill `alpha`
- **When** a second debounce timer fires AND additional change events for `alpha` are enqueued
- **Then** `processSkill()` for `alpha` is NEVER running concurrently with itself (`maxConcurrent === 1`)
- **And** queued events are processed by the same serialized drain on its next loop iteration
- **Verified by**: `daemon-lifecycle-stress.vitest.ts` describe block `sa-003b` test "serializes processSkill() across concurrent timer firings"

### AS-002: F-001-A1-02 — Shutdown leaves terminal `unavailable` even with queued events

- **Given** a daemon with pending watcher events queued and not yet drained
- **When** `daemon.shutdown('TEST_SHUTDOWN')` is called
- **Then** the on-disk generation file ends in `state: 'unavailable'` with `reason: 'TEST_SHUTDOWN'`
- **And** no queued reindex publishes `state: 'live'` after the terminal write
- **Verified by**: `daemon-freshness-foundation.vitest.ts` describe block "daemon lifecycle" test "publishes unavailable before graceful shutdown" (still passes with reversed ordering)

### AS-003: F-001-A1-03 — Stale-reclaimed lock survives the previous holder's release

- **Given** publisher A holds the generation lock with token T_A
- **And** A's process pauses past `GENERATION_LOCK_STALE_MS`
- **When** publisher B observes the lock as stale and reclaims it (writes token T_B)
- **And** publisher A then resumes and runs its release closure
- **Then** the lock file still exists and contains token T_B
- **And** B's lock is preserved until B's own release runs
- **Verified by**: `generation-cache-invalidation-stress.vitest.ts` describe block `sa-007b` test "publisher A's release does NOT delete publisher B's lock after stale reclamation"

### AS-004: F-001-A1-04 — Cache invalidation drops stale generation events

- **Given** `lastInvalidation.generation === N+1` (newer publisher already finished fan-out)
- **When** `invalidateSkillGraphCaches({generation: N})` is called for an older publisher whose listener-pass landed second
- **Then** `lastInvalidation` remains at generation N+1 (NOT overwritten with N)
- **And** registered listeners are NOT notified with the older event
- **Verified by**: existing test `daemon-freshness-foundation.vitest.ts` "increments generation monotonically across sequential locked publications" still passes; the monotonic guard does not interfere with normal sequential publishes
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Watcher Serialization (F-001-A1-01)
- Debounce timer fires while a flush is in-flight: second timer call into `flushPending()` short-circuits on the existing `flushPromise` and returns the same promise
- `close()` called mid-flush: `closed = true` prevents new enqueues, but the in-flight drain finishes; `close()` awaits the same `flushPromise`
- Events queued strictly during the flush body: drain loop's `while (pending.size > 0)` picks them up on the same serialized chain — no second concurrent processSkill()

### Lifecycle Shutdown (F-001-A1-02)
- Pending events at shutdown: `suppressGenerationPublication(true)` is set first, so even if the drain runs queued reindexes, none of them call `publishSkillGraphGeneration` with `state: 'live'`
- Drain throws during shutdown: caught by `try/catch`, shutdown proceeds to `watcher.close()` and final terminal publish — no leaked watcher
- `lease.acquired === false`: terminal publish is skipped (matches original behavior); shutdown still tears down watcher

### Generation Lock (F-001-A1-03)
- Legacy lock format (`pid:timestamp` with no token): treated as un-owned; reclaimed eagerly on first encounter
- Lock file vanishes between read and rmSync during stale reclamation: caught by inner try/catch, loop continues
- Two reclaimers race to clear the same stale lock: each re-reads the token before deletion; if the second reader sees a different token, it leaves the lock alone

### Cache Invalidation (F-001-A1-04)
- `lastInvalidation === null` (first event after reset): `isStale` is false, event published normally
- Out-of-order publishers with same generation: equality is not "older than"; same-generation events still notify listeners
- Listener throws on a stale-skipped event: never reached because we return before iterating listeners
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 4 product files + 2 test files; ~120 LOC product change, ~250 LOC test change |
| Risk | 12/25 | Concurrency fixes — high blast radius if wrong, but tightly bounded by existing test coverage |
| Research | 4/20 | Findings already enumerated by packet 046 iteration-001; no novel investigation required |
| **Total** | **30/70** | **Level 2** (verification-focused) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should `getLastCacheInvalidation()` consumers be audited for monotonicity assumptions in a follow-on packet? (Flagged in iteration-001's "Questions Remaining")
- Should `indexSkillMetadata(skillsRoot)` be audited for same-skill concurrent reindex tolerance? (Flagged in iteration-001's "Questions Remaining")
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
