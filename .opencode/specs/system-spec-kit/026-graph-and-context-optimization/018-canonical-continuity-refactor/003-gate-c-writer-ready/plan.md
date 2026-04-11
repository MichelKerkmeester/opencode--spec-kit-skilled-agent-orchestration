---
title: "Gate C — Writer Ready"
description: "Implementation plan for the Gate C writer-critical path: validator bridge, routed save modules, template rollout, and shadow-only proving."
trigger_phrases:
  - "gate c"
  - "writer ready"
  - "plan"
  - "canonical continuity"
  - "shadow only"
importance_tier: "critical"
contextType: "implementation"
level: "3+"
gate: "C"
parent: "018-canonical-continuity-refactor"
---
# Implementation Plan: Gate C — Writer Ready

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, Shell, Markdown templates |
| **Framework** | Spec Kit Memory MCP + script wrappers |
| **Storage** | SQLite (`memory_index`, feature-flag tables) + canonical spec docs |
| **Testing** | Vitest/unit fixtures, integration fixtures, golden-set parity, shadow reducers |

### Overview
Gate C ships the writer-side substrate that phase 018 has been designing since iteration 001. The plan follows the dependency chain from rows B1/C1/C10/C11/D1: freeze the validator contract, build the router and merge engine, replace `atomicSaveMemory` with `atomicIndexMemory`, rewrite `memory-save.ts`, refactor `generate-context.ts`, roll `_memory.continuity` into templates, then prove the result under `S1 shadow_only` with the iter 029/032/033/034 evidence model.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Parent packet grounding is cited across all Gate C docs (`implementation-design`, resource-map, iterations 001-005, 021-024, 029, 031-034, 038).
- [ ] Gate B closure is treated as immutable input: schema, archive flip, and ranking are not reopened.
- [ ] Workstream ownership is explicit for validator, writer core, template rollout, and shadow telemetry.

### Definition of Done
- [ ] Four new components land with >80 percent unit coverage and the 243-test catalog is green.
- [ ] `memory-save.ts` rewrite, `generate-context.ts` parity, and template continuity rollout all pass targeted regression.
- [ ] `shadow_only` stays healthy for the required window with >=95 percent parity, zero fingerprint rollback, and recorded sign-off.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Strangler-style refactor inside the existing save pipeline.

### Key Components
- **`spec-doc-structure.ts`**: fail-closed rule engine for the five new writer rules plus `ANCHORS_VALID` ordering (iter 022, rows C11/D1).
- **`contentRouter`**: Tier 1 rules, Tier 2 prototypes, Tier 3 strict JSON fallback for the eight categories (iters 002, 021, 031).
- **`anchorMergeOperation`**: five canonical merge modes under the existing folder mutex (iters 003, 023; row C10).
- **`atomicIndexMemory`**: atomic index commit that replaces file-creation assumptions without changing the concurrency envelope (row B1).
- **Adapted carriers**: `memory-save.ts`, `generate-context.ts`, `create-record`, `dedup`, `post-insert`, `types`, `tool-input-schemas`, and template surfaces.

### Data Flow
`/memory:save` enters `generate-context.ts`, normalizes payloads, and hands them to the new writer path. `contentRouter` classifies chunks, `anchorMergeOperation` mutates only the legal target region, `atomicIndexMemory` persists the resulting canonical payload, and post-insert/shadow telemetry emit parity evidence without changing reader behavior yet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract Freeze
- [ ] Build `spec-doc-structure.ts`, wire rule aliases into `validate.sh`, and freeze the iter 022/024 failure-code contract.
- [ ] Add `AtomicIndex*` types and save-schema fields (`route-as`, merge hints, continuity metadata) before touching the XL writer.

### Phase 2: Writer Core
- [ ] Implement `contentRouter`, `anchorMergeOperation`, and `atomicIndexMemory`.
- [ ] Rewrite `memory-save.ts` around the new modules while preserving `withSpecFolderLock` and the documented pass-through stages.
- [ ] Adapt save helpers, trigger handling, causal-link processing, and quality gating to doc-anchor identity.

### Phase 3: Template And Script Rollout
- [ ] Refactor `generate-context.ts` to the routed writer.
- [ ] Add `_memory.continuity` to all level templates and keep the 14-field, <=2048-byte contract intact.
- [ ] Keep packet-local docs, rule help text, and runtime-facing contract language synchronized.

