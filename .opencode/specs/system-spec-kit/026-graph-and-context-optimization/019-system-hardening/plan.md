---
title: "Implementation Plan: System Hardening (Post-Consolidation Research + Remediation Train)"
description: "Coordination plan for 019-system-hardening: dispatch the Tier 1 research wave via 001-initial-research, consolidate findings, then spawn implementation children (002+)."
trigger_phrases:
  - "019 parent plan"
  - "system hardening plan"
  - "019 research wave coordination"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening"
    last_updated_at: "2026-04-18T17:15:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded alongside spec.md"
    next_safe_action: "Approve and dispatch 001-initial-research"
    key_files: ["plan.md"]

---
# Implementation Plan: System Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs + skill-owned command dispatch (TypeScript/YAML behind the scenes) |
| **Framework** | Spec Kit Level 3 umbrella packet |
| **Storage** | Packet docs plus `research/019-system-hardening-001-initial-research/` research tree |
| **Testing** | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |

### Overview

This plan coordinates the post-026-consolidation hardening wave. The six Tier 1 candidates from `../scratch/deep-review-research-suggestions.md` (DR-1, RR-1, RR-2, SSK-RR-1, SSK-DR-1, SSK-RR-2) are dispatched through `001-initial-research` using the canonical `/spec_kit:deep-research :confirm` and `/spec_kit:deep-review :confirm` commands. After research converges, the findings registry drives the creation of implementation children (`019/002-*`, `019/003-*`, ...).

The umbrella packet itself does not run iterations directly; it coordinates dispatch order, tracks convergence, and enforces the research-first rule that gates implementation children behind research completion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] `../scratch/deep-review-research-suggestions.md` exists and names the six Tier 1 candidates.
- [x] 018 is shipped with PASS verdict (R1-R11, R12 deferred).
- [x] 026 root spec reserves room for phase 19 in the phase map.
- [ ] User approval on charter (this spec + plan).

### Definition of Done

- [ ] `001-initial-research` converges across all six Tier 1 iterations.
- [ ] Findings registry written to `001-initial-research/implementation-summary.md §Findings Registry`.
- [ ] Implementation children (`019/002-*`, ...) created for every remediation cluster OR explicitly deferred with reason.
- [ ] Umbrella packet `validate.sh --strict` passes.
- [ ] 026 root docs updated to reflect 019 as a completed phase.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Re-read `../scratch/deep-review-research-suggestions.md` before dispatching any iteration.
- Confirm Gate 4 compliance: every iteration uses `/spec_kit:deep-research :confirm` or `/spec_kit:deep-review :confirm`, never a direct agent invocation.
- Record the scratch-doc revision hash in the 001 research spec so later changes can be reconciled.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-001 | Umbrella packet contains coordination only; implementation lives in children | Matches the packet's charter and keeps cross-cluster concerns visible |
| AI-SCOPE-002 | No `019/002-*` or later sibling is created before 001 research converges | Research-first ordering per REQ-002 |
| AI-DISPATCH-001 | Every iteration goes through the skill-owned command surface | Gate 4 HARD-block; preserves state machine, convergence, audit |
| AI-SYNC-001 | 026 root docs are updated only after umbrella packet validates cleanly | Prevents half-shipped root references |
| AI-REGISTRY-001 | Findings registry classifies every finding with severity + proposed remediation cluster + defer reason if applicable | Enables automated scope extraction for implementation children |

### Status Reporting Format

- Start state: which Tier 1 iteration is being dispatched and its scratch-doc dispatch-block text
- Work state: iteration count + convergence signal per iteration
- End state: findings registry summary (total findings, clusters, deferred)

### Blocked Task Protocol

1. If a Tier 1 iteration exceeds its iteration budget without convergence, pause and request user decision (extend budget / narrow scope / defer).
2. If research surfaces a P0 data-integrity finding, interrupt the wave and dispatch a hotfix child before continuing.
3. If the scratch doc is modified mid-wave, reconcile explicitly in the 001 research spec before adopting the change.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Coordination-only umbrella packet with a single research child and reserved implementation children.

### Key Components

