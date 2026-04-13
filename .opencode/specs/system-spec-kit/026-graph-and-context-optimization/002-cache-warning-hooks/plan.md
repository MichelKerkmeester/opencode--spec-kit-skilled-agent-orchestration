---
title: "Implementation Plan: Cache-Warning Hook System [template:level_3/plan.md]"
description: "Research-aligned plan for packet 002: predecessor confirmation, replay isolation, bounded Stop-hook metadata patch, and idempotent verification."
trigger_phrases:
  - "cache warning plan"
  - "producer patch plan"
  - "replay isolation"
  - "claudest continuation order"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-cache-warning-hooks"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]

---
# Implementation Plan: Cache-Warning Hook System

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js >=18) |
| **Framework** | Claude Code hook protocol |
| **Storage** | Temp-backed per-session hook state |
| **Testing** | Isolated replay plus idempotency verification |

### Overview
This plan converts packet `002` from a warning-consumer rollout into a producer-first prerequisite packet. The active lane is now: document the FTS predecessor honestly, verify replay isolation, patch bounded metadata in `session-stop.ts` plus `hook-state.ts`, and prove the seam is safe to hand to later continuity packets [SOURCE: research.md §1; §2; spec.md §3].
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified and packet order recorded honestly
- [x] Replay isolation strategy defined before producer work begins

### Definition of Done
- [x] All acceptance criteria met
- [x] Replay and idempotency checks pass
- [x] Docs updated (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `research.md`)
- [x] Packet no longer claims active startup or direct warning consumer work
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm packet `002` stays scoped to the producer-first continuity lane.
- Confirm the FTS helper plus forced-degrade predecessor remains explicit before claiming implementation readiness.
- Re-read `research.md` before changing scope language, acceptance gates, or follow-on ordering.
- Re-run strict packet validation after any structural markdown edit.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-001 | Keep active work limited to `hook-state.ts`, `session-stop.ts`, and replay or test infrastructure | Prevents packet drift back into startup or direct warning consumers |
| AI-ORDER-001 | Treat the FTS helper plus forced-degrade lane as a hard predecessor | Keeps packet ordering aligned to canonical research |
| AI-TRUTH-001 | Keep `session_bootstrap()` and memory resume authoritative in all packet wording | Prevents cached-summary or hook metadata from being overstated |
| AI-HANDOFF-001 | Push reader, cached-summary, workflow-split, and token-contract work into explicit follow-on recommendations | Makes later implementation packets immediately actionable |

### Status Reporting Format

- Start state: predecessor status, packet scope, and which producer-boundary docs are being touched.
- Work state: which packet docs changed and whether validation or template issues remain.
- End state: strict validator result, remaining warnings or blockers, and follow-on packet recommendations outside `002`.

### Blocked Task Protocol

1. If packet prose starts to imply active startup or direct warning consumer work, stop and restore the producer-only boundary.
2. If strict validation fails, fix anchors, headers, and required protocol sections before adding more scope language.
3. If the required code change set expands beyond `hook-state.ts`, `session-stop.ts`, and replay or test infrastructure, stop and open a follow-on packet instead of overloading `002`.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded writer seam plus deferred consumer packets

### Key Components
- **`hook-state.ts`**: Atomic persisted session seam for additive producer metadata
- **`session-stop.ts`**: Transcript-aware Stop writer that owns bounded metadata persistence
- **Replay harness**: Side-effect-fenced verification path for writer behavior and double-replay idempotency
- **Deferred consumer lane**: Later analytics reader and cached-summary consumers outside this packet

### Data Flow
Stop-path transcript data is parsed in `session-stop.ts`, persisted through `hook-state.ts`, and validated through isolated replay before any later consumer packet is allowed to rely on the metadata seam. `session_bootstrap()` and memory resume remain authoritative throughout this packet [SOURCE: spec.md §4; §6].
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Record FTS helper plus forced-degrade tests as the hard predecessor
- [x] Re-scope packet docs away from the old six-phase warning rollout
- [x] Define replay isolation, autosave fencing, and out-of-bound write detection

### Phase 2: Core Implementation
- [x] Patch `hook-state.ts` with additive producer metadata only
- [x] Patch `session-stop.ts` to persist bounded transcript identity or reference plus cache-token carry-forward
- [x] Keep `claudeSessionId` primary and `speckitSessionId` nullable
- [x] Keep `session-prime.ts` and `.claude/settings.local.json` out of active implementation scope

### Phase 3: Verification
- [x] Replay Stop-path writer behavior in isolation
- [x] Replay the same transcript twice and prove idempotent results
- [x] Reconfirm startup authority remains with `session_bootstrap()` and memory resume
- [x] Update packet docs with any final evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `hook-state.ts` metadata merge and persistence behavior | Vitest |
| Integration | Stop-path replay and double-replay idempotency | Replay harness + Vitest |
| Manual | Packet wording and scope drift review | `rg`, strict validator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| FTS capability helper plus forced-degrade tests | Internal predecessor | Yellow | Packet `002` cannot claim implementation readiness ahead of this lane |
| Replay isolation harness | Internal verification dependency | Yellow | Producer patch cannot be trusted without it |
| Normalized analytics reader | Internal successor | Green | Does not block this packet, but this packet must hand off to it cleanly |
| SessionStart cached-summary consumer | Internal successor | Green | Must remain out of scope here to preserve authority boundaries |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation fails, replay side effects leak outside the sandbox, or the packet drifts back into startup or direct warning consumer scope
- **Procedure**: Revert producer-patch changes in `hook-state.ts` and `session-stop.ts`, retain any accurate replay-harness improvements, and preserve the packet re-scope docs so later work does not regress to the old warning-consumer framing
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
FTS helper + forced-degrade tests
                |
                v
Replay isolation / side-effect fencing
                |
                v
Bounded Stop metadata patch
                |
                v
Idempotent verification
                |
                v
Later packets: analytics reader -> cached-summary consumer -> workflow split -> token contracts
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Predecessor lane | None | Truthful FTS capability state | Replay and producer patch |
| Replay isolation | Predecessor order acknowledged | Trustworthy validation harness | Producer patch |
| Producer patch | Replay isolation | Bounded metadata seam | Later continuity packets |
| Idempotent verification | Producer patch | Safe handoff signal | Later continuity packets |
<!-- /ANCHOR:dependency-graph -->