### Phase 4: Shadow Proving
- [ ] Activate `S1 shadow_only` through the iter 034 control plane.
- [ ] Run the 243-test catalog, golden-set parity, and routing-audit reducers.
- [ ] Hold the proving window long enough to clear Gate C exit criteria and hand off cleanly to Gate D.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Router categories, merge modes, continuity validator, `atomicIndexMemory` contracts | Vitest + fixture docs |
| Integration | `memory-save.ts`, `generate-context.ts`, save helpers, feature-flag plumbing | MCP/runtime integration tests |
| Golden Set | Shadow compare across `resume`, search classes, causal graph, triggers | Golden fixtures + reducer replay |
| Regression | 13 preserved feature scenarios from prior packets | Packet regression suite |
| Manual | Rollback drill, dashboard review, shadow-only observation window | Runbooks + dashboards |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../implementation-design.md` | Internal design | Green | Scope and component boundaries become ambiguous |
| `../scratch/resource-map/02-handlers.md` | Internal audit | Green | The pass-through/adapt/rewrite split for `memory-save.ts` becomes guesswork |
| `../scratch/resource-map/03-scripts.md` + `nested-changelog.ts` | Internal pattern | Green | Merge/read-transform-write design loses its proven reference |
| `../scratch/resource-map/04-templates.md` | Internal audit | Green | Template/frontmatter rollout can miss required files or anchor defects |
| Iter 021/031 prototype + LLM contracts | Internal research | Green | Router behavior drifts from the approved 3-tier classifier |
| Iter 032/033/034 shadow + flag contracts | Internal rollout | Green | Gate C cannot prove parity or rollback safety |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any `validator.rollback.fingerprint` event, `trigger_match` miss, resume severe breach, or `search.shadow.diff` correctness-loss mismatch while the new writer is active.
- **Procedure**: force the rollout back to the safe state from iter 034 (`S1 -> S0`, `S2 -> S1`, `S3 -> S2`, `S4 -> S3`), restore the pre-merge snapshot when fingerprint verification fails, and keep legacy serving authoritative until the incident is closed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Contract Freeze ───────┐
                       ├──► Writer Core ───► Template And Script Rollout ───► Shadow Proving
Gate B Closure ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract Freeze | Gate B closure, parent packet research | Writer Core |
| Writer Core | Contract Freeze | Template rollout, shadow proving |
| Template And Script Rollout | Writer Core | Shadow proving |
| Shadow Proving | Writer Core, template rollout | Gate C close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract Freeze | High | 2 days |
| Writer Core | Very High | 5 days |
| Template And Script Rollout | High | 3 days |
| Shadow Proving | High | 4 days including observation time |
| **Total** | | **~2 weeks wall clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup or snapshot path proven for canonical docs and SQLite control-plane tables
- [ ] `canonical_continuity_rollout` state machine reachable from the runtime
- [ ] Routing/shadow dashboards and alert routes live

### Rollback Procedure
1. Move the flag to the fallback bucket defined by iter 034.
2. Stop accepting new canonical writes if fingerprint rollback or shadow correctness is red.
3. Re-run the failing fixture or sampled traffic class to confirm the rollback restored stable behavior.
4. Record the incident, owner, and cooldown window before any re-promotion attempt.

### Data Reversal
- **Has data migrations?** Only Gate B schema work, already complete
- **Reversal procedure**: Gate C reverses by state-machine demotion plus canonical-doc snapshot restore, not by new schema rollback
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│ Contract Freeze      │────►│ Writer Core          │────►│ Template Rollout     │
│ validator + schemas  │     │ router/merge/index   │     │ generator + templates│
└──────────┬───────────┘     └──────────┬───────────┘     └──────────┬───────────┘
           │                             │                              │
           └─────────────────────────────┴──────────────►┌──────────────▼──────────────┐
                                                         │ Shadow Proving + Gate Close │
                                                         └──────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `spec-doc-structure.ts` + schemas | Parent packet rule contracts | Validator bridge + failure codes | Router/merge integration |
| `contentRouter` + prototypes | Iter 002/021/031 | Routed chunk decisions | `memory-save.ts`, shadow audit |
| `anchorMergeOperation` + `atomicIndexMemory` | Iter 003/023 + row B1 | Canonical write engine | `memory-save.ts`, generator refactor |
| Template rollout + generator refactor | Writer core | Canonical packet surfaces | Shadow proving |
| Shadow reducers + control plane | Iter 032/033/034/038 | Gate C evidence | Gate close / Gate D handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Freeze validator, continuity, and schema contracts** - ~2 days - CRITICAL
2. **Land router + merge + atomic index modules** - ~3 days - CRITICAL
3. **Rewrite `memory-save.ts` and refactor `generate-context.ts`** - ~2 days - CRITICAL
4. **Run parity, shadow, and rollback proving** - ~4 days including hold time - CRITICAL

**Total Critical Path**: ~11 delivery days inside a 2-week gate window

**Parallel Opportunities**:
- Template continuity rollout and save-helper adaptation can run alongside the core writer implementation after Phase 1.
- Routing audit/dashboards can be prepared while the XL writer rewrite is under active development.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contract Freeze | Validator order, failure codes, types, and schema fields approved | Start of week 1 |
| M2 | Writer Core Landed | Router, merge, atomic index, and `memory-save.ts` rewrite compile and test | Mid week 1 |
| M3 | Template + Generator Alignment | `generate-context.ts` and all continuity templates updated | End of week 1 |
| M4 | Gate C Proof Pack | 243 tests green, >=95% parity, `shadow_only` stable, sign-off ready | End of week 2 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001 through ADR-005

**Status**: Proposed for implementation with this gate

**Context**: Gate C only closes if the new writer boundaries, Tier 3 classifier contract, validator rule ordering, flag state machine, and `_memory.continuity` schema are frozen before the XL rewrite begins.

**Decision**: Keep those decisions in `decision-record.md` and treat them as implementation constraints, not optional guidance.

**Consequences**:
- The writer refactor has a narrow contract to build against.
- Late design churn becomes a packet change request, not an in-flight surprise.

**Alternatives Rejected**:
- Re-litigate design during implementation: rejected because it would blur the critical path and break governance traceability.

---


---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: `spec.md`, `plan.md`, `decision-record.md`
**Duration**: 1 planning pass
**Agent**: Primary/speckit

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Workstream A | Validator + schema | `spec-doc-structure.ts`, `validate.sh`, `tool-input-schemas.ts` |
| Workstream B | Writer core | `content-router.ts`, `anchor-merge-operation.ts`, `atomic-index-memory.ts`, `memory-save.ts` |
| Workstream C | Templates + generator | `generate-context.ts`, `templates/level_*/*.md`, save adapters |
| Workstream D | Telemetry + proving | feature flags, shadow compare, routing audit, parity fixtures |

### Tier 3: Integration
**Agent**: Primary + reviewers
**Task**: Merge workstreams, rerun targeted verification, and prepare Gate C sign-off
**Duration**: Final proving window plus packet closeout
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Validator contract | Validation lead | Validator bridge, rule aliases, schemas | Planned |
| W-B | Writer core | Runtime lead | Router, merge, atomic index, `memory-save.ts` | Planned |
| W-C | Template/generator rollout | Documentation/runtime pairing | Templates, `generate-context.ts`, save helpers | Planned |
| W-D | Shadow proving | QA/on-call | Reducers, dashboards, parity fixtures, flag controls | Planned |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A and W-B compile on the same contract | Validator + runtime leads | Frozen writer interfaces |
| SYNC-002 | W-B and W-C green on shared fixtures | Runtime + docs pairing | Canonical writer candidate |
| SYNC-003 | W-D completes parity and rollback proof | All gate owners | Gate C close recommendation |

### File Ownership Rules
- `memory-save.ts` stays owned by W-B; no other workstream edits it without sync approval.
- Template/frontmatter changes stay owned by W-C and must not silently alter validator expectations.
- Flag/reducer/dashboard surfaces stay owned by W-D and only change through the approved telemetry contract.
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Daily**: update task state and blockers in `tasks.md`
- **Per Milestone**: record sync output against M1-M4
- **Blocking Incident**: page on-call and annotate the packet immediately

### Escalation Path
1. Validator or merge safety blocker -> validation lead + runtime lead
2. Scope or gate interpretation blocker -> packet owner
3. Rollback or parity breach -> on-call then incident commander per iter 034
<!-- /ANCHOR:communication -->

---

<!--
LEVEL 3+ PLAN (~260 lines)
- Core + L2 + L3 + L3+ addendums
- AI execution framework, workstream coordination
- Full communication plan
-->