- **Umbrella coordination layer**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
- **Research child**: `001-initial-research/` — runs the six Tier 1 iterations
- **Research output tree**: `../research/019-system-hardening-001-initial-research/` — iteration files, findings registry, convergence artifacts
- **Implementation children (reserved)**: `019/002-*`, `019/003-*`, ... — one per remediation cluster
- **Verification layer**: strict packet validation across umbrella + children

### Data Flow

1. Umbrella packet enumerates Tier 1 candidates (source: scratch doc).
2. `001-initial-research` dispatches each candidate via canonical command.
3. Iterations write to the `../research/019-system-hardening-001-initial-research/iterations/` directory (one iteration-NNN markdown file per round).
4. Convergence produces the findings registry in `001-initial-research/implementation-summary.md`.
5. Umbrella packet creates implementation children per remediation cluster.
6. Root 026 docs are updated to reflect 019's completion state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Packet scaffolded from scratch doc Tier 1 candidates.
- [ ] User approval on charter.
- [ ] 026 root docs provisionally updated to list 019 as a planned phase.
- [ ] `001-initial-research/` child packet spec approved.

### Phase 2: Core Implementation (Research Wave)

- [ ] Dispatch DR-1 delta-review of 015 findings.
- [ ] Dispatch RR-1 Q4 NFKC robustness research.
- [ ] Dispatch RR-2 description.json regen strategy research.
- [ ] Dispatch SSK-RR-1 Gate 3 + skill-advisor routing accuracy research.
- [ ] Dispatch SSK-DR-1 template v2.2 + validator joint audit.
- [ ] Dispatch SSK-RR-2 canonical-save pipeline invariant research.
- [ ] Consolidate findings into `001-initial-research/implementation-summary.md §Findings Registry`.

### Phase 3: Verification + Follow-On Planning

- [ ] Run strict validation on umbrella + 001 child.
- [ ] Approve implementation-child layout.
- [ ] Create `019/002-*` (and later `003-*`, ...) for each remediation cluster.
- [ ] Update 026 root docs with 019's completion state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | Umbrella + 001 child | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh 019-system-hardening --strict` |
| Convergence check | Each Tier 1 iteration | Skill-owned YAML state machine (`deep-research-state.jsonl`, `deep-review-state.jsonl`) |
| Findings registry audit | `001-initial-research/implementation-summary.md §Findings Registry` | Manual review + optional `findings-registry.json` schema check |
| Root-sync drift check | 026 root docs reference 019 correctly | `rg -n "019-system-hardening\|phase 19" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/{spec,plan,tasks,checklist,decision-record,implementation-summary}.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../scratch/deep-review-research-suggestions.md` | Internal | Green | Without the scratch doc, the Tier 1 candidate set is undefined |
| `/spec_kit:deep-research :confirm` command | Internal | Green | Gate 4 mandates canonical dispatch; no workaround |
| `/spec_kit:deep-review :confirm` command | Internal | Green | Gate 4 mandates canonical dispatch; no workaround |
| 018-cli-executor-remediation shipped state | Internal | Green (PASS verdict) | R1-R11 shipped; Tier 1 candidates are grounded in current main |
| Spec validator | Internal | Green | Required for quality-gate proofs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Charter rejected, research fails to converge broadly, or a P0 finding demands work elsewhere.
- **Procedure**: Revert root-doc references to 019. Leave the umbrella + 001 packet scaffolded for future re-use — do not delete unless the user explicitly requests it. If partial research converged, preserve the findings registry under the `scratch/` folder with a date-stamped slug (for example a 019-partial-findings entry stamped with the current YYYY-MM) before rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Charter approval
        |
        v
001-initial-research dispatch (6 Tier 1 items)
        |
        v
Findings registry convergence
        |
        v
Implementation children planned + created
        |
        v
Root 026 docs updated with 019 completion
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Charter approval | Research wave |
| Core Implementation | Setup | Verification, implementation children |
| Verification + Follow-On | Core Implementation | Root-doc updates |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 day |
| Core Implementation (6 iterations) | Medium-High | 6-9 days wall clock (parallel dispatch where possible) |
| Verification + Follow-On Planning | Medium | 1 day |
| **Total** |  | **~8-11 days wall clock for the research wave** |

