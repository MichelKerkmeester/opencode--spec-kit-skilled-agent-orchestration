---
title: "Implementati [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/003-code-graph-operations-hardening/plan]"
description: "This phase delivered the graph-operations hardening contract that sits below the transport shell. The Level 3 plan records how readiness, repair, portability, and preview rules were shipped without replacing the graph backend."
trigger_phrases:
  - "code graph operations hardening plan"
  - "packet 030"
  - "level 3"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/003-code-graph-operations-hardening"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Code Graph Operations Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime helpers, session handlers, Vitest, Markdown |
| **Framework** | Packet 024 compact code graph runtime and session surfaces |
| **Storage** | Existing code graph and runtime surfaces remain the substrate |
| **Testing** | Typecheck plus targeted graph-ops and session-surface tests |

### Overview
This phase delivered the graph-operations hardening contract that sits below the transport shell. The Level 3 plan records how readiness, repair, portability, and preview rules were shipped without replacing the graph backend.
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
Operational hardening layer below transport

### Key Components
- **Readiness model**: unifies stale/ready/missing semantics
- **Doctor surface**: adds integrity checks and repair expectations
- **Export/import model**: defines portable identity and post-import repair
- **Preview safety layer**: restricts non-text artifacts to metadata-only previews

### Data Flow
Graph/runtime state is assessed for readiness, optionally paired with repair guidance, and prepared for safe portability or inspection. These flows operate beneath the transport layer rather than through it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Runtime Inventory
- [x] Inventory existing readiness and health surfaces
- [x] Inventory current path-identity assumptions

### Phase 2: Hardening Design
- [x] Define doctor/repair scope
- [x] Define export/import boundaries
- [x] Define preview safety behavior

### Phase 3: Verification
- [x] Verify helper and session-surface coverage
- [x] Verify the transport boundary remains intact
- [x] Record packet-local closeout evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type Safety | Graph-ops helper and handler wiring compile cleanly | `npm run typecheck` |
| Runtime Tests | Graph-ops helper and session-facing outputs stay green | `npx vitest run tests/code-graph-ops-hardening.vitest.ts tests/session-resume.vitest.ts tests/session-bootstrap.vitest.ts tests/structural-contract.vitest.ts` |
<!-- /ANCHOR:testing -->

---

### AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm the transport shell is treated as a fixed predecessor.
- Confirm graph-ops claims come from the existing Phase 3 implementation summary.
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
| Phase 2 adapter boundary | Internal | Green | Ops work may bleed into transport if it moves |
| Parent research synthesis | Internal | Green | Ops priorities may drift |
| Existing graph/runtime health surfaces | Internal | Green | Hardening would lose its real integration points |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Documentation drifts from the shipped runtime scope or validation fails.
- **Procedure**: Move transport concerns back to Phase 2 and keep backend durability in a separate out-of-packet track.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Runtime Inventory ──► Hardening Design ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Runtime Inventory | Phase 2 complete | Hardening Design |
| Hardening Design | Runtime Inventory | Verification |
| Verification | Hardening Design | Phase 4 startup parity |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Runtime Inventory | Medium | Completed in runtime code |
| Hardening Design | Medium | Completed in runtime code |
| Verification | Medium | Completed with targeted session-surface checks |
| **Total** |  | **Phase 3 complete** |
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
Graph State ──► Graph Ops Helper ──► Session Health/Resume/Bootstrap
Transport Shell ───────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Graph State | Existing graph index and health signals | Normalized readiness and repair guidance | Session surfaces |
| Graph Ops Helper | Graph state | Portable identity and safe preview rules | Session surfaces |
| Session Surfaces | Graph ops output | Runtime recovery guidance | Phase 4 startup parity |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Normalize readiness and repair guidance - completed - CRITICAL
2. Wire graphOps output into session surfaces - completed - CRITICAL
3. Verify graph-ops tests and structural contract coverage - completed - CRITICAL

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
| M1 | Hardening helper defined | One reusable graph-ops contract exists | Completed |
| M2 | Session surfaces aligned | Health, resume, and bootstrap emit `graphOps` data | Completed |
| M3 | Hardening verified | Targeted graph-ops and structural tests passed | Completed |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Harden Graph Operations Below the Transport Shell

**Status**: Accepted

**Context**: The packet needed stronger graph readiness and portability guidance, but the transport plugin could not become the place where that logic lived.

**Decision**: Phase 3 ships one helper and one contract below the transport shell and above future operational tools.

**Consequences**:
- Positive: session surfaces now share the same graph-ops language.
- Negative: future dedicated doctor/export/import tools still need a follow-on packet.

**Alternatives Rejected**:
- Folding this work into another layer: rejected because it would blur the phase boundary.
