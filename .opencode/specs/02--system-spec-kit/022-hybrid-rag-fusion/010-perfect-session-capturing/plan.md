---
title: "Implementation Plan: Perfect Session Capturing [template:level_3/plan.md]"
description: "Closure remediation plan for the parent spec pack and the remaining child-phase documentation."
trigger_phrases:
  - "implementation plan"
  - "spec 010"
  - "truth reconciliation"
  - "blocker reporting"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Perfect Session Capturing

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TypeScript, shell validation commands |
| **Framework** | system-spec-kit Level 3/Level 2 spec workflow plus sk-doc validation |
| **Storage** | Parent and child spec folders under `.opencode/specs/.../010-perfect-session-capturing` |
| **Testing** | `validate.sh`, `check-completion.sh`, `npm` test lanes, `validate_document.py`, `bash -n`, `shellcheck` |

### Overview

This pass closes the parent spec pack and the remaining child docs to the shipped, verified state; refreshes supporting docs and metadata to current counts; formalizes phased-parent validation support; retains fresh live proof for all five supported CLIs; and re-verifies the executable, documentation, and shell-tooling surfaces so the parent folder can publish a final all-green closure state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Current worker changes reviewed before further edits.
- [x] March 17, 2026 rerun evidence available for scripts, MCP, docs, and phase-targeted lanes.
- [x] Root closure target agreed: publish only the final state once validator, proof, and completion gates all pass.

### Definition of Done
- [x] Parent docs report strict-clean validation and retained five-CLI live proof accurately.
- [x] Phases `004`, `005`, `010`, `011`, and `016` align with shipped evidence and pass their required closeout checks.
- [x] Supporting docs and metadata reflect current counts and validation timestamps.
- [x] Root strict completion passes and root strict recursive validation passes cleanly.
<!-- /ANCHOR:quality-gates -->

---

**AI EXECUTION PROTOCOL**

### Pre-Task Checklist
- [x] Read the current parent and child docs before editing them.
- [x] Separate parent-only blockers from child-phase completion issues.
- [x] Reconfirm executable evidence before publishing updated counts.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope Lock | Limit file edits to the parent pack, the targeted child phases, supporting docs, metadata, and retained scratch helpers only |
| Evidence First | Do not publish a count, status, or claim without a matching rerun or inspected file |
| Truth Alignment | Keep parent claims tied to the latest validator, completion, and retained-proof outputs |
| Proof Discipline | Distinguish green fixture-backed or test-backed coverage from live CLI proof freshness |
| Completion | Run phase-local and parent truth gates before final sign-off |

### Status Reporting Format

`STEP [N]: [status] -> [artifact/result]`

### Blocked Task Protocol
1. Stop when a validation or test result changes the truth model.
2. Record the exact blocker and its command or file evidence.
3. Patch only the minimum scope needed to restore truthful documentation and passing executable lanes.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first closure remediation with validator-backed parent and phase alignment.

### Key Components
- **Parent spec pack**: the six canonical root markdown files.
- **Target child phases**: `004`, `005`, `010`, `011`, and `016`.
- **Supporting docs**: feature catalog and manual testing playbook.
- **Metadata**: `description.json` and aggregated `descriptions.json`.
- **Verification stack**: scripts, MCP, phase-local spec gates, sk-doc validation, and shell hygiene checks.

### Data Flow
Current repo state -> rerun evidence collection -> child doc reconciliation -> parent pack rewrite -> metadata refresh -> memory save closeout -> phase/local truth gates -> final parent summary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Re-baseline
- [x] Re-read the parent pack and the targeted child phases.
- [x] Reconfirm the approved closure target from the re-analysis disposition.
- [x] Rerun the executable and support-doc evidence lanes needed for fresh counts.

### Phase 2: Documentation Reconciliation
- [x] Backfill phase `004` to the real narrow type-consolidation closure.
- [x] Confirm phase `005` is docs/status drift only and reconcile it.
- [x] Backfill phases `010` and `011` from shipped tests and runtime behavior.
- [x] Refresh phase `016` count language and retained live-proof evidence.
- [x] Rewrite the parent pack around the final verified closure state.

