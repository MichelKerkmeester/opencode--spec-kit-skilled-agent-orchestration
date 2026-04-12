---
title: "Implementation Plan: Phase 018 — Canonical Continuity Refactor [system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/plan]"
description: "Coordinate the six phase-018 gates from pre-work through permanence decision, using the existing research and resource-map artifacts as the execution baseline."
trigger_phrases:
  - "phase 018 plan"
  - "canonical continuity plan"
  - "six gate plan"
  - "root coordination"
importance_tier: "critical"
contextType: "planning"
feature: "phase-006-canonical-continuity-refactor"
level: 2
status: planned
parent: "026-graph-and-context-optimization"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]

---
# Implementation Plan: Phase 018 — Canonical Continuity Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs, TypeScript MCP/runtime code, shell validation scripts, SQLite-backed memory state |
| **Framework** | `system-spec-kit`, Spec Kit Memory MCP, phase-based packet workflow |
| **Storage** | Root research artifacts, child phase packets, SQLite `memory_index` and `causal_edges`, canonical spec docs |
| **Testing** | Recursive `validate.sh --strict`, gate-local tests and playbooks, rollout telemetry, archive-rate observation |

### Overview
Phase 018 is a coordinated six-gate program, not a single code change. The packet starts by removing preconditions and proving safety (Gate A), establishes the bounded archive and schema foundation (Gate B), then lands the writer substrate (Gate C), reader substrate (Gate D), runtime cutover (Gate E), and the archive permanence decision (Gate F).

The root packet does not replace the child folders. It defines how they fit together, what must be true before each gate begins, and what "phase 018 complete" means at the packet level.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Root `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all describe the same overall goal and gate order.
- [ ] The parent packet cites the actual grounding set that exists in this folder: `implementation-design.md`, `resource-map.md`, `research/research.md`, `scratch/phase-017-rerun-seed.md`, `scratch/verify-phases-review.md`, and `scratch/resource-map/*`.
- [ ] Each child phase remains the owner of gate-level requirements and verification evidence.

### Definition of Done
- [ ] Gates A through F are complete in dependency order, with each child phase closed using its own checklist and evidence.
- [ ] Packet-level recursive validation is green or any residual warnings are understood and documented against live folder truth.
- [ ] The parent packet summary and implementation summary honestly reflect the final state of the six gates and the overall phase-018 outcome.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent coordination packet over six child execution phases

### Key Components
- **Executive design layer**: `implementation-design.md` captures the overall recommendation, components, migration strategy, and gate intent.
- **Execution map layer**: `resource-map.md` and `scratch/resource-map/*` define the actual file surfaces, dependencies, and critical path.
- **Gate execution layer**: `001-gate-a-prework/` through `006-gate-f-archive-permanence/` hold the detailed specs, plans, tasks, and checklists for each gate.
- **Verification layer**: `scratch/verify-phases-review.md` records plan-review findings, while each child phase owns gate-level verification and eventual completion evidence.

### Data Flow
Root research and mapping artifacts define the target state first. The parent packet converts that material into a gate sequence. Each child phase then executes its gate-specific work and verification. Once a gate closes, the parent packet advances the next dependency boundary and eventually records the full packet closeout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Parent Coordination
- [ ] Establish the root packet contract in `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- [ ] Freeze the packet-wide grounding set and phase map so future work resumes from the parent packet cleanly.
- [ ] Keep the parent packet summary-only and defer detailed gate edits to the child folders.

### Phase 2: Foundation Gates
- [ ] Execute Gate A to remove template and packet-prep blockers and prove backup, rollback, and warmup readiness.
- [ ] Execute Gate B to rehearse and land the narrowed schema/archive foundation and make archived-hit observability visible.

### Phase 3: Canonical Continuity Gates
- [ ] Execute Gate C to land the validator and writer substrate for canonical spec-doc continuity.
- [ ] Execute Gate D to retarget search, context, and resume onto handover plus `_memory.continuity`.

### Phase 4: Runtime And Permanence Gates
- [ ] Execute Gate E to move the rollout state machine to canonical and update the broad command, agent, skill, and doc surface.
- [ ] Execute Gate F to evaluate the 180-day archive window and record the permanence decision.

### Phase 5: Packet Closeout
- [ ] Run recursive packet validation and reconcile any residual warnings against live phase status.
- [ ] Refresh the parent `implementation-summary.md` with the real outcome, verification evidence, and final decision state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packet validation | Root docs plus all six child phase folders | `./.opencode/skill/system-spec-kit/scripts/spec/validate.sh <phase-018-root> --recursive --strict` |
| Gate verification | Schema, writer, reader, rollout, and archive-decision proofs | Child-phase tests, telemetry, SQL checks, and manual playbooks |
| Cross-phase integrity | Sequencing, phase status, and packet closeout readiness | Parent packet review plus child checklist state |
| Documentation truth | Root coordination docs stay aligned with live child folders | Diff review and packet-local validation sweeps |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `implementation-design.md` | Internal | Green | Without it, the packet loses the canonical statement of what phase 018 is trying to build. |
| `resource-map.md` + `scratch/resource-map/*` | Internal | Green | Without them, sequencing and surface ownership become guesswork. |
| Gates A -> B -> C -> D -> E -> F | Internal | Yellow | Skipping the order risks invalidating safety, schema, writer, reader, or rollout assumptions. |
| Child-phase verification evidence | Internal | Yellow | The parent packet cannot honestly close without gate-level evidence from the child folders. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A child phase materially changes scope, sequencing, or entry/exit assumptions such that the parent packet is now misleading.
- **Procedure**: Pause packet-level closure, update the parent spec/plan/tasks/checklist to match the new truth, and rerun recursive validation before resuming execution.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Gate A (Pre-work) -> Gate B (Foundation) -> Gate C (Writer Ready)
                                               |
                                               v
Gate F (Permanence) <- Gate E (Runtime Migration) <- Gate D (Reader Ready)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Gate A | Root packet ready | Gate B, packet execution start |
| Gate B | Gate A | Gate C, archive observation start |
| Gate C | Gate B | Gate D, shadow-safe writer proof |
| Gate D | Gate C | Gate E, doc-first reader proof |
| Gate E | Gate D | Gate F, final runtime cutover |
| Gate F | Gate E plus archive observation window | Packet closeout and any permanence follow-up |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Parent coordination | Medium | 0.5-1 day |
| Gate A + Gate B | High | ~3 weeks |
| Gate C + Gate D | High | ~4 weeks |
| Gate E + Gate F | High | ~6 weeks including observation and proving windows |
| **Total** | | **~13 weeks end-to-end, matching the executive design summary** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Packet-level sequencing still matches the six child phases
- [ ] Root packet references only real, existing artifacts
- [ ] Child gate entry criteria are still valid before execution begins

### Rollback Procedure
1. Stop packet progression if a child phase invalidates an upstream assumption.
2. Update the parent packet to match the live gate truth before proceeding.
3. Re-run recursive validation and review residual warnings against actual phase state.
4. Resume only once the parent and child packets agree again.

### Data Reversal
- **Has data migrations?** Yes, but only inside child gates, not in the root coordination packet.
- **Reversal procedure**: Follow the rollback contracts documented in the active child phase, especially Gates A, B, E, and F.
<!-- /ANCHOR:enhanced-rollback -->
