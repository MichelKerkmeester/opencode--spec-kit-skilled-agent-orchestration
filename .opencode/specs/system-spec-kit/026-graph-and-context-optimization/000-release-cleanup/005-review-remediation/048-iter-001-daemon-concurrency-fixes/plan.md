---
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: Iteration-001 Daemon Concurrency Fixes [template:level_2/plan.md]"
description: "Localized fixes to watcher / lifecycle / generation / cache-invalidation paths surfaced by packet 046 deep research. Token-tagged locks, serialized watcher drain, ordered shutdown, monotonic invalidation."
trigger_phrases:
  - "implementation plan"
  - "daemon concurrency"
  - "F-001-A1"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/048-iter-001-daemon-concurrency-fixes"
    last_updated_at: "2026-05-01T04:15:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Plan finalized post-implementation"
    next_safe_action: "Validate strict + commit"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/cache-invalidation.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "iter-001-daemon-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Iteration-001 Daemon Concurrency Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node 20, NodeNext ESM) |
| **Framework** | None (skill-advisor MCP server, vitest) |
| **Storage** | SQLite (`better-sqlite3`) for lease/quarantine; JSON files for generation metadata |
| **Testing** | Vitest unit + stress configs |

### Overview
Four localized fixes against `mcp_server/skill_advisor/lib/{daemon,freshness}/`. The watcher gains a serialized drain primitive and a generation-publish suppression flag; lifecycle reverses its shutdown ordering to use those new primitives; the generation lock gains a random per-acquisition token; and cache invalidation early-returns out-of-order events. Two new stress test describe blocks (`sa-003b`, `sa-007b`) reproduce the pre-fix bug shapes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings enumerated by packet 046 iteration-001 (4 findings: 3 P1 + 1 P2)
- [x] Source-of-truth files read in full and current line numbers verified
- [x] Templates copied from `.opencode/skill/system-spec-kit/templates/level_2/`

### Definition of Done
- [x] All 4 findings addressed with comments citing the finding ID in product code
- [x] 2 new stress test describe blocks added (each with 2+ test cases)
- [x] `npm run build` exits 0
- [x] Targeted unit tests (`daemon-freshness-foundation.vitest.ts`) pass: 20/20
- [x] Full stress suite passes: 56 files / 163 tests / exit 0
- [x] `validate.sh --strict` for this packet exits 0 (or 1 with non-blocking warnings only)
- [x] Commit pushed to `origin main` referencing all 4 finding IDs
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Concurrent-state-correctness pattern: serialize what must be serialized, tag what must be owner-checked, and order shutdown actions so that terminal state is always observable.

### Key Components
- **Watcher Drain (`watcher.ts`)**: `flushPromise` + `drainPending()` while-loop replaces the previous fire-and-forget `flushPending()`; only one drain runs at a time.
- **Watcher Suppression (`watcher.ts`)**: `suppressGenerationPublication` flag wraps the call to `publishSkillGraphGeneration` inside `processSkill`; lifecycle uses this during shutdown so queued reindexes do not overwrite the terminal state.
- **Lifecycle Ordering (`lifecycle.ts`)**: shutdown now suppresses → flushes → closes the watcher BEFORE publishing the final `unavailable` generation.
- **Token Lock (`generation.ts`)**: each acquisition writes `${pid}:${acquiredAtMs}:${token}` (32-char hex). Release reads back and only deletes on token match. Stale reclamation re-reads the token (compare-and-swap) before removal.
- **Monotonic Invalidation (`cache-invalidation.ts`)**: events whose `generation` is strictly older than `lastInvalidation.generation` are dropped before listener notification.

### Data Flow
1. **Watcher event** → debounce timer → `flushPending()` (serialized via `flushPromise`) → `drainPending()` while-loop → `processSkill()` per skill → conditionally `publishSkillGraphGeneration({state: 'live'})` if not suppressed.
2. **Shutdown** → `suppressGenerationPublication(true)` → `flush()` → `watcher.close()` → `publishSkillGraphGeneration({state: 'unavailable'})` → `lease.close()`.
3. **Generation publish** → `acquireGenerationLock` (token-tagged) → write JSON atomic → `releaseLock` (token-checked) → `invalidateSkillGraphCaches` (monotonic guard) → fan out.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read iteration-001 findings table (full line-cited descriptions)
- [x] Read all 4 product files end-to-end
- [x] Read existing unit + stress test files for matching style

### Phase 2: Core Implementation
- [x] F-001-A1-01: serialize watcher flush via `flushPromise` + `drainPending` while-loop; expose `flush()` and `suppressGenerationPublication()`
- [x] F-001-A1-02: lifecycle.ts shutdown order — suppress + flush + close watcher BEFORE final `unavailable` publish
- [x] F-001-A1-03: token-tagged generation lock; owner-checked release; CAS stale reclamation; export `__testables`
- [x] F-001-A1-04: monotonic guard in `invalidateSkillGraphCaches`

### Phase 3: Verification
- [x] Add `sa-003b` describe block to `daemon-lifecycle-stress.vitest.ts` (mutex)
- [x] Add `sa-007b` describe block to `generation-cache-invalidation-stress.vitest.ts` (token)
- [x] `npm run build` clean
- [x] `npx vitest run skill_advisor/tests/daemon-freshness-foundation.vitest.ts` → 20/20
- [x] Targeted stress (4 files) → 13/13 (was 9/9 baseline + 4 new)
- [x] `npm run stress` → 56 files / 163 tests / exit 0
- [x] `validate.sh --strict` → exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | watcher / lifecycle / generation / cache-invalidation | vitest (`vitest.config.ts`) |
| Stress | end-to-end daemon lifecycle, lock contention, cache invalidation order, mutex | vitest (`vitest.stress.config.ts`) |
| Manual | None — all behaviors covered by automated tests | n/a |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node:crypto.randomBytes` | Internal | Green | Required for token generation; standard Node API |
| `better-sqlite3` (lease DB) | External | Green | Unchanged; not modified by this packet |
| Packet 046 deep research | External | Read-only | This packet only reads `iteration-001.md`; never writes packet 046 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Stress suite regressions, daemon hang during shutdown in production, or generation lock starvation observed in real workloads.
- **Procedure**: Single `git revert` of the commit reverses all 4 fixes atomically; product code is fully self-contained in 4 files. Tests revert automatically with the same commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Read findings + files) ──► Phase 2 (Apply 4 fixes) ──► Phase 3 (Tests + Validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 min (read findings + 4 product files + 3 test files) |
| Core Implementation | Medium | 45 min (4 surgical edits + 2 new test describe blocks) |
| Verification | Low | 15 min (build + targeted tests + full stress + validate) |
| **Total** | | **~75 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Existing 20 unit tests pass before AND after (regression baseline)
- [x] Full 56-file stress suite passes before AND after
- [x] `npm run build` clean (no compiler errors introduced)

### Rollback Procedure
1. `git revert <commit-sha>` on `main` — reverses all 4 product file edits and both new stress test blocks atomically
2. `cd .opencode/skill/system-spec-kit/mcp_server && npm run build && npm run stress` — confirm pre-fix baseline restored
3. No data reversal required — no database migrations or persisted state changes (lock file format change is forward-compatible: new code accepts legacy `pid:ts` locks as un-owned and reclaims them)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — only the `.lock` sidecar file format changed, and the new code already handles the legacy format gracefully
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