### Phase 3: Verification and Closeout
- [x] Run required memory saves for the touched spec folders.
- [x] Rerun strict phase validation and strict completion checks for the touched child phases.
- [x] Rerun parent strict completion and parent strict validation.
- [x] Refresh metadata timestamps after the final markdown state is settled.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Package gates | Shared, scripts, and MCP type/build/lint surfaces | `npm run typecheck`, `npm run check`, `npm run build`, `npm run lint` |
| Scripts regressions | Extractors, module contracts, phase-016 parity lane, phase-010 integration lane, and phase-011 session-source lane | Node suites, Vitest |
| MCP regressions | Focused save-path lane plus full suite | Vitest |
| Spec truth gates | Parent and child validation/completion | `validate.sh`, `check-completion.sh` |
| Supporting docs | Feature catalog and playbook | `validate_document.py` |
| Shell tooling | Retained scratch launchers | `bash -n`, `shellcheck` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `template-structure.js` phased-parent behavior | Internal | Green | Parent strict validation depends on this support remaining intact |
| Child phase code and tests already in repo | Internal | Green | Docs can be reconciled against shipped evidence |
| Supporting docs under `sk-doc` validation | Internal | Green | Counts and manual guidance remain auditable |
| Memory save script | Internal | Green | Phase and parent closeout items cannot be completed without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Documentation changes create new truth drift, break spec gates, or misstate current evidence.
- **Procedure**: Revert only the affected parent or child docs, rerun the same evidence commands, and reapply the minimum truthful reconciliation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. L2: PHASE DEPENDENCIES

```
Evidence Refresh ──► Child Backfill ──► Parent Rewrite ──► Final Gates
         │                                   │
         └────────────► Support Docs ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Re-baseline | None | Child backfill, parent rewrite |
| Child backfill | Re-baseline | Parent rewrite, final gates |
| Parent rewrite | Re-baseline, child backfill | Final gates |
| Final gates | Parent rewrite, child backfill | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Re-baseline | Medium | 1-2 hours |
| Documentation reconciliation | High | 3-5 hours |
| Final gates and metadata | Medium | 1-2 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Parent and child docs were read before modification.
- [x] Fresh verification evidence was rerun locally.
- [x] The phased-parent validator support is verified in both tests and strict recursive validation.

### Rollback Procedure
1. Revert only the changed documentation or metadata files.
2. Re-run the same validation and test commands that backed the published claims.
3. Reapply only the edits needed to restore truthful state alignment.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Metadata timestamp refresh can be safely regenerated after docs are restored.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## 11. L3: DEPENDENCY GRAPH

```
┌────────────────┐     ┌─────────────────┐     ┌────────────────┐
│  Rerun Evidence │────►│ Child Reconcile │────►│ Parent Rewrite  │
└────────────────┘     └────────┬────────┘     └────────┬───────┘
                                 │                         │
                        ┌────────▼────────┐       ┌───────▼────────┐
                        │ Support + JSON  │──────►│ Final Truth Gates│
                        └─────────────────┘       └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Evidence reruns | Existing code/tests | Current counts and proof | All downstream docs |
| Child reconciliation | Evidence reruns | Accurate phase docs | Parent rewrite |
| Parent rewrite | Evidence reruns, child docs | Truthful parent narrative | Final gates |
| Final gates | Child docs, parent rewrite, memory save | Completion evidence | Final summary |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## 12. L3: CRITICAL PATH

1. **Reconfirm the executable baseline** - complete - CRITICAL
2. **Backfill child phases `004`, `005`, `010`, and `011`** - complete - CRITICAL
3. **Rewrite the parent pack around the blocker model** - complete - CRITICAL
4. **Run memory saves and final truth gates** - complete - CRITICAL

**Total Critical Path**: dominated by final spec validation and memory-closeout work.

**Parallel Opportunities**:
- Support-doc validation and shell hygiene can run alongside test lanes.
- Metadata refresh can happen after the final markdown content stabilizes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 13. L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Evidence refresh complete | Current counts verified locally | Phase 1 |
| M2 | Child docs reconciled | Targeted child phases match shipped state | Phase 2 |
| M3 | Parent rewrite complete | Parent docs describe real blockers and green lanes | Phase 2 |
| M4 | Final truth gates complete | Parent strict completion passes and validation blocker is documented with fresh output | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## 14. L3: ARCHITECTURE DECISION RECORD

### ADR-001: Formalize phased-parent validation support instead of hiding the structure

**Status**: Accepted

**Context**: The phased-parent `PHASE DOCUMENTATION MAP` is sanctioned by `create.sh` and the addendum templates, so the correct fix was validator support rather than removing sanctioned structure.

**Decision**: Keep the phase map in place and formalize phased-parent and child addendum support in `template-structure.js`, then close the parent only after strict validation and retained five-CLI proof both pass.

**Consequences**:
- Parent docs can report clean strict validation without deleting sanctioned phase content.
- The parent can claim closure only after both validator and live-proof obligations are satisfied.

**Alternatives Rejected**:
- Delete or flatten the phase-map content just to quiet validation: rejected because it would misrepresent the sanctioned phased-parent structure.
