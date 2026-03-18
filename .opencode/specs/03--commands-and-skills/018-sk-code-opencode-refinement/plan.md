---
title: "Implementation Plan: sk-code--opencode refinement"
description: "Execution plan for refining sk-code--opencode policy language and checklists based on completed spec and research artifacts. The plan sequences implementation, verification, and closure with a mandatory global quality sweep across all changed files."
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "sk-code--opencode refinement"
  - "global quality sweep"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: sk-code--opencode refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + all addendums | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown standards docs, shell-based verification commands |
| **Framework** | system-spec-kit Level 3+ workflow |
| **Storage** | Repository docs under `.opencode/skill/` and spec artifacts under `.opencode/specs/` |
| **Testing** | `rg` policy assertions, spec validation script, mandatory global quality sweep protocol |

### Overview
This implementation applies the approved 043 policy refinements to `sk-code--opencode` and optional bounded alignment updates to `sk-code--review` only when mismatch evidence exists. The plan keeps numbered ALL-CAPS section headers stable, tightens inline comment guidance to parse-oriented semantics, hardens KISS/DRY plus SOLID checks, and closes through a mandatory global quality sweep before completion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and fixed scope are documented in `spec.md`.
- [x] Research synthesis and implementation recommendations are complete in `research.md` and `scratch/*.md`.
- [x] Scope lock is clear for target files in `sk-code--opencode` and conditional optional `sk-code--review` files.

