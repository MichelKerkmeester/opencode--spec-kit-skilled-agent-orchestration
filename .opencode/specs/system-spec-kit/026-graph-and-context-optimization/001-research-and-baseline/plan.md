---
title: "Implementation Plan: Graph and [system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/plan]"
description: "Execution plan for turning the v2 research synthesis into a validated coordination packet and a sequenced set of follow-on adoption packets."
trigger_phrases:
  - "graph context packet plan"
  - "adoption sequencing plan"
  - "recommendation rollback"
  - "follow-on packets"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline"
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Merged single original phase root"
    next_safe_action: "Use context-index.md for local phase navigation"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Graph and Context Systems Master Research Packet

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs, JSON metadata, frozen research deliverables |
| **Framework** | Spec Kit Level 3 coordination packet over a research-only initiative |
| **Storage** | Parent spec docs, child phase docs, `research/` deliverables, `scratch/` summary report |
| **Testing** | `validate.sh --strict`, link integrity checks, metadata and ADR structure checks, alignment verifier for changed scope |

### Overview

This plan has two jobs. First, it keeps the parent packet, canonical root research set, and root support folders synchronized so the research track reads like one finished coordination root instead of an intermediate assembly checkpoint. Second, it preserves the downstream adoption sequence from the v2 recommendations without keeping unfinished follow-on packet openings inside this packet's completion state. A later derivative child packet, `006-research-memory-redundancy`, now extends that continuity-lane follow-on set by clarifying compact-wrapper and canonical-doc ownership assumptions for the packets that follow. [SOURCE: research/research.md:148-199] [SOURCE: research/iterations/q-d-adoption-sequencing.md:13-116]
<!-- /ANCHOR:summary -->

---

### AI Execution Protocol

#### Pre-Task Checklist

- [x] Phase 1 audit loaded and treated as the source of truth for drift items
- [x] Frozen research deliverables kept read-only
- [x] Root packet stays research-only and does not claim runtime rollout
- [x] Child-folder fixes remain inside the audited scope

#### Status Reporting Format

```text
PHASE 2 STATUS: in_progress | complete | needs-fix
ROOT DOCS: <created or pending>
CHILD DRIFT: <fixed count>/<target count>
VALIDATION: clean | warning | failed
NEXT STEP: <next concrete packet action>
```

#### Blocked Task Protocol

1. Record the blocked file or validator rule in `scratch/spec-doc-phase-2-summary.md`.
2. Preserve the frozen research inputs while debugging the packet docs.
3. Resolve structural or citation blockers before claiming packet completion.

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root research deliverables are frozen and cited by path.
- [x] The Phase 1 audit lists the exact root creates and child drift items.
- [x] The parent packet is explicitly research-only, so runtime deployment sections can be rewritten as packet analogs.
- [x] Repo-native `description.json` schema is known from `folder-discovery.ts`.

### Definition of Done
- [x] Seven parent packet docs exist with real content in every section.
- [x] The missing `002-codesight/description.json` exists in the repo-native schema.
- [x] All 15 child drift items from the audit are patched.
- [x] The root research folder uses canonical current files plus `research/archive/` for superseded snapshots.
- [x] Strict validation is warning-only with no integrity errors, and the remaining ADR-anchor warning bucket is documented.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Coordination-root research packet

