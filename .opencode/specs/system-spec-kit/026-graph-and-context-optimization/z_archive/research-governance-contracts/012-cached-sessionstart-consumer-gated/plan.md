---
title: "Implementation Plan: Cached SessionStart Consumer (Gated) [template:level_3/plan.md]"
description: "Implement the guarded cached-summary consumer after confirming packet 002's producer contract, then prove the additive path against a frozen resume corpus."
trigger_phrases:
  - "012-cached-sessionstart-consumer-gated"
  - "implementation"
  - "plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Cached SessionStart Consumer (Gated)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown packet docs |
| **Framework** | system-spec-kit MCP server continuity and startup handlers |
| **Storage** | Persisted Stop-summary artifacts and existing continuity payloads |
| **Testing** | Vitest, frozen resume corpus checks, packet validation |

### Overview
Implement the guarded cached-summary consumer after confirming packet `002`'s producer contract, then prove the additive path against a frozen resume corpus.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research conclusions for `R2` and `R3` are stable.
- [x] Packet `002` is named as the producer-side predecessor.
- [x] Scope is limited to additive continuity and optional startup hints.

### Definition of Done
- [x] Fidelity and freshness gates are documented and implemented in the named owner surfaces.
- [x] Frozen resume corpus demonstrates equal-or-better pass rate versus live reconstruction.
- [x] Packet docs are synchronized and placeholder-free.
<!-- /ANCHOR:quality-gates -->

---




### AI Execution Protocol

### Pre-Task Checklist

- Re-read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/recommendations.md:15-33` and packet `002` before implementation starts.
- Confirm the producer artifact contains the fields this consumer expects.
- Re-confirm that `session_bootstrap()` and memory resume remain authoritative.
- Re-run packet validation after doc edits and before any future closeout claim.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-001 | Keep work inside `session-bootstrap.ts`, `session-resume.ts`, `session-prime.ts`, and packet-local tests | Prevents scope drift into producer or analytics surfaces |
| AI-AUTH-001 | Treat cached summaries as optional additive inputs only | Preserves bootstrap and resume authority |
| AI-GATE-001 | Require fidelity and freshness checks before any cached injection | Prevents lossy or stale reuse |
| AI-VERIFY-001 | Use frozen-corpus comparison against live reconstruction before readiness | Keeps fast-path claims tied to correctness evidence |

### Status Reporting Format

- Start state: producer dependency status, active owner surfaces, and gating assumptions
- Work state: current handler or corpus workstream, any failed gate reasons, and doc updates underway
- End state: focused verification result, packet validation result, and successor handoff notes

### Blocked Task Protocol

1. Stop immediately if packet `002` no longer provides the producer fields the consumer expects.
2. Do not weaken the gates to unblock work; record the blocker and keep the packet draft.
3. Resume only after the producer contract or packet docs are updated to reflect the real dependency state.

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Authoritative live continuity with a guarded additive cached consumer

### Key Components
- Producer-side Stop-summary artifact and metadata from packet `002`
- Guard logic in `session-bootstrap.ts`
- Additive continuity hook in `session-resume.ts`
- Optional startup-hint surface in `session-prime.ts`
- Frozen resume corpus in packet-local test infrastructure

### Data Flow
Packet `002` writes the bounded Stop-summary artifact first. This packet reads that artifact, runs fidelity and freshness gates, and then either injects the cached summary additively into `resume` and `compact` continuity plus optional startup hints or fails closed to live reconstruction only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read `R2`, `R3`, and packet `002` to confirm the producer contract.
- [x] Confirm the first consumer owner surfaces in `session-bootstrap.ts`, `session-resume.ts`, and `session-prime.ts`.
- [x] Define the fidelity and freshness gate inputs before touching runtime code.

### Phase 2: Core Implementation
- [x] Implement the guarded consumer in `session-bootstrap.ts`.
- [x] Route valid cached summaries additively through `session-resume.ts`.
- [x] Surface optional startup hints in `session-prime.ts` only when a valid cached summary exists.
- [x] Keep authority-boundary wording synchronized in packet-local docs.

### Phase 3: Verification
- [x] Build the frozen resume corpus and baseline comparison.
- [x] Run focused tests or corpus checks for equal-or-better pass rate.
- [x] Run `validate.sh --strict` on the packet folder.
- [x] Record successor handoff notes for packet `013`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard logic unit tests | Fidelity, freshness, invalidation, and fail-closed routing | Vitest |
| Frozen resume corpus | Cached consumer versus live reconstruction | Packet-local corpus under `scripts/tests/` |
| Packet validation | Spec docs and checklist alignment | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-implement-cache-warning-hooks` | Internal predecessor | Yellow | Consumer packet cannot activate without the producer metadata contract |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/recommendations.md` `R2` and `R3` | Research | Green | Packet would lose its scope and acceptance anchor |
| `013-warm-start-bundle-conditional-validation` | Internal successor | Green | Successor warm-start validation remains blocked until this guarded consumer is proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The consumer bypasses authoritative live reconstruction, weakens a gate, or regresses the frozen resume corpus relative to baseline.
- **Procedure**: Revert the additive consumer path, keep the producer contract untouched, and restore live-only continuity behavior while packet docs remain draft.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Producer contract review -> Guarded consumer implementation -> Frozen corpus verification
Packet 002 -> packet 012 -> packet 013
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Research plus packet `002` review | Core consumer work |
| Core work | Setup | Verification |
| Verification | Core work | Packet activation and successor packet `013` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 0.5-1 day |
| Core Implementation | Medium | 1-2 days |
| Verification | Medium | 1 day |
| **Total** | | **2.5-4 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Producer metadata from packet `002` verified
- [x] Fidelity and freshness gates defined
- [x] Frozen resume corpus prepared

### Rollback Procedure
1. Revert packet-local consumer changes in the named handler surfaces.
2. Re-run live reconstruction checks to confirm authoritative behavior is restored.
3. Update packet docs if gate assumptions or producer fields changed.

### Data Reversal
- **Has data migrations?** No by default for this planning packet.
- **Reversal procedure**: Remove additive consumer references and keep the persisted producer artifact unread by startup paths until the seam is ready again.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Research R2/R3 -> packet 002 producer contract -> 012-cached-sessionstart-consumer-gated -> 013 warm-start bundle validation
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Producer artifact contract | Research plus packet `002` | Trustworthy cache input | Consumer implementation |
| Guarded consumer | Producer artifact contract | Additive continuity behavior | Corpus verification |
| Corpus verification | Guarded consumer | Readiness evidence | Successor packet `013` |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Confirm the producer contract and exact gate inputs.
2. Implement additive guarded consumption in the named handler surfaces.
3. Prove equal-or-better pass rate on the frozen resume corpus.
4. Record successor handoff and validation status.

**Total Critical Path**: 4 sequential steps

**Parallel Opportunities**:
- Corpus fixtures can be drafted alongside packet-local doc synchronization.
- Startup-hint wording can be reviewed while resume-path tests are being prepared.
<!-- /ANCHOR:critical-path -->
