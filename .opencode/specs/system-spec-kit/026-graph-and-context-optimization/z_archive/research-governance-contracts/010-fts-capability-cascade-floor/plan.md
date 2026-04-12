---
title: "Implementation Plan: FTS Capability Cascade Floor [template:level_3/plan.md]"
description: "Harden FTS capability detection first, surface lexical-path and fallback truth second, then hand a stable predecessor contract to phase 002."
trigger_phrases:
  - "010-fts-capability-cascade-floor"
  - "implementation"
  - "plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: FTS Capability Cascade Floor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, SQLite, Markdown packet docs |
| **Framework** | system-spec-kit MCP server and packet workflow |
| **Storage** | `better-sqlite3`, `memory_index`, `memory_fts`, runtime response envelopes |
| **Testing** | Vitest, packet validation, forced-degrade matrix checks |

### Overview
Harden FTS capability detection first, surface lexical-path and fallback truth second, then hand a stable predecessor contract to phase `002-implement-cache-warning-hooks`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research conclusions and the approved train are stable.
- [x] Packet scope is bounded to FTS capability-cascade hardening.
- [x] Phase `002-implement-cache-warning-hooks` is named explicitly as the blocked successor.

### Definition of Done
- [x] Packet docs are synchronized and truthful about shipped versus planned behavior.
- [x] Forced-degrade coverage exists for all four named failure cases.
- [x] Packet validation passes cleanly.
<!-- /ANCHOR:quality-gates -->

---




### AI Execution Protocol

### Pre-Task Checklist

- Re-read R7 and confirm the packet still stays below broader search-feature work.
- Confirm the first implementation touchpoints still live in `memory-search.ts`, `sqlite-fts.ts`, and the focused test files.
- Confirm the successor dependency on phase `002` is still accurate before coding begins.
- Re-run strict packet validation after doc edits and before claiming completion.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-001 | Keep work inside the FTS capability-cascade owner surfaces named in the spec | Prevents drift into broader search work |
| AI-TRUTH-001 | Use the same lexical-path and fallback vocabulary in runtime, tests, and docs | Prevents contradictory capability claims |
| AI-DEP-001 | Treat this packet as the hard predecessor for phase `002` | The successor should not redefine fallback truth later |
| AI-VERIFY-001 | Require forced-degrade checks plus strict validation before closeout | Keeps the runtime contract durable and auditable |

### Status Reporting Format

- Start state: successor dependency, current lexical capability surface, and first owner files to touch
- Work state: active degrade case, metadata surface being added, and any blocked runtime assumptions
- End state: forced-degrade verification result, strict validator result, and successor handoff notes

### Blocked Task Protocol

1. Stop immediately if the runtime owner surface or research seam no longer matches the assumptions in the spec.
2. Do not widen scope to solve the blockage; record the blocker and keep the packet draft.
3. Resume only after the dependency or contradiction is resolved and packet docs are updated accordingly.

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-first runtime hardening packet

### Key Components
- `memory_search` response and trace surface
- SQLite FTS capability helper and degrade classifier
- Focused forced-degrade tests and packet-local docs

### Data Flow
The lexical helper detects the available lane, classifies degrade cases truthfully, and hands that status to `memory_search`. The handler surfaces the chosen lexical path and fallback state while preserving the existing retrieval contract for degraded operation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read the canonical research conclusions for R7.
- [x] Verify the phase `002` dependency and packet boundary.
- [x] Confirm the runtime and test owner surfaces to modify.

### Phase 2: Core Implementation
- [x] Implement runtime FTS5 capability detection and degrade classification.
- [x] Surface lexical-path and fallback metadata on `memory_search` responses and logs.
- [x] Update packet-local and runtime docs with the truthful lane vocabulary.

### Phase 3: Verification
- [x] Run forced-degrade tests for compile-probe miss, missing table, `no such module: fts5`, and BM25 runtime failure.
- [x] Run `validate.sh --strict` on the packet folder.
- [x] Record successor-packet handoff notes for phase `002`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Focused unit or contract | FTS capability probing, degrade classification, response metadata | Vitest |
| Forced-degrade scenarios | Compile-probe miss, missing table, `no such module: fts5`, BM25 runtime failure | Packet-local fixtures or targeted mocks |
| Packet validation | Spec docs and checklist alignment | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Canonical research packet | Internal | Green | Packet scope would lose its evidence base |
| Existing lexical search helpers | Internal | Green | The packet must harden current owners rather than invent new ones |
| Phase `002-implement-cache-warning-hooks` handoff | Internal | Yellow | Successor work must pause until this runtime contract is stable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The packet changes retrieval semantics, mislabels a degrade case, or introduces an overstated lexical lane claim.
- **Procedure**: Revert the runtime metadata and degrade-classification changes, re-run focused tests, and keep phase `002` blocked until the truthful contract is restored.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup -> Core implementation -> Verification
Research root -> 010-fts-capability-cascade-floor -> 002-implement-cache-warning-hooks
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Research root and current lexical helper audit | Core work |
| Core work | Setup | Verification and phase `002` handoff |
| Verification | Core work | Packet activation and successor work |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 0.5-1 day |
| Core Implementation | Medium | 1-3 days |
| Verification | Medium | 0.5-1 day |
| **Total** | | **2-5 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Research citation re-read from `spec.md`
- [x] Scope boundary re-read from `spec.md`
- [x] Forced-degrade checks prepared for all four named cases

### Rollback Procedure
1. Revert packet-local runtime changes.
2. Re-run forced-degrade tests to confirm the old behavior is restored.
3. Update packet docs if fallback labels or successor assumptions changed.

### Data Reversal
- **Has data migrations?** No by default for this planning packet.
- **Reversal procedure**: Revert packet-local schema or contract changes if implementation later adds them.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Research root -> 010-fts-capability-cascade-floor -> 002-implement-cache-warning-hooks
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet contract | Research root | Stable lexical-path and fallback contract | Runtime implementation |
| Runtime changes | Packet contract | Truthful capability and response metadata | Verification |
| Verification | Runtime changes | Activation evidence | Phase `002` work |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Lock R7 scope and successor dependency.
2. Implement truthful capability detection and response metadata.
3. Prove the four-case forced-degrade matrix with focused verification.

**Total Critical Path**: 3 sequential steps

**Parallel Opportunities**:
- Runtime doc synchronization can run alongside test scaffolding.
- Successor handoff notes can be drafted while forced-degrade cases are being implemented.
<!-- /ANCHOR:critical-path -->
