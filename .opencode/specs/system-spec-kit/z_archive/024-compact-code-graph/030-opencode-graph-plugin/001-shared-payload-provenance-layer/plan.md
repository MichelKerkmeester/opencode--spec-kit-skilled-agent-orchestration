---
title: "Implementati [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/001-shared-payload-provenance-layer/plan]"
description: "This phase delivered the common payload and provenance contract that later runtime phases consume. The Level 3 plan records that delivery and the validation rules that keep successor phases thin and consistent."
trigger_phrases:
  - "shared payload and provenance layer plan"
  - "packet 030"
  - "level 3"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/001-shared-payload-provenance-layer"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Shared Payload and Provenance Layer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime helpers, Vitest, Markdown |
| **Framework** | Packet 024 compact context lifecycle handlers and hooks |
| **Storage** | Existing packet-024 runtime outputs plus packet-local docs |
| **Testing** | Typecheck plus targeted session/bootstrap/startup/compact tests |

### Overview
This phase delivered the common payload and provenance contract that later runtime phases consume. The Level 3 plan records that delivery and the validation rules that keep successor phases thin and consistent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope is documented and bounded
- [x] Success criteria are measurable
- [x] Dependencies are identified

### Definition of Done
- [x] Runtime claims remain unchanged in meaning
- [x] Level 3 docs are clean and validator-friendly
- [x] This phase closeout is evidence-backed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared runtime contract layer

### Key Components
- **Payload envelope**: defines startup, message, and compaction variants
- **Provenance model**: captures origin and trust state separately
- **Selection rules**: define how candidate context is chosen before merge

### Data Flow
Memory, graph, and semantic-seed inputs flow into a shared contract first. Only after that do later phases translate the result into runtime-specific transport or graph-ops behavior.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract Inventory
- [x] Identify current packet-024 producers of startup, resume, graph, and memory context
- [x] Define the shared envelope variants

### Phase 2: Provenance and Trust States
- [x] Define provenance fields
- [x] Define trust-state transitions
- [x] Define import/rebuild semantics

### Phase 3: Guardrails and Handoff
- [x] Define pre-merge selection expectations
- [x] Define anti-feedback sanitization expectations
- [x] Document the handoff contract for later phases
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type Safety | Shared payload helpers and handler wiring compile cleanly | `npm run typecheck` |
| Runtime Tests | Session resume, bootstrap, startup brief, structural contract, compact merger, and session-start recovery remain green | `npx vitest run tests/session-resume.vitest.ts tests/session-bootstrap.vitest.ts tests/startup-brief.vitest.ts tests/structural-contract.vitest.ts tests/compact-merger.vitest.ts tests/hook-session-start.vitest.ts` |
<!-- /ANCHOR:testing -->

---

### AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm scope stays inside shared payload/provenance producers.
- Confirm runtime claims come from the existing Phase 1 implementation summary.
- Confirm all Level 3 docs stay truthful and evidence-backed.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `DOC-SCOPE` | Keep edits inside the packet or phase folder. |
| `TRUTH-FIRST` | Preserve the existing runtime claims from implementation evidence. |
| `VALIDATE-LAST` | Use strict recursive validation as the final closeout gate. |

### Status Reporting Format
- `in-progress`: note which doc set is being repaired or validated.
- `blocked`: note the validator error or missing evidence plus the next action.
- `completed`: note changed files and the final validation result.

### Blocked Task Protocol
- If validation fails, keep the phase open and repair the documented blocker before claiming completion.
- If a checklist or ADR entry cannot be supported by evidence, defer it explicitly rather than fabricating completion.

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent packet docs | Internal | Green | Phase has no coordination frame without them |
| `../research/research.md` | Internal | Green | Contract may drift from the packet synthesis |
| Existing lifecycle producers | Internal | Green | Shared contract would become disconnected from the runtime |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Documentation drifts from the shipped runtime scope or validation fails.
- **Procedure**: Trim the phase back to shared definitions and move transport or graph-specific concerns to successor phases.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Shared Contract Inventory ──► Provenance Model ──► Guardrails and Handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract Inventory | None | Provenance Model |
| Provenance Model | Contract Inventory | Guardrails and Handoff |
| Guardrails and Handoff | Provenance Model | Phase 2 adapter work |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract Inventory | Medium | Completed in runtime code |
| Provenance and Trust States | Medium | Completed in runtime code |
| Guardrails and Handoff | Medium | Completed in runtime code |
| **Total** |  | **Phase 1 complete** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline evidence identified
- [x] Validation gate selected
- [x] Scope boundaries documented

### Rollback Procedure
1. Restore the affected docs from the packet-local backup or version control baseline.
2. Reapply only the bounded phase wording and validator-required sections.
3. Rerun validation.
4. Confirm the final packet state before removing any temporary baselines.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Restore the affected docs and rerun validation.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Lifecycle Producers ──► Shared Payload Layer ──► Phase 2 Transport
Compaction Hooks ────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Lifecycle Producers | None | Shared payload envelope | Phase 2 transport |
| Compaction Hooks | Shared payload envelope | Cached payload provenance and anti-feedback output | Phase 2 transport |
| Phase 2 Transport | Shared payload layer | OpenCode hook delivery blocks | Phase 3 graph ops |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Define the shared contract vocabulary - completed - CRITICAL
2. Wire lifecycle producers to the shared contract - completed - CRITICAL
3. Verify compaction guardrails and handoff output - completed - CRITICAL

**Total Critical Path**: One completed phase-specific execution path

**Parallel Opportunities**:
- Evidence capture and documentation cleanup can happen in parallel once the runtime work is complete.
- Checklist and ADR closeout can proceed after the phase narrative is stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Shared contract defined | Common payload envelope and trust-state model exist | Completed |
| M2 | Lifecycle producers aligned | Startup/resume/health/bootstrap emit shared payloads | Completed |
| M3 | Compaction guardrails active | Anti-feedback filtering and pre-merge metadata verified | Completed |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Use One Shared Payload Contract Before Transport Work

**Status**: Accepted

**Context**: Later phases needed a stable payload/provenance surface before any plugin or graph-ops work could stay thin.

**Decision**: Phase 1 delivers that shared contract first and keeps transport and graph-ops responsibilities out of scope.

**Consequences**:
- Positive: later phases consume one stable contract.
- Negative: imported/rebuilt semantics are forward-compatible rather than fully exercised.

**Alternatives Rejected**:
- Folding this work into another layer: rejected because it would blur the phase boundary.