Implementation-child effort is deferred; each child carries its own estimate.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Scratch doc verified as the single source of truth
- [x] Gate 4 compliance plan recorded in AI execution rules
- [ ] User approval captured

### Rollback Procedure
1. Revert `../spec.md`, `../implementation-summary.md`, and `../graph-metadata.json` references to 019.
2. If research partially converged, save the findings registry to a date-stamped file in the `scratch/` folder (e.g. `019-partial-findings-2026-MM-DD` slug).
3. Leave the 019 packet directory in place for future reactivation unless explicitly asked to delete.
4. Revalidate 026 root packet.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Docs only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
scratch doc (scratch/deep-review-research-suggestions.md)
       |
       v
umbrella spec + plan (this packet)
       |
       v
001-initial-research
       |
       +--> 6 parallel iterations via /spec_kit:deep-{research,review}
       |
       v
findings registry
       |
       v
implementation children (019/002-*, 019/003-*, ...)
       |
       v
root 026 sync
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `spec.md` | Scratch doc Tier 1 selection | Umbrella charter | `plan.md`, `tasks.md`, `001-initial-research` |
| `plan.md` | `spec.md` | Coordination plan | `tasks.md`, `checklist.md` |
| `001-initial-research` | Approved charter | Findings registry | Implementation children |
| Implementation children | Findings registry | Remediation scope | Root 026 completion |
| Root 026 sync | Umbrella completion | Updated root phase map | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Charter approval** — short — CRITICAL
2. **Dispatch 6 Tier 1 iterations via canonical commands** — medium — CRITICAL
3. **Convergence + findings registry** — medium — CRITICAL
4. **Plan + create implementation children** — medium — NON-BLOCKING (proceed per cluster)
5. **Root 026 sync** — short — CRITICAL

**Total Critical Path**: approximately 8-11 days wall clock for the research wave; implementation children scheduled per cluster.

**Parallel Opportunities**:
- Multiple Tier 1 iterations can dispatch in parallel (subject to compute and Copilot 3-concurrent cap).
- Umbrella packet validation and findings registry review can proceed while late iterations finish.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Charter approved | User sign-off on umbrella packet + 001 child spec | Within first session |
| M2 | Research wave dispatched | All 6 Tier 1 iterations in flight or queued | Within first session |
| M3 | Convergence | All 6 iterations reach convergence or documented defer | 8-11 days |
| M4 | Findings registry complete | Registry cites every finding with severity + cluster + proposed remediation | At convergence |
| M5 | Implementation children created | Per-cluster 019/00N-* packets scaffolded | After M4 |
| M6 | Umbrella closeout | Umbrella packet + children validate cleanly; root 026 docs updated | After implementation children ship |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Research-first ordering

**Status**: Accepted

**Context**: The scratch doc lists six Tier 1 candidates, several of which (RR-1 NFKC, SSK-RR-2 canonical-save) could surface data-integrity issues that invalidate speculative implementation scope.

**Decision**: No implementation child is created until 001 research converges. The charter enforces this structurally.

**Consequences**: Implementation work is delayed by ~8-11 days. Every implementation child's scope is grounded in evidence rather than speculation.

**Alternatives Rejected**: Parallel research + implementation (rejected because speculative implementation risks duplicating research-confirmed fixes).

### ADR-002: Cluster-per-child layout

**Status**: Accepted

**Context**: Six Tier 1 items could produce anywhere from 10 to 50+ distinct findings. Mapping 1:1 to implementation children would fragment the packet tree; mapping all to one giant child would block partial ships.

**Decision**: Each implementation child represents one remediation cluster (a group of findings that share files, invariants, or waveform). Clusters are derived by the research wave, not predeclared.

**Consequences**: Child count is flexible. Findings registry must explicitly name each cluster.

**Alternatives Rejected**: (a) One implementation child per Tier 1 candidate — too coarse; some candidates produce zero findings. (b) One implementation child per finding — too fragmented; tests and files span findings.