### Key Components
- **Canonical research layer**: `research/research.md`, `research/recommendations.md`, `research/findings-registry.json`, `research/cross-phase-matrix.md`, `research/deep-research-dashboard.md`, and the archived superseded snapshots under `research/archive/`.
- **Coordination layer**: root `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, and `description.json`.
- **Conformance layer**: the five child folders whose packet docs must align with the Level 3 contract before validation.
- **Follow-on packet layer**: the downstream adoption packets that implement R1, R10, R4, R6, R9, and the other sequenced recommendations.

### Data Flow
The canonical research deliverables supply evidence. The root packet turns that evidence into requirements, sequencing, and ADRs. Child-folder patches restore structural consistency, while the root `research/` archive split keeps the live synthesis distinct from historical snapshots. The validated packet then becomes the handoff surface for downstream follow-on specs that implement the P0 through P3 roadmap without re-litigating the external research. [SOURCE: scratch/spec-doc-audit.md:193-236] [SOURCE: research/research.md:148-199] [SOURCE: research/iterations/q-d-adoption-sequencing.md:99-116]
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet assembly and conformance
- [x] Create the seven parent Level 3 packet documents.
- [x] Add repo-native metadata for the parent and `002-codesight`.
- [x] Patch every audit-listed child drift item, including the ADR-anchor and checklist-order items outside the short task list.
- [x] Write a phase-2 summary report with before and after line counts.

### Phase 2: Root synthesis normalization and support-folder alignment
- [x] Canonicalize the root research filenames and archive superseded top-level snapshots.
- [x] Fold the `002-codesight`, `003-contextador`, `004-graphify`, and `005-claudest` closeout findings into the live synthesis and recommendations.
- [x] Record the derivative `006-research-memory-redundancy` follow-on in the parent visibility surfaces without re-scoring the capability matrix.
- [x] Sync parent packet references, dashboard status, and completion language to the canonical root research set.
- [x] Review root generated-memory artifacts for duplication or staleness and retain manual-edit boundaries where the save workflow owns content. [SOURCE: research/research.md:24-30] [SOURCE: research/recommendations.md:1-12] [SOURCE: research/deep-research-dashboard.md:1-18]

### Phase 3: Validation and completion-truth closeout
- [x] Run strict validation on the parent packet and verify recursive child status.
- [x] Verify superseded top-level research filenames are no longer referenced from the parent packet.
- [x] Confirm the root research folder uses a canonical current-plus-archive layout.
- [x] Update `tasks.md`, `checklist.md`, and `implementation-summary.md` so they reflect the real done state instead of an intermediate packet-opening phase.

### Phase 4: Downstream packet queue preserved from the root
- [ ] Open the follow-on packet for the provisional honest measurement contract.
- [ ] Open the follow-on packet for trust-axis separation and freshness authority before structural packaging.
- [ ] Open the follow-on packet for the shared-payload validator plus AST-versus-regex provenance honesty.
- [ ] Draft the graph-first PreToolUse nudge, guarded startup, dashboard-contract, and evaluation-corpus packets from this root rather than inside it. [SOURCE: research/research.md:151-199] [SOURCE: research/recommendations.md:3-101]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Strict validation | Parent packet plus all five child folders | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
| Link integrity | All child prompt references and related packet links | `rg -n "phase-research-prompt\\.md"` |
| Metadata and ADR structure | `## 1. METADATA` stays present in each affected `spec.md` and repeated ADR anchors remain visible in `decision-record.md` | `rg -n "^## 1\\. METADATA|ANCHOR:adr-"` |
| Plan completeness | Parent packet status, completion truth, and canonical research references | `rg -n "^## L2: ENHANCED ROLLBACK|^## L3: CRITICAL PATH|^## L3: MILESTONES|research-v2|recommendations-v2|findings-registry-v2"` |
| Scope alignment | Changed `.opencode` markdown and JSON files | `python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `scratch/spec-doc-audit.md` | Internal audit | Green | Without it the patch list is incomplete |
| `research/research.md` | Canonical synthesis | Green | Root docs would lose evidence grounding |
| `research/recommendations.md` | Ranked decision source | Green | Recommendation order and verdicts would drift |
| `research/iterations/q-d-adoption-sequencing.md` | Sequencing source | Green | Plan and tasks would lose their dependency order |
| `research/iterations/q-f-killer-combos.md` | Adoption-decision source | Green | ADRs would lose the combo status and falsification basis |
| `research/archive/` | Historical snapshots | Green | Without it the root folder would blur live and superseded deliverables |
| `006-research-memory-redundancy/spec.md` | Derivative follow-on authority | Green | Continuity-lane compact-wrapper guidance would lose its local source |
| `folder-discovery.ts` schema | Repo-native metadata contract | Green | New `description.json` files could drift from discovery logic |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase 3 finds that the new root packet or child-folder conformance work misstates the frozen v2 conclusions, breaks strict validation, or introduces wrong cross-links.
- **Procedure**: Revert the created and patched packet docs to the last known good commit, restore the child folders to their prior document state, and preserve the frozen research deliverables untouched. Then re-run the audit against the reverted packet and re-apply only the verified changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Packet assembly ───────► P0 foundation packets ───────► P1 conditional adapters ───────► P2/P3 contract work
        │                         │                                │                               │
        └──────── child drift fixes ───────────────► validation handoff ─────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Packet assembly | Frozen research deliverables, audit | Child conformance, validation handoff |
| Child conformance | Packet assembly | Strict validation, follow-on packet opening |
| P0 foundation packets | Validated coordination root | P1 adapters, P2/P3 contract work |
| P1 adapters | P0 measurement and trust contracts | Warm-start experiments, dashboard publication |
| P2/P3 contract work | P0 and P1 contracts | Any structural packaging or monolithic orchestration revisits |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Packet assembly and drift repair | Medium | 1 focused documentation phase |
| P0 foundation packet opening | Medium | 3 to 5 downstream packets |
| P1 adapter packet opening | Medium | 3 to 4 downstream packets |
| P2/P3 hold and revisit work | High | Deferred until contract prerequisites land |
| **Total** |  | **One validation cycle now, followed by a staged packet program** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Frozen research inputs confirmed unchanged.
- [x] Child-folder drift list captured from the audit before editing.
- [x] Recommendation ordering preserved from `research/recommendations.md`.

### Rollback Procedure
1. Revert the parent packet docs and child-folder patches if Phase 3 detects structural or citation drift.
2. Re-run the audit on the reverted packet to confirm the delta returned to the known baseline.
3. Re-apply only the fixes whose evidence and path targets are confirmed.
4. Mark any reverted downstream recommendation packet as superseded so it does not inherit stale packet guidance.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. This phase changes packet docs and metadata only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
research.md + recommendations.md + q-d + q-f
                    │
                    ▼
     canonical root research + root packet docs
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
 child drift repairs      archive + metadata sync
         └──────────┬──────────┘
                    ▼
            strict validation
                    │
                    ▼
      downstream packet queue preserved
                    │
                    ▼
        P0/P1 adapters and later P2/P3 holds
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Root packet docs | Frozen research deliverables | Packet requirements, plan, tasks, ADRs | Validation, packet opening |
| Child conformance fixes | Audit drift list | Level 3 structural consistency | Validation |
| Validation handoff | Root docs + child fixes | Clean Phase 3 target | P0 packet launch |
| P0 packet cluster | Validated coordination root | Measurement, trust, payload, and detector contracts | P1 adapters |
| P1 adapter cluster | P0 contracts | Guarded startup and routing improvements | P2/P3 revisits |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Create and sync the parent packet docs** - complete - CRITICAL
2. **Repair every audit-listed child drift item** - complete - CRITICAL
3. **Normalize root research into canonical current plus archive layout** - complete - CRITICAL
4. **Pass strict validation in a warning-only or better state** - complete - CRITICAL

**Total Critical Path**: root packet creation -> conformance repair -> root research normalization -> validation handoff

**Parallel Opportunities**:
- Cross-reference verification, archive cleanup, and completion-truth doc sync can move in parallel once the canonical research files are settled.
- The eventual P0 follow-on packets can split into measurement, trust, and payload sub-packets after this packet's validation handoff.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Root packet created | Seven parent docs plus parent metadata exist | Complete |
| M2 | Child conformance restored | 15 audit-listed drift items patched | Complete |
| M3 | Root support folders normalized | Canonical research files live at root and superseded snapshots live under `research/archive/` | Complete |
| M4 | Validation handoff ready | Strict validation is warning-only with no integrity errors, and downstream queue remains explicit | Complete |
<!-- /ANCHOR:milestones -->

---

### Architecture Decision Summary

#### ADR-001: Publish an honest measurement contract before any multiplier

**Status**: Accepted

**Context**: The v2 packet found repeated precision laundering across metrics and reporting surfaces.

**Decision**: Treat exact versus estimated reporting as the first gate on any savings language.

**Consequences**:
- Public avoids freezing misleading ratio language too early.
- Later dashboard work must carry uncertainty labels instead of inventing certainty.

**Alternatives Rejected**:
- Skip the contract and wait for perfect observability.
- Keep the v1 wording and accept headline ambiguity.

#### ADR-002: Front-load P0 seam hardening before adapters or packaging

**Status**: Accepted

**Context**: The roadmap and cost-reality pass both showed that measurement, trust, and boundary contracts unblock more work than early packaging.

**Decision**: Open the P0 cluster first, then conditional adapters, then contract-heavy or speculative work.

**Consequences**:
- The first packet wave stays inside or near existing owner surfaces.
- Artifact-default packaging and monolithic orchestration remain deferred until their prerequisites exist.
