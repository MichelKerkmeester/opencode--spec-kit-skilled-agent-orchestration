---
title: "Task [system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/tasks]"
description: "CF-mapped remediation tasks for the Integrity Parity Closure packet."
trigger_phrases:
  - "tasks integrity parity closure"
  - "026 007 006 tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure"
    last_updated_at: "2026-04-23T21:53:25Z"
    last_updated_by: "codex"
    recent_action: "Mapped P0 and top-seven P1 findings into phase tasks"
    next_safe_action: "Start T-002 through T-009 in Phase 1"
    completion_pct: 5
    status: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Ledger: Integrity Parity Closure
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P0/P1/P2]` | Priority |
| `[CF]` | Cross-phase finding reference |
<!-- /ANCHOR:notation -->

---
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-002 [P0] CF-002 live acceptance reruns prepared
- [ ] T-003 [P0] CF-005 lock-order remediation scoped
- [ ] T-004 [P0] CF-009 staged persistence unification scoped
- [ ] T-006 [P0] CF-017 release-vocabulary normalization scoped
- [ ] T-007 [P0] CF-019 threshold-order fix scoped
- [ ] T-008 [P0] CF-022 closure path decided
- [ ] T-009 [P0] CF-025 executor metadata and failure-event remediation scoped

### Plan Phase 1: P0 correctness fixes

| ID | Task | Priority | Rationale |
|----|------|----------|-----------|
| T-002 | Rerun the blocked memory-index and code-graph acceptance flows in a live-capable runtime and only promote readiness claims after the reruns are recorded in packet docs. | P0 | CF-002; phases 001 and 010; closes the still-open operational proof gate. |
| T-003 | Move canonical merge preparation under the folder lock, or regenerate the merge inside the locked section before any promoted write occurs. | P0 | CF-005; phase 002; removes the live save-loss defect. |
| T-004 | Extract one staged persistence helper and force both ensure-ready refreshes and manual scans through the same commit path. | P0 | CF-009; phases 001 and 003; restores one freshness-safe persistence contract. |
| T-006 | Normalize the playbook, runner, and packet-level result-class vocabulary before using the wrapper as a release gate. | P0 | CF-017; phase 005; makes release evidence and gating semantics agree again. |
| T-007 | Recompute passes_threshold after all score and uncertainty mutators run, or derive pass/fail only once at the very end of recommendation assembly. | P0 | CF-019; phase 006; prevents conflicting skills from remaining marked as passing. |
| T-008 | Create a write-authorized follow-up that can edit the historical source packets needed by CF-108, or formally defer the blocker with an ADR if those packets are intentionally immutable. | P0 | CF-022; phase 007; closes the live blocker or records an explicit governance decision. |
| T-009 | Write executor metadata into the first canonical non-native iteration record and emit typed timeout or dispatch-failure events before validator and recovery logic runs. | P0 | CF-025; phase 008; makes non-native executor flows stop failing by contract. |
<!-- /ANCHOR:phase-1 -->

---
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-001 [P0] CF-001 root packet state model refreshed
- [ ] T-005 [P0] CF-014 artifact-root contract unified
- [ ] T-010 [P1] CF-003 live routing telemetry path completed
- [ ] T-011 [P1] CF-004 Copilot parity work reapplied
- [ ] T-012 [P1] CF-006 resume contract unified
- [ ] T-013 [P1] CF-007 save/index hard contracts added
- [ ] T-014 [P1] CF-010 trust metadata centralized
- [ ] T-015 [P1] CF-011 schemas and handlers aligned
- [ ] T-016 [P1] CF-012 stale-file refresh and debounce tightened

### Plan Phase 2: P0 architecture fixes

| ID | Task | Priority | Rationale |
|----|------|----------|-----------|
| T-001 | Refresh the root packet state model so it distinguishes implemented, narrowed, reopened, and still-open work, and separate research convergence from operational acceptance. | P0 | CF-001; phase 001; fixes the stale roadmap model that can mis-sequence follow-on work. |
| T-005 | Pick one artifact-root contract for child phases and route prompts, state, deltas, and synthesis through the same canonical location. | P0 | CF-014; phase 004; removes split artifact authority in deep-loop runs. |

### Plan Phase 3: P1 parity/governance fixes

| ID | Task | Priority | Rationale |
|----|------|----------|-----------|
| T-010 | Finish the blocked live-routing measurement path, record real wrapper telemetry, and make readiness claims depend on live measurement rather than predictive counters alone. | P1 | CF-003; phases 001 and 006; converts routing proof from predictive to operational evidence. |
| T-011 | Reapply the reverted Copilot wrapper and writer wiring, then rebuild the 007 backlog so it tracks the actual 009 parity map rather than the frozen cleanup packet. | P1 | CF-004; phases 001, 007, and 009; repairs the main cross-runtime parity drift. |
| T-012 | Choose one resume contract, implement it end-to-end, and update the Gate D and Gate E packet docs and tests to match the shipped selection logic. | P1 | CF-006; phase 002; aligns resume runtime truth with tests and docs. |
| T-013 | Promote the save/index guardrails from convention to hard contract by adding interprocess coordination or explicit limits, replacing fromScan with an internal-only wrapper, and covering routed plus scoped regressions. | P1 | CF-007; phases 002 and 010; hardens the integrity guardrails behind save and index flows. |
| T-014 | Route all trust metadata through one provenance mapping layer and make query, context, startup, and docs consume the same emitted values. | P1 | CF-010; phases 001 and 003; creates one code-graph trust vocabulary. |
| T-015 | Bring the code-graph schemas into parity with the handler interfaces, or intentionally narrow the handlers and remove the dead fields. | P1 | CF-011; phase 003; restores schema and handler parity. |
| T-016 | Add a direct stale-file refresh path and key readiness debounce entries by root and scan options so unrelated requests cannot reuse the same freshness decision. | P1 | CF-012; phase 003; removes refresh overreach and debounce cross-talk. |
<!-- /ANCHOR:phase-2 -->

---
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-017 [P2] parent graph metadata updated in sorted order
- [ ] T-018 [P2] strict packet validation recorded
- [ ] T-019 [P2] live verification bundle attached

### Plan Phase 4: verification + graph metadata

| ID | Task | Priority | Rationale |
|----|------|----------|-----------|
| T-017 | Update `007-deep-review-remediation/graph-metadata.json` so `children_ids` and `migration.child_phase_folders` include this packet id in sorted order. | P2 | SC-004; Phase 4 closure; makes the new remediation packet discoverable from its parent. |
| T-018 | Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh [spec_folder] --strict` and capture the result in packet evidence. | P2 | SC-001 and SC-004; Phase 4 closure; enforces packet-level documentation integrity. |
| T-019 | Run live verification for the scan, index, routing, wrapper, and executor claims closed by this packet and attach evidence before promoting status. | P2 | SC-003; Phase 4 closure; keeps completion tied to operational proof. |
<!-- /ANCHOR:phase-3 -->

---
<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T-001 through T-016 implementation tasks are complete or explicitly deferred with rationale.
- [ ] T-017 through T-019 verification tasks are complete.
- [ ] No readiness claim is promoted without evidence.
<!-- /ANCHOR:completion -->

---
<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