### Definition of Done
- [ ] All P0 requirements `REQ-001` through `REQ-006` from `spec.md` are met.
- [ ] `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `global-quality-sweep.md` stay synchronized with execution reality.
- [ ] Mandatory global quality sweep is executed for all changed files with unresolved defects `P0=0` and `P1=0`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Governance-first documentation refactor with deterministic verification and closure gating.

### Key Components
- **Policy Core Workstream**: Updates `sk-code--opencode/SKILL.md` and shared references to enforce reduced inline-comment policy plus AI-oriented semantics.
- **Language Alignment Workstream**: Applies consistent guidance across JS, TS, Python, Shell, and Config style guides.
- **Checklist Hardening Workstream**: Adds explicit KISS/DRY and SOLID gates to universal and language checklists.
- **Optional Review Alignment Workstream**: Applies minimal, evidence-driven updates to `sk-code--review` only if baseline-overlay mismatch is detected.
- **Global Quality Sweep Workstream**: Runs required closure protocol across every changed file before completion claim.

### Data Flow
1. Inputs from `spec.md`, `research.md`, and `scratch/*.md` define mandatory requirements and boundaries.
2. Decision record locks policy tradeoffs so implementation text remains consistent.
3. File edits are executed in dependency order: shared policy, language guides, checklists, optional review files.
4. Verification commands produce evidence for checklist items and quality sweep table.
5. Closure gate confirms mandatory sweep completion and defect-zero threshold for P0/P1.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation and Baseline Freeze
- [x] Confirm analysis completion from existing `spec.md`, `research.md`, and `scratch/*.md` artifacts.
- [ ] Freeze in-scope file list from `spec.md` Section 3 to prevent scope drift.
- [ ] Capture pre-change baseline snippets for comment policy, header conventions, and checklist principle coverage.

### Phase 2: Core Policy Implementation (`sk-code--opencode`)
- [ ] Update `.opencode/skill/sk-code--opencode/SKILL.md` with reduced inline-comment policy and AI-oriented semantics.
- [ ] Update `.opencode/skill/sk-code--opencode/references/shared/universal_patterns.md` with parse-first comment allowlist.
- [ ] Preserve and reinforce numbered ALL-CAPS section header conventions in `.opencode/skill/sk-code--opencode/references/shared/code_organization.md`.
- [ ] Align language style guides for `javascript`, `typescript`, `python`, `shell`, and `config` with shared policy.

### Phase 3: Checklist and Optional Alignment Implementation
- [ ] Update universal and language checklist files in `.opencode/skill/sk-code--opencode/assets/checklists/` with KISS/DRY and SOLID coverage depth.
- [ ] Decide on optional `sk-code--review` scope using mismatch evidence from verification pre-check.
- [ ] If triggered, apply minimal updates to `.opencode/skill/sk-code--review/SKILL.md` and targeted review references only.

### Phase 4: Verification and Evidence Collection
- [ ] Run file-level verification command set in Section 5 for every changed file.
- [ ] Record command outputs and defect counts in the quality sweep evidence table.
- [ ] Update `checklist.md` evidence slots for all P0 and P1 items.

### Phase 5: Mandatory Global Quality Sweep and Closure
- [ ] Execute all required steps in `global-quality-sweep.md`.
- [ ] Confirm closure gate thresholds (`P0=0`, `P1=0`) and document owner/status.
- [ ] Final sync check across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Policy assertions | Comment threshold, AI semantics markers, header invariants | `rg` |
| Checklist assertions | KISS/DRY/SOLID markers in universal and language checklists | `rg` |
| Scope guard | Changed-file scope stays inside spec-defined paths | `git diff --name-only`, manual compare against `spec.md` scope table |
| Spec artifact validation | Level 3+ docs are structurally valid and placeholder-free | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` |

### File-Level Verification Command Set

```bash
# 1) Scope files changed in implementation
rg --files .opencode/skill/sk-code--opencode \
  .opencode/skill/sk-code--review > /tmp/043-scope-files.txt

# 2) Reduced comment policy and AI semantics markers
rg -n "Maximum 3 comments per 10 lines|WHY|GUARD|INVARIANT|REQ-|BUG-|SEC-|RISK|PERF" \
  .opencode/skill/sk-code--opencode/SKILL.md \
  .opencode/skill/sk-code--opencode/references/shared/universal_patterns.md \
  .opencode/skill/sk-code--opencode/references/javascript/style_guide.md \
  .opencode/skill/sk-code--opencode/references/typescript/style_guide.md \
  .opencode/skill/sk-code--opencode/references/python/style_guide.md \
  .opencode/skill/sk-code--opencode/references/shell/style_guide.md \
  .opencode/skill/sk-code--opencode/references/config/style_guide.md

# 3) Numbered ALL-CAPS header non-regression checks
rg -n "^## [0-9]+\\. [A-Z0-9 ()/:-]+$" \
  .opencode/skill/sk-code--opencode/references/shared/code_organization.md \
  .opencode/skill/sk-code--opencode/references/javascript/style_guide.md \
  .opencode/skill/sk-code--opencode/references/typescript/style_guide.md \
  .opencode/skill/sk-code--opencode/references/python/style_guide.md \
  .opencode/skill/sk-code--opencode/references/shell/style_guide.md \
  .opencode/skill/sk-code--opencode/references/config/style_guide.md

# 4) KISS/DRY/SOLID checklist coverage
rg -n "KISS|DRY|SRP|OCP|LSP|ISP|DIP" \
  .opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md \
  .opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md \
  .opencode/skill/sk-code--opencode/assets/checklists/typescript_checklist.md \
  .opencode/skill/sk-code--opencode/assets/checklists/python_checklist.md \
  .opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md \
  .opencode/skill/sk-code--opencode/assets/checklists/config_checklist.md

# 5) Optional review alignment checks (run only if review files changed)
rg -n "KISS|DRY|SOLID|module|adapter|interface|abstraction|responsibility|dependency|boundary" \
  .opencode/skill/sk-code--review/SKILL.md \
  .opencode/skill/sk-code--review/references/quick_reference.md \
  .opencode/skill/sk-code--review/references/code_quality_checklist.md \
  .opencode/skill/sk-code--review/references/solid_checklist.md
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `spec.md` requirements and scope table | Internal | Green | Implementation cannot proceed without strict scope lock |
| `research.md` recommendations and evidence | Internal | Green | Policy deltas risk drifting from validated findings |
| `scratch/*.md` analysis artifacts | Internal | Green | Tradeoff decisions lose provenance and acceptance mapping |
| Existing `sk-code--opencode` file structure | Internal | Green | Cross-language consistency updates become non-deterministic |
| Optional `sk-code--review` baseline resources | Internal | Green | Conditional alignment phase cannot execute if trigger is met |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verification command failures, header-invariant regressions, scope drift, or unresolved P0/P1 defects during mandatory quality sweep.
- **Procedure**:
1. Revert only the offending scoped file edits.
2. Re-run file-level verification commands for the reverted file group.
3. Re-apply minimal corrective edits aligned to decision record.
4. Re-run mandatory global quality sweep gate checks before closure.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preparation) -> Phase 2 (Core Policy) -> Phase 3 (Checklist/Optional Review)
                                 \                                  /
                                  -> Phase 4 (Verification) -> Phase 5 (Global Sweep)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preparation | Existing analysis artifacts | Core Policy, Checklist/Optional Review |
| Core Policy | Preparation | Checklist/Optional Review, Verification |
| Checklist/Optional Review | Core Policy | Verification |
| Verification | Core Policy, Checklist/Optional Review | Global Sweep |
| Global Sweep | Verification | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | 30-45 minutes |
| Core Policy Implementation | High | 2-3 hours |
| Checklist and Optional Review Alignment | Medium | 1-2 hours |
| Verification | Medium | 45-75 minutes |
| Mandatory Global Quality Sweep and Closure | Medium | 45-60 minutes |
| **Total** | | **5-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline snapshots captured for all scoped files before implementation.
- [ ] Verification command set prepared and executable in repository root.
- [ ] Scope lock list visible in tasks before first implementation edit.

### Rollback Procedure
1. Stop at first failing gate and log defect in quality sweep table.
2. Revert only the smallest file group required to clear the failing gate.
3. Re-run related verification commands for that file group.
4. Continue only after updated evidence confirms gate clearance.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Documentation-only rollback via scoped file restoration and re-verification.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ Phase 1 Preparation  │
└───────────┬──────────┘
            v
┌──────────────────────┐
│ Phase 2 Core Policy  │
└───────┬─────────┬────┘
        v         v
┌──────────────┐ ┌──────────────────────┐
│ Checklist    │ │ Optional Review      │
│ Hardening    │ │ Alignment (Conditional)
└───────┬──────┘ └───────────┬──────────┘
        └──────────┬─────────┘
                   v
         ┌────────────────────┐
         │ Phase 4 Verification│
         └──────────┬─────────┘
                    v
         ┌────────────────────┐
         │ Phase 5 Global Sweep│
         └────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Policy Core updates | Preparation | Shared policy contract | Checklist hardening, verification |
| Language guide alignment | Policy Core updates | Cross-language consistency | Verification |
| Checklist hardening | Policy Core updates | KISS/DRY/SOLID enforceable gates | Global sweep |
| Optional review alignment | Verification pre-check mismatch | Baseline-overlay alignment | Closure when triggered |
| Global quality sweep | All prior workstreams | Closure decision and defect status | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Freeze scope and baseline assertions** - 30 minutes - CRITICAL
2. **Implement shared comment/header policy** - 90 minutes - CRITICAL
3. **Align language style guides and checklists** - 120 minutes - CRITICAL
4. **Execute verification command set** - 45 minutes - CRITICAL
5. **Complete mandatory global quality sweep** - 45 minutes - CRITICAL

**Total Critical Path**: ~5.5 hours

**Parallel Opportunities**:
- Language style guide edits can run in parallel by file group after shared policy text lands.
- Optional `sk-code--review` alignment can run in parallel with checklist hardening only after mismatch trigger is confirmed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Scope and baseline frozen | Phase 1 complete and logged | Start of implementation |
| M2 | Core policy updates complete | Shared and language guides updated to new contract | End of Phase 2 |
| M3 | Checklist hardening complete | KISS/DRY/SOLID checks present in all required checklists | End of Phase 3 |
| M4 | Verification complete | File-level command set passes with evidence | End of Phase 4 |
| M5 | Closure gate satisfied | Mandatory global quality sweep complete, `P0=0`, `P1=0` | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Inline Comment Policy and AI Semantics Contract

**Status**: Accepted

**Context**: Existing policy allows comment density that is too permissive for machine parsing quality.

**Decision**: Enforce a stricter threshold with parse-oriented comment categories and explicit non-regression header rules.

**Consequences**:
- Improves deterministic policy interpretation across languages.
- Requires careful wording updates across multiple files to prevent drift.

**Alternatives Rejected**:
- Keep current threshold and only tweak examples: rejected because it does not enforce measurable policy change.

See `decision-record.md` for full ADR set and tradeoffs.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: `spec.md`, `research.md`, `scratch/*.md`, `decision-record.md`
**Duration**: ~45 minutes
**Agent**: Primary only (leaf constraint, no nested dispatch)

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Primary | Policy Core | `sk-code--opencode/SKILL.md`, shared references |
| Primary | Language Alignment | `references/javascript|typescript|python|shell|config/style_guide.md` |
| Primary | Checklist Hardening | `assets/checklists/*.md` + optional review references |

**Duration**: ~2.5 hours

### Tier 3: Integration
**Agent**: Primary
**Task**: Merge updates, execute verification commands, run global quality sweep, and synchronize spec docs.
**Duration**: ~90 minutes

### Pre-Task Checklist
- Confirm active task ID and owning phase in `tasks.md`.
- Confirm scope lock against `spec.md` section 3 before file edits.
- Confirm matching ADR constraints in `decision-record.md`.
- Confirm verification command coverage exists for target file set.

### Task Execution Rules
| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| TASK-SEQ | Execute tasks in dependency order | No implementation task starts before Phase 1 setup is complete |
| TASK-SCOPE | Edit only scoped files from `spec.md` | Reject unrelated file changes |
| TASK-VERIFY | Run command checks before phase completion | Phase cannot close without evidence update |
| TASK-SWEEP | Global quality sweep is mandatory for closure | Completion blocked until sweep gate is satisfied |

### Status Reporting Format
- **Status Reporting**: `Phase <N> | Task <ID> | State <Pending/In Progress/Done/Blocked> | Evidence <command/artifact>`
- Example: `Phase 4 | T041 | Done | rg header invariant command logged in EVT-001`.

### Blocked Task Protocol
1. Mark task as `[B]` in `tasks.md` with blocker reason.
2. Record blocker severity in `global-quality-sweep.md` defect log.
3. Stop dependent tasks until blocker is cleared or explicitly deferred.
4. Re-run affected verification commands after unblock and update evidence.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W1 | Prior-work continuity lock | Primary | `spec.md`, `research.md`, `scratch/*.md` | Active |
| W2 | Shared policy and header invariants | Primary | `sk-code--opencode/SKILL.md`, shared references | Planned |
| W3 | Language style guide alignment | Primary | JS/TS/Python/Shell/Config style guides | Planned |
| W4 | Checklist hardening | Primary | Universal + language checklists | Planned |
| W5 | Optional review alignment | Primary | `sk-code--review` scoped files | Conditional |
| W6 | Mandatory global quality sweep | Primary | `global-quality-sweep.md`, `checklist.md` evidence rows | Planned |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W2 complete | Primary | Shared policy text frozen |
| SYNC-002 | W3 and W4 complete | Primary | Verification command set execution |
| SYNC-003 | W6 complete | Primary | Closure gate decision |

### File Ownership Rules
- Each scoped file is edited by one active workstream at a time.
- Cross-workstream text dependencies require sync before verification.
- Optional review files are touched only if W5 trigger condition is met.
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per phase**: Update task status in `tasks.md`.
- **Per verification run**: Record evidence status in `checklist.md` and `global-quality-sweep.md`.
- **On blocker**: Stop execution and document defect severity plus owner.

### Escalation Path
1. Scope ambiguity -> align against `spec.md` scope table before proceeding.
2. Conflicting policy interpretation -> resolve using `decision-record.md` ADR precedence.
3. Verification failure -> rollback affected files and re-run targeted command set.
<!-- /ANCHOR:communication -->
